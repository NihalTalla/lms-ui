import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  ChevronRight,
  FileText,
  Lock,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { Course, Topic } from '../lib/data';
import { toast } from 'sonner';

interface StudentModuleViewProps {
  course: Course;
  selectedModule: Topic;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

type ContentType = 'content' | 'practice' | 'assignment';

interface MenuItem {
  id: string;
  title: string;
  duration: string;
  type: ContentType;
  locked: boolean;
  content?: {
    title: string;
    subtitle: string;
    points: string[];
    sections: { title: string; text: string; image?: string }[];
  };
  practice?: {
    outputs: string[];
  };
  assignment?: {
    topics: { title: string; questions: string; status: string; difficulty: string }[];
  };
}

export function StudentModuleView({ course, selectedModule, onNavigate, onBack }: StudentModuleViewProps) {
  const [activeItemId, setActiveItemId] = useState('intro');
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isIterationsOpen, setIsIterationsOpen] = useState(true);

  const menuItems: MenuItem[] = [
    {
      id: 'intro',
      title: 'Java Programming Basics (Iterations)',
      duration: '5m',
      type: 'content',
      locked: false,
      content: {
        title: 'Java Programming Basics',
        subtitle: 'Iterations',
        points: ['Initialization', 'Condition (when to continue)', 'Post Expression (Step)', 'Block of code'],
        sections: [
          {
            title: 'For Loop',
            text: 'The for loop is used when you know how many times you want to execute the code block. For instance, if you want to execute a code block 10 times',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60', // Mock syntax diagram
          },
        ],
      },
    },
    {
      id: 'practice-1',
      title: 'Practice - Pattern Output',
      duration: '15m',
      type: 'practice',
      locked: false,
      practice: {
        outputs: [
          '*', '**', '***', '****', '*****',
          '1', '22', '333', '4444', '55555',
          '5', '44', '333', '2222', '11111',
          '5', '54', '543', '5432', '54321',
        ],
      },
    },
    {
      id: 'assign-1',
      title: 'Assignment – 1',
      duration: '1h 40m',
      type: 'assignment',
      locked: false,
      assignment: {
        topics: [
          { title: 'Series – Level 1', questions: '3/3 Completed', status: 'Submitted', difficulty: 'Easy' },
          { title: 'Series – Level 2', questions: '2/2 Completed', status: 'Submitted', difficulty: 'Medium' },
        ],
      },
    },
    { id: 'assign-2', title: 'Assignment – 2', duration: '1h 40m', type: 'assignment', locked: false },
    { id: 'assign-3', title: 'Assignment – 3', duration: '1h 40m', type: 'assignment', locked: false },
    { id: 'assign-4', title: 'Assignment – 4', duration: '1h 40m', type: 'assignment', locked: false },
    { id: 'assign-5', title: 'Assignment – 5', duration: '1h 40m', type: 'assignment', locked: false },
  ];

  const activeItem = menuItems.find(item => item.id === activeItemId) || menuItems[0];

  const handleNext = () => {
    const currentIndex = menuItems.findIndex(item => item.id === activeItemId);
    const currentId = menuItems[currentIndex].id;

    if (!completedItems.includes(currentId)) {
      setCompletedItems([...completedItems, currentId]);
    }

    if (currentIndex < menuItems.length - 1) {
      const nextItem = menuItems[currentIndex + 1];
      setActiveItemId(nextItem.id);
      toast.success(`Navigating to ${nextItem.title}`);
    } else {
      toast.info("Module Completed!");
    }
  };

  const isLocked = (item: MenuItem, index: number) => {
    return false;
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans text-neutral-900">
      {/* 🧱 LEFT SIDEBAR */}
      <aside
        className={`${sidebarMinimized ? 'w-20' : 'w-72'} bg-white text-neutral-900 flex flex-col transition-all duration-300 relative z-20 border-r border-neutral-200`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarMinimized(!sidebarMinimized)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-neutral-300 z-30 shadow-md"
        >
          {sidebarMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Top: Logo & Back */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            {!sidebarMinimized && <span className="font-bold text-xl tracking-tight text-neutral-900">Codify</span>}
          </div>

          {!sidebarMinimized && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>
          )}
        </div>

        {/* Module Title & Progress */}
        {!sidebarMinimized && (
          <div className="px-6 py-4 space-y-4">
            <h2 className="text-sm font-bold leading-tight text-neutral-900">Problem-Solving with Iteration</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                <span>1 Chapters</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-1 bg-neutral-300" />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-4">
          {/* Section: Iterations */}
          <div className="space-y-1">
            <button
              onClick={() => setIsIterationsOpen(!isIterationsOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 hover:bg-neutral-100 transition-colors ${isIterationsOpen ? 'text-neutral-900' : 'text-neutral-600'}`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {!sidebarMinimized && <span className="text-sm font-bold">Iterations</span>}
              </div>
              {!sidebarMinimized && (
                <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-600">
                  <span>8h 25m</span>
                  {isIterationsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
              )}
            </button>

            {isIterationsOpen && (
              <div className="space-y-0.5">
                {menuItems.map((item, idx) => {
                  const locked = isLocked(item, idx);
                  const isActive = activeItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      disabled={locked}
                      onClick={() => setActiveItemId(item.id)}
                      className={`w-full text-left px-6 py-4 flex items-start gap-4 transition-all relative ${isActive ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-neutral-600 hover:bg-neutral-100'
                        } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="mt-1">
                        {item.type === 'content' && <FileText className="w-4 h-4" />}
                        {item.type === 'practice' && <Code2 className="w-4 h-4" />}
                        {item.type === 'assignment' && (locked ? <Lock className="w-4 h-4" /> : <span className="text-sm font-bold font-mono">{'</>'}</span>)}
                      </div>
                      {!sidebarMinimized && (
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-bold leading-snug ${isActive ? 'text-orange-600' : 'text-neutral-900'}`}>
                            {item.title}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">{item.duration}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 🪟 RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* Top Breadcrumb */}
        <header className="h-16 border-b border-neutral-100 flex items-center px-10 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-[0.1em]">
            <span>Cohort 46 - CMRTC II Yr - Phase 1</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>DSA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-black">Problem-Solving with Iteration</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">T</div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 lg:p-16 bg-white scroll-smooth relative">
          <div className="max-w-4xl mx-auto pb-40">
            {activeItem.type === 'content' && activeItem.content && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12">
                <div className="space-y-6">
                  <h1 className="text-[52px] font-black text-red-600 tracking-tight leading-none">{activeItem.content.title}</h1>
                  <div className="space-y-4">
                    <h2 className="text-[28px] font-bold text-neutral-800">{activeItem.content.subtitle}</h2>
                    <ul className="space-y-3">
                      {activeItem.content.points.map((p, i) => (
                        <li key={i} className="flex items-start gap-3 text-black font-semibold text-lg">
                          <span className="text-black/40 mt-0.5">{i + 1}.</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {activeItem.content.sections.map((sec, i) => (
                  <div key={i} className="space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-[34px] font-bold text-neutral-900 leading-tight">{sec.title}</h3>
                      <p className="text-xl text-black leading-relaxed max-w-3xl font-medium">{sec.text}</p>
                    </div>
                    {sec.image && (
                      <div className="rounded-xl overflow-hidden shadow-2xl shadow-neutral-200/50 border border-neutral-100">
                        <img src={sec.image} alt="Diagram" className="w-full h-auto object-cover max-h-[500px]" />
                      </div>
                    )}
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-black tracking-tight">Syntax</h4>
                      <Card className="bg-white border-2 border-neutral-100 shadow-lg">
                        <CardContent className="p-10 font-mono text-base leading-[2] text-neutral-800">
                          <div className="space-y-1">
                            <div>
                              <span className="text-blue-600 font-bold">for</span> (
                              <span className="bg-yellow-100/80 px-1.5 py-0.5 rounded mx-1">initialize [,initialize];</span>
                              <span className="font-bold border-b-2 border-neutral-300 mx-1">condition;</span>
                            </div>
                            <div className="pl-32">
                              <span className="bg-green-100/80 px-1.5 py-0.5 rounded mx-1">update[,update]</span> ) {'{'}
                            </div>
                            <div className="pl-48">
                              <span className="bg-neutral-100 px-3 py-1 rounded text-black italic">code_block;</span>
                            </div>
                            <div className="pl-24">
                              {'}'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeItem.type === 'practice' && activeItem.practice && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
                <div className="font-mono text-xl space-y-6 p-12 bg-neutral-50 rounded-[40px] min-h-[600px] border border-neutral-100 shadow-inner overflow-hidden">
                  {activeItem.practice.outputs.map((line, i) => (
                    <div key={i} className="text-neutral-700 tracking-[0.2em] animate-in fade-in duration-700" style={{ transitionDelay: `${i * 50}ms` }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeItem.type === 'assignment' && activeItem.assignment && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-[44px] font-black text-neutral-900 tracking-tight leading-tight">{activeItem.title}</h1>
                    <Badge className="bg-green-100 text-green-700 border-none font-black uppercase text-[10px] px-3 py-1 tracking-wider">Submitted</Badge>
                  </div>
                  <span className="text-[11px] font-black text-black uppercase tracking-widest whitespace-nowrap bg-neutral-100 px-4 py-2 rounded-full">
                    Sunday, November 30, 2025 11:55 PM
                  </span>
                </div>

                <Card className="rounded-[32px] border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-neutral-100 border-b border-black/10">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="px-10 py-6 text-center font-black text-black uppercase text-[10px] tracking-widest">Topic</TableHead>
                        <TableHead className="px-10 py-6 text-center font-black text-black uppercase text-[10px] tracking-widest">Questions</TableHead>
                        <TableHead className="px-10 py-6 text-center font-black text-black uppercase text-[10px] tracking-widest">Status</TableHead>
                        <TableHead className="px-10 py-6" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeItem.assignment.topics.map((t, i) => (
                        <TableRow
                          key={i}
                          onClick={() => onNavigate('coding-challenge-ui', {
                            topicTitle: t.title,
                            difficulty: t.difficulty,
                            problemDescription: 'Find the length of the longest substring without repeating characters in a given string. Series: 2, 4, 8, 14, 22, ..., n',
                            examples: [
                              {
                                id: 'ex-1',
                                input: 'n = 100',
                                output: '2,4,8,14,22,32,44,58,74,92',
                              },
                              {
                                id: 'ex-2',
                                input: 'n = 200',
                                output: '2,4,8,14,22,32,44,58,74,92,112,134,158,184',
                              }
                            ],
                            testCases: [
                              { id: 'tc-1', input: '100', expectedOutput: '2,4,8,14,22,32,44,58,74,92', hidden: false },
                              { id: 'tc-2', input: '200', expectedOutput: '2,4,8,14,22,32,44,58,74,92,112,134,158,184', hidden: false },
                              { id: 'tc-3', input: '500', expectedOutput: '2,4,8,14,22,32,44,58,74,92,112,134,158,184,212,242,274,308,344,382,422,464', hidden: true },
                            ],
                            previousData: { course, module: selectedModule }
                          })}
                          className="border-neutral-50 last:border-none group hover:bg-neutral-50/50 transition-all cursor-pointer"
                        >
                          <TableCell className="px-10 py-8 text-center">
                            <span className="font-bold text-neutral-800 text-[17px] group-hover:text-orange-600 transition-colors">{t.title}</span>
                          </TableCell>
                          <TableCell className="px-10 py-8 text-center">
                            <span className="font-bold text-neutral-500 text-sm bg-neutral-100 px-3 py-1 rounded-lg">{t.questions}</span>
                          </TableCell>
                          <TableCell className="px-10 py-8 text-center">
                            <Badge className="bg-green-50 text-green-600 font-black border-none uppercase text-[10px] px-4 py-1.5 rounded-full">{t.status}</Badge>
                          </TableCell>
                          <TableCell className="px-10 py-8">
                            <div className="flex items-center justify-end gap-6 text-neutral-900">
                              <Button variant="outline" className="h-10 rounded-xl font-bold text-xs px-6 border-neutral-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm">Retake Test</Button>
                              <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-900 transition-all transform group-hover:translate-x-1" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                {/* Table Footer Space */}
                <div className="h-40" />
              </div>
            )}
          </div>

          {/* 🏁 PERSISTENT NEXT BUTTON */}
          <div className="absolute bottom-10 right-14 z-50">
            <Button
              onClick={handleNext}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-12 py-8 h-auto font-black text-lg shadow-[0_20px_40px_rgba(234,88,12,0.3)] group transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Next
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
