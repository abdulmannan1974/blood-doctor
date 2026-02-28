import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, Activity, Droplets,
  Stethoscope, Scan, ChevronRight,
  ChevronDown, ShieldAlert, FlaskConical, FileText,
  MonitorCheck, ArrowRightCircle, Zap, TrendingUp
} from 'lucide-react';

// =====================================================
// ANIMATED CARD WRAPPER
// =====================================================
const AnimatedCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// =====================================================
// BEDSIDE / IMMEDIATE INVESTIGATIONS
// =====================================================
export const BedsideInvestigations: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const investigations = [
    {
      id: 'ecg',
      name: '12-Lead ECG',
      urgency: 'Immediate',
      icon: <Activity size={20} />,
      gradient: 'from-red-600 to-rose-700',
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
      gradient: 'from-amber-600 to-orange-700',
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
      gradient: 'from-blue-600 to-indigo-700',
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
      {investigations.map((inv, index) => (
        <AnimatedCard key={inv.id} delay={index * 0.1}>
          <motion.div
            className={`glass-panel rounded-2xl overflow-hidden card-hover ${
              expanded === inv.id ? 'glow-red' : ''
            }`}
            layout
          >
            <div
              onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}
              className="flex items-center gap-4 p-6 cursor-pointer group"
            >
              <motion.div
                className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${inv.gradient} flex items-center justify-center text-white shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {inv.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-white text-lg">{inv.name}</h4>
                  <motion.span
                    className="px-2.5 py-0.5 bg-red-950/50 border border-red-800/40 rounded-full text-[9px] font-black text-red-400 uppercase tracking-[0.15em]"
                    whileHover={{ scale: 1.05 }}
                  >
                    {inv.urgency}
                  </motion.span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{inv.rationale}</p>
              </div>
              <motion.div
                className="text-slate-500 flex-shrink-0"
                animate={{ rotate: expanded === inv.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={20} />
              </motion.div>
            </div>

            <AnimatePresence>
              {expanded === inv.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-4 font-mono">
                      Key Findings & Significance
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {inv.findings.map((f, fi) => (
                        <motion.div
                          key={f.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: fi * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] transition-colors group"
                        >
                          <ChevronRight size={14} className="text-red-500 mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          <div>
                            <span className="text-xs font-bold text-white block">{f.label}</span>
                            <span className="text-[10px] text-slate-400 italic">{f.significance}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatedCard>
      ))}
    </div>
  );
};

// =====================================================
// BLOOD INVESTIGATIONS (LABORATORY)
// =====================================================
export const BloodInvestigations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('diagnostic');

  const categories = [
    { id: 'diagnostic', label: 'Diagnostic', gradient: 'from-red-600 to-red-800', activeGlow: 'shadow-red-900/40' },
    { id: 'severity', label: 'Severity Markers', gradient: 'from-amber-600 to-amber-800', activeGlow: 'shadow-amber-900/40' },
    { id: 'baseline', label: 'Baseline & Safety', gradient: 'from-indigo-600 to-indigo-800', activeGlow: 'shadow-indigo-900/40' }
  ];

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

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
              activeCategory === cat.id
                ? `bg-gradient-to-r ${cat.gradient} text-white shadow-xl ${cat.activeGlow}`
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {activeInvestigations.map((inv, index) => (
            <motion.div
              key={inv.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-6 glass-panel rounded-2xl card-hover"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex-shrink-0 mt-1 w-10 h-10 rounded-xl bg-gradient-to-br from-red-700/30 to-red-900/30 flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <FlaskConical size={18} className="text-red-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h5 className="font-bold text-white text-lg">{inv.name}</h5>
                    <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      {inv.sample}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{inv.rationale}</p>
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1.5 font-mono">Interpretation</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{inv.interpretation}</p>
                  </div>
                  {inv.critical && (
                    <motion.div
                      className="mt-3 p-4 bg-red-950/30 rounded-xl border border-red-800/30 flex items-start gap-3"
                      whileHover={{ x: 2 }}
                    >
                      <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-red-300/90 leading-relaxed font-medium">{inv.critical}</p>
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
      badgeGradient: 'from-amber-500 to-amber-700',
      iconColor: 'text-amber-400',
      sensitivity: '83-100%',
      specificity: '89-97%',
      indication: 'First-line imaging for haemodynamically stable patients with suspected PE and positive D-dimer or high clinical probability.',
      advantages: [
        'Rapid acquisition (seconds)',
        'High sensitivity for segmental and larger PE',
        'Provides alternative diagnoses (pneumonia, aortic dissection, pneumothorax)',
        'Assesses RV/LV ratio for risk stratification',
        'Widely available 24/7'
      ],
      limitations: [
        'IV contrast required (nephrotoxicity, allergy risk)',
        'Radiation exposure (~7 mSv)',
        'Less sensitive for subsegmental PE',
        'Requires patient cooperation for breath-hold',
        'May be non-diagnostic in poor cardiac output states'
      ],
      keyFindings: 'Intraluminal filling defect within pulmonary arteries. RV/LV ratio >0.9 indicates RV strain and higher mortality risk.'
    },
    {
      id: 'vq',
      name: 'V/Q Scan (Ventilation/Perfusion)',
      badge: 'Alternative',
      badgeGradient: 'from-indigo-500 to-indigo-700',
      iconColor: 'text-indigo-400',
      sensitivity: '77-98%',
      specificity: '90-98%',
      indication: 'Preferred when CTPA is contraindicated: contrast allergy, severe renal impairment (eGFR <30), pregnancy (lower radiation to breast tissue).',
      advantages: [
        'No IV contrast needed',
        'Lower radiation dose to breast tissue (important in pregnancy)',
        'Useful in patients with renal impairment',
        'High NPV when normal scan result',
        'Can be performed as perfusion-only SPECT'
      ],
      limitations: [
        'High rate of non-diagnostic (intermediate probability) results (~30-40%)',
        'Less useful if abnormal CXR (pre-existing lung disease)',
        'Less widely available, especially out of hours',
        'Does not provide alternative diagnosis',
        'Requires SPECT for optimal accuracy'
      ],
      keyFindings: 'Reported as normal, low, intermediate, or high probability. High probability = 2+ large segmental perfusion defects with normal ventilation (mismatch).'
    },
    {
      id: 'cxr',
      name: 'Chest X-Ray (CXR)',
      badge: 'Baseline',
      badgeGradient: 'from-slate-500 to-slate-700',
      iconColor: 'text-slate-400',
      sensitivity: 'Low',
      specificity: 'Low',
      indication: 'Not diagnostic for PE but essential to exclude other causes of dyspnoea and chest pain (pneumothorax, pneumonia, heart failure, pleural effusion).',
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
        'Classic signs (Westermark, Hampton hump) are rare and unreliable',
        'Non-specific findings common'
      ],
      keyFindings: 'Often normal. May show: pleural effusion, atelectasis, elevated hemidiaphragm. Classic but rare: Westermark sign (oligaemia), Hampton hump (wedge-shaped opacity), Fleischner sign (enlarged pulmonary artery).'
    },
    {
      id: 'echo',
      name: 'Echocardiography (TTE)',
      badge: 'Risk Stratification',
      badgeGradient: 'from-red-600 to-red-800',
      iconColor: 'text-red-400',
      sensitivity: '60-70%',
      specificity: '90%',
      indication: 'Essential in haemodynamically unstable patients (suspected massive PE) where CTPA is not immediately feasible. Key role in risk stratification of submassive PE.',
      advantages: [
        'Bedside assessment without transport',
        'No radiation or contrast',
        'Assesses RV function in real-time',
        'Can guide thrombolysis decision in massive PE',
        'Identifies alternative diagnoses (tamponade, MI, aortic dissection)'
      ],
      limitations: [
        'Cannot directly visualise thrombus in most cases',
        'Normal echo does not exclude PE',
        'Operator-dependent',
        'Limited acoustic window in some patients',
        'RV changes may reflect chronic disease (COPD, PHT)'
      ],
      keyFindings: 'RV dilatation (RV:LV >1:1), RV free wall hypokinesis, McConnell sign, tricuspid regurgitation, raised PASP, IVC dilatation, 60/60 sign. Rarely: direct thrombus visualisation in right heart or main PA.'
    },
    {
      id: 'cus',
      name: 'Compression Ultrasound (Lower Limbs)',
      badge: 'Supportive',
      badgeGradient: 'from-emerald-600 to-emerald-800',
      iconColor: 'text-emerald-400',
      sensitivity: '90-95% (proximal DVT)',
      specificity: '95-99%',
      indication: 'Indicated when PE is suspected and DVT is clinically suspected. A positive CUS in a patient with suspected PE can confirm VTE diagnosis without CTPA.',
      advantages: [
        'Non-invasive, no radiation, no contrast',
        'Rapid bedside test',
        'Positive result confirms VTE and treatment indication',
        'Can avoid CTPA in some patients',
        'Useful in pregnancy to reduce radiation exposure'
      ],
      limitations: [
        'Does not directly diagnose PE',
        'Only ~30-50% of PE patients have concurrent DVT',
        'Limited for calf/iliac vein DVT',
        'Operator-dependent accuracy',
        'Negative result does not exclude PE'
      ],
      keyFindings: 'Non-compressible venous segment indicates DVT. Check common femoral vein and popliteal vein as minimum. Positive proximal DVT in setting of PE symptoms confirms VTE.'
    }
  ];

  return (
    <div className="space-y-4">
      {imaging.map((img, index) => (
        <AnimatedCard key={img.id} delay={index * 0.08}>
          <motion.div
            className={`rounded-2xl overflow-hidden transition-all glass-panel ${
              activeImaging === img.id ? 'glow-red' : 'card-hover'
            }`}
            layout
          >
            <div
              onClick={() => setActiveImaging(activeImaging === img.id ? null : img.id)}
              className="flex items-center gap-4 p-6 cursor-pointer group"
            >
              <motion.div
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Scan size={20} className={img.iconColor} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h4 className="font-bold text-white text-lg">{img.name}</h4>
                  <span className={`px-2.5 py-0.5 bg-gradient-to-r ${img.badgeGradient} rounded-full text-[9px] font-black text-white uppercase tracking-[0.1em]`}>
                    {img.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{img.indication}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 font-mono">Sensitivity</span>
                  <span className="text-xs font-bold text-red-400">{img.sensitivity}</span>
                </div>
                <motion.div
                  className="text-slate-500"
                  animate={{ rotate: activeImaging === img.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {activeImaging === img.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-white/5 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/20">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 block mb-3 font-mono">Advantages</span>
                        <ul className="space-y-2">
                          {img.advantages.map((a, ai) => (
                            <motion.li
                              key={a}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ai * 0.04 }}
                              className="text-xs text-emerald-300/80 flex items-start gap-2"
                            >
                              <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                              {a}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-red-950/30 rounded-xl border border-red-800/20">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 block mb-3 font-mono">Limitations</span>
                        <ul className="space-y-2">
                          {img.limitations.map((l, li) => (
                            <motion.li
                              key={l}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: li * 0.04 }}
                              className="text-xs text-red-300/80 flex items-start gap-2"
                            >
                              <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-red-500" />
                              {l}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 font-mono">Key Findings</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{img.keyFindings}</p>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <motion.div
                        className="flex items-center gap-2 p-2.5 bg-white/[0.03] border border-white/5 rounded-xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 font-mono">Sensitivity</span>
                        <span className="text-xs font-bold text-red-400">{img.sensitivity}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2 p-2.5 bg-white/[0.03] border border-white/5 rounded-xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 font-mono">Specificity</span>
                        <span className="text-xs font-bold text-blue-400">{img.specificity}</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatedCard>
      ))}
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
    if (score <= 1) return { level: 'Low', gradient: 'from-emerald-500 to-emerald-700', color: 'text-emerald-400', bg: 'bg-emerald-500', action: 'D-dimer testing. If negative, PE excluded.' };
    if (score <= 4) return { level: 'Intermediate', gradient: 'from-yellow-500 to-amber-600', color: 'text-amber-400', bg: 'bg-amber-500', action: 'D-dimer testing. If positive, proceed to CTPA.' };
    return { level: 'High', gradient: 'from-red-500 to-red-700', color: 'text-red-400', bg: 'bg-red-600', action: 'Proceed directly to CTPA. Do not rely on D-dimer.' };
  };

  const risk = getRisk();

  return (
    <div className="glass-panel p-8 rounded-2xl glow-red">
      <h3 className="font-serif text-2xl mb-2 flex items-center gap-3 text-white font-bold">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <ShieldAlert className="text-amber-400" size={24} />
        </motion.div>
        Wells Score for PE
      </h3>
      <p className="text-slate-400 text-xs mb-8 leading-relaxed">
        Validated clinical decision rule for estimating pre-test probability of PE. Select all criteria that apply.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {criteria.map((c, index) => (
            <motion.div
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                selected.includes(c.id)
                  ? 'bg-amber-950/30 border-amber-700/40 shadow-lg shadow-amber-900/10'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`flex-shrink-0 ${selected.includes(c.id) ? 'text-amber-400' : 'text-slate-600'}`}
                animate={selected.includes(c.id) ? { scale: [1, 1.2, 1] } : {}}
              >
                <CheckCircle2 size={20} />
              </motion.div>
              <span className="text-sm text-slate-300 flex-1">{c.label}</span>
              <motion.span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  selected.includes(c.id)
                    ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-900/30'
                    : 'bg-white/5 text-slate-500'
                }`}
                animate={selected.includes(c.id) ? { scale: [1, 1.1, 1] } : {}}
              >
                +{c.points}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] rounded-2xl border border-white/5">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 font-mono">Total Score</span>
          <motion.div
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-6xl font-serif text-white mb-4"
          >
            {score}
          </motion.div>

          <motion.div
            key={risk.level}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`text-lg font-bold text-white px-6 py-2.5 rounded-full mb-6 bg-gradient-to-r ${risk.gradient} shadow-xl`}
          >
            {risk.level} Probability
          </motion.div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
            <motion.div
              animate={{ width: `${Math.min((score / 12.5) * 100, 100)}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className={`h-full rounded-full bg-gradient-to-r ${risk.gradient}`}
            />
          </div>

          <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5 w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 font-mono">
              Recommended Action
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{risk.action}</p>
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
    { id: 'age', label: 'Age >80 years', points: 1 },
    { id: 'cancer', label: 'Active cancer', points: 1 },
    { id: 'heartfailure', label: 'Heart failure or chronic lung disease', points: 1 },
    { id: 'hr', label: 'Heart rate \u226510 bpm', points: 1 },
    { id: 'sbp', label: 'Systolic BP <100 mmHg', points: 1 },
    { id: 'spo2', label: 'SpO\u2082 <90%', points: 1 }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const score = selected.length;
  const isLowRisk = score === 0;

  return (
    <div className="glass-panel p-8 rounded-2xl glow-red">
      <h3 className="font-serif text-2xl mb-2 flex items-center gap-3 text-white font-bold">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Activity className="text-red-400" size={24} />
        </motion.div>
        Simplified PESI (sPESI)
      </h3>
      <p className="text-slate-400 text-xs mb-8 leading-relaxed">
        Validated score for risk stratification of confirmed PE. Identifies patients suitable for outpatient management. Select all criteria present.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {criteria.map((c) => (
            <motion.div
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                selected.includes(c.id)
                  ? 'bg-red-950/30 border-red-700/40 shadow-lg shadow-red-900/10'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`flex-shrink-0 ${selected.includes(c.id) ? 'text-red-400' : 'text-slate-600'}`}
                animate={selected.includes(c.id) ? { scale: [1, 1.2, 1] } : {}}
              >
                <CheckCircle2 size={20} />
              </motion.div>
              <span className="text-sm text-slate-300 flex-1">{c.label}</span>
              <motion.span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  selected.includes(c.id)
                    ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-900/30'
                    : 'bg-white/5 text-slate-500'
                }`}
                animate={selected.includes(c.id) ? { scale: [1, 1.1, 1] } : {}}
              >
                +{c.points}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] rounded-2xl border border-white/5">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 font-mono">sPESI Score</span>
          <motion.div
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-6xl font-serif text-white mb-4"
          >
            {score}
          </motion.div>

          <motion.div
            key={isLowRisk ? 'low' : 'high'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`text-lg font-bold text-white px-6 py-2.5 rounded-full mb-6 shadow-xl bg-gradient-to-r ${
              isLowRisk ? 'from-emerald-500 to-emerald-700' : 'from-red-500 to-red-700'
            }`}
          >
            {isLowRisk ? 'Low Risk' : 'High Risk'}
          </motion.div>

          <div className="space-y-3 w-full">
            <motion.div
              className="p-4 bg-white/[0.03] rounded-xl border border-white/5"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1 font-mono">30-Day Mortality</span>
              <span className={`text-lg font-bold ${isLowRisk ? 'text-emerald-400' : 'text-red-400'}`}>
                {isLowRisk ? '1.0%' : '10.9%'}
              </span>
            </motion.div>
            <motion.div
              className="p-4 bg-white/[0.03] rounded-xl border border-white/5"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1 font-mono">Management</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isLowRisk
                  ? 'Consider outpatient management with DOAC if no other contraindications (Hestia criteria met, adequate support).'
                  : 'Inpatient management. Further stratify with troponin + echo/CT RV assessment. Consider ICU if haemodynamically unstable.'}
              </p>
            </motion.div>
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
    { category: 'Bedside', tests: ['12-lead ECG', 'Vital signs', 'POCUS'], timing: 'Immediate', purpose: 'Initial assessment & haemodynamic status', color: 'text-red-400' },
    { category: 'Diagnostic Bloods', tests: ['D-dimer', 'ABG'], timing: '< 1 hour', purpose: 'Exclude PE or assess gas exchange', color: 'text-amber-400' },
    { category: 'Severity Markers', tests: ['hs-Troponin', 'BNP/NT-proBNP', 'Lactate'], timing: '< 1 hour', purpose: 'Risk stratification & prognosis', color: 'text-orange-400' },
    { category: 'Baseline Bloods', tests: ['FBC', 'U&E', 'LFTs', 'Coagulation', 'TFTs'], timing: '< 4 hours', purpose: 'Safe anticoagulation & organ function', color: 'text-indigo-400' },
    { category: 'Imaging', tests: ['CTPA', 'V/Q scan', 'CXR', 'Echo', 'Leg CUS'], timing: 'As indicated', purpose: 'Confirm PE, assess severity, identify DVT', color: 'text-blue-400' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Category</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Investigations</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Timing</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {investigations.map((row, index) => (
            <motion.tr
              key={row.category}
              className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="py-4 px-4">
                <span className={`font-bold text-sm ${row.color}`}>{row.category}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1.5">
                  {row.tests.map((t) => (
                    <motion.span
                      key={t}
                      className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-slate-300"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-4">
                <span className={`text-xs font-bold ${row.color}`}>{row.timing}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-xs text-slate-400 italic">{row.purpose}</span>
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
      gradient: 'from-red-600 to-rose-700'
    },
    {
      id: 'probability',
      step: 2,
      title: 'Pre-Test Probability',
      description: 'Wells Score or Revised Geneva Score',
      icon: <FileText size={20} />,
      action: 'Stratify into low/intermediate/high risk',
      gradient: 'from-amber-600 to-orange-700'
    },
    {
      id: 'ddimer',
      step: 3,
      title: 'D-dimer (if low/intermediate)',
      description: 'Age-adjusted D-dimer cut-off',
      icon: <Droplets size={20} />,
      action: 'Negative = PE excluded | Positive = proceed to imaging',
      gradient: 'from-purple-600 to-violet-700'
    },
    {
      id: 'imaging',
      step: 4,
      title: 'Definitive Imaging',
      description: 'CTPA (first-line) or V/Q scan (if CTPA contraindicated)',
      icon: <Scan size={20} />,
      action: 'Confirm or exclude PE diagnosis',
      gradient: 'from-blue-600 to-cyan-700'
    },
    {
      id: 'stratify',
      step: 5,
      title: 'Severity Stratification',
      description: 'sPESI + Troponin + Echo/CT RV assessment',
      icon: <Activity size={20} />,
      action: 'Guide inpatient vs outpatient management and therapy intensity',
      gradient: 'from-emerald-600 to-green-700'
    }
  ];

  return (
    <div className="space-y-3 relative">
      {/* Connecting line */}
      <div className="absolute left-[2.25rem] top-8 bottom-8 w-[2px] bg-gradient-to-b from-red-600/30 via-amber-600/30 to-emerald-600/30 hidden md:block" />

      {steps.map((s, index) => (
        <AnimatedCard key={s.id} delay={index * 0.1}>
          <motion.div
            onMouseEnter={() => setActivePath(s.id)}
            onMouseLeave={() => setActivePath(null)}
            className={`flex items-start gap-6 p-6 rounded-2xl border transition-all duration-300 relative ${
              activePath === s.id
                ? 'border-red-800/40 bg-red-950/20 shadow-xl shadow-red-900/10 glow-red'
                : 'border-white/5 bg-white/[0.02] glass-panel'
            }`}
            whileHover={{ x: 8 }}
          >
            <div className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                  activePath === s.id
                    ? `bg-gradient-to-br ${s.gradient} text-white`
                    : 'bg-white/5 text-slate-500 border border-white/10'
                }`}
                animate={activePath === s.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              >
                {s.icon}
              </motion.div>
              <span className="text-[10px] font-black text-slate-500 font-mono">Step {s.step}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-lg text-white mb-1 font-bold">{s.title}</h4>
              <p className="text-xs text-slate-400 mb-3">{s.description}</p>
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: activePath === s.id ? 1 : 0.4 }}
              >
                <ArrowRightCircle size={14} className="text-red-400" />
                <span className="text-xs font-bold text-slate-300">{s.action}</span>
              </motion.div>
            </div>

            {/* Step number watermark */}
            <div className={`absolute right-6 top-4 text-5xl font-serif font-bold transition-opacity ${
              activePath === s.id ? 'opacity-10' : 'opacity-[0.03]'
            } text-white`}>
              {s.step}
            </div>
          </motion.div>
        </AnimatedCard>
      ))}
    </div>
  );
};
