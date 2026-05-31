import DOMPurify from 'dompurify';

/**
 * DOMPurify configuration for sanitizing user-generated HTML content
 * Allows safe formatting tags while stripping dangerous elements
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    // Text formatting
    'b', 'i', 'u', 's', 'strong', 'em', 'mark', 'del', 'ins', 'sub', 'sup',
    // Lists
    'ul', 'ol', 'li',
    // Structure
    'p', 'br', 'span', 'div',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ],
  ALLOWED_ATTR: [
    'style', 'class', 'dir', 'lang'
  ],
  // Strip all event handlers (onclick, onerror, etc.)
  FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  // Remove script tags and their content
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  // Disallow data attributes
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML string from user input
 * @returns Sanitized HTML safe for rendering
 */
export const sanitizeHTML = (html: string | undefined | null): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, SANITIZE_CONFIG) as string;
};

/**
 * Sanitize HTML content for display (with default placeholder)
 * @param html - Raw HTML string from user input
 * @param placeholder - Default text if content is empty
 * @returns Sanitized HTML safe for rendering
 */
export const sanitizeHTMLForDisplay = (
  html: string | undefined | null, 
  placeholder: string = ''
): string => {
  if (!html) return placeholder;
  return DOMPurify.sanitize(html, SANITIZE_CONFIG) as string;
};
