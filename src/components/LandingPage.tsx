import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Code, Cpu, GitBranch, ArrowRight, Sparkles, 
  Send, Users, ShieldCheck, Trophy, X, Lock, Flame,
  TrendingUp, Award, Calendar, ChevronRight, Layers,
  ChevronLeft, LayoutGrid, Heart, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, TeamMember, INITIAL_PROJECTS } from '../types';
import { 
  IMPACT_METRICS, 
  SUCCESS_STORIES, 
  HARDWARE_PARTNERS, 
  LEADERSHIP_STEPS, 
  ANNUAL_ACHIEVEMENTS, 
  GALLERY_ITEMS 
} from '../data/ecosystem';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  blogs: BlogPost[];
  teamMembers: TeamMember[];
}

export default function LandingPage({ onNavigate, blogs, teamMembers }: LandingPageProps) {
  // Terminal system states
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Welcome to Codezen Interactive Sandbox Shell v2.5',
    'System status: ONLINE // secure access channel established.',
    'Type "help" to list ecosystem scripts or select a quick query tag below.',
    ''
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Gallery categorization state
  const [activeGalleryCat, setActiveGalleryCat] = useState<string>('ALL');

  // Success Stories navigation
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);

  // Timeline year highlight
  const [highlightedYear, setHighlightedYear] = useState<string>('2026');

  // Blog modal preview
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Terminal Handler
  const handleTerminalCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    let response: string[] = [];
    switch (trimmed) {
      case 'help':
        response = [
          `> ${cmdText}`,
          'Ecosystem commands:',
          '  about       - Our values, mission guidelines & target pathways',
          '  metrics     - Render live community impact variables',
          '  journey     - Output full Learn → Build → Earn → Lead cycle blueprints',
          '  projects    - Show top deployed software systems',
          '  admin       - Prompt admin verification challenge tunnel',
          '  clear       - Wipe shell logs'
        ];
        break;
      case 'about':
        response = [
          `> ${cmdText}`,
          'MISSION PROFILE: To transform student developers from passive consumers into elite technical masters.',
          'HOW WE OPERATE: Strictly through high fidelity project compilation, cryptographic review layers, and active leadership stewardship.'
        ];
        break;
      case 'metrics':
        response = [
          `> ${cmdText}`,
          '--- LIVE IMPACT METRICS ---',
          '• Active Devs: 2,400+ across all elite tracks',
          '• Projects Launched: 180+ compiled systems live on production',
          '• Placement Records: 45+ top-3 placements in national sprints',
          '• Verification Credentials Issued: 800+ cryptographic badges ledgered'
        ];
        break;
      case 'journey':
        response = [
          `> ${cmdText}`,
          '--- THE MASTER PATHWAY CYCLE ---',
          '1. [LEARN] - Vetted Coursework Sprints (Systems architectures & neural frameworks)',
          '2. [BUILD] - Assemble innovative libraries & showcase projects under peer scrutiny',
          '3. [EARN]  - Mint certified ledger credentials to lock performance stats',
          '4. [LEAD]  - Take community stewardship. Mentor juniors, organize hack sprints.'
        ];
        break;
      case 'projects':
        response = [
          `> ${cmdText}`,
          '--- FEATURED PRODUCTS DEPLOYED ---',
          '• SYSTEM-1: SynapseVibe - IDE extension predicting functional unit-tests',
          '• SYSTEM-2: EtherLocker - Solidity gas saver compiling storage variables',
          '• SYSTEM-3: BotZen - Deep Discord automation agent hooks with git cascades'
        ];
        break;
      case 'admin':
        response = [
          `> ${cmdText}`,
          'AUTHENTICATING ADMINISTRATIVE MAIN_TUNNEL REQUEST...',
          'SUCCESS: Verification gates primed. Opening administrative console gateway...'
        ];
        setTimeout(() => {
          onNavigate('admin');
        }, 800);
        break;
      case 'clear':
        setTerminalLogs([]);
        setTerminalInput('');
        return;
      default:
        response = [
          `> ${cmdText}`,
          `Command "${trimmed}" not identified. Input "help" to verify supported instructions.`
        ];
    }

    setTerminalLogs((prev) => [...prev, ...response, '']);
    setTerminalInput('');
  };

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Gallery categories list
  const galleryCategories = ['ALL', 'LABORATORY', 'CRITIQUE', 'LECTURES', 'COLLABORATION'];
  const filteredGallery = activeGalleryCat === 'ALL' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeGalleryCat);

  return (
    <div className="space-y-20 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans" id="premium-ecosystem-root">
      
      {/* 1. HERO SECTION WITH QUIET AUTHORITY VIBE */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-8 md:p-16 text-center select-none shadow-2xl" id="hero-section">
        {/* Ambient Void Glows */}
        <div className="absolute top-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-glow" />

        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4.5 py-1.5 text-xs font-mono font-semibold text-indigo-400"
            id="hero-ecosystem-tag"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ELITE DEVELOPER ECOSYSTEM & INNOVATION NETWORK</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            id="main-hero-headline"
          >
            Learn Skills. Build Projects.<br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
              Earn Credentials. Lead Communities.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
            id="main-hero-sub"
          >
            Codezen is not a standard college social club. We are a professional development sandbox and software incubator engineering high-authority contributors, platform leads, and technical founders.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            id="hero-action-buttons"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                id="hero-primary-btn"
                onClick={() => onNavigate('learning')}
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 p-[1px] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 cursor-pointer"
              >
                <span className="flex items-center gap-2 rounded-[11px] bg-slate-950 px-6.5 py-3 text-xs font-mono font-bold text-white transition-all group-hover:bg-transparent group-hover:text-slate-950">
                  EXPLORE_CURRICULUMS
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button
                id="hero-secondary-btn"
                onClick={() => onNavigate('events')}
                className="group rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 px-6.5 py-3 text-xs font-mono font-bold text-slate-300 transition-all hover:border-slate-700 hover:text-white cursor-pointer inline-flex items-center gap-1.5"
              >
                <Calendar className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                QUERY_GATHERINGS
              </button>
              <button
                id="hero-verify-btn"
                onClick={() => onNavigate('verifier')}
                className="group rounded-xl border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 px-6.5 py-3 text-xs font-mono font-bold text-emerald-400 transition-all hover:border-emerald-500/30 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Award className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                VERIFY_CREDENTIALS
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COMMUNITY IMPACT METRICS SECTION */}
      <section className="space-y-6" id="community-impact-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Impact Ledger / Proof of Scale
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Ecosystem Statistics By the Numbers</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            We track technical growth indexes across all tracks, measuring live deployments and verified career outputs.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_METRICS.map((metric, idx) => (
            <div 
              key={idx}
              id={`impact-card-${idx}`}
              className="premium-card p-6 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4 hover:border-slate-850 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{metric.label}</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                    {metric.trend}
                  </span>
                </div>
                <div className="font-display text-4xl font-extrabold text-white mt-3 tracking-tight">
                  {metric.value}
                </div>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed pt-3 border-t border-slate-900/40">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE DEVELOPER TERMINAL INTERACTIVE COMMAND */}
      <section className="space-y-6" id="interactive-terminal-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Terminal className="h-4 w-4" />
              Interactive Sandboxed Command line
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Command-Line Platform Index</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            Experience our technical design focus. Prompt operations directly to query courses, check badges, or access admin variables.
          </p>
        </div>

        <div className="premium-card rounded-xl p-5 border border-slate-900 shadow-xl overflow-hidden font-mono" id="main-terminal-body">
          {/* Top bezel bar */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] text-slate-550 font-mono flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>TERMINAL_SESSION: LIVE @ MAIT</span>
            </div>
          </div>

          {/* Prompt viewport */}
          <div className="h-44 overflow-y-auto text-xs text-slate-400 space-y-2 pr-2" id="terminal-viewport">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                {log.startsWith('>') ? (
                  <span className="text-emerald-400 font-extrabold">{log}</span>
                ) : log.startsWith('SUCCESS') || log.startsWith('AUTHENTICATING') || log.startsWith('MISSION PROFILE') ? (
                  <span className="text-indigo-400 font-semibold">{log}</span>
                ) : log.startsWith('•') ? (
                  <span className="text-slate-300">{log}</span>
                ) : (
                  log
                )}
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleTerminalCommand(terminalInput);
            }} 
            className="flex items-center gap-2 pt-3 border-t border-slate-900 mt-4"
          >
            <span className="text-emerald-400 font-bold text-xs select-none">codezen@kernel:~$</span>
            <input
              id="terminal-input"
              type="text"
              className="flex-1 bg-transparent font-mono text-xs text-slate-300 outline-none placeholder:text-slate-700"
              placeholder="Query help, metrics, journey, projects, or admin passcode..."
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
            />
            <button 
              id="terminal-submit-btn"
              type="submit" 
              className="text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Fast actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900 mt-4 text-[11px] font-mono select-none" id="terminal-quick-tags">
            <span className="text-slate-500 self-center">Interactive presets:</span>
            {['help', 'metrics', 'journey', 'projects', 'about', 'admin'].map((suggestion) => (
              <button
                key={suggestion}
                id={`term-suggest-${suggestion}`}
                type="button"
                onClick={() => handleTerminalCommand(suggestion)}
                className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-400 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE INTERACTIVE COMMUNITY JOURNEY PROGRAM */}
      <section className="space-y-8" id="community-journey-section">
        <div className="text-center space-y-2">
          <div className="inline-flex rounded-lg px-3 py-1 bg-indigo-500/5 text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
            Execution Roadmap Blueprint
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white">The Core Growth Loop: Learn → Build → Earn → Lead</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Our framework guides aspiring programmers through high-intensity execution filters to produce capable tech guides.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP_STEPS.map((stepItem, idx) => (
            <div 
              key={idx}
              id={`journey-step-${idx}`}
              className="premium-card p-6 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition-all relative"
            >
              <div className="absolute top-4 right-4 text-3xl font-display font-black text-slate-800/40 select-none">
                {stepItem.step}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-extrabold text-emerald-400 tracking-wider">
                  {stepItem.phase}
                </span>
                <h3 className="font-display text-base font-bold text-white">{stepItem.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-3">
                {stepItem.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PROJECTS: SHOWCASE PRODUCTS BY HIGH-PERFORMANCE DEVS */}
      <section className="space-y-6" id="projects-showcase-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Code className="h-4 w-4" />
              Incubator Products & Systems
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Featured Developer Showcases</h2>
          </div>
          <div className="flex gap-2">
            <button
              id="goto-showcase-btn"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 px-4 py-2 text-xs font-mono font-bold text-white transition-all hover:border-slate-700 cursor-pointer"
            >
              BROWSE_ALL_APPLICATIONS
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {INITIAL_PROJECTS.map((project) => (
            <div 
              key={project.id}
              id={`featured-proj-card-${project.id}`}
              className="premium-card p-5.5 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4 hover:border-cyan-500/20 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tg, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 text-[9px] font-mono text-cyan-400 uppercase">
                        {tg}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                    <span>{project.likes}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors mt-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-900/40 mt-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img 
                    src={project.ownerAvatar} 
                    alt={project.ownerName}
                    referrerPolicy="no-referrer"
                    className="h-6 w-6 rounded-full border border-slate-800"
                  />
                  <span className="text-[10px] font-mono text-slate-400 truncate">{project.ownerName}</span>
                </div>
                <button
                  id={`go-proj-${project.id}`}
                  onClick={() => onNavigate('dashboard')}
                  className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  INTERACT <ExternalLink className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SUCCESS STORIES & TESTIMONIALS HALL OF FAME */}
      <section className="space-y-8" id="success-stories-hall-of-fame">
        <div className="text-center space-y-2">
          <div className="inline-flex rounded-lg px-3 py-1 bg-emerald-500/5 text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
            Verified Career Placements & Success stories
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white">The Alumni Hall of Fame</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            High performance developers who transitioned from building academic frameworks to engineering core products at elite global institutions.
          </p>
        </div>

        {/* Carousel / Tabbed Quote card */}
        <div className="max-w-4xl mx-auto relative rounded-2xl border border-slate-800 bg-slate-950/40 p-6 md:p-10 premium-card">
          <div className="grid gap-6 md:grid-cols-12 items-center">
            
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3 border-b md:border-b-0 md:border-r border-slate-900 pb-6 md:pb-0 md:pr-6">
              <img 
                src={SUCCESS_STORIES[activeStoryIdx].avatar}
                alt={SUCCESS_STORIES[activeStoryIdx].name}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-xl border border-slate-800 shadow-md object-cover"
              />
              <div>
                <h4 className="font-display text-base font-bold text-white">{SUCCESS_STORIES[activeStoryIdx].name}</h4>
                <div className="text-[11px] font-mono text-indigo-400">{SUCCESS_STORIES[activeStoryIdx].role}</div>
                <div className="inline-block mt-2 rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                  {SUCCESS_STORIES[activeStoryIdx].outcome}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              <div className="text-2xl font-serif text-slate-700 font-bold select-none h-4">“</div>
              <p className="text-sm md:text-base text-slate-300 font-sans italic leading-relaxed">
                {SUCCESS_STORIES[activeStoryIdx].quote}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-900/60 text-xs">
                <span className="text-slate-500 font-mono">SUCCESS_STORY // VERIFIED_PLACEMENT</span>
                <span className="font-mono font-extrabold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  {SUCCESS_STORIES[activeStoryIdx].logo} Alumnus
                </span>
              </div>
            </div>

          </div>

          {/* Navigation selectors absolute positioning */}
          <div className="flex items-center justify-center gap-1.5 mt-8 border-t border-slate-900/60 pt-4">
            <button
              id="prev-story-btn"
              onClick={() => setActiveStoryIdx((prev) => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length)}
              className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {SUCCESS_STORIES.map((_, i) => (
              <button
                key={i}
                id={`story-dot-${i}`}
                onClick={() => setActiveStoryIdx(i)}
                className={`h-2 rounded-full transition-all ${activeStoryIdx === i ? 'w-6 bg-indigo-400' : 'w-2 bg-slate-800'}`}
              />
            ))}
            <button
              id="next-story-btn"
              onClick={() => setActiveStoryIdx((prev) => (prev + 1) % SUCCESS_STORIES.length)}
              className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. PARTNER ENTERPRISE NETWORKS & MARQUEE */}
      <section className="space-y-6 pt-4 border-t border-slate-900/40" id="ecosystem-partners-section">
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-500 tracking-widest font-bold uppercase">
            COMPLEMENTARY TECHNOLOGY PARTNERS & ECOSYSTEM LINKS
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {HARDWARE_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              id={`partner-badge-${idx}`}
              className="premium-card rounded-lg p-4 border border-slate-950 text-center flex flex-col justify-center items-center h-16 hover:border-slate-900 transition-all"
            >
              <div className="font-mono text-xs font-bold text-slate-300 tracking-tight">
                {partner.name}
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                {partner.category}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. COMMUNITY GALLERY & LAB PORTRAITS */}
      <section className="space-y-6" id="community-gallery-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-pink-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              Community Gallery & Portraits
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Sprints, Reviews, and Design Labs</h2>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-1" id="gallery-categories-chips">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                id={`cat-chip-${cat}`}
                onClick={() => setActiveGalleryCat(cat)}
                className={`px-3 py-1 text-[10px] font-mono font-medium rounded border transition-all cursor-pointer ${activeGalleryCat === cat ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'text-slate-500 hover:text-slate-350 border-transparent'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4" id="gallery-image-host-grid">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="group relative h-48 overflow-hidden rounded-xl border border-slate-900 bg-slate-900 cursor-pointer"
                id={`gallery-item-${item.id}`}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <span className="inline-block rounded bg-indigo-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold text-indigo-400 tracking-wide uppercase">
                    {item.category}
                  </span>
                  <p className="text-[11px] font-display font-semibold text-white leading-tight truncate">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 9. ANNUAL ACHIEVEMENTS TIMELINE CARD */}
      <section className="space-y-6" id="annual-achievements-timeline">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Annual Milestone History
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Ecosystem Milestones & Registry</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            Tracking systemic updates, custom sandbox compiler rollouts, and capital incubation.
          </p>
        </div>

        {/* Interactive Milestone timeline layout */}
        <div className="grid gap-6 md:grid-cols-3">
          {ANNUAL_ACHIEVEMENTS.map((mile) => (
            <div
              key={mile.year}
              id={`timeline-box-${mile.year}`}
              onMouseEnter={() => setHighlightedYear(mile.year)}
              className={`p-6 rounded-xl border transition-all duration-300 relative select-none flex flex-col justify-between h-48 cursor-pointer ${highlightedYear === mile.year ? 'bg-indigo-550/5 border-indigo-500/30' : 'bg-slate-950/30 border-slate-900'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-display text-2xl font-black ${highlightedYear === mile.year ? 'text-indigo-400' : 'text-slate-700'}`}>
                  {mile.year}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${highlightedYear === mile.year ? 'bg-indigo-400 animate-ping' : 'bg-slate-800'}`} />
              </div>
              <div className="mt-4 space-y-1.5">
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">{mile.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {mile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. BLOGS GAZETTE LIST AND MODAL AT ROOT */}
      <section className="space-y-6" id="blog-feed-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Ecosystem Gazette Columns
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Technical Devlogs & Sprints</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs">
            Review algorithmic architecture insights crafted directly by Codezen staff.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="premium-card p-8 rounded-xl text-center text-xs font-mono text-slate-500">
            NO_ACTIVE_ARTICLE_COLLECTIONS_PUBLISHED
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {blogs.slice(0, 4).map((blog) => (
              <div
                key={blog.id}
                id={`blog-card-${blog.id}`}
                onClick={() => setSelectedBlog(blog)}
                className="premium-card p-6 rounded-xl border border-slate-900 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-mono text-indigo-400 uppercase font-semibold">
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] font-mono text-slate-500">{blog.readTime}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-900/60 mt-4">
                  <span className="text-[10px] font-mono text-slate-500">STAFF: {blog.author}</span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    COMPILE_READ <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Post Immersive Detail View */}
        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedBlog(null)}
              id="blog-detail-overlay"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto space-y-6 premium-card"
                onClick={(e) => e.stopPropagation()}
                id="blog-detail-card"
              >
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedBlog.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-mono text-emerald-400 font-bold uppercase">
                          {tag}
                        </span>
                      ))}
                      <span className="text-[10px] font-mono text-slate-500">{selectedBlog.readTime} • {selectedBlog.date}</span>
                    </div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
                      {selectedBlog.title}
                    </h2>
                  </div>
                  <button
                    id="close-blog-overlay-btn"
                    onClick={() => setSelectedBlog(null)}
                    className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all ml-4 self-start cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap border-b border-slate-900 pb-6 font-mono">
                  {selectedBlog.content}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold shrink-0">
                    {selectedBlog.author.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{selectedBlog.author}</div>
                    <div className="text-[10px] font-mono text-slate-500">CODEZEN WRITER</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 11. LEADERSHIP PATHWAYS & BOOTSTRAP ADVISORS COURIER */}
      <section className="space-y-6 pb-6" id="board-team-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Guild Leadership Council
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Stewardship Councils & Leads</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            Core community pillars administering peer code verification checkpoints and organizing developer camps.
          </p>
        </div>

        {teamMembers.length === 0 ? (
          <div className="premium-card p-8 rounded-xl text-center text-xs font-mono text-slate-500">
            NO_ACTIVE_COUNCIL_ONBOARDED
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {teamMembers.map((person) => (
              <div
                key={person.id}
                id={`member-brief-card-${person.id}`}
                className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 flex items-center gap-4 transition-all hover:border-slate-800/80"
              >
                <img
                  src={person.avatar}
                  alt={person.name}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded bg-slate-950 border border-slate-800"
                />
                <div className="min-w-0">
                  <h4 className="font-display text-sm font-bold text-white truncate">{person.name}</h4>
                  <div className="text-[11px] text-emerald-400 font-medium truncate">{person.title}</div>
                  <div className="text-[10px] text-slate-550 truncate">{person.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
