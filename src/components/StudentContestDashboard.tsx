import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { ContestParticipation } from './ContestParticipation';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
}

interface Contest {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  startTime: string;
  endTime: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  participants: number;
  questions: Question[];
  createdAt: string;
}

interface StudentContestStats {
  attempted: number;
  completed: number;
  totalPoints: number;
}

export function StudentContestDashboard({
  onNavigate,
}: {
  onNavigate?: (page: string, data?: any) => void;
}) {
  const [contests, setContests] = useState<Contest[]>([
    {
      id: '1',
      name: 'Weekly Challenge #1',
      description: 'Weekly coding challenge to test your skills',
      totalQuestions: 5,
      startTime: '2026-01-25 09:00',
      endTime: '2026-01-25 12:00',
      status: 'scheduled',
      participants: 45,
      questions: [
        { id: '1', title: 'Two Sum', description: 'Find two numbers that add up to target', difficulty: 'easy', topic: 'Arrays', points: 50 },
        { id: '2', title: 'Valid Parentheses', description: 'Check if parentheses are balanced', difficulty: 'easy', topic: 'Stacks', points: 50 },
        { id: '3', title: 'Merge Intervals', description: 'Merge overlapping intervals', difficulty: 'medium', topic: 'Arrays', points: 100 },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'DSA Sprint',
      description: 'Comprehensive DSA sprint contest',
      totalQuestions: 8,
      startTime: '2026-01-20 10:00',
      endTime: '2026-01-20 14:00',
      status: 'active',
      participants: 120,
      questions: [
        { id: '1', title: 'Two Sum', description: 'Find two numbers that add up to target', difficulty: 'easy', topic: 'Arrays', points: 50 },
        { id: '2', title: 'LRU Cache', description: 'Design an LRU cache data structure', difficulty: 'medium', topic: 'Design', points: 100 },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Beginner Contest',
      description: 'Perfect for beginners',
      totalQuestions: 4,
      startTime: '2026-01-15 09:00',
      endTime: '2026-01-15 11:00',
      status: 'completed',
      participants: 85,
      questions: [],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [studentStats, setStudentStats] = useState<StudentContestStats>({
    attempted: 2,
    completed: 1,
    totalPoints: 300,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [activeContest, setActiveContest] = useState<Contest | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [contestToJoin, setContestToJoin] = useState<Contest | null>(null);

  // Filter contests
  const filteredContests = contests.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const checkForNewContests = () => {
      const recentContest = contests.find(
        c => c.status === 'active' && new Date(c.startTime) < new Date() && new Date() < new Date(c.endTime)
      );
      if (recentContest) {
        // Notify user
      }
    };

    const interval = setInterval(checkForNewContests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinContest = (contest: Contest) => {
    if (contest.status !== 'active') {
      toast.error('Contest is not active. Please wait for the start time.');
      return;
    }
    setContestToJoin(contest);
    setShowConfirmDialog(true);
  };

  const confirmJoin = () => {
    if (contestToJoin) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(() => {
          setActiveContest(contestToJoin);
          setShowConfirmDialog(false);
          toast.success('Entering contest...');
        })
        .catch(() => {
          toast.error('Camera/Microphone access required to participate');
        });
    }
  };

  const handleExitContest = () => {
    if (confirm('Are you sure you want to exit? Your answers will be submitted.')) {
      setActiveContest(null);
      toast.info('Contest session ended');
    }
  };

  const handleSubmitAnswers = () => {
    setStudentStats(prev => ({
      ...prev,
      attempted: prev.attempted + 1,
      totalPoints: prev.totalPoints + 100,
    }));
    setActiveContest(null);
    toast.success('Answers submitted successfully!');
  };

  if (activeContest) {
    return (
      <ContestParticipation
        contestSession={{
          contestId: activeContest.id,
          contestName: activeContest.name,
          startTime: activeContest.startTime,
          endTime: activeContest.endTime,
          questions: activeContest.questions,
        }}
        onSubmit={handleSubmitAnswers}
        onExit={handleExitContest}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white flex flex-col overflow-hidden border-r border-neutral-700">
        <div className="p-4 border-b border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-300 hover:text-white hover:bg-neutral-700"
            onClick={() => onNavigate?.('studentDashboard')}
          >
            ← Back
          </Button>
        </div>

        <div className="p-4 border-b border-neutral-700">
          <h2 className="text-lg font-bold mb-1">Array Advanced</h2>
          <p className="text-xs text-neutral-400">3 Chapters</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">57%</span>
              <span className="text-neutral-400">Complete</span>
            </div>
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="p-2 rounded cursor-pointer hover:bg-neutral-700 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">Two Pointers</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">2h 57m</span>
            </div>
            <p className="text-xs text-neutral-400">✓ Completed</p>
          </div>

          <div className="p-2 rounded cursor-pointer hover:bg-neutral-700 transition-all bg-neutral-700/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">Sliding Window</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">4h 45m</span>
            </div>
            <p className="text-xs text-neutral-400">In Progress</p>
          </div>

          <div className="p-2 rounded cursor-pointer hover:bg-neutral-700 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">Prefix Array</span>
              <span className="text-xs text-neutral-500">Not started</span>
            </div>
            <p className="text-xs text-neutral-400">Coming soon</p>
          </div>
        </div>

        <div className="border-t border-neutral-700 p-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Assignments</h3>
          <div className="space-y-1">
            <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20 cursor-pointer hover:bg-orange-500/20">
              <p className="text-sm font-semibold text-orange-300">Assignment 1</p>
              <p className="text-xs text-neutral-400">1h 25m elapsed</p>
            </div>
            <div className="p-2 rounded hover:bg-neutral-700 cursor-pointer">
              <p className="text-sm text-neutral-300">Assignment 2</p>
              <p className="text-xs text-neutral-400">1h 40m elapsed</p>
            </div>
            <div className="p-2 rounded hover:bg-neutral-700 cursor-pointer opacity-50">
              <p className="text-sm text-neutral-400">Assessment 3</p>
              <p className="text-xs text-neutral-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-4 border-b border-neutral-300 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">Assignment - 2</h1>
              <p className="text-sm text-neutral-800 mt-1">Submitted • Sunday, November 30, 2025 11:55 PM</p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => toast.success('Reopening assignment...')}
            >
              Retake Test
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-200">
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-lg border-2 border-gray-600 overflow-hidden shadow-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-700 bg-gray-400">
                    <th className="px-6 py-3 text-left font-black text-black text-lg">Topic</th>
                    <th className="px-6 py-3 text-left font-black text-black text-lg">Questions</th>
                    <th className="px-6 py-3 text-left font-black text-black text-lg">Status</th>
                    <th className="px-6 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-gray-400 hover:bg-gray-100">
                    <td className="px-6 py-4 font-black text-black text-lg">Series – Level 1</td>
                    <td className="px-6 py-4 text-black font-bold text-lg">3/3 Completed</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-500 text-white font-black text-base">Submitted</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-blue-900 font-black text-base">
                        Retake Test →
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4 font-black text-black text-lg">Series – Level 2</td>
                    <td className="px-6 py-4 text-black font-bold text-lg">2/2 Completed</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-500 text-white font-black text-base">Submitted</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-blue-900 font-black text-base">
                        Retake Test →
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
