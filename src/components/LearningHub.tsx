import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, GitBranch, Cpu, CheckCircle, Award, 
  Play, Sparkles, Send, ShieldAlert, ArrowRight, Check, Code, HelpCircle 
} from 'lucide-react';
import { Course, Lesson, QuizQuestion } from '../types';

interface LearningHubProps {
  courses: Course[];
  userXp: number;
  onEnroll: (courseId: string) => void;
  onLessonComplete: (courseId: string, lessonId: string, xpEarned: number) => void;
  onAddLog: (action: string) => void;
}

export default function LearningHub({ 
  courses, 
  userXp, 
  onEnroll, 
  onLessonComplete,
  onAddLog
}: LearningHubProps) {
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'ai' | 'se' | 'web3'>('all');
  const [activeCourseId, setActiveCourseId] = useState<string | null>('ai-101');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('ai-l1');
  
  // Interactive Code Playground States
  const [codeInputValue, setCodeInputValue] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Quiz States
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // AI Mentor Chat States
  const [mentorInput, setMentorInput] = useState('');
  const [mentorMessages, setMentorMessages] = useState<Array<{ sender: 'user' | 'mentor'; text: string }>>([
    { sender: 'mentor', text: "Hello Garg! I am your Codezen Technical Advisor. Ask me anything about Neural Network models, advanced linear Git rebasing, or Solidity smart contracts!" }
  ]);
  const [isMentorTyping, setIsMentorTyping] = useState(false);

  // Get current active details
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const activeLesson = activeCourse.lessons.find(l => l.id === activeLessonId) || activeCourse.lessons[0];

  // Initialize interactive sandbox script once active lesson changes
  React.useEffect(() => {
    if (activeLesson) {
      setCodeInputValue(activeLesson.codeSnippet || '');
      setPlaygroundOutput('Press "Run Diagnostics" to compile code.');
      setSelectedOption(null);
      setQuizSubmitted(false);
      setQuizSuccess(false);
    }
  }, [activeLessonId, activeCourseId]);

  // Run customized code simulation
  const handleCompileSimulation = () => {
    setIsRunningCode(true);
    setPlaygroundOutput('Compiling in remote Codezen sandboxed playground...');
    
    setTimeout(() => {
      setIsRunningCode(false);
      if (activeLesson.expectedOutput) {
        setPlaygroundOutput(`> Execution Result:\n${activeLesson.expectedOutput}\n\n[DIAGNOSTICS GREEN - ZERO COMPILER WARNS]`);
      } else {
        setPlaygroundOutput(`> Command Executed Successfully.\n\nCode exited with system code 0.`);
      }
    }, 1200);
  };

  // Submit multiple choice answers
  const handleQuizAnswerSubmit = (correctIdx: number) => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    if (selectedOption === correctIdx) {
      setQuizSuccess(true);
      // Trigger XP reward!
      if (!activeLesson.isCompleted) {
        onLessonComplete(activeCourse.id, activeLesson.id, activeLesson.xp);
        onAddLog(`Completed lesson "${activeLesson.title}" (+${activeLesson.xp} XP)`);
      }
    } else {
      setQuizSuccess(false);
    }
  };

  // Handle AI Mentor dialogue with rich replies
  const handleMentorSend = () => {
    if (!mentorInput.trim()) return;
    const userQuery = mentorInput;
    setMentorMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setMentorInput('');
    setIsMentorTyping(true);

    setTimeout(() => {
      let aiResponseText = "That's a great question! Codezen system architects typically advise consulting structural guidelines first. Let me know if you would like custom build templates.";
      const queryLower = userQuery.toLowerCase();

      if (queryLower.includes('weight') || queryLower.includes('bias') || queryLower.includes('perceptron')) {
        aiResponseText = `A perceptron represents: Output = f(W*X + b).
* Weights (W) scale inputs (coefficients of importance for features).
* Bias (b) controls the offsets when the perceptron triggers. If bias is high negative (-10), inputs must be extremely positive to activate the neuron.
\`\`\`typescript
// Quick representation
const isActivated = (inputs.reduce((acc, x, i) => acc + x * weights[i], 0) + bias) >= 0;
\`\`\`
Would you like to try coding an multi-layer network structure next?`;
      } else if (queryLower.includes('sigmoid') || queryLower.includes('relu') || queryLower.includes('activation')) {
        aiResponseText = `Activation functions decide the firing rate of a neuron:
- **Sigmoid** forces values between (0, 1). Great for final probability outputs!
- **ReLU** restricts outputs to max(0, x). Ideal for hidden layers because it avoids vanishing gradient bounds.
- **Tanh** locks inputs within (-1, 1).
Always remember to utilize ReLU in the inner blocks to ensure swift convergence.`;
      } else if (queryLower.includes('rebase') || queryLower.includes('merge') || queryLower.includes('git')) {
        aiResponseText = `* git merge creates a permanent merge node which can make logs noisy if done repeatedly.
* git rebase literally updates your branch origin tip to match the newest master, compiling your commits linearly on top of it.
\`\`\`bash
git checkout feature-branch
git rebase master
# Solve any conflict and click
git rebase --continue
\`\`\`
Keep your commits squashed for clean PR reviews!`;
      } else if (queryLower.includes('solidity') || queryLower.includes('gas') || queryLower.includes('smart contract')) {
        aiResponseText = `Solidity contract variables write back to Ethereum storage permanently:
- Initializing variables costs gas. Writing values to non-zero tables costs ~20,000 gas units.
- Always use memory arrays instead of storage lookups inside loop iterations.
- Configure public variables using tight integer variables (like uint256 or uint8 depending on storage boundaries).`;
      }

      setMentorMessages(prev => [...prev, { sender: 'mentor', text: aiResponseText }]);
      setIsMentorTyping(false);
    }, 1400);
  };

  const filteredCourses = selectedTrack === 'all' 
    ? courses 
    : courses.filter(c => c.trackId === selectedTrack);

  return (
    <div id="learning-hub-root" className="grid gap-8 lg:grid-cols-12 py-2">
      {/* Sidebar List and Selectors */}
      <div id="learning-tracks-panel" className="lg:col-span-4 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-400" />
            Learning Tracks
          </h2>
          <p className="text-sm text-slate-400">Select any course track to begin studying code logic files.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-900" id="learning-hub-filters">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'ai', label: 'AI' },
            { id: 'se', label: 'Software Eng' },
            { id: 'web3', label: 'Web3' }
          ].map(btn => (
            <button
              key={btn.id}
              id={`filter-track-${btn.id}`}
              onClick={() => setSelectedTrack(btn.id as any)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold cursor-pointer transition-all ${selectedTrack === btn.id ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Courses Cards */}
        <div className="space-y-4" id="learning-hub-cards-container">
          {filteredCourses.map(course => {
            const completedCount = course.lessons.filter(l => l.isCompleted).length;
            const progressPercent = Math.round((completedCount / course.lessons.length) * 100);

            return (
              <div
                key={course.id}
                id={`course-panel-card-${course.id}`}
                onClick={() => {
                  if (course.isEnrolled) {
                    setActiveCourseId(course.id);
                    setActiveLessonId(course.lessons[0].id);
                  }
                }}
                className={`group rounded-2xl border p-5 transition-all text-left relative overflow-hidden ${activeCourseId === course.id ? 'border-emerald-500 bg-slate-900/50' : 'border-slate-800 bg-slate-900/10 hover:border-slate-700/80 cursor-pointer'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-emerald-400">
                      {course.iconName === 'BrainCircuit' && <BrainCircuit className="h-5 w-5" />}
                      {course.iconName === 'GitBranch' && <GitBranch className="h-5 w-5" />}
                      {course.iconName === 'Cpu' && <Cpu className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{course.level}</span>
                        <span>•</span>
                        <span>{course.lessons.length} lessons</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-block rounded-md bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    +{course.xpReward} XP
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans mt-3 line-clamp-2 leading-relaxed">{course.description}</p>

                {course.isEnrolled ? (
                  <div className="mt-4 space-y-1.5" id={`course-progress-${course.id}`}>
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Course Progress</span>
                      <span>{progressPercent}% completed</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    id={`enroll-btn-${course.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnroll(course.id);
                      onAddLog(`Enrolled in "${course.title}"`);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    Enroll in Track
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Course Content Stage */}
      <div id="learning-content-panel" className="lg:col-span-8 space-y-6">
        {activeCourse?.isEnrolled ? (
          <div className="space-y-6" id="active-lesson-study-stage">
            {/* Upper Navigation of Lessons inside Track */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-900" id="lesson-tabs-scroller">
              {activeCourse.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  id={`lesson-selector-tab-${lesson.id}`}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border cursor-pointer whitespace-nowrap transition-all ${activeLessonId === lesson.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:text-slate-200'}`}
                >
                  {lesson.isCompleted ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 fill-emerald-500/10" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-slate-600" />
                  )}
                  {lesson.title}
                </button>
              ))}
            </div>

            {/* Structured Columns: Left Lesson + Playground, Right AI Mentor Widget */}
            <div className="grid gap-6 xl:grid-cols-12" id="lesson-workspace">
              {/* Content and Diagnostics */}
              <div className="xl:col-span-7 space-y-6">
                {/* Lesson Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>Active Track: {activeCourse.title}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{activeLesson.duration} reading</span>
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white">{activeLesson.title}</h1>
                </div>

                {/* Lesson Body Text */}
                <div 
                  className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 text-sm text-slate-300 font-sans leading-relaxed space-y-4"
                  id="lesson-text-body"
                >
                  {activeLesson.content.split('\n\n').map((chunk, idx) => {
                    if (chunk.startsWith('*') || chunk.startsWith('•')) {
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1 my-2">
                          {chunk.split('\n').map((li, lIdx) => (
                            <li key={lIdx} className="text-slate-300">{li.replace(/^[\*•]\s+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (chunk.match(/\\\[/)) {
                      // Math block representation
                      return (
                        <div key={idx} className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl text-center text-emerald-400 font-mono my-4 overflow-x-auto text-[13px]">
                          {chunk.replace(/\\\[|\\\]/g, '')}
                        </div>
                      );
                    }
                    return <p key={idx}>{chunk}</p>;
                  })}
                </div>

                {/* Simulated Interactive Sandbox IDE */}
                {activeLesson.codeSnippet && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg" id="code-sandbox-ide">
                    <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/30 px-5 py-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Code className="h-4 w-4 text-emerald-400" />
                        <span>Interactive Code Playground</span>
                      </div>
                      <button
                        id="run-diagnostics-btn"
                        onClick={handleCompileSimulation}
                        disabled={isRunningCode}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Play className="h-3 w-3 fill-slate-950" />
                        {isRunningCode ? 'Running...' : 'Run Diagnostics'}
                      </button>
                    </div>

                    <div className="p-4 bg-slate-950 font-mono text-xs">
                      <textarea
                        id="sandbox-textarea"
                        value={codeInputValue}
                        onChange={(e) => setCodeInputValue(e.target.value)}
                        rows={8}
                        className="w-full bg-transparent text-slate-200 outline-none resize-none font-mono leading-relaxed"
                        style={{ tabSize: 2 }}
                      />
                    </div>

                    <div className="border-t border-slate-900 bg-slate-950 p-4 font-mono text-xs">
                      <div className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider">Console Output</div>
                      <pre className="text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">{playgroundOutput}</pre>
                    </div>
                  </div>
                )}

                {/* Lesson Quiz Section */}
                {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 space-y-6" id="lesson-quiz-deck">
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                      <HelpCircle className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-display font-bold text-white">Concept Verification Checkpoint</h4>
                    </div>

                    {activeLesson.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-4">
                        <p className="text-sm font-semibold text-slate-200 font-sans">{q.question}</p>
                        
                        <div className="grid gap-2.5">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              id={`quiz-${activeLesson.id}-option-${oIdx}`}
                              disabled={quizSubmitted && quizSuccess}
                              onClick={() => setSelectedOption(oIdx)}
                              className={`rounded-xl border p-4 text-xs font-medium font-sans text-left transition-all ${selectedOption === oIdx ? 'border-emerald-500 bg-emerald-400/5 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700/60 hover:text-slate-200'} cursor-pointer`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-mono ${selectedOption === oIdx ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10' : 'border-slate-700 text-slate-500 bg-slate-900'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Submission Controls */}
                        {!quizSuccess && (
                          <button
                            id={`submit-quiz-btn-${activeLesson.id}`}
                            onClick={() => handleQuizAnswerSubmit(q.correctAnswer)}
                            disabled={selectedOption === null}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 py-3 text-xs font-semibold text-slate-200 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-slate-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Submit Verification Answer
                          </button>
                        )}

                        {/* Feedback States */}
                        {quizSubmitted && (
                          <div id="quiz-feedback-box">
                            {quizSuccess ? (
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs space-y-1 animate-float" style={{ animationDuration: '4s' }}>
                                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                                  <Check className="h-4 w-4" />
                                  <span>Verification Successful! +{activeLesson.xp} XP</span>
                                </div>
                                <p className="text-slate-400 font-sans mt-1 leading-relaxed">{q.explanation}</p>
                              </div>
                            ) : (
                              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                                  <ShieldAlert className="h-4 w-4" />
                                  <span>Review concept definitions! Incorrect answer.</span>
                                </div>
                                <p className="text-slate-400 font-sans mt-1 leading-relaxed">Consider reloading the reading block above or querying the AI Mentor on the right to explain weights and biases.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Large AI Code Mentor Interactive Widget */}
              <div className="xl:col-span-5 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col h-[520px]" id="ai-mentor-panel">
                  {/* Mentor Header */}
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-900">
                    <div className="relative">
                      <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-400">
                        <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                      </div>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-slate-950" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white flex items-center gap-1">
                        Codezen AI Mentor
                        <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400 tracking-wide uppercase">mentor</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Instant answers utilizing trained SDK knowledge.</p>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs" id="ai-mentor-feed">
                    {mentorMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
                      >
                        <span className="text-[9px] text-slate-600 mb-1 leading-none font-mono">
                          {msg.sender === 'user' ? 'Me' : 'DevAI Companion'}
                        </span>
                        <div
                          className={`rounded-xl px-3.5 py-2.5 font-sans leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-medium' : 'bg-slate-900 text-slate-300 border border-slate-850'}`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isMentorTyping && (
                      <div className="flex items-center gap-1.5 py-1 text-slate-500 font-mono text-[10px]">
                        <span className="animate-pulse">Thinking about technical concepts...</span>
                      </div>
                    )}
                  </div>

                  {/* Feed Suggestions shortcuts */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900 mb-2" id="ai-prompt-shortcuts">
                    {[
                      { query: 'Explain biases simply', label: 'Perceptron Bias' },
                      { query: 'Why are activations non-linear?', label: 'Relu vs Sigmoid' },
                      { query: 'Explain git rebase workflow', label: 'Rebase structure' }
                    ].map((s, idx) => (
                      <button
                        key={idx}
                        id={`mentor-suggestion-btn-${idx}`}
                        type="button"
                        onClick={() => {
                          setMentorInput(s.query);
                          // Trigger directly
                          setTimeout(() => {
                            setMentorInput('');
                            setMentorMessages(prev => [...prev, { sender: 'user', text: s.query }]);
                            setIsMentorTyping(true);
                            setTimeout(() => {
                              let rep = "I can explain that! Perceptrons represent f(Sum weights * inputs + bias). Activation functions introduce non-linearity so networks can map complex non-linear boundaries rather than simple straight lines.";
                              if (s.query.includes('rebase')) {
                                rep = "Git Rebasing literally rewrites branch history to sit linearly on top of mastertip. Ideal for keeping histories clean and free of merge loops.";
                              }
                              setMentorMessages(prev => [...prev, { sender: 'mentor', text: rep }]);
                              setIsMentorTyping(false);
                            }, 1000);
                          }, 100);
                        }}
                        className="rounded bg-slate-900 border border-slate-850 px-2 py-1 text-[10px] text-slate-400 hover:border-emerald-500/20 hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Message Input bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleMentorSend();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      id="ai-mentor-input-field"
                      type="text"
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-600"
                      placeholder="Ask mentor a custom question..."
                      value={mentorInput}
                      onChange={(e) => setMentorInput(e.target.value)}
                    />
                    <button
                      id="ai-mentor-send-btn"
                      type="submit"
                      className="rounded-xl bg-emerald-500 p-2 text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center space-y-4" id="learning-track-neutral-state">
            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-500">
              <Award className="h-10 w-10 animate-float" />
            </div>
            <h2 className="font-display text-xl font-bold text-white">Select and Enroll in a Track</h2>
            <p className="text-slate-400 font-sans text-sm max-w-md mx-auto">Please select your preferred track on the left side directory panel. Enroll to download lesson code, complete diagnostics checking, and answer verification questionnaires.</p>
          </div>
        )}
      </div>
    </div>
  );
}
