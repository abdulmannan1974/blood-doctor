/**
 * PubMed E-utilities API Client
 * Uses NCBI E-utilities (free, no API key required for <3 requests/sec)
 * Docs: https://www.ncbi.nlm.nih.gov/books/NBK25501/
 */

const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: Author[];
  journal: string;
  journalAbbrev: string;
  year: string;
  month: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  abstract: string;
  publicationType: string[];
  meshTerms: string[];
  keywords: string[];
}

export interface Author {
  lastName: string;
  foreName: string;
  initials: string;
  affiliation: string;
}

export interface SearchResult {
  articles: PubMedArticle[];
  totalCount: number;
  query: string;
  searchTime: number;
}

/**
 * Search PubMed for articles matching a query.
 * Returns real, verifiable results with PMIDs.
 */
export async function searchPubMed(
  query: string,
  maxResults: number = 20,
  sort: 'relevance' | 'date' = 'relevance'
): Promise<SearchResult> {
  const startTime = performance.now();

  // Step 1: ESearch — get PMIDs
  const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=${maxResults}&sort=${sort}`;
  const searchResp = await fetch(searchUrl);
  if (!searchResp.ok) throw new Error(`PubMed search failed: ${searchResp.status}`);

  const searchData = await searchResp.json();
  const idList: string[] = searchData.esearchresult?.idlist || [];
  const totalCount = parseInt(searchData.esearchresult?.count || '0', 10);

  if (idList.length === 0) {
    return { articles: [], totalCount: 0, query, searchTime: performance.now() - startTime };
  }

  // Step 2: EFetch — get full article details as XML
  const fetchUrl = `${EUTILS_BASE}/efetch.fcgi?db=pubmed&id=${idList.join(',')}&retmode=xml`;
  const fetchResp = await fetch(fetchUrl);
  if (!fetchResp.ok) throw new Error(`PubMed fetch failed: ${fetchResp.status}`);

  const xmlText = await fetchResp.text();
  const articles = parsePubMedXml(xmlText);

  return {
    articles,
    totalCount,
    query,
    searchTime: performance.now() - startTime,
  };
}

/**
 * Fetch a single article by PMID
 */
export async function fetchByPMID(pmid: string): Promise<PubMedArticle | null> {
  const fetchUrl = `${EUTILS_BASE}/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;
  const resp = await fetch(fetchUrl);
  if (!resp.ok) return null;

  const xmlText = await resp.text();
  const articles = parsePubMedXml(xmlText);
  return articles[0] || null;
}

/**
 * Build advanced PubMed search queries with field tags
 */
export function buildAdvancedQuery(params: {
  keywords?: string;
  authors?: string;
  journal?: string;
  yearFrom?: string;
  yearTo?: string;
  studyType?: string;
  meshTerms?: string;
}): string {
  const parts: string[] = [];

  if (params.keywords) parts.push(params.keywords);
  if (params.authors) parts.push(`${params.authors}[Author]`);
  if (params.journal) parts.push(`"${params.journal}"[Journal]`);
  if (params.meshTerms) parts.push(`"${params.meshTerms}"[MeSH Terms]`);

  if (params.yearFrom || params.yearTo) {
    const from = params.yearFrom || '1900';
    const to = params.yearTo || '3000';
    parts.push(`${from}:${to}[Date - Publication]`);
  }

  // PubMed study type filters
  if (params.studyType) {
    const filters: Record<string, string> = {
      rct: 'randomized controlled trial[pt]',
      'clinical-trial': 'clinical trial[pt]',
      'systematic-review': 'systematic review[pt]',
      'meta-analysis': 'meta-analysis[pt]',
      'cohort': 'cohort studies[MeSH Terms]',
      'case-report': 'case reports[pt]',
      'review': 'review[pt]',
      'observational': 'observational study[pt]',
    };
    if (filters[params.studyType]) {
      parts.push(filters[params.studyType]);
    }
  }

  return parts.join(' AND ');
}

/**
 * Parse PubMed XML response into structured articles
 */
function parsePubMedXml(xmlText: string): PubMedArticle[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const articleNodes = doc.querySelectorAll('PubmedArticle');
  const articles: PubMedArticle[] = [];

  articleNodes.forEach((node) => {
    const pmid = getTextContent(node, 'PMID') || '';
    const title = getTextContent(node, 'ArticleTitle') || 'Untitled';

    // Authors
    const authorNodes = node.querySelectorAll('AuthorList Author');
    const authors: Author[] = [];
    authorNodes.forEach((authorNode) => {
      authors.push({
        lastName: getTextContent(authorNode, 'LastName') || '',
        foreName: getTextContent(authorNode, 'ForeName') || '',
        initials: getTextContent(authorNode, 'Initials') || '',
        affiliation: getTextContent(authorNode, 'AffiliationInfo Affiliation') || '',
      });
    });

    // Journal info
    const journal = getTextContent(node, 'Journal Title') || getTextContent(node, 'MedlineTA') || '';
    const journalAbbrev = getTextContent(node, 'ISOAbbreviation') || getTextContent(node, 'MedlineTA') || '';
    const volume = getTextContent(node, 'JournalIssue Volume') || '';
    const issue = getTextContent(node, 'JournalIssue Issue') || '';
    const pages = getTextContent(node, 'MedlinePgn') || '';

    // Date
    const pubDateNode = node.querySelector('PubDate');
    const year = getTextContent(pubDateNode, 'Year') || getTextContent(pubDateNode, 'MedlineDate')?.substring(0, 4) || '';
    const month = getTextContent(pubDateNode, 'Month') || '';

    // DOI
    let doi = '';
    const idNodes = node.querySelectorAll('ArticleIdList ArticleId');
    idNodes.forEach((idNode) => {
      if (idNode.getAttribute('IdType') === 'doi') {
        doi = idNode.textContent || '';
      }
    });

    // Abstract
    const abstractParts: string[] = [];
    const abstractNodes = node.querySelectorAll('Abstract AbstractText');
    abstractNodes.forEach((absNode) => {
      const label = absNode.getAttribute('Label');
      const text = absNode.textContent || '';
      if (label) {
        abstractParts.push(`${label}: ${text}`);
      } else {
        abstractParts.push(text);
      }
    });

    // Publication types
    const pubTypes: string[] = [];
    node.querySelectorAll('PublicationTypeList PublicationType').forEach((pt) => {
      pubTypes.push(pt.textContent || '');
    });

    // MeSH terms
    const meshTerms: string[] = [];
    node.querySelectorAll('MeshHeadingList MeshHeading DescriptorName').forEach((mh) => {
      meshTerms.push(mh.textContent || '');
    });

    // Keywords
    const keywords: string[] = [];
    node.querySelectorAll('KeywordList Keyword').forEach((kw) => {
      keywords.push(kw.textContent || '');
    });

    articles.push({
      pmid,
      title,
      authors,
      journal,
      journalAbbrev,
      year,
      month,
      volume,
      issue,
      pages,
      doi,
      abstract: abstractParts.join('\n\n'),
      publicationType: pubTypes,
      meshTerms,
      keywords,
    });
  });

  return articles;
}

function getTextContent(parent: Element | null, selector: string): string {
  if (!parent) return '';
  const el = parent.querySelector(selector);
  return el?.textContent?.trim() || '';
}

/**
 * Get PubMed URL for an article
 */
export function getPubMedUrl(pmid: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}

/**
 * Get DOI URL for an article
 */
export function getDoiUrl(doi: string): string {
  return doi ? `https://doi.org/${doi}` : '';
}
