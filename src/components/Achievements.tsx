import React, { useState } from 'react';
import { 
  Trophy, Lock, Unlock, Sparkles, CheckCircle2, 
  HelpCircle, Star, CircleAlert, Flame, BookOpen, User, Calendar, Heart 
} from 'lucide-react';
import { Achievement, Course, EventRecord, ClubProject } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
  courses: Course[];
  events: EventRecord[];
  projects: ClubProject[]; // Wait, let's look at prop name: projectsList is passed from parent usually
  userXp: number;
  onUnlockAchievement: (id: string, xpReward: number) => void;
  onClaimQuestXp: (xpToAdd: number) => void;
  onAddLog: (action: string) => void;
}

export default function Achievements({
  achievements,
  courses,
  events,
  projects,
  userXp,
  onUnlockAchievement,
  onClaimQuestXp,
  onAddLog
}: AchievementsProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'learning' | 'events' | 'community' | 'profile'>('all');

  // Verify Quest Completions based on live states!
  const isEnrolledTrack = courses.some(c => c.isEnrolled);
  const isLessonCompleted = courses.some(c => c.lessons.some(l => l.isCompleted));
  const isRsvpedEvent = events.some(e => e.isRsvpMe);
  const isProjectSubmitted = projects.some(p => p.ownerName === 'Garg Gourav' || p.ownerName === 'Garg');

  // Mock claims state
  const [claimedQuestA, setClaimedQuestA] = useState(false);
  const [claimedQuestB, setClaimedQuestB] = useState(false);
  const [claimedQuestC, setClaimedQuestC] = useState(false);
  const [claimedQuestD, setClaimedQuestD] = useState(false);

  // Filter achievements
  const filteredAchievements = activeCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeCategory);

  const handleQuestClaim = (questId: string, xpReward: number, achievementIdToUnlock?: string) => {
    onClaimQuestXp(xpReward);
    if (questId === 'quest-a') {
      setClaimedQuestA(true);
      onAddLog('Claimed Daily Quest: enrolled in first Codezen course track (+50 XP)');
    }
    if (questId === 'quest-b') {
      setClaimedQuestB(true);
      onAddLog('Claimed Daily Quest: completed first course lesson and answer checkpoint (+100 XP)');
    }
    if (questId === 'quest-c') {
      setClaimedQuestC(true);
      onAddLog('Claimed Daily Quest: RSVPed to upcoming gathering Zenith Hackathon (+100 XP)');
    }
    if (questId === 'quest-d') {
      setClaimedQuestD(true);
      onAddLog('Claimed Daily Quest: submitted custom project repository into Codezen showcases (+150 XP)');
    }

    if (achievementIdToUnlock) {
      onUnlockAchievement(achievementIdToUnlock, 0); // XP already claimed in quest
    }
  };

  return (
    <div id="achievements-manager-root" className="grid gap-8 lg:grid-cols-12 py-2">
      {/* List Achievements - Left Col */}
      <div id="achievements-catalog-column" className="lg:col-span-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-400 animate-float" />
              Community Achievements
            </h2>
            <p className="text-sm text-slate-400">Unlock official Codezen developer credentials and level badges.</p>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-900 overflow-x-auto" id="achievements-filters">
            {[
              { id: 'all', label: 'All' },
              { id: 'learning', label: 'Learning' },
              { id: 'profile', label: 'Profile' },
              { id: 'community', label: 'Comm' },
              { id: 'events', label: 'Events' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`achievement-filter-${tab.id}`}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${activeCategory === tab.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid gap-4 sm:grid-cols-2" id="achievements-badges-grid">
          {filteredAchievements.map(ach => (
            <div
              key={ach.id}
              id={`achievement-card-${ach.id}`}
              className={`rounded-2xl border p-5 flex items-start gap-4 transition-all relative overflow-hidden ${ach.isLocked ? 'border-slate-900 bg-slate-950/20 opacity-60' : 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40'}`}
            >
              {/* Subtle background flare for unlocked */}
              {!ach.isLocked && (
                <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/5 blur-xl rounded-full" />
              )}

              {/* Icon Holder */}
              <div className={`rounded-xl p-3 shrink-0 border relative ${ach.isLocked ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                {ach.icon === 'User' && <User className="h-5 w-5" />}
                {ach.icon === 'CheckSquare' && <BookOpen className="h-5 w-5" />}
                {ach.icon === 'Calendar' && <Calendar className="h-5 w-5" />}
                {ach.icon === 'Heart' && <Heart className="h-5 w-5" />}
                {ach.icon === 'Award' && <Trophy className="h-5 w-5 animate-float" style={{ animationDuration: '4s' }} />}

                {/* Small indicator lock/unlock pad */}
                <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-950 p-0.5 border border-slate-850">
                  {ach.isLocked ? (
                    <Lock className="h-2.5 w-2.5 text-slate-500" />
                  ) : (
                    <Unlock className="h-2.5 w-2.5 text-emerald-400" />
                  )}
                </div>
              </div>

              {/* Achievement description */}
              <div className="space-y-1 my-0.5 text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-display font-bold text-sm text-white leading-snug">{ach.title}</h4>
                  <span className="rounded bg-slate-900 border border-slate-850 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400">
                    +{ach.xp} XP
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{ach.description}</p>
                {!ach.isLocked && ach.unlockedAt && (
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">Unlocked on: {ach.unlockedAt}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily developer challenges - Right Col */}
      <div id="quests-challenges-column" className="lg:col-span-4 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
            <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
            Developer Quests
          </h3>
          <p className="text-sm text-slate-400">Real tasks verified dynamically to award instant Reputation XP.</p>
        </div>

        <div className="rounded-2xl border border-slate-850 bg-slate-950 p-5 space-y-5" id="quests-checklist-box">
          {/* Quest list items */}
          <div className="space-y-4">
            {/* Quest A */}
            <div id="quest-item-explore" className="space-y-2.5 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-white">Enroll in any study track</h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Status: {isEnrolledTrack ? 'Completed' : 'Draft'} • +50 XP</span>
                </div>
                {isEnrolledTrack && !claimedQuestA ? (
                  <button
                    id="claim-quest-a-btn"
                    onClick={() => handleQuestClaim('quest-a', 50, 'ach-1')}
                    className="rounded bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Claim
                  </button>
                ) : claimedQuestA ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono uppercase">LOCKED</span>
                )}
              </div>
            </div>

            {/* Quest B */}
            <div id="quest-item-lessons" className="space-y-2.5 text-left border-t border-slate-900 pt-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-white">Answer first track checkpoint quiz</h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Status: {isLessonCompleted ? 'Completed' : 'Draft'} • +100 XP</span>
                </div>
                {isLessonCompleted && !claimedQuestB ? (
                  <button
                    id="claim-quest-b-btn"
                    onClick={() => handleQuestClaim('quest-b', 100, 'ach-2')}
                    className="rounded bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Claim
                  </button>
                ) : claimedQuestB ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono uppercase">LOCKED</span>
                )}
              </div>
            </div>

            {/* Quest C */}
            <div id="quest-item-rsvp" className="space-y-2.5 text-left border-t border-slate-900 pt-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-white">Claim virtual access pass to any event</h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Status: {isRsvpedEvent ? 'Completed' : 'Draft'} • +100 XP</span>
                </div>
                {isRsvpedEvent && !claimedQuestC ? (
                  <button
                    id="claim-quest-c-btn"
                    onClick={() => handleQuestClaim('quest-c', 100, 'ach-3')}
                    className="rounded bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Claim
                  </button>
                ) : claimedQuestC ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono uppercase">LOCKED</span>
                )}
              </div>
            </div>

            {/* Quest D */}
            <div id="quest-item-project" className="space-y-2.5 text-left border-t border-slate-900 pt-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-white">Publish project showroom repository</h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Status: {isProjectSubmitted ? 'Completed' : 'Draft'} • +150 XP</span>
                </div>
                {isProjectSubmitted && !claimedQuestD ? (
                  <button
                    id="claim-quest-d-btn"
                    onClick={() => handleQuestClaim('quest-d', 150, 'ach-5')}
                    className="rounded bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Claim
                  </button>
                ) : claimedQuestD ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono uppercase">LOCKED</span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive details */}
          <div className="border-t border-slate-900 pt-4 flex gap-1.5 items-center text-[10px] text-slate-500 leading-normal font-mono">
            <CircleAlert className="h-4 w-4 stroke-slate-500 shrink-0" />
            <span>Complete actions under corresponding tabs first (Learning Hub, Gathering Passes, Showroom uploads), then return here to claim locked XP targets.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
