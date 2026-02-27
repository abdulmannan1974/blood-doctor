import React, { useState, useEffect } from 'react';
import {
  BedsideInvestigations,
  BloodInvestigations,
  ImagingInvestigations,
  WellsScoreCalculator,
  SPESICalculator,
  InvestigationSummaryTable,
  DiagnosticAlgorithm
} from './components/PEInvestigations';
import {
  ArrowDown, Menu, X, Stethoscope, Activity,
  ShieldCheck, HeartPulse, FlaskConical, Scan, Droplets,
  FileText, AlertTriangle, Wind
} from 'lucide-react';

const BloodDoctorLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-1 font-serif font-bold tracking-tight ${className}`}>
    <span className="text-slate-900">Blood</span>
    <Droplets size={20} className="text-red-600 fill-red-600 animate-pulse" />
    <span className="text-red-700">Doctor</span>
  </div>
);

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      setMenuOpen(false);
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-med-red/20 font-sans">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 bg-med-red rounded flex items-center justify-center text-white font-serif font-bold shadow-sm">B</div>
              <span className={`font-serif font-bold text-lg tracking-tight transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                Blood Doctor <span className="font-normal text-slate-400 ml-2">PE Investigations</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold tracking-widest text-slate-600 uppercase">
            <a href="#algorithm" onClick={scrollToSection('algorithm')} className="hover:text-med-red transition-colors cursor-pointer">Algorithm</a>
            <a href="#bedside" onClick={scrollToSection('bedside')} className="hover:text-med-red transition-colors cursor-pointer">Bedside</a>
            <a href="#bloods" onClick={scrollToSection('bloods')} className="hover:text-med-red transition-colors cursor-pointer">Bloods</a>
            <a href="#imaging" onClick={scrollToSection('imaging')} className="hover:text-med-red transition-colors cursor-pointer">Imaging</a>
            <a href="#risk" onClick={scrollToSection('risk')} className="hover:text-med-red transition-colors cursor-pointer">Risk Scores</a>
            <a href="#severity" onClick={scrollToSection('severity')} className="hover:text-med-red transition-colors cursor-pointer">Severity</a>
          </div>

          <button className="lg:hidden text-slate-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
            <a href="#algorithm" onClick={scrollToSection('algorithm')} className="block text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-med-red">Algorithm</a>
            <a href="#bedside" onClick={scrollToSection('bedside')} className="block text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-med-red">Bedside</a>
            <a href="#bloods" onClick={scrollToSection('bloods')} className="block text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-med-red">Bloods</a>
            <a href="#imaging" onClick={scrollToSection('imaging')} className="block text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-med-red">Imaging</a>
            <a href="#risk" onClick={scrollToSection('risk')} className="block text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-med-red">Risk Scores</a>
            <a href="#severity" onClick={scrollToSection('severity')} className="block text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-med-red">Severity</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-white to-slate-50 z-0"></div>

        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <div className="flex flex-col items-center gap-4 mb-6">
            <BloodDoctorLogo className="text-2xl" />
            <div className="inline-block px-4 py-1 border border-med-red text-med-red text-[10px] tracking-[0.3em] uppercase font-black rounded-full bg-white/50 backdrop-blur-sm">
              Clinical Investigation Guide
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-medium leading-[1.1] mb-8 text-slate-900 max-w-5xl mx-auto">
            Pulmonary <br/><span className="italic font-light">Embolism</span>
          </h1>

          <p className="text-slate-500 font-serif italic text-lg md:text-xl max-w-2xl mx-auto mb-8">
            A comprehensive, evidence-based investigation checklist for the diagnosis and risk stratification of acute pulmonary embolism
          </p>

          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Produced for Clinical Education by</p>
            <p className="font-serif text-2xl text-slate-800">Dr Abdul Mannan <span className="text-sm font-sans font-medium text-slate-500 ml-1 italic text-base">FRCPath FCPS</span></p>
          </div>

          <div className="max-w-3xl mx-auto glass-panel p-8 rounded-xl shadow-lg text-left border-l-4 border-med-red">
            <p className="text-slate-600 leading-relaxed italic text-lg">
              "Pulmonary embolism remains a major cause of cardiovascular morbidity and mortality. Timely, structured investigation is critical to establish the diagnosis, assess severity, and guide appropriate management."
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <a href="#summary" onClick={scrollToSection('summary')} className="animate-bounce group flex flex-col items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
              <span className="tracking-[0.2em] uppercase">View Investigations</span>
              <ArrowDown size={20} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Investigation Summary Table */}
        <section id="summary" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-2 text-med-red mb-4">
                <FileText size={24} />
                <span className="text-xs font-black tracking-widest uppercase">At a Glance</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Investigation Summary</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Complete overview of investigations required for suspected pulmonary embolism, organised by category and timing.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <InvestigationSummaryTable />
            </div>
          </div>
        </section>

        {/* Diagnostic Algorithm */}
        <section id="algorithm" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-2 text-med-red mb-4">
                  <Wind size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Diagnostic Pathway</span>
                </div>
                <h2 className="font-serif text-4xl mb-8 leading-tight text-slate-900">Clinical Algorithm</h2>
                <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                  <p>
                    The diagnostic approach to PE follows a structured algorithm based on clinical probability assessment, biomarker testing, and definitive imaging.
                  </p>
                  <p>
                    This evidence-based pathway minimises unnecessary imaging while ensuring high-risk patients receive timely definitive investigation.
                  </p>
                  <div className="p-4 bg-slate-50 border rounded border-slate-200 text-sm">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-med-red" />
                      Haemodynamic Instability
                    </h4>
                    If the patient is haemodynamically unstable (SBP &lt;90 mmHg), proceed directly to bedside echo and consider empirical thrombolysis. Do not delay for CTPA.
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <DiagnosticAlgorithm />
              </div>
            </div>
          </div>
        </section>

        {/* Bedside Investigations */}
        <section id="bedside" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-2 text-med-blue mb-4">
                <Stethoscope size={24} />
                <span className="text-xs font-black tracking-widest uppercase">Immediate Assessment</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Bedside Investigations</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Investigations performed at the bedside immediately upon clinical suspicion of PE. These guide initial management and haemodynamic assessment.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <BedsideInvestigations />
            </div>
          </div>
        </section>

        {/* Blood Investigations */}
        <section id="bloods" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-2 text-med-red mb-4">
                <FlaskConical size={24} />
                <span className="text-xs font-black tracking-widest uppercase">Laboratory</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Blood Investigations</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Laboratory investigations for diagnosis, risk stratification, and safe initiation of anticoagulation therapy.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <BloodInvestigations />
            </div>
          </div>
        </section>

        {/* Imaging Investigations */}
        <section id="imaging" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-2 text-med-blue mb-4">
                <Scan size={24} />
                <span className="text-xs font-black tracking-widest uppercase">Radiology & Imaging</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Imaging Investigations</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Imaging modalities used for confirming PE, assessing right ventricular function, and identifying concurrent DVT.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <ImagingInvestigations />
            </div>
          </div>
        </section>

        {/* Wells Score - Risk Assessment */}
        <section id="risk" className="py-24 bg-slate-900 text-white relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex justify-center gap-2 text-med-gold mb-4">
                  <ShieldCheck size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Clinical Decision Rules</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6">Pre-Test Probability</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  Validated scoring systems to estimate the probability of PE before definitive investigation. Determines whether D-dimer testing or direct imaging is appropriate.
                </p>
              </div>
              <WellsScoreCalculator />
            </div>
          </div>
        </section>

        {/* sPESI - Severity Stratification */}
        <section id="severity" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex justify-center gap-2 text-med-red mb-4">
                  <Activity size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Risk Stratification</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Severity Assessment</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                  Once PE is confirmed, the sPESI score stratifies patients into low and high risk categories, guiding inpatient vs outpatient management decisions.
                </p>
              </div>
              <SPESICalculator />

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <h4 className="font-bold text-emerald-900 text-sm mb-2">Low Risk PE</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    sPESI = 0. Consider early discharge and outpatient management with DOAC. Hestia criteria should also be assessed.
                  </p>
                </div>
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                  <h4 className="font-bold text-amber-900 text-sm mb-2">Submassive PE</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Haemodynamically stable but with RV dysfunction (echo/CT) and/or elevated troponin. Monitor closely; consider escalation if deterioration.
                  </p>
                </div>
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                  <h4 className="font-bold text-red-900 text-sm mb-2">Massive PE</h4>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Haemodynamic instability (SBP &lt;90 mmHg). Requires immediate resuscitation, anticoagulation, and consideration of systemic thrombolysis or surgical/interventional thrombectomy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acknowledgement */}
        <section id="authors" className="py-24 bg-slate-100 border-t border-slate-200">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col items-center mb-12">
              <BloodDoctorLogo className="text-3xl mb-4" />
              <h3 className="font-serif text-3xl text-slate-900">Production Acknowledgement</h3>
              <div className="mt-4 max-w-xl text-slate-500 italic">
                This educational clinical resource was produced and curated by:
                <div className="mt-4 font-serif text-2xl text-slate-800 not-italic">Dr Abdul Mannan <span className="text-sm font-sans font-medium text-slate-500 ml-1 italic">FRCPath FCPS</span></div>
              </div>
            </div>

            <div className="h-px w-24 bg-slate-200 mx-auto mb-16"></div>

            <div className="max-w-2xl mx-auto p-8 border border-slate-200 rounded-lg bg-white shadow-sm">
              <p className="text-slate-500 text-sm italic leading-relaxed">
                This investigation guide is based on current ESC/ERS guidelines for the diagnosis and management of acute pulmonary embolism, NICE guidelines, and BTS recommendations. For educational use in clinical haematology and acute medicine.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Resource by Blood Doctor</span>
                <BloodDoctorLogo className="scale-75 opacity-50" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-500 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-2xl mb-2 flex items-center gap-2">
              <HeartPulse className="text-med-red" size={28} />
              Blood Doctor
            </div>
            <p className="text-xs text-slate-400">PE Investigation Guide</p>
          </div>
          <div className="text-right">
            <p className="text-slate-300 font-serif text-lg">Dr Abdul Mannan</p>
            <p className="text-[10px] uppercase tracking-widest">FRCPath FCPS</p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Medical Disclaimer</a>
          </div>
        </div>
        <div className="text-center mt-12 text-[9px] text-slate-700 uppercase tracking-[0.3em]">
          &copy; 2025 Blood Doctor by Dr Abdul Mannan. For medical educational use only.
        </div>
      </footer>
    </div>
  );
};

export default App;
