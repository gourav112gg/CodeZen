import React, { useState, useEffect } from 'react';
import { 
  Terminal, Code, BookOpen, Calendar, Award, 
  Users, ShieldCheck, Trophy, Sparkles, Menu, X, Rocket,
  Linkedin, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-components imports
import LandingPage from './components/LandingPage';
import LearningHub from './components/LearningHub';
import EventsList from './components/EventsList';
import CredentialVerifier from './components/CredentialVerifier';
import Dashboard from './components/Dashboard';
import Achievements from './components/Achievements';
import AdminPanel from './components/AdminPanel';
import ToastContainer, { ToastMessage } from './components/ToastContainer';

// Core pre-populated models
import { 
  INITIAL_COURSES, INITIAL_EVENTS, INITIAL_CREDENTIALS, 
  INITIAL_PROJECTS, INITIAL_ACHIEVEMENTS, INITIAL_MEMBER,
  INITIAL_BLOGS, INITIAL_TEAM_MEMBERS,
  Course, EventRecord, VerifiedCredential, ClubProject, Achievement, ClubMember,
  BlogPost, TeamMember 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hasJoinedClub, setHasJoinedClub] = useState<boolean>(() => {
    const saved = localStorage.getItem('codezen-joined-club');
    return saved === 'true';
  });
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('codezen-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (!isDarkMode) {
      root.classList.add('light-theme');
      localStorage.setItem('codezen-theme', 'light');
    } else {
      root.classList.remove('light-theme');
      localStorage.setItem('codezen-theme', 'dark');
    }
  }, [isDarkMode]);

  // Global Sync States
  const [courses, setCourses] = useState<Course[]>(() => INITIAL_COURSES);
  const [events, setEvents] = useState<EventRecord[]>(() => INITIAL_EVENTS);
  const [credentials, setCredentials] = useState<VerifiedCredential[]>(() => INITIAL_CREDENTIALS);
  const [projectsList, setProjectsList] = useState<ClubProject[]>(() => INITIAL_PROJECTS);
  const [achievements, setAchievements] = useState<Achievement[]>(() => INITIAL_ACHIEVEMENTS);
  const [member, setMember] = useState<ClubMember>(() => INITIAL_MEMBER);
  const [blogs, setBlogs] = useState<BlogPost[]>(() => INITIAL_BLOGS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => INITIAL_TEAM_MEMBERS);
  
  // Real-time developer stream logs
  const [logs, setLogs] = useState<string[]>([
    'Booting Codezen Sandbox Kernel Router...',
    'Pre-compiled neural datasets loaded successfully',
    'Local member "Garg Gourav" synced with developer registry',
    'Interactive Codezen web shell online and listening'
  ]);

  // Real-time Toast Notifications state & management
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description: string, type: 'achievement' | 'badge' | 'quest' | 'level' | 'info' = 'info', xp?: number, icon?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, description, type, xp, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Level Up Toast States
  const [showLevelUpToast, setShowLevelUpToast] = useState<boolean>(false);
  const [priorLevel, setPriorLevel] = useState<number>(1);

  // Add a stream logger message
  const addLog = (action: string) => {
    setLogs((prev) => [`${action}`, ...prev]);
  };

  const handleNavigate = (tabId: string) => {
    if ((tabId === 'verifier' || tabId === 'dashboard') && !hasJoinedClub) {
      setIsJoinModalOpen(true);
      addLog(`Blocked access to secure feature "${tabId}": Register/Join protocol initiated.`);
      return;
    }
    setActiveTab(tabId);
  };

  // Overall XP Increments with auto Level up!
  const addMemberXp = (amount: number) => {
    setMember((prev) => {
      const nextXp = prev.xp + amount;
      // Let's assume level triggers at every 500 XP thresholds!
      const calculatedLevel = Math.floor(nextXp / 500) + 1;
      
      if (calculatedLevel > prev.level) {
        setPriorLevel(prev.level);
        setShowLevelUpToast(true);
        addLog(`[PROMOTION] Garg Gourav leveled up! Promoted to Level ${calculatedLevel}!`);
        addToast(
          `Level Up: Promoted to Level ${calculatedLevel}!`,
          `Garg Gourav reached a new developer status! Keep learning and building.`,
          'level',
          250,
          'Rocket'
        );
      }
      return {
        ...prev,
        xp: nextXp,
        level: calculatedLevel,
        commits: prev.commits + 1 // Add contributions
      };
    });
  };

  const handleSignOut = () => {
    setHasJoinedClub(false);
    localStorage.removeItem('codezen-joined-club');
    setActiveTab('landing');
    addLog('SUCCESS: Revoked session. Signed out user "Garg Gourav" from secure registry ledgers.');
  };

  // Course Enrollments callback
  const handleEnrollTrack = (courseId: string) => {
    setCourses((prev) => 
      prev.map(c => c.id === courseId ? { ...c, isEnrolled: true } : c)
    );
    addLog(`Enrolled in curriculum track "${courseId}"`);
    addToast(
      "Enrolled in Course Track",
      `Successfully signed roster for "${courseId}". Quest requirement unlocked!`,
      "quest",
      50,
      "CheckSquare"
    );
    addMemberXp(50);
  };

  // Lesson completions callback
  const handleLessonComplete = (courseId: string, lessonId: string, xpEarned: number) => {
    setCourses((prev) => 
      prev.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            lessons: c.lessons.map(l => l.id === lessonId ? { ...l, isCompleted: true } : l)
          };
        }
        return c;
      })
    );
    addMemberXp(xpEarned);
    addLog(`Dossier lesson "${lessonId}" solved successfully. Recieved validation.`);
    addToast(
      "Lesson Completed!",
      `Solved lesson checkpoint for "${lessonId}". Your progress has been updated (+${xpEarned} XP).`,
      "quest",
      xpEarned,
      "CheckSquare"
    );
  };

  // Event RSVP toggles
  const handleRsvpToggle = (eventId: string) => {
    setEvents((prev) => 
      prev.map(ev => {
        if (ev.id === eventId) {
          const nextRsvp = !ev.isRsvpMe;
          if (nextRsvp) {
            addToast(
              "RSVP Confirmed!",
              `Claimed access pass for "${ev.title}". Check-in ticket is now active.`,
              "quest",
              50,
              "Calendar"
            );
            addMemberXp(50);
          } else {
            addToast(
              "RSVP Release",
              `Released virtual reservation for "${ev.title}".`,
              "info",
              0,
              "Calendar"
            );
          }
          return {
            ...ev,
            isRsvpMe: nextRsvp,
            rsvpCount: nextRsvp ? ev.rsvpCount + 1 : ev.rsvpCount - 1
          };
        }
        return ev;
      })
    );
  };

  // Credential addition Lookups
  const handleAddCredential = (newCred: VerifiedCredential) => {
    setCredentials((prev) => [newCred, ...prev]);
  };

  // Project submissions
  const handleAddProject = (newProj: ClubProject) => {
    setProjectsList((prev) => [newProj, ...prev]);
    addMemberXp(80); // Extra reputation for project uploads
    addToast(
      "Project Submitted!",
      `Published "${newProj.title}" repository to the Showroom (+80 XP).`,
      "quest",
      80,
      "Award"
    );
  };

  // Upvoting project
  const handleUpvoteProject = (projectId: string) => {
    setProjectsList((prev) => 
      prev.map(proj => {
        if (proj.id === projectId) {
          const nextLiked = !proj.isLikedMe;
          if (nextLiked) {
            addToast(
              "Project Upvoted!",
              `Supported student showcase for "${proj.title}" (+15 XP)!`,
              "quest",
              15,
              "Heart"
            );
          }
          return {
            ...proj,
            isLikedMe: nextLiked,
            likes: nextLiked ? proj.likes + 1 : proj.likes - 1
          };
        }
        return proj;
      })
    );
    addMemberXp(15); // Upvoting gives small community XP
    handleUnlockAchievement('ach-4', 0);
  };

  // Achievement unlock triggers
  const handleUnlockAchievement = (id: string, xpReward: number) => {
    setAchievements((prev) => 
      prev.map(ach => {
        if (ach.id === id && ach.isLocked) {
          addLog(`[ACHIEVEMENT UNLOCKED] "${ach.title}" badge logged onto profile record.`);
          if (xpReward > 0) addMemberXp(xpReward);
          
          // Trigger sweet, sweet real-time achievement unlocks toast!
          addToast(
            ach.title,
            ach.description,
            'achievement',
            ach.xp,
            ach.icon
          );

          return {
            ...ach,
            isLocked: false,
            unlockedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          };
        }
        return ach;
      })
    );
  };

  // Manual Claims trigger
  const handleClaimQuestXp = (xpToAdd: number) => {
    addMemberXp(xpToAdd);
    addToast(
      "Quest Reward Claimed",
      `Credited +${xpToAdd} XP into your overall profile tally. Integrity verified.`,
      "quest",
      xpToAdd,
      "Flame"
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300" id="applet-viewport">
      {/* Top Brand Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md" id="master-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Group */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('landing')} id="logo-brand">
              <div className="relative">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/35 p-2 text-emerald-400">
                  <Terminal className="h-5 w-5 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div>
                <span className="font-display text-md font-black tracking-widest text-white block">CODEZEN</span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium block leading-none">STUDENT DEV COMMUNITY</span>
              </div>
            </div>

            {/* Central Navigation List (Desktop Router) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-950 border border-slate-900/60 p-1 rounded-xl" id="desktop-menubar">
              {[
                { id: 'landing', label: 'Home_Page', icon: Terminal },
                { id: 'learning', label: 'Learning_Hub', icon: BookOpen },
                { id: 'events', label: 'Gatherings', icon: Calendar },
                ...(hasJoinedClub ? [
                  { id: 'verifier', label: 'Verifier', icon: ShieldCheck },
                  { id: 'dashboard', label: 'Dashboard', icon: Code }
                ] : []),
                { id: 'achievements', label: 'Quests', icon: Trophy }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => {
                    handleNavigate(tab.id);
                    addLog(`Redirected target router tab to "${tab.label}"`);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === tab.id ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Profile User Status right */}
            <div className="flex items-center gap-3" id="header-right-actions">
              {/* Theme Toggle Button */}
              <button
                id="theme-toggle-btn"
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  addLog(`Toggled global viewport theme to ${!isDarkMode ? 'LIGHT_MODE' : 'DARK_MODE'}`);
                }}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/80 transition-all cursor-pointer inline-flex items-center justify-center transition-all duration-300"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-indigo-500" />
                )}
              </button>

              {!hasJoinedClub ? (
                <button
                  id="header-join-club-btn"
                  onClick={() => {
                    setIsJoinModalOpen(true);
                    addLog('Initializing interactive join club registration modal portal...');
                  }}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 px-4 py-2.5 text-xs font-mono font-black text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all animate-pulse duration-500 cursor-pointer"
                >
                  JOIN_CLUB
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div 
                    id="top-profile-badge"
                    onClick={() => {
                      handleNavigate('dashboard');
                      addLog('Opened user dashboard metrics portal');
                    }}
                    className="hidden sm:flex items-center gap-3 rounded-2xl border border-slate-805 bg-slate-900/10 hover:border-slate-700/80 p-2 pl-3 cursor-pointer transition-all"
                  >
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-white block">{member.name}</span>
                      <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[9px] font-mono font-bold text-emerald-400 tracking-wider">
                        LVL {member.level} • {member.xp} XP
                      </span>
                    </div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="h-8.5 w-8.5 rounded-xl bg-slate-950 border border-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Hamburger toggle */}
              <div className="flex md:hidden">
                <button
                  id="mobile-hamburger-btn"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-900 bg-slate-950"
              id="mobile-drawer"
            >
              <div className="space-y-1.5 px-4 pb-4 pt-3 text-xs font-mono">
                {[
                  { id: 'landing', label: 'Home_Page', icon: Terminal },
                  { id: 'learning', label: 'Learning_Hub', icon: BookOpen },
                  { id: 'events', label: 'Gatherings', icon: Calendar },
                  ...(hasJoinedClub ? [
                    { id: 'verifier', label: 'Verifier_Portal', icon: ShieldCheck },
                    { id: 'dashboard', label: 'Dashboard', icon: Code }
                  ] : []),
                  { id: 'achievements', label: 'Quests', icon: Trophy }
                ].map(tab => (
                  <button
                    key={tab.id}
                    id={`mobile-nav-link-${tab.id}`}
                    onClick={() => {
                      handleNavigate(tab.id);
                      setIsMobileMenuOpen(false);
                      addLog(`Redirected target router tab to "${tab.label}"`);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4.5 py-3 text-left font-medium transition-all ${activeTab === tab.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'text-slate-400 hover:text-white border border-transparent'}`}
                  >
                    <tab.icon className="h-4.5 w-4.5" />
                    {tab.label}
                  </button>
                ))}

                {/* Mobile User card */}
                {!hasJoinedClub ? (
                  <button
                    id="mobile-join-club-btn"
                    onClick={() => {
                      setIsJoinModalOpen(true);
                      setIsMobileMenuOpen(false);
                      addLog('Initializing mobile join club registration modal...');
                    }}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 py-3 text-center text-xs font-mono font-black text-white"
                  >
                    JOIN_CODEZEN_CLUB
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div 
                      className="flex items-center justify-between border-t border-slate-900 pt-3.5 mt-2 cursor-pointer"
                      onClick={() => {
                        handleNavigate('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">{member.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">Developer Account stats</span>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-slate-950 font-mono">
                        LVL {member.level}
                      </span>
                    </div>

                    <button
                      id="mobile-nav-sign-out-btn"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-450 hover:text-rose-400 py-3 text-center text-xs font-mono font-bold cursor-pointer transition-all hover:bg-rose-500/10"
                    >
                      SIGN_OUT_PROTOCOL
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main viewport Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6" id="main-content-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'landing' && (
              <LandingPage 
                onNavigate={handleNavigate} 
                blogs={blogs} 
                teamMembers={teamMembers} 
              />
            )}
            {activeTab === 'learning' && (
              <LearningHub 
                courses={courses} 
                userXp={member.xp}
                onEnroll={handleEnrollTrack}
                onLessonComplete={handleLessonComplete}
                onAddLog={addLog}
              />
            )}
            {activeTab === 'events' && (
              <EventsList 
                events={events} 
                userName={member.name}
                onRsvpToggle={handleRsvpToggle}
                onAddLog={addLog}
              />
            )}
            {activeTab === 'verifier' && (
              <CredentialVerifier 
                credentials={credentials}
                onAddCredential={handleAddCredential}
                onAddLog={addLog}
              />
            )}
            {activeTab === 'dashboard' && (
              <Dashboard 
                member={member}
                projectsList={projectsList}
                logs={logs}
                achievements={achievements}
                onUpdateMember={setMember}
                onAddProject={handleAddProject}
                onUpvoteProject={handleUpvoteProject}
                onAddLog={addLog}
                onSignOut={handleSignOut}
              />
            )}
            {activeTab === 'achievements' && (
              <Achievements 
                achievements={achievements}
                courses={courses}
                events={events}
                projects={projectsList}
                userXp={member.xp}
                onUnlockAchievement={handleUnlockAchievement}
                onClaimQuestXp={handleClaimQuestXp}
                onAddLog={addLog}
              />
            )}
            {activeTab === 'admin' && (
              <AdminPanel 
                events={events}
                blogs={blogs}
                teamMembers={teamMembers}
                onUpdateEvents={setEvents}
                onUpdateBlogs={setBlogs}
                onUpdateTeamMembers={setTeamMembers}
                onAddLog={addLog}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Real-time Toast Notifications Hub */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Promotion Level Up Toast Overlay notifications */}
      <AnimatePresence>
        {showLevelUpToast && (
          <div className="fixed bottom-6 right-6 z-50 p-1" id="level-promotion-toast">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="rounded-2xl border-2 border-emerald-400 bg-slate-950 p-6 shadow-2xl space-y-4 max-w-xs text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/5 -z-10 animate-pulse-glow" />
              
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Rocket className="h-6 w-6 animate-float" />
              </div>

              <div>
                <h4 className="font-display text-md font-black text-white">PROMOTION ACHIEVED</h4>
                <p className="text-[11px] text-slate-400 font-sans mt-1">Student Garg Gourav elevated from level {priorLevel} to level {member.level}!</p>
              </div>

              <button
                id="close-level-toast-btn"
                onClick={() => setShowLevelUpToast(false)}
                className="w-full rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Acknowledge Promotion
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration/Join Club Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="join-club-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6 shadow-2xl relative select-none registration-modal-inner font-sans"
            >
              {/* Bezel glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 rounded-t-2xl" />

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-left">
                    <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '6s' }} />
                    SECURE_MEMBER_REGISTRY_PROTOCOL
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-black text-white text-left">Join the Codezen Club</h3>
                  <p className="text-xs text-slate-400 text-left">Unlock persistent developer portals, the credential verifier, and dashboard trackers.</p>
                </div>
                <button
                  id="close-join-modal-btn"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Registration Form */}
              <form 
                id="join-club-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string || 'Garg Gourav';
                  const role = formData.get('role') as string || 'Junior Software Engineer';
                  const tagline = formData.get('tagline') as string || 'Passionate stack explorer seeking elegant practices.';
                  const github = formData.get('github') as string || 'https://github.com/gouravgarg';
                  const linkedin = formData.get('linkedin') as string || 'https://linkedin.com/in/gouravgarg';

                  // Update global member data
                  setMember({
                    ...member,
                    name,
                    role,
                    tagline,
                    githubUrl: github,
                    linkedinUrl: linkedin
                  });

                  setHasJoinedClub(true);
                  localStorage.setItem('codezen-joined-club', 'true');
                  setIsJoinModalOpen(false);
                  
                  addLog(`SUCCESS: Registrant "${name}" registered successfully. Initialized secure verifier + stats portlets.`);
                  
                  // Force redirect to Member Dashboard to showcase achievement
                  setActiveTab('dashboard');
                }}
                className="space-y-4 font-mono text-xs text-left"
              >
                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">DEVELOPER_NAME</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue="Garg Gourav"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">PROF_ROLE</label>
                  <input
                    type="text"
                    name="role"
                    required
                    defaultValue="Junior Software Engineer"
                    placeholder="e.g. Frontend Specialist, ML Enthusiast"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">COMMIT_MOTTO / TAGLINE</label>
                  <textarea
                    name="tagline"
                    rows={2}
                    required
                    defaultValue="Passionate stack explorer seeking elegant AI engineering practices and Git fluency."
                    placeholder="Short description of your developer aspirations..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 block font-bold">GITHUB_URL (OPTIONAL)</label>
                    <input
                      type="url"
                      name="github"
                      defaultValue="https://github.com/gouravgarg"
                      placeholder="https://github.com/yourusername"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 block font-bold">LINKEDIN_URL (OPTIONAL)</label>
                    <input
                      type="url"
                      name="linkedin"
                      defaultValue="https://linkedin.com/in/gouravgarg"
                      placeholder="https://linkedin.com/in/yourusername"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 py-3 text-center text-slate-400 hover:text-white cursor-pointer"
                  >
                    CANCEL_PROTOCOL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-500 py-3 text-center font-black text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    REGISTER_MEMBERSHIP
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clean Premium Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center select-none" id="master-footer">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-mono">
            &copy; {new Date().getFullYear()} Codezen. For developers, by developers. Built with premium custom layout standards. Zero telemetry data logs reported.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="footer-mainframe-btn"
              onClick={() => {
                setActiveTab('admin');
                addLog('Navigating to secure administrative mainframe verification chamber...');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs text-slate-400 font-mono font-medium hover:text-white hover:border-indigo-500/35 hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              Mainframe_Gateway
            </button>
            <a
              href="https://www.linkedin.com/company/codezenofficial/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs text-slate-400 font-mono font-medium hover:text-white hover:border-emerald-500/35 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
            >
              <Linkedin className="h-3.5 w-3.5 text-[#0077b5]" />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
