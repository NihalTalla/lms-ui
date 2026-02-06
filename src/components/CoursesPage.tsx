import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Clock, Users, Award, ArrowRight, Star, Plus, Edit, Trash2, Eye, Lock, Unlock, ChevronDown, ChevronRight, Code, Play, Download, FileText, ArrowLeft, Image as ImageIcon, Search } from 'lucide-react';
import { courses, institutions, batches, Topic, TopicQuestion } from '../lib/data';
import { CodePracticeConsole } from './CodePracticeConsole';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface CoursesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [courseList, setCourseList] = useState(courses);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: '',
    lessons: 0,
    tags: '',
    institutionId: '',
    batchId: '',
    topics: [] as Topic[],
  });

  const [currentTopic, setCurrentTopic] = useState({
    title: '',
    content: '',
    images: [] as string[],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    type: 'mcq' as 'mcq' | 'coding',
    starterCode: '',
    expectedOutput: '',
    testCases: [] as { input: string; expectedOutput: string; hidden: boolean }[],
  });

  // State for adding existing questions
  const [isSelectQuestionOpen, setIsSelectQuestionOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState<TopicQuestion[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(-1); // Index of topic to add question to

  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeTemplate, setCodeTemplate] = useState('');

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewCourse, setViewCourse] = useState<any>(null);

  // Management Templates State
  const [mgmtStep, setMgmtStep] = useState<'list' | 'topics' | 'details' | 'assessment'>('list');
  const [activeMgmtCourse, setActiveMgmtCourse] = useState<any>(null);
  const [activeMgmtTopic, setActiveMgmtTopic] = useState<any>(null);
  const [activeMgmtTopicIndex, setActiveMgmtTopicIndex] = useState<number>(-1);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleTopicToggleLock = (topicIndex: number) => {
    const updatedTopics = newCourse.topics.map((t, i) =>
      i === topicIndex ? { ...t, isLocked: !t.isLocked } : t
    );
    setNewCourse(prev => ({ ...prev, topics: updatedTopics }));
    toast.success(`Topic ${updatedTopics[topicIndex].isLocked ? 'locked' : 'unlocked'}`);
  };

  const handleAddTopic = () => {
    if (!currentTopic.title || !currentTopic.content) {
      toast.error('Please fill in topic title and content');
      return;
    }
    const topic: Topic = {
      id: `topic-${Date.now()}`,
      title: currentTopic.title,
      content: currentTopic.content,
      questions: [],
      isLocked: false,
      images: currentTopic.images,
    };
    setNewCourse(prev => ({ ...prev, topics: [...prev.topics, topic] }));
    setCurrentTopic({ title: '', content: '', images: [] });
    toast.success('Topic added');
  };

  const handleAddQuestion = (topicIndex: number) => {
    if (!currentQuestion.question) {
      toast.error('Please fill in question');
      return;
    }

    let question: TopicQuestion;
    if (currentQuestion.type === 'mcq') {
      if (!currentQuestion.correctAnswer) {
        toast.error('Please fill in correct answer');
        return;
      }
      question = {
        id: `q-${Date.now()}`,
        question: currentQuestion.question,
        options: currentQuestion.options.filter(o => o.trim() !== ''),
        correctAnswer: currentQuestion.correctAnswer,
        type: 'multiple_choice' // Standardize on 'multiple_choice' to match interface if needed, or keep 'mcq' if interface allows
      };
      // Note: Interface says 'multiple_choice', state says 'mcq'. 
      // Let's force type to match interface or update interface. 
      // The interface in data.ts says 'multiple_choice' | 'coding'.
      // So I should map 'mcq' to 'multiple_choice'.
      question.type = 'multiple_choice';
    } else {
      if (!currentQuestion.starterCode) {
        toast.error('Please fill in starter code');
        return;
      }
      question = {
        id: `q-${Date.now()}`,
        question: currentQuestion.question,
        starterCode: currentQuestion.starterCode,
        expectedOutput: currentQuestion.expectedOutput,
        testCases: currentQuestion.testCases,
        type: 'coding',
      };
    }

    const updatedTopics = newCourse.topics.map((t, i) =>
      i === topicIndex ? { ...t, questions: [...t.questions, question] } : t
    );
    setNewCourse(prev => ({ ...prev, topics: updatedTopics }));
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      type: 'mcq',
      starterCode: '',
      expectedOutput: '',
      testCases: [],
    });
    toast.success('Question added to topic');
  };

  const handleRemoveQuestion = (topicIndex: number, questionIndex: number) => {
    const updatedTopics = newCourse.topics.map((t, i) =>
      i === topicIndex ? { ...t, questions: t.questions.filter((_, qIdx) => qIdx !== questionIndex) } : t
    );
    setNewCourse(prev => ({ ...prev, topics: updatedTopics }));
    toast.success('Question removed from topic');
  };

  const openExistingQuestionDialog = (topicIndex: number) => {
    const questions: TopicQuestion[] = [];
    courseList.forEach(c => {
      c.topics?.forEach(t => {
        t.questions?.forEach(q => {
          // Simple duplicate check by unique combination of question text + type or id
          if (!questions.find(existing => existing.id === q.id)) {
            questions.push(q);
          }
        });
      });
    });

    // Also consider adding some mock questions if list is empty for demonstration
    if (questions.length === 0) {
      questions.push(
        { id: 'mk-1', question: 'What is React?', type: 'multiple_choice', options: ['Lib', 'Frame', 'Lang', 'None'], correctAnswer: 'Lib' },
        { id: 'mk-2', question: 'Write a sum function', type: 'coding', starterCode: 'function sum(a,b) {}', testCases: [] }
      );
    }

    setAllQuestions(questions);
    setActiveTopicIndex(topicIndex);
    setIsSelectQuestionOpen(true);
  };

  const handleSelectExistingQuestion = (question: TopicQuestion) => {
    // Clone question to give it a new ID so it's treated as a new instance
    const newQ = { ...question, id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };

    const updatedTopics = newCourse.topics.map((t, i) =>
      i === activeTopicIndex ? { ...t, questions: [...t.questions, newQ] } : t
    );
    setNewCourse(prev => ({ ...prev, topics: updatedTopics }));
    setIsSelectQuestionOpen(false);
    toast.success('Question added successfully');
  };

  const handleAddTestCase = () => {
    setCurrentQuestion({
      ...currentQuestion,
      testCases: [...currentQuestion.testCases, { input: '', expectedOutput: '', hidden: false }]
    });
  };

  const handleRemoveTestCase = (index: number) => {
    const newTestCases = [...currentQuestion.testCases];
    newTestCases.splice(index, 1);
    setCurrentQuestion({ ...currentQuestion, testCases: newTestCases });
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expectedOutput' | 'hidden', value: any) => {
    const newTestCases = [...currentQuestion.testCases];
    // @ts-ignore
    newTestCases[index][field] = value;
    setCurrentQuestion({ ...currentQuestion, testCases: newTestCases });
  };

  const handleToggleLock = (courseId: string) => {
    const updated = courseList.map(c =>
      c.id === courseId ? { ...c, isLocked: !c.isLocked } : c
    );
    setCourseList(updated);
    toast.success('Course lock status updated');
  };

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.institutionId || !newCourse.batchId) {
      toast.error('Please fill in required fields (Title, Institution, Batch)');
      return;
    }

    const course = {
      id: `course-${Date.now()}`,
      title: newCourse.title,
      description: newCourse.description,
      level: newCourse.level,
      duration: newCourse.duration,
      lessons: newCourse.lessons,
      enrolled: 0,
      tags: newCourse.tags.split(',').map(t => t.trim()).filter(t => t),
      institutionId: newCourse.institutionId,
      batchId: newCourse.batchId,
      topics: newCourse.topics,
      isLocked: false,
    };

    setCourseList([...courseList, course]);
    setIsCreateDialogOpen(false);
    setNewCourse({
      title: '',
      description: '',
      level: 'beginner',
      duration: '',
      lessons: 0,
      tags: '',
      institutionId: '',
      batchId: '',
      topics: []
    });
    toast.success('Course created successfully!');
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      lessons: course.lessons,
      tags: course.tags.join(', '),
      institutionId: course.institutionId || '',
      batchId: course.batchId || '',
      topics: course.topics || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCourse = () => {
    if (!selectedCourse) return;

    const updated = courseList.map(c =>
      c.id === selectedCourse.id
        ? {
          ...c,
          title: newCourse.title,
          description: newCourse.description,
          level: newCourse.level,
          duration: newCourse.duration,
          lessons: newCourse.lessons,
          tags: newCourse.tags.split(',').map(t => t.trim()).filter(t => t),
          institutionId: newCourse.institutionId,
          batchId: newCourse.batchId,
          topics: newCourse.topics,
        }
        : c
    );

    setCourseList(updated);
    setIsEditDialogOpen(false);
    setSelectedCourse(null);
    setNewCourse({
      title: '',
      description: '',
      level: 'beginner',
      duration: '',
      lessons: 0,
      tags: '',
      institutionId: '',
      batchId: '',
      topics: []
    });
    toast.success('Course updated successfully!');
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourseList(courseList.filter(c => c.id !== courseId));
    toast.success('Course deleted successfully');
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      beginner: 'bg-green-100 text-green-700 border-green-300',
      intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      advanced: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
      <Badge variant="outline" className={styles[level as keyof typeof styles]}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const handleBackToCourses = () => {
    setMgmtStep('list');
    setActiveMgmtCourse(null);
  };

  const handleBackToTopics = () => {
    setMgmtStep('topics');
    setActiveMgmtTopic(null);
  };

  const handleBackToDetails = () => {
    setMgmtStep('details');
  };

  const handleOpenCourseTopics = (course: any) => {
    setActiveMgmtCourse(course);
    setMgmtStep('topics');
  };

  const handleOpenTopicDetails = (topic: any, index: number) => {
    setActiveMgmtTopic(topic);
    setActiveMgmtTopicIndex(index);
    setMgmtStep('details');
  };

  const handleOpenAssessment = () => {
    setMgmtStep('assessment');
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Courses</h2>
          <p className="text-neutral-600 mt-1">
            {isAdmin
              ? 'Manage courses and explore available courses'
              : 'Explore and enroll in courses to advance your skills'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => {
            setNewCourse({
              title: '',
              description: '',
              level: 'beginner',
              duration: '',
              lessons: 0,
              tags: '',
              institutionId: '',
              batchId: '',
              topics: [],
            });
            setIsCreateDialogOpen(true);
          }} style={{ backgroundColor: 'var(--color-primary)' }}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        )}
      </div>

      {/* Admin Management Drill-down */}
      {isAdmin && mgmtStep === 'list' && (
        <Card className="shadow-lg border-none bg-gradient-to-br from-white to-neutral-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600">Course Management</CardTitle>
              <CardDescription className="text-neutral-500">Manage your curriculum, topics, and assessments in one place</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" />
                <Input placeholder="Search courses..." className="pl-10 w-72 bg-white/50 backdrop-blur-sm focus:bg-white transition-all shadow-sm" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-neutral-100">
                  <TableHead className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Course Information</TableHead>
                  <TableHead className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Batch details</TableHead>
                  <TableHead className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Level</TableHead>
                  <TableHead className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Visibility</TableHead>
                  <TableHead className="text-right font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseList.map((course) => (
                  <TableRow key={course.id} className="group cursor-pointer hover:bg-neutral-50/80 transition-all border-neutral-100" onClick={() => handleOpenCourseTopics(course)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {course.title.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-900 group-hover:text-primary transition-colors">{course.title}</span>
                          <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {course.topics?.length || 0} Modules
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit text-[10px] h-5 bg-white border-neutral-200 font-medium">
                          {institutions.find(i => i.id === course.institutionId)?.name || 'General Access'}
                        </Badge>
                        <span className="text-[10px] text-neutral-400 ml-1">{batches.find(b => b.id === course.batchId)?.name || 'Open Enrollment'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`h-6 gap-1.5 ${course.isLocked ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${course.isLocked ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                        {course.isLocked ? 'Locked' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setViewCourse(course); setIsViewDialogOpen(true); }}>
                          <Eye className="w-4 h-4 text-neutral-500 hover:text-primary" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditCourse(course)}>
                          <Edit className="w-4 h-4 text-neutral-500 hover:text-primary" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 px-3 text-primary font-medium hover:bg-primary/10 rounded-full" onClick={() => handleOpenCourseTopics(course)}>
                          Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {isAdmin && mgmtStep === 'topics' && activeMgmtCourse && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBackToCourses} className="rounded-full h-9 bg-white shadow-sm border-neutral-200">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <h2 className="text-xl font-bold text-neutral-800">{activeMgmtCourse.title} <span className="text-neutral-400 font-normal">/ Topics</span></h2>
            </div>
            <Button size="sm" className="bg-primary shadow-md hover:shadow-lg transition-all rounded-full h-9" onClick={() => {
              const newTopic: Topic = {
                id: `topic-${Date.now()}`,
                title: 'New Topic',
                content: '',
                questions: [],
                isLocked: false,
                durationLocked: false,
                images: [],
              };
              const updatedTopics = [...(activeMgmtCourse.topics || []), newTopic];
              const updatedCourse = { ...activeMgmtCourse, topics: updatedTopics };
              setActiveMgmtCourse(updatedCourse);
              setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
              handleOpenTopicDetails(newTopic, updatedTopics.length - 1);
              toast.success('New topic added');
            }}>
              <Plus className="w-4 h-4 mr-2" /> New Topic
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeMgmtCourse.topics?.map((topic: Topic, idx: number) => (
              <Card key={topic.id} className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white" onClick={() => handleOpenTopicDetails(topic, idx)}>
                <div className={`absolute top-0 left-0 w-1 h-full ${topic.isLocked ? 'bg-red-400' : 'bg-primary'}`} />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 font-bold text-[10px] uppercase tracking-wider">Module {idx + 1}</Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full bg-neutral-50 hover:bg-white" onClick={(e) => {
                        e.stopPropagation();
                        const updated = activeMgmtCourse.topics.map((t: any, i: number) =>
                          i === idx ? { ...t, isLocked: !t.isLocked } : t
                        );
                        const updatedCourse = { ...activeMgmtCourse, topics: updated };
                        setActiveMgmtCourse(updatedCourse);
                        setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                        toast.success(`Topic ${updated[idx].isLocked ? 'locked' : 'unlocked'}`);
                      }}>
                        {topic.isLocked ? <Lock className="w-3.5 h-3.5 text-red-500" /> : <Unlock className="w-3.5 h-3.5 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full bg-neutral-50 hover:bg-red-50" onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
                          const updatedTopics = activeMgmtCourse.topics.filter((_: any, i: number) => i !== idx);
                          const updatedCourse = { ...activeMgmtCourse, topics: updatedTopics };
                          setActiveMgmtCourse(updatedCourse);
                          setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                          toast.success('Topic deleted successfully');
                        }
                      }}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-500 line-clamp-3 mb-6 min-h-[3rem] leading-relaxed">{topic.content || 'Click to add content...'}</p>
                  <div className="flex items-center gap-4 py-3 border-t border-neutral-50">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                      <FileText className="w-3.5 h-3.5" /> {topic.questions?.length || 0} Questions
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                      <Clock className="w-3.5 h-3.5" /> {topic.accessDuration || 'Unlimited'}
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 py-3 bg-neutral-50/50 flex justify-end">
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Configure Topic <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            ))}

            <Card className="border-2 border-dashed border-neutral-200 bg-neutral-50/30 flex flex-col items-center justify-center p-12 text-neutral-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              onClick={() => {
                const newTopic: Topic = {
                  id: `topic-${Date.now()}`,
                  title: 'New Topic',
                  content: '',
                  questions: [],
                  isLocked: false,
                  durationLocked: false,
                  images: [],
                };
                const updatedTopics = [...(activeMgmtCourse.topics || []), newTopic];
                const updatedCourse = { ...activeMgmtCourse, topics: updatedTopics };
                setActiveMgmtCourse(updatedCourse);
                setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                handleOpenTopicDetails(newTopic, updatedTopics.length - 1);
                toast.success('New topic added');
              }}>
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-bold text-sm tracking-wide">Add New Module</span>
            </Card>
          </div>
        </div>
      )}

      {isAdmin && mgmtStep === 'details' && activeMgmtTopic && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBackToTopics} className="rounded-full h-9 bg-white shadow-sm border-neutral-200">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
            </Button>
            <h2 className="text-xl font-bold text-neutral-800">Topic Configuration <span className="text-neutral-400 font-normal">/ {activeMgmtTopic.title}</span></h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full h-9" onClick={() => {
              const deadline = prompt('Enter deadline for this topic (e.g., 2024-12-31):', activeMgmtTopic.deadline || '');
              if (deadline) {
                const updated = activeMgmtCourse.topics.map((t: any, i: number) =>
                  i === activeMgmtTopicIndex ? { ...t, deadline } : t
                );
                const updatedCourse = { ...activeMgmtCourse, topics: updated };
                setActiveMgmtCourse(updatedCourse);
                setActiveMgmtTopic({ ...activeMgmtTopic, deadline });
                setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                toast.success(`Deadline set to ${deadline}`);
              }
            }}>
              <Clock className="w-4 h-4 mr-2" /> Set Deadlines
            </Button>
            <Button size="sm" onClick={handleOpenAssessment} className="bg-primary shadow-md hover:shadow-lg transition-all rounded-full h-9 px-6">
              Manage Assessment <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-neutral-900 text-white pb-8">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-white/20 text-white border-none backdrop-blur-md">Module Content</Badge>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-neutral-400">Status:</span>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 transition-all"
                        onClick={() => {
                          const updated = activeMgmtCourse.topics.map((t: any, i: number) =>
                            i === activeMgmtTopicIndex ? { ...t, isLocked: !t.isLocked } : t
                          );
                          const updatedCourse = { ...activeMgmtCourse, topics: updated };
                          setActiveMgmtCourse(updatedCourse);
                          setActiveMgmtTopic({ ...activeMgmtTopic, isLocked: !activeMgmtTopic.isLocked });
                          toast.success(`Module ${!activeMgmtTopic.isLocked ? 'Locked' : 'Unlocked'}`);
                        }}>
                        {activeMgmtTopic.isLocked ? (
                          <><Lock className="w-4 h-4 text-red-400" /> <span className="text-xs font-bold text-red-400">LOCKED</span></>
                        ) : (
                          <><Unlock className="w-4 h-4 text-green-400" /> <span className="text-xs font-bold text-green-400">ACCESSIBLE</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/10"
                        onClick={() => {
                          const updated = activeMgmtCourse.topics.map((t: any, i: number) =>
                            i === activeMgmtTopicIndex ? { ...t, durationLocked: !t.durationLocked } : t
                          );
                          const updatedCourse = { ...activeMgmtCourse, topics: updated };
                          setActiveMgmtCourse(updatedCourse);
                          setActiveMgmtTopic({ ...activeMgmtTopic, durationLocked: !activeMgmtTopic.durationLocked });
                          toast.success(`Duration ${!activeMgmtTopic.durationLocked ? 'Locked' : 'Unlocked'}`);
                        }}>
                        {activeMgmtTopic.durationLocked ? (
                          <><Lock className="w-3.5 h-3.5 text-orange-400" /> <span className="text-[10px] font-bold text-orange-400">DURATION LOCKED</span></>
                        ) : (
                          <><Unlock className="w-3.5 h-3.5 text-green-400" /> <span className="text-[10px] font-bold text-green-400">DURATION OPEN</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{activeMgmtTopic.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Detailed Description</Label>
                      <Badge variant="outline" className="text-[9px] border-neutral-200">Supports Markdown</Badge>
                    </div>
                    <Textarea
                      value={activeMgmtTopic.content}
                      onChange={(e) => setActiveMgmtTopic({ ...activeMgmtTopic, content: e.target.value })}
                      placeholder="Enter detailed topic description, learning objectives, and key takeaways..."
                      rows={12}
                      className="leading-relaxed border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-neutral-700 resize-none scrollbar-thin"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                        <ImageIcon className="w-4 h-4" /> Reference & Concept Images
                      </Label>
                      <Button variant="secondary" size="sm" className="h-8 text-xs font-bold rounded-full" onClick={() => {
                        const mockImg = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600";
                        const updatedImgs = [...(activeMgmtTopic.images || []), mockImg];
                        setActiveMgmtTopic({ ...activeMgmtTopic, images: updatedImgs });
                        toast.success("Image added to gallery");
                      }}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Image
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {activeMgmtTopic.images?.map((img: string, i: number) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border shadow-sm h-40">
                          <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/20" onClick={() => window.open(img)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-red-500/80" onClick={() => {
                              const updated = activeMgmtTopic.images.filter((_: any, idx: number) => idx !== i);
                              setActiveMgmtTopic({ ...activeMgmtTopic, images: updated });
                            }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {(!activeMgmtTopic.images || activeMgmtTopic.images.length === 0) && (
                        <div className="col-span-full py-12 border-2 border-dashed border-neutral-100 rounded-xl flex flex-col items-center justify-center text-neutral-300 bg-neutral-50/50">
                          <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                          <p className="text-xs font-medium uppercase tracking-wider">No concept images added</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 bg-neutral-50/80 border-t flex justify-end gap-3">
                  <Button variant="ghost" onClick={handleBackToTopics} className="font-bold text-xs uppercase tracking-widest text-neutral-400">Discard</Button>
                  <Button onClick={() => {
                    const updatedTopics = activeMgmtCourse.topics.map((t: any, i: number) =>
                      i === activeMgmtTopicIndex ? activeMgmtTopic : t
                    );
                    const updatedCourse = { ...activeMgmtCourse, topics: updatedTopics };
                    setActiveMgmtCourse(updatedCourse);
                    setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                    toast.success("Topic configuration synced");
                    handleBackToTopics();
                  }} className="px-8 font-bold">Save Module</Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-400">Topic Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-600">Total Questions</span>
                    <span className="text-xl font-bold text-primary">{activeMgmtTopic.questions?.length || 0}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-600">Access Duration</span>
                      <span className="text-sm font-bold text-orange-600">{activeMgmtTopic.accessDuration || 'Unlimited'}</span>
                    </div>
                    <Input
                      placeholder="e.g. 2h 30m"
                      value={activeMgmtTopic.accessDuration || ''}
                      onChange={(e) => setActiveMgmtTopic({ ...activeMgmtTopic, accessDuration: e.target.value })}
                      className="h-7 text-[10px] bg-white border-orange-200"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-600">Estimated Effort</span>
                    <span className="text-sm font-bold text-green-600">45 Minutes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden relative">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Manage Assessment</CardTitle>
                  <CardDescription className="text-white/70">Create MCQs and Coding problems for this module</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full font-bold shadow-md hover:shadow-lg transition-all" onClick={handleOpenAssessment}>
                    Open Question Builder
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {
        isAdmin && mgmtStep === 'assessment' && activeMgmtTopic && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleBackToDetails}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Topic Details
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openExistingQuestionDialog(activeMgmtTopicIndex)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Existing Question
                </Button>
                <Button size="sm" onClick={() => {
                  // Scroll to create section or open dialog
                  setCurrentQuestion({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: '',
                    type: 'mcq',
                    starterCode: '',
                    expectedOutput: '',
                    testCases: [],
                  });
                  toast.info("Prepare to create a new question below");
                }}>
                  <Plus className="w-4 h-4 mr-2" /> Create New Question
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Questions ({activeMgmtTopic.questions?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeMgmtTopic.questions?.map((q: TopicQuestion, i: number) => (
                        <div key={q.id} className="p-4 border rounded-lg hover:border-primary transition-colors bg-neutral-50 shadow-sm relative group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="capitalize">{q.type?.replace('_', ' ')}</Badge>
                                <span className="text-xs text-neutral-500 italic">Question {i + 1}</span>
                              </div>
                              <p className="font-medium text-neutral-800">{q.question}</p>

                              {q.type === 'multiple_choice' && q.options && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {q.options.map((opt, idx) => (
                                    <div key={idx} className={`p-2 rounded text-xs border ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-neutral-200 text-neutral-600'}`}>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {q.type === 'coding' && (
                                <div className="mt-3 space-y-2">
                                  <div className="text-[10px] font-mono bg-neutral-800 text-white p-2 rounded overflow-x-auto">
                                    {q.starterCode?.substring(0, 100)}...
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary" className="text-[10px] h-5">{q.testCases?.length || 0} Test Cases</Badge>
                                    <Badge variant="outline" className="text-[10px] h-5 border-yellow-200 text-yellow-700">{q.testCases?.filter(tc => tc.hidden).length || 0} Hidden</Badge>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                setEditingQuestionId(q.id);
                                setCurrentQuestion({
                                  question: q.question,
                                  options: q.options || ['', '', '', ''],
                                  correctAnswer: q.correctAnswer || '',
                                  type: q.type === 'multiple_choice' ? 'mcq' : 'coding',
                                  starterCode: q.starterCode || '',
                                  expectedOutput: q.expectedOutput || '',
                                  testCases: (q.testCases || []).map((tc: any) => ({
                                    input: tc.input || '',
                                    expectedOutput: tc.expectedOutput || '',
                                    hidden: !!tc.hidden
                                  }))
                                });
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => {
                                const updatedQs = activeMgmtTopic.questions.filter((_: any, idx: number) => idx !== i);
                                setActiveMgmtTopic({ ...activeMgmtTopic, questions: updatedQs });
                                toast.info("Question removed from assessment");
                              }}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!activeMgmtTopic.questions || activeMgmtTopic.questions.length === 0) && (
                        <div className="text-center py-12 text-neutral-400">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p>No questions added to this assessment yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Create Question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Question Type</Label>
                      <Select
                        value={currentQuestion.type}
                        onValueChange={(val: any) => setCurrentQuestion({ ...currentQuestion, type: val === 'mcq' ? 'mcq' : 'coding' })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Question Text</Label>
                      <Textarea
                        className="text-xs min-h-[80px]"
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        placeholder="Write your question here..."
                      />
                    </div>

                    {currentQuestion.type === 'mcq' ? (
                      <div className="space-y-3">
                        <Label className="text-xs">Options</Label>
                        {currentQuestion.options.map((opt, i) => (
                          <div key={i} className="flex gap-2">
                            <Input
                              value={opt}
                              placeholder={`Option ${i + 1}`}
                              className="h-8 text-xs"
                              onChange={(e) => {
                                const updated = [...currentQuestion.options];
                                updated[i] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, options: updated });
                              }}
                            />
                          </div>
                        ))}
                        <div className="pt-2">
                          <Label className="text-xs">Correct Answer</Label>
                          <Select
                            value={currentQuestion.correctAnswer}
                            onValueChange={(val) => setCurrentQuestion({ ...currentQuestion, correctAnswer: val })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select correct option" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentQuestion.options.filter(o => o.trim()).map((opt, i) => (
                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Starter Code</Label>
                          <Textarea
                            className="font-mono text-[10px] min-h-[120px] bg-neutral-900 text-white"
                            value={currentQuestion.starterCode}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, starterCode: e.target.value })}
                            placeholder="public class Test { ... }"
                          />
                        </div>

                        <div className="space-y-2 border-t pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-bold">Test Cases</Label>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={handleAddTestCase}>
                              <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                            {currentQuestion.testCases.map((tc, i) => (
                              <div key={i} className="p-2 border rounded bg-neutral-50 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">Case {i + 1}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="checkbox"
                                        checked={tc.hidden}
                                        onChange={(e) => handleTestCaseChange(i, 'hidden', e.target.checked)}
                                        className="h-3 w-3"
                                      />
                                      <span className="text-[10px]">Hidden</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-500" onClick={() => handleRemoveTestCase(i)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <Input
                                  placeholder="Input"
                                  className="h-7 text-[10px]"
                                  value={tc.input}
                                  onChange={(e) => handleTestCaseChange(i, 'input', e.target.value)}
                                />
                                <Input
                                  placeholder="Expected Output"
                                  className="h-7 text-[10px]"
                                  value={tc.expectedOutput}
                                  onChange={(e) => handleTestCaseChange(i, 'expectedOutput', e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <Button className="w-full mt-4" onClick={() => {
                      if (!currentQuestion.question) return toast.error("Please enter a question");

                      let finalQ: TopicQuestion = {
                        id: editingQuestionId || `q-${Date.now()}`,
                        question: currentQuestion.question,
                        type: currentQuestion.type === 'mcq' ? 'multiple_choice' : 'coding'
                      };

                      if (currentQuestion.type === 'mcq') {
                        if (!currentQuestion.correctAnswer) return toast.error("Please select a correct answer");
                        finalQ.options = currentQuestion.options.filter(o => o.trim());
                        finalQ.correctAnswer = currentQuestion.correctAnswer;
                      } else {
                        if (!currentQuestion.starterCode) return toast.error("Please enter starter code");
                        finalQ.starterCode = currentQuestion.starterCode;
                        finalQ.testCases = currentQuestion.testCases;
                      }

                      let updatedQs;
                      if (editingQuestionId) {
                        updatedQs = activeMgmtTopic.questions.map((q: any) => q.id === editingQuestionId ? finalQ : q);
                        toast.success("Question updated");
                      } else {
                        updatedQs = [...(activeMgmtTopic.questions || []), finalQ];
                        toast.success("Question created and added to topic");
                      }

                      setActiveMgmtTopic({ ...activeMgmtTopic, questions: updatedQs });

                      // Reset current question
                      setCurrentQuestion({
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: '',
                        type: 'mcq',
                        starterCode: '',
                        expectedOutput: '',
                        testCases: [],
                      });
                      setEditingQuestionId(null);
                    }}>
                      {editingQuestionId ? 'Update Question' : 'Add to Assessment'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-neutral-100 p-4 -mx-6 rounded-b-lg shadow-inner">
              <Button variant="outline" onClick={handleBackToDetails}>Finish Later</Button>
              <Button className="bg-primary text-white" onClick={() => {
                const updatedTopics = activeMgmtCourse.topics.map((t: any, i: number) =>
                  i === activeMgmtTopicIndex ? activeMgmtTopic : t
                );
                const updatedCourse = { ...activeMgmtCourse, topics: updatedTopics };
                setActiveMgmtCourse(updatedCourse);
                setCourseList(courseList.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                toast.success("Assessment configuration saved");
                handleBackToTopics();
              }}>Complete Setup</Button>
            </div>
          </div>
        )}


      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information and curriculum
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-institution">Institution</Label>
                <Select value={newCourse.institutionId} onValueChange={(val) => setNewCourse({ ...newCourse, institutionId: val, batchId: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map(inst => (
                      <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-batch">Batch</Label>
                <Select
                  value={newCourse.batchId}
                  onValueChange={(val) => setNewCourse({ ...newCourse, batchId: val })}
                  disabled={!newCourse.institutionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-title">Course Title</Label>
              <Input
                id="edit-title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-level">Level</Label>
                <Select value={newCourse.level} onValueChange={(value: any) => setNewCourse({ ...newCourse, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                />
              </div>
            </div>

            {/* Topics Management in Edit */}
            <div className="border rounded-lg p-4 bg-neutral-50 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Curriculum
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>New Topic Title</Label>
                    <Input
                      value={currentTopic.title}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                      placeholder="e.g., Introduction to React Hooks"
                    />
                  </div>
                  <div>
                    <Label>Topic Content</Label>
                    <Textarea
                      value={currentTopic.content}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, content: e.target.value })}
                      placeholder="Brief overview of what will be covered..."
                      rows={2}
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" className="w-fit" onClick={handleAddTopic}>
                    <Plus className="w-4 h-4 mr-2" /> Add Topic
                  </Button>
                </div>
              </div>

              {newCourse.topics.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  {newCourse.topics.map((topic, tIdx) => (
                    <AccordionItem key={topic.id} value={topic.id}>
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center gap-2">
                          {topic.isLocked ? (
                            <Lock className="w-3 h-3 text-red-500" />
                          ) : (
                            <Unlock className="w-3 h-3 text-green-500" />
                          )}
                          {topic.title} ({topic.questions.length} Qs)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between bg-neutral-100 p-2 rounded mb-2">
                          <span className="text-xs font-medium">Topic Status: {topic.isLocked ? 'Locked' : 'Unlocked'}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => handleTopicToggleLock(tIdx)}
                          >
                            {topic.isLocked ? 'Unlock Topic' : 'Lock Topic'}
                          </Button>
                        </div>
                        <p className="text-xs text-neutral-600 mb-4">{topic.content}</p>

                        <div className="border-t pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Add Assessment Question</Label>
                            <Select
                              value={currentQuestion.type}
                              onValueChange={(val: 'mcq' | 'coding') => setCurrentQuestion({ ...currentQuestion, type: val })}
                            >
                              <SelectTrigger className="h-6 w-32 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mcq">MCQ</SelectItem>
                                <SelectItem value="coding">Coding</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Input
                            placeholder="Question Text"
                            className="text-sm"
                            value={currentQuestion.question}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                          />

                          {currentQuestion.type === 'mcq' ? (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                {currentQuestion.options.map((opt, oIdx) => (
                                  <Input
                                    key={oIdx}
                                    placeholder={`Option ${oIdx + 1}`}
                                    className="text-xs h-8"
                                    value={opt}
                                    onChange={(e) => {
                                      const newOpts = [...currentQuestion.options];
                                      newOpts[oIdx] = e.target.value;
                                      setCurrentQuestion({ ...currentQuestion, options: newOpts });
                                    }}
                                  />
                                ))}
                              </div>
                              <Input
                                placeholder="Correct Answer (must match one option)"
                                className="text-xs h-8"
                                value={currentQuestion.correctAnswer}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                              />
                            </>
                          ) : (
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Starter Code"
                                className="text-xs font-mono"
                                rows={3}
                                value={currentQuestion.starterCode}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, starterCode: e.target.value })}
                              />

                              <div className="space-y-2 bg-neutral-100 p-2 rounded">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-bold">Test Cases</Label>
                                  <Button type="button" size="sm" variant="ghost" className="h-6 text-xs" onClick={handleAddTestCase}>
                                    <Plus className="w-3 h-3 mr-1" /> Add Case
                                  </Button>
                                </div>
                                {currentQuestion.testCases.map((tc, tcIdx) => (
                                  <div key={tcIdx} className="grid grid-cols-12 gap-2 items-start text-xs border-b border-neutral-200 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                                    <div className="col-span-5 space-y-1">
                                      <Input
                                        placeholder="Input"
                                        className="h-7 text-xs"
                                        value={tc.input}
                                        onChange={(e) => handleTestCaseChange(tcIdx, 'input', e.target.value)}
                                      />
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="checkbox"
                                          id={`edit-hidden-${tcIdx}`}
                                          checked={tc.hidden}
                                          onChange={(e) => handleTestCaseChange(tcIdx, 'hidden', e.target.checked)}
                                        />
                                        <label htmlFor={`edit-hidden-${tcIdx}`} className="text-[10px] text-neutral-500">Hidden Case</label>
                                      </div>
                                    </div>
                                    <div className="col-span-5">
                                      <Input
                                        placeholder="Expected Output"
                                        className="h-7 text-xs"
                                        value={tc.expectedOutput}
                                        onChange={(e) => handleTestCaseChange(tcIdx, 'expectedOutput', e.target.value)}
                                      />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                      <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => handleRemoveTestCase(tcIdx)}>
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="w-full h-8 text-xs"
                            onClick={() => handleAddQuestion(tIdx)}
                          >
                            Add {currentQuestion.type === 'mcq' ? 'MCQ' : 'Coding'} Question
                          </Button>
                        </div>

                        {topic.questions.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-[10px] font-bold uppercase text-neutral-400">Current Questions ({topic.questions.length})</p>
                            <div className="space-y-2">
                              {topic.questions.map((q, qIdx) => (
                                <div key={q.id} className="text-xs p-2 bg-white border rounded flex justify-between items-start">
                                  <span>{qIdx + 1}. {q.question}</span>
                                  <Badge variant="secondary" className="text-[9px] h-4">
                                    Ans: {q.correctAnswer}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse} style={{ backgroundColor: 'var(--color-primary)' }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Set up a new course with curriculum and assessments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-institution">Institution</Label>
                <Select value={newCourse.institutionId} onValueChange={(val) => setNewCourse({ ...newCourse, institutionId: val, batchId: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map(inst => (
                      <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-batch">Batch</Label>
                <Select
                  value={newCourse.batchId}
                  onValueChange={(val) => setNewCourse({ ...newCourse, batchId: val })}
                  disabled={!newCourse.institutionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="create-title">Course Title</Label>
              <Input
                id="create-title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-level">Level</Label>
                <Select value={newCourse.level} onValueChange={(value: any) => setNewCourse({ ...newCourse, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-duration">Duration</Label>
                <Input
                  id="create-duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                />
              </div>
            </div>

            {/* Topics Management in Create */}
            <div className="border rounded-lg p-4 bg-neutral-50 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Curriculum
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>New Topic Title</Label>
                    <Input
                      value={currentTopic.title}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                      placeholder="e.g., Introduction to React Hooks"
                    />
                  </div>
                  <div>
                    <Label>Topic Content</Label>
                    <Textarea
                      value={currentTopic.content}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, content: e.target.value })}
                      placeholder="Brief overview of what will be covered..."
                      rows={2}
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" className="w-fit" onClick={handleAddTopic}>
                    <Plus className="w-4 h-4 mr-2" /> Add Topic
                  </Button>
                </div>
              </div>

              {newCourse.topics.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  {newCourse.topics.map((topic, tIdx) => (
                    <AccordionItem key={topic.id} value={topic.id}>
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center gap-2">
                          {topic.isLocked ? (
                            <Lock className="w-3 h-3 text-red-500" />
                          ) : (
                            <Unlock className="w-3 h-3 text-green-500" />
                          )}
                          {topic.title} ({topic.questions.length} Qs)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between bg-neutral-100 p-2 rounded mb-2">
                          <span className="text-xs font-medium">Topic Status: {topic.isLocked ? 'Locked' : 'Unlocked'}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => handleTopicToggleLock(tIdx)}
                          >
                            {topic.isLocked ? 'Unlock Topic' : 'Lock Topic'}
                          </Button>
                        </div>
                        <p className="text-xs text-neutral-600 mb-4">{topic.content}</p>

                        <div className="border-t pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Add Assessment Question</Label>
                            <Select
                              value={currentQuestion.type}
                              onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, type: value as 'mcq' | 'coding' })}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mcq">MCQ</SelectItem>
                                <SelectItem value="coding">Coding</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Question</Label>
                            <Textarea
                              value={currentQuestion.question}
                              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                              placeholder="Enter your question..."
                              rows={2}
                              className="text-sm"
                            />
                          </div>

                          {currentQuestion.type === 'mcq' ? (
                            <div className="space-y-2">
                              <Label className="text-xs">Options</Label>
                              {currentQuestion.options.map((opt, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <Input
                                    value={opt}
                                    onChange={(e) => {
                                      const newOpts = [...currentQuestion.options];
                                      newOpts[idx] = e.target.value;
                                      setCurrentQuestion({ ...currentQuestion, options: newOpts });
                                    }}
                                    placeholder={`Option ${idx + 1}`}
                                    className="text-sm"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newOpts = currentQuestion.options.filter((_, i) => i !== idx);
                                      setCurrentQuestion({ ...currentQuestion, options: newOpts });
                                    }}
                                    className="px-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, ''] })}
                                className="w-fit"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Option
                              </Button>
                              <div>
                                <Label className="text-xs">Correct Answer</Label>
                                <Select
                                  value={currentQuestion.correctAnswer}
                                  onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select correct answer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currentQuestion.options.map((opt, idx) => (
                                      <SelectItem key={idx} value={opt}>{opt || `Option ${idx + 1}`}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div>
                                <Label className="text-xs">Starter Code</Label>
                                <Textarea
                                  value={currentQuestion.starterCode || ''}
                                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, starterCode: e.target.value })}
                                  placeholder="Provide starter code..."
                                  rows={3}
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Expected Output</Label>
                                <Textarea
                                  value={currentQuestion.expectedOutput || ''}
                                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, expectedOutput: e.target.value })}
                                  placeholder="Expected output..."
                                  rows={2}
                                  className="font-mono text-sm"
                                />
                              </div>
                            </div>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddQuestion(tIdx)}
                            className="w-fit"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Question
                          </Button>

                          {topic.questions.length > 0 && (
                            <div className="border-t pt-3 space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Questions ({topic.questions.length})</Label>
                              <div className="space-y-2">
                                {topic.questions.map((q, qIdx) => (
                                  <div key={qIdx} className="flex items-start justify-between p-2 bg-white rounded border">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">{q.question}</p>
                                      <div className="flex gap-2 items-center mt-1">
                                        <Badge variant="outline" className="text-[10px] h-5">{q.type === 'coding' ? 'Coding' : 'MCQ'}</Badge>
                                        {q.type === 'mcq' && <span className="text-xs text-neutral-500">Ans: {q.correctAnswer}</span>}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveQuestion(tIdx, qIdx)}
                                      className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} style={{ backgroundColor: 'var(--color-primary)' }}>
                Create Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enrolled Courses */}
      {
        !isAdmin && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h3 className="mb-4 text-2xl font-bold">My Courses</h3>
            <div className={`grid gap-6 ${currentUser?.role === 'student' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {(currentUser?.role === 'student' ? courses.slice(0, 1) : courses.slice(0, 2)).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="mt-2">{course.description}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          course.level === 'beginner'
                            ? 'border-green-300 text-green-700'
                            : course.level === 'intermediate'
                              ? 'border-yellow-300 text-yellow-700'
                              : 'border-red-300 text-red-700'
                        }
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Course Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-3 border-y border-neutral-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Duration</span>
                        </div>
                        <p className="text-sm">{course.duration}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600 mb-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Lessons</span>
                        </div>
                        <p className="text-sm">{course.lessons}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span>Students</span>
                        </div>
                        <p className="text-sm">{course.enrolled}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className={`grid gap-2 ${currentUser?.role === 'student' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      <Button className="w-full" style={{ backgroundColor: 'var(--color-primary)' }} onClick={() => onNavigate('course-modules', course)}>
                        View Modules
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      {currentUser?.role === 'student' && (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => onNavigate('course-tests', { course })}
                        >
                          View Tests
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      }

      {/* View Course Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewCourse?.title}</DialogTitle>
            <DialogDescription>{viewCourse?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 font-medium uppercase">Level</span>
                {viewCourse && getLevelBadge(viewCourse.level)}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 font-medium uppercase">Duration</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  {viewCourse?.duration}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 font-medium uppercase">Enrolled</span>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4" />
                  {viewCourse?.enrolled}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Curriculum
              </h3>
              {viewCourse?.topics && viewCourse.topics.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {viewCourse.topics.map((topic: Topic) => (
                    <AccordionItem key={topic.id} value={topic.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          {topic.isLocked ? (
                            <Lock className="w-4 h-4 text-red-500" />
                          ) : (
                            <Unlock className="w-4 h-4 text-green-500" />
                          )}
                          <span>{topic.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="flex flex-col gap-6 p-4">

                          {/* 1. Precise Topic Content */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-1">Topic Overview</h4>
                            <div className="bg-neutral-50 p-4 rounded-lg border text-sm text-neutral-700 leading-relaxed shadow-sm">
                              {topic.content}
                            </div>
                            {topic.images && topic.images.length > 0 && (
                              <div className="flex gap-4 overflow-x-auto py-2">
                                {topic.images.map((img, i) => (
                                  <img key={i} src={img} alt={`Topic Reference ${i + 1}`} className="h-48 rounded-lg border shadow-sm object-cover" />
                                ))}
                              </div>
                            )}
                          </div>


                          {/* 2. Assessment / Questions */}
                          {topic.questions.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-1">Assessment ({topic.questions.length} Questions)</h4>
                              <div className="grid gap-4">
                                {topic.questions.map((q, idx) => (
                                  <Card key={q.id} className="border-neutral-200">
                                    <CardContent className="pt-4">
                                      <div className="flex gap-2">
                                        <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 shrink-0 bg-neutral-100">
                                          {idx + 1}
                                        </Badge>
                                        <div className="flex-1 space-y-3">
                                          <p className="font-medium text-sm">{q.question}</p>

                                          {/* MCQ Options */}
                                          {q.options && q.options.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                              {q.options.map((opt, oIdx) => (
                                                <div
                                                  key={oIdx}
                                                  className={`text-xs p-3 rounded-md border flex items-center gap-2 ${opt === q.correctAnswer
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : 'bg-white hover:bg-neutral-50'
                                                    }`}
                                                >
                                                  <div className={`w-3 h-3 rounded-full border ${opt === q.correctAnswer ? 'bg-green-500 border-green-500' : 'border-neutral-300'}`} />
                                                  {opt}
                                                  {opt === q.correctAnswer && <span className="ml-auto text-[10px] uppercase font-bold text-green-600">Correct</span>}
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            /* Coding Question Details */
                                            <div className="space-y-2 bg-neutral-900 text-neutral-300 p-3 rounded-md text-xs font-mono">
                                              <div>
                                                <span className="text-neutral-500 uppercase text-[10px]">Starter Code:</span>
                                                <pre className="mt-1 overflow-x-auto text-green-400">{q.starterCode}</pre>
                                              </div>
                                              <div className="border-t border-neutral-800 pt-2 mt-2">
                                                <span className="text-neutral-500 uppercase text-[10px]">Expected Output:</span>
                                                <pre className="mt-1 text-yellow-400">{q.expectedOutput}</pre>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Practice Code Template (Like Programiz) */}
                          <div className="pt-4 border-t">
                            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary mb-4">
                              <Code className="w-4 h-4" />
                              Practice Playground
                            </h4>
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                              <CodePracticeConsole className="min-h-[400px]" />
                            </div>
                          </div>

                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

              ) : (
                <p className="text-sm text-neutral-500 italic">No topics added to this course yet.</p>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isSelectQuestionOpen} onOpenChange={setIsSelectQuestionOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-full">
          <DialogHeader>
            <DialogTitle>Select Existing Question</DialogTitle>
            <DialogDescription>
              Choose a question from the library to add to your topic.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-neutral-500" />
              <Input
                placeholder="Search questions..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="border rounded-md divide-y max-h-[60vh] overflow-y-auto">
              {allQuestions
                .filter(q => q.question.toLowerCase().includes(questionSearch.toLowerCase()))
                .map((q) => (
                  <div key={q.id} className="p-3 flex items-start justify-between hover:bg-neutral-50 transition-colors">
                    <div className="space-y-1 flex-1 mr-4">
                      <p className="text-sm font-medium line-clamp-2">{q.question}</p>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="text-[10px] h-5">{q.type === 'coding' ? 'Coding' : 'MCQ'}</Badge>
                        {/* @ts-ignore */}
                        {q.type === 'mcq' && <span className="text-xs text-neutral-500 truncate max-w-[200px]">Ans: {q.correctAnswer}</span>}
                        {/* @ts-ignore */}
                        {q.type === 'coding' && <span className="text-xs text-neutral-500 font-mono">Input/Output</span>}
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleSelectExistingQuestion(q)}>
                      Select
                    </Button>
                  </div>
                ))}
              {allQuestions.length === 0 && (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  No questions found in library.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
