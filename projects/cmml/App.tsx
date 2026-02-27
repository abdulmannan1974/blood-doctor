import React, { useState, useEffect } from 'react';
import { HematologyScene } from './components/HematologyScene';
import { 
  DiagnosticChecklist, 
  GenomicGrid, 
  PrognosisScoreboard, 
  TreatmentTree, 
  DifferentialDiagnosisTable,
  SubtypeComparison,
  TreatmentIndications,
  FutureTherapies
} from './components/ClinicalDiagrams';
import { 
  ArrowDown, Menu, X, Microscope, Activity, ShieldCheck, 
  HeartPulse, ListChecks, Info, Beaker, FileText, Globe,
  Stethoscope, Droplets
} from 'lucide-react';

const BloodDoctorLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-1 font-serif font-bold tracking-tight ${className}`}>
    <span className="text-slate-900">Blood</span>
    <Droplets size={20} className="text-red-600 fill-red-600 animate-pulse" />
    <span className="text-red-700">Doctor</span>
  </div>
);

const AuthorBadge = ({ name, affiliation }: { name: string; affiliation: string }) => (
  <div className="flex flex-col p-4 bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
    <span className="font-serif font-bold text-slate-900">{name}</span>
    <span className="text-xs text-slate-500 uppercase tracking-tighter mt-1 leading-tight">{affiliation}</span>
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
                Blood Doctor <span className="font-normal text-slate-400 ml-2">Haematology</span>
              </span>
            </div>
            <div className={`h-6 w-px bg-slate-200 transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>
            <BloodDoctorLogo className={`transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold tracking-widest text-slate-600 uppercase">
            <a href="#pathophysiology" onClick={scrollToSection('pathophysiology')} className="hover:text-med-red transition-colors cursor-pointer">Pathogenesis</a>
            <a href="#diagnosis" onClick={scrollToSection('diagnosis')} className="hover:text-med-red transition-colors cursor-pointer">Diagnosis</a>
            <a href="#prognosis" onClick={scrollToSection('prognosis')} className="hover:text-med-red transition-colors cursor-pointer">Prognosis</a>
            <a href="#therapy" onClick={scrollToSection('therapy')} className="hover:text-med-red transition-colors cursor-pointer">Therapy</a>
            <a href="#future" onClick={scrollToSection('future')} className="hover:text-med-red transition-colors cursor-pointer">Future</a>
          </div>

          <button className="lg:hidden text-slate-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-white">
        <HematologyScene />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-slate-50 z-0"></div>

        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <div className="flex flex-col items-center gap-4 mb-6">
            <BloodDoctorLogo className="text-2xl" />
            <div className="inline-block px-4 py-1 border border-med-red text-med-red text-[10px] tracking-[0.3em] uppercase font-black rounded-full bg-white/50 backdrop-blur-sm">
              State-of-the-Art Review
            </div>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-medium leading-[1.1] mb-8 text-slate-900 max-w-5xl mx-auto">
            Blood Doctor <br/><span className="italic font-light">Haematology Learning</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="text-slate-500 font-serif italic text-lg md:text-xl">K. Nachtkamp</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-serif italic text-lg md:text-xl">F. Schulz</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-serif italic text-lg md:text-xl">N. Gattermann</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-serif italic text-lg md:text-xl">U. Germing</span>
          </div>

          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Produced for Clinical Education by</p>
            <p className="font-serif text-2xl text-slate-800">Dr Abdul Mannan <span className="text-sm font-sans font-medium text-slate-500 ml-1 italic text-base">FRCPath FCPS</span></p>
          </div>
          
          <div className="max-w-3xl mx-auto glass-panel p-8 rounded-xl shadow-lg text-left border-l-4 border-med-red">
            <p className="text-slate-600 leading-relaxed italic text-lg">
              "Chronic myelomonocytic leukaemias (CMML) are myeloid neoplasms characterized by a sustained increase in monocyte counts, accompanied by dysplasia, abnormal proliferation, chromosomal anomalies and somatic mutations of haematopoietic cells."
            </p>
          </div>

          <div className="mt-16 flex justify-center">
             <a href="#pathophysiology" onClick={scrollToSection('pathophysiology')} className="animate-bounce group flex flex-col items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
                <span className="tracking-[0.2em] uppercase">Start Detailed Review</span>
                <ArrowDown size={20} />
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Pathophysiology & Genetics */}
        <section id="pathophysiology" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 text-med-red mb-4">
                  <Microscope size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Pathogenesis</span>
                </div>
                <h2 className="font-serif text-4xl mb-8 leading-tight text-slate-900">The Molecular Landscape</h2>
                <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                  <p>
                    CMML development is driven by somatic mutations in haematopoietic stem cells that alter DNA methylation, RNA splicing, histone modification, and cell signalling.
                  </p>
                  <p>
                    Over <strong className="text-slate-900">95%</strong> of patients harbour one or more somatic mutations. TET2 (~60%), SRSF2 (~50%), and ASXL1 (~40%) are the primary drivers.
                  </p>
                  <div className="p-4 bg-white border rounded border-slate-200 text-sm">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Activity size={16} className="text-med-red" />
                      Clonal Evolution
                    </h4>
                    Epigenetic genes are typically affected early, followed by RNA splicing mutations, and later by signalling pathway genes (RAS) which drive proliferation and AML transformation.
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <GenomicGrid />
              </div>
            </div>
          </div>
        </section>

        {/* Diagnosis & Subtypes */}
        <section id="diagnosis" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
             <div className="text-center mb-16">
                <div className="flex justify-center gap-2 text-med-blue mb-4">
                  <ListChecks size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Diagnostic Framework</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Establishing the Diagnosis</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                  CMML must be separated from other myeloid neoplasms and reactive monocytosis using WHO 2022 and International Consensus Classification (ICC) criteria.
                </p>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
                <DiagnosticChecklist />
                <div className="space-y-6">
                  <div className="glass-panel p-8 rounded-2xl border-t-4 border-med-blue">
                    <h3 className="font-serif text-2xl mb-4 text-slate-900">Morphology & Flow Cytometry</h3>
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                      Diagnosis relies on absolute monocytosis (>0.5 x 10⁹/L) and >10% of WBC. Flow cytometry shows >95% CD14+/CD16- classical monocytes.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Esterase Staining</span>
                        <span className="text-xs font-bold text-slate-700">Better monocyte ID</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blast Equivalent</span>
                        <span className="text-xs font-bold text-slate-700">Includes Promonocytes</span>
                      </div>
                    </div>
                  </div>
                  <DifferentialDiagnosisTable />
                </div>
             </div>

             <div className="pt-12 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-8">
                  <Info size={20} />
                  <span className="text-xs font-black tracking-widest uppercase">Classification Subgroups</span>
                </div>
                <SubtypeComparison />
             </div>
          </div>
        </section>

        {/* Prognosis Section */}
        <section id="prognosis" className="py-24 bg-slate-900 text-white relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                 <div className="flex items-center gap-2 text-med-gold mb-4">
                  <Activity size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Stratification</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl mb-8">Risk Assessment</h2>
                <div className="space-y-6 text-slate-300 leading-relaxed text-lg mb-12">
                  <p>
                    Standard MDS scores like IPSS-R are poorly suited for CMML. CMML-specific tools like CPSSmol and iCPSS provide superior stratification.
                  </p>
                  <p className="text-sm italic border-l-2 border-med-gold pl-6 py-2">
                    "Trisomy 8 is associated with high risk in CMML but not in MDS. Parameters like monocytosis and molecular markers (ASXL1) are critical."
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="font-bold text-med-gold uppercase text-[10px] tracking-widest mb-1">iCPSS Evolution</h4>
                    <p className="text-slate-400 text-xs">Recently proposed AI-driven score identifying 5 distinct risk groups by combining clinical findings with 10 somatic mutations.</p>
                  </div>
                  <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="font-bold text-med-gold uppercase text-[10px] tracking-widest mb-1">Mayo Model</h4>
                    <p className="text-slate-400 text-xs">Utilizes ASXL1 mutation and absolute monocyte count as primary risk parameters.</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <PrognosisScoreboard />
              </div>
            </div>
          </div>
        </section>

        {/* Therapy Indications */}
        <section id="indications" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-2 text-med-red mb-4">
              <Stethoscope size={24} />
              <span className="text-xs font-black tracking-widest uppercase">Clinical Decisions</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-12 text-center text-slate-900">Indications for Treatment</h2>
            <TreatmentIndications />
          </div>
        </section>

        {/* Therapy */}
        <section id="therapy" className="py-24 bg-slate-50 border-y border-slate-200">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center mb-16">
                 <div className="flex justify-center gap-2 text-med-red mb-4">
                    <HeartPulse size={24} />
                    <span className="text-xs font-black tracking-widest uppercase">Clinical Management</span>
                 </div>
                 <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Therapeutic Pathways</h2>
                 <p className="text-slate-600 text-lg leading-relaxed mb-8">
                   Treatment options are limited. 5-azacitidine is the only approved compound for dysplastic CMML in the EU. Allogeneic stem cell transplantation remains the only curative approach.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4">
                    <div className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">Wait & Watch (~10%)</div>
                    <div className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">Cytoreduction</div>
                    <div className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">HMA ± BCL2-i</div>
                 </div>
              </div>
              
              <TreatmentTree />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                    <Beaker size={18} className="text-med-red" />
                    HMA Therapy Considerations
                  </h4>
                  <ul className="space-y-3 text-slate-600 text-sm leading-relaxed list-disc pl-5">
                    <li>Decitabine has higher potential to normalize WBC in proliferative types.</li>
                    <li>Response rates are lower and relapses more frequent than in MDS.</li>
                    <li>TET2 mutations potentially predict outcome after decitabine.</li>
                    <li>Addition of venetoclax (BCL2-i) is justified in HMA-refractory cases.</li>
                  </ul>
                </div>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                    <Globe size={18} className="text-med-red" />
                    Allo-SCT: The Curative Goal
                  </h4>
                  <ul className="space-y-3 text-slate-600 text-sm leading-relaxed list-disc pl-5">
                    <li>Long-term outcome is worse than in MDS due to higher relapse rates.</li>
                    <li>High-risk CPSSmol should prompt immediate transplant planning.</li>
                    <li>Conditioning intensity is individualized based on fitness and disease biology.</li>
                    <li>Debulking with HMA before transplant remains debatable but may help.</li>
                  </ul>
                </div>
              </div>
           </div>
        </section>

        {/* Future Developments */}
        <section id="future" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 text-med-blue mb-4">
                  <Beaker size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Emerging Science</span>
                </div>
                <h2 className="font-serif text-4xl mb-6 text-slate-900">Future Directions</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Drug development is shifting toward targeting specific molecular vulnerabilities and neutralizing growth factor hypersensitivity.
                </p>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl italic text-sm text-slate-500">
                  "As the myeloproliferative type is characterized by GM-CSF hypersensitivity, neutralizing this pathway (Lenzilumab) is a promising target."
                </div>
              </div>
              <div className="lg:col-span-7">
                <FutureTherapies />
              </div>
            </div>
          </div>
        </section>

        {/* Acknowledgement and Authors Info */}
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

             <h3 className="font-serif text-xl mb-12 text-slate-600 uppercase tracking-widest">Academic Review Authors</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <AuthorBadge name="K. Nachtkamp" affiliation="HHU Düsseldorf" />
                <AuthorBadge name="F. Schulz" affiliation="HHU Düsseldorf" />
                <AuthorBadge name="N. Gattermann" affiliation="HHU Düsseldorf" />
                <AuthorBadge name="U. Germing" affiliation="HHU Düsseldorf" />
             </div>
             
             <div className="max-w-2xl mx-auto p-8 border border-slate-200 rounded-lg bg-white shadow-sm">
                <p className="text-slate-500 text-sm italic leading-relaxed">
                  Published in the British Journal of Haematology, 2025. Volume 207, pages 350–364. This review summarizes the state of the art in clinical management of Chronic Myelomonocytic Leukaemia.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Review by Senior Medical Engineer</span>
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
                  <ShieldCheck className="text-med-red" size={28} />
                  Blood Doctor
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs">
                  <span className="text-slate-400">Curated by</span>
                  <BloodDoctorLogo className="invert grayscale brightness-200 scale-90" />
                </div>
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
            © 2025 Blood Doctor by Dr Abdul Mannan. For medical educational use only.
        </div>
      </footer>
    </div>
  );
};

export default App;