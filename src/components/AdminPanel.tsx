import React, { useState } from 'react';
import { 
  Lock, Unlock, Plus, Trash2, Edit2, Check, X, 
  Calendar, BookOpen, Users, Save, Sparkles, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventRecord, BlogPost, TeamMember } from '../types';

interface AdminPanelProps {
  events: EventRecord[];
  blogs: BlogPost[];
  teamMembers: TeamMember[];
  onUpdateEvents: (events: EventRecord[]) => void;
  onUpdateBlogs: (blogs: BlogPost[]) => void;
  onUpdateTeamMembers: (members: TeamMember[]) => void;
  onAddLog: (action: string) => void;
}

type AdminSection = 'events' | 'blogs' | 'members';

export default function AdminPanel({
  events,
  blogs,
  teamMembers,
  onUpdateEvents,
  onUpdateBlogs,
  onUpdateTeamMembers,
  onAddLog
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [sessionRole, setSessionRole] = useState<'Super Admin' | 'Level 1 Admin' | 'Member'>('Level 1 Admin');

  const [activeSection, setActiveSection] = useState<AdminSection>('events');

  // Currently editing item reference IDs
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for adding items
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // General Form States
  const [eventForm, setEventForm] = useState<Partial<EventRecord>>({
    title: '',
    type: 'Hackathon',
    date: '',
    time: '',
    location: '',
    description: '',
    rsvpCount: 0,
    isRsvpMe: false,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    speakers: []
  });

  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    readTime: '',
    tags: []
  });

  const [memberForm, setMemberForm] = useState<Partial<TeamMember>>({
    name: '',
    title: '',
    role: '',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NewMember'
  });

  // Handle local passphrase auth
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim();
    if (cleanInput === 'Gourav' || cleanInput === 'admin') {
      setSessionRole('Super Admin');
      setIsAuthenticated(true);
      setAuthError('');
      onAddLog('ADMIN SECURITY MODULE UNLOCKED: High level Super Admin workspace authenticated for Gourav.');
    } else if (cleanInput === 'gourav') {
      setSessionRole('Level 1 Admin');
      setIsAuthenticated(true);
      setAuthError('');
      onAddLog('ADMIN SECURITY MODULE UNLOCKED: Level 1 Admin workspace authenticated for gourav.');
    } else if (cleanInput === 'gourav1') {
      setSessionRole('Member');
      setIsAuthenticated(true);
      setAuthError('');
      onAddLog('MEMBER SYSTEM ACCESS GRANTED: Read-only Member layout verified for gourav1.');
    } else {
      setAuthError('INVALID ACCESS KEY SYSTEM REJECTED.');
      onAddLog('WARN: Unauthorised administrative access key entry rejected.');
    }
  };

  // Switch sections and clean up states
  const switchSection = (section: AdminSection) => {
    setActiveSection(section);
    setEditingId(null);
    setIsAddingNew(false);
  };

  // --- EVENTS CRUD ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionRole === 'Member') {
      onAddLog('REJECTED_ACTION: Write operations restricted for standard Members (gourav1). Please log in as Admin/Super Admin.');
      return;
    }
    if (!eventForm.title || !eventForm.date) return;

    const newEvent: EventRecord = {
      id: `ev-${Date.now()}`,
      title: eventForm.title,
      type: eventForm.type || 'Hackathon',
      date: eventForm.date,
      time: eventForm.time || '10:00 AM - 04:00 PM',
      location: eventForm.location || 'MAIT Campus, Delhi',
      description: eventForm.description || '',
      rsvpCount: Number(eventForm.rsvpCount) || 0,
      isRsvpMe: false,
      image: eventForm.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      speakers: eventForm.speakers && eventForm.speakers.length > 0 ? eventForm.speakers : ['Mait alumni mentor']
    };

    onUpdateEvents([newEvent, ...events]);
    setIsAddingNew(false);
    onAddLog(`COMMUNITY_GRID_SYNC: Added new community gathering "${newEvent.title}"`);
    
    // reset form
    setEventForm({
      title: '',
      type: 'Hackathon',
      date: '',
      time: '',
      location: '',
      description: '',
      rsvpCount: 0,
      isRsvpMe: false,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
      speakers: []
    });
  };

  const handleDeleteEvent = (id: string, name: string) => {
    if (sessionRole !== 'Super Admin') {
      onAddLog(`REJECTED_ACTION: Denied deleting "${name}". Event deletion is restricted to Super Admin (Gourav) privileges!`);
      return;
    }
    onUpdateEvents(events.filter(e => e.id !== id));
    onAddLog(`COMMUNITY_GRID_SYNC: Removed scheduled gathering "${name}"`);
  };

  const startEditEvent = (ev: EventRecord) => {
    setEditingId(ev.id);
    setEventForm(ev);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionRole === 'Member') {
      onAddLog('REJECTED_ACTION: Write operations restricted for standard Members (gourav1). Please log in as Admin/Super Admin.');
      return;
    }
    if (!editingId) return;

    onUpdateEvents(
      events.map(ev => ev.id === editingId ? { ...ev, ...eventForm } as EventRecord : ev)
    );
    onAddLog(`COMMUNITY_GRID_SYNC: Updated gathering variables for "${eventForm.title}"`);
    setEditingId(null);
  };

  // --- BLOGS CRUD ---
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionRole === 'Member') {
      onAddLog('REJECTED_ACTION: Blog creation restricted for standard Members (gourav1). Please log in as Admin/Super Admin.');
      return;
    }
    if (!blogForm.title) return;

    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: blogForm.title,
      excerpt: blogForm.excerpt || '',
      content: blogForm.content || '',
      author: blogForm.author || 'Codezen Core Team',
      date: blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: blogForm.readTime || '3 min read',
      tags: blogForm.tags && blogForm.tags.length > 0 ? blogForm.tags : ['General']
    };

    onUpdateBlogs([newBlog, ...blogs]);
    setIsAddingNew(false);
    onAddLog(`GAZETTE_SYNC: Published new blog post "${newBlog.title}"`);

    // reset
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: '',
      readTime: '',
      tags: []
    });
  };

  const handleDeleteBlog = (id: string, title: string) => {
    if (sessionRole !== 'Super Admin') {
      onAddLog(`REJECTED_ACTION: Denied deleting "${title}". Blog deletion is restricted to Super Admin (Gourav) privileges!`);
      return;
    }
    onUpdateBlogs(blogs.filter(b => b.id !== id));
    onAddLog(`GAZETTE_SYNC: Revoked blog post "${title}" from feed`);
  };

  const startEditBlog = (b: BlogPost) => {
    setEditingId(b.id);
    setBlogForm(b);
  };

  const handleUpdateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionRole === 'Member') {
      onAddLog('REJECTED_ACTION: Modification restricted for standard Members (gourav1).');
      return;
    }
    if (!editingId) return;

    onUpdateBlogs(
      blogs.map(b => b.id === editingId ? { ...b, ...blogForm } as BlogPost : b)
    );
    onAddLog(`GAZETTE_SYNC: Modified entry data for "${blogForm.title}"`);
    setEditingId(null);
  };

  // --- TEAM MEMBERS CRUD ---
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionRole === 'Member') {
      onAddLog('REJECTED_ACTION: Onboarding restricted for standard Members (gourav1).');
      return;
    }
    if (!memberForm.name || !memberForm.title) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: memberForm.name,
      title: memberForm.title,
      role: memberForm.role || 'Contributor',
      avatar: memberForm.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(memberForm.name)}`
    };

    onUpdateTeamMembers([...teamMembers, newMember]);
    setIsAddingNew(false);
    onAddLog(`MEMBER_CORP: Onboarded new council core advisor "${newMember.name}"`);

    // reset
    setMemberForm({
      name: '',
      title: '',
      role: '',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NewMember'
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (sessionRole !== 'Super Admin') {
      onAddLog(`REJECTED_ACTION: Denied deleting counselor "${name}". Member deletion is restricted to Super Admin (Gourav) privileges!`);
      return;
    }
    onUpdateTeamMembers(teamMembers.filter(m => m.id !== id));
    onAddLog(`MEMBER_CORP: Excised core advisor "${name}" from roster`);
  };

  const startEditMember = (tm: TeamMember) => {
    setEditingId(tm.id);
    setMemberForm(tm);
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionRole === 'Member') {
      onAddLog('REJECTED_ACTION: Modification restricted for standard Members (gourav1). Please log in as Admin/Super Admin.');
      return;
    }
    if (!editingId) return;

    onUpdateTeamMembers(
      teamMembers.map(m => m.id === editingId ? { ...m, ...memberForm } as TeamMember : m)
    );
    onAddLog(`MEMBER_CORP: Refactored variables for counselor "${memberForm.name}"`);
    setEditingId(null);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="admin-panel-container">
      {/* Intro Header */}
      <div className="border-b border-slate-900 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2 tracking-tight">
            <Terminal className="h-7 w-7 text-indigo-400" />
            Codezen Core Mainframe
          </h1>
          <p className="text-sm text-slate-400 font-sans">
            Secured admin operations terminal for syncing active courses, events, devlogs, and team roster variables.
          </p>
        </div>
        <div id="admin-status-indicator" className="flex flex-col items-start md:items-end gap-1.5 self-start md:self-auto">
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${isAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-mono font-medium text-slate-400 tracking-wider text-right">
              {isAuthenticated ? 'SECURE_TUNNEL_ESTABLISHED' : 'SYSTEM_LOCKED'}
            </span>
          </div>
          {isAuthenticated && (
            <div className="text-[10px] font-mono tracking-wide px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-slate-400 select-none">
              LEVEL: <span className={`font-bold ${sessionRole === 'Super Admin' ? 'text-indigo-400' : sessionRole === 'Level 1 Admin' ? 'text-emerald-400' : 'text-amber-400'}`}>{sessionRole.toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>

      {!isAuthenticated ? (
        /* Secure Auth Panel */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto premium-card p-8 rounded-2xl border border-slate-800 text-center space-y-6"
          id="admin-auth-panel"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Verification Challenge Required</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Use <code className="text-indigo-400 font-mono font-bold px-1 py-0.5 bg-slate-900 rounded">Gourav</code> for Super Admin access, <code className="text-emerald-400 font-mono font-bold px-1 py-0.5 bg-slate-900 rounded">gourav</code> for Level 1 Admin, or <code className="text-amber-400 font-mono font-bold px-1 py-0.5 bg-slate-900 rounded">gourav1</code> for Member view.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                id="admin-pass-input"
                type="password"
                placeholder="PROMPT KEY INPUT"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-center tracking-widest font-mono text-sm uppercase rounded-xl border border-slate-800 bg-slate-950 px-4.5 py-3 text-white placeholder-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              />
              {authError && (
                <p className="text-[10px] font-mono font-bold text-rose-400">{authError}</p>
              )}
            </div>
            <button
              id="submit-auth-btn"
              type="submit"
              className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-xs font-mono font-bold text-black transition-all hover:bg-indigo-400 active:scale-[0.98] cursor-pointer"
            >
              <Unlock className="h-3.5 w-3.5" />
              SOLVE DECRYPT CHALLENGE
            </button>
          </form>

          {/* Quick-select Test Profiles */}
          <div className="pt-4 border-t border-slate-900/60 space-y-2">
            <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-2">QUICK TEST ACCREDITATIONS</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                id="btn-quick-super"
                onClick={() => {
                  setPasswordInput('Gourav');
                  onAddLog('TESTER: Clicked Super Admin quick-fill credentials');
                }}
                className="px-2 py-1.5 bg-slate-950 border border-slate-900 hover:border-indigo-500/50 rounded-lg text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold transition-all cursor-pointer"
                title="Loads 'Gourav' for Super Admin privileges"
              >
                Gourav (Super)
              </button>
              <button
                type="button"
                id="btn-quick-lvl1"
                onClick={() => {
                  setPasswordInput('gourav');
                  onAddLog('TESTER: Clicked Level 1 quick-fill credentials');
                }}
                className="px-2 py-1.5 bg-slate-950 border border-slate-900 hover:border-emerald-500/50 rounded-lg text-[10px] font-mono text-emerald-450 hover:text-emerald-400 font-bold transition-all cursor-pointer"
                title="Loads 'gourav' for Level 1 Admin privileges"
              >
                gourav (Lvl1)
              </button>
              <button
                type="button"
                id="btn-quick-mem"
                onClick={() => {
                  setPasswordInput('gourav1');
                  onAddLog('TESTER: Clicked Member quick-fill credentials');
                }}
                className="px-2 py-1.5 bg-slate-950 border border-slate-900 hover:border-amber-500/50 rounded-lg text-[10px] font-mono text-amber-500 hover:text-amber-450 font-bold transition-all cursor-pointer"
                title="Loads 'gourav1' for normal Member privileges"
              >
                gourav1 (Mem)
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Authenticated Admin Workspace */
        <div className="grid gap-8 lg:grid-cols-12" id="admin-workspace">
          {/* Left Navigation bar */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[10px] font-mono text-slate-500 tracking-widest font-bold uppercase pl-2">Sync Sectors</div>
            <div className="flex flex-col gap-1">
              <button
                id="btn-admin-events"
                onClick={() => switchSection('events')}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left font-mono text-xs font-medium border transition-all ${activeSection === 'events' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent'}`}
              >
                <Calendar className="h-4 w-4" />
                Gathering_Grid ({events.length})
              </button>
              <button
                id="btn-admin-blogs"
                onClick={() => switchSection('blogs')}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left font-mono text-xs font-medium border transition-all ${activeSection === 'blogs' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent'}`}
              >
                <BookOpen className="h-4 w-4" />
                Devlog_Gazette ({blogs.length})
              </button>
              <button
                id="btn-admin-members"
                onClick={() => switchSection('members')}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left font-mono text-xs font-medium border transition-all ${activeSection === 'members' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent'}`}
              >
                <Users className="h-4 w-4" />
                Council_Roster ({teamMembers.length})
              </button>
            </div>

            <div className="premium-card p-4 rounded-xl space-y-2 mt-4 text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Audit Logs
              </div>
              <p>Passphrase verified successfully.</p>
              <p>CRUD modifications update global React state synchronously.</p>
              <button 
                id="lock-mainframe-btn"
                onClick={() => setIsAuthenticated(false)}
                className="w-full mt-2 py-1 bg-slate-950 hover:bg-rose-900/20 hover:text-rose-400 text-[10px] text-slate-400 border border-slate-900 rounded cursor-pointer transition-all"
              >
                FORCE LOCK SYSTEMS
              </button>
            </div>
          </div>

          {/* Right Workspace Content */}
          <div className="lg:col-span-9 space-y-6">
            <AnimatePresence mode="wait">
              {/* SECTION: EVENTS */}
              {activeSection === 'events' && (
                <motion.div
                  key="admin-events-pane"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-400" />
                      Gathering Grid Control
                    </h3>
                    {!isAddingNew && !editingId && (
                      sessionRole === 'Member' ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-850 px-3 py-1.5 text-xs font-mono font-bold text-slate-500 select-none">
                          <Lock className="h-3 w-3 text-amber-500" />
                          MEMBERS_READ_ONLY
                        </div>
                      ) : (
                        <button
                          id="add-event-toggle-btn"
                          onClick={() => setIsAddingNew(true)}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-mono font-bold text-black hover:bg-indigo-400 transition-all cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          INIT_NEW_EVENT
                        </button>
                      )
                    )}
                  </div>

                  {/* Add or Edit Form Panel */}
                  {(isAddingNew || editingId) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="premium-card p-6 rounded-xl border border-indigo-500/20"
                    >
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {editingId ? 'REWRITE_EVENT_REGISTRY' : 'BOOTSTRAP_EVENT_GRID'}
                        </span>
                        <button
                          id="close-event-form"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingId(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={editingId ? handleUpdateEvent : handleAddEvent} className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 font-mono mb-1">EVENT_TITLE_KEY *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g., Zenith Hackathon 2026"
                            value={eventForm.title || ''}
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">TYPE_SELECTION</label>
                          <select
                            value={eventForm.type || 'Hackathon'}
                            onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          >
                            <option value="Hackathon">Hackathon</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Social">Social</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">DATE_INDEX *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g., July 11, 2026"
                            value={eventForm.date || ''}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">INTERVAL_TIME</label>
                          <input
                            type="text"
                            placeholder="e.g., 09:00 AM - 06:00 PM"
                            value={eventForm.time || ''}
                            onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">LOCATION_ADDRESS</label>
                          <input
                            type="text"
                            placeholder="e.g., Seminar Hall, MAIT Delhi"
                            value={eventForm.location || ''}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 font-mono mb-1">DESCRIPTION_STRING</label>
                          <textarea
                            rows={3}
                            placeholder="Markdown syntax supported. Write structured summaries of course requirements."
                            value={eventForm.description || ''}
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400 resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2 border-t border-slate-900">
                          <button
                            id="btn-event-cancel"
                            type="button"
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingId(null);
                            }}
                            className="px-4 py-2 border border-slate-800 text-slate-400 font-mono rounded-lg hover:text-white transition-all cursor-pointer"
                          >
                            VOID_ACTION
                          </button>
                          <button
                            id="btn-event-submit"
                            type="submit"
                            className="px-4 py-2 bg-indigo-500 font-mono text-black font-extrabold rounded-lg hover:bg-indigo-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="h-3.5 w-3.5" />
                            {editingId ? 'COMMIT_CHANGES' : 'LAUNCH_EVENT'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* List Content */}
                  <div className="space-y-3" id="admin-events-list">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        id={`admin-event-row-${ev.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all gap-4 select-none"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-center text-[10px] uppercase font-bold min-w-16">
                            {ev.type}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-white">{ev.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500 font-mono text-[10px] mt-0.5">
                              <span>{ev.date}</span>
                              <span>•</span>
                              <span>{ev.location}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-semibold">{ev.rsvpCount} RSVPs</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {sessionRole === 'Member' ? (
                            <button
                              id={`edit-event-btn-${ev.id}`}
                              onClick={() => onAddLog('REJECTED_ACTION: Read-only access state. Members cannot edit event options.')}
                              className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-600 cursor-not-allowed"
                              title="Locked: Member view is read-only"
                            >
                              <Lock className="h-3.5 w-3.5 text-slate-500 hover:text-amber-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              id={`edit-event-btn-${ev.id}`}
                              onClick={() => startEditEvent(ev)}
                              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                              title="Edit scheduled event"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {sessionRole !== 'Super Admin' ? (
                            <button
                              id={`delete-event-btn-${ev.id}`}
                              onClick={() => onAddLog(`REJECTED_ACTION: Denied deleting "${ev.title}". Eviction belongs strictly to Super Admin (Gourav) authority.`)}
                              className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-600 cursor-not-allowed"
                              title="Locked: Requires Super Admin authority to erase entries"
                            >
                              <Lock className="h-3.5 w-3.5 text-slate-500 hover:text-indigo-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              id={`delete-event-btn-${ev.id}`}
                              onClick={() => handleDeleteEvent(ev.id, ev.title)}
                              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete scheduled event"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SECTION: BLOGS */}
              {activeSection === 'blogs' && (
                <motion.div
                  key="admin-blogs-pane"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                      Devlog Gazette Manager
                    </h3>
                    {!isAddingNew && !editingId && (
                      sessionRole === 'Member' ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-850 px-3 py-1.5 text-xs font-mono font-bold text-slate-500 select-none">
                          <Lock className="h-3 w-3 text-amber-500" />
                          MEMBERS_READ_ONLY
                        </div>
                      ) : (
                        <button
                          id="add-blog-toggle-btn"
                          onClick={() => setIsAddingNew(true)}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-mono font-bold text-black hover:bg-indigo-400 transition-all cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          PUBLISH_NEW_WRITEUP
                        </button>
                      )
                    )}
                  </div>

                  {/* Add or Edit Form Panel */}
                  {(isAddingNew || editingId) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="premium-card p-6 rounded-xl border border-indigo-500/20"
                    >
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {editingId ? 'RECOMPILE_BLOG_CREDENTIALS' : 'COMPILE_NEW_GAZETTE'}
                        </span>
                        <button
                          id="close-blog-form"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingId(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={editingId ? handleUpdateBlog : handleAddBlog} className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 font-mono mb-1">WRITEUP_TITLE *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g., Mastering interactive git rebases"
                            value={blogForm.title || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">AUTHOR_NAME</label>
                          <input
                            type="text"
                            placeholder="e.g., Gaurav Sharma"
                            value={blogForm.author || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">READING_DURATION</label>
                          <input
                            type="text"
                            placeholder="e.g., 5 min read"
                            value={blogForm.readTime || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 font-mono mb-1">EXCERPT (SHORT INTRO) *</label>
                          <input
                            required
                            type="text"
                            placeholder="Write an eye-catching 1-sentence descriptor..."
                            value={blogForm.excerpt || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 font-mono mb-1">ARTICLE_MARKDOWN_BODY *</label>
                          <textarea
                            required
                            rows={6}
                            placeholder="Markdown format is supported. Break down algorithms using code strings..."
                            value={blogForm.content || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400 resize-none font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2 border-t border-slate-900">
                          <button
                            id="btn-blog-cancel"
                            type="button"
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingId(null);
                            }}
                            className="px-4 py-2 border border-slate-800 text-slate-400 font-mono rounded-lg hover:text-white transition-all cursor-pointer"
                          >
                            DISCARD
                          </button>
                          <button
                            id="btn-blog-submit"
                            type="submit"
                            className="px-4 py-2 bg-indigo-500 font-mono text-black font-extrabold rounded-lg hover:bg-indigo-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="h-3.5 w-3.5" />
                            {editingId ? 'COMMIT_BLOG' : 'PUBLISH_LIVE'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* List Content */}
                  <div className="space-y-3" id="admin-blogs-list">
                    {blogs.map((b) => (
                      <div
                        key={b.id}
                        id={`admin-blog-row-${b.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all gap-4 select-none"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display font-bold text-sm text-white truncate">{b.title}</h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{b.excerpt}</p>
                          <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] mt-1.5">
                            <span>BY_AUTHOR: {b.author}</span>
                            <span>•</span>
                            <span>{b.date}</span>
                            <span>•</span>
                            <span>{b.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {sessionRole === 'Member' ? (
                            <button
                              id={`edit-blog-btn-${b.id}`}
                              onClick={() => onAddLog('REJECTED_ACTION: Read-only access state. Members cannot edit blog entries.')}
                              className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-600 cursor-not-allowed"
                              title="Locked: Member view is read-only"
                            >
                              <Lock className="h-3.5 w-3.5 text-slate-500 hover:text-amber-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              id={`edit-blog-btn-${b.id}`}
                              onClick={() => startEditBlog(b)}
                              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                              title="Edit devlog post"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {sessionRole !== 'Super Admin' ? (
                            <button
                              id={`delete-blog-btn-${b.id}`}
                              onClick={() => onAddLog(`REJECTED_ACTION: Denied deleting "${b.title}". Eviction restricted to Super Admin (Gourav) privileges.`)}
                              className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-600 cursor-not-allowed"
                              title="Locked: Requires Super Admin authority to erase blogs"
                            >
                              <Lock className="h-3.5 w-3.5 text-slate-500 hover:text-indigo-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              id={`delete-blog-btn-${b.id}`}
                              onClick={() => handleDeleteBlog(b.id, b.title)}
                              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete devlog post"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SECTION: MEMBERS */}
              {activeSection === 'members' && (
                <motion.div
                  key="admin-members-pane"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-400" />
                      Council Members Setup
                    </h3>
                    {!isAddingNew && !editingId && (
                      sessionRole === 'Member' ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-850 px-3 py-1.5 text-xs font-mono font-bold text-slate-500 select-none">
                          <Lock className="h-3 w-3 text-amber-500" />
                          MEMBERS_READ_ONLY
                        </div>
                      ) : (
                        <button
                          id="add-member-toggle-btn"
                          onClick={() => setIsAddingNew(true)}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-mono font-bold text-black hover:bg-indigo-400 transition-all cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          ONBOARD_COUNCIL_MEMBER
                        </button>
                      )
                    )}
                  </div>

                  {/* Add or Edit Form Panel */}
                  {(isAddingNew || editingId) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="premium-card p-6 rounded-xl border border-indigo-500/20"
                    >
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {editingId ? 'RE-COMPILE_COUNSELOR_NODE' : 'INDEX_COUNSELOR_NODE'}
                        </span>
                        <button
                          id="close-member-form"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingId(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={editingId ? handleUpdateMember : handleAddMember} className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div>
                          <label className="block text-slate-400 font-mono mb-1">MEMBER_REAL_NAME *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g., Gaurav Sharma"
                            value={memberForm.name || ''}
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-mono mb-1">COMMUNITY_TITLE *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g., Community Founder / Mentor"
                            value={memberForm.title || ''}
                            onChange={(e) => setMemberForm({ ...memberForm, title: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 font-mono mb-1">TECHNICAL_SPECIALTY *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g., Systems Architect / Visual Designer"
                            value={memberForm.role || ''}
                            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2 border-t border-slate-900">
                          <button
                            id="btn-member-cancel"
                            type="button"
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingId(null);
                            }}
                            className="px-4 py-2 border border-slate-800 text-slate-400 font-mono rounded-lg hover:text-white transition-all cursor-pointer"
                          >
                            DISCARD
                          </button>
                          <button
                            id="btn-member-submit"
                            type="submit"
                            className="px-4 py-2 bg-indigo-500 font-mono text-black font-extrabold rounded-lg hover:bg-indigo-400 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="h-3.5 w-3.5" />
                            {editingId ? 'COMMIT_ADVISOR' : 'ONBOARD_MEMBER'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* List Content */}
                  <div className="grid gap-4 sm:grid-cols-2" id="admin-members-list">
                    {teamMembers.map((m) => (
                      <div
                        key={m.id}
                        id={`admin-member-card-${m.id}`}
                        className="p-4 rounded-xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all flex items-center justify-between gap-4 select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            referrerPolicy="no-referrer"
                            className="h-11 w-11 rounded-lg bg-slate-900 border border-slate-800"
                          />
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-sm text-white truncate">{m.name}</h4>
                            <div className="text-[10px] text-emerald-400 font-mono font-medium truncate">{m.title}</div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">{m.role}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {sessionRole === 'Member' ? (
                            <button
                              id={`edit-member-btn-${m.id}`}
                              onClick={() => onAddLog('REJECTED_ACTION: Read-only access state. Members cannot edit council details.')}
                              className="p-1.5 bg-slate-950 border border-slate-900 rounded-lg text-slate-650 cursor-not-allowed"
                              title="Locked: Member view is read-only"
                            >
                              <Lock className="h-3 w-3 text-slate-500 hover:text-amber-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              id={`edit-member-btn-${m.id}`}
                              onClick={() => startEditMember(m)}
                              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                              title="Edit counselor node settings"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}

                          {sessionRole !== 'Super Admin' ? (
                            <button
                              id={`delete-member-btn-${m.id}`}
                              onClick={() => onAddLog(`REJECTED_ACTION: Denied deleting counselor "${m.name}". Deletion of advisors requires Super Admin (Gourav) privileges.`)}
                              className="p-1.5 bg-slate-950 border border-slate-900 rounded-lg text-slate-650 cursor-not-allowed"
                              title="Locked: Requires Super Admin authority to erase accounts"
                            >
                              <Lock className="h-3 w-3 text-slate-500 hover:text-indigo-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              id={`delete-member-btn-${m.id}`}
                              onClick={() => handleDeleteMember(m.id, m.name)}
                              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete counselor"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
