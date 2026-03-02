import { useState, useMemo } from 'react';
import { Trash2, Copy, Check, ArrowUpDown, GripVertical, ExternalLink, BookOpen, FileText } from 'lucide-react';
import { formatReference, formatBibliography, formatInTextCitation, getStyleInfo } from '../lib/citations';
import type { CitationStyle, CitationEntry } from '../lib/citations';
import type { PubMedArticle } from '../lib/pubmed';
import { getPubMedUrl } from '../lib/pubmed';

interface ReferenceManagerProps {
  references: PubMedArticle[];
  citationStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
  onRemoveReference: (pmid: string) => void;
  onReorderReferences: (references: PubMedArticle[]) => void;
  onInsertCitation: (citation: string) => void;
}

export default function ReferenceManager({
  references,
  citationStyle,
  onStyleChange,
  onRemoveReference,
  onReorderReferences,
  onInsertCitation,
}: ReferenceManagerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBib, setCopiedBib] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const entries: CitationEntry[] = useMemo(() =>
    references.map((article, i) => ({
      article,
      number: i + 1,
      id: article.pmid,
    })),
    [references]
  );

  const styleInfo = getStyleInfo(citationStyle);

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopiedBib(true);
        setTimeout(() => setCopiedBib(false), 2000);
      }
    } catch {
      // Fallback: select text
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleCiteInText = (entry: CitationEntry) => {
    const citation = formatInTextCitation([entry], citationStyle, true);
    onInsertCitation(citation);
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    const newRefs = [...references];
    const dragged = newRefs[draggedIdx];
    newRefs.splice(draggedIdx, 1);
    newRefs.splice(idx, 0, dragged);
    onReorderReferences(newRefs);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const moveReference = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= references.length) return;

    const newRefs = [...references];
    [newRefs[idx], newRefs[newIdx]] = [newRefs[newIdx], newRefs[idx]];
    onReorderReferences(newRefs);
  };

  return (
    <div className="space-y-4">
      {/* Style Selector */}
      <div className="glass-panel rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ink-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-academic-600" />
            Citation Style
          </h3>
          <span className="text-xs text-ink-400">{references.length} reference{references.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['vancouver', 'apa', 'ama'] as CitationStyle[]).map((style) => {
            const info = getStyleInfo(style);
            const isActive = citationStyle === style;
            return (
              <button
                key={style}
                onClick={() => onStyleChange(style)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-academic-50 border-academic-300 ring-1 ring-academic-200'
                    : 'bg-white border-ink-200 hover:border-academic-300'
                }`}
              >
                <p className={`text-xs font-bold ${isActive ? 'text-academic-700' : 'text-ink-700'}`}>
                  {info.name}
                </p>
                <p className="text-[10px] text-ink-400 mt-0.5 line-clamp-2">{info.usedIn}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference List */}
      {entries.length === 0 ? (
        <div className="glass-panel rounded-xl p-8 shadow-sm text-center">
          <FileText className="w-8 h-8 text-ink-300 mx-auto mb-3" />
          <p className="text-sm text-ink-500 font-medium">No references added yet</p>
          <p className="text-xs text-ink-400 mt-1">
            Search PubMed and click + to add verified references
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => {
            const refText = formatReference(entry, citationStyle);
            const isCopied = copiedId === entry.id;

            return (
              <div
                key={entry.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`glass-panel rounded-lg p-3 shadow-sm transition-all group
                           ${draggedIdx === idx ? 'opacity-50 ring-2 ring-academic-300' : 'hover:shadow-md'}`}
              >
                <div className="flex items-start gap-2">
                  {/* Drag Handle & Number */}
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <GripVertical className="w-3 h-3 text-ink-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-academic-600 bg-academic-50 w-6 h-6 rounded-full flex items-center justify-center">
                      {entry.number}
                    </span>
                  </div>

                  {/* Reference Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-700 leading-relaxed">{refText}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-ink-400 font-mono">PMID: {entry.article.pmid}</span>
                      <a
                        href={getPubMedUrl(entry.article.pmid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-academic-500 hover:text-academic-600 flex items-center gap-0.5"
                      >
                        PubMed <ExternalLink className="w-2 h-2" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleCiteInText(entry)}
                      className="px-2 py-1 bg-academic-50 text-academic-600 rounded text-[10px] font-semibold
                                 hover:bg-academic-100 transition-all"
                      title="Insert in-text citation"
                    >
                      Cite
                    </button>
                    <button
                      onClick={() => copyToClipboard(refText, entry.id)}
                      className="p-1 rounded text-ink-400 hover:text-ink-600 hover:bg-ink-100 transition-all"
                      title="Copy reference"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => onRemoveReference(entry.article.pmid)}
                      className="p-1 rounded text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Remove reference"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Reorder Buttons (mobile-friendly) */}
                <div className="flex gap-1 mt-1 md:hidden">
                  <button
                    onClick={() => moveReference(idx, 'up')}
                    disabled={idx === 0}
                    className="text-[10px] text-ink-400 disabled:opacity-30"
                  >
                    <ArrowUpDown className="w-3 h-3" /> Up
                  </button>
                  <button
                    onClick={() => moveReference(idx, 'down')}
                    disabled={idx === entries.length - 1}
                    className="text-[10px] text-ink-400 disabled:opacity-30"
                  >
                    Down
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Copy Full Bibliography */}
      {entries.length > 0 && (
        <div className="glass-panel rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-ink-800">Full Bibliography</h3>
            <button
              onClick={() => copyToClipboard(formatBibliography(entries, citationStyle))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-academic-600 text-white rounded-lg
                         text-xs font-medium hover:bg-academic-700 transition-all"
            >
              {copiedBib ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedBib ? 'Copied!' : 'Copy All References'}
            </button>
          </div>
          <div className="bg-ink-50 rounded-lg p-4 text-xs text-ink-600 leading-relaxed whitespace-pre-line font-mono max-h-64 overflow-y-auto">
            {formatBibliography(entries, citationStyle)}
          </div>
        </div>
      )}
    </div>
  );
}
