import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  KeyFacts,
  ClinicalContexts,
  DiagnosticApproach,
  DiagnosticPitfalls,
  ManagementStrategies,
  ManagementPathway,
  References,
  type Reference,
} from './components/MyeloidSarcomaContent';
import {
  ArrowDown,
  Menu,
  X,
  Droplets,
  Sparkles,
  GraduationCap,
  Microscope,
  Stethoscope,
  Syringe,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  HeartPulse,
  ClipboardList,
  ShieldCheck,
  Activity,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   REUSABLE MOTION COMPONENTS
   ───────────────────────────────────────────── */

const SectionReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}> = ({ children, className = '', stagger = 0.08 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  labelColor?: string;
  align?: 'center' | 'left';
}> = ({ icon, label, title, description, labelColor = 'text-blood-700', align = 'center' }) => (
  <SectionReveal className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}>
    <div className={`flex items-center gap-2 ${labelColor} mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
      {icon}
      <span className="text-[10px] font-black tracking-[0.25em] uppercase">{label}</span>
    </div>
    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-slate-900 leading-[1.1]">{title}</h2>
    <p className={`text-slate-500 text-lg leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>
      {description}
    </p>
  </SectionReveal>
);

/* ─────────────────────────────────────────────
   BLOOD DOCTOR LOGO
   ───────────────────────────────────────────── */
const BloodDoctorLogo: React.FC<{ className?: string; showSubtitle?: boolean }> = ({
  className = '',
  showSubtitle = false,
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <div className="w-9 h-9 bg-gradient-to-br from-blood-700 to-blood-900 rounded-lg flex items-center justify-center shadow-lg shadow-blood-900/20">
        <Droplets size={18} className="text-white" />
      </div>
      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blood-500 rounded-full animate-pulse" />
    </div>
    <div className="flex flex-col">
      <span className="font-serif font-bold text-lg leading-none tracking-tight">
        <span className="text-slate-900">Blood</span>
        <span className="text-blood-700">Doctor</span>
      </span>
      {showSubtitle && (
        <span className="text-[9px] font-sans font-medium text-slate-400 tracking-wider uppercase mt-0.5">
          Myeloid Sarcoma · Breast
        </span>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   FLOATING DECORATIVE ELEMENTS
   ───────────────────────────────────────────── */
const FloatingOrb: React.FC<{ size: string; color: string; position: string; delay?: number }> = ({
  size,
  color,
  position,
  delay = 0,
}) => (
  <div
    className={`absolute ${position} ${size} ${color} rounded-full blur-3xl opacity-30 pointer-events-none`}
    style={{ animation: `float ${6 + delay}s ease-in-out ${delay}s infinite` }}
  />
);

/* ─────────────────────────────────────────────
   REFERENCE DATA (verified against PubMed / DOI)
   ───────────────────────────────────────────── */
const REFERENCES: Reference[] = [
  { authors: 'Patkowska E, Krzywdzińska A, Solarska I, et al.', year: '2025', title: 'Diagnostic Approaches in Myeloid Sarcoma', source: 'Curr Issues Mol Biol 47(2):111', doi: '10.3390/cimb47020111' },
  { authors: 'Magdy M, Abdel Karim N, Eldessouki I', year: '2019', title: 'Myeloid Sarcoma', source: 'Oncol Res Treat 42(4):219–224', doi: '10.1159/000497210' },
  { authors: 'Chisholm KM', year: '2019', title: 'Myeloid sarcoma', source: 'Atlas Genet Cytogenet Oncol Haematol', doi: '10.4267/2042/70458' },
  { authors: 'Shaikh MS, Kayani N', year: '2015', title: 'Aleukemic myeloid sarcoma of the breast', source: 'J Coll Physicians Surg Pak 25(Suppl 2):S122–3', pmid: '26522197' },
  { authors: 'Wu HY, Liu L, Gu L, Luo YH', year: '2019', title: 'Clinical characteristics and management of primary granulocytic sarcoma of the breast: a case report', source: 'Medicine (Baltimore) 98(35):e16648', pmid: '31464900' },
  { authors: 'Girshova L, Romanova E, Kholopova IV, et al.', year: '2012', title: 'Isolated myeloid sarcoma involving the breast', source: 'Blood 120(21):4345', doi: '10.1182/blood.v120.21.4345.4345' },
  { authors: 'Zhang Z, Chen Y, Zhang R, et al.', year: '2024', title: 'Primary breast myeloid sarcoma: a case report and literature review', source: 'Oncol Lett 29(1)', doi: '10.3892/ol.2024.14804' },
  { authors: 'Amiraian D, McDonough M, Geiger X', year: '2022', title: 'Bilateral myeloid sarcoma of the breast: a case report with radiological and pathological correlation', source: 'Cureus 14(5):e24731', pmid: '35686262' },
  { authors: 'Oravcova I, Mikuskova E, Leitnerova M, et al.', year: '2018', title: 'A unique clinical presentation of de novo acute promyelocytic leukemia as a myeloid sarcoma of the breast', source: 'Int J Hematol 108(5):550–553', pmid: '29931624' },
  { authors: 'Minoia C, de Fazio V, Scognamillo G, et al.', year: '2019', title: 'Long-lasting remission in de novo breast myeloid sarcoma treated with decitabine and radiotherapy', source: 'Diagnostics (Basel) 9(3):84', pmid: '31357576' },
  { authors: 'Ding JS, Zhang M, Zhou F', year: '2026', title: 'A primary breast collision tumor composed of myeloid sarcoma and invasive ductal carcinoma', source: 'Front Oncol 16:1788294', pmid: '41889414' },
  { authors: 'Bourque JM, Gaudet JG, Manengue A', year: '2025', title: 'Radiotherapy for isolated breast myeloid sarcoma', source: 'J Med Cases 16(9):360–365', doi: '10.14740/jmc4334' },
  { authors: 'Bakst R, Wolden S, Yahalom J', year: '2011', title: 'Radiation therapy for chloroma (granulocytic sarcoma)', source: 'Int J Radiat Oncol Biol Phys 82(5):1816–22', pmid: '21962486' },
  { authors: 'Antic D, Elezovic I, Milic N, et al.', year: '2012', title: 'Is there a "gold" standard treatment for patients with isolated myeloid sarcoma?', source: 'Biomed Pharmacother 67(1):72–7', pmid: '23218987' },
  { authors: 'Cunningham I', year: '2012', title: 'A basis for updating our approach to resistant acute leukemia (breast leukaemic tumours)', source: 'Am J Hematol 87(3):251–7', pmid: '22287495' },
  { authors: 'Vickery J, Peerenboom R, Siddiqui F, et al.', year: '2026', title: 'Hematolymphoid neoplasms involving the breast: a single-institution clinicopathologic study of 59 patients', source: 'Ann Hematol 105(5)', pmid: '41957230' },
  { authors: 'Chiu AM, Yoon J, Tirumani SH', year: '2023', title: 'Myeloid sarcoma: a primer for radiologists', source: 'J Comput Assist Tomogr 47(3):475–484', doi: '10.1097/rct.0000000000001440' },
];

/* ─────────────────────────────────────────────
   PROGNOSIS CARDS
   ───────────────────────────────────────────── */
const prognosisCards = [
  {
    title: 'Heterogeneous, generally guarded',
    body: 'Retrospective data place median overall survival for myeloid sarcoma at around 13 months, but outcome varies widely with biology, timing and treatment.',
    accent: 'from-amber-50 to-yellow-50 border-amber-200/60',
    chip: 'bg-amber-100 text-amber-700',
    chipText: '~13 mo median OS (overall MS)',
  },
  {
    title: 'Isolated breast MS heralds AML',
    body: 'Untreated or locally-treated isolated disease progresses to overt AML in the great majority of patients (reported up to ~95%, typically within 1–48 months).',
    accent: 'from-red-50 to-rose-50 border-red-200/60',
    chip: 'bg-blood-100 text-blood-700',
    chipText: 'Progression to AML',
  },
  {
    title: 'Timely systemic therapy can cure',
    body: 'AML-type induction with risk-adapted consolidation (± allogeneic transplant, ± local radiotherapy) has produced durable complete remissions in breast MS case reports.',
    accent: 'from-emerald-50 to-green-50 border-emerald-200/60',
    chip: 'bg-emerald-100 text-emerald-700',
    chipText: 'Durable remission possible',
  },
];

/* ─────────────────────────────────────────────
   NAVIGATION
   ───────────────────────────────────────────── */
const navLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'pitfalls', label: 'Pitfalls' },
  { id: 'management', label: 'Management' },
  { id: 'prognosis', label: 'Prognosis' },
  { id: 'references', label: 'References' },
];

/* ─────────────────────────────────────────────
   MAIN APP COMPONENT
   ───────────────────────────────────────────── */
const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = navLinks.map((l) => l.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-med-cream text-slate-900 font-sans">
      {/* ═══════════ NAVIGATION ═══════════ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-panel shadow-lg shadow-slate-900/5 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BloodDoctorLogo showSubtitle={scrolled} />
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={scrollToSection(link.id)}
                className={`nav-link px-3 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors rounded-lg ${
                  activeSection === link.id
                    ? 'text-blood-700 bg-blood-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden glass-panel border-t border-slate-200/50"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={scrollToSection(link.id)}
                    className={`block px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                      activeSection === link.id ? 'text-blood-700 bg-blood-50' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <header
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blood-50/40 via-white to-med-cream z-0" />
        <FloatingOrb size="w-96 h-96" color="bg-blood-200" position="top-20 -left-48" delay={0} />
        <FloatingOrb size="w-64 h-64" color="bg-indigo-200" position="top-40 -right-32" delay={2} />
        <FloatingOrb size="w-48 h-48" color="bg-amber-200" position="bottom-32 left-1/4" delay={4} />
        <div className="absolute inset-0 dot-pattern opacity-40 z-0" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-6 text-center pt-24 pb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-sm">
              <Sparkles size={14} className="text-blood-600" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blood-700">
                Evidence-Based Clinical Guide
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-medium leading-[1.05] mb-8 text-slate-900 max-w-5xl mx-auto">
              Myeloid Sarcoma{' '}
              <br className="hidden sm:block" />
              of the <span className="italic font-light text-gradient-red">Breast</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-slate-500 font-serif italic text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Diagnostic approach and management strategies for a rare extramedullary
            presentation of acute myeloid leukaemia — and why it must be treated as systemic disease
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-14"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              Produced for Clinical Education by
            </p>
            <p className="font-serif text-2xl md:text-3xl text-slate-800">
              Dr Abdul Mannan{' '}
              <span className="text-sm font-sans font-medium text-slate-400 ml-1 italic">FRCPath FCPS</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-xl border-l-4 border-blood-700 hover-lift">
              <p className="text-slate-600 leading-relaxed italic text-base md:text-lg">
                "A breast mass that proves to be myeloid sarcoma is acute myeloid leukaemia in
                disguise. Even when the marrow is clear, local excision alone is not enough — the
                diagnosis turns on a myeloid immunohistochemistry panel, and the cure turns on
                systemic therapy."
              </p>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Core Teaching Point
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16"
          >
            <a
              href="#overview"
              onClick={scrollToSection('overview')}
              className="inline-flex flex-col items-center gap-3 text-slate-400 hover:text-blood-700 transition-colors cursor-pointer group"
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase group-hover:tracking-[0.4em] transition-all">
                Begin
              </span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowDown size={20} />
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main>
        <div className="section-divider" />

        {/* ──── Overview ──── */}
        <section id="overview" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<ClipboardList size={22} />}
              label="At a Glance"
              title="Overview"
              description="Myeloid sarcoma (granulocytic sarcoma / chloroma) is an extramedullary tumour of myeloid blasts. In the breast it is rare, easily misdiagnosed, and always part of the spectrum of acute myeloid leukaemia."
              labelColor="text-blood-700"
            />
            <SectionReveal delay={0.15}>
              <KeyFacts />
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Clinical Presentation ──── */}
        <section id="presentation" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<Stethoscope size={22} />}
              label="Clinical Context"
              title="Presentation"
              description="A painless breast mass that mimics carcinoma or lymphoma — arising in one of four clinical contexts that determine staging and treatment."
              labelColor="text-med-blue"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-5xl mx-auto">
                <ClinicalContexts />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Diagnostic Approach ──── */}
        <section id="diagnosis" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<Microscope size={22} />}
              label="Work-Up"
              title="Diagnostic Approach"
              description="A structured pathway from imaging to tissue diagnosis, immunophenotyping, genetics and staging. Core biopsy with a myeloid IHC panel is the cornerstone."
              labelColor="text-blood-700"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-4xl mx-auto">
                <DiagnosticApproach />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Diagnostic Pitfalls ──── */}
        <section id="pitfalls" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<AlertTriangle size={22} />}
              label="Avoid Misdiagnosis"
              title="Diagnostic Pitfalls"
              description="Breast myeloid sarcoma is frequently misclassified at first biopsy. Recognising the common traps — and adding MPO to the panel — prevents costly delays."
              labelColor="text-amber-600"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-5xl mx-auto">
                <DiagnosticPitfalls />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Management Strategies ──── */}
        <section id="management" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<Syringe size={22} />}
              label="Treatment"
              title="Management Strategies"
              description="Systemic AML-type therapy is the backbone of curative-intent treatment; surgery and radiotherapy play supporting roles only."
              labelColor="text-blood-700"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-5xl mx-auto">
                <ManagementStrategies />
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* ──── Management Pathway (Dark) ──── */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-med-dark text-white relative overflow-hidden noise-overlay">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blood-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <SectionReveal>
                <div className="text-center mb-16">
                  <div className="flex items-center gap-2 text-med-gold mb-4 justify-center">
                    <ShieldCheck size={22} />
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase">Putting It Together</span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.1]">
                    The Management Pathway
                  </h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    From tissue diagnosis to systemic therapy, consolidation and surveillance — a
                    pragmatic sequence for the patient with breast myeloid sarcoma.
                  </p>
                </div>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <ManagementPathway />
              </SectionReveal>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Prognosis ──── */}
        <section id="prognosis" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<TrendingUp size={22} />}
              label="Outcomes"
              title="Prognosis"
              description="Outcomes are heterogeneous and depend on biology, clinical context and the timeliness of systemic treatment."
              labelColor="text-blood-700"
            />
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" stagger={0.1}>
              {prognosisCards.map((c) => (
                <StaggerItem key={c.title}>
                  <div className={`p-6 bg-gradient-to-br ${c.accent} border rounded-2xl hover-lift h-full`}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 ${c.chip}`}>
                      {c.chipText}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{c.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <SectionReveal delay={0.2}>
              <div className="max-w-3xl mx-auto mt-12 p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <Activity size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  Evidence quality note: the literature on breast myeloid sarcoma consists almost
                  entirely of single case reports and small series. There are no breast-specific
                  prospective trials; recommendations are extrapolated from myeloid sarcoma and AML
                  data and should be applied with clinical judgement.
                </p>
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── References ──── */}
        <section id="references" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<BookOpen size={22} />}
              label="Evidence Base"
              title="References"
              description="Key primary sources and reviews underpinning this guide. Links resolve to the published article via DOI or PubMed."
              labelColor="text-med-blue"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-4xl mx-auto">
                <References references={REFERENCES} />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Acknowledgement ──── */}
        <section id="authors" className="py-24 md:py-32 bg-med-cream relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-30" />
          <div className="container mx-auto px-6 relative z-10">
            <SectionReveal className="text-center">
              <div className="flex flex-col items-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blood-700 to-blood-900 rounded-2xl flex items-center justify-center shadow-xl shadow-blood-900/20 mb-6">
                  <GraduationCap size={28} className="text-white" />
                </div>
                <h3 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2">Production Acknowledgement</h3>
                <div className="mt-4 max-w-xl text-slate-500 italic">
                  This educational clinical resource was produced and curated by:
                  <div className="mt-4 font-serif text-2xl md:text-3xl text-slate-800 not-italic">
                    Dr Abdul Mannan{' '}
                    <span className="text-sm font-sans font-medium text-slate-400 ml-1 italic">FRCPath FCPS</span>
                  </div>
                </div>
              </div>
            </SectionReveal>

            <div className="section-divider max-w-24 mx-auto mb-16" />

            <SectionReveal delay={0.2}>
              <div className="max-w-2xl mx-auto glass-panel p-8 md:p-10 rounded-2xl shadow-lg hover-lift">
                <p className="text-slate-500 text-sm italic leading-relaxed">
                  This guide synthesises current peer-reviewed literature on myeloid sarcoma of the
                  breast. It is for clinical education only. Management decisions must be based on
                  individual patient assessment, multidisciplinary haemato-oncology input, and current
                  guidelines — not on this resource alone.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-200/50 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Digital Resource by Blood Doctor
                  </span>
                  <BloodDoctorLogo className="opacity-60" />
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400 overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-blood-700 to-transparent" />
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blood-700 to-blood-900 rounded-xl flex items-center justify-center shadow-lg">
                  <HeartPulse size={20} className="text-white" />
                </div>
                <span className="font-serif font-bold text-xl text-white">
                  Blood<span className="text-blood-400">Doctor</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evidence-based clinical education<br />for haematology &amp; acute medicine
              </p>
            </div>

            <div className="text-center">
              <p className="text-slate-300 font-serif text-lg mb-1">Dr Abdul Mannan</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">FRCPath FCPS</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-end text-[10px] font-bold tracking-[0.2em] uppercase">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50">
          <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em]">
              &copy; 2026 Blood Doctor by Dr Abdul Mannan. For medical educational use only.
            </p>
            <p className="text-[9px] text-slate-700 uppercase tracking-[0.2em]">#BloodDoctor</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
