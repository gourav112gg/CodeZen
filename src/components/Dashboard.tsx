import React, { useState, useEffect } from 'react';
import { 
  User, Code, Sparkles, Award, Heart, Edit2, Check, 
  ExternalLink, Github, Linkedin, Plus, MessageSquare, Terminal, TrendingUp, Sparkle,
  RefreshCw, BookOpen, Trophy, Lock, Unlock, CheckCircle2, Calendar
} from 'lucide-react';
import { ClubMember, ClubProject, Achievement } from '../types';
import { DashboardSkeleton } from './SkeletonLoader';

interface DashboardProps {
  member: ClubMember;
  projectsList: ClubProject[];
  logs: string[];
  achievements: Achievement[];
  onUpdateMember: (member: ClubMember) => void;
  onAddProject: (project: ClubProject) => void;
  onUpvoteProject: (projectId: string) => void;
  onAddLog: (action: string) => void;
  onSignOut: () => void;
}

export default function Dashboard({ 
  member, 
  projectsList, 
  logs,
  achievements,
  onUpdateMember,
  onAddProject,
  onUpvoteProject,
  onAddLog,
  onSignOut
}: DashboardProps) {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleManualSync = () => {
    setIsLoading(true);
    setIsSyncing(true);
    onAddLog('Initiated telemetry query sync & ledger verification...');
    setTimeout(() => {
      setIsLoading(false);
      setIsSyncing(false);
      onAddLog('Ledger credentials successfully re-verified locally.');
    }, 800);
  };

  // Editing Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(member.name);
  const [editRole, setEditRole] = useState(member.role);
  const [editTagline, setEditTagline] = useState(member.tagline);
  const [editSkills, setEditSkills] = useState(member.skills.join(', '));
  const [selectedAvatar, setSelectedAvatar] = useState(member.avatar);

  // Adding Projects forms
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTags, setNewProjTags] = useState('React, Tailwind, Vite');

  // Pre-configured avatars
  const AVATARS = [
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Garg',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=CodeMaster',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=WarpDrive',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Synthesizer'
  ];

  // Leaderboard mock directory
  const LEADERBOARD_MEMBERS = [
    { rank: 1, name: 'Gaurav Sharma', title: 'Lead Architect', xp: 2470, commits: 142, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gaurav' },
    { rank: 2, name: 'Sarah Jenkins', title: 'ML Specialist', xp: 1980, commits: 98, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Sarah' },
    { rank: 3, name: 'Ami Patel', title: 'Web3 Builder', xp: 1650, commits: 74, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ami' },
    { rank: member.rank, name: member.name, title: member.role, xp: member.xp, commits: member.commits, avatar: member.avatar, isMe: true },
    { rank: 15, name: 'Devon Green', title: 'FE Specialist', xp: 150, commits: 42, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Devon' }
  ].sort((a,b) => b.xp - a.xp);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMember: ClubMember = {
      ...member,
      name: editName,
      role: editRole,
      tagline: editTagline,
      avatar: selectedAvatar,
      skills: editSkills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };
    onUpdateMember(updatedMember);
    setIsEditing(false);
    onAddLog('Updated personal student credentials portfolio');
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;

    const newProj: ClubProject = {
      id: `proj-${Date.now()}`,
      title: newProjTitle,
      description: newProjDesc,
      ownerName: member.name,
      ownerAvatar: member.avatar,
      likes: 0,
      isLikedMe: false,
      tags: newProjTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    onAddProject(newProj);
    setNewProjTitle('');
    setNewProjDesc('');
    setShowAddProject(false);
    onAddLog(`Pushed project portfolio update "${newProjTitle}" to showcases`);
  };

  return (
    <div id="member-dashboard-root" className="space-y-8 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5" id="dashboard-header-panel">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">Member Credentials Mainframe</h1>
          <p className="text-xs text-slate-400">Cryptographically signed ledger verifying achievements, repositories, and peer XP.</p>
        </div>
        <button
          id="sync-dashboard-btn"
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          Force Sync Metrics
        </button>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Top Banner Stats Grid with User Briefing */}
          <section className="grid gap-6 md:grid-cols-12" id="dashboard-hero-section">
        {/* Profile Card left */}
        <div className="md:col-span-4 rounded-2xl border border-slate-850 bg-slate-950 p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-2 right-2">
            {!isEditing && (
              <button
                id="edit-profile-trigger"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSave} className="w-full text-left space-y-3.5 z-10" id="profile-edit-form">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider mb-2">Edit Developer Credentials</span>
              
              {/* Avatar Selector row */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Choose Pixel Avatar</label>
                <div className="flex gap-2 py-1 justify-center">
                  {AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      id={`avatar-option-${idx}`}
                      alt="Avatar option"
                      referrerPolicy="no-referrer"
                      onClick={() => setSelectedAvatar(av)}
                      className={`h-9 w-9 rounded-lg bg-slate-900 border cursor-pointer transition-all hover:scale-105 ${selectedAvatar === av ? 'border-emerald-400 ring-2 ring-emerald-500/15' : 'border-slate-800'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Student Name</label>
                <input
                  id="profile-edit-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Developer Title</label>
                <input
                  id="profile-edit-role"
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Personal Tagline</label>
                <textarea
                  id="profile-edit-tagline"
                  required
                  rows={2}
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-sans">Skills Tags (Comma-Separated)</label>
                <input
                  id="profile-edit-skills"
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="cancel-profile-edit"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-profile-btn"
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 cursor-pointer"
                >
                  Confirm Signature
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4" id="profile-display-card">
              <img
                src={member.avatar}
                alt={member.name}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-2xl bg-slate-900 border border-slate-800/80 animate-float"
              />
              <div>
                <h3 className="font-display text-lg font-black text-white">{member.name}</h3>
                <div className="text-xs text-emerald-400 font-semibold mt-1 font-mono">{member.role}</div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-sans mt-2.5">{member.tagline}</p>
              </div>

              {/* Skill list */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-2" id="member-skills-list">
                {member.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-900 border border-slate-850 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 border-t border-slate-900 pt-4 w-full justify-center text-slate-500">
                <a href={member.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>

              <button
                id="dashboard-sign-out-btn"
                onClick={onSignOut}
                className="w-full mt-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-450 hover:text-rose-450 py-2.5 text-[10px] font-mono font-bold transition-all hover:border-rose-500/40 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>TERMINATE_SESSION (Sign Out)</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic statistics and XP indicators */}
        <div className="md:col-span-8 grid gap-4 sm:grid-cols-3" id="stats-dashboard-column">
          {/* XP Progress Arc Circle Card */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-6 flex flex-col justify-between shadow-md relative overflow-hidden" id="xp-progress-card">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-500 font-mono block">DEVELOPER EXPERIENCE</span>
                <span className="text-3xl font-display font-black text-white mt-1.5 block">Level {member.level}</span>
              </div>
              <Award className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-end justify-between text-xs font-mono text-slate-400">
                <span>Reputation XP: {member.xp}</span>
                <span>Next Level: 500 XP</span>
              </div>
              
              {/* Custom Level Progress Bar */}
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${(member.xp / 500) * 100}%` }} />
              </div>
              
              <span className="text-[10px] text-slate-500 block">Complete Learning Hub track courses or attend scheduled workshops to earn XP.</span>
            </div>
          </div>

          {/* Commit logs metrics */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-6 flex flex-col justify-between shadow-md" id="commits-metric-card">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-500 font-mono block">VERIFIED COMMITS</span>
                <span className="text-3xl font-display font-black text-white mt-1.5 block">{member.commits}</span>
              </div>
              <Code className="h-5 w-5 text-cyan-400" />
            </div>
            
            <div className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Repository contributions submitted and merged across Codezen open source repositories on GitHub models.
            </div>
          </div>

          {/* Leaderboard status */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-6 flex flex-col justify-between shadow-md" id="leaderboard-status-card">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-500 font-mono block">COMMUNITY RANKING</span>
                <span className="text-3xl font-display font-black text-white mt-1.5 block">#{member.rank}</span>
              </div>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Global ranking across 450+ member profiles mapped dynamically based on overall XP metrics.
            </div>
          </div>
        </div>
      </section>

      {/* Member Spotlight Section */}
      <section className="space-y-4 border-b border-slate-900 pb-8" id="dashboard-member-spotlight">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-left">
            <h2 className="font-display text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
              Member Badge & Milestone Spotlight
            </h2>
            <p className="text-xs text-slate-400">Dynamically compiled cryptographic ledger certificates and earned status. Hover for active query indices.</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/10 bg-emerald-500/5 px-2.5 py-1 rounded-xl uppercase font-bold self-start sm:self-center">
            {achievements.filter(a => !a.isLocked).length} / {achievements.length} Verified
          </span>
        </div>

        {/* Dynamic Badge Showcase Grid with High Premium Hover Effects */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" id="member-spotlight-cards-grid">
          {[...achievements].sort((a, b) => {
            if (a.isLocked !== b.isLocked) {
              return a.isLocked ? 1 : -1;
            }
            return b.xp - a.xp;
          }).slice(0, 4).map((ach) => {
            const getBadgeIcon = (iconName: string) => {
              switch (iconName) {
                case 'User':
                  return <User className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />;
                case 'CheckSquare':
                  return <BookOpen className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />;
                case 'Calendar':
                  return <Calendar className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />;
                case 'Heart':
                  return <Heart className="h-5 w-5 text-rose-450 group-hover:scale-110 transition-transform duration-300" />;
                case 'Award':
                  return <Trophy className="h-5 w-5 text-amber-500 animate-float group-hover:scale-110 transition-transform duration-300" style={{ animationDuration: '4s' }} />;
                default:
                  return <Award className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />;
              }
            };

            return (
              <div
                key={ach.id}
                id={`spotlight-badge-${ach.id}`}
                className={`premium-card relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 group overflow-hidden ${
                  ach.isLocked 
                    ? 'border-slate-805 bg-slate-900/10 opacity-75 hover:border-slate-700 hover:bg-slate-900/20' 
                    : 'border-emerald-500/15 bg-slate-900/20 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(0,165,114,0.06)] hover:scale-[1.02]'
                }`}
              >
                {/* Soft visual glow for unlocked badges */}
                {!ach.isLocked && (
                  <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-300" />
                )}

                <div className="space-y-3.5">
                  {/* Badge top row */}
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-2.5 bg-slate-950 border transition-colors ${
                      ach.isLocked ? 'border-slate-850 text-slate-600' : 'border-emerald-500/15 text-emerald-400'
                    }`}>
                      {getBadgeIcon(ach.icon)}
                    </div>

                    {ach.isLocked ? (
                      <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-850 uppercase">
                        LOCKED
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
                        UNLOCKED
                      </span>
                    )}
                  </div>

                  {/* Badge title and descriptions */}
                  <div className="text-left">
                    <h4 className="font-display font-extrabold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors leading-snug">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans line-clamp-2">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Badge footer metadata */}
                <div className="flex items-center justify-between border-t border-slate-900/60 pt-3.5 mt-4">
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded">
                    +{ach.xp} XP
                  </span>
                  
                  {!ach.isLocked && ach.unlockedAt ? (
                    <span className="text-[9px] text-slate-500 font-mono">
                      {ach.unlockedAt}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-600 font-mono flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5 text-slate-600" /> Locked Gate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main split sections: Left Projects Showroom, Right Member Leaderboard */}
      <section className="grid gap-8 lg:grid-cols-12" id="dashboard-split-grids">
        {/* Project Showrooms lists */}
        <div className="lg:col-span-7 space-y-6" id="projects-showroom-panel">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-1.5">
                <Sparkle className="h-5 w-5 text-emerald-400 fill-emerald-500/10 animate-spin" style={{ animationDuration: '6s' }} />
                Student Project Showroom
              </h2>
              <p className="text-sm text-slate-400">Discover and upvote original open source logic built by student builders.</p>
            </div>
            <button
              id="add-project-trigger"
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Pave Project
            </button>
          </div>

          {/* Submissions form overlay */}
          {showAddProject && (
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950 p-6 space-y-4" id="project-submission-box">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-white">Feature Your Repository</h3>
                <button
                  id="close-add-project-btn"
                  onClick={() => setShowAddProject(false)}
                  className="text-slate-500 hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Project Title</label>
                    <input
                      id="new-project-title"
                      type="text"
                      required
                      placeholder="e.g. SynapseVibe Editor"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Stack Labels (Comma Separated)</label>
                    <input
                      id="new-project-tags"
                      type="text"
                      required
                      placeholder="React, CSS, Solidity"
                      value={newProjTags}
                      onChange={(e) => setNewProjTags(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Functional Description Summary</label>
                  <textarea
                    id="new-project-desc"
                    required
                    rows={2}
                    placeholder="Short summary highlighting stack goals and features."
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700 leading-relaxed"
                  />
                </div>

                <button
                  id="submit-project-btn"
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Deploy Web Showroom Card
                </button>
              </form>
            </div>
          )}

          {/* Projects Showroom Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2" id="projects-feed-grid">
            {projectsList.map(proj => (
              <div
                key={proj.id}
                id={`project-card-${proj.id}`}
                className="rounded-2xl border border-slate-850 bg-slate-900/10 p-5 flex flex-col justify-between hover:border-slate-700 transition-all text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={proj.ownerAvatar}
                        alt={proj.ownerName}
                        referrerPolicy="no-referrer"
                        className="h-6.5 w-6.5 rounded-md bg-slate-950 border border-slate-800/60"
                      />
                      <span className="text-[11px] font-mono text-slate-500">{proj.ownerName}</span>
                    </div>

                    <button
                      id={`upvote-btn-${proj.id}`}
                      onClick={() => {
                        onUpvoteProject(proj.id);
                        onAddLog(`${proj.isLikedMe ? 'Removed upvote on' : 'Upvoted'} "${proj.title}"`);
                      }}
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all ${proj.isLikedMe ? 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 cursor-pointer'}`}
                    >
                      <Heart className={`h-3 w-3 ${proj.isLikedMe ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{proj.likes}</span>
                    </button>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-100">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1.5 line-clamp-3">{proj.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-900/60 mt-4">
                  {proj.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded bg-slate-950 border border-slate-900 px-2 py-0.5 text-[9px] font-mono text-emerald-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Leaderboard panel - Right Col */}
        <div className="lg:col-span-5 space-y-6" id="leaderboard-ranking-panel">
          <div>
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Community Leaderboard
            </h3>
            <p className="text-sm text-slate-400">Roster of student engineers ranked by verified contributions.</p>
          </div>

          <div className="rounded-2xl border border-slate-850 bg-slate-950 overflow-hidden" id="leaderboard-table-widget">
            <div className="space-y-1 bg-slate-900/30 px-5 py-4 border-b border-slate-900">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Developers sorted by XP</span>
            </div>

            <div className="divide-y divide-slate-900" id="leaderboard-rows-scroller">
              {LEADERBOARD_MEMBERS.map((user, idx) => (
                <div
                  key={idx}
                  id={`leaderboard-row-${idx}`}
                  className={`flex items-center justify-between px-5 py-3 transition-colors ${user.isMe ? 'bg-emerald-500/5' : 'hover:bg-slate-900/10'}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank indicator */}
                    <span className={`font-mono text-xs font-bold w-4 shrink-0 text-center ${user.rank === 1 ? 'text-amber-400' : user.rank === 2 ? 'text-slate-400' : 'text-slate-600'}`}>
                      {user.rank}
                    </span>

                    {/* Avatar */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800"
                    />

                    <div>
                      <h4 className="font-display font-medium text-xs text-white max-w-[120px] truncate">{user.name} {user.isMe && <span className="text-[10px] text-emerald-400 font-mono font-bold">(Me)</span>}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{user.title}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[10px]">
                    <span className="text-slate-300 font-bold block">{user.xp} XP</span>
                    <span className="text-slate-600 block">{user.commits} pull checks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Live System Logs at Bottom */}
      <section className="space-y-3" id="system-audit-logger-section">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-4.5 w-4.5 text-slate-500" />
          <h3 className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-widest">Codezen DB State Audit Engine</h3>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950 p-4 font-mono text-[11px] text-slate-500 h-32 overflow-y-auto leading-relaxed space-y-1 shadow-inner">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2.5">
              <span className="text-[10px] text-slate-600 font-semibold shrink-0">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
              <span className="text-slate-400 select-all">{log}</span>
            </div>
          ))}
          <div className="flex gap-2.5 font-bold text-slate-600 animate-pulse">
            <span>[KERNEL]</span>
            <span>Listening for dynamic client micro-events...</span>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}
