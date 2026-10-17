// Corps des articles du Mag : Markdown converti en HTML puis assaini.
// Le texte est saisi dans /admin : on n'autorise qu'un sous-ensemble sûr de balises.

import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const OPTIONS_ASSAINISSEMENT: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'em', 'blockquote',
    'ul', 'ol', 'li', 'a', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img',
  ],
  // target, rel, loading et decoding ne sont ajoutés que par transformTags ci-dessous
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    th: ['scope'],
  },
  allowedSchemes: ['https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'] },
  allowProtocolRelative: false,
  // Liens externes : nouvel onglet sans transmettre la page d'origine
  transformTags: {
    a: (nom, attributs) => {
      // Les attributs target et rel saisis dans le Markdown sont ignorés : seul ce code les pose
      const { target: _target, rel: _rel, ...propres } = attributs;
      const href = propres.href ?? '';
      const externe = /^https:\/\//.test(href) && !/^https:\/\/(www\.)?madalgroup\.ci/.test(href);
      return {
        tagName: nom,
        attribs: externe ? { ...propres, target: '_blank', rel: 'noopener noreferrer' } : propres,
      };
    },
    img: (nom, attributs) => ({ tagName: nom, attribs: { ...attributs, loading: 'lazy', decoding: 'async' } }),
    // Un seul h1 par page : le titre de l'article
    h1: 'h2',
  },
};

/** Convertit le Markdown d'un article en HTML sûr. */
export function rendreMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true });
  return sanitizeHtml(html, OPTIONS_ASSAINISSEMENT);
}
