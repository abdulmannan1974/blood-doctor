import { useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, BookOpen, FileCheck, ChevronDown, ChevronRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { STUDY_TEMPLATES, getTemplate } from '../lib/templates';
import type { StudyTemplate, ChecklistItem } from '../lib/templates';

interface TemplateGuideProps {
  selectedTemplate: string | null;
  onSelectTemplate: (id: string) => void;
}

export default function TemplateGuide({ selectedTemplate, onSelectTemplate }: TemplateGuideProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const template = selectedTemplate ? getTemplate(selectedTemplate) : null;

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getCompletionPercent = (items: ChecklistItem[]): number => {
    if (items.length === 0) return 0;
    const checked = items.filter(item => checklist[item.id]).length;
    return Math.round((checked / items.length) * 100);
  };

  // Template Selection View
  if (!template) {
    return (
      <div className="space-y-4">
        <div className="glass-panel rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-ink-800 flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-academic-600" />
            Select Study Type
          </h3>
          <p className="text-xs text-ink-500 mb-4">
            Choose your study design to get the correct reporting guideline, section template, and checklist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STUDY_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className="glass-panel rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                                   bg-academic-100 text-academic-700 border border-academic-200 mb-2">
                    {t.shortName}
                  </span>
                  <h4 className="text-sm font-bold text-ink-800 group-hover:text-academic-700 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-ink-500 mt-1 line-clamp-2">{t.description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-ink-400">
                <FileCheck className="w-3 h-3" />
                <span>{t.guideline}</span>
                <span className="text-ink-300">|</span>
                <span>{t.checklist.length} checklist items</span>
                <span className="text-ink-300">|</span>
                <span>{t.sections.length} sections</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Template Detail View
  const completionPercent = getCompletionPercent(template.checklist);

  return (
    <div className="space-y-4">
      {/* Template Header */}
      <div className="glass-panel rounded-xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                               bg-academic-100 text-academic-700 border border-academic-200">
                {template.shortName}
              </span>
              <button
                onClick={() => onSelectTemplate('')}
                className="text-[10px] text-ink-400 hover:text-ink-600"
              >
                Change type
              </button>
            </div>
            <h3 className="text-sm font-bold text-ink-800">{template.name}</h3>
            <p className="text-xs text-ink-500 mt-1">{template.description}</p>
          </div>
        </div>

        {/* Guideline Link */}
        <a
          href={template.guidelineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-academic-50 text-academic-600
                     rounded-lg text-xs font-medium hover:bg-academic-100 transition-all"
        >
          <FileCheck className="w-3.5 h-3.5" />
          {template.guideline} Guidelines
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Reporting Checklist */}
      <div className="glass-panel rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ink-800 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-academic-600" />
            Reporting Checklist
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPercent}%`,
                  backgroundColor: completionPercent === 100 ? '#10b981' : completionPercent > 50 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
            <span className="text-xs font-bold text-ink-600">{completionPercent}%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {template.checklist.map((item) => {
            const isChecked = checklist[item.id] || false;
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all ${
                  isChecked ? 'bg-emerald-50' : 'hover:bg-ink-50'
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-300 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={`text-xs ${isChecked ? 'text-emerald-700 line-through' : 'text-ink-700'}`}>
                    {item.item}
                  </p>
                  <p className="text-[10px] text-ink-400 mt-0.5">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Guide */}
      <div className="glass-panel rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-ink-800 flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-academic-600" />
          Section Guide
        </h3>

        <div className="space-y-2">
          {template.sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <div key={section.id} className="border border-ink-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-ink-50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-ink-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-ink-400" />
                    )}
                    <span className="text-xs font-bold text-ink-700">{section.name}</span>
                    {section.required && (
                      <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                        Required
                      </span>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 space-y-3 animate-fade-in">
                    {/* Description */}
                    <p className="text-xs text-ink-600">{section.description}</p>

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide mb-1">
                          Subsections to include:
                        </p>
                        <ul className="space-y-0.5">
                          {section.subsections.map((sub, i) => (
                            <li key={i} className="text-xs text-ink-600 flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-academic-400 rounded-full flex-shrink-0" />
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tips */}
                    {section.tips.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                        <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          Writing Tips
                        </p>
                        <ul className="space-y-1">
                          {section.tips.map((tip, i) => (
                            <li key={i} className="text-[11px] text-amber-800 flex items-start gap-1.5">
                              <span className="text-amber-500 mt-0.5 flex-shrink-0">&#8227;</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Anti-Hallucination Warning */}
      <div className="glass-panel rounded-xl p-4 shadow-sm border-l-4 border-l-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-800">Evidence Integrity Policy</p>
            <ul className="text-[11px] text-amber-700 mt-1.5 space-y-1">
              <li>&#8226; All citations must be from verified PubMed-indexed sources with real PMIDs</li>
              <li>&#8226; Every factual claim should have a supporting reference</li>
              <li>&#8226; If no evidence exists for a claim, state: <span className="font-bold">"No evidence found"</span></li>
              <li>&#8226; Never fabricate or guess author names, titles, DOIs, or publication details</li>
              <li>&#8226; Verify each reference exists at pubmed.ncbi.nlm.nih.gov before finalizing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
