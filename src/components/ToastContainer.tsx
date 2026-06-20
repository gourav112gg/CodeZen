import React, { useEffect } from 'react';
import { 
  Trophy, Sparkles, BookOpen, Calendar, Flame, 
  User, Award, CheckCircle2, Rocket, Bell, Terminal, 
  X, HelpCircle, Star, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Web Audio API Synthesizer for high-tech micro-audio alerts
class ToastAudioSynth {
  static context: AudioContext | null = null;

  static init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static playChime(type: 'achievement' | 'badge' | 'quest' | 'level' | 'info') {
    this.init();
    if (!this.context) return;
    try {
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      
      const ctx = this.context;
      const now = ctx.currentTime;

      if (type === 'level') {
        // Grand fanfare arpeggio (C major pentatonic leading upwards)
        const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          
          gain.gain.setValueAtTime(0.15, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.002, now + idx * 0.05 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.35);
        });
      } else if (type === 'achievement' || type === 'badge') {
        // Melodic success sound
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          
          gain.gain.setValueAtTime(0.12, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.06 + 0.2);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } else if (type === 'quest') {
        // Warm double-tone alert
        const freqs = [440.00, 554.37]; // A4, C#5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          
          gain.gain.setValueAtTime(0.1, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.004, now + idx * 0.08 + 0.15);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.2);
        });
      } else {
        // Soft click chime for generic info
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (_) {}
  }
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'achievement' | 'badge' | 'quest' | 'level' | 'info';
  xp?: number;
  icon?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  // Trigger sound effect on newly added toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const newest = toasts[toasts.length - 1];
      ToastAudioSynth.playChime(newest.type);
    }
  }, [toasts.length]);

  return (
    <div 
      id="toast-notifications-hub" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 font-sans w-full max-w-sm px-4 sm:px-0 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isAchievement = toast.type === 'achievement' || toast.type === 'badge';
          const isLevel = toast.type === 'level';
          const isQuest = toast.type === 'quest';

          // Select glowing borders and colors based on types
          let cardBorder = "border-slate-800 bg-slate-950/95";
          let iconWrapperClass = "bg-slate-900 border-slate-800 text-slate-400";
          
          if (isLevel) {
            cardBorder = "border-amber-400/50 bg-slate-950/95 shadow-[0_0_20px_rgba(245,158,11,0.15)]";
            iconWrapperClass = "bg-amber-500/15 border-amber-400/30 text-amber-400";
          } else if (isAchievement) {
            cardBorder = "border-emerald-500/50 bg-slate-950/95 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
            iconWrapperClass = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
          } else if (isQuest) {
            cardBorder = "border-cyan-500/50 bg-slate-950/95 shadow-[0_0_15px_rgba(6,182,212,0.12)]";
            iconWrapperClass = "bg-cyan-500/15 border-cyan-500/30 text-cyan-400";
          }

          return (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className={`pointer-events-auto rounded-2xl border p-4.5 flex gap-3.5 relative overflow-hidden backdrop-blur-md ${cardBorder}`}
              id={`toast-card-${toast.id}`}
            >
              {/* Subtle visual pulse aura background */}
              {(isAchievement || isLevel) && (
                <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none ${
                  isLevel ? 'bg-amber-400' : 'bg-emerald-500'
                }`} />
              )}

              {/* Dynamic Icon render lookup */}
              <div className={`rounded-xl p-2.5 h-fit shrink-0 border relative ${iconWrapperClass}`}>
                {toast.icon === 'User' && <User className="h-5 w-5" />}
                {toast.icon === 'CheckSquare' && <BookOpen className="h-5 w-5" />}
                {toast.icon === 'Calendar' && <Calendar className="h-5 w-5" />}
                {toast.icon === 'Heart' && <Heart className="h-5 w-5" />}
                {toast.icon === 'Award' && <Award className="h-5 w-5 animate-bounce" style={{ animationDuration: '3s' }} />}
                {toast.icon === 'Flame' && <Flame className="h-5 w-5 animate-pulse" />}
                {toast.icon === 'Rocket' && <Rocket className="h-5 w-5" />}
                {toast.icon === 'Trophy' && <Trophy className="h-5 w-5 animate-wiggle" />}
                {!toast.icon && (
                  isLevel ? <Rocket className="h-5 w-5" /> :
                  isAchievement ? <Trophy className="h-5 w-5 animate-float" /> :
                  isQuest ? <Flame className="h-5 w-5 decorate-pulse" /> :
                  <Bell className="h-5 w-5" />
                )}
              </div>

              {/* Toast Text Block */}
              <div className="flex-1 min-w-0 pr-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase block opacity-60">
                    {isLevel ? "LEVEL UPPROMOTED" : 
                     isAchievement ? "ACHIEVEMENT EARNED" : 
                     isQuest ? "QUEST COMPLETION" : "SYSTEM WARNING"}
                  </span>
                  
                  {toast.xp && (
                    <span className="rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 animate-pulse">
                      +{toast.xp} XP
                    </span>
                  )}
                </div>

                <h4 className="font-display font-semibold text-sm text-white mt-1 leading-snug">
                  {toast.title}
                </h4>
                
                <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              </div>

              {/* Close Button */}
              <button
                id={`toast-dismiss-${toast.id}`}
                onClick={() => onDismiss(toast.id)}
                className="absolute top-3.5 right-3.5 text-slate-500 hover:text-white transition-colors cursor-pointer rounded-lg p-1 hover:bg-slate-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
