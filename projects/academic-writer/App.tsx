import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, FileText, ClipboardList, Sparkles,
  Menu, X, ChevronRight, ExternalLink, AlertTriangle, Shield,
  GraduationCap, ScrollText
} from 'lucide-react';
import SearchPanel from './components/SearchPanel';
import ReferenceManager from './components/ReferenceManager';
import WritingPanel from './components/WritingPanel';
import TemplateGuide from './components/TemplateGuide';
import type { PubMedArticle } from './lib/pubmed';
import type { CitationStyle } from './lib/citations';

type TabId = 'search' | 'write' | 'references' | 'template';

const TABS: { id: TabId; label: string; icon: typeof Search; description: string }[] = [
  { id: 'search', label: 'PubMed Search', icon: Search, description: 'Search & discover evidence' },
  { id: 'write', label: 'Write', icon: FileText, description: 'Compose manuscript' },
  { id: 'references', label: 'References', icon: BookOpen, description: 'Manage citations' },
  { id: 'template', label: 'Study Guide', icon: ClipboardList, description: 'Reporting guidelines' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('search');
  const [references, setReferences] = useState<PubMedArticle[]>([]);
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('vancouver');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [pendingCitation, setPendingCitation] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const addedPmids = new Set(references.map(r => r.pmid));

  const handleAddReference = useCallback((article: PubMedArticle) => {
    setReferences(prev => {
      if (prev.some(r => r.pmid === article.pmid)) return prev;
      return [...prev, article];
    });
  }, []);

  const handleRemoveReference = useCallback((pmid: string) => {
    setReferences(prev => prev.filter(r => r.pmid !== pmid));
  }, []);

  const handleReorderReferences = useCallback((newRefs: PubMedArticle[]) => {
    setReferences(newRefs);
  }, []);

  const handleInsertCitation = useCallback((citation: string) => {
    setPendingCitation(citation);
    setActiveTab('write');
  }, []);

  const handleCitationInserted = useCallback(() => {
    setPendingCitation(null);
  }, []);

  const handleSelectTemplate = useCallback((id: string) => {
    setSelectedTemplate(id || null);
  }, []);

  // Landing Page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ink-50 via-academic-50/30 to-ink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-20">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academic-100/60 text-academic-700 text-xs font-semibold mb-6 border border-academic-200/60">
              <Shield className="w-3.5 h-3.5" />
              Zero Hallucination &mdash; Evidence-Only Writing
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 tracking-tight leading-tight">
              Academic Writing
              <br />
              <span className="bg-gradient-to-r from-academic-600 to-academic-800 bg-clip-text text-transparent">
                Agent
              </span>
            </h1>

            <p className="mt-6 text-ink-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              An AI-powered research writing assistant that searches <strong>real PubMed evidence</strong>,
              formats citations in Vancouver/APA/AMA, and guides you through
              CONSORT, PRISMA, STROBE, and CARE reporting standards.
            </p>

            <div className="mt-4 text-xs text-ink-400">
              By <strong>Dr Abdul Mannan</strong> &mdash; Consultant Haematologist & Educator
            </div>

            <motion.button
              onClick={() => setShowLanding(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 bg-academic-600 text-white rounded-xl
                         text-sm font-semibold hover:bg-academic-700 shadow-lg shadow-academic-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Start Writing
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Search,
                title: 'Live PubMed Search',
                description: 'Search the real PubMed database with advanced filters: study type, MeSH terms, authors, journals, and date ranges. Every result has a verifiable PMID.',
                color: 'text-blue-600 bg-blue-50 border-blue-200',
              },
              {
                icon: BookOpen,
                title: 'Smart Citations',
                description: 'Auto-format references in Vancouver (ICMJE), APA 7th, or AMA style. Insert in-text citations and generate complete bibliographies with one click.',
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
              },
              {
                icon: ClipboardList,
                title: 'Reporting Guidelines',
                description: 'Built-in checklists for CONSORT (RCT), PRISMA (SR/MA), PRISMA-ScR (scoping), TREND (nRCT), STROBE (cohort), CARE (case reports), and SANRA (narrative).',
                color: 'text-purple-600 bg-purple-50 border-purple-200',
              },
              {
                icon: Shield,
                title: 'Anti-Hallucination',
                description: 'The agent NEVER fabricates references. All citations come from verified PubMed records. If no evidence exists, it clearly states "No evidence found".',
                color: 'text-amber-600 bg-amber-50 border-amber-200',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="glass-panel rounded-xl p-5 shadow-sm"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${feature.color} mb-3`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-ink-800">{feature.title}</h3>
                <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Supported Study Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 glass-panel rounded-xl p-5 shadow-sm"
          >
            <h3 className="text-sm font-bold text-ink-800 flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-academic-600" />
              Supported Study Types & Reporting Guidelines
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { type: 'RCT', guide: 'CONSORT 2010' },
                { type: 'nRCT', guide: 'TREND 2004' },
                { type: 'Systematic Review', guide: 'PRISMA 2020' },
                { type: 'Meta-Analysis', guide: 'PRISMA + MOOSE' },
                { type: 'Scoping Review', guide: 'PRISMA-ScR 2018' },
                { type: 'Narrative Review', guide: 'SANRA Scale' },
                { type: 'Cohort Study', guide: 'STROBE 2007' },
                { type: 'Case Report', guide: 'CARE 2013' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-ink-50 rounded-lg">
                  <ScrollText className="w-3.5 h-3.5 text-academic-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-ink-700">{item.type}</p>
                    <p className="text-[10px] text-ink-400">{item.guide}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-4 flex items-center justify-center gap-6 text-xs text-ink-400"
          >
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              PubMed / MEDLINE
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              NCBI E-utilities API
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-400 rounded-full" />
              EQUATOR Network Guidelines
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-ink-200/60 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-academic-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-ink-800 group-hover:text-academic-600 transition-colors leading-none">
                  Academic Writer
                </p>
                <p className="text-[10px] text-ink-400 leading-none mt-0.5">Blood Doctor</p>
              </div>
            </button>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const hasItems = tab.id === 'references' && references.length > 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-academic-600 text-white shadow-sm'
                        : 'text-ink-600 hover:bg-ink-100'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {hasItems && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-academic-100 text-academic-700'
                      }`}>
                        {references.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Citation Style Indicator */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] text-ink-400 bg-ink-100 px-2 py-1 rounded-full font-medium">
                {citationStyle === 'vancouver' ? 'Vancouver' : citationStyle === 'apa' ? 'APA 7th' : 'AMA'}
              </span>
              {references.length > 0 && (
                <span className="evidence-badge evidence-high">
                  <Shield className="w-3 h-3" />
                  {references.length} verified
                </span>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-ink-200"
              >
                <div className="py-2 space-y-1">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive ? 'bg-academic-50 text-academic-700 font-semibold' : 'text-ink-600'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <div className="text-left">
                          <p className="text-sm">{tab.label}</p>
                          <p className="text-[10px] text-ink-400">{tab.description}</p>
                        </div>
                        {tab.id === 'references' && references.length > 0 && (
                          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-academic-100 text-academic-700">
                            {references.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Anti-Hallucination Banner */}
      <div className="bg-amber-50 border-b border-amber-200 no-print">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-amber-700">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <p>
            <strong>Evidence-only mode:</strong> All references are from verified PubMed records.
            This agent will say <strong>"No evidence found"</strong> rather than fabricate citations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'search' && (
              <div className="max-w-4xl mx-auto">
                <SearchPanel
                  onAddReference={handleAddReference}
                  addedPmids={addedPmids}
                />
              </div>
            )}

            {activeTab === 'write' && (
              <div className="max-w-4xl mx-auto">
                <WritingPanel
                  citationStyle={citationStyle}
                  pendingCitation={pendingCitation}
                  onCitationInserted={handleCitationInserted}
                />
              </div>
            )}

            {activeTab === 'references' && (
              <div className="max-w-4xl mx-auto">
                <ReferenceManager
                  references={references}
                  citationStyle={citationStyle}
                  onStyleChange={setCitationStyle}
                  onRemoveReference={handleRemoveReference}
                  onReorderReferences={handleReorderReferences}
                  onInsertCitation={handleInsertCitation}
                />
              </div>
            )}

            {activeTab === 'template' && (
              <div className="max-w-4xl mx-auto">
                <TemplateGuide
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-200 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold text-ink-600">Academic Writing Agent &mdash; Blood Doctor</p>
              <p className="text-[10px] text-ink-400 mt-0.5">
                By Dr Abdul Mannan &mdash; Consultant Haematologist & Educator
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-ink-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                PubMed NCBI E-utilities
              </span>
              <span>|</span>
              <span>EQUATOR Network Guidelines</span>
              <span>|</span>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-500 hover:text-academic-600 flex items-center gap-0.5"
              >
                PubMed <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-ink-300">
              This tool assists academic writing. All clinical decisions should be based on individual patient assessment
              and current guidelines. Verify all citations independently before submission.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
