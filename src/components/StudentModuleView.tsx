import React, { useState, useEffect } from 'react';
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
  Play,
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
      title: 'Java Programming Basics',
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
          { title: 'Series – Level 1', questions: '0/3 Completed', status: 'Not Started', difficulty: 'Easy' },
          { title: 'Series – Level 2', questions: '1/2 Completed', status: 'In Progress', difficulty: 'Medium' },
          { title: 'Series – Level 3', questions: '3/3 Completed', status: 'Submitted', difficulty: 'Hard' },
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
      toast.success("Module Completed!");
    }
  };

  const isLocked = (item: MenuItem, index: number) => {
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full bg-white overflow-hidden font-sans text-neutral-900">

      {/* SIDEBAR - Fixed width, distinct separation */}
      <aside
        className={`${sidebarMinimized ? 'w-24' : 'w-80'} shrink-0 bg-white text-neutral-900 flex flex-col transition-all duration-300 relative z-30 border-r-2 border-neutral-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
      >
        <button
          onClick={() => setSidebarMinimized(!sidebarMinimized)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-neutral-300 z-30 shadow-md transform hover:scale-105 transition-transform"
        >
          {sidebarMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="p-8 pb-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-neutral-100">
              <Code2 className="w-6 h-6 text-neutral-900" />
            </div>
            {!sidebarMinimized && <span className="font-bold text-2xl tracking-tight text-neutral-900">Codify</span>}
          </div>

          {!sidebarMinimized && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </button>
          )}
        </div>

        {!sidebarMinimized && (
          <div className="px-8 py-6 space-y-4">
            <h2 className="text-xl font-bold leading-tight text-neutral-900">Problem-Solving with Iteration</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-neutral-500">
                <span>1 Chapters</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2 bg-neutral-100" indicatorClassName="bg-neutral-900" />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
          <div className="px-4">
            <div className="space-y-2">
              <button
                onClick={() => setIsIterationsOpen(!isIterationsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors ${isIterationsOpen ? 'bg-neutral-50 text-neutral-900' : 'text-neutral-600'}`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {!sidebarMinimized && <span className="text-sm font-bold">Iterations</span>}
                </div>
                {!sidebarMinimized && (
                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400">
                    <span>8h 25m</span>
                    {isIterationsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                )}
              </button>

              {isIterationsOpen && (
                <div className="space-y-1 relative pl-4">
                  <div className="absolute left-6 top-2 bottom-2 w-px bg-neutral-200" />
                  {menuItems.map((item, idx) => {
                    const locked = isLocked(item, idx);
                    const isActive = activeItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        disabled={locked}
                        onClick={() => setActiveItemId(item.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-4 transition-all relative rounded-xl z-10 ${isActive ? 'bg-orange-50 text-orange-700 shadow-sm' : 'text-neutral-600 hover:bg-neutral-50 hover:pl-5'
                          } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className={`mt-0.5 ${isActive ? 'text-orange-600' : 'text-neutral-400'}`}>
                          {item.type === 'content' && <FileText className="w-4 h-4" />}
                          {item.type === 'practice' && <Code2 className="w-4 h-4" />}
                          {item.type === 'assignment' && (locked ? <Lock className="w-4 h-4" /> : <span className="text-xs font-black font-mono">{'</>'}</span>)}
                        </div>
                        {!sidebarMinimized && (
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-bold leading-snug ${isActive ? 'text-orange-900' : 'text-neutral-700'}`}>
                              {item.title}
                            </p>
                            <p className={`text-[10px] mt-1 font-medium ${isActive ? 'text-orange-400' : 'text-neutral-400'}`}>{item.duration}</p>
                          </div>
                        )}
                        {isActive && !sidebarMinimized && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">

          <div className="w-full max-w-[1400px] mx-auto px-16 py-12 flex flex-col min-h-full">

            {/* HEADER - Updated Breadcrumb & Date */}
            <header className="mb-14 flex items-center justify-between">
              <div className="flex flex-col">
                {/* Updated Breadcrumb */}
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-500">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="hover:text-neutral-900 transition-colors cursor-pointer underline-offset-2 hover:underline"
                  >
                    Dashboard
                  </button>
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                  <button
                    onClick={onBack}
                    className="hover:text-neutral-900 transition-colors cursor-pointer underline-offset-2 hover:underline"
                  >
                    {course.title}
                  </button>
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                  <span className="text-neutral-900 font-bold">{selectedModule.title}</span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 text-right">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-neutral-900">Sunday, Nov 30</span>
                  <span className="text-sm font-medium text-neutral-400">11:55 PM</span>
                </div>
              </div>
            </header>

            <div className="flex-1">

              {/* Content Type */}
              {activeItem.type === 'content' && activeItem.content && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-start">

                    <div className="space-y-12">
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-neutral-800 tracking-tight">{activeItem.content.subtitle}</h2>
                        <ul className="space-y-4">
                          {activeItem.content.points.map((p, i) => (
                            <li key={i} className="flex items-start gap-4 text-lg font-medium text-neutral-700 group">
                              <span className="text-neutral-300 font-mono text-sm mt-1 group-hover:text-red-500 transition-colors">0{i + 1}.</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {activeItem.content.sections.map((sec, i) => (
                        <div key={i} className="space-y-6">
                          <h3 className="text-2xl font-bold text-neutral-900">{sec.title}</h3>
                          <p className="text-lg leading-loose text-neutral-600 font-medium text-justify">{sec.text}</p>

                          <div className="pt-4">
                            <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4">Syntax</h4>
                            <Card className="bg-neutral-900 border-none shadow-2xl overflow-hidden rounded-2xl">
                              <CardContent className="p-8 font-mono text-sm leading-[2.5] text-white/90">
                                <div>
                                  <span className="text-purple-400 font-bold">for</span> (
                                  <span className="text-yellow-300 mx-1">initialize [,initialize];</span>
                                  <span className="text-blue-300 mx-1 font-bold">condition;</span>
                                </div>
                                <div className="pl-12">
                                  <span className="text-green-300 mx-1">update[,update]</span> ) {'{'}
                                </div>
                                <div className="pl-20">
                                  <span className="text-neutral-400 italic">// code_block to be executed</span>
                                </div>
                                <div className="pl-8">
                                  {'}'}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-8 sticky top-10">
                      {activeItem.content.sections.map((sec, i) => sec.image && (
                        <div key={i} className="rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
                          <img src={sec.image} alt={sec.title} className="w-full h-auto object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Practice Type */}
              {activeItem.type === 'practice' && activeItem.practice && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-neutral-900">Pattern Output Practice</h2>
                      <p className="text-neutral-600 leading-relaxed">
                        Analyze the code execution flow and predict the output.
                      </p>
                    </div>
                    <div className="font-mono text-lg space-y-6 p-10 bg-neutral-900 rounded-[32px] min-h-[500px] border border-neutral-800 shadow-2xl text-green-400">
                      {activeItem.practice.outputs.map((line, i) => (
                        <div key={i} className="tracking-[0.2em] animate-in fade-in duration-700" style={{ transitionDelay: `${i * 50}ms` }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Type */}
              {activeItem.type === 'assignment' && activeItem.assignment && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const topics = activeItem.assignment!.topics;
                      const allSubmitted = topics.every(t => t.status === 'Submitted');
                      const anyInProgress = topics.some(t => t.status === 'In Progress');
                      const submittedCount = topics.filter(t => t.status === 'Submitted').length;
                      return allSubmitted ? (
                        <><Badge className="bg-green-100/50 text-green-700 hover:bg-green-100 border-green-200 uppercase text-[10px] px-3 py-1 font-black tracking-wider">All Submitted</Badge>
                          <span className="text-neutral-400 text-sm font-medium">Score: 100/100</span></>
                      ) : anyInProgress ? (
                        <><Badge className="bg-amber-100/50 text-amber-700 hover:bg-amber-100 border-amber-200 uppercase text-[10px] px-3 py-1 font-black tracking-wider">In Progress</Badge>
                          <span className="text-neutral-400 text-sm font-medium">{submittedCount}/{topics.length} topics completed</span></>
                      ) : (
                        <><Badge className="bg-blue-100/50 text-blue-700 hover:bg-blue-100 border-blue-200 uppercase text-[10px] px-3 py-1 font-black tracking-wider">Not Started</Badge>
                          <span className="text-neutral-400 text-sm font-medium">{topics.length} topics to complete</span></>
                      );
                    })()}
                  </div>

                  <div className="border border-neutral-100 rounded-[24px] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <Table>
                      <TableHeader className="bg-neutral-50/80">
                        <TableRow className="border-b border-neutral-100 hover:bg-transparent">
                          <TableHead className="w-[45%] pl-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Topic</TableHead>
                          <TableHead className="text-center py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Questions</TableHead>
                          <TableHead className="text-center py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</TableHead>
                          <TableHead className="text-right pr-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeItem.assignment.topics.map((t, i) => {
                          const navigateToChallenge = () => onNavigate('student-coding', {
                            challenge: {
                              title: t.title,
                              question: t.title,
                              difficulty: t.difficulty,
                              description: 'Find the length of the longest substring without repeating characters in a given string. Series: 2, 4, 8, 14, 22, ..., n',
                              examples: [
                                { id: 'ex-1', input: 'n = 100', output: '2,4,8,14,22,32,44,58,74,92' },
                                { id: 'ex-2', input: 'n = 200', output: '2,4,8,14,22,32,44,58,74,92,112,134,158,184' },
                              ],
                              testCases: [
                                { id: 'tc-1', input: '100', expectedOutput: '2,4,8,14,22,32,44,58,74,92', hidden: false },
                                { id: 'tc-2', input: '200', expectedOutput: '2,4,8,14,22,32,44,58,74,92,112,134,158,184', hidden: false },
                                { id: 'tc-3', input: '500', expectedOutput: '2,4,8,14,22,32,44,58,74,92,112,134,158,184,212,242,274,308,344,382,422,464', hidden: true },
                              ]
                            },
                            module: selectedModule,
                            course: course,
                            previousData: { course, module: selectedModule }
                          });
                          return (
                            <TableRow
                              key={i}
                              className="cursor-pointer hover:bg-neutral-50/50 transition-colors border-b border-neutral-50 last:border-0"
                              onClick={navigateToChallenge}
                            >
                              <TableCell className="pl-8 py-6">
                                <span className="font-bold text-lg text-neutral-800 group-hover:text-orange-600 transition-colors">
                                  {t.title}
                                </span>
                              </TableCell>
                              <TableCell className="text-center py-6">
                                <span className="bg-neutral-100 text-neutral-600 text-xs font-bold px-4 py-1.5 rounded-lg inline-block">
                                  {t.questions}
                                </span>
                              </TableCell>
                              <TableCell className="text-center py-6">
                                <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full inline-block ${t.status === 'Submitted' ? 'text-green-600 bg-green-50' :
                                  t.status === 'In Progress' ? 'text-amber-600 bg-amber-50' :
                                    'text-blue-600 bg-blue-50'
                                  }`}>
                                  {t.status}
                                </span>
                              </TableCell>
                              <TableCell className="pr-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  {t.status === 'Not Started' ? (
                                    <Button variant="outline" className="h-8 w-[80px] rounded-lg text-xs font-bold border-neutral-200 text-neutral-600 hover:border-green-200 hover:text-green-600 hover:bg-white bg-transparent shadow-none transition-all"
                                      onClick={(e) => { e.stopPropagation(); navigateToChallenge(); }}>
                                      Start
                                    </Button>
                                  ) : t.status === 'In Progress' ? (
                                    <Button variant="outline" className="h-8 w-[80px] rounded-lg text-xs font-bold border-neutral-200 text-neutral-600 hover:border-amber-200 hover:text-amber-600 hover:bg-white bg-transparent shadow-none transition-all"
                                      onClick={(e) => { e.stopPropagation(); navigateToChallenge(); }}>
                                      Resume
                                    </Button>
                                  ) : (
                                    <Button variant="outline" className="h-8 w-[80px] rounded-lg text-xs font-bold border-neutral-200 text-neutral-600 hover:border-orange-200 hover:text-orange-600 hover:bg-white bg-transparent shadow-none transition-all"
                                      onClick={(e) => { e.stopPropagation(); navigateToChallenge(); }}>
                                      Retake
                                    </Button>
                                  )}
                                  <ChevronRight className="w-5 h-5 text-neutral-300" />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-20 flex justify-end pb-10 border-t border-neutral-50 pt-10">
              <Button
                onClick={handleNext}
                className="text-white text-base font-bold rounded-2xl px-10 py-7 h-auto shadow-2xl active:scale-95 transition-all flex items-center gap-3"
                style={{ backgroundColor: '#000' }} // Vivid Purple (Indigo-600)
              >
                <span className="text-white">Next Chapter</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
