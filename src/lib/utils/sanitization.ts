import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitizes string input by escaping HTML entities
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return validator.escape(input.trim());
}

/**
 * Validates and sanitizes email
 */
export function sanitizeEmail(input: string): string {
  if (!input || typeof input !== 'string') return '';
  const normalized = validator.normalizeEmail(input.trim().toLowerCase()) || '';
  return validator.isEmail(normalized) ? normalized : '';
}

/**
 * Sanitizes URL input
 */
export function sanitizeUrl(input: string): string {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  return validator.isURL(trimmed, { protocols: ['http', 'https'] }) ? trimmed : '';
}

/**
 * Sanitizes slug/identifier input
 */
export function sanitizeSlug(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Sanitizes numeric input
 */
export function sanitizeNumber(input: unknown): number | null {
  if (typeof input === 'number' && !isNaN(input)) return input;
  if (typeof input === 'string') {
    const parsed = parseFloat(input);
    return !isNaN(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Enhanced conversion function with sanitization
 */
export function convertEmptyStringToNullSafe(data: unknown): unknown {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed === '') return null;
    return sanitizeString(trimmed);
  }
  return data;
}
