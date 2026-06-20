import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Award, FileCheck, CheckCircle2, 
  HelpCircle, Copy, Check, Sparkles, Plus, RefreshCw, X 
} from 'lucide-react';
import { VerifiedCredential } from '../types';

interface CredentialVerifierProps {
  credentials: VerifiedCredential[];
  onAddCredential: (cred: VerifiedCredential) => void;
  onAddLog: (action: string) => void;
}

export default function CredentialVerifier({ 
  credentials, 
  onAddCredential,
  onAddLog
}: CredentialVerifierProps) {
  const [searchHash, setSearchHash] = useState('CZ-2026-AI-112A');
  const [activeCredential, setActiveCredential] = useState<VerifiedCredential | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Mock certificate creator states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState('Garg Gourav');
  const [newCourse, setNewCourse] = useState('Foundations of Neural Networks');
  const [newGrade, setNewGrade] = useState('A+ (99%)');
  const [newSkills, setNewSkills] = useState('Neural Networks, Weights and Biases, Activation Functions');

  const triggerVerificationSearch = (hashToQuery: string) => {
    setSearchAttempted(true);
    const found = credentials.find(c => c.hash.trim().toLowerCase() === hashToQuery.trim().toLowerCase());
    setActiveCredential(found || null);
    if (found) {
      onAddLog(`Verified credential ID "${hashToQuery}"`);
    } else {
      onAddLog(`Failed credential verification attempt on "${hashToQuery}"`);
    }
  };

  const handleCreateMockCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newCourse.trim()) return;

    // Generate random secure hash
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const customHash = `CZ-2026-MOCK-${randomHex}`;

    const newCred: VerifiedCredential = {
      hash: customHash,
      recipient: newRecipient,
      courseTitle: newCourse,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      grade: newGrade,
      skillsLearned: newSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      verifiedStatus: 'Verified'
    };

    onAddCredential(newCred);
    setSearchHash(customHash);
    setActiveCredential(newCred);
    setSearchAttempted(true);
    setShowAddForm(false);
    onAddLog(`Generated new credential "${customHash}"`);
  };

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div id="credential-verifier-root" className="grid gap-8 lg:grid-cols-12 py-2">
      {/* Search and Database Inventory panel - Left Col */}
      <div id="verifier-inventory-column" className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Verification Center
          </h2>
          <p className="text-sm text-slate-400">Cryptographically audit and authenticate student course accomplishments.</p>
        </div>

        {/* Audit query bar */}
        <div className="space-y-2" id="verifier-search-panel">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Registry Hash ID</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="search-credential-input"
                type="text"
                placeholder="Enter hash eg: CZ-2026-AI-112A"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-300 outline-none placeholder:text-slate-700 font-mono focus:border-slate-800"
              />
            </div>
            <button
              id="verification-audit-btn"
              onClick={() => triggerVerificationSearch(searchHash)}
              className="rounded-xl bg-emerald-500 px-5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Verify Audit
            </button>
          </div>
        </div>

        {/* Existing verified seeds directory */}
        <div className="space-y-3" id="verifier-directory">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Registry Databases</span>
            <button
              id="mock-certified-plus-btn"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Issue Demo Cert
            </button>
          </div>

          <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-4 space-y-3" id="verifier-seeds-list">
            <span className="text-[11px] text-slate-500 block font-sans">Click on any registry key below to load into the verifier scanner:</span>
            <div className="space-y-2">
              {credentials.map((cred, idx) => (
                <div
                  key={idx}
                  id={`seed-hash-row-${cred.hash}`}
                  onClick={() => {
                    setSearchHash(cred.hash);
                    triggerVerificationSearch(cred.hash);
                  }}
                  className="flex items-center justify-between rounded-lg border border-slate-900 bg-slate-950/60 p-2.5 text-xs hover:border-slate-800 hover:bg-slate-900/40 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-slate-300 text-[11px]">{cred.hash}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 tracking-tight">{cred.recipient.split(' ')[0]}</span>
                    <span className="rounded bg-emerald-400/5 border border-emerald-400/10 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400">
                      LIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Certificate Audit / Display Panel - Right Col */}
      <div id="verified-display-column" className="lg:col-span-7 space-y-4">
        {searchAttempted ? (
          activeCredential ? (
            <div className="space-y-4" id="verified-success-display-stage">
              {/* Authenticator Report wrapper */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between" id="verified-header-alert">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-full bg-emerald-400/20 p-2 text-emerald-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Cryptosecure Identity Confirmed</h4>
                    <p className="text-[11px] text-slate-400">Registry record verified successfully against community public keys.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    id="copy-credential-hash-btn"
                    onClick={() => handleCopyClipboard(activeCredential.hash)}
                    className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedHash === activeCredential.hash ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Luxury Certificate layout container */}
              <div 
                id="luxury-visual-certificate"
                className="rounded-3xl border-2 border-emerald-500/30 bg-slate-950 p-8 text-center relative overflow-hidden shadow-2xl"
              >
                {/* Embedded holographic certificate details */}
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-[80px]" />
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-[80px]" />

                {/* Classic Certificate Borders */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-slate-800 rounded-2xl pointer-events-none" />
                <div className="absolute top-5 left-5 right-5 bottom-5 border-2 border-emerald-500/5 rounded-2xl pointer-events-none" />

                <div className="space-y-6 relative py-4">
                  <div className="space-y-1">
                    <span className="font-display font-extrabold text-sm tracking-widest text-emerald-400">CODEZEN</span>
                    <p className="text-[10px] text-slate-500 tracking-wider font-mono">VERIFIED STUDENT CREDENTIAL</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] italic text-slate-400 font-sans block">This certificate confirms that</span>
                    <h3 className="font-display text-2xl font-black text-white tracking-tight">{activeCredential.recipient}</h3>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">has successfully fulfilled study modules and demonstrated practical execution fluency in:</p>
                  </div>

                  <div className="py-2.5 rounded-xl bg-slate-900/60 border border-slate-850 max-w-md mx-auto">
                    <h4 className="font-display text-md font-bold text-slate-100">{activeCredential.courseTitle}</h4>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Course Syllabus Audit Grade: {activeCredential.grade}</span>
                  </div>

                  {/* Skills tags covered */}
                  {activeCredential.skillsLearned.length > 0 && (
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Acquired Competencies Verified</span>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {activeCredential.skillsLearned.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[9px] font-mono text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Issuer and Date columns */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-6 max-w-md mx-auto text-xs font-mono">
                    <div className="text-left">
                      <span className="text-[9px] text-slate-500 block">AUTHENTICATION CODE</span>
                      <span className="text-slate-400 font-semibold block mt-1 text-[10px] truncate select-all">{activeCredential.hash}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">ISSUE DATE REGISTRY</span>
                      <span className="text-slate-400 font-semibold block mt-1 text-[10px]">{activeCredential.issueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-12 text-center space-y-4" id="verified-failed-display-stage">
              <div className="mx-auto inline-flex items-center justify-center rounded-full bg-rose-500/10 p-4 text-rose-500">
                <ShieldCheck className="h-8 w-8 stroke-rose-400" />
              </div>
              <h2 className="font-display text-lg font-bold text-white">Registry ID Verification FAILED</h2>
              <p className="text-slate-400 font-sans text-xs max-w-sm mx-auto">We couldn't locate any credentials indexed under hash key <strong>"{searchHash}"</strong> inside the Codezen registry.</p>
              <div className="text-xs text-slate-500 bg-slate-950 p-4 rounded-xl max-w-xs mx-auto border border-slate-900">
                Please confirm the verification ID format, or select one of the preloaded registry seeds in the sidebar.
              </div>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-12 text-center space-y-4" id="verifier-neutral-state">
            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-slate-950 border border-slate-850 p-4 text-slate-500">
              <Award className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="font-display text-md font-bold text-white">Ready for Audits Checklist</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">Enter a student verification code in the hash registry above, or click on default cards to prompt instant cryptographic checks.</p>
          </div>
        )}
      </div>

      {/* Floating Issue Form Modal overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" id="democert-picker-modal">
          <div className="w-full max-w-md rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4 relative shadow-2xl">
            <button
              id="close-democert-modal-btn"
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display text-lg font-bold text-white">Issue Custom Student Badge</h3>
              <p className="text-xs text-slate-400">Generate local registry credentials to inspect layout performance.</p>
            </div>

            <form onSubmit={handleCreateMockCert} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Recipient Full Name</label>
                <input
                  id="recipient-name-input"
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Select Certified Program</label>
                <select
                  id="certified-program-selector"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 outline-none"
                >
                  <option value="Foundations of Neural Networks">Foundations of Neural Networks</option>
                  <option value="Advanced Git Workflow & Rebasing">Advanced Git Workflow & Rebasing</option>
                  <option value="Smart Contracts with Solidity">Smart Contracts with Solidity</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Audit Score Grade</label>
                <input
                  id="audit-score-input"
                  type="text"
                  required
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-sans">Acquired Competencies (Comma Separated)</label>
                <input
                  id="skills-competencies-input"
                  type="text"
                  required
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 outline-none"
                />
              </div>

              <button
                id="submit-democert-generation-btn"
                type="submit"
                className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Sign & Deploy Credential
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
