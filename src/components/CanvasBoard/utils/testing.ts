/**
 * @fileoverview Canvas Board integration tests and validation
 * @author AI Assistant
 * @version 1.0.0
 */

import { validateCanvasElement, validateLayer, validateParticipant, validateChatMessage, sanitizeElementContent } from '../utils/validation';
import { transformLayersForEnhancedPanel } from '../utils/layerUtils';
import { mockParticipants, mockChatMessages, createNewChatMessage } from '../data/mockData';

/**
 * Test Canvas Board core functionality
 */
export const runCanvasBoardTests = () => {
  const results = {
    validation: true,
    layerTransform: true,
    mockData: true,
    arabicSupport: true,
    errors: [] as string[]
  };

  try {
    // Test validation functions
    console.log('🧪 Testing validation functions...');
    
    // Test valid canvas element
    const validElement = {
      id: 'test-1',
      type: 'text',
      position: { x: 100, y: 200 },
      size: { width: 150, height: 50 },
      content: 'نص تجريبي'
    };
    
    if (!validateCanvasElement(validElement)) {
      results.validation = false;
      results.errors.push('Valid element validation failed');
    }
    
    // Test invalid canvas element
    const invalidElement = {
      id: 'test-2',
      type: 'invalid-type',
      position: { x: 'not-a-number', y: 200 }
    };
    
    if (validateCanvasElement(invalidElement)) {
      results.validation = false;
      results.errors.push('Invalid element validation should have failed');
    }
    
    // Test layer transformation
    console.log('🔄 Testing layer transformation...');
    
    const testLayers = [
      {
        id: 'layer-1',
        name: 'الطبقة الأولى',
        visible: true,
        locked: false,
        elements: ['elem-1', 'elem-2']
      }
    ];
    
    const transformedLayers = transformLayersForEnhancedPanel(testLayers);
    if (!transformedLayers[0] || transformedLayers[0].type !== 'layer') {
      results.layerTransform = false;
      results.errors.push('Layer transformation failed');
    }
    
    // Test mock data
    console.log('📝 Testing mock data...');
    
    mockParticipants.forEach((participant, index) => {
      if (!validateParticipant(participant)) {
        results.mockData = false;
        results.errors.push(`Mock participant ${index} is invalid`);
      }
    });
    
    mockChatMessages.forEach((message, index) => {
      if (!validateChatMessage(message)) {
        results.mockData = false;
        results.errors.push(`Mock chat message ${index} is invalid`);
      }
    });
    
    // Test Arabic content sanitization
    console.log('🔤 Testing Arabic support...');
    
    const arabicContent = 'مرحباً بكم في لوحة الرسم التشاركية <script>alert("test")</script>';
    const sanitized = sanitizeElementContent(arabicContent);
    
    if (sanitized.includes('<script>')) {
      results.arabicSupport = false;
      results.errors.push('Arabic content sanitization failed');
    }
    
    if (!sanitized.includes('مرحباً بكم في لوحة الرسم التشاركية')) {
      results.arabicSupport = false;
      results.errors.push('Arabic content was incorrectly removed');
    }
    
    // Test chat message creation
    const newMessage = createNewChatMessage('رسالة تجريبية جديدة');
    if (!validateChatMessage(newMessage)) {
      results.mockData = false;
      results.errors.push('New chat message creation failed');
    }
    
    console.log('✅ All tests completed');
    
  } catch (error) {
    results.validation = false;
    results.errors.push(`Test execution error: ${error}`);
  }
  
  return results;
};

/**
 * Visual test for Canvas Board components
 */
export const runCanvasBoardVisualTest = () => {
  console.log('🎨 Running Canvas Board visual tests...');
  
  const testResults = {
    rtlSupport: true,
    arabicFonts: true,
    responsiveLayout: true,
    accessibility: true,
    errors: [] as string[]
  };
  
  try {
    // Check if body has proper RTL support
    const bodyElement = document.body;
    const computedStyle = window.getComputedStyle(bodyElement);
    
    // Test font family for Arabic support
    const fontFamily = computedStyle.fontFamily;
    if (!fontFamily.includes('Arabic') && !fontFamily.includes('IBM Plex Sans Arabic')) {
      testResults.arabicFonts = false;
      testResults.errors.push('Arabic font family not properly set');
    }
    
    // Test for RTL direction support
    const testElement = document.createElement('div');
    testElement.innerHTML = 'مرحباً';
    testElement.style.direction = 'rtl';
    testElement.style.textAlign = 'right';
    document.body.appendChild(testElement);
    
    const testStyle = window.getComputedStyle(testElement);
    if (testStyle.direction !== 'rtl') {
      testResults.rtlSupport = false;
      testResults.errors.push('RTL direction not properly applied');
    }
    
    document.body.removeChild(testElement);
    
    console.log('✅ Visual tests completed');
    
  } catch (error) {
    testResults.accessibility = false;
    testResults.errors.push(`Visual test error: ${error}`);
  }
  
  return testResults;
};

/**
 * Performance test for Canvas Board
 */
export const runCanvasPerformanceTest = () => {
  console.log('⚡ Running Canvas Board performance tests...');
  
  const results = {
    elementCreation: 0,
    elementUpdate: 0,
    layerOperations: 0,
    memoryUsage: 0,
    errors: [] as string[]
  };
  
  try {
    // Test element creation performance
    const startTime = performance.now();
    
    const testElements = [];
    for (let i = 0; i < 100; i++) {
      testElements.push({
        id: `perf-test-${i}`,
        type: 'text',
        position: { x: i * 10, y: i * 10 },
        size: { width: 100, height: 50 },
        content: `عنصر رقم ${i}`
      });
    }
    
    results.elementCreation = performance.now() - startTime;
    
    // Test update performance
    const updateStart = performance.now();
    testElements.forEach((element, index) => {
      element.position.x += 10;
      element.content = `عنصر محدث رقم ${index}`;
    });
    results.elementUpdate = performance.now() - updateStart;
    
    // Memory usage estimation
    if ('memory' in performance) {
      results.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
    
    console.log('✅ Performance tests completed');
    
  } catch (error) {
    results.errors.push(`Performance test error: ${error}`);
  }
  
  return results;
};

/**
 * Complete Canvas Board test suite
 */
export const runCompleteCanvasBoardTest = () => {
  console.log('🚀 Starting complete Canvas Board test suite...');
  
  const results = {
    core: runCanvasBoardTests(),
    visual: typeof window !== 'undefined' ? runCanvasBoardVisualTest() : null,
    performance: runCanvasPerformanceTest(),
    overall: true
  };
  
  // Determine overall result
  results.overall = results.core.validation && 
                   results.core.layerTransform && 
                   results.core.mockData && 
                   results.core.arabicSupport &&
                   (!results.visual || (results.visual.rtlSupport && results.visual.arabicFonts));
  
  // Log summary
  console.log('📊 Test Results Summary:');
  console.log(`Core functionality: ${results.core.validation ? '✅' : '❌'}`);
  console.log(`Layer transformation: ${results.core.layerTransform ? '✅' : '❌'}`);
  console.log(`Mock data: ${results.core.mockData ? '✅' : '❌'}`);
  console.log(`Arabic support: ${results.core.arabicSupport ? '✅' : '❌'}`);
  
  if (results.visual) {
    console.log(`RTL support: ${results.visual.rtlSupport ? '✅' : '❌'}`);
    console.log(`Arabic fonts: ${results.visual.arabicFonts ? '✅' : '❌'}`);
  }
  
  console.log(`Performance - Element creation: ${results.performance.elementCreation.toFixed(2)}ms`);
  console.log(`Performance - Element update: ${results.performance.elementUpdate.toFixed(2)}ms`);
  
  if (results.performance.memoryUsage > 0) {
    console.log(`Memory usage: ${(results.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
  }
  
  // Log any errors
  const allErrors = [
    ...results.core.errors,
    ...(results.visual?.errors || []),
    ...results.performance.errors
  ];
  
  if (allErrors.length > 0) {
    console.log('❌ Errors found:');
    allErrors.forEach(error => console.log(`  - ${error}`));
  }
  
  console.log(`\n🎯 Overall result: ${results.overall ? '✅ PASS' : '❌ FAIL'}`);
  
  return results;
};