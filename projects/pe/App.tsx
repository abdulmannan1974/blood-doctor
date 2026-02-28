import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
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
  FileText, AlertTriangle, Wind, Sparkles, ChevronRight
} from 'lucide-react';

// =====================================================
// ANIMATED SECTION WRAPPER (scroll-triggered)
// =====================================================
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// =====================================================
// FLOATING BLOOD CELLS (Hero background)
// =====================================================
const FloatingBloodCells: React.FC = () => {
  const cells = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.06 + 0.02,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cells.map((cell) => (
        <motion.div
          key={cell.id}
          className="absolute rounded-full"
          style={{
            width: cell.size,
            height: cell.size,
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            background: `radial-gradient(circle, rgba(220, 38, 38, ${cell.opacity * 3}), rgba(153, 27, 27, ${cell.opacity}))`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: cell.duration,
            delay: cell.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// =====================================================
// HEARTBEAT LINE (SVG animation)
// =====================================================
const HeartbeatLine: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-20">
    <svg viewBox="0 0 1200 80" className="w-full h-full" preserveAspectRatio="none">
      <motion.path
        d="M0,40 L200,40 L220,40 L240,10 L260,70 L280,20 L300,60 L320,40 L500,40 L520,40 L540,10 L560,70 L580,20 L600,60 L620,40 L800,40 L820,40 L840,10 L860,70 L880,20 L900,60 L920,40 L1200,40"
        fill="none"
        stroke="url(#heartbeatGradient)"
        strokeWidth="2"
        className="pulse-line"
      />
      <defs>
        <linearGradient id="heartbeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(220, 38, 38, 0)" />
          <stop offset="30%" stopColor="rgba(220, 38, 38, 0.8)" />
          <stop offset="50%" stopColor="rgba(220, 38, 38, 1)" />
          <stop offset="70%" stopColor="rgba(220, 38, 38, 0.8)" />
          <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// =====================================================
// SECTION HEADER COMPONENT
// =====================================================
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  light?: boolean;
}> = ({ icon, label, title, subtitle, accentColor = 'text-red-500', light = false }) => (
  <AnimatedSection className="text-center mb-16">
    <motion.div
      className={`inline-flex items-center gap-2 ${accentColor} mb-4`}
      whileHover={{ scale: 1.05 }}
    >
      {icon}
      <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">{label}</span>
    </motion.div>
    <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl mb-6 font-bold ${light ? 'text-white' : 'gradient-text'}`}>
      {title}
    </h2>
    <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${light ? 'text-slate-400' : 'text-slate-400'}`}>
      {subtitle}
    </p>
  </AnimatedSection>
);

// =====================================================
// NAV LINK COMPONENT
// =====================================================
const NavLink: React.FC<{
  href: string;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  mobile?: boolean;
}> = ({ href, label, onClick, mobile = false }) => (
  <motion.a
    href={href}
    onClick={onClick}
    className={`group relative ${mobile
      ? 'block text-sm font-semibold text-slate-300 hover:text-white py-2'
      : 'text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase hover:text-white'
    } transition-colors cursor-pointer`}
    whileHover={{ y: -1 }}
  >
    {label}
    {!mobile && (
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-red-600 to-red-400 group-hover:w-full transition-all duration-300" />
    )}
  </motion.a>
);

// =====================================================
// BLOOD DOCTOR LOGO
// =====================================================
const BloodDoctorLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 font-serif font-bold tracking-tight ${className}`}>
    <span className="text-white">Blood</span>
    <motion.div animate={{ scale: [1, 1.15, 1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
      <Droplets size={20} className="text-red-500 fill-red-500" />
    </motion.div>
    <span className="text-red-500">Doctor</span>
  </div>
);

// =====================================================
// MAIN APP
// =====================================================
const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLElement>(null);

  const heroParallaxY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      setMenuOpen(false);
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };
  }, []);

  const navItems = [
    { id: 'algorithm', label: 'Algorithm' },
    { id: 'bedside', label: 'Bedside' },
    { id: 'bloods', label: 'Bloods' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'risk', label: 'Risk Scores' },
    { id: 'severity', label: 'Severity' },
  ];

  return (
    <div className="min-h-screen bg-med-navy text-slate-200 selection:bg-red-900/40 font-sans">

      {/* ============== SCROLL PROGRESS BAR ============== */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-700 via-red-500 to-amber-500 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ============== NAVIGATION ============== */}
      <nav className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl shadow-2xl shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white font-serif font-bold shadow-lg shadow-red-900/30"
              whileHover={{ rotate: 5 }}
            >
              B
            </motion.div>
            <span className={`font-serif font-bold text-lg tracking-tight transition-all duration-300 ${
              scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'
            }`}>
              <span className="text-white">Blood Doctor</span>
              <span className="font-normal text-slate-500 ml-2 text-sm">PE Guide</span>
            </span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                href={`#${item.id}`}
                label={item.label}
                onClick={scrollToSection(item.id)}
              />
            ))}
          </div>

          <motion.button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5"
            >
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      href={`#${item.id}`}
                      label={item.label}
                      onClick={scrollToSection(item.id)}
                      mobile
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ============== HERO SECTION ============== */}
      <header ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-med-navy to-slate-900" />
        <div className="absolute inset-0 mesh-gradient" />
        <FloatingBloodCells />
        <HeartbeatLine />

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center pt-20"
          style={{ y: heroParallaxY }}
        >
          {/* Badge */}
          <motion.div
            className="flex flex-col items-center gap-5 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BloodDoctorLogo className="text-2xl" />
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2 border border-red-800/50 text-red-400 text-[10px] tracking-[0.3em] uppercase font-black rounded-full bg-red-950/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(220, 38, 38, 0.5)' }}
            >
              <Sparkles size={12} />
              Clinical Investigation Guide
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold leading-[1.05] mb-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="gradient-text-light">Pulmonary</span>
            <br />
            <motion.span
              className="italic font-light gradient-text"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Embolism
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-slate-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            A comprehensive, evidence-based investigation checklist for the diagnosis and risk stratification of acute pulmonary embolism
          </motion.p>

          {/* Author */}
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2 font-mono">Produced for Clinical Education by</p>
            <p className="font-serif text-2xl text-white">
              Dr Abdul Mannan
              <span className="text-base font-sans font-medium text-slate-500 ml-2 italic">FRCPath FCPS</span>
            </p>
          </motion.div>

          {/* Quote card */}
          <motion.div
            className="max-w-3xl mx-auto glass-panel p-8 rounded-2xl glow-red relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-red-900" />
            <p className="text-slate-300 leading-relaxed italic text-lg pl-4">
              "Pulmonary embolism remains a major cause of cardiovascular morbidity and mortality. Timely, structured investigation is critical to establish the diagnosis, assess severity, and guide appropriate management."
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.a
              href="#summary"
              onClick={scrollToSection('summary')}
              className="group flex flex-col items-center gap-3 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="tracking-[0.3em] uppercase font-mono text-[10px]">View Investigations</span>
              <ArrowDown size={18} />
            </motion.a>
          </motion.div>
        </motion.div>
      </header>

      <main>
        {/* ============== INVESTIGATION SUMMARY TABLE ============== */}
        <section id="summary" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-med-navy" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <SectionHeader
              icon={<FileText size={22} />}
              label="At a Glance"
              title="Investigation Summary"
              subtitle="Complete overview of investigations required for suspected pulmonary embolism, organised by category and timing."
              light
            />
            <AnimatedSection delay={0.2}>
              <div className="glass-panel rounded-2xl p-6 glow-red overflow-hidden">
                <InvestigationSummaryTable />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ============== DIAGNOSTIC ALGORITHM ============== */}
        <section id="algorithm" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-med-navy mesh-gradient" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <AnimatedSection>
                  <div className="flex items-center gap-2 text-red-500 mb-4">
                    <Wind size={22} />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">Diagnostic Pathway</span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight font-bold gradient-text-light">
                    Clinical Algorithm
                  </h2>
                  <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
                    <p>
                      The diagnostic approach to PE follows a structured algorithm based on clinical probability assessment, biomarker testing, and definitive imaging.
                    </p>
                    <p>
                      This evidence-based pathway minimises unnecessary imaging while ensuring high-risk patients receive timely definitive investigation.
                    </p>
                    <motion.div
                      className="p-5 glass-panel rounded-xl border-l-2 border-red-600"
                      whileHover={{ x: 4 }}
                    >
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <AlertTriangle size={16} className="text-red-500" />
                        Haemodynamic Instability
                      </h4>
                      <p className="text-sm text-slate-400">
                        If the patient is haemodynamically unstable (SBP &lt;90 mmHg), proceed directly to bedside echo and consider empirical thrombolysis. Do not delay for CTPA.
                      </p>
                    </motion.div>
                  </div>
                </AnimatedSection>
              </div>
              <div className="lg:col-span-8">
                <AnimatedSection delay={0.2}>
                  <DiagnosticAlgorithm />
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* ============== BEDSIDE INVESTIGATIONS ============== */}
        <section id="bedside" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-med-navy via-slate-900 to-med-navy" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <SectionHeader
              icon={<Stethoscope size={22} />}
              label="Immediate Assessment"
              title="Bedside Investigations"
              subtitle="Investigations performed at the bedside immediately upon clinical suspicion of PE. These guide initial management and haemodynamic assessment."
              accentColor="text-amber-500"
              light
            />
            <AnimatedSection delay={0.2}>
              <div className="max-w-4xl mx-auto">
                <BedsideInvestigations />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ============== BLOOD INVESTIGATIONS ============== */}
        <section id="bloods" className="py-24 relative">
          <div className="absolute inset-0 bg-med-navy mesh-gradient" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <SectionHeader
              icon={<FlaskConical size={22} />}
              label="Laboratory"
              title="Blood Investigations"
              subtitle="Laboratory investigations for diagnosis, risk stratification, and safe initiation of anticoagulation therapy."
              light
            />
            <AnimatedSection delay={0.2}>
              <div className="max-w-4xl mx-auto">
                <BloodInvestigations />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ============== IMAGING INVESTIGATIONS ============== */}
        <section id="imaging" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-med-navy via-slate-900 to-med-navy" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <SectionHeader
              icon={<Scan size={22} />}
              label="Radiology & Imaging"
              title="Imaging Investigations"
              subtitle="Imaging modalities used for confirming PE, assessing right ventricular function, and identifying concurrent DVT."
              accentColor="text-blue-400"
              light
            />
            <AnimatedSection delay={0.2}>
              <div className="max-w-4xl mx-auto">
                <ImagingInvestigations />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ============== WELLS SCORE ============== */}
        <section id="risk" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                icon={<ShieldCheck size={22} />}
                label="Clinical Decision Rules"
                title="Pre-Test Probability"
                subtitle="Validated scoring systems to estimate the probability of PE before definitive investigation. Determines whether D-dimer testing or direct imaging is appropriate."
                accentColor="text-amber-400"
                light
              />
              <AnimatedSection delay={0.2}>
                <WellsScoreCalculator />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ============== sPESI SEVERITY ============== */}
        <section id="severity" className="py-24 relative">
          <div className="absolute inset-0 bg-med-navy mesh-gradient" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                icon={<Activity size={22} />}
                label="Risk Stratification"
                title="Severity Assessment"
                subtitle="Once PE is confirmed, the sPESI score stratifies patients into low and high risk categories, guiding inpatient vs outpatient management decisions."
                light
              />
              <AnimatedSection delay={0.2}>
                <SPESICalculator />
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Low Risk PE',
                      description: 'sPESI = 0. Consider early discharge and outpatient management with DOAC. Hestia criteria should also be assessed.',
                      gradient: 'from-emerald-900/40 to-emerald-950/40',
                      border: 'border-emerald-700/30',
                      textColor: 'text-emerald-400',
                      descColor: 'text-emerald-300/70'
                    },
                    {
                      title: 'Submassive PE',
                      description: 'Haemodynamically stable but with RV dysfunction (echo/CT) and/or elevated troponin. Monitor closely; consider escalation if deterioration.',
                      gradient: 'from-amber-900/40 to-amber-950/40',
                      border: 'border-amber-700/30',
                      textColor: 'text-amber-400',
                      descColor: 'text-amber-300/70'
                    },
                    {
                      title: 'Massive PE',
                      description: 'Haemodynamic instability (SBP <90 mmHg). Requires immediate resuscitation, anticoagulation, and consideration of systemic thrombolysis or surgical/interventional thrombectomy.',
                      gradient: 'from-red-900/40 to-red-950/40',
                      border: 'border-red-700/30',
                      textColor: 'text-red-400',
                      descColor: 'text-red-300/70'
                    }
                  ].map((card, i) => (
                    <motion.div
                      key={card.title}
                      className={`p-6 bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl card-hover`}
                      whileHover={{ scale: 1.02, y: -4 }}
                    >
                      <h4 className={`font-bold ${card.textColor} text-sm mb-3`}>{card.title}</h4>
                      <p className={`text-xs ${card.descColor} leading-relaxed`}>{card.description}</p>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ============== ACKNOWLEDGEMENT ============== */}
        <section id="authors" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-med-navy to-slate-950" />
          <div className="section-divider absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <AnimatedSection>
              <div className="flex flex-col items-center mb-12">
                <BloodDoctorLogo className="text-3xl mb-6" />
                <h3 className="font-serif text-3xl md:text-4xl gradient-text-light font-bold">Production Acknowledgement</h3>
                <div className="mt-6 max-w-xl text-slate-400 italic text-lg">
                  This educational clinical resource was produced and curated by:
                  <motion.div
                    className="mt-4 font-serif text-3xl text-white not-italic"
                    whileHover={{ scale: 1.02 }}
                  >
                    Dr Abdul Mannan
                    <span className="text-base font-sans font-medium text-slate-500 ml-2 italic">FRCPath FCPS</span>
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-800/50 to-transparent mx-auto mb-16" />

            <AnimatedSection delay={0.2}>
              <div className="max-w-2xl mx-auto p-8 glass-panel rounded-2xl glow-red">
                <p className="text-slate-400 text-sm italic leading-relaxed">
                  This investigation guide is based on current ESC/ERS guidelines for the diagnosis and management of acute pulmonary embolism, NICE guidelines, and BTS recommendations. For educational use in clinical haematology and acute medicine.
                </p>
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 font-mono">Digital Resource by Blood Doctor</span>
                  <BloodDoctorLogo className="scale-75 opacity-40" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div
              className="text-center md:text-left"
              whileHover={{ x: 4 }}
            >
              <div className="text-white font-serif font-bold text-2xl mb-2 flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <HeartPulse className="text-red-500" size={28} />
                </motion.div>
                Blood Doctor
              </div>
              <p className="text-xs text-slate-500 font-mono">PE Investigation Guide</p>
            </motion.div>
            <div className="text-center">
              <p className="text-slate-300 font-serif text-lg">Dr Abdul Mannan</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-mono">FRCPath FCPS</p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-600">
              {['Privacy Policy', 'Terms of Use', 'Medical Disclaimer'].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="hover:text-red-400 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="text-center mt-12 text-[9px] text-slate-800 uppercase tracking-[0.3em] font-mono">
            &copy; 2025 Blood Doctor by Dr Abdul Mannan. For medical educational use only.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
