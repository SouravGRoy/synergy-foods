import validator from 'validator';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * For server-side use, strips all HTML tags. For client-side, use a proper HTML sanitizer.
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Server-safe: strip all HTML tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
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
