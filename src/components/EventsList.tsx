import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Users, User, ArrowRight, 
  Search, Check, CreditCard, Sparkles, AlertCircle, RefreshCw,
  Camera, UserCheck, ShieldCheck, QrCode, Copy
} from 'lucide-react';
import { EventRecord } from '../types';
import { EventsListSkeleton } from './SkeletonLoader';
import QRAttendanceScanner, { UserRole } from './QRAttendanceScanner';

interface EventsListProps {
  events: EventRecord[];
  userName: string;
  onRsvpToggle: (eventId: string) => void;
  onAddLog: (action: string) => void;
}

export default function EventsList({ 
  events, 
  userName, 
  onRsvpToggle,
  onAddLog
}: EventsListProps) {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'scanner'>('directory');
  const [activeRole, setActiveRole] = useState<UserRole>('Member');
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleManualReload = () => {
    setIsLoading(true);
    setIsReloading(true);
    onAddLog('Requesting latest community scheduled gatherings update...');
    setTimeout(() => {
      setIsLoading(false);
      setIsReloading(false);
      onAddLog('Schedules successfully re-synced.');
    }, 800);
  };

  const [selectedType, setSelectedType] = useState<'all' | 'Hackathon' | 'Workshop' | 'Seminar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>('ev-1');

  const filteredEvents = events.filter(ev => {
    const matchesType = selectedType === 'all' || ev.type === selectedType;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const activeEventForTicket = events.find(e => e.id === activeTicketId);

  return isLoading ? (
    <EventsListSkeleton />
  ) : (
    <div className="space-y-6" id="events-tab-master-frame">
      {/* Sub-navigation Subtabs Selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-slate-900 pb-4" id="events-subnavigation-tabs-deck">
        <div className="flex gap-1.5 p-1 bg-slate-950 border border-slate-850 rounded-xl">
          <button
            id="events-subtab-directory"
            onClick={() => {
              setActiveSubTab('directory');
              onAddLog('Redirecting console tracker view to Scheduled Gatherings board');
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'directory' 
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Gatherings Directory
          </button>
          
          <button
            id="events-subtab-operations"
            onClick={() => {
              setActiveSubTab('scanner');
              onAddLog('Initiating QR Operations Gate Control Scanning matrix...');
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'scanner' 
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Camera className="h-4 w-4" />
            QR Attendance Scanner
          </button>
        </div>

        {activeSubTab === 'directory' && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-950/40 border border-slate-900/80 px-3 py-1.5 rounded-lg select-none">
            <span className="text-slate-600 block text-[9.5px]">OPERATING_AS:</span>
            <span className="text-emerald-450 font-black font-mono tracking-wider">{activeRole.toUpperCase()}</span>
          </div>
        )}
      </div>

      {activeSubTab === 'scanner' ? (
        <QRAttendanceScanner 
          events={events}
          userName={userName}
          addLog={onAddLog}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
        />
      ) : (
        <div id="events-manager-root" className="grid gap-8 lg:grid-cols-12 py-2">
      {/* Event Listings - Left Col */}
      <div id="events-list-column" className="lg:col-span-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-400" />
              Scheduled Gatherings
            </h2>
            <p className="text-sm text-slate-400">Join immersive workshops, tech sprints, and connect with peer mentors.</p>
          </div>
          <button
            id="reload-events-btn"
            onClick={handleManualReload}
            disabled={isReloading}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isReloading ? 'animate-spin' : ''}`} />
            Reload Grid
          </button>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center" id="events-filters-bar">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="search-event-input"
              type="text"
              placeholder="Search events, topics, speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-300 outline-none placeholder:text-slate-600 focus:border-slate-800"
            />
          </div>

          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-900" id="events-type-filters">
            {['all', 'Hackathon', 'Workshop', 'Seminar'].map((type) => (
              <button
                key={type}
                id={`event-type-filter-${type}`}
                onClick={() => setSelectedType(type as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedType === type ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="space-y-4" id="events-cards-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(ev => (
              <div
                key={ev.id}
                id={`event-card-${ev.id}`}
                onClick={() => setActiveTicketId(ev.id)}
                className={`group rounded-2xl border p-5 transition-all text-left overflow-hidden relative flex flex-col md:flex-row gap-5 cursor-pointer ${activeTicketId === ev.id ? 'border-emerald-500 bg-slate-900/40' : 'border-slate-850 bg-slate-900/10 hover:border-slate-705/80'}`}
              >
                {/* Event Photo Cover */}
                <div className="w-full md:w-36 h-28 shrink-0 rounded-xl overflow-hidden border border-slate-800/40 relative">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                    {ev.type}
                  </div>
                </div>

                {/* Event text details */}
                <div className="flex-1 space-y-2.5">
                  <div>
                    <h3 className="font-display font-bold text-white text-md group-hover:text-emerald-400 transition-colors">{ev.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {ev.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 max-w-[140px] truncate">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {ev.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">{ev.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                      <Users className="h-3.5 w-3.5 text-slate-600" />
                      <span>{ev.rsvpCount} members verified</span>
                    </div>

                    <button
                      id={`rsvp-toggle-btn-${ev.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRsvpToggle(ev.id);
                        onAddLog(`${ev.isRsvpMe ? 'Cancelled' : 'RSVPed to'} "${ev.title}"`);
                      }}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${ev.isRsvpMe ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-600'}`}
                    >
                      {ev.isRsvpMe ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          RSVP Verified
                        </>
                      ) : (
                        'Claim Access Pass'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-850 p-12 text-center text-slate-500" id="events-empty-state">
              <AlertCircle className="h-8 w-8 mx-auto text-slate-600 mb-2" />
              <span>No gathering matches your active criteria search.</span>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Wallet Pass - Right Col */}
      <div id="virtual-wallet-ticket-column" className="lg:col-span-5 space-y-4">
        <div className="sticky top-4">
          <div className="mb-3">
            <h3 className="font-display font-medium text-xs uppercase tracking-wider text-slate-500">Member Space Ticket</h3>
            <p className="text-xs text-slate-400">Select any event to load your cryptographic entry badge.</p>
          </div>

          {activeEventForTicket ? (
            <div 
              id="wallet-developer-pass-display"
              className="rounded-3xl border border-slate-850 bg-slate-950 p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Holographic glowing lines */}
              <div className="absolute top-0 right-0 -z-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 -z-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

              {/* Holographic dashed borders */}
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-dashed border-slate-800/80 rounded-2xl pointer-events-none" />

              {/* Wallet Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-900 relative">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-display font-black text-sm tracking-widest text-white">CODEZEN</span>
                </div>
                <div className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[8px] font-mono text-cyan-400 border border-cyan-500/10 tracking-widest uppercase">
                  pass id: #{activeEventForTicket.id.toUpperCase()}-X9
                </div>
              </div>

              {/* Wallet Body ticket details */}
              <div className="py-6 space-y-6 relative">
                {/* Event Title */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Gathering Subject</span>
                  <h4 className="font-display font-bold text-lg text-white mt-1 leading-snug">{activeEventForTicket.title}</h4>
                </div>

                {/* Date & Location Columns */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900 py-4 font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase">Schedule Date</span>
                    <span className="text-slate-300 font-medium block mt-1">{activeEventForTicket.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase">Entrance Zone</span>
                    <span className="text-slate-300 font-medium block mt-1 overflow-hidden text-ellipsis whitespace-nowrap">{activeEventForTicket.location.split('/')[0]}</span>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-xs">
                      GG
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Verified Student Partner</span>
                      <span className="font-mono text-xs font-semibold text-white block">{userName}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Seat Ticket Status</span>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-mono mt-1 ${activeEventForTicket.isRsvpMe ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500'}`}>
                      {activeEventForTicket.isRsvpMe ? 'RESERVED' : 'UNRESERVED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Holographic divider simulation */}
              <div className="relative h-6 flex items-center justify-center">
                <div className="absolute left-0 h-4 w-4 bg-slate-950 -ml-8 rounded-full border-r border-slate-850" />
                <div className="absolute right-0 h-4 w-4 bg-slate-950 -mr-8 rounded-full border-l border-slate-850" />
                <div className="w-full border-t border-dashed border-slate-800" />
              </div>

              {/* QR Code / Cryptographic verification sector */}
              <div className="pt-4 flex flex-col items-center gap-4">
                {activeEventForTicket.isRsvpMe ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    {/* Simulated 2D QR Code Matrix Block */}
                    <div id="simulated-qrmatrix-box" className="p-3 bg-white rounded-xl shadow border border-slate-200 relative group cursor-pointer" title="Garg Gourav's secure entry QR Code token">
                      <div className="grid grid-cols-11 gap-px bg-white w-28 h-28">
                        {/* Generate a clean binary matrix mimicking a real QR Code */}
                        {[
                          [1,1,1,1,1,1,1,0,1,0,1],
                          [1,0,0,0,0,0,1,0,0,1,0],
                          [1,0,1,1,1,0,1,0,1,1,0],
                          [1,0,1,1,1,0,1,0,0,1,1],
                          [1,0,1,1,1,0,1,0,1,0,0],
                          [1,0,0,0,0,0,1,0,1,1,1],
                          [1,1,1,1,1,1,1,0,0,0,1],
                          [0,0,0,0,0,0,0,0,1,0,1],
                          [1,0,1,0,1,0,1,1,1,1,1],
                          [0,1,0,1,0,1,0,1,0,0,0],
                          [1,1,1,1,1,1,1,0,1,1,1],
                        ].flatMap((row, ri) => 
                          row.map((cell, ci) => {
                            // Render standard QR corner finder patterns
                            const isFinderPattern = 
                              (ri < 3 && ci < 3) || 
                              (ri < 3 && ci > 7) || 
                              (ri > 7 && ci < 3);
                            return (
                              <div 
                                key={`${ri}-${ci}`} 
                                className={`rounded-sm ${isFinderPattern || cell === 1 ? 'bg-slate-950' : 'bg-transparent'}`} 
                              />
                            );
                          })
                        )}
                      </div>
                      
                      {/* Interactive click helper */}
                      <div className="absolute inset-0 bg-slate-950/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-[10px] text-emerald-400 font-mono font-bold leading-tight">
                        <span>Click to load manual pass check-in copy</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Registration ID Token</span>
                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-full max-w-[240px] justify-between">
                        <code className="text-emerald-400 text-[10.5px] font-mono select-all">REG-{activeEventForTicket.id}-usr99-99FA</code>
                        <button
                          id="copy-pass-id-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(`REG-${activeEventForTicket.id}-usr99-99FA`);
                            onAddLog(`Copied registration ID: REG-${activeEventForTicket.id}-usr99-99FA to clipboard.`);
                          }}
                          className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
                          title="Copy token block"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 px-4 rounded-2xl border border-dashed border-slate-850 w-full text-center space-y-2">
                    <QrCode className="h-8 w-8 mx-auto text-slate-600 animate-pulse" />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">QR Ticket Locked</span>
                      <p className="text-[10px] text-slate-500 font-sans">Claim Access Pass first to reserve seat & generate verification matrix.</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500 border-t border-slate-900/60 pt-3.5 w-full justify-center">
                  <CreditCard className="h-3.5 w-3.5 text-slate-600" />
                  <span>Verify hash: SHA256//CZ-{activeEventForTicket.id.toUpperCase()}-STU99//AUTHX</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-8 text-center" id="ticket-neutral-state">
              <span className="text-sm text-slate-500 block">Please select an event gathering from the catalog directory.</span>
            </div>
          )}
        </div>
      </div>
    </div>
    )}
    </div>
  );
}
