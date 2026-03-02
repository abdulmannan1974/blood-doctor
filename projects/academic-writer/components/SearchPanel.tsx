import { useState, useCallback } from 'react';
import { Search, Filter, ExternalLink, Plus, BookOpen, Clock, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';
import { searchPubMed, buildAdvancedQuery, getPubMedUrl, getDoiUrl } from '../lib/pubmed';
import type { PubMedArticle, SearchResult } from '../lib/pubmed';

interface SearchPanelProps {
  onAddReference: (article: PubMedArticle) => void;
  addedPmids: Set<string>;
}

const STUDY_TYPE_OPTIONS = [
  { value: '', label: 'All study types' },
  { value: 'rct', label: 'Randomized Controlled Trials' },
  { value: 'clinical-trial', label: 'Clinical Trials' },
  { value: 'systematic-review', label: 'Systematic Reviews' },
  { value: 'meta-analysis', label: 'Meta-Analyses' },
  { value: 'cohort', label: 'Cohort Studies' },
  { value: 'case-report', label: 'Case Reports' },
  { value: 'review', label: 'Reviews' },
  { value: 'observational', label: 'Observational Studies' },
];

export default function SearchPanel({ onAddReference, addedPmids }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedAbstract, setExpandedAbstract] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');
  const [maxResults, setMaxResults] = useState(20);

  // Advanced search fields
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [studyType, setStudyType] = useState('');
  const [meshTerms, setMeshTerms] = useState('');

  const handleSearch = useCallback(async () => {
    if (!query.trim() && !authors.trim() && !journal.trim() && !meshTerms.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchQuery = showAdvanced
        ? buildAdvancedQuery({ keywords: query, authors, journal, yearFrom, yearTo, studyType, meshTerms })
        : query;

      const result = await searchPubMed(searchQuery, maxResults, sortBy);
      setResults(result);

      if (result.articles.length === 0) {
        setError(`No evidence found for "${query}". Try broadening your search terms or using different keywords.`);
      }
    } catch (err) {
      setError(`Search failed: ${err instanceof Error ? err.message : 'Network error. Please try again.'}`);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [query, authors, journal, yearFrom, yearTo, studyType, meshTerms, showAdvanced, maxResults, sortBy]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatAuthors = (article: PubMedArticle): string => {
    const authors = article.authors;
    if (authors.length === 0) return 'Unknown authors';
    if (authors.length <= 3) {
      return authors.map(a => `${a.lastName} ${a.initials}`).join(', ');
    }
    return `${authors[0].lastName} ${authors[0].initials} et al.`;
  };

  const getStudyTypeBadge = (article: PubMedArticle) => {
    const types = article.publicationType.map(t => t.toLowerCase());
    if (types.some(t => t.includes('randomized controlled trial'))) return { label: 'RCT', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (types.some(t => t.includes('meta-analysis'))) return { label: 'Meta-Analysis', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (types.some(t => t.includes('systematic review'))) return { label: 'Systematic Review', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (types.some(t => t.includes('case report'))) return { label: 'Case Report', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (types.some(t => t.includes('review'))) return { label: 'Review', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    if (types.some(t => t.includes('clinical trial'))) return { label: 'Clinical Trial', color: 'bg-teal-100 text-teal-800 border-teal-200' };
    if (types.some(t => t.includes('observational'))) return { label: 'Observational', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { label: 'Article', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="glass-panel rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search PubMed — e.g., 'rituximab ITP randomized controlled trial'"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 bg-white text-sm
                         focus:ring-2 focus:ring-academic-400 focus:border-academic-400 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-2.5 bg-academic-600 text-white rounded-lg text-sm font-medium
                       hover:bg-academic-700 disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>

        {/* Advanced Search Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 mt-3 text-xs text-academic-600 hover:text-academic-700 font-medium"
        >
          <Filter className="w-3 h-3" />
          Advanced Search
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Advanced Fields */}
        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-ink-50 rounded-lg animate-fade-in">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Author(s)</label>
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="e.g., Provan D"
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Journal</label>
              <input
                type="text"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="e.g., Blood"
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">MeSH Terms</label>
              <input
                type="text"
                value={meshTerms}
                onChange={(e) => setMeshTerms(e.target.value)}
                placeholder="e.g., Thrombocytopenia"
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Year From</label>
              <input
                type="text"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="e.g., 2020"
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Year To</label>
              <input
                type="text"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="e.g., 2025"
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Study Type</label>
              <select
                value={studyType}
                onChange={(e) => setStudyType(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              >
                {STUDY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date')}
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Most Recent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Max Results</label>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-md border border-ink-200 text-sm bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error / No Evidence Found */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">No Evidence Found</p>
            <p className="text-sm text-amber-700 mt-1">{error}</p>
            <p className="text-xs text-amber-600 mt-2">
              The agent will NOT fabricate references. Only verified PubMed-indexed articles are shown.
            </p>
          </div>
        </div>
      )}

      {/* Results Header */}
      {results && results.articles.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-500">
            Showing <span className="font-semibold text-ink-700">{results.articles.length}</span> of{' '}
            <span className="font-semibold text-ink-700">{results.totalCount.toLocaleString()}</span> results
            <span className="text-ink-400 ml-2">({(results.searchTime / 1000).toFixed(2)}s)</span>
          </p>
          <div className="evidence-badge evidence-high">
            <BookOpen className="w-3 h-3" />
            PubMed Verified
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-3">
        {results?.articles.map((article) => {
          const badge = getStudyTypeBadge(article);
          const isExpanded = expandedAbstract === article.pmid;
          const isAdded = addedPmids.has(article.pmid);

          return (
            <div
              key={article.pmid}
              className={`glass-panel rounded-xl p-4 shadow-sm transition-all animate-fade-in-up
                         ${isAdded ? 'ring-2 ring-academic-300 bg-academic-50/30' : 'hover:shadow-md'}`}
            >
              {/* Title & Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono">PMID: {article.pmid}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink-800 leading-snug">
                    {article.title}
                  </h3>
                </div>
                <button
                  onClick={() => onAddReference(article)}
                  disabled={isAdded}
                  className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                    isAdded
                      ? 'bg-academic-100 text-academic-600 cursor-default'
                      : 'bg-academic-50 text-academic-600 hover:bg-academic-100 hover:shadow-sm'
                  }`}
                  title={isAdded ? 'Already added' : 'Add to references'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Authors & Journal */}
              <p className="text-xs text-ink-500 mt-2">
                {formatAuthors(article)}
              </p>
              <p className="text-xs text-ink-400 mt-1 flex items-center gap-2">
                <span className="font-medium">{article.journalAbbrev || article.journal}</span>
                {article.year && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.year}
                  </span>
                )}
                {article.volume && <span>Vol. {article.volume}</span>}
              </p>

              {/* Abstract Toggle */}
              {article.abstract && (
                <div className="mt-2">
                  <button
                    onClick={() => setExpandedAbstract(isExpanded ? null : article.pmid)}
                    className="text-xs text-academic-600 hover:text-academic-700 font-medium flex items-center gap-1"
                  >
                    {isExpanded ? 'Hide' : 'Show'} Abstract
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {isExpanded && (
                    <div className="mt-2 p-3 bg-ink-50 rounded-lg text-xs text-ink-600 leading-relaxed whitespace-pre-line animate-fade-in">
                      {article.abstract}
                    </div>
                  )}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-3 mt-2">
                <a
                  href={getPubMedUrl(article.pmid)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-academic-600 hover:text-academic-700 font-medium"
                >
                  PubMed <ExternalLink className="w-2.5 h-2.5" />
                </a>
                {article.doi && (
                  <a
                    href={getDoiUrl(article.doi)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-academic-600 hover:text-academic-700 font-medium"
                  >
                    DOI <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              {/* MeSH Terms (collapsed) */}
              {article.meshTerms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {article.meshTerms.slice(0, 5).map((term, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-ink-100 text-ink-500 rounded text-[10px]">
                      {term}
                    </span>
                  ))}
                  {article.meshTerms.length > 5 && (
                    <span className="px-1.5 py-0.5 text-ink-400 text-[10px]">
                      +{article.meshTerms.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-ink-500">
            <Loader2 className="w-5 h-5 animate-spin text-academic-500" />
            <span className="text-sm">Searching PubMed database...</span>
          </div>
        </div>
      )}
    </div>
  );
}
