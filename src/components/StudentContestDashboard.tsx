import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { ContestParticipation } from './ContestParticipation';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Play,
  CheckCircle2,
  AlertCircle,
  Mail,
  Zap,
} from 'lucide-react';

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
  duration: string;
  prize?: string;
  enrolled?: boolean;
}

export function StudentContestDashboard({
  onNavigate,
}: {
  onNavigate?: (page: string, data?: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isContestMode, setIsContestMode] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [activeContest, setActiveContest] = useState<Contest | null>(null);

  const contests: Contest[] = [
    {
      id: '1',
      name: 'Dynamic Programming Contest',
      description: 'Master the art of DP with this intensive challenge.',
      totalQuestions: 5,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3 * 3600000).toISOString(),
      status: 'active',
      participants: 840,
      duration: '3h',
      prize: '₹10,000',
      enrolled: true,
      questions: [
        { id: 'q1', title: 'Edit Distance', description: 'Transform one string to another.', difficulty: 'medium', topic: 'DP', points: 100 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Weekly DSA Challenge #12',
      description: 'Test your data structures and algorithms knowledge.',
      totalQuestions: 4,
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      status: 'scheduled',
      participants: 0,
      duration: '1.5h',
      prize: '₹2,000',
      enrolled: false,
      questions: [],
      createdAt: new Date().toISOString(),
    },
  ];

  const liveContests = contests.filter(c => c.status === 'active');
  const upcomingContests = contests.filter(c => c.status === 'scheduled');

  const handleEnterContest = (c: Contest) => {
    setSelectedContest(c);
    setShowPermissionDialog(true);
  };

  const startContest = () => {
    setShowPermissionDialog(false);
    setIsContestMode(true);
    if (selectedContest) {
      setActiveContest(selectedContest);
    }
  };

  if (activeContest && isContestMode) {
    return (
      <div className="min-h-screen bg-neutral-300 p-0 flex flex-col">
        <header className="bg-black text-white p-4 flex justify-between items-center">
          <h2 className="font-bold">{activeContest.name}</h2>
          <Button variant="outline" className="text-white border-white hover:bg-neutral-800" onClick={() => setIsContestMode(false)}>Exit Contest</Button>
        </header>
        <div className="flex-1 p-8 text-black">
          <ContestParticipation
            contest={{
              id: activeContest.id,
              title: activeContest.name,
              duration: 180,
              questions: activeContest.questions,
            }}
            onSubmit={() => {
              setActiveContest(null);
              setIsContestMode(false);
            }}
            onExit={() => {
              setActiveContest(null);
              setIsContestMode(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isContestMode ? 'bg-neutral-300 text-black' : 'bg-neutral-50 text-neutral-900'} p-8 font-sans`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Coding Contests</h1>
            <p className="text-neutral-500">Compete with your peers and improve your ranking.</p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase">GLobal Rank</p>
                <p className="text-xl font-bold text-neutral-900">#128</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="bg-white border border-neutral-200 p-1 mb-8">
            <TabsTrigger value="live" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg px-8 py-2">Live</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg px-8 py-2">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg px-8 py-2">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            {liveContests.map(c => (
              <Card key={c.id} className="overflow-hidden border-neutral-200 shadow-md">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-red-100 uppercase text-[10px] font-bold">Live Now</Badge>
                      <span className="text-xs text-neutral-400">• {c.participants} participants</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">{c.name}</h2>
                      <p className="text-neutral-500 mt-1">{c.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="font-semibold">{c.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-orange-600">{c.prize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <Button
                      className={`w-full py-6 rounded-xl font-bold text-base transition-all ${isContestMode
                          ? 'bg-black text-white hover:bg-neutral-800'
                          : 'bg-neutral-900 hover:bg-black text-white'
                        }`}
                      onClick={() => {
                        if (c.enrolled) handleEnterContest(c);
                        else { setSelectedContest(c); setShowEnrollDialog(true); }
                      }}
                    >
                      {c.enrolled ? (isContestMode ? 'Continue Contest' : 'Enter Contest') : 'Register Now'}
                    </Button>
                    <p className={`text-[10px] font-bold text-center uppercase ${isContestMode ? 'text-black' : 'text-neutral-400'}`}>Ends in 02:45:12</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingContests.map(c => (
              <Card key={c.id} className={`p-6 border-neutral-200 shadow-sm flex flex-col justify-between h-full ${isContestMode ? 'bg-neutral-200 border-black/10' : 'bg-white'}`}>
                <div className="space-y-4">
                  <Badge variant="secondary" className={`${isContestMode ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'} border-none uppercase text-[10px] font-bold`}>Scheduled</Badge>
                  <div>
                    <h3 className={`text-xl font-bold ${isContestMode ? 'text-black' : 'text-neutral-900'}`}>{c.name}</h3>
                    <p className={`text-sm mt-2 line-clamp-2 ${isContestMode ? 'text-neutral-700' : 'text-neutral-500'}`}>{c.description}</p>
                  </div>
                </div>
                <div className={`mt-8 flex items-center justify-between border-t pt-6 ${isContestMode ? 'border-black/5' : 'border-neutral-100'}`}>
                  <div className={`flex items-center gap-2 text-xs ${isContestMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    <Calendar className="w-4 h-4" />
                    <span>Starts in 24h</span>
                  </div>
                  <Button variant="outline" className={`text-xs font-bold ${isContestMode ? 'border-black text-black hover:bg-black hover:text-white' : 'border-neutral-200'}`}>View Details</Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              Contest Environment
            </DialogTitle>
            <DialogDescription className="text-neutral-600 font-medium pt-2">
              By entering this contest, you agree to follow the code of conduct. Screen recording and switching tabs may be monitored. Do you wish to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="border-black text-black font-bold h-12" onClick={() => setShowPermissionDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white hover:bg-neutral-800 font-bold h-12" onClick={startContest}>I Agree, Start</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Contest</DialogTitle>
            <DialogDescription>Confirm your enrollment for {selectedContest?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Confirmation Email</Label>
              <Input placeholder="Enter your email" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>Cancel</Button>
            <Button className="bg-neutral-900 text-white" onClick={() => { toast.success('Enrolled!'); setShowEnrollDialog(false); }}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
