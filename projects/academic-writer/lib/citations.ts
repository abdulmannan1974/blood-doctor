/**
 * Citation Formatting Engine
 * Supports Vancouver, APA 7th, and AMA citation styles
 * Handles both in-text citations and bibliography entries
 */

import type { PubMedArticle, Author } from './pubmed';

export type CitationStyle = 'vancouver' | 'apa' | 'ama';

export interface CitationEntry {
  article: PubMedArticle;
  number: number; // Position in reference list
  id: string; // Unique ID for this citation
}

// ─── Vancouver Style (ICMJE) ─────────────────────────────────────────

function formatVancouverAuthors(authors: Author[]): string {
  if (authors.length === 0) return '';

  const formatted = authors.slice(0, 6).map(
    (a) => `${a.lastName} ${a.initials}`
  );

  if (authors.length > 6) {
    formatted.push('et al');
  }

  return formatted.join(', ');
}

function formatVancouverReference(entry: CitationEntry): string {
  const { article, number } = entry;
  const authors = formatVancouverAuthors(article.authors);
  const title = article.title.endsWith('.') ? article.title : `${article.title}.`;
  const journal = article.journalAbbrev || article.journal;
  const year = article.year;
  const vol = article.volume;
  const issue = article.issue ? `(${article.issue})` : '';
  const pages = article.pages;
  const doi = article.doi ? ` doi: ${article.doi}` : '';

  let ref = `${number}. ${authors}. ${title} ${journal}. ${year}`;
  if (vol) ref += `;${vol}${issue}`;
  if (pages) ref += `:${pages}`;
  ref += `.${doi}`;

  return ref;
}

function formatVancouverInText(numbers: number[]): string {
  // Vancouver uses superscript numbers or numbers in brackets
  const sorted = [...numbers].sort((a, b) => a - b);
  const ranges = compressNumberRanges(sorted);
  return `[${ranges}]`;
}

// ─── APA 7th Edition ─────────────────────────────────────────────────

function formatAPAAuthors(authors: Author[]): string {
  if (authors.length === 0) return '';

  if (authors.length === 1) {
    return `${authors[0].lastName}, ${authors[0].initials.split('').join('. ')}.`;
  }

  if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].initials.split('').join('. ')}., & ${authors[1].lastName}, ${authors[1].initials.split('').join('. ')}.`;
  }

  if (authors.length <= 20) {
    const allButLast = authors.slice(0, -1).map(
      (a) => `${a.lastName}, ${a.initials.split('').join('. ')}.`
    );
    const last = authors[authors.length - 1];
    return `${allButLast.join(', ')}, & ${last.lastName}, ${last.initials.split('').join('. ')}.`;
  }

  // More than 20 authors: first 19, ..., last
  const first19 = authors.slice(0, 19).map(
    (a) => `${a.lastName}, ${a.initials.split('').join('. ')}.`
  );
  const last = authors[authors.length - 1];
  return `${first19.join(', ')}, ... ${last.lastName}, ${last.initials.split('').join('. ')}.`;
}

function formatAPAReference(entry: CitationEntry): string {
  const { article } = entry;
  const authors = formatAPAAuthors(article.authors);
  const year = article.year ? `(${article.year})` : '(n.d.)';
  const title = article.title.endsWith('.') ? article.title : `${article.title}.`;
  const journal = article.journal || article.journalAbbrev;
  const vol = article.volume;
  const issue = article.issue ? `(${article.issue})` : '';
  const pages = article.pages;
  const doi = article.doi ? ` https://doi.org/${article.doi}` : '';

  let ref = `${authors} ${year}. ${title} *${journal}*`;
  if (vol) ref += `, *${vol}*${issue}`;
  if (pages) ref += `, ${pages}`;
  ref += `.${doi}`;

  return ref;
}

function formatAPAInText(authors: Author[][], years: string[], isParenthetical: boolean): string {
  const citations = authors.map((auths, i) => {
    const year = years[i] || 'n.d.';
    if (auths.length === 0) return `(${year})`;

    if (auths.length === 1) {
      return isParenthetical
        ? `${auths[0].lastName}, ${year}`
        : `${auths[0].lastName} (${year})`;
    }

    if (auths.length === 2) {
      return isParenthetical
        ? `${auths[0].lastName} & ${auths[1].lastName}, ${year}`
        : `${auths[0].lastName} and ${auths[1].lastName} (${year})`;
    }

    // 3+ authors: first author et al.
    return isParenthetical
      ? `${auths[0].lastName} et al., ${year}`
      : `${auths[0].lastName} et al. (${year})`;
  });

  if (isParenthetical) {
    return `(${citations.join('; ')})`;
  }
  return citations.join('; ');
}

// ─── AMA (American Medical Association) ──────────────────────────────

function formatAMAAuthors(authors: Author[]): string {
  if (authors.length === 0) return '';

  const formatted = authors.slice(0, 6).map(
    (a) => `${a.lastName} ${a.initials}`
  );

  if (authors.length > 6) {
    formatted.push('et al');
  }

  return formatted.join(', ');
}

function formatAMAReference(entry: CitationEntry): string {
  const { article, number } = entry;
  const authors = formatAMAAuthors(article.authors);
  const title = article.title.endsWith('.') ? article.title : `${article.title}.`;
  const journal = article.journalAbbrev || article.journal;
  const year = article.year;
  const vol = article.volume;
  const issue = article.issue ? `(${article.issue})` : '';
  const pages = article.pages;
  const doi = article.doi ? ` doi:${article.doi}` : '';

  let ref = `${number}. ${authors}. ${title} *${journal}*. ${year}`;
  if (vol) ref += `;${vol}${issue}`;
  if (pages) ref += `:${pages}`;
  ref += `.${doi}`;

  return ref;
}

function formatAMAInText(numbers: number[]): string {
  // AMA uses superscript numbers
  const sorted = [...numbers].sort((a, b) => a - b);
  const ranges = compressNumberRanges(sorted);
  return `<sup>${ranges}</sup>`;
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Format a bibliography/reference list entry
 */
export function formatReference(entry: CitationEntry, style: CitationStyle): string {
  switch (style) {
    case 'vancouver':
      return formatVancouverReference(entry);
    case 'apa':
      return formatAPAReference(entry);
    case 'ama':
      return formatAMAReference(entry);
  }
}

/**
 * Format an in-text citation
 */
export function formatInTextCitation(
  entries: CitationEntry[],
  style: CitationStyle,
  isParenthetical: boolean = true
): string {
  switch (style) {
    case 'vancouver':
      return formatVancouverInText(entries.map((e) => e.number));
    case 'apa':
      return formatAPAInText(
        entries.map((e) => e.article.authors),
        entries.map((e) => e.article.year),
        isParenthetical
      );
    case 'ama':
      return formatAMAInText(entries.map((e) => e.number));
  }
}

/**
 * Format a full bibliography/references section
 */
export function formatBibliography(entries: CitationEntry[], style: CitationStyle): string {
  const header = style === 'apa' ? 'References' : 'References';
  const sorted = [...entries].sort((a, b) => {
    if (style === 'apa') {
      // APA sorts alphabetically by first author
      const nameA = a.article.authors[0]?.lastName || '';
      const nameB = b.article.authors[0]?.lastName || '';
      return nameA.localeCompare(nameB);
    }
    // Vancouver and AMA sort by citation order (number)
    return a.number - b.number;
  });

  // Re-number for APA (alphabetical order)
  if (style === 'apa') {
    sorted.forEach((entry, i) => {
      entry.number = i + 1;
    });
  }

  const refs = sorted.map((entry) => formatReference(entry, style));
  return `${header}\n\n${refs.join('\n\n')}`;
}

/**
 * Get style description
 */
export function getStyleInfo(style: CitationStyle): { name: string; description: string; usedIn: string } {
  switch (style) {
    case 'vancouver':
      return {
        name: 'Vancouver (ICMJE)',
        description: 'Numbered citations in order of appearance. Used by most medical journals.',
        usedIn: 'BMJ, Lancet, NEJM, JAMA, most medical journals',
      };
    case 'apa':
      return {
        name: 'APA 7th Edition',
        description: 'Author-date format, alphabetical reference list.',
        usedIn: 'Psychology, nursing, allied health, social sciences',
      };
    case 'ama':
      return {
        name: 'AMA (American Medical Association)',
        description: 'Superscript numbered citations, similar to Vancouver.',
        usedIn: 'JAMA, Archives journals, some US medical journals',
      };
  }
}

// ─── Utility ─────────────────────────────────────────────────────────

function compressNumberRanges(numbers: number[]): string {
  if (numbers.length === 0) return '';
  if (numbers.length === 1) return String(numbers[0]);

  const ranges: string[] = [];
  let start = numbers[0];
  let end = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === end + 1) {
      end = numbers[i];
    } else {
      ranges.push(start === end ? String(start) : `${start}-${end}`);
      start = numbers[i];
      end = numbers[i];
    }
  }
  ranges.push(start === end ? String(start) : `${start}-${end}`);

  return ranges.join(',');
}
