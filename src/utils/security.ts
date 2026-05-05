import DOMPurify from 'dompurify';

/**
 * Sanitiza strings HTML para evitar ataques XSS.
 * Útil ao renderizar conteúdo do Lexical ou inputs de usuários.
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'br',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};
