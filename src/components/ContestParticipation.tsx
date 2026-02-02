import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import {
  Clock,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Trophy,
  Code2,
  GripHorizontal,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  examples?: { input: string; output: string; explanation?: string }[];
  testCases?: { input: string; expectedOutput: string }[];
}

interface ContestParticipationProps {
  contest: {
    id: string;
    title: string;
    duration: number; // minutes
    questions: Question[];
  };
  onSubmit: (answers: Record<string, string>) => void;
  onExit: () => void;
}

export function ContestParticipation({ contest, onSubmit, onExit }: ContestParticipationProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(contest.duration * 60);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [cameraMinimized, setCameraMinimized] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [score, setScore] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [cameraPosition, setCameraPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock questions if none provided
  const questions: Question[] = contest.questions.length > 0 ? contest.questions : [
    {
      id: 'q1',
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
      id: 'q2',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
      difficulty: 'easy',
      points: 50,
      examples: [
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' },
      ],
    },
    {
      id: 'q3',
      title: 'Merge Intervals',
      description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      difficulty: 'medium',
      points: 100,
      examples: [
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      ],
    },
    {
      id: 'q4',
      title: 'LRU Cache',
      description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache.',
      difficulty: 'hard',
      points: 150,
      examples: [
        { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]', output: '[null, null, null, 1, null, -1, null, -1, 3, 4]' },
      ],
    },
    {
      id: 'q5',
      title: 'Word Ladder',
      description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n\n- Every adjacent pair of words differs by a single letter.\n- Every si for 1 <= i <= k is in wordList.\n\nGiven two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
      difficulty: 'hard',
      points: 150,
      examples: [
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.' },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize camera
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
        toast.error('Could not access camera/microphone');
      }
    };

    initCamera();

    // Enter fullscreen
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => { });
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer
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

  // Malpractice detection - tab visibility
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

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);

        if (!videoTrack.enabled) {
          const newCount = warningCount + 1;
          setWarningCount(newCount);
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

  // Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - cameraPosition.x,
      y: e.clientY - cameraPosition.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setCameraPosition({
        x: Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 160, e.clientY - dragOffset.y)),
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitQuestion = () => {
    if (!answers[currentQuestion.id]) {
      toast.error('Please write your solution before submitting');
      return;
    }

    // Simulate scoring
    const earnedPoints = Math.floor(Math.random() * currentQuestion.points);
    setScore(prev => prev + earnedPoints);
    setSubmittedQuestions(prev => new Set([...prev, currentQuestion.id]));
    toast.success(`Solution submitted! +${earnedPoints} points`);
  };

  const handleFinalSubmit = () => {
    onSubmit(answers);
    toast.success('Contest completed!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getTimerColor = () => {
    if (timeRemaining <= 300) return 'text-red-500'; // Last 5 minutes
    if (timeRemaining <= 900) return 'text-orange-500'; // Last 15 minutes
    return 'text-white';
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-200 text-black flex flex-col font-sans">
      {/* Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="bg-white border-2 border-black text-black max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Warning ({warningCount}/3)
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {warningMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300">
                {warningCount >= 2
                  ? 'This is your final warning. One more violation will auto-submit your test.'
                  : 'Please refrain from such activities. Repeated violations will result in automatic submission.'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowWarningDialog(false)} className="bg-black text-white hover:bg-neutral-800 w-full font-bold h-12">
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="bg-white border-2 border-black text-black max-w-md">
          <DialogHeader>
            <DialogTitle>Exit Contest?</DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to leave? Your progress will be saved but you cannot return.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)} className="border-black text-black font-bold h-12">
              Stay
            </Button>
            <Button onClick={() => { onExit(); }} className="bg-black text-white hover:bg-neutral-800 font-bold h-12 px-6">
              Exit Contest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-400" />
              Submit All Solutions?
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              You have submitted {submittedQuestions.size} of {questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-3xl font-bold text-orange-400">{score} pts</p>
              <p className="text-sm text-slate-400">Current Score</p>
            </div>
            <p className="text-sm text-slate-400">
              Are you sure you want to finish? You cannot return after submitting.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="border-slate-600 text-slate-300">
              Continue Working
            </Button>
            <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700">
              Finish Contest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-white border-b border-black/10 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-black" />
            <h1 className="font-black text-xl tracking-tight">{contest.title}</h1>
          </div>

          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
            Q{currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          {/* Score */}
          <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-400">{score}</span>
            <span className="text-slate-400 text-sm">pts</span>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg ${getTimerColor()}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
          </div>

          {/* Exit */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExitDialog(true)}
            className="border-black text-black hover:bg-black hover:text-white font-bold px-6 h-10 rounded-xl transition-all"
          >
            Exit Contest
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem Description */}
        <div className="w-1/2 border-r border-black/10 flex flex-col overflow-hidden bg-neutral-100/50">
          <div className="p-6 overflow-y-auto flex-1">
            {/* Problem Header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-black">{currentQuestion.title}</h2>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              <Badge className="bg-white text-black border-black/10">
                {currentQuestion.points} pts
              </Badge>
            </div>

            {/* Description */}
            <div className="prose prose-neutral max-w-none mb-8">
              <p className="text-neutral-800 whitespace-pre-line leading-relaxed font-medium">
                {currentQuestion.description}
              </p>
            </div>

            {/* Examples */}
            {currentQuestion.examples && currentQuestion.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black">Examples</h3>
                {currentQuestion.examples.map((example, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-4 space-y-3 border border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Input</span>
                      <pre className="mt-1 text-sm text-blue-700 bg-white rounded-lg p-3 overflow-x-auto border border-black/5">
                        {example.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Output</span>
                      <pre className="mt-1 text-sm text-green-700 bg-white rounded-lg p-3 overflow-x-auto border border-black/5">
                        {example.output}
                      </pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Explanation</span>
                        <p className="mt-1 text-sm text-slate-400">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-slate-950">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-black/10">
            <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Solution</span>
            {submittedQuestions.has(currentQuestion.id) && (
              <Badge className="bg-green-100 text-green-700 border-none font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Submitted
              </Badge>
            )}
          </div>

          {/* Code Area */}
          <div className="flex-1 p-6 bg-neutral-50">
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={`// Write your ${currentQuestion.title} solution here\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}`}
              className="w-full h-full bg-white border-black/10 text-black font-mono text-base resize-none focus-visible:ring-black rounded-2xl shadow-inner p-6"
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-white border-t border-black/10 flex items-center justify-between">
            <Button
              variant="outline"
              className="border-black text-black font-bold h-12 px-8 rounded-xl hover:bg-neutral-50"
            >
              Run Code
            </Button>

            <Button
              onClick={handleSubmitQuestion}
              className="bg-black text-white hover:bg-neutral-800 font-black h-12 px-10 rounded-xl shadow-lg"
              disabled={submittedQuestions.has(currentQuestion.id)}
            >
              <Send className="w-4 h-4 mr-2" />
              {submittedQuestions.has(currentQuestion.id) ? 'Submitted' : 'Submit Solution'}
            </Button>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white border-t border-black/10 px-8 py-5 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="border-black text-black font-bold h-11 px-6 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {/* Question Dots */}
        <div className="flex items-center gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black transition-all ${currentQuestionIndex === idx
                ? 'bg-black text-white shadow-xl scale-110'
                : submittedQuestions.has(q.id)
                  ? 'bg-green-100 text-green-700 border-none'
                  : answers[q.id]
                    ? 'bg-neutral-100 text-black border border-black/20'
                    : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100 border border-black/5'
                }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            className="bg-black text-white hover:bg-neutral-800 font-bold h-11 px-8 rounded-xl"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowSubmitDialog(true)}
            className="bg-black text-white hover:bg-neutral-800 font-black h-11 px-8 rounded-xl"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Finish Contest
          </Button>
        )}
      </div>

      {/* Floating Camera Widget */}
      <div
        className={`fixed z-50 transition-all duration-300 ${cameraMinimized ? 'w-14 h-14' : 'w-48'}`}
        style={{ left: cameraPosition.x, top: cameraPosition.y }}
      >
        {cameraMinimized ? (
          <button
            onClick={() => setCameraMinimized(false)}
            className="w-14 h-14 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-xl"
          >
            <Video className="w-5 h-5 text-slate-300" />
          </button>
        ) : (
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600 overflow-hidden">
            {/* Drag Handle */}
            <div
              className="flex items-center justify-between px-3 py-2 bg-slate-700 cursor-move"
              onMouseDown={handleMouseDown}
            >
              <GripHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Camera</span>
              <button
                onClick={() => setCameraMinimized(true)}
                className="text-slate-400 hover:text-white"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>

            {/* Video */}
            <div className="relative aspect-video bg-slate-900">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-slate-500" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 p-2 bg-slate-800">
              <button
                onClick={toggleMic}
                className={`p-2 rounded-lg transition-colors ${isMicEnabled ? 'bg-slate-700 text-white' : 'bg-red-500/20 text-red-400'
                  }`}
              >
                {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-2 rounded-lg transition-colors ${isVideoEnabled ? 'bg-slate-700 text-white' : 'bg-red-500/20 text-red-400'
                  }`}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Warning Indicator */}
      {warningCount > 0 && (
        <div className="fixed bottom-4 left-4 z-50">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1.5">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warnings: {warningCount}/3
          </Badge>
        </div>
      )}
    </div>
  );
}
