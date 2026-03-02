import { useState, useRef, useCallback } from 'react';
import { Copy, Check, Download, Printer, Type, AlignLeft, List, RotateCcw, FileText } from 'lucide-react';
import type { CitationStyle } from '../lib/citations';

interface WritingPanelProps {
  citationStyle: CitationStyle;
  pendingCitation: string | null;
  onCitationInserted: () => void;
}

interface SectionContent {
  id: string;
  title: string;
  content: string;
}

export default function WritingPanel({ pendingCitation, onCitationInserted }: WritingPanelProps) {
  const [sections, setSections] = useState<SectionContent[]>([
    { id: 'title', title: 'Title', content: '' },
    { id: 'abstract', title: 'Abstract', content: '' },
    { id: 'introduction', title: 'Introduction', content: '' },
    { id: 'methods', title: 'Methods', content: '' },
    { id: 'results', title: 'Results', content: '' },
    { id: 'discussion', title: 'Discussion', content: '' },
  ]);
  const [activeSection, setActiveSection] = useState<string>('title');
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateSection = useCallback((id: string, content: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
    // Update word count
    const allText = sections.map(s => s.id === id ? content : s.content).join(' ');
    setWordCount(allText.trim() ? allText.trim().split(/\s+/).length : 0);
  }, [sections]);

  const addSection = () => {
    const name = prompt('Section name:');
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setSections(prev => [...prev, { id, title: name, content: '' }]);
    setActiveSection(id);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter(s => s.id !== id));
    if (activeSection === id) {
      setActiveSection(sections[0].id === id ? sections[1]?.id || '' : sections[0].id);
    }
  };

  const insertCitation = useCallback(() => {
    if (!pendingCitation || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentSection = sections.find(s => s.id === activeSection);
    if (!currentSection) return;

    const before = currentSection.content.substring(0, start);
    const after = currentSection.content.substring(end);
    const newContent = before + pendingCitation + after;

    updateSection(activeSection, newContent);
    onCitationInserted();

    // Move cursor after citation
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = start + pendingCitation.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
        textareaRef.current.focus();
      }
    }, 0);
  }, [pendingCitation, activeSection, sections, updateSection, onCitationInserted]);

  const getFullText = (): string => {
    return sections
      .filter(s => s.content.trim())
      .map(s => `## ${s.title}\n\n${s.content}`)
      .join('\n\n---\n\n');
  };

  const copyAll = async () => {
    const text = getFullText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const exportAsText = () => {
    const text = getFullText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manuscript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('Clear all sections? This cannot be undone.')) {
      setSections(prev => prev.map(s => ({ ...s, content: '' })));
      setWordCount(0);
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="glass-panel rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-academic-600" />
            <span className="text-sm font-bold text-ink-800">Manuscript Editor</span>
            <span className="text-xs text-ink-400 bg-ink-100 px-2 py-0.5 rounded-full">
              {wordCount} words
            </span>
          </div>
          <div className="flex items-center gap-1">
            {pendingCitation && (
              <button
                onClick={insertCitation}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg
                           text-xs font-bold hover:bg-emerald-600 transition-all animate-pulse-soft"
              >
                <Type className="w-3 h-3" />
                Insert Citation
              </button>
            )}
            <button onClick={copyAll} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-600 hover:bg-ink-100 transition-all" title="Copy all">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={exportAsText} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-600 hover:bg-ink-100 transition-all" title="Export">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => window.print()} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-600 hover:bg-ink-100 transition-all" title="Print">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={clearAll} className="p-1.5 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Clear all">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-print">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center group">
            <button
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-academic-600 text-white shadow-sm'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {section.title}
              {section.content.trim() && (
                <span className="ml-1 opacity-60">
                  ({section.content.trim().split(/\s+/).length}w)
                </span>
              )}
            </button>
            {!['title', 'abstract', 'introduction', 'methods', 'results', 'discussion'].includes(section.id) && (
              <button
                onClick={() => removeSection(section.id)}
                className="ml-0.5 p-0.5 text-ink-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addSection}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-ink-50 text-ink-400 hover:bg-ink-100 hover:text-ink-600 transition-all whitespace-nowrap"
        >
          + Section
        </button>
      </div>

      {/* Writing Area */}
      {currentSection && (
        <div className="glass-panel rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-ink-200 bg-ink-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-academic-500" />
              {currentSection.title}
            </h3>
            <span className="text-[10px] text-ink-400">
              {currentSection.content.trim() ? currentSection.content.trim().split(/\s+/).length : 0} words
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={currentSection.content}
            onChange={(e) => updateSection(currentSection.id, e.target.value)}
            placeholder={getPlaceholder(currentSection.id)}
            className="writing-area w-full p-6 resize-none border-0 bg-white"
            style={{ minHeight: '350px' }}
          />
        </div>
      )}

      {/* Document Outline */}
      <div className="glass-panel rounded-xl p-4 shadow-sm no-print">
        <h3 className="text-sm font-bold text-ink-800 flex items-center gap-2 mb-3">
          <List className="w-4 h-4 text-academic-600" />
          Document Outline
        </h3>
        <div className="space-y-1">
          {sections.map((section) => {
            const words = section.content.trim() ? section.content.trim().split(/\s+/).length : 0;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-all ${
                  activeSection === section.id
                    ? 'bg-academic-50 text-academic-700 font-semibold'
                    : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${words > 0 ? 'bg-emerald-400' : 'bg-ink-200'}`} />
                  {section.title}
                </span>
                <span className="text-ink-400">{words > 0 ? `${words}w` : '—'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getPlaceholder(sectionId: string): string {
  const placeholders: Record<string, string> = {
    title: 'Enter your manuscript title here...\n\nTip: For RCTs, include "randomized controlled trial" in the title (CONSORT).\nFor systematic reviews, include "systematic review" and/or "meta-analysis" (PRISMA).',
    abstract: 'Write your structured abstract here...\n\nTypical structure:\n- Background/Objectives\n- Methods/Design\n- Results\n- Conclusions\n\nInclude key quantitative results, effect sizes, and confidence intervals.',
    introduction: 'Write your introduction here...\n\nStructure:\n1. Background context — what is known\n2. Gap in knowledge — what is not known\n3. Rationale — why this study matters\n4. Objectives/Hypothesis — what this study aims to address\n\nUse the PICO framework for interventional studies.',
    methods: 'Write your methods here...\n\nKey elements vary by study type:\n\nRCT: Design, participants, interventions, outcomes, randomization, blinding, statistics\nSystematic Review: Protocol, search strategy, eligibility, screening, data extraction, risk of bias, synthesis\nCohort: Design, setting, participants, variables, bias, study size, statistics\nCase Report: Patient information, clinical findings, timeline, diagnosis, intervention, outcomes',
    results: 'Write your results here...\n\nPresent results matching the methods section.\n\nInclude:\n- Participant/study flow (with diagram)\n- Baseline characteristics\n- Primary outcome with effect size and 95% CI\n- Secondary outcomes\n- Sensitivity/subgroup analyses\n- Adverse events/harms',
    discussion: 'Write your discussion here...\n\nStructure:\n1. Key findings — summarize main results\n2. Comparison with literature — how do findings relate to existing evidence?\n3. Strengths and limitations — be honest and specific\n4. Implications — for clinical practice and/or future research\n5. Conclusion — concise take-home message',
  };
  return placeholders[sectionId] || `Write the ${sectionId} section here...`;
}
