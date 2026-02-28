import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  BedsideInvestigations,
  BloodInvestigations,
  ImagingInvestigations,
  WellsScoreCalculator,
  SPESICalculator,
  InvestigationSummaryTable,
  DiagnosticAlgorithm,
} from './components/PEInvestigations';
import {
  ArrowDown,
  Menu,
  X,
  Stethoscope,
  Activity,
  ShieldCheck,
  HeartPulse,
  FlaskConical,
  Scan,
  Droplets,
  FileText,
  AlertTriangle,
  Wind,
  Sparkles,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   REUSABLE MOTION COMPONENTS
   ───────────────────────────────────────────── */

/** Reveals children when they scroll into view */
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

/** Staggers children animation on scroll */
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
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
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

/** Consistent section header with icon, label, title, and description */
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
          PE Investigations
        </span>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   FLOATING DECORATIVE ELEMENTS
   ───────────────────────────────────────────── */
const FloatingOrb: React.FC<{
  size: string;
  color: string;
  position: string;
  delay?: number;
}> = ({ size, color, position, delay = 0 }) => (
  <div
    className={`absolute ${position} ${size} ${color} rounded-full blur-3xl opacity-30 pointer-events-none`}
    style={{
      animation: `float ${6 + delay}s ease-in-out ${delay}s infinite`,
    }}
  />
);

/* ─────────────────────────────────────────────
   NAVIGATION
   ───────────────────────────────────────────── */
const navLinks = [
  { id: 'algorithm', label: 'Algorithm' },
  { id: 'bedside', label: 'Bedside' },
  { id: 'bloods', label: 'Bloods' },
  { id: 'imaging', label: 'Imaging' },
  { id: 'risk', label: 'Risk Scores' },
  { id: 'severity', label: 'Severity' },
];

/* ─────────────────────────────────────────────
   MAIN APP COMPONENT
   ───────────────────────────────────────────── */
const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Hero parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // Scroll detection for nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Active section detection
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
          scrolled
            ? 'glass-panel shadow-lg shadow-slate-900/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <BloodDoctorLogo showSubtitle={scrolled} />
          </div>

          {/* Desktop nav links */}
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

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
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
                      activeSection === link.id
                        ? 'text-blood-700 bg-blood-50'
                        : 'text-slate-600 hover:bg-slate-100'
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
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blood-50/40 via-white to-med-cream z-0" />

        {/* Floating orbs */}
        <FloatingOrb size="w-96 h-96" color="bg-blood-200" position="top-20 -left-48" delay={0} />
        <FloatingOrb size="w-64 h-64" color="bg-blue-200" position="top-40 -right-32" delay={2} />
        <FloatingOrb size="w-48 h-48" color="bg-amber-200" position="bottom-32 left-1/4" delay={4} />

        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-40 z-0" />

        {/* Hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-6 text-center pt-24 pb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-sm">
              <Sparkles size={14} className="text-blood-600" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blood-700">
                Clinical Investigation Guide
              </span>
            </div>
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-medium leading-[1.05] mb-8 text-slate-900 max-w-5xl mx-auto">
              Pulmonary{' '}
              <br className="hidden sm:block" />
              <span className="italic font-light text-gradient-red">Embolism</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-slate-500 font-serif italic text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A comprehensive, evidence-based investigation checklist for the
            diagnosis and risk stratification of acute pulmonary embolism
          </motion.p>

          {/* Author attribution */}
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
              <span className="text-sm font-sans font-medium text-slate-400 ml-1 italic">
                FRCPath FCPS
              </span>
            </p>
          </motion.div>

          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-xl border-l-4 border-blood-700 hover-lift">
              <p className="text-slate-600 leading-relaxed italic text-base md:text-lg">
                "Pulmonary embolism remains a major cause of cardiovascular morbidity
                and mortality. Timely, structured investigation is critical to
                establish the diagnosis, assess severity, and guide appropriate
                management."
              </p>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                ESC/ERS Guidelines 2019
              </p>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16"
          >
            <a
              href="#summary"
              onClick={scrollToSection('summary')}
              className="inline-flex flex-col items-center gap-3 text-slate-400 hover:text-blood-700 transition-colors cursor-pointer group"
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase group-hover:tracking-[0.4em] transition-all">
                View Investigations
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown size={20} />
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main>
        {/* ──── Section Divider ──── */}
        <div className="section-divider" />

        {/* ──── Investigation Summary Table ──── */}
        <section id="summary" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<FileText size={22} />}
              label="At a Glance"
              title="Investigation Summary"
              description="Complete overview of investigations required for suspected pulmonary embolism, organised by category and timing."
              labelColor="text-blood-700"
            />
            <SectionReveal delay={0.15}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 p-4 md:p-8 hover-lift">
                <InvestigationSummaryTable />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Diagnostic Algorithm ──── */}
        <section id="algorithm" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Left description */}
              <div className="lg:col-span-4">
                <SectionHeader
                  icon={<Wind size={22} />}
                  label="Diagnostic Pathway"
                  title="Clinical Algorithm"
                  description="The diagnostic approach to PE follows a structured algorithm based on clinical probability assessment, biomarker testing, and definitive imaging."
                  labelColor="text-blood-700"
                  align="left"
                />
                <SectionReveal delay={0.2}>
                  <div className="space-y-6">
                    <p className="text-slate-500 text-base leading-relaxed">
                      This evidence-based pathway minimises unnecessary imaging
                      while ensuring high-risk patients receive timely definitive
                      investigation.
                    </p>
                    <div className="p-5 bg-gradient-to-br from-red-50 to-amber-50 border border-red-200/50 rounded-xl">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                        <AlertTriangle size={16} className="text-blood-700" />
                        Haemodynamic Instability
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        If the patient is haemodynamically unstable (SBP &lt;90 mmHg),
                        proceed directly to bedside echo and consider empirical
                        thrombolysis. Do not delay for CTPA.
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              </div>

              {/* Right algorithm */}
              <div className="lg:col-span-8">
                <SectionReveal delay={0.3}>
                  <DiagnosticAlgorithm />
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Bedside Investigations ──── */}
        <section id="bedside" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<Stethoscope size={22} />}
              label="Immediate Assessment"
              title="Bedside Investigations"
              description="Investigations performed at the bedside immediately upon clinical suspicion of PE. These guide initial management and haemodynamic assessment."
              labelColor="text-med-blue"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-4xl mx-auto">
                <BedsideInvestigations />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Blood Investigations ──── */}
        <section id="bloods" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<FlaskConical size={22} />}
              label="Laboratory"
              title="Blood Investigations"
              description="Laboratory investigations for diagnosis, risk stratification, and safe initiation of anticoagulation therapy."
              labelColor="text-blood-700"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-4xl mx-auto">
                <BloodInvestigations />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Imaging Investigations ──── */}
        <section id="imaging" className="py-24 md:py-32 bg-med-cream relative">
          <div className="container mx-auto px-6">
            <SectionHeader
              icon={<Scan size={22} />}
              label="Radiology & Imaging"
              title="Imaging Investigations"
              description="Imaging modalities used for confirming PE, assessing right ventricular function, and identifying concurrent DVT."
              labelColor="text-med-blue"
            />
            <SectionReveal delay={0.15}>
              <div className="max-w-4xl mx-auto">
                <ImagingInvestigations />
              </div>
            </SectionReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ──── Wells Score (Dark Section) ──── */}
        <section
          id="risk"
          className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-med-dark text-white relative overflow-hidden noise-overlay"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blood-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <SectionReveal>
                <div className="text-center mb-16">
                  <div className="flex items-center gap-2 text-med-gold mb-4 justify-center">
                    <ShieldCheck size={22} />
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase">
                      Clinical Decision Rules
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.1]">
                    Pre-Test Probability
                  </h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Validated scoring systems to estimate the probability of PE
                    before definitive investigation. Determines whether D-dimer
                    testing or direct imaging is appropriate.
                  </p>
                </div>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <WellsScoreCalculator />
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* ──── sPESI Severity ──── */}
        <section id="severity" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                icon={<Activity size={22} />}
                label="Risk Stratification"
                title="Severity Assessment"
                description="Once PE is confirmed, the sPESI score stratifies patients into low and high risk categories, guiding inpatient vs outpatient management decisions."
                labelColor="text-blood-700"
              />

              <SectionReveal delay={0.15}>
                <SPESICalculator />
              </SectionReveal>

              {/* Severity classification cards */}
              <StaggerContainer className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.1}>
                <StaggerItem>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 rounded-2xl hover-lift h-full">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <ShieldCheck size={20} className="text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-emerald-900 text-sm mb-2">Low Risk PE</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      sPESI = 0. Consider early discharge and outpatient management
                      with DOAC. Hestia criteria should also be assessed.
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60 rounded-2xl hover-lift h-full">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                      <AlertTriangle size={20} className="text-amber-600" />
                    </div>
                    <h4 className="font-bold text-amber-900 text-sm mb-2">Submassive PE</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Haemodynamically stable but with RV dysfunction (echo/CT) and/or
                      elevated troponin. Monitor closely; consider escalation if
                      deterioration.
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 rounded-2xl hover-lift h-full">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <HeartPulse size={20} className="text-red-600" />
                    </div>
                    <h4 className="font-bold text-red-900 text-sm mb-2">Massive PE</h4>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Haemodynamic instability (SBP &lt;90 mmHg). Requires immediate
                      resuscitation, anticoagulation, and consideration of systemic
                      thrombolysis or surgical/interventional thrombectomy.
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
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
                <h3 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2">
                  Production Acknowledgement
                </h3>
                <div className="mt-4 max-w-xl text-slate-500 italic">
                  This educational clinical resource was produced and curated by:
                  <div className="mt-4 font-serif text-2xl md:text-3xl text-slate-800 not-italic">
                    Dr Abdul Mannan{' '}
                    <span className="text-sm font-sans font-medium text-slate-400 ml-1 italic">
                      FRCPath FCPS
                    </span>
                  </div>
                </div>
              </div>
            </SectionReveal>

            <div className="section-divider max-w-24 mx-auto mb-16" />

            <SectionReveal delay={0.2}>
              <div className="max-w-2xl mx-auto glass-panel p-8 md:p-10 rounded-2xl shadow-lg hover-lift">
                <p className="text-slate-500 text-sm italic leading-relaxed">
                  This investigation guide is based on current ESC/ERS guidelines
                  for the diagnosis and management of acute pulmonary embolism, NICE
                  guidelines, and BTS recommendations. For educational use in
                  clinical haematology and acute medicine.
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
        {/* Top gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-blood-700 to-transparent" />

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Logo and tagline */}
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
                Evidence-based clinical education<br />for haematology & acute medicine
              </p>
            </div>

            {/* Author */}
            <div className="text-center">
              <p className="text-slate-300 font-serif text-lg mb-1">Dr Abdul Mannan</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                FRCPath FCPS
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-end text-[10px] font-bold tracking-[0.2em] uppercase">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/50">
          <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em]">
              &copy; 2025 Blood Doctor by Dr Abdul Mannan. For medical educational use only.
            </p>
            <p className="text-[9px] text-slate-700 uppercase tracking-[0.2em]">
              #BloodDoctor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
