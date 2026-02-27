import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import {
  Clock,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  GripHorizontal,
  List,
  Play,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import { EdRealmLogo } from './EdRealmLogo';

interface Question {
  id: string;
  type: 'coding' | 'mcq';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  examples?: { input: string; output: string; explanation?: string }[];
  options?: string[];
  correctOption?: number;
}

interface ContestParticipationProps {
  contest?: {
    id: string;
    title: string;
    duration: number; // minutes
    questions: Question[];
  };
  onSubmit: (answers: Record<string, string>) => void;
  onExit: () => void;
}

export function ContestParticipation({ contest, onSubmit, onExit }: ContestParticipationProps) {
  // --- MOCK DATA FOR DEMO ---
  const questions: Question[] = [
    {
      id: 'q1',
      type: 'mcq',
      title: 'Time Complexity Analysis',
      description: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
      difficulty: 'easy',
      points: 20,
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correctOption: 1,
    },
    {
      id: 'q2',
      type: 'coding',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      difficulty: 'easy',
      points: 50,
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Stack Operations',
      description: 'Which data structure follows the LIFO (Last In First Out) principle?',
      difficulty: 'easy',
      points: 20,
      options: ['Queue', 'Stack', 'Linked List', 'Tree'],
      correctOption: 1,
    },
    {
      id: 'q4',
      type: 'coding',
      title: 'Merge Intervals',
      description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      difficulty: 'medium',
      points: 100,
      examples: [
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      ],
    },
  ];

  const contestTitle = contest?.title || "Data Structures Contest";
  const contestDuration = 90; // Fixed 90 mins for demo

  // --- STATE ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(contestDuration * 60);

  // Resizable State
  const [leftPanelWidth, setLeftPanelWidth] = useState(33.33); // Percentage
  const [bottomPanelHeight, setBottomPanelHeight] = useState(250); // Pixels for test cases
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingBottom, setIsResizingBottom] = useState(false);

  // Monitoring
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [cameraMinimized, setCameraMinimized] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');

  // Dialogs
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Progress
  const [score, setScore] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());

  // Camera Dragging
  const [cameraPosition, setCameraPosition] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth - 240 : 20,
    y: 80
  });
  const [isDraggingCamera, setIsDraggingCamera] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setCameraPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 240),
        y: Math.min(prev.y, window.innerHeight - 140)
      }));
    };
    setCameraPosition({ x: window.innerWidth - 240, y: 80 });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isCoding = currentQuestion && currentQuestion.type === 'coding';

  // --- RESIZE LOGIC ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingLeft) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftPanelWidth(newWidth);
    }
    if (isResizingBottom) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < 600) setBottomPanelHeight(newHeight);
    }
    if (isDraggingCamera) {
      setCameraPosition({
        x: Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 160, e.clientY - dragOffset.y)),
      });
    }
  }, [isResizingLeft, isResizingBottom, isDraggingCamera, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingBottom(false);
    setIsDraggingCamera(false);
  }, []);

  const startDraggingCamera = (e: React.MouseEvent) => {
    setIsDraggingCamera(true);
    setDragOffset({ x: e.clientX - cameraPosition.x, y: e.clientY - cameraPosition.y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // --- CAMERA INIT ---
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Camera access error:', error);
      }
    };
    initCamera();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- TAB VISIBILITY ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = warningCount + 1;
        setWarningCount(newCount);
        setWarningMessage('You switched tabs! This activity has been recorded.');
        setShowWarningDialog(true);
        if (newCount >= 3) {
          toast.error('Maximum warnings reached. Your test will be submitted.');
          handleFinalSubmit();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [warningCount]);

  // --- HELPERS ---
  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        if (!videoTrack.enabled) {
          setWarningCount(c => c + 1);
          setWarningMessage('Camera was turned off. Please keep your camera on during the contest.');
          setShowWarningDialog(true);
        }
      }
    }
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicEnabled(audioTrack.enabled);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuestionSubmit = () => {
    if (!answers[currentQuestion.id]) {
      toast.error('Please attempt the question first');
      return;
    }
    const earnedPoints = Math.floor(Math.random() * currentQuestion.points); // Mock score
    setScore(prev => prev + earnedPoints);
    setSubmittedQuestions(prev => new Set([...prev, currentQuestion.id]));
    toast.success('Response Submitted');
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowSubmitDialog(true);
    }
  };

  const handleFinalSubmit = () => {
    onSubmit(answers);
    toast.success('Contest completed!');
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 w-screen h-screen bg-white text-neutral-900 flex flex-col font-sans overflow-hidden">

      {/* WARNING DIALOGS */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="bg-white border-2 border-black max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              Warning ({warningCount}/3)
            </DialogTitle>
            <DialogDescription>{warningMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter><Button onClick={() => setShowWarningDialog(false)} className="bg-black text-white w-full">I Understand</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="bg-white border-2 border-black max-w-md">
          <DialogHeader><DialogTitle>Exit Contest?</DialogTitle></DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>Stay</Button>
            <Button onClick={onExit} className="bg-black text-white">Exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-white border-2 border-black max-w-md">
          <DialogHeader><DialogTitle>Submit All?</DialogTitle></DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Review</Button>
            <Button onClick={handleFinalSubmit} className="bg-green-600 text-white hover:bg-green-700">Finish Contest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HEADER */}
      <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <EdRealmLogo size="small" />
          <h1 className="font-bold text-lg">{contestTitle}</h1>
          <div className="h-6 w-px bg-neutral-200 mx-2" />
          <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-none font-medium">Question {currentQuestionIndex + 1} / {questions.length}</Badge>
        </div>

        <div className="flex items-center gap-6">
          {/* Points */}
          <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-100">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-neutral-900">{score}</span>
            <span className="text-xs text-neutral-500">pts</span>
          </div>
          {/* Timer */}
          <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-neutral-900'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowExitDialog(true)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold">Exit</Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden relative" onMouseUp={handleMouseUp} onMouseMove={(e) => handleMouseMove(e as any)}>

        {/* SIDEBAR - Only for MCQ */}
        {!isCoding && (
          <aside className="w-64 bg-neutral-50 border-r border-neutral-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-neutral-200">
              <h3 className="font-bold text-neutral-500 text-xs uppercase tracking-widest flex items-center gap-2"><List className="w-4 h-4" /> Questions</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${currentQuestionIndex === idx ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200' : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${currentQuestionIndex === idx ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'}`}>{idx + 1}</span>
                    <span className="truncate w-32">{q.type === 'coding' ? 'Code' : 'MCQ'}</span>
                  </span>
                  {submittedQuestions.has(q.id) && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] relative">
          {/* MCQ LAYOUT */}
          {!isCoding && (
            <div className="flex-1 overflow-y-auto p-12 flex justify-center">
              <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-neutral-900 text-white hover:bg-neutral-800">{currentQuestion.difficulty}</Badge>
                    <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest">{currentQuestion.points} Points</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-900 leading-tight">{currentQuestion.title}</h2>
                  <p className="text-lg text-neutral-600 leading-relaxed">{currentQuestion.description}</p>
                </div>
                <Card className="border-neutral-200 shadow-sm">
                  <CardContent className="p-8">
                    <RadioGroup
                      value={answers[currentQuestion.id] || ''}
                      onValueChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: val })}
                      className="space-y-4"
                    >
                      {currentQuestion.options?.map((opt, idx) => (
                        <div key={idx} className={`flex items-center space-x-2 border rounded-xl p-4 transition-all cursor-pointer ${answers[currentQuestion.id] === opt ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300'}`}>
                          <RadioGroupItem value={opt} id={`opt-${idx}`} className="text-neutral-900 border-neutral-400" />
                          <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-lg ml-3 text-neutral-800">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
                <div className="flex items-center gap-4 pt-4">
                  <Button onClick={handleQuestionSubmit} disabled={submittedQuestions.has(currentQuestion.id)} className="bg-black text-white hover:bg-neutral-800 h-12 px-8 rounded-xl font-bold text-base shadow-lg">{submittedQuestions.has(currentQuestion.id) ? 'Submitted' : 'Submit Answer'}</Button>
                  <Button
                    onClick={handleNext}
                    className="h-12 px-8 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg border-none"
                    style={{ backgroundColor: '#000', color: '#fff' }}
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* CODING LAYOUT (Split 1/3 - 2/3) */}
          {isCoding && (
            <div className="flex-1 flex overflow-hidden">
              {/* LEFT: Problem (Resizable) */}
              <div style={{ width: `${leftPanelWidth}%` }} className="bg-white border-r border-neutral-200 overflow-y-auto p-6 space-y-6 relative shrink-0">
                {/* Drag Handle */}
                <div
                  onMouseDown={() => setIsResizingLeft(true)}
                  className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-blue-400 cursor-col-resize z-20 group"
                >
                  <div className="w-px h-full bg-neutral-200 group-hover:bg-blue-400 transition-colors mx-auto" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-neutral-900">{currentQuestion.title}</h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="uppercase text-[10px] font-bold">{currentQuestion.difficulty}</Badge>
                    <Badge variant="outline" className="uppercase text-[10px] font-bold bg-neutral-50">{currentQuestion.points} pts</Badge>
                  </div>
                </div>
                <div className="prose prose-neutral prose-sm max-w-none text-neutral-600">
                  <p className="whitespace-pre-wrap">{currentQuestion.description}</p>
                </div>
                {currentQuestion.examples?.map((ex, i) => (
                  <div key={i} className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 text-sm space-y-1">
                    <p className="font-bold text-neutral-900 text-xs uppercase">Example {i + 1}</p>
                    <div><span className="text-neutral-500">Input:</span> <code className="text-neutral-900 font-bold">{ex.input}</code></div>
                    <div><span className="text-neutral-500">Output:</span> <code className="text-neutral-900 font-bold">{ex.output}</code></div>
                  </div>
                ))}
              </div>

              {/* RIGHT: Code + Tests */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e] border-l border-neutral-800 min-w-0">
                {/* Top: Editor */}
                <div className="flex-1 flex flex-col min-h-0 relative">
                  <div className="h-10 bg-[#252526] flex items-center px-4 justify-between border-b border-[#333] shrink-0">
                    <span className="text-neutral-400 text-xs font-mono">Solution.java</span>
                    <Badge variant="outline" className="border-green-800 text-green-500 bg-green-900/10 text-[10px]">Auto-Saved</Badge>
                  </div>
                  <div className="flex-1 relative">
                    <Textarea
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                      className="w-full h-full bg-[#1e1e1e] text-neutral-300 font-mono text-sm p-4 border-none resize-none focus:ring-0 focus-visible:ring-0 leading-relaxed custom-scrollbar"
                      placeholder="// Write your solution here..."
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Resize Handle (Vertical) */}
                <div
                  onMouseDown={() => setIsResizingBottom(true)}
                  className="h-1 bg-[#333] hover:bg-blue-500 cursor-row-resize shrink-0 z-20"
                />

                {/* Bottom: Test Cases */}
                <div style={{ height: bottomPanelHeight }} className="bg-[#1e1e1e] border-t border-[#333] flex flex-col shrink-0">
                  <div className="h-10 bg-[#252526] flex items-center px-4 justify-between border-b border-[#333] shrink-0">
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Test Cases</span>
                      <span className="text-neutral-500 text-xs">|</span>
                      <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Console</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-neutral-400 hover:text-white hover:bg-[#333]"><Play className="w-3 h-3 mr-1" /> Run</Button>
                      <Button
                        onClick={handleNext}
                        className="h-7 px-4 rounded-md font-bold text-xs flex items-center gap-1 border-none"
                        style={{ backgroundColor: '#000', color: '#fff' }}
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="text-neutral-500 text-sm font-mono italic">
                      Run your code to see test case results...
                      <br />
                      <br />
                      {'>'} No output yet.
                    </div>
                  </div>
                  {/* Footer Actions */}
                  <div className="p-4 border-t border-[#333] flex justify-between bg-[#252526]">
                    <div className="text-neutral-500 text-xs flex items-center">
                      Test Cases: 0/2 Passed
                    </div>
                    <Button onClick={handleQuestionSubmit} disabled={submittedQuestions.has(currentQuestion.id)} className="bg-white text-black hover:bg-neutral-200 font-bold px-8 h-9 text-xs uppercase tracking-wide">
                      {submittedQuestions.has(currentQuestion.id) ? 'Submitted' : 'Submit'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}


        </main>
      </div>

      {/* CAMERA WIDGET - Floating & Draggable */}
      <div
        className={`fixed z-[100] transition-all duration-300 ${cameraMinimized ? 'w-16 h-16' : 'w-56'}`}
        style={{ left: cameraPosition.x, top: cameraPosition.y }}
      >
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          {!cameraMinimized && <div className="h-6 bg-white/10 cursor-move flex items-center justify-center" onMouseDown={startDraggingCamera}><GripHorizontal className="w-8 h-8 text-white/20" /></div>}
          <div className="relative aspect-video bg-neutral-900 group">
            {cameraMinimized ? (
              <button onClick={() => setCameraMinimized(false)} className="w-full h-full flex items-center justify-center text-white"><Video className="w-6 h-6" /></button>
            ) : (
              <>
                <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!isVideoEnabled && 'hidden'}`} />
                {!isVideoEnabled && <div className="absolute inset-0 flex items-center justify-center"><VideoOff className="w-8 h-8 text-neutral-500" /></div>}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={toggleMic} className={`p-1.5 rounded-full ${isMicEnabled ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{isMicEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}</button>
                  <button onClick={toggleVideo} className={`p-1.5 rounded-full ${isVideoEnabled ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{isVideoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}</button>
                  <button onClick={() => setCameraMinimized(true)} className="p-1.5 rounded-full bg-white/20 text-white"><Minimize2 className="w-3 h-3" /></button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
