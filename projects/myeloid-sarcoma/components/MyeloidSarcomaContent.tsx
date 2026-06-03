import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ChevronDown, ChevronRight, Microscope, FlaskConical, Scan, Dna,
  Stethoscope, Syringe, Radiation, Repeat, AlertTriangle, Target,
  CheckCircle2, XCircle, Activity, BookOpen, ArrowRight, Layers,
} from 'lucide-react';

// ─── Shared animation variants ───────────────────────
const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

const accordionVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1, transition: { ...springTransition, opacity: { duration: 0.3, delay: 0.1 } } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Reusable Badge ──────────────────────────────────
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'red' | 'gold' | 'slate' | 'emerald' | 'indigo' | 'custom';
  className?: string;
}> = ({ children, variant = 'slate', className = '' }) => {
  const colors: Record<string, string> = {
    red: 'bg-blood-50 text-blood-700 border-blood-200',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    custom: '',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
};

// =====================================================
// KEY FACTS — AT A GLANCE
// =====================================================
export const KeyFacts: React.FC = () => {
  const facts = [
    {
      stat: '2–8%',
      label: 'of AML patients',
      detail: 'develop myeloid sarcoma at some extramedullary site; breast involvement is among the rarer locations.',
      gradient: 'from-blood-600 to-blood-800',
    },
    {
      stat: '♀ predominance',
      label: 'often young women',
      detail: 'Breast myeloid sarcoma characteristically affects women of reproductive age and may be bilateral.',
      gradient: 'from-indigo-600 to-indigo-800',
    },
    {
      stat: 'up to ~50%',
      label: 'initially misdiagnosed',
      detail: 'Most commonly mistaken for non-Hodgkin lymphoma or poorly differentiated carcinoma when myeloid markers are not tested.',
      gradient: 'from-amber-600 to-amber-800',
    },
    {
      stat: 'Systemic disease',
      label: 'even when "isolated"',
      detail: 'Isolated breast myeloid sarcoma reliably progresses to overt AML if treated with local therapy alone.',
      gradient: 'from-rose-600 to-rose-800',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {facts.map((f) => (
        <motion.div
          key={f.label}
          variants={staggerItem}
          className="glass-panel rounded-2xl p-6 hover-lift border border-slate-200/70 h-full"
        >
          <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-gradient-to-br ${f.gradient} text-white font-black text-sm shadow-lg mb-4`}>
            {f.stat}
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-2">{f.label}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{f.detail}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// =====================================================
// CLINICAL CONTEXTS / PRESENTATION
// =====================================================
export const ClinicalContexts: React.FC = () => {
  const contexts = [
    {
      title: 'De novo / isolated (primary) MS',
      icon: <Target size={20} />,
      gradient: 'from-blood-600 to-blood-800',
      points: [
        'A breast mass arising with no detectable marrow disease or prior haematological diagnosis.',
        'Bone marrow examination is normal or non-diagnostic at presentation.',
        'Strongly predicts subsequent overt AML — typically within months — when not treated systemically.',
      ],
    },
    {
      title: 'Concurrent with AML',
      icon: <Activity size={20} />,
      gradient: 'from-indigo-600 to-indigo-800',
      points: [
        'Breast deposit detected at the same time as a marrow diagnosis of AML.',
        'Represents extramedullary disease within systemic AML.',
        'Often associated with monocytic differentiation and certain cytogenetic subgroups.',
      ],
    },
    {
      title: 'Relapse / extramedullary recurrence',
      icon: <Repeat size={20} />,
      gradient: 'from-amber-600 to-amber-800',
      points: [
        'May herald systemic relapse of previously treated AML.',
        'Includes isolated extramedullary relapse after allogeneic transplant ("sanctuary site").',
        'Mandates restaging of marrow and CNS as well as the local lesion.',
      ],
    },
    {
      title: 'Transformation of MPN / MDS / CML',
      icon: <Layers size={20} />,
      gradient: 'from-rose-600 to-rose-800',
      points: [
        'A breast deposit may signal blast transformation of an underlying chronic myeloid neoplasm.',
        'Equivalent to progression to acute leukaemia and is treated as such.',
        'Requires review of any prior MPN/MDS/CML history and driver mutation status.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border-l-4 border-blood-700">
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
          Breast myeloid sarcoma classically presents as a <span className="font-semibold text-slate-900">painless,
          firm, often rapidly enlarging mass</span> — unilateral or bilateral — that is clinically and
          radiologically indistinguishable from primary breast carcinoma or lymphoma. The crucial step is to
          recognise that it is an <span className="font-semibold text-slate-900">extramedullary manifestation of
          acute myeloid leukaemia</span>, which can occur in four distinct clinical contexts.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {contexts.map((c) => (
          <motion.div
            key={c.title}
            variants={staggerItem}
            className="glass-panel rounded-2xl overflow-hidden hover-lift border border-slate-200/70 h-full"
          >
            <div className="flex items-center gap-4 p-5 border-b border-slate-100/80">
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-lg`}>
                {c.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">{c.title}</h4>
            </div>
            <ul className="p-5 space-y-3">
              {c.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blood-100 flex items-center justify-center">
                    <ChevronRight size={10} className="text-blood-600" />
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// =====================================================
// DIAGNOSTIC APPROACH (ACCORDION)
// =====================================================
export const DiagnosticApproach: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>('biopsy');

  const steps = [
    {
      id: 'imaging',
      name: 'Imaging',
      tag: 'Localise & stage',
      icon: <Scan size={20} />,
      gradient: 'from-indigo-600 to-indigo-800',
      rationale: 'Imaging characterises the mass but cannot distinguish myeloid sarcoma from carcinoma or lymphoma.',
      items: [
        { label: 'Mammography / Ultrasound', significance: 'Non-specific solid, often hypoechoic mass; frequently reported as suspicious (BI-RADS 4/5).' },
        { label: 'Breast MRI', significance: 'Defines extent and multifocality; appearances overlap with other malignancies.' },
        { label: 'FDG PET-CT', significance: 'Maps systemic and other extramedullary disease; useful for staging and response assessment.' },
        { label: 'CNS imaging', significance: 'Consider if neurological features or high-risk biology; CNS is a recognised sanctuary site.' },
      ],
    },
    {
      id: 'biopsy',
      name: 'Core biopsy & histology',
      tag: 'Tissue is essential',
      icon: <Microscope size={20} />,
      gradient: 'from-blood-600 to-blood-800',
      rationale: 'Core needle biopsy (preferred over FNA) with adequate tissue for morphology, immunohistochemistry and ancillary studies.',
      items: [
        { label: 'Morphology', significance: 'Diffuse infiltrate of medium–large immature myeloid blasts; may show eosinophilic myelocytes.' },
        { label: 'Send fresh tissue', significance: 'Where possible, reserve tissue for flow cytometry and cytogenetic/molecular studies.' },
        { label: 'Touch imprints', significance: 'Cytology can highlight blastic, myeloid morphology supporting the diagnosis.' },
        { label: 'Avoid FNA-only workup', significance: 'Aspirate alone rarely yields a confident diagnosis and risks misclassification.' },
      ],
    },
    {
      id: 'ihc',
      name: 'Immunohistochemistry panel',
      tag: 'Confirm myeloid lineage',
      icon: <Layers size={20} />,
      gradient: 'from-amber-600 to-amber-800',
      rationale: 'A myeloid marker panel confirms lineage and is the single most important step in avoiding misdiagnosis.',
      items: [
        { label: 'MPO (myeloperoxidase)', significance: 'Key granulocytic marker; positivity strongly supports myeloid sarcoma.' },
        { label: 'CD68 (KP1 / PGM1), lysozyme', significance: 'Monocytic/histiocytic differentiation.' },
        { label: 'CD117, CD34', significance: 'Blast / progenitor markers.' },
        { label: 'CD33, CD13, CD43', significance: 'Myeloid-associated antigens; CD43 positive with B/T markers negative.' },
        { label: 'CD56, CD99, TdT', significance: 'Variable; CD56 may indicate monocytic/aggressive phenotype.' },
        { label: 'Exclude mimics', significance: 'CD20/CD3/PAX5 (lymphoma) and cytokeratins (carcinoma) to confirm the differential.' },
      ],
    },
    {
      id: 'flow',
      name: 'Flow cytometry',
      tag: 'Immunophenotype',
      icon: <FlaskConical size={20} />,
      gradient: 'from-emerald-600 to-emerald-800',
      rationale: 'Multiparameter flow on fresh tissue (or marrow) defines the blast immunophenotype and lineage.',
      items: [
        { label: 'Blast gating', significance: 'Identifies a myeloid/monocytic blast population (CD34, CD117, CD33, CD13, HLA-DR).' },
        { label: 'Lineage assignment', significance: 'Distinguishes myeloid from lymphoblastic and mixed-phenotype processes.' },
        { label: 'Aberrant antigens', significance: 'Detects aberrant expression useful for later measurable-residual-disease tracking.' },
      ],
    },
    {
      id: 'genetics',
      name: 'Cytogenetics & molecular',
      tag: 'Risk & targets',
      icon: <Dna size={20} />,
      gradient: 'from-indigo-600 to-indigo-800',
      rationale: 'Genetic characterisation establishes the AML subtype, prognosis and actionable targets.',
      items: [
        { label: 't(8;21)(q22;q22) / RUNX1::RUNX1T1', significance: 'Classically associated with myeloid sarcoma, including breast involvement.' },
        { label: 'inv(16) / CBFB::MYH11', significance: 'Core-binding-factor AML with extramedullary disease.' },
        { label: 'KMT2A (MLL) rearrangements', significance: 'Associated with monocytic differentiation and tissue infiltration.' },
        { label: 'NPM1, FLT3-ITD, and panel testing', significance: 'Refine risk and identify targeted-therapy options (e.g. FLT3 inhibitors).' },
      ],
    },
    {
      id: 'marrow',
      name: 'Bone marrow & staging',
      tag: 'Define disease extent',
      icon: <Syringe size={20} />,
      gradient: 'from-rose-600 to-rose-800',
      rationale: 'Marrow assessment determines whether disease is isolated, concurrent, or relapsed AML.',
      items: [
        { label: 'Aspirate + trephine', significance: 'Morphology and blast percentage to detect marrow involvement.' },
        { label: 'Marrow flow & cytogenetics', significance: 'Confirms/excludes concurrent AML and provides risk stratification.' },
        { label: 'CNS assessment', significance: 'Lumbar puncture where clinically indicated by symptoms or high-risk biology.' },
        { label: 'Baseline organ assessment', significance: 'Cardiac and performance-status work-up before intensive chemotherapy.' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {steps.map((s, idx) => {
        const isOpen = expanded === s.id;
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen ? 'shadow-xl ring-1 ring-blood-200/50' : 'shadow-sm hover:shadow-md'
            }`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : s.id)}
              className="flex items-center gap-4 p-6 w-full text-left group"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:scale-105'}`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-base">{s.name}</h4>
                  <Badge variant="gold">{s.tag}</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{s.rationale}</p>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={springTransition} className="text-slate-400 flex-shrink-0">
                <ChevronDown size={20} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div variants={accordionVariants} initial="collapsed" animate="expanded" exit="exit" className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100/80">
                    <p className="text-xs text-slate-500 italic mb-4">{s.rationale}</p>
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {s.items.map((it) => (
                        <motion.div
                          key={it.label}
                          variants={staggerItem}
                          className="flex items-start gap-3 p-3.5 bg-white/60 rounded-xl border border-slate-100 hover:border-blood-200/50 hover:bg-blood-50/30 transition-all duration-200"
                        >
                          <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blood-100 flex items-center justify-center">
                            <ChevronRight size={10} className="text-blood-600" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">{it.label}</span>
                            <span className="text-[11px] text-slate-500 leading-relaxed">{it.significance}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

// =====================================================
// DIAGNOSTIC PITFALLS
// =====================================================
export const DiagnosticPitfalls: React.FC = () => {
  const pitfalls = [
    {
      mistaken: 'Non-Hodgkin lymphoma',
      why: 'Sheets of monomorphic blastic cells with a high proliferation index look lymphomatous.',
      avoid: 'Always include MPO and CD43; confirm B/T markers (CD20, CD3, PAX5) are negative.',
    },
    {
      mistaken: 'Poorly differentiated carcinoma',
      why: 'A solid breast mass in a woman defaults to carcinoma in the working diagnosis.',
      avoid: 'Cytokeratin negativity plus myeloid-marker positivity (MPO, CD117, lysozyme) redirects the diagnosis.',
    },
    {
      mistaken: 'Inflammatory / benign process',
      why: 'Diffuse infiltration can be read as mastitis or a reactive infiltrate.',
      avoid: 'Recognise the blastic morphology and confirm clonal myeloid phenotype.',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border-l-4 border-amber-500 bg-amber-50/40">
        <div className="flex items-start gap-4">
          <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
          <p className="text-slate-700 leading-relaxed text-sm md:text-base">
            A high proportion of myeloid sarcomas are <span className="font-semibold">misdiagnosed at first
            biopsy</span> — most often as lymphoma — when a myeloid immunohistochemistry panel is not requested.
            In the breast, where carcinoma dominates the differential, the diagnosis is especially easy to miss.
            <span className="font-semibold text-amber-800"> Consider myeloid sarcoma in any undifferentiated or
            "blastic" breast malignancy and add MPO to the panel.</span>
          </p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {pitfalls.map((p) => (
          <motion.div key={p.mistaken} variants={staggerItem} className="glass-panel rounded-2xl p-6 hover-lift border border-slate-200/70 h-full">
            <div className="flex items-center gap-2 text-blood-700 mb-3">
              <XCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Mistaken for</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">{p.mistaken}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              <span className="font-semibold text-slate-700">Why: </span>{p.why}
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-slate-100">
              <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-emerald-700">Avoid it: </span>{p.avoid}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// =====================================================
// MANAGEMENT STRATEGIES
// =====================================================
export const ManagementStrategies: React.FC = () => {
  const strategies = [
    {
      id: 'systemic',
      name: 'Systemic AML-type chemotherapy',
      role: 'Cornerstone',
      variant: 'red' as const,
      icon: <Syringe size={20} />,
      gradient: 'from-blood-600 to-blood-800',
      points: [
        'Treat as systemic AML — intensive induction (e.g. cytarabine plus an anthracycline, "7+3"-type regimens).',
        'Applies even to apparently isolated breast disease, because the natural history is progression to overt AML.',
        'Reduces the risk of, and delays or prevents, marrow relapse compared with local therapy alone.',
      ],
    },
    {
      id: 'transplant',
      name: 'Allogeneic stem cell transplant',
      role: 'Consolidation',
      variant: 'indigo' as const,
      icon: <Repeat size={20} />,
      gradient: 'from-indigo-600 to-indigo-800',
      points: [
        'Considered for consolidation in fit patients, particularly with higher-risk genetics or relapsed disease.',
        'Offers the strongest anti-leukaemic effect and may improve long-term disease control.',
        'Decision is individualised against AML risk stratification, donor availability and fitness.',
      ],
    },
    {
      id: 'targeted',
      name: 'Targeted & risk-adapted therapy',
      role: 'Where applicable',
      variant: 'emerald' as const,
      icon: <Target size={20} />,
      gradient: 'from-emerald-600 to-emerald-800',
      points: [
        'Molecular results guide targeted agents (e.g. FLT3 inhibitors in FLT3-mutated disease).',
        'Core-binding-factor AML [t(8;21), inv(16)] is treated with appropriate favourable-risk regimens.',
        'Enrolment in clinical trials is encouraged given the rarity and limited prospective data.',
      ],
    },
    {
      id: 'radiotherapy',
      name: 'Radiotherapy',
      role: 'Adjunct / local control',
      variant: 'gold' as const,
      icon: <Radiation size={20} />,
      gradient: 'from-amber-600 to-amber-800',
      points: [
        'Useful for local control of bulky, symptomatic, or chemo-refractory/residual disease.',
        'May be used as consolidation to a site of disease, or for palliation.',
        'Not curative on its own — does not address systemic/marrow disease.',
      ],
    },
    {
      id: 'surgery',
      name: 'Surgery',
      role: 'Diagnostic, not therapeutic',
      variant: 'slate' as const,
      icon: <Stethoscope size={20} />,
      gradient: 'from-slate-600 to-slate-800',
      points: [
        'Role is essentially diagnostic (obtaining adequate tissue).',
        'Mastectomy / wide local excision alone does not prevent progression to AML.',
        'Disfiguring surgery should be avoided in favour of systemic treatment.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border-l-4 border-blood-700">
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
          The governing principle is simple but frequently missed: <span className="font-semibold text-slate-900">
          myeloid sarcoma of the breast is systemic acute myeloid leukaemia until proven otherwise, and is treated
          as such.</span> Local measures — surgery or radiotherapy — control the visible lesion but do not alter the
          inevitable progression to marrow disease. Systemic chemotherapy, with transplant consolidation in selected
          patients, is the backbone of curative-intent therapy.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {strategies.map((s) => (
          <motion.div key={s.id} variants={staggerItem} className="glass-panel rounded-2xl overflow-hidden hover-lift border border-slate-200/70 h-full">
            <div className="flex items-center gap-4 p-5 border-b border-slate-100/80">
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{s.name}</h4>
                <Badge variant={s.variant}>{s.role}</Badge>
              </div>
            </div>
            <ul className="p-5 space-y-3">
              {s.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blood-100 flex items-center justify-center">
                    <ArrowRight size={10} className="text-blood-600" />
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// =====================================================
// MANAGEMENT PATHWAY (VISUAL FLOW)
// =====================================================
export const ManagementPathway: React.FC = () => {
  const stages = [
    { step: '01', title: 'Tissue diagnosis', detail: 'Core biopsy + myeloid IHC panel (MPO, CD117, CD34, CD43, lysozyme) confirm myeloid sarcoma.', icon: <Microscope size={18} /> },
    { step: '02', title: 'Stage the disease', detail: 'Bone marrow, flow cytometry, cytogenetics/molecular, ± CNS and PET-CT define isolated vs systemic AML.', icon: <Scan size={18} /> },
    { step: '03', title: 'Systemic induction', detail: 'AML-type intensive chemotherapy is started — regardless of apparently isolated disease.', icon: <Syringe size={18} /> },
    { step: '04', title: 'Consolidate', detail: 'Risk-adapted consolidation: further chemotherapy, targeted agents, and allogeneic transplant in selected patients.', icon: <Repeat size={18} /> },
    { step: '05', title: 'Local control & follow-up', detail: 'Radiotherapy for residual/symptomatic disease; monitor marrow and the local site for relapse.', icon: <Radiation size={18} /> },
  ];

  return (
    <div className="relative">
      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blood-300 via-blood-500 to-blood-300 hidden sm:block" />
      <div className="space-y-4">
        {stages.map((s, idx) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="relative flex items-start gap-5"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blood-700 to-blood-900 flex items-center justify-center text-white shadow-lg shadow-blood-900/20 z-10">
              {s.icon}
            </div>
            <div className="glass-panel rounded-2xl p-5 flex-1 border border-slate-200/70 hover-lift">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[10px] font-black text-blood-600 tracking-widest">STEP {s.step}</span>
                <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// REFERENCES
// =====================================================
export interface Reference {
  authors: string;
  year: string;
  title: string;
  source: string;
  doi?: string;
  pmid?: string;
}

export const References: React.FC<{ references: Reference[] }> = ({ references }) => (
  <motion.ol
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    className="space-y-3"
  >
    {references.map((r, idx) => {
      const href = r.doi ? `https://doi.org/${r.doi}` : r.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` : undefined;
      return (
        <motion.li
          key={idx}
          variants={staggerItem}
          className="glass-panel rounded-xl p-4 border border-slate-200/70 hover:border-blood-200/60 transition-colors flex gap-4"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blood-50 border border-blood-200 flex items-center justify-center text-[11px] font-black text-blood-700">
            {idx + 1}
          </span>
          <div className="text-xs leading-relaxed text-slate-600">
            <span className="text-slate-800 font-semibold">{r.authors}</span> ({r.year}).{' '}
            <span className="italic">{r.title}</span>. {r.source}.
            {href && (
              <>
                {' '}
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blood-600 hover:text-blood-800 font-semibold inline-flex items-center gap-1">
                  {r.doi ? `doi:${r.doi}` : `PMID:${r.pmid}`}
                  <BookOpen size={11} />
                </a>
              </>
            )}
          </div>
        </motion.li>
      );
    })}
  </motion.ol>
);
