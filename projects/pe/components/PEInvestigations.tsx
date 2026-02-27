import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, Heart, Activity, Droplets,
  Stethoscope, Scan, Syringe, Zap, Clock, ChevronRight,
  ChevronDown, ShieldAlert, FlaskConical, FileText, Wind,
  MonitorCheck, CircleDot, ArrowRightCircle
} from 'lucide-react';

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
      rationale: 'Assess haemodynamic stability and oxygen status. Guides risk stratification.',
      findings: [
        { label: 'Heart rate', significance: 'Tachycardia >100 bpm common; used in Wells/Geneva' },
        { label: 'Blood pressure', significance: 'Hypotension (SBP <90) defines massive PE' },
        { label: 'Respiratory rate', significance: 'Tachypnoea; often >20/min' },
        { label: 'SpO₂', significance: 'Hypoxaemia; may be normal in small PE' },
        { label: 'Temperature', significance: 'Low-grade pyrexia possible; exclude infection' },
        { label: 'JVP', significance: 'Elevated JVP suggests RV failure' }
      ]
    },
    {
      id: 'pocus',
      name: 'Point-of-Care Ultrasound',
      urgency: 'Within 30 min',
      icon: <Scan size={20} />,
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
      {investigations.map((inv) => (
        <div
          key={inv.id}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div
            onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}
            className="flex items-center gap-4 p-6 cursor-pointer"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-med-red/10 flex items-center justify-center text-med-red">
              {inv.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-slate-900">{inv.name}</h4>
                <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-[9px] font-black text-red-700 uppercase tracking-widest">
                  {inv.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{inv.rationale}</p>
            </div>
            <div className={`text-slate-400 transition-transform ${expanded === inv.id ? 'rotate-180' : ''}`}>
              <ChevronDown size={20} />
            </div>
          </div>

          <AnimatePresence>
            {expanded === inv.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                    Key Findings & Significance
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {inv.findings.map((f) => (
                      <div key={f.label} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                        <ChevronRight size={14} className="text-med-red mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{f.label}</span>
                          <span className="text-[10px] text-slate-500 italic">{f.significance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
    { id: 'diagnostic', label: 'Diagnostic', color: 'bg-med-red' },
    { id: 'severity', label: 'Severity Markers', color: 'bg-amber-600' },
    { id: 'baseline', label: 'Baseline & Safety', color: 'bg-indigo-600' }
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
        interpretation: 'Type 1 respiratory failure (low PaO₂, low/normal PaCO₂) is typical. Elevated A-a gradient. Respiratory alkalosis early; metabolic acidosis if shocked.',
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
        critical: 'Prolonged APTT may indicate antiphospholipid syndrome — a risk factor for VTE.'
      },
      {
        name: 'Renal Function (U&E/Creatinine)',
        sample: 'Serum / Lithium heparin',
        rationale: 'Assess renal function for anticoagulant dosing. Many DOACs and LMWH require renal adjustment.',
        interpretation: 'eGFR <30: avoid rivaroxaban/apixaban or dose-reduce. CrCl <30: LMWH accumulates — switch to UFH. Electrolyte derangement may affect cardiac rhythm.'
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
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat.id
                ? `${cat.color} text-white shadow-lg`
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeInvestigations.map((inv) => (
          <div key={inv.name} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <FlaskConical size={18} className="text-med-red" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-bold text-slate-900">{inv.name}</h5>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {inv.sample}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{inv.rationale}</p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Interpretation</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{inv.interpretation}</p>
                </div>
                {inv.critical && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-red-800 leading-relaxed font-medium">{inv.critical}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
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
      badgeColor: 'bg-med-gold text-white',
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
      badgeColor: 'bg-indigo-600 text-white',
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
      badgeColor: 'bg-slate-700 text-white',
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
      badgeColor: 'bg-med-red text-white',
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
      badgeColor: 'bg-emerald-700 text-white',
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
    <div className="space-y-6">
      {imaging.map((img) => (
        <div
          key={img.id}
          className={`rounded-2xl border overflow-hidden transition-all ${
            activeImaging === img.id
              ? 'border-med-red/30 shadow-xl bg-white'
              : 'border-slate-200 shadow-sm bg-white hover:shadow-md'
          }`}
        >
          <div
            onClick={() => setActiveImaging(activeImaging === img.id ? null : img.id)}
            className="flex items-center gap-4 p-6 cursor-pointer"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Scan size={20} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h4 className="font-bold text-slate-900">{img.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${img.badgeColor}`}>
                  {img.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{img.indication}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sensitivity</span>
                <span className="text-xs font-bold text-slate-700">{img.sensitivity}</span>
              </div>
              <div className={`text-slate-400 transition-transform ${activeImaging === img.id ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {activeImaging === img.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">Advantages</span>
                      <ul className="space-y-1">
                        {img.advantages.map((a) => (
                          <li key={a} className="text-xs text-emerald-800 flex items-start gap-2">
                            <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-600 block mb-2">Limitations</span>
                      <ul className="space-y-1">
                        {img.limitations.map((l) => (
                          <li key={l} className="text-xs text-red-800 flex items-start gap-2">
                            <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Key Findings</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{img.keyFindings}</p>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sensitivity</span>
                      <span className="text-xs font-bold text-med-red">{img.sensitivity}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Specificity</span>
                      <span className="text-xs font-bold text-med-blue">{img.specificity}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
    if (score <= 1) return { level: 'Low', color: 'bg-emerald-500', action: 'D-dimer testing. If negative, PE excluded.' };
    if (score <= 4) return { level: 'Intermediate', color: 'bg-yellow-500', action: 'D-dimer testing. If positive, proceed to CTPA.' };
    return { level: 'High', color: 'bg-red-600', action: 'Proceed directly to CTPA. Do not rely on D-dimer.' };
  };

  const risk = getRisk();

  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
      <h3 className="font-serif text-2xl mb-2 flex items-center gap-2 text-white">
        <ShieldAlert className="text-med-gold" />
        Wells Score for PE
      </h3>
      <p className="text-slate-400 text-xs mb-8 leading-relaxed">
        Validated clinical decision rule for estimating pre-test probability of PE. Select all criteria that apply.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {criteria.map((c) => (
            <div
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                selected.includes(c.id)
                  ? 'bg-white/10 border border-med-gold/40'
                  : 'bg-white/5 border border-transparent hover:bg-white/10'
              }`}
            >
              <div className={`flex-shrink-0 ${selected.includes(c.id) ? 'text-med-gold' : 'text-slate-600'}`}>
                <CheckCircle2 size={20} />
              </div>
              <span className="text-sm text-slate-300 flex-1">{c.label}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                selected.includes(c.id) ? 'bg-med-gold text-slate-900' : 'bg-slate-700 text-slate-400'
              }`}>
                +{c.points}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-700">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Score</span>
          <motion.div
            key={score}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-serif text-white mb-4"
          >
            {score}
          </motion.div>

          <motion.div
            key={risk.level}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-lg font-serif text-white px-6 py-2 rounded-full mb-6 ${risk.color}`}
          >
            {risk.level} Probability
          </motion.div>

          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-6">
            <motion.div
              animate={{ width: `${Math.min((score / 12.5) * 100, 100)}%` }}
              className={`h-full ${risk.color}`}
            />
          </div>

          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 w-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
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
    { id: 'hr', label: 'Heart rate ≥110 bpm', points: 1 },
    { id: 'sbp', label: 'Systolic BP <100 mmHg', points: 1 },
    { id: 'spo2', label: 'SpO₂ <90%', points: 1 }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const score = selected.length;
  const isLowRisk = score === 0;

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-serif text-2xl mb-2 flex items-center gap-2 text-slate-900">
        <Activity className="text-med-red" />
        Simplified PESI (sPESI)
      </h3>
      <p className="text-slate-500 text-xs mb-8 leading-relaxed">
        Validated score for risk stratification of confirmed PE. Identifies patients suitable for outpatient management. Select all criteria present.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {criteria.map((c) => (
            <div
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
                selected.includes(c.id)
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
              }`}
            >
              <div className={`flex-shrink-0 ${selected.includes(c.id) ? 'text-med-red' : 'text-slate-300'}`}>
                <CheckCircle2 size={20} />
              </div>
              <span className="text-sm text-slate-700 flex-1">{c.label}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                selected.includes(c.id) ? 'bg-med-red text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                +{c.points}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">sPESI Score</span>
          <motion.div
            key={score}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-serif text-slate-900 mb-4"
          >
            {score}
          </motion.div>

          <motion.div
            key={isLowRisk ? 'low' : 'high'}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-lg font-serif text-white px-6 py-2 rounded-full mb-6 ${isLowRisk ? 'bg-emerald-500' : 'bg-red-600'}`}
          >
            {isLowRisk ? 'Low Risk' : 'High Risk'}
          </motion.div>

          <div className="space-y-3 w-full">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">30-Day Mortality</span>
              <span className="text-sm font-bold text-slate-900">{isLowRisk ? '1.0%' : '10.9%'}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Management</span>
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
    { category: 'Bedside', tests: ['12-lead ECG', 'Vital signs', 'POCUS'], timing: 'Immediate', purpose: 'Initial assessment & haemodynamic status' },
    { category: 'Diagnostic Bloods', tests: ['D-dimer', 'ABG'], timing: '< 1 hour', purpose: 'Exclude PE or assess gas exchange' },
    { category: 'Severity Markers', tests: ['hs-Troponin', 'BNP/NT-proBNP', 'Lactate'], timing: '< 1 hour', purpose: 'Risk stratification & prognosis' },
    { category: 'Baseline Bloods', tests: ['FBC', 'U&E', 'LFTs', 'Coagulation', 'TFTs'], timing: '< 4 hours', purpose: 'Safe anticoagulation & organ function' },
    { category: 'Imaging', tests: ['CTPA', 'V/Q scan', 'CXR', 'Echo', 'Leg CUS'], timing: 'As indicated', purpose: 'Confirm PE, assess severity, identify DVT' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Investigations</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timing</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {investigations.map((row) => (
            <tr key={row.category} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-4 px-4">
                <span className="font-bold text-sm text-slate-900">{row.category}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1">
                  {row.tests.map((t) => (
                    <span key={t} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-xs font-bold text-med-red">{row.timing}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-xs text-slate-600 italic">{row.purpose}</span>
              </td>
            </tr>
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
      action: 'Assess pre-test probability'
    },
    {
      id: 'probability',
      step: 2,
      title: 'Pre-Test Probability',
      description: 'Wells Score or Revised Geneva Score',
      icon: <FileText size={20} />,
      action: 'Stratify into low/intermediate/high risk'
    },
    {
      id: 'ddimer',
      step: 3,
      title: 'D-dimer (if low/intermediate)',
      description: 'Age-adjusted D-dimer cut-off',
      icon: <Droplets size={20} />,
      action: 'Negative = PE excluded | Positive = proceed to imaging'
    },
    {
      id: 'imaging',
      step: 4,
      title: 'Definitive Imaging',
      description: 'CTPA (first-line) or V/Q scan (if CTPA contraindicated)',
      icon: <Scan size={20} />,
      action: 'Confirm or exclude PE diagnosis'
    },
    {
      id: 'stratify',
      step: 5,
      title: 'Severity Stratification',
      description: 'sPESI + Troponin + Echo/CT RV assessment',
      icon: <Activity size={20} />,
      action: 'Guide inpatient vs outpatient management and therapy intensity'
    }
  ];

  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div
          key={s.id}
          onMouseEnter={() => setActivePath(s.id)}
          onMouseLeave={() => setActivePath(null)}
          className={`flex items-start gap-6 p-6 rounded-2xl border-2 transition-all ${
            activePath === s.id
              ? 'border-med-red bg-med-red/5 shadow-lg'
              : 'border-slate-100 bg-white'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              activePath === s.id ? 'bg-med-red text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {s.icon}
            </div>
            <span className="text-[10px] font-black text-slate-400">Step {s.step}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-serif text-lg text-slate-900 mb-1">{s.title}</h4>
            <p className="text-xs text-slate-500 mb-3">{s.description}</p>
            <div className={`flex items-center gap-2 transition-opacity ${activePath === s.id ? 'opacity-100' : 'opacity-50'}`}>
              <ArrowRightCircle size={14} className="text-med-red" />
              <span className="text-xs font-bold text-slate-700">{s.action}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
