import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CanvasElement {
  id: string;
  type: string;
  content?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: Record<string, any>;
  metadata?: Record<string, any>;
}

interface CanvasLink {
  id: string;
  from_object_id: string;
  to_object_id: string;
  style?: Record<string, any>;
  label?: string;
}

interface MappingResult {
  type: 'project' | 'phase' | 'task' | 'dependency' | 'skipped';
  sourceId: string;
  sourceType: string;
  targetData?: Record<string, any>;
  confidence: number;
  reason: string;
  suggestions?: string[];
}

interface WF01Request {
  elements: CanvasElement[];
  links: CanvasLink[];
  boardId: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { elements, links, boardId, userId }: WF01Request = await req.json();

    console.log(`WF-01 Processing ${elements.length} elements and ${links.length} links`);

    // Step 1: Analyze and categorize elements
    const mappingResults: MappingResult[] = [];
    const elementMap = new Map<string, CanvasElement>();
    
    // Build element map for quick lookup
    elements.forEach(element => elementMap.set(element.id, element));

    // Step 2: Map Frame elements to Project Phases
    const frames = elements.filter(el => el.type === 'frame' || el.metadata?.smartElementType === 'Frame');
    for (const frame of frames) {
      const phaseData = mapFrameToPhase(frame, elements, links);
      mappingResults.push({
        type: 'phase',
        sourceId: frame.id,
        sourceType: frame.type,
        targetData: phaseData,
        confidence: calculateConfidence(frame, 'phase'),
        reason: `Frame "${frame.content || 'Unnamed'}" mapped to project phase`,
        suggestions: generatePhaseSuggestions(frame, elements)
      });
    }

    // Step 3: Map Sticky elements to Tasks
    const stickies = elements.filter(el => 
      el.type === 'sticky' || 
      el.metadata?.smartElementType === 'StickyNote' ||
      (el.type === 'text' && isTaskLike(el.content || ''))
    );
    
    for (const sticky of stickies) {
      const taskData = mapStickyToTask(sticky, elements, links);
      mappingResults.push({
        type: 'task',
        sourceId: sticky.id,
        sourceType: sticky.type,
        targetData: taskData,
        confidence: calculateConfidence(sticky, 'task'),
        reason: `Sticky note mapped to task: "${taskData.title}"`,
        suggestions: generateTaskSuggestions(sticky)
      });
    }

    // Step 4: Map Links to Dependencies
    for (const link of links) {
      const fromElement = elementMap.get(link.from_object_id);
      const toElement = elementMap.get(link.to_object_id);
      
      if (fromElement && toElement) {
        const dependencyData = mapLinkToDependency(link, fromElement, toElement);
        mappingResults.push({
          type: 'dependency',
          sourceId: link.id,
          sourceType: 'link',
          targetData: dependencyData,
          confidence: calculateConfidence(link, 'dependency'),
          reason: `Connection from ${fromElement.content || fromElement.type} to ${toElement.content || toElement.type}`,
          suggestions: []
        });
      }
    }

    // Step 5: Handle unmapped elements
    const mappedIds = new Set(mappingResults.map(r => r.sourceId));
    const unmappedElements = elements.filter(el => !mappedIds.has(el.id));
    
    for (const element of unmappedElements) {
      mappingResults.push({
        type: 'skipped',
        sourceId: element.id,
        sourceType: element.type,
        confidence: 0,
        reason: `Element type "${element.type}" not supported for project mapping`,
        suggestions: getSkipSuggestions(element)
      });
    }

    // Step 6: Generate project structure
    const projectStructure = generateProjectStructure(mappingResults, boardId);

    // Step 7: Calculate success metrics
    const totalElements = elements.length + links.length;
    const mappedCount = mappingResults.filter(r => r.type !== 'skipped').length;
    const successRate = (mappedCount / totalElements) * 100;

    const response = {
      success: true,
      mappingResults,
      projectStructure,
      statistics: {
        totalElements,
        mappedElements: mappedCount,
        skippedElements: totalElements - mappedCount,
        successRate: Math.round(successRate * 100) / 100,
        breakdown: {
          phases: mappingResults.filter(r => r.type === 'phase').length,
          tasks: mappingResults.filter(r => r.type === 'task').length,
          dependencies: mappingResults.filter(r => r.type === 'dependency').length,
          skipped: mappingResults.filter(r => r.type === 'skipped').length
        }
      },
      recommendations: generateRecommendations(mappingResults, successRate)
    };

    console.log(`WF-01 Complete: ${successRate}% success rate (${mappedCount}/${totalElements})`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WF-01 Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      mappingResults: [],
      statistics: { totalElements: 0, mappedElements: 0, skippedElements: 0, successRate: 0 }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper Functions

function mapFrameToPhase(frame: CanvasElement, allElements: CanvasElement[], links: CanvasLink[]): any {
  const childElements = findChildElements(frame, allElements);
  
  return {
    name: frame.content || `Phase ${frame.id.slice(-4)}`,
    description: frame.metadata?.description || `Generated from frame element`,
    status: 'planning' as const,
    order_index: calculatePhaseOrder(frame, allElements),
    estimated_duration: estimatePhaseTimeFromChildren(childElements),
    metadata: {
      sourceElementId: frame.id,
      position: frame.position,
      childCount: childElements.length
    }
  };
}

function mapStickyToTask(sticky: CanvasElement, allElements: CanvasElement[], links: CanvasLink[]): any {
  const content = sticky.content || '';
  const priority = extractPriority(content);
  const status = extractStatus(content);
  const timeEstimate = extractTimeEstimate(content);
  
  return {
    title: cleanTaskTitle(content),
    description: extractTaskDescription(content),
    priority: mapToSupraPriority(priority),
    status: mapToSupraStatus(status),
    estimated_hours: timeEstimate,
    metadata: {
      sourceElementId: sticky.id,
      position: sticky.position,
      originalContent: content,
      extractedInfo: { priority, status, timeEstimate }
    }
  };
}

function mapLinkToDependency(link: CanvasLink, fromElement: CanvasElement, toElement: CanvasElement): any {
  return {
    type: 'blocks' as const,
    description: link.label || `${fromElement.content || fromElement.type} → ${toElement.content || toElement.type}`,
    metadata: {
      sourceLinkId: link.id,
      fromElementId: fromElement.id,
      toElementId: toElement.id,
      linkStyle: link.style
    }
  };
}

function isTaskLike(content: string): boolean {
  const taskKeywords = ['مهمة', 'task', 'todo', 'عمل', 'تنفيذ', 'إنجاز', 'تطوير'];
  const lowerContent = content.toLowerCase();
  return taskKeywords.some(keyword => lowerContent.includes(keyword));
}

function extractPriority(content: string): string {
  const priorityPatterns = {
    'عالي': /عالي|مرتفع|عاجل|هام/i,
    'متوسط': /متوسط|عادي|طبيعي/i,
    'منخفض': /منخفض|قليل|مؤجل/i,
    'high': /high|urgent|critical/i,
    'medium': /medium|normal/i,
    'low': /low|minor/i
  };

  for (const [priority, pattern] of Object.entries(priorityPatterns)) {
    if (pattern.test(content)) {
      return priority;
    }
  }
  return 'medium';
}

function extractStatus(content: string): string {
  const statusPatterns = {
    'مكتمل': /مكتمل|منجز|انتهى|done|complete/i,
    'جاري': /جاري|قيد التنفيذ|يعمل|in progress|doing/i,
    'مخطط': /مخطط|جديد|لم يبدأ|planned|todo|new/i
  };

  for (const [status, pattern] of Object.entries(statusPatterns)) {
    if (pattern.test(content)) {
      return status;
    }
  }
  return 'مخطط';
}

function extractTimeEstimate(content: string): number {
  const timePattern = /(\d+)\s*(ساعة|hours?|يوم|days?|أسبوع|weeks?)/i;
  const match = content.match(timePattern);
  
  if (match) {
    const number = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.includes('ساعة') || unit.includes('hour')) return number;
    if (unit.includes('يوم') || unit.includes('day')) return number * 8;
    if (unit.includes('أسبوع') || unit.includes('week')) return number * 40;
  }
  
  return Math.max(1, Math.min(8, content.length / 10)); // Estimate based on content length
}

function mapToSupraPriority(extracted: string): 'low' | 'medium' | 'high' {
  if (['عالي', 'high'].includes(extracted)) return 'high';
  if (['منخفض', 'low'].includes(extracted)) return 'low';
  return 'medium';
}

function mapToSupraStatus(extracted: string): 'todo' | 'in_progress' | 'completed' {
  if (['مكتمل'].includes(extracted)) return 'completed';
  if (['جاري'].includes(extracted)) return 'in_progress';
  return 'todo';
}

function cleanTaskTitle(content: string): string {
  // Remove priority/status indicators and clean up
  return content
    .replace(/\b(عالي|متوسط|منخفض|high|medium|low|مكتمل|جاري|مخطط)\b/gi, '')
    .replace(/\s*[-:]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100) || 'مهمة بدون عنوان';
}

function extractTaskDescription(content: string): string {
  const title = cleanTaskTitle(content);
  if (content.length > title.length + 20) {
    return content.replace(title, '').trim();
  }
  return '';
}

function findChildElements(frame: CanvasElement, allElements: CanvasElement[]): CanvasElement[] {
  const frameBounds = {
    left: frame.position.x,
    right: frame.position.x + frame.size.width,
    top: frame.position.y,
    bottom: frame.position.y + frame.size.height
  };

  return allElements.filter(element => {
    if (element.id === frame.id) return false;
    
    const elBounds = {
      left: element.position.x,
      right: element.position.x + element.size.width,
      top: element.position.y,
      bottom: element.position.y + element.size.height
    };

    return (
      elBounds.left >= frameBounds.left &&
      elBounds.right <= frameBounds.right &&
      elBounds.top >= frameBounds.top &&
      elBounds.bottom <= frameBounds.bottom
    );
  });
}

function calculatePhaseOrder(frame: CanvasElement, allElements: CanvasElement[]): number {
  const frames = allElements.filter(el => el.type === 'frame');
  const sortedFrames = frames.sort((a, b) => a.position.x - b.position.x);
  return sortedFrames.findIndex(f => f.id === frame.id) + 1;
}

function estimatePhaseTimeFromChildren(children: CanvasElement[]): number {
  return Math.max(40, children.length * 8); // Minimum 1 week, 8 hours per child element
}

function calculateConfidence(element: any, targetType: string): number {
  let confidence = 0.5; // Base confidence

  if (targetType === 'phase' && element.type === 'frame') confidence += 0.3;
  if (targetType === 'task' && element.type === 'sticky') confidence += 0.2;
  if (element.content && element.content.length > 5) confidence += 0.2;
  if (element.metadata?.description) confidence += 0.1;

  return Math.min(1, confidence);
}

function generatePhaseSuggestions(frame: CanvasElement, allElements: CanvasElement[]): string[] {
  const suggestions = [];
  const children = findChildElements(frame, allElements);
  
  if (children.length === 0) {
    suggestions.push('إضافة مهام للمرحلة');
  }
  if (!frame.content || frame.content.length < 5) {
    suggestions.push('تحسين اسم المرحلة');
  }
  
  return suggestions;
}

function generateTaskSuggestions(sticky: CanvasElement): string[] {
  const suggestions = [];
  const content = sticky.content || '';
  
  if (!extractPriority(content)) suggestions.push('تحديد الأولوية');
  if (!extractTimeEstimate(content)) suggestions.push('تقدير الوقت المطلوب');
  if (content.length < 10) suggestions.push('إضافة تفاصيل أكثر');
  
  return suggestions;
}

function getSkipSuggestions(element: CanvasElement): string[] {
  const suggestions = [];
  
  if (element.type === 'image') {
    suggestions.push('يمكن إضافته كمرفق للمشروع');
  } else if (element.type === 'line' || element.type === 'arrow') {
    suggestions.push('تحويل إلى رابط بين العناصر');
  }
  
  return suggestions;
}

function generateProjectStructure(mappingResults: MappingResult[], boardId: string): any {
  const phases = mappingResults.filter(r => r.type === 'phase');
  const tasks = mappingResults.filter(r => r.type === 'task');
  const dependencies = mappingResults.filter(r => r.type === 'dependency');

  return {
    project: {
      name: `مشروع مولد من اللوح ${boardId.slice(-8)}`,
      description: 'مشروع تم إنشاؤه تلقائياً من عناصر اللوح باستخدام WF-01',
      status: 'planning',
      metadata: {
        sourceBoard: boardId,
        generatedAt: new Date().toISOString(),
        wf01Version: '1.0'
      }
    },
    phases: phases.map(p => p.targetData),
    tasks: tasks.map(t => t.targetData),
    dependencies: dependencies.map(d => d.targetData)
  };
}

function generateRecommendations(mappingResults: MappingResult[], successRate: number): string[] {
  const recommendations = [];
  
  if (successRate < 70) {
    recommendations.push('معدل النجاح منخفض - استخدم المزيد من إطارات العمل والملاحظات اللاصقة');
  }
  
  const skipped = mappingResults.filter(r => r.type === 'skipped').length;
  if (skipped > 5) {
    recommendations.push(`${skipped} عنصر تم تجاهله - راجع العناصر المدعومة`);
  }
  
  const lowConfidence = mappingResults.filter(r => r.confidence < 0.6).length;
  if (lowConfidence > 3) {
    recommendations.push('بعض التطبيقات غير مؤكدة - راجع النتائج قبل التطبيق');
  }
  
  return recommendations;
}