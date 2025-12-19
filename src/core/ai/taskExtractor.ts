/**
 * Task Extractor - Sprint 8
 * استخراج المهام من المستندات
 */

export interface ExtractedTask {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags: string[];
}

/**
 * استخراج المهام من النص
 */
export function extractTasksFromText(text: string): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // البحث عن أنماط المهام
    const taskPatterns = [
      /^[-*•]\s*(.+)/,                    // قوائم نقطية
      /^\d+[.)]\s*(.+)/,                  // قوائم مرقمة
      /^TODO:\s*(.+)/i,                   // TODO
      /^مهمة:\s*(.+)/,                    // مهمة بالعربية
      /^\[\s*\]\s*(.+)/,                  // checkbox فارغ
    ];
    
    for (const pattern of taskPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const taskText = match[1].trim();
        const task = parseTaskDetails(taskText);
        tasks.push(task);
        break;
      }
    }
  }
  
  return tasks;
}

/**
 * تحليل تفاصيل المهمة
 */
function parseTaskDetails(text: string): ExtractedTask {
  let title = text;
  let priority: ExtractedTask['priority'] = 'medium';
  const tags: string[] = [];
  let assignee: string | undefined;
  let dueDate: string | undefined;
  
  // استخراج الأولوية
  if (/عاجل|urgent|!!/i.test(text)) {
    priority = 'high';
    title = title.replace(/عاجل|urgent|!!/gi, '').trim();
  } else if (/منخفض|low/i.test(text)) {
    priority = 'low';
  }
  
  // استخراج الوسوم #tag
  const tagMatches = text.match(/#(\w+)/g);
  if (tagMatches) {
    tagMatches.forEach(tag => {
      tags.push(tag.substring(1));
      title = title.replace(tag, '').trim();
    });
  }
  
  // استخراج المسؤول @person
  const assigneeMatch = text.match(/@(\w+)/);
  if (assigneeMatch) {
    assignee = assigneeMatch[1];
    title = title.replace(assigneeMatch[0], '').trim();
  }
  
  // استخراج التاريخ
  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/);
  if (dateMatch) {
    dueDate = dateMatch[1];
    title = title.replace(dateMatch[0], '').trim();
  }
  
  return { title, priority, tags, assignee, dueDate };
}
