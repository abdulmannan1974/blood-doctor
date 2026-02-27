import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ShieldAlert, Thermometer, FlaskConical, 
  Stethoscope, Activity, AlertTriangle, ChevronRight, 
  ArrowRightCircle, Target, Zap
} from 'lucide-react';

// --- DIAGNOSTIC CHECKLIST (Table 2) ---
export const DiagnosticChecklist: React.FC = () => {
  const prerequisites = [
    { id: 'mono', label: 'Persistent Absolute Monocytosis (>0.5 x 10⁹/L)', detail: 'and relative >10% of WBC' },
    { id: 'blasts', label: 'Blasts <20% in blood and marrow', detail: 'Includes promonocytes' },
    { id: 'cml', label: 'Does not meet CML/MPN criteria', detail: 'BCR::ABL1 negative' }
  ];

  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (id: string) => {
    setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const isDiagnosed = prerequisites.every(p => checked.includes(p.id));

  return (
    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
      <h3 className="font-serif text-2xl mb-6 text-slate-900 flex items-center gap-2">
        <ShieldAlert className="text-med-red" />
        WHO 2022 Prerequisite Criteria
      </h3>
      <div className="space-y-4">
        {prerequisites.map((item) => (
          <div 
            key={item.id} 
            onClick={() => toggle(item.id)}
            className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${checked.includes(item.id) ? 'bg-white shadow-md border-med-red/20 border-l-4 border-l-med-red' : 'bg-slate-100 hover:bg-slate-200 opacity-60'}`}
          >
            <div className={`mt-1 ${checked.includes(item.id) ? 'text-med-red' : 'text-slate-300'}`}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{item.label}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {isDiagnosed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold text-center uppercase tracking-widest"
          >
            All Prerequisite Criteria Met
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- GENOMIC GRID (Table 4) ---
export const GenomicGrid: React.FC = () => {
  const genes = [
    { cat: 'Epigenetic', list: ['TET2', 'ASXL1', 'DNMT3A', 'EZH2', 'IDH1/2', 'BCOR'], color: 'bg-indigo-600', detail: 'Often affected early in disease course.' },
    { cat: 'Spliceosome', list: ['SRSF2', 'U2AF1', 'SF3B1', 'ZRSR2'], color: 'bg-med-red', detail: 'SRSF2 is mutated in ~50% of cases.' },
    { cat: 'Cell Signaling', list: ['NRAS', 'KRAS', 'CBL', 'NF1', 'JAK2'], color: 'bg-slate-800', detail: 'RAS pathway mutations drive myeloproliferation.' },
    { cat: 'Other Transcription', list: ['RUNX1', 'SETBP1', 'NPM1', 'FLT3', 'TP53', 'STAG2'], color: 'bg-amber-600', detail: 'NPM1/FLT3 indicate potential rapid progression.' }
  ];

  const [activeCat, setActiveCat] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {genes.map((g, idx) => (
        <motion.div 
          key={g.cat}
          onHoverStart={() => setActiveCat(idx)}
          onHoverEnd={() => setActiveCat(null)}
          className={`p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${activeCat === idx ? 'scale-[1.02] shadow-xl' : 'shadow-sm border border-slate-200 bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-6 ${g.color} rounded-full`}></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{g.cat}</h4>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {g.list.map(gene => (
              <span key={gene} className={`px-2 py-1 rounded text-[10px] font-bold ${activeCat === idx ? 'bg-slate-100 text-slate-900' : 'bg-slate-50 text-slate-400'}`}>
                {gene}
              </span>
            ))}
          </div>
          <AnimatePresence>
            {activeCat === idx && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[10px] text-slate-400 italic"
              >
                {g.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      <div className="sm:col-span-2 mt-4 text-[10px] text-slate-400 italic text-center uppercase tracking-widest">
        * Minimal gene set for somatic mutation screening (Table 4)
      </div>
    </div>
  );
};

// --- DIFFERENTIAL DIAGNOSIS (Table 1) ---
export const DifferentialDiagnosisTable: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
        <AlertTriangle className="text-med-gold" size={14} />
        Differential Diagnoses (Table 1)
      </h4>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[11px]">
        <div>
          <span className="block font-bold text-med-gold mb-2 border-b border-white/10 pb-1">Malignant Stem Cell Disorders</span>
          <ul className="space-y-1 text-slate-400">
            <li>Myelodysplastic neoplasms</li>
            <li>Myeloproliferative neoplasms</li>
            <li>Chronic eosinophilic leukaemia</li>
            <li>Acute monocytic leukaemia</li>
            <li>JMML (Juvenile variant)</li>
            <li>VEXAS / Systemic mastocytosis</li>
          </ul>
        </div>
        <div>
          <span className="block font-bold text-med-gold mb-2 border-b border-white/10 pb-1">Non-Malignant Conditions</span>
          <ul className="space-y-1 text-slate-400">
            <li>Acute bacterial infections</li>
            <li>Viral infections (HIV, etc.)</li>
            <li>Chronic infections (Tbc)</li>
            <li>Inflammatory (RA, SLE)</li>
            <li>Immune thrombocytopenia (ITP)</li>
            <li>Hypersplenism (Splenomegaly)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- SUBTYPE COMPARISON (Table 2 & Page 2) ---
export const SubtypeComparison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 bg-slate-50 rounded-2xl border-l-4 border-indigo-500">
        <h4 className="font-serif text-2xl mb-4 text-slate-900">Dysplastic Variant (MD-CMML)</h4>
        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">WBC &lt;13,000/μL</div>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
          "Patients generally suffer from haematopoietic insufficiency and are more reminiscent of a myelodysplastic syndrome."
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
            <ChevronRight size={14} /> Higher cytopenias
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
            <ChevronRight size={14} /> Lower WBC counts
          </div>
        </div>
      </div>
      <div className="p-8 bg-slate-50 rounded-2xl border-l-4 border-med-red">
        <h4 className="font-serif text-2xl mb-4 text-slate-900">Proliferative Variant (MP-CMML)</h4>
        <div className="text-xs font-bold text-med-red uppercase tracking-widest mb-4">WBC &ge;13,000/μL</div>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
          "Fewer cytopenias, higher white blood cell counts, greater organomegaly, and more severe constitutional symptoms."
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
            <ChevronRight size={14} /> Night sweats / Fever
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
            <ChevronRight size={14} /> Skin/Kidney infiltration
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PROGNOSIS SCOREBOARD (Table 6) ---
export const PrognosisScoreboard: React.FC = () => {
  const [blasts, setBlasts] = useState<string>('<5%');
  const [mutated, setMutated] = useState<string[]>([]);
  
  const toggleMut = (m: string) => {
    setMutated(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  let score = 0;
  if (blasts === '>=5%') score += 1;
  if (mutated.includes('ASXL1')) score += 1;
  if (mutated.includes('SETBP1') || mutated.includes('NRAS') || mutated.includes('RUNX1')) score += 1;

  const risk = score === 0 ? 'Low' : score === 1 ? 'Intermediate-1' : score === 2 ? 'Intermediate-2' : 'High';
  const riskColor = score === 0 ? 'bg-emerald-500' : score === 1 ? 'bg-yellow-500' : score === 2 ? 'bg-orange-500' : 'bg-red-600';

  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl h-full">
      <h3 className="font-serif text-2xl mb-8 flex items-center gap-2 text-white">
        <FlaskConical className="text-med-gold" />
        CPSSmol Calculator (Table 6)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8 text-left">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Marrow Blasts</label>
            <div className="flex gap-2">
              {['<5%', '>=5%'].map(b => (
                <button 
                  key={b}
                  onClick={() => setBlasts(b)}
                  className={`px-4 py-2 rounded text-xs font-bold border transition-all ${blasts === b ? 'bg-med-gold text-slate-900 border-med-gold' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Molecular Mutations (Molecular Risk Group)</label>
            <div className="grid grid-cols-2 gap-2">
              {['ASXL1', 'NRAS', 'RUNX1', 'SETBP1'].map(m => (
                <button 
                  key={m}
                  onClick={() => toggleMut(m)}
                  className={`px-3 py-2 rounded text-[10px] font-bold border transition-all text-left ${mutated.includes(m) ? 'bg-white text-slate-900 border-white' : 'border-slate-600 text-slate-400'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-700">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Calculated Risk Group</span>
          <motion.div 
            key={risk}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-serif text-white px-6 py-2 rounded-full mb-4 ${riskColor}`}
          >
            {risk}
          </motion.div>
          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-6">
             <motion.div 
              animate={{ width: `${Math.min((score/3)*100, 100)}%` }}
              className={`h-full ${riskColor}`}
             />
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-400 text-[10px] italic">
              "High risk disease according to CPSSmol should prompt transplantation planning without delay."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TREATMENT INDICATIONS (Page 7-8) ---
export const TreatmentIndications: React.FC = () => {
  const indications = [
    { id: 'a', title: 'Haematopoietic Insufficiency', desc: 'Severe anaemia (Hb <10g/dL), platelets <50,000/μL, or neutropenia (<800/μL).' },
    { id: 'b', title: 'Increasing Blast Count', desc: '>5% peripheral or marrow blasts, indicating progression into acute leukaemia.' },
    { id: 'c', title: 'Rising WBC Counts', desc: 'Leucocytes >30,000/μL, potentially leading to hyperleucocytosis complications.' },
    { id: 'd', title: 'Splenomegaly & Symptoms', desc: 'Spleen >5cm below costal margin and constitutional symptoms (sweats, fever).' },
    { id: 'e', title: 'Inflammatory Signs', desc: 'Non-infectious lung disease, pericardial effusion, ascites, or VEXAS co-occurrence.' },
    { id: 'f', title: 'Extramedullary Disease', desc: 'Skin infiltration or significant lymphadenopathy.' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {indications.map((ind) => (
        <div key={ind.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-med-red/10 flex items-center justify-center text-med-red font-bold text-xs uppercase">
            {ind.id}
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm mb-2">{ind.title}</h5>
            <p className="text-xs text-slate-500 leading-relaxed italic">{ind.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- TREATMENT TREE (Figure 4) ---
export const TreatmentTree: React.FC = () => {
  const [activePath, setActivePath] = useState<string | null>(null);

  const paths = [
    { id: 'insufficiency', label: 'Haematopoietic Insufficiency', therapy: 'EPO, Transfusions, G-CSF', icon: <Thermometer /> },
    { id: 'proliferation', label: 'High WBC / Proliferation', therapy: 'Hydroxyurea, Cytoreduction', icon: <Activity /> },
    { id: 'inflammation', label: 'Constitutional Symptoms', therapy: 'JAK2 Inhibitors, Ruxolitinib', icon: <Stethoscope /> },
    { id: 'highrisk', label: 'High Risk (CPSSmol High)', therapy: 'HMA ± BCL2-i, Allo-SCT', icon: <FlaskConical /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {paths.map((p) => (
        <div 
          key={p.id}
          onMouseEnter={() => setActivePath(p.id)}
          onMouseLeave={() => setActivePath(null)}
          className={`relative p-8 rounded-2xl border-2 transition-all cursor-default flex flex-col items-center text-center ${activePath === p.id ? 'border-med-red bg-med-red/5 scale-105 shadow-xl' : 'border-slate-100 bg-white'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors ${activePath === p.id ? 'bg-med-red text-white' : 'bg-slate-100 text-slate-400'}`}>
            {p.icon}
          </div>
          <h4 className="font-serif text-lg text-slate-900 mb-2 leading-tight">{p.label}</h4>
          <div className={`mt-auto pt-4 border-t border-slate-100 w-full transition-opacity ${activePath === p.id ? 'opacity-100' : 'opacity-40'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Recommended Approach</span>
            <span className="text-xs font-bold text-slate-800">{p.therapy}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- FUTURE THERAPIES (Page 12) ---
export const FutureTherapies: React.FC = () => {
  const targets = [
    { name: 'Lenzilumab', target: 'GM-CSF', type: 'Neutralizing Antibody', desc: 'Addresses GM-CSF hypersensitivity characterizing the MP-type.' },
    { name: 'IO-202', target: 'LILRB4', type: 'Monoclonal Antibody', desc: 'Binds LILRB4 on monocytic cells to hinder cell infiltration.' },
    { name: 'Onvansertib', target: 'RAS Signaling', type: 'Inhibitor', desc: 'Targets signaling aberrations driven by RAS mutations.' },
    { name: 'Tipifarnib', target: 'Farnesyltransferase', type: 'Inhibitor', desc: 'Compounds addressing post-translational modification in myeloid cells.' }
  ];

  return (
    <div className="space-y-4">
      {targets.map((t) => (
        <div key={t.name} className="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 mt-1">
            <Target size={20} className="text-med-red" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-slate-900">{t.name}</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.target}</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">{t.type}</p>
            <p className="text-xs text-slate-500 leading-relaxed italic">{t.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};