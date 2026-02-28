import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, Heart, Activity, Droplets,
  Stethoscope, Scan, Syringe, Zap, Clock, ChevronRight,
  ChevronDown, ShieldAlert, FlaskConical, FileText, Wind,
  MonitorCheck, CircleDot, ArrowRightCircle, TrendingUp,
  Target, Eye, Info, Minus, Plus, TriangleAlert
} from 'lucide-react';

// ─── Shared animation variants ───────────────────────
const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

const accordionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1, transition: { ...springTransition, opacity: { duration: 0.3, delay: 0.1 } } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const tabContentVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

// ─── Reusable Badge ──────────────────────────────────
const Badge: React.FC<{ children: React.ReactNode; variant?: 'red' | 'gold' | 'slate' | 'emerald' | 'indigo' | 'custom'; className?: string }> = ({
  children, variant = 'slate', className = ''
}) => {
  const colors: Record<string, string> = {
    red: 'bg-blood-50 text-blood-700 border-blood-200',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    custom: ''
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
};

// =====================================================
// BEDSIDE / IMMEDIATE INVESTIGATIONS
// =====================================================
export const BedsideInvestigations: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>('ecg');

  const investigations = [
    {
      id: 'ecg',
      name: '12-Lead ECG',
      urgency: 'Immediate',
      icon: <Activity size={20} />,
      gradient: 'from-blood-600 to-blood-800',
      rationale: 'Exclude MI as differential. May reveal RV strain pattern supporting PE diagnosis.',
      findings: [
        { label: 'Sinus tachycardia', significance: 'Most common finding (~40%)' },
        { label: 'S1Q3T3 pattern', significance: 'Classic but low sensitivity (~20%)' },
        { label: 'Right axis deviation', significance: 'Suggests acute RV pressure overload' },
        { label: 'RBBB (new)', significance: 'Acute right heart strain' },
        { label: 'T-wave inversion V1-V4', significance: 'RV strain; correlates with severity' },
        { label: 'P pulmonale', significance: 'Right atrial enlargement' }
      ]
    },
    {
      id: 'obs',
      name: 'Vital Signs & Observations',
      urgency: 'Immediate',
      icon: <MonitorCheck size={20} />,
      gradient: 'from-amber-600 to-amber-800',
      rationale: 'Assess haemodynamic stability and oxygen status. Guides risk stratification.',
      findings: [
        { label: 'Heart rate', significance: 'Tachycardia >100 bpm common; used in Wells/Geneva' },
        { label: 'Blood pressure', significance: 'Hypotension (SBP <90) defines massive PE' },
        { label: 'Respiratory rate', significance: 'Tachypnoea; often >20/min' },
        { label: 'SpO\u2082', significance: 'Hypoxaemia; may be normal in small PE' },
        { label: 'Temperature', significance: 'Low-grade pyrexia possible; exclude infection' },
        { label: 'JVP', significance: 'Elevated JVP suggests RV failure' }
      ]
    },
    {
      id: 'pocus',
      name: 'Point-of-Care Ultrasound',
      urgency: 'Within 30 min',
      icon: <Scan size={20} />,
      gradient: 'from-indigo-600 to-indigo-800',
      rationale: 'Rapid bedside assessment of RV function in haemodynamically unstable patients where CTPA is not immediately feasible.',
      findings: [
        { label: 'RV dilatation (RV:LV >1:1)', significance: 'Suggests significant PE burden' },
        { label: 'McConnell sign', significance: 'RV free wall hypokinesis with apical sparing; highly specific' },
        { label: 'Interventricular septum bowing', significance: 'D-shaped LV; RV pressure overload' },
        { label: 'TAPSE <16mm', significance: 'Reduced RV systolic function' },
        { label: 'IVC dilatation', significance: 'Elevated RA pressure' },
        { label: 'Femoral vein DVT', significance: 'Supports diagnosis if identified' }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {investigations.map((inv, idx) => {
        const isOpen = expanded === inv.id;
        return (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen ? 'shadow-xl ring-1 ring-blood-200/50' : 'shadow-sm hover:shadow-md'
            }`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : inv.id)}
              className="flex items-center gap-4 p-6 w-full text-left group"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${inv.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:scale-105'}`}>
                {inv.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-900 text-base">{inv.name}</h4>
                  <Badge variant="red">{inv.urgency}</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{inv.rationale}</p>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={springTransition}
                className="text-slate-400 flex-shrink-0"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  variants={accordionVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100/80">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-blood-200 to-transparent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Key Findings & Significance
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-blood-200 to-transparent" />
                    </div>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-2.5"
                    >
                      {inv.findings.map((f) => (
                        <motion.div
                          key={f.label}
                          variants={staggerItem}
                          className="flex items-start gap-3 p-3.5 bg-white/60 rounded-xl border border-slate-100 hover:border-blood-200/50 hover:bg-blood-50/30 transition-all duration-200 group/item"
                        >
                          <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blood-100 flex items-center justify-center group-hover/item:bg-blood-200 transition-colors">
                            <ChevronRight size={10} className="text-blood-600" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">{f.label}</span>
                            <span className="text-[11px] text-slate-500 leading-relaxed">{f.significance}</span>
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
// BLOOD INVESTIGATIONS (LABORATORY)
// =====================================================
export const BloodInvestigations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('diagnostic');

  const categories = [
    { id: 'diagnostic', label: 'Diagnostic', icon: <Target size={14} />, color: 'blood' },
    { id: 'severity', label: 'Severity', icon: <TrendingUp size={14} />, color: 'amber' },
    { id: 'baseline', label: 'Baseline & Safety', icon: <ShieldAlert size={14} />, color: 'indigo' }
  ];

  const colorMap: Record<string, { active: string; ring: string }> = {
    blood: { active: 'bg-gradient-to-r from-blood-700 to-blood-800 text-white shadow-lg shadow-blood-200', ring: 'ring-blood-200' },
    amber: { active: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-200', ring: 'ring-amber-200' },
    indigo: { active: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200', ring: 'ring-indigo-200' }
  };

  const investigations: Record<string, Array<{
    name: string;
    sample: string;
    rationale: string;
    interpretation: string;
    critical?: string;
  }>> = {
    diagnostic: [
      {
        name: 'D-dimer',
        sample: 'Citrated blood',
        rationale: 'High negative predictive value. Used to exclude PE in low-to-intermediate pre-test probability.',
        interpretation: 'Negative D-dimer (<500 ng/mL, or age-adjusted <age x 10 in patients >50) effectively excludes PE when pre-test probability is low/intermediate.',
        critical: 'Do NOT use D-dimer alone to confirm PE. Elevated in many conditions (infection, malignancy, pregnancy, post-operative).'
      },
      {
        name: 'Arterial Blood Gas (ABG)',
        sample: 'Arterial puncture',
        rationale: 'Assess oxygenation and acid-base status. Guides need for respiratory support.',
        interpretation: 'Type 1 respiratory failure (low PaO\u2082, low/normal PaCO\u2082) is typical. Elevated A-a gradient. Respiratory alkalosis early; metabolic acidosis if shocked.',
        critical: 'A normal ABG does NOT exclude PE. Small PE may have normal gas exchange.'
      }
    ],
    severity: [
      {
        name: 'High-sensitivity Troponin (hs-cTnI/T)',
        sample: 'Serum / Lithium heparin',
        rationale: 'Detects myocardial injury from RV strain. Prognostic marker for adverse outcomes.',
        interpretation: 'Elevated troponin indicates RV myocardial injury and is associated with higher short-term mortality. Used in risk stratification (sPESI + troponin + RV dysfunction).',
        critical: 'Must be interpreted alongside imaging (echo/CT). Elevated troponin alone does not mandate thrombolysis.'
      },
      {
        name: 'BNP / NT-proBNP',
        sample: 'EDTA / Serum',
        rationale: 'Marker of RV wall stress and volume overload. Prognostic value in risk stratification.',
        interpretation: 'BNP >100 pg/mL or NT-proBNP >600 pg/mL associated with RV dysfunction and worse prognosis. Low values have excellent negative predictive value for adverse outcome.',
      },
      {
        name: 'Lactate',
        sample: 'Arterial / Venous blood',
        rationale: 'Marker of tissue hypoperfusion and haemodynamic compromise.',
        interpretation: 'Elevated lactate (>2 mmol/L) suggests significant haemodynamic compromise and is associated with increased mortality in acute PE.',
      }
    ],
    baseline: [
      {
        name: 'Full Blood Count (FBC)',
        sample: 'EDTA',
        rationale: 'Baseline haematological parameters. Assess for anaemia, thrombocytopenia (HIT risk), infection.',
        interpretation: 'Check platelet count before anticoagulation (HIT risk with heparin). Leucocytosis may indicate infection as alternative/co-diagnosis.'
      },
      {
        name: 'Coagulation Screen (PT/APTT/INR/Fibrinogen)',
        sample: 'Citrated blood',
        rationale: 'Baseline clotting before anticoagulation. Monitor heparin therapy. Assess for coagulopathy.',
        interpretation: 'Baseline PT/INR essential before warfarin. APTT for heparin monitoring. Low fibrinogen may suggest DIC in massive PE.',
        critical: 'Prolonged APTT may indicate antiphospholipid syndrome \u2014 a risk factor for VTE.'
      },
      {
        name: 'Renal Function (U&E/Creatinine)',
        sample: 'Serum / Lithium heparin',
        rationale: 'Assess renal function for anticoagulant dosing. Many DOACs and LMWH require renal adjustment.',
        interpretation: 'eGFR <30: avoid rivaroxaban/apixaban or dose-reduce. CrCl <30: LMWH accumulates \u2014 switch to UFH. Electrolyte derangement may affect cardiac rhythm.'
      },
      {
        name: 'Liver Function Tests (LFTs)',
        sample: 'Serum / Lithium heparin',
        rationale: 'Hepatic congestion from RV failure may elevate transaminases. Baseline before anticoagulation.',
        interpretation: 'Elevated ALT/AST may reflect hepatic congestion from acute RV failure. Severe hepatic dysfunction affects anticoagulant metabolism.'
      },
      {
        name: 'Thyroid Function Tests',
        sample: 'Serum',
        rationale: 'Thyrotoxicosis can cause sinus tachycardia and dyspnoea mimicking PE. Also a risk factor for AF and VTE.',
        interpretation: 'Consider if tachycardia is disproportionate or if PE is excluded. Hyperthyroidism is an independent risk factor for VTE.'
      }
    ]
  };

  const activeInvestigations = investigations[activeCategory] || [];
  const activeColor = categories.find(c => c.id === activeCategory)?.color || 'blood';

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const colors = colorMap[cat.color];
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                isActive
                  ? colors.active
                  : 'bg-white/80 text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.icon}
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={tabContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="space-y-4"
        >
          {activeInvestigations.map((inv, idx) => (
            <motion.div
              key={inv.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="glass-panel p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-xl bg-gradient-to-br from-blood-100 to-blood-50 flex items-center justify-center border border-blood-200/50 group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical size={18} className="text-blood-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h5 className="font-bold text-slate-900 text-base">{inv.name}</h5>
                    <Badge variant="slate">{inv.sample}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{inv.rationale}</p>

                  {/* Interpretation Box */}
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye size={12} className="text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interpretation</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{inv.interpretation}</p>
                  </div>

                  {/* Critical Warning */}
                  {inv.critical && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 p-4 bg-gradient-to-r from-blood-50 to-red-50 rounded-xl border border-blood-200/60 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blood-100 flex items-center justify-center mt-0.5">
                        <TriangleAlert size={12} className="text-blood-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blood-600 block mb-1">Clinical Pearl</span>
                        <p className="text-[11px] text-blood-800 leading-relaxed font-medium">{inv.critical}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// =====================================================
// IMAGING INVESTIGATIONS
// =====================================================
export const ImagingInvestigations: React.FC = () => {
  const [activeImaging, setActiveImaging] = useState<string | null>(null);

  const imaging = [
    {
      id: 'ctpa',
      name: 'CT Pulmonary Angiography (CTPA)',
      badge: 'Gold Standard',
      badgeVariant: 'gold' as const,
      icon: <Scan size={20} />,
      gradient: 'from-amber-600 to-amber-800',
      sensitivity: '83-100%',
      specificity: '89-97%',
      indication: 'First-line imaging for haemodynamically stable patients with suspected PE and positive D-dimer or high clinical probability.',
      advantages: [
        'Rapid acquisition (seconds)',
        'High sensitivity for segmental and larger PE',
        'Provides alternative diagnoses',
        'Assesses RV/LV ratio for risk stratification',
        'Widely available 24/7'
      ],
      limitations: [
        'IV contrast required (nephrotoxicity, allergy)',
        'Radiation exposure (~7 mSv)',
        'Less sensitive for subsegmental PE',
        'Requires patient cooperation for breath-hold',
        'May be non-diagnostic in poor cardiac output'
      ],
      keyFindings: 'Intraluminal filling defect within pulmonary arteries. RV/LV ratio >0.9 indicates RV strain and higher mortality risk.'
    },
    {
      id: 'vq',
      name: 'V/Q Scan (Ventilation/Perfusion)',
      badge: 'Alternative',
      badgeVariant: 'indigo' as const,
      icon: <Wind size={20} />,
      gradient: 'from-indigo-600 to-indigo-800',
      sensitivity: '77-98%',
      specificity: '90-98%',
      indication: 'Preferred when CTPA is contraindicated: contrast allergy, severe renal impairment (eGFR <30), pregnancy.',
      advantages: [
        'No IV contrast needed',
        'Lower radiation dose to breast tissue',
        'Useful in renal impairment',
        'High NPV when normal scan result',
        'Can be performed as perfusion-only SPECT'
      ],
      limitations: [
        'High non-diagnostic rate (~30-40%)',
        'Less useful with abnormal CXR',
        'Less widely available out of hours',
        'Does not provide alternative diagnosis',
        'Requires SPECT for optimal accuracy'
      ],
      keyFindings: 'Reported as normal, low, intermediate, or high probability. High probability = 2+ large segmental perfusion defects with normal ventilation (mismatch).'
    },
    {
      id: 'cxr',
      name: 'Chest X-Ray (CXR)',
      badge: 'Baseline',
      badgeVariant: 'slate' as const,
      icon: <FileText size={20} />,
      gradient: 'from-slate-600 to-slate-800',
      sensitivity: 'Low',
      specificity: 'Low',
      indication: 'Not diagnostic for PE but essential to exclude other causes of dyspnoea and chest pain.',
      advantages: [
        'Rapid, widely available, low cost',
        'Low radiation dose',
        'Excludes important differentials',
        'Guides V/Q scan interpretation',
        'Portable bedside imaging available'
      ],
      limitations: [
        'Cannot diagnose or exclude PE',
        'Often normal in PE patients',
        'Classic signs are rare and unreliable',
        'Non-specific findings common'
      ],
      keyFindings: 'Often normal. May show: pleural effusion, atelectasis, elevated hemidiaphragm. Classic but rare: Westermark sign, Hampton hump, Fleischner sign.'
    },
    {
      id: 'echo',
      name: 'Echocardiography (TTE)',
      badge: 'Risk Stratification',
      badgeVariant: 'red' as const,
      icon: <Heart size={20} />,
      gradient: 'from-blood-600 to-blood-800',
      sensitivity: '60-70%',
      specificity: '90%',
      indication: 'Essential in haemodynamically unstable patients. Key role in risk stratification of submassive PE.',
      advantages: [
        'Bedside assessment without transport',
        'No radiation or contrast',
        'Assesses RV function in real-time',
        'Can guide thrombolysis decision',
        'Identifies alternative diagnoses'
      ],
      limitations: [
        'Cannot directly visualise thrombus (usually)',
        'Normal echo does not exclude PE',
        'Operator-dependent',
        'Limited acoustic window in some patients',
        'RV changes may reflect chronic disease'
      ],
      keyFindings: 'RV dilatation (RV:LV >1:1), McConnell sign, tricuspid regurgitation, raised PASP, IVC dilatation, 60/60 sign.'
    },
    {
      id: 'cus',
      name: 'Compression Ultrasound (Lower Limbs)',
      badge: 'Supportive',
      badgeVariant: 'emerald' as const,
      icon: <Stethoscope size={20} />,
      gradient: 'from-emerald-600 to-emerald-800',
      sensitivity: '90-95%',
      specificity: '95-99%',
      indication: 'Positive CUS in suspected PE can confirm VTE diagnosis without CTPA.',
      advantages: [
        'Non-invasive, no radiation, no contrast',
        'Rapid bedside test',
        'Positive result confirms VTE',
        'Can avoid CTPA in some patients',
        'Useful in pregnancy'
      ],
      limitations: [
        'Does not directly diagnose PE',
        'Only ~30-50% of PE patients have DVT',
        'Limited for calf/iliac vein DVT',
        'Operator-dependent accuracy',
        'Negative result does not exclude PE'
      ],
      keyFindings: 'Non-compressible venous segment indicates DVT. Check common femoral vein and popliteal vein as minimum.'
    }
  ];

  return (
    <div className="space-y-4">
      {imaging.map((img, idx) => {
        const isOpen = activeImaging === img.id;
        return (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen ? 'shadow-xl ring-1 ring-blood-200/50' : 'shadow-sm hover:shadow-md'
            }`}
          >
            <button
              onClick={() => setActiveImaging(isOpen ? null : img.id)}
              className="flex items-center gap-4 p-6 w-full text-left group"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${img.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:scale-105'}`}>
                {img.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-900 text-base">{img.name}</h4>
                  <Badge variant={img.badgeVariant}>{img.badge}</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{img.indication}</p>
              </div>
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Sens.</span>
                  <span className="text-sm font-bold text-blood-700">{img.sensitivity}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Spec.</span>
                  <span className="text-sm font-bold text-med-blue">{img.specificity}</span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={springTransition}
                className="text-slate-400 flex-shrink-0 ml-2"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  variants={accordionVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-slate-100/80 pt-5">
                    {/* Mobile stats */}
                    <div className="flex gap-3 md:hidden mb-5">
                      <div className="flex-1 p-3 bg-blood-50/50 rounded-xl border border-blood-100 text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blood-400 block">Sensitivity</span>
                        <span className="text-base font-bold text-blood-700">{img.sensitivity}</span>
                      </div>
                      <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Specificity</span>
                        <span className="text-base font-bold text-med-blue">{img.specificity}</span>
                      </div>
                    </div>

                    {/* Advantages / Limitations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-50/30 rounded-xl border border-emerald-200/60">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Advantages</span>
                        </div>
                        <ul className="space-y-2">
                          {img.advantages.map((a) => (
                            <li key={a} className="text-xs text-emerald-800 flex items-start gap-2.5 leading-relaxed">
                              <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-5 bg-gradient-to-br from-red-50 to-red-50/30 rounded-xl border border-red-200/60">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle size={14} className="text-red-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Limitations</span>
                        </div>
                        <ul className="space-y-2">
                          {img.limitations.map((l) => (
                            <li key={l} className="text-xs text-red-800 flex items-start gap-2.5 leading-relaxed">
                              <div className="mt-1.5 w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                              {l}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Key Findings */}
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Key Findings</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{img.keyFindings}</p>
                    </div>
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
// WELLS SCORE CALCULATOR
// =====================================================
export const WellsScoreCalculator: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const criteria = [
    { id: 'dvt', label: 'Clinical signs/symptoms of DVT', points: 3 },
    { id: 'alternative', label: 'PE is #1 diagnosis or equally likely', points: 3 },
    { id: 'hr', label: 'Heart rate >100 bpm', points: 1.5 },
    { id: 'immobilisation', label: 'Immobilisation (>3 days) or surgery in previous 4 weeks', points: 1.5 },
    { id: 'previous', label: 'Previous DVT/PE', points: 1.5 },
    { id: 'haemoptysis', label: 'Haemoptysis', points: 1 },
    { id: 'malignancy', label: 'Malignancy (treatment within 6 months or palliative)', points: 1 }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const score = criteria.reduce((total, c) => total + (selected.includes(c.id) ? c.points : 0), 0);

  const getRisk = () => {
    if (score <= 1) return { level: 'Low', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30', action: 'D-dimer testing. If negative, PE excluded.' };
    if (score <= 4) return { level: 'Intermediate', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500', glow: 'shadow-amber-500/30', action: 'D-dimer testing. If positive, proceed to CTPA.' };
    return { level: 'High', color: 'from-red-500 to-red-600', bg: 'bg-red-600', glow: 'shadow-red-500/30', action: 'Proceed directly to CTPA. Do not rely on D-dimer.' };
  };

  const risk = getRisk();

  return (
    <div className="relative glass-dark p-8 rounded-2xl overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-med-gold/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blood-600/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-med-gold to-amber-600 flex items-center justify-center shadow-lg">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-white">Wells Score for PE</h3>
            <p className="text-slate-400 text-xs">Validated clinical decision rule \u2022 ESC/ERS Guidelines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          {/* Criteria (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            {criteria.map((c) => {
              const isSelected = selected.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-4 p-4 rounded-xl w-full text-left transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white/10 border-med-gold/40 shadow-lg shadow-med-gold/5'
                      : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07]'
                  }`}
                >
                  <motion.div
                    animate={{ scale: isSelected ? 1.15 : 1 }}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-med-gold bg-med-gold' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <CheckCircle2 size={14} className="text-slate-900" />}
                  </motion.div>
                  <span className={`text-sm flex-1 transition-colors ${isSelected ? 'text-white font-medium' : 'text-slate-400'}`}>
                    {c.label}
                  </span>
                  <motion.span
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-med-gold text-slate-900 shadow-lg shadow-med-gold/20'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    +{c.points}
                  </motion.span>
                </motion.button>
              );
            })}
          </div>

          {/* Score Display (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-black/20 rounded-2xl border border-white/[0.06]">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">Total Score</span>
            <motion.div
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springTransition}
              className="text-6xl font-serif text-white mb-5 tabular-nums"
            >
              {score}
            </motion.div>

            <motion.div
              key={risk.level}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className={`text-base font-serif text-white px-6 py-2.5 rounded-full bg-gradient-to-r ${risk.color} shadow-xl ${risk.glow} mb-6`}
            >
              {risk.level} Probability
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
              <motion.div
                animate={{ width: `${Math.min((score / 12.5) * 100, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${risk.color}`}
              />
            </div>

            <div className="p-4 bg-white/[0.04] rounded-xl border border-white/[0.08] w-full">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightCircle size={12} className="text-med-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recommended Action</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{risk.action}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// sPESI SCORE (SEVERITY / PROGNOSIS)
// =====================================================
export const SPESICalculator: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const criteria = [
    { id: 'age', label: 'Age >80 years', icon: <Clock size={16} /> },
    { id: 'cancer', label: 'Active cancer', icon: <CircleDot size={16} /> },
    { id: 'heartfailure', label: 'Heart failure or chronic lung disease', icon: <Heart size={16} /> },
    { id: 'hr', label: 'Heart rate \u2265110 bpm', icon: <Activity size={16} /> },
    { id: 'sbp', label: 'Systolic BP <100 mmHg', icon: <TrendingUp size={16} /> },
    { id: 'spo2', label: 'SpO\u2082 <90%', icon: <Wind size={16} /> }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const score = selected.length;
  const isLowRisk = score === 0;

  return (
    <div className="glass-panel p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blood-600 to-blood-800 flex items-center justify-center shadow-lg">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-serif text-2xl text-slate-900">Simplified PESI (sPESI)</h3>
          <p className="text-slate-500 text-xs">Risk stratification of confirmed PE \u2022 Identifies outpatient candidates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        {/* Criteria (3 cols) */}
        <div className="lg:col-span-3 space-y-2.5">
          {criteria.map((c) => {
            const isSelected = selected.includes(c.id);
            return (
              <motion.button
                key={c.id}
                onClick={() => toggle(c.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center gap-4 p-4 rounded-xl w-full text-left transition-all duration-300 border ${
                  isSelected
                    ? 'bg-blood-50 border-blood-200 shadow-md shadow-blood-100/50'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isSelected ? 'bg-blood-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {c.icon}
                </div>
                <span className={`text-sm flex-1 transition-colors ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                  {c.label}
                </span>
                <motion.div
                  animate={{ scale: isSelected ? 1.1 : 1 }}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-blood-600 bg-blood-600' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <CheckCircle2 size={14} className="text-white" />}
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Score Display (2 cols) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">sPESI Score</span>
          <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springTransition}
            className="text-6xl font-serif text-slate-900 mb-5 tabular-nums"
          >
            {score}
          </motion.div>

          <motion.div
            key={isLowRisk ? 'low' : 'high'}
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className={`text-base font-serif text-white px-6 py-2.5 rounded-full shadow-xl mb-6 ${
              isLowRisk
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-200'
                : 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-200'
            }`}
          >
            {isLowRisk ? 'Low Risk' : 'High Risk'}
          </motion.div>

          <div className="space-y-3 w-full">
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">30-Day Mortality</span>
              <motion.span
                key={isLowRisk ? '1' : '10.9'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-2xl font-serif font-bold ${isLowRisk ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {isLowRisk ? '1.0%' : '10.9%'}
              </motion.span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightCircle size={12} className="text-blood-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Management</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isLowRisk
                  ? 'Consider outpatient management with DOAC if no other contraindications (Hestia criteria met, adequate support).'
                  : 'Inpatient management. Further stratify with troponin + echo/CT RV assessment. Consider ICU if haemodynamically unstable.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// INVESTIGATION SUMMARY TABLE
// =====================================================
export const InvestigationSummaryTable: React.FC = () => {
  const investigations = [
    { category: 'Bedside', tests: ['12-lead ECG', 'Vital signs', 'POCUS'], timing: 'Immediate', timingColor: 'bg-blood-100 text-blood-700 border-blood-200', purpose: 'Initial assessment & haemodynamic status', icon: <Stethoscope size={16} /> },
    { category: 'Diagnostic Bloods', tests: ['D-dimer', 'ABG'], timing: '< 1 hour', timingColor: 'bg-amber-100 text-amber-700 border-amber-200', purpose: 'Exclude PE or assess gas exchange', icon: <Droplets size={16} /> },
    { category: 'Severity Markers', tests: ['hs-Troponin', 'BNP/NT-proBNP', 'Lactate'], timing: '< 1 hour', timingColor: 'bg-amber-100 text-amber-700 border-amber-200', purpose: 'Risk stratification & prognosis', icon: <TrendingUp size={16} /> },
    { category: 'Baseline Bloods', tests: ['FBC', 'U&E', 'LFTs', 'Coagulation', 'TFTs'], timing: '< 4 hours', timingColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', purpose: 'Safe anticoagulation & organ function', icon: <FlaskConical size={16} /> },
    { category: 'Imaging', tests: ['CTPA', 'V/Q scan', 'CXR', 'Echo', 'Leg CUS'], timing: 'As indicated', timingColor: 'bg-slate-100 text-slate-600 border-slate-200', purpose: 'Confirm PE, assess severity, identify DVT', icon: <Scan size={16} /> }
  ];

  return (
    <div className="overflow-x-auto glass-panel rounded-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-slate-200/80">
            <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
            <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Investigations</th>
            <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timing</th>
            <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {investigations.map((row, idx) => (
            <motion.tr
              key={row.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="border-b border-slate-100/80 hover:bg-blood-50/20 transition-colors group"
            >
              <td className="py-5 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blood-100 group-hover:text-blood-600 transition-colors">
                    {row.icon}
                  </div>
                  <span className="font-bold text-sm text-slate-900">{row.category}</span>
                </div>
              </td>
              <td className="py-5 px-5">
                <div className="flex flex-wrap gap-1.5">
                  {row.tests.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-5 px-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border ${row.timingColor}`}>
                  <Clock size={10} className="mr-1.5" />
                  {row.timing}
                </span>
              </td>
              <td className="py-5 px-5 hidden md:table-cell">
                <span className="text-xs text-slate-500 leading-relaxed">{row.purpose}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =====================================================
// DIAGNOSTIC ALGORITHM PATHWAY
// =====================================================
export const DiagnosticAlgorithm: React.FC = () => {
  const [activePath, setActivePath] = useState<string | null>(null);

  const steps = [
    {
      id: 'suspicion',
      step: 1,
      title: 'Clinical Suspicion',
      description: 'Dyspnoea, chest pain, tachycardia, haemoptysis, DVT symptoms, risk factors',
      icon: <Stethoscope size={20} />,
      action: 'Assess pre-test probability',
      gradient: 'from-slate-600 to-slate-800'
    },
    {
      id: 'probability',
      step: 2,
      title: 'Pre-Test Probability',
      description: 'Wells Score or Revised Geneva Score',
      icon: <FileText size={20} />,
      action: 'Stratify into low / intermediate / high risk',
      gradient: 'from-indigo-600 to-indigo-800'
    },
    {
      id: 'ddimer',
      step: 3,
      title: 'D-dimer (if low/intermediate)',
      description: 'Age-adjusted D-dimer cut-off',
      icon: <Droplets size={20} />,
      action: 'Negative = PE excluded | Positive = proceed to imaging',
      gradient: 'from-amber-600 to-amber-800'
    },
    {
      id: 'imaging',
      step: 4,
      title: 'Definitive Imaging',
      description: 'CTPA (first-line) or V/Q scan (if CTPA contraindicated)',
      icon: <Scan size={20} />,
      action: 'Confirm or exclude PE diagnosis',
      gradient: 'from-blood-600 to-blood-800'
    },
    {
      id: 'stratify',
      step: 5,
      title: 'Severity Stratification',
      description: 'sPESI + Troponin + Echo/CT RV assessment',
      icon: <Activity size={20} />,
      action: 'Guide inpatient vs outpatient management',
      gradient: 'from-emerald-600 to-emerald-800'
    }
  ];

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-6 md:left-8 top-12 bottom-12 w-px bg-gradient-to-b from-slate-300 via-blood-300 to-emerald-300 hidden sm:block" />

      <div className="space-y-4">
        {steps.map((s, idx) => {
          const isActive = activePath === s.id;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.4 }}
              onMouseEnter={() => setActivePath(s.id)}
              onMouseLeave={() => setActivePath(null)}
              className={`relative flex items-start gap-5 md:gap-6 p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 cursor-default ${
                isActive
                  ? 'border-blood-300/60 bg-white shadow-xl shadow-blood-100/30'
                  : 'border-slate-100 bg-white/80 hover:border-slate-200'
              }`}
            >
              {/* Step Circle */}
              <div className="relative z-10 flex flex-col items-center gap-2 flex-shrink-0">
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={springTransition}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 bg-gradient-to-br ${
                    isActive ? s.gradient : 'from-slate-300 to-slate-400'
                  }`}
                >
                  {s.icon}
                </motion.div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? 'text-blood-600' : 'text-slate-400'
                }`}>
                  Step {s.step}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <h4 className={`font-serif text-lg md:text-xl transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-700'
                }`}>
                  {s.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 mb-3">{s.description}</p>
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.5, x: isActive ? 0 : -4 }}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <ArrowRightCircle size={14} className={`flex-shrink-0 transition-colors ${isActive ? 'text-blood-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-700">{s.action}</span>
                </motion.div>
              </div>

              {/* Step indicator for desktop */}
              {idx < steps.length - 1 && (
                <div className="absolute -bottom-4 left-[31px] md:left-[39px] z-20 w-2 h-2 rounded-full bg-slate-300 border-2 border-white hidden sm:block" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
