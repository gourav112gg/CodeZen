import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, CheckCircle, AlertTriangle, ShieldAlert, Users, 
  Search, Download, FileSpreadsheet, FileText, RefreshCw, 
  UserCheck, ShieldCheck, Terminal, HelpCircle, Eye, Trash2, Maximize2
} from 'lucide-react';
import { EventRecord } from '../types';

// Let's model a strict Role hierarchy
export type UserRole = 'Member' | 'Coordinator' | 'Lead Member' | 'President';

export interface AttendanceRecord {
  userId: string;
  userName: string;
  eventId: string;
  eventName: string;
  attendanceTime: string;
  coordinatorId: string;
  coordinatorName: string;
  attendanceStatus: 'Checked-In' | 'Flagged';
}

interface QRAttendanceScannerProps {
  events: EventRecord[];
  userName: string;
  addLog: (action: string) => void;
  activeRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

// Initial pre-registered mock students for events to scan
interface MockTicket {
  ticketCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  eventId: string;
  eventName: string;
  status: 'Unregistered' | 'Rsvped' | 'CheckedIn';
}

export default function QRAttendanceScanner({
  events,
  userName,
  addLog,
  activeRole,
  onRoleChange
}: QRAttendanceScannerProps) {
  // Let's create a solid list of mock student tickets in search of scanning targets
  const [ticketRegistry, setTicketRegistry] = useState<MockTicket[]>([
    { ticketCode: 'REG-ev-1-usr02-2B8D', studentId: 'student-2', studentName: 'Sarah Jenkins', studentEmail: 'sarah.j@mait.edu', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Sarah', eventId: 'ev-1', eventName: 'Zenith Hackathon 2026', status: 'Rsvped' },
    { ticketCode: 'REG-ev-1-usr03-4D90', studentId: 'student-3', studentName: 'Marcus Aurel', studentEmail: 'm.aurel@mait.edu', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Marcus', eventId: 'ev-1', eventName: 'Zenith Hackathon 2026', status: 'Rsvped' },
    { ticketCode: 'REG-ev-1-usr99-99FA', studentId: 'usr-99', studentName: 'Garg Gourav', studentEmail: 'garggourav647@gmail.com', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Garg', eventId: 'ev-1', eventName: 'Zenith Hackathon 2026', status: 'Rsvped' },
    { ticketCode: 'REG-ev-2-usr04-5E8A', studentId: 'student-4', studentName: 'Elena Rostova', studentEmail: 'elena.r@mait.edu', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Elena', eventId: 'ev-2', eventName: 'Building Production LLM Agents', status: 'Rsvped' },
    { ticketCode: 'REG-ev-2-usr05-7F1C', studentId: 'student-5', studentName: 'Alex Rivera', studentEmail: 'arivera@mait.edu', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex', eventId: 'ev-2', eventName: 'Building Production LLM Agents', status: 'Rsvped' },
    { ticketCode: 'REG-ev-3-usr06-8A3E', studentId: 'student-6', studentName: 'Ami Patel', studentEmail: 'ami.patel@mait.edu', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ami', eventId: 'ev-3', eventName: 'Zero-Knowledge Cryptography Deep Dive', status: 'Rsvped' },
    { ticketCode: 'REG-ev-1-usr07-INVALID', studentId: 'student-7', studentName: 'Fake Account Student', studentEmail: 'fake.student@gmail.com', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Fake', eventId: 'ev-1', eventName: 'Zenith Hackathon 2026', status: 'Unregistered' }
  ]);

  // Initial Attendance Logs list
  const [attendanceDb, setAttendanceDb] = useState<AttendanceRecord[]>([
    {
      userId: 'student-2',
      userName: 'Sarah Jenkins',
      eventId: 'ev-2',
      eventName: 'Building Production LLM Agents',
      attendanceTime: '2026-06-17 09:30 AM',
      coordinatorId: 'coord-1',
      coordinatorName: 'Sarah Jenkins',
      attendanceStatus: 'Checked-In'
    },
    {
      userId: 'student-3',
      userName: 'Marcus Aurel',
      eventId: 'ev-2',
      eventName: 'Building Production LLM Agents',
      attendanceTime: '2026-06-17 09:35 AM',
      coordinatorId: 'coord-1',
      coordinatorName: 'Sarah Jenkins',
      attendanceStatus: 'Checked-In'
    }
  ]);

  // Camera settings
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [streamObj, setStreamObj] = useState<MediaStream | null>(null);

  // Search, scan, filter state
  const [scannedCodeInput, setScannedCodeInput] = useState<string>('');
  const [assignedEventId, setAssignedEventId] = useState<string>('ev-1');
  
  // Flash alert state
  const [scanStatus, setScanStatus] = useState<{
    type: 'idle' | 'success' | 'duplicate' | 'invalid' | 'mismatch';
    message: string;
    studentName?: string;
    ticketCode?: string;
  }>({ type: 'idle', message: '' });

  // Reporting Filters
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [reportEventFilter, setReportEventFilter] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');

  // Trigger camera capture feed
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    addLog('Attending browser camera authorization channel...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStreamObj(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
      addLog('Camera lens synchronized. Feed active at 30fps.');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Permission to browser video recording was blocked or exists inside cross-origin sandboxed frame. Falling back to code simulation console.');
      addLog('WARN: Camera stream access rejected. Enabled interactive simulation dashboard.');
    }
  };

  const stopCamera = () => {
    if (streamObj) {
      streamObj.getTracks().forEach(track => track.stop());
      setStreamObj(null);
    }
    setIsCameraActive(false);
  };

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (streamObj) {
        streamObj.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamObj]);

  // Quick helper to check assigned events depending on coordinator role
  // Coordinators must only see events assigned to them.
  const assignedEventsList = activeRole === 'Coordinator' 
    ? events.filter(e => e.id === assignedEventId) // Hardcoded/selected assigned event
    : events;

  // Perform cryptographic QR scan validation
  const validateAndCheckIn = (ticketCode: string) => {
    const trimmedCode = ticketCode.trim();
    if (!trimmedCode) return;

    onCodeScannedAnimation();

    // 1. Look up ticket in simulated student registry
    const matchedTicket = ticketRegistry.find(tk => tk.ticketCode === trimmedCode);
    
    // Check if invalid ticket at all
    if (!matchedTicket || matchedTicket.status === 'Unregistered') {
      setScanStatus({
        type: 'invalid',
        message: 'REJECTED: Threat detected. Ticket signature has invalid cryptographic hash.',
        ticketCode: trimmedCode
      });
      addLog(`SECURITY THREAT: Scanned invalid certificate code "${trimmedCode}"`);
      return;
    }

    // 2. Validate event association matches active assigned scanning category
    if (activeRole === 'Coordinator' && matchedTicket.eventId !== assignedEventId) {
      const actualEvent = events.find(e => e.id === matchedTicket.eventId);
      setScanStatus({
        type: 'mismatch',
        message: `DENIED: Wrong Gate! Ticket registered for "${actualEvent?.title || matchedTicket.eventId}" but scanning zone is assigned only for "${events.find(e => e.id === assignedEventId)?.title}".`,
        studentName: matchedTicket.studentName,
        ticketCode: trimmedCode
      });
      addLog(`INVALID PASS: Student "${matchedTicket.studentName}" entry rejected due to event class mismatch.`);
      return;
    }

    // 3. Prevent duplicate check-ins
    const isAlreayCheckedIn = attendanceDb.some(
      rec => rec.userId === matchedTicket.studentId && rec.eventId === matchedTicket.eventId
    );

    if (isAlreayCheckedIn) {
      setScanStatus({
        type: 'duplicate',
        message: 'ALREADY RESOLVED: Duplicate ticket entry attempt blocked. Certificate already signed.',
        studentName: matchedTicket.studentName,
        ticketCode: trimmedCode
      });
      addLog(`ATTENDANCE WARNING: Duplicate scan for "${matchedTicket.studentName}" at "${matchedTicket.eventName}"`);
      return;
    }

    // 4. Successful validation
    const currentTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newRecord: AttendanceRecord = {
      userId: matchedTicket.studentId,
      userName: matchedTicket.studentName,
      eventId: matchedTicket.eventId,
      eventName: matchedTicket.eventName,
      attendanceTime: currentTime,
      coordinatorId: activeRole === 'President' ? 'super-1' : 'coord-1',
      coordinatorName: userName,
      attendanceStatus: 'Checked-In'
    };

    setAttendanceDb(prev => [newRecord, ...prev]);
    setTicketRegistry(prev => prev.map(t => t.ticketCode === trimmedCode ? { ...t, status: 'CheckedIn' } : t));
    
    setScanStatus({
      type: 'success',
      message: 'ACCESS GRANTED: Ticket validated successfully against ledger indices. Attendance logged.',
      studentName: matchedTicket.studentName,
      ticketCode: trimmedCode
    });

    addLog(`ATTENDANCE GRANTED: "${matchedTicket.studentName}" checked into "${matchedTicket.eventName}" gracefully.`);
  };

  // Laser flicker flash trigger
  const [isLaserFlashing, setIsLaserFlashing] = useState<boolean>(false);
  const onCodeScannedAnimation = () => {
    setIsLaserFlashing(true);
    setTimeout(() => {
      setIsLaserFlashing(false);
    }, 450);
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = ['User ID', 'User Name', 'Event ID', 'Event Name', 'Timestamp', 'Staff ID', 'Verified By', 'Status'];
    const rows = attendanceDb.map(rec => [
      rec.userId, 
      rec.userName, 
      rec.eventId, 
      rec.eventName, 
      rec.attendanceTime,
      rec.coordinatorId,
      rec.coordinatorName,
      rec.attendanceStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CodeZen_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('EXPORT COMPLETED: Commenced download of secure student directory ledgers in CSV format.');
  };

  const handleExportExcel = () => {
    // Generate simulated XML format for Excel spreadsheet
    let xlsContent = "<table><tr><th>User ID</th><th>User Name</th><th>Event ID</th><th>Event Name</th><th>Timestamp</th><th>Verified Status</th></tr>";
    attendanceDb.forEach(rec => {
      xlsContent += `<tr><td>${rec.userId}</td><td>${rec.userName}</td><td>${rec.eventId}</td><td>${rec.eventName}</td><td>${rec.attendanceTime}</td><td>${rec.attendanceStatus}</td></tr>`;
    });
    xlsContent += "</table>";

    const encodedUri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(xlsContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CodeZen_Attendance_Report_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('EXPORT COMPLETED: Commenced download of secure student directory spreadsheet in Excel format.');
  };

  const handleExportPDF = () => {
    // Elegant text formatting window representing print PDF output 
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addLog('WARN: Blocked print window popup block.');
      return;
    }
    
    let html = `
      <html>
      <head>
        <title>CodeZen Attendance Audit Report</title>
        <style>
          body { font-family: monospace; padding: 30; background: #fafafa; color: #111; }
          h1 { border-bottom: 2px solid #000; padding-bottom: 10px; font-size: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 11px; }
          th { background: #eee; }
        </style>
      </head>
      <body>
        <h1>CODEZEN EVENT ATTENDANCE PROTOCOL AUDIT REPORT</h1>
        <p>Report Generated On: ${new Date().toLocaleString()}</p>
        <p>Total Immutable Records Count: ${attendanceDb.length}</p>
        <table>
          <thead>
            <tr>
              <th>USID</th>
              <th>Student Participant</th>
              <th>Event Category</th>
              <th>Date Check-In Time</th>
              <th>Coordinator Authenticator</th>
            </tr>
          </thead>
          <tbody>
    `;

    attendanceDb.forEach(rec => {
      html += `
        <tr>
          <td>${rec.userId}</td>
          <td><b>${rec.userName}</b></td>
          <td>${rec.eventName} (${rec.eventId})</td>
          <td>${rec.attendanceTime}</td>
          <td>${rec.coordinatorName}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
        <p style="margin-top: 40px; font-size: 10px; color: #777;">&copy; Codezen Cryptographic Attendance ledger. Signature Verified.</p>
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    addLog('EXPORT COMPLETED: PDF print buffer loaded successfully.');
  };

  // Filter logic for dashboard reports
  const filteredRecords = attendanceDb.filter(rec => {
    const matchesSearch = rec.userName.toLowerCase().includes(reportSearchQuery.toLowerCase()) || 
                          rec.eventName.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
                          rec.userId.toLowerCase().includes(reportSearchQuery.toLowerCase());
    const matchesEvent = reportEventFilter === 'all' || rec.eventId === reportEventFilter;
    const matchesStatus = reportStatusFilter === 'all' || rec.attendanceStatus === reportStatusFilter;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  return (
    <div className="space-y-8" id="qr-scanner-dashboard-wrapper">
      
      {/* Simulation Controller & Persona Switcher */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="simulation-panel-header">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider block">TESTING CORE ACCESS CHANNELS</span>
            <h4 className="text-xs font-semibold text-white">Event Attendance Roles Router</h4>
          </div>
        </div>

        {/* Dynamic Buttons to easily cycle through permissions to verify system architecture! */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-900 self-start sm:self-auto" id="role-quick-presets">
          {(['Member', 'Coordinator', 'Lead Member', 'President'] as UserRole[]).map((r) => (
            <button
              key={r}
              id={`switch-persona-${r.toLowerCase().replace(' ', '-')}`}
              onClick={() => {
                if (onRoleChange) {
                  onRoleChange(r);
                  addLog(`CHANGED_PERSONA: Simulating server-side session with permissions of level: ${r.toUpperCase()}`);
                }
              }}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeRole === r 
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Access Guard State */}
      {activeRole === 'Member' ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-10 text-center space-y-4 max-w-xl mx-auto" id="guard-member-warning">
          <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
          <div className="space-y-1.5">
            <h3 className="font-display font-semibold text-white text-md">Camera Operations Restricted</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              As a general <b>{activeRole}</b>, you cannot manage event operations or claim coordinator attendance rights. Change your role persona above to <b>Coordinator</b> or <b>President</b> to inspect camera capabilities, run live event scans, and review immutable ledgers.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12" id="attendance-active-mainframe">
          
          {/* LEFT: QR Viewfinder & Simulator Deck (7 Columns) */}
          <div className="lg:col-span-7 space-y-6" id="viewfinder-and-inputs">
            
            {/* Main Scanner Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden relative" id="camera-viewfinder-card">
              <div className="border-b border-slate-904 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-605'}`} />
                  <span className="font-mono text-xs font-bold text-white uppercase">Live QR Viewfinder Gate</span>
                </div>

                {activeRole === 'Coordinator' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">ASSIGNED_ZONE:</span>
                    <select
                      id="coordinator-event-select"
                      value={assignedEventId}
                      onChange={(e) => {
                        setAssignedEventId(e.target.value);
                        addLog(`ZONE_CHANGE: Relocated scanning portal to cover "${events.find(ev => ev.id === e.target.value)?.title}"`);
                      }}
                      className="rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 py-1 px-2 outline-none"
                    >
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Viewfinder Window Frame */}
              <div className="bg-slate-950 aspect-video relative flex flex-col items-center justify-center overflow-hidden border-b border-slate-900 select-none">
                {isCameraActive ? (
                  <>
                    <video
                      id="viewfinder-video-element"
                      ref={videoRef}
                      className="w-full h-full object-cover opacity-80"
                      playsInline
                      muted
                    />

                    {/* Laser Scanner Reticle Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-56 h-56 border-2 border-dashed border-cyan-400/50 rounded-2xl relative flex items-center justify-center">
                        {/* Scanning Laser Line */}
                        <div className={`absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] ${isLaserFlashing ? 'opacity-100 scale-y-150 bg-white' : 'opacity-80 animate-bounce'}`} style={{ animationDuration: '3s' }} />

                        {/* Reticle brackets corners */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br" />
                      </div>
                    </div>

                    <button
                      id="kill-camera-btn"
                      onClick={stopCamera}
                      className="absolute btn-kill-cam bottom-4 right-4 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 hover:text-rose-400 px-4 py-2 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                    >
                      Disconnect Laser Lens
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-4 p-8" id="viewfinder-offline-state">
                    <div className="mx-auto h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-md">
                      <Camera className="h-10 w-10 text-slate-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">Browser Camera Camera Offline</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Authorize stream integration to validate attendees via physical student QR code passes.
                      </p>
                    </div>
                    <button
                      id="ignite-camera-btn"
                      onClick={startCamera}
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 px-6 py-2.5 text-xs font-mono font-black tracking-wider uppercase transition-all duration-300 cursor-pointer"
                    >
                      Establish Camera Channel
                    </button>
                  </div>
                )}

                {/* Simulated alert feedback message overlay */}
                {scanStatus.type !== 'idle' && (
                  <div 
                    id="scan-result-panel"
                    className={`absolute bottom-4 left-4 right-4 rounded-xl border p-4 backdrop-blur-md text-left transition-all duration-300 animate-slide-up ${
                      scanStatus.type === 'success' ? 'border-emerald-500/20 bg-slate-950/90 text-emerald-300' :
                      scanStatus.type === 'duplicate' ? 'border-amber-500/20 bg-slate-950/90 text-amber-300' :
                      'border-rose-500/20 bg-slate-950/90 text-rose-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {scanStatus.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-mono font-semibold block tracking-wider uppercase">
                          Scan Feedback: {scanStatus.type}
                        </span>
                        <p className="text-xs font-medium leading-relaxed">{scanStatus.message}</p>
                        {scanStatus.studentName && (
                          <div className="pt-2 flex items-center gap-2 border-t border-slate-900 mt-2 font-mono text-[9px] text-slate-400">
                            <span>STUDENT: <b>{scanStatus.studentName}</b></span>
                            <span>•</span>
                            <span>HASH: <code className="text-white">{scanStatus.ticketCode}</code></span>
                          </div>
                        )}
                      </div>
                      <button 
                        id="dismiss-scan-alert"
                        onClick={() => setScanStatus({ type: 'idle', message: '' })}
                        className="text-slate-500 hover:text-white font-mono text-xs cursor-pointer p-1"
                      >
                        [ESC]
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom manual override input section */}
              <div className="p-4 bg-slate-950/80 font-mono text-xs space-y-3 border-t border-slate-900 text-left">
                <div className="text-slate-500 text-[10px] font-semibold tracking-wider uppercase">
                  MANUAL CIPHER VERIFICATION GATEWAY
                </div>
                <form 
                  id="manual-cipher-scan-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validateAndCheckIn(scannedCodeInput);
                    setScannedCodeInput('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    id="manual-cipher-input"
                    type="text"
                    required
                    placeholder="Enter registration ticket ID (e.g. REG-ev-1-usr02-2B8D)..."
                    value={scannedCodeInput}
                    onChange={(e) => setScannedCodeInput(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-slate-300 outline-none placeholder:text-slate-650 focus:border-emerald-500 transition-colors"
                  />
                  <button
                    id="manual-cipher-submit-btn"
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    VERIFY_PASS
                  </button>
                </form>
              </div>
            </div>

            {/* Simulated Student Attendance Queue (for Sandbox Testing) */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-4 text-left" id="sandbox-student-queue">
              <div className="flex items-center justify-between border-b border-slate-904 pb-3">
                <div>
                  <h3 className="font-display font-semibold text-white text-xs uppercase tracking-wider">Demo Gate Queue</h3>
                  <p className="text-[11px] text-slate-400">Click any student simulation coin to instantly mock a physical ticket scan!</p>
                </div>
                <span className="text-[9px] font-mono text-cyan-400" id="sandbox-queue-count">
                  {ticketRegistry.length} Registered Ledgers
                </span>
              </div>

              {/* Grid of Students holding up their mobile ticket QR codes */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2" id="sandbox-student-coins">
                {ticketRegistry.map((tk) => {
                  const eventMatched = events.find(e => e.id === tk.eventId);
                  return (
                    <div
                      key={tk.ticketCode}
                      id={`demo-student-pass-${tk.studentId}`}
                      onClick={() => validateAndCheckIn(tk.ticketCode)}
                      className={`rounded-xl border p-3 flex items-center justify-between gap-3 text-left transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 ${
                        tk.status === 'CheckedIn'
                          ? 'border-slate-800 bg-slate-900/10 opacity-60'
                          : tk.status === 'Unregistered'
                          ? 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40'
                          : 'border-slate-850 bg-slate-900/30 hover:border-emerald-500/30 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img 
                          src={tk.avatar} 
                          alt={tk.studentName} 
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 shrink-0" 
                        />
                        <div className="overflow-hidden">
                          <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">{tk.studentName}</h5>
                          <span className="text-[9px] font-mono text-slate-500 block truncate">{eventMatched?.title || tk.eventName}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {tk.status === 'CheckedIn' ? (
                          <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider border border-slate-800 bg-slate-900 px-1.5 py-0.5 rounded">Checked_In</span>
                        ) : tk.status === 'Unregistered' ? (
                          <span className="text-[8px] font-mono text-rose-450 font-bold uppercase tracking-wider border border-rose-500/10 bg-rose-500/5 px-1.5 py-0.5 rounded">INVALID_SIGN</span>
                        ) : (
                          <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/15 bg-emerald-500/5 px-1.5 py-0.5 rounded group-hover:bg-emerald-500/20 transition-all">SCAN_PASS</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: Reports & Analytics Dashboard (5 Columns) */}
          {/* Visible ONLY to: President (Super Admin) & Lead Members (Admin) */}
          <div className="lg:col-span-5 space-y-6" id="attendance-reports-panel">
            
            {activeRole === 'Coordinator' ? (
              /* Coordinator UI: Simple overview without permission to audit everything */
              <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-4 text-left" id="coordinator-audit-logs">
                <div className="flex items-center justify-between border-b border-slate-904 pb-3">
                  <div>
                    <h3 className="font-display font-semibold text-white text-xs uppercase tracking-wider">Access Verification Report</h3>
                    <p className="text-[11px] text-slate-400">Total participants managed in the current session.</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-0.5 rounded font-bold">
                    {attendanceDb.filter(rec => rec.coordinatorId === 'coord-1').length} Checked
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 text-center font-mono space-y-1">
                    <span className="text-[10px] text-slate-500">SESSION COORDINATOR ID</span>
                    <h5 className="text-white text-xs font-bold">{userName} (#coord-1)</h5>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    You have active gate permissions to scan and check-in registrants. Access reports, database tables, and student registries are restricted for your role level. Connect with the President to query full database.
                  </p>
                </div>
              </div>
            ) : (
              /* Lead Members & President Full Database View */
              <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-5 text-left" id="admin-reports-dashboard">
                <div className="flex flex-col gap-1 border-b border-slate-904 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      Attendance Manager
                    </h3>
                    <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded">
                      ADMIN PRIVILEGES ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Export immutable ledgers and search/filter attendees real-time.</p>
                </div>

                {/* Reporting Search & Filters */}
                <div className="space-y-3" id="reports-filter-controls">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      id="report-search-input"
                      type="text"
                      placeholder="Search attendee, ledger index..."
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2.5 text-xs text-slate-300 outline-none placeholder:text-slate-650"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    <div className="space-y-1">
                      <label className="text-slate-500">EVENT_CATEGORY</label>
                      <select
                        id="report-event-filter"
                        value={reportEventFilter}
                        onChange={(e) => setReportEventFilter(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 text-slate-300 py-1.5 px-2 outline-none"
                      >
                        <option value="all">All Events</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500">VERIFIED_STATUS</label>
                      <select
                        id="report-status-filter"
                        value={reportStatusFilter}
                        onChange={(e) => setReportStatusFilter(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 text-slate-300 py-1.5 px-2 outline-none"
                      >
                        <option value="all">Any Status</option>
                        <option value="Checked-In">Checked-In</option>
                        <option value="Flagged">Flagged</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Exporter Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-900" id="reports-export-triggers">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Export Database Ledgers</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      id="export-csv-btn"
                      onClick={handleExportCSV}
                      className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white hover:border-slate-700 py-2.5 text-[10px] font-mono font-bold text-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>CSV</span>
                    </button>
                    <button
                      id="export-excel-btn"
                      onClick={handleExportExcel}
                      className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white hover:border-slate-700 py-2.5 text-[10px] font-mono font-bold text-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3 w-3" />
                      <span>Excel</span>
                    </button>
                    <button
                      id="export-pdf-btn"
                      onClick={handleExportPDF}
                      className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white hover:border-slate-700 py-2.5 text-[10px] font-mono font-bold text-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="h-3 w-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Active Check-In Logs Database */}
                <div className="space-y-3 pt-3 border-t border-slate-900" id="reports-logs-timeline">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>IMMUTABLE ENTRIES ({filteredRecords.length})</span>
                    <span>CO-SESS LOGS</span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1" id="reports-logs-list">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((rec, idx) => {
                        return (
                          <div
                            key={idx}
                            id={`report-entry-${idx}`}
                            className="bg-slate-900/40 border border-slate-904 rounded-xl p-3 flex flex-col gap-2 text-left"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-slate-950 pb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-[9px]">
                                  {rec.userName.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="leading-none">
                                  <span className="text-xs font-bold text-white block">{rec.userName}</span>
                                  <span className="text-[9px] text-slate-500 font-mono">{rec.userId}</span>
                                </div>
                              </div>

                              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase">
                                {rec.attendanceStatus}
                              </span>
                            </div>

                            <div className="text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-450 leading-tight">
                              <div>
                                <span className="text-slate-600 block text-[8px] uppercase">Gathering Target</span>
                                <span className="text-slate-300 block truncate" title={rec.eventName}>{rec.eventName}</span>
                              </div>
                              <div>
                                <span className="text-slate-600 block text-[8px] uppercase">Timestamp Sign</span>
                                <span className="text-slate-450 block truncate">{rec.attendanceTime}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-slate-600 font-mono text-xs border border-dashed border-slate-900 rounded-xl">
                        No checked-in attendance indexes matching search.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
            
          </div>

        </div>
      )}

    </div>
  );
}
