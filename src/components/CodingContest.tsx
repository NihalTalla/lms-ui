import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trophy, Plus, Clock, Users, Code, Trash2, Eye, ArrowRight, ArrowLeft, Search, CheckCircle2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useContestNotification } from './ContestNotification';
import { loadContests, saveContests, Contest as StoreContest, Question as StoreQuestion } from '../lib/contest-store';

interface Question {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    points: number;
    type: 'coding' | 'mcq';
    options?: string[];
    correctAnswer?: string;
}
interface Contest { id: string; name: string; description: string; totalQuestions: number; startTime: string; endTime: string; status: 'draft' | 'scheduled' | 'active' | 'completed'; participants: number; questions: Question[]; createdAt?: string; duration?: string; }

export function CodingContest() {
    const { addNotification } = useContestNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showQuestionDialog, setShowQuestionDialog] = useState(false);
    const [showNextQuestionPrompt, setShowNextQuestionPrompt] = useState(false);
    const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [questionMode, setQuestionMode] = useState<'fetch' | 'create' | null>(null);
    const [newContest, setNewContest] = useState({ name: '', description: '', startTime: '', endTime: '', selectedQuestions: [] as string[] });
    const [newQuestion, setNewQuestion] = useState({
        title: '',
        difficulty: 'medium' as 'easy' | 'medium' | 'hard',
        topic: '',
        points: 100,
        type: 'coding' as 'coding' | 'mcq',
        options: ['', '', '', ''],
        correctAnswer: '',
    });

    const [questionBank, setQuestionBank] = useState<Question[]>([
        { id: '1', title: 'Two Sum', difficulty: 'easy', topic: 'Arrays', points: 50, type: 'coding' },
        { id: '2', title: 'Valid Parentheses', difficulty: 'easy', topic: 'Stacks', points: 50, type: 'coding' },
        { id: '3', title: 'Binary Search', difficulty: 'easy', topic: 'Searching', points: 50, type: 'coding' },
        { id: '4', title: 'Merge Intervals', difficulty: 'medium', topic: 'Arrays', points: 100, type: 'coding' },
        { id: '5', title: 'LRU Cache', difficulty: 'medium', topic: 'Design', points: 100, type: 'coding' },
        { id: '6', title: 'Longest Substring', difficulty: 'medium', topic: 'Strings', points: 100, type: 'coding' },
        { id: '7', title: 'Median of Arrays', difficulty: 'hard', topic: 'Arrays', points: 150, type: 'coding' },
        { id: '8', title: 'Word Ladder', difficulty: 'hard', topic: 'Graphs', points: 150, type: 'coding' },
        { id: 'mcq-1', title: 'Time Complexity of Binary Search', difficulty: 'easy', topic: 'Complexity', points: 30, type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctAnswer: 'O(log n)' },
    ]);

    const defaultContests: Contest[] = [
        { id: '1', name: 'Weekly Challenge #1', description: 'Weekly coding challenge', totalQuestions: 5, startTime: '2026-01-25 09:00', endTime: '2026-01-25 12:00', status: 'scheduled', participants: 45, questions: questionBank.slice(0, 5) },
        { id: '2', name: 'DSA Sprint', description: 'DSA sprint contest', totalQuestions: 8, startTime: '2026-01-20 10:00', endTime: '2026-01-20 14:00', status: 'active', participants: 120, questions: questionBank.slice(0, 8) },
        { id: '3', name: 'Beginner Contest', description: 'For beginners', totalQuestions: 4, startTime: '2026-01-15 09:00', endTime: '2026-01-15 11:00', status: 'completed', participants: 85, questions: questionBank.slice(0, 4) },
    ];

    const [contests, setContests] = useState<Contest[]>(() => {
        const stored = loadContests();
        return stored.length > 0 ? (stored as any) : defaultContests;
    });

    React.useEffect(() => {
        saveContests(contests as any);
    }, [contests]);

    const filteredContests = contests.filter(c => { const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()); const matchesStatus = statusFilter === 'all' || c.status === statusFilter; return matchesSearch && matchesStatus; });

    const resetForm = () => {
        setNewContest({ name: '', description: '', startTime: '', endTime: '', selectedQuestions: [] });
        setNewQuestion({ title: '', difficulty: 'medium', topic: '', points: 100, type: 'coding', options: ['', '', '', ''], correctAnswer: '' });
        setCurrentStep(1);
        setQuestionMode(null);
    };

    const handleNextStep = () => { if (!newContest.name || !newContest.startTime || !newContest.endTime) { toast.error('Fill required fields'); return; } if (new Date(newContest.startTime) >= new Date(newContest.endTime)) { toast.error('End time must be after start'); return; } setCurrentStep(2); };

    const handleQuestionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const text = evt.target?.result as string;
                const parsed = JSON.parse(text);
                const questionsArr = Array.isArray(parsed) ? parsed : (parsed.questions || []);
                if (!Array.isArray(questionsArr) || questionsArr.length === 0) {
                    toast.error('No questions found in file');
                    return;
                }
                const mapped: Question[] = questionsArr.map((q: any, idx: number) => ({
                    id: q.id || `upload-${Date.now()}-${idx}`,
                    title: q.title || `Imported Question ${idx + 1}`,
                    difficulty: (q.difficulty || 'medium') as 'easy' | 'medium' | 'hard',
                    topic: q.topic || 'General',
                    points: q.points || 100,
                    type: q.type === 'mcq' ? 'mcq' : 'coding',
                    options: q.options || ['', '', '', ''],
                    correctAnswer: q.correctAnswer || '',
                }));

                setQuestionBank(prev => {
                    const deduped = mapped.filter(m => !prev.some(p => p.id === m.id));
                    return [...prev, ...deduped];
                });
                setNewContest(prev => ({
                    ...prev,
                    selectedQuestions: Array.from(new Set([...(prev.selectedQuestions || []), ...mapped.map(m => m.id)]))
                }));
                toast.success(`Imported ${mapped.length} question(s) from file`);
            } catch {
                toast.error('Unable to read file. Please upload valid JSON with question fields.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleCreateContest = () => {
        if (newContest.selectedQuestions.length === 0) {
            toast.error('Add at least one question');
            return;
        }
        const selectedQs = questionBank.filter(q => newContest.selectedQuestions.includes(q.id));
        const now = new Date();
        const start = new Date(newContest.startTime);
        const end = new Date(newContest.endTime);
        let status: 'draft' | 'scheduled' | 'active' | 'completed' = 'draft';

        if (now >= start && now <= end) status = 'active';
        else if (now < start) status = 'scheduled';
        else if (now > end) status = 'completed';

        const diffMs = end.getTime() - start.getTime();
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        const duration = diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`;

        const contest: Contest = {
            id: String(Date.now()),
            name: newContest.name,
            description: newContest.description,
            totalQuestions: selectedQs.length,
            startTime: newContest.startTime,
            endTime: newContest.endTime,
            status,
            participants: 0,
            questions: selectedQs,
            createdAt: new Date().toISOString(),
            duration
        };
        setContests([contest, ...contests]);

        // Trigger notification to all students
        addNotification({
            id: contest.id,
            contestId: contest.id,
            contestName: contest.name,
            message: contest.description || 'A new coding contest has been created!',
            type: 'new_contest',
            timestamp: Date.now(),
            read: false
        });

        toast.success('Contest created and students notified!');
        setShowCreateDialog(false);
        resetForm();
    };

    const handleAddNewQuestion = () => {
        if (!newQuestion.title || !newQuestion.topic) {
            toast.error('Fill title and topic');
            return;
        }
        if (newQuestion.type === 'mcq') {
            const options = (newQuestion.options || []).map(o => o.trim()).filter(o => o);
            if (options.length < 2) {
                toast.error('Please add at least two options');
                return;
            }
            if (!newQuestion.correctAnswer) {
                toast.error('Select the correct answer');
                return;
            }
            const q: Question = {
                id: `new-${Date.now()}`,
                title: newQuestion.title,
                difficulty: newQuestion.difficulty,
                topic: newQuestion.topic,
                points: newQuestion.points,
                type: 'mcq',
                options,
                correctAnswer: newQuestion.correctAnswer,
            };
            setQuestionBank(prev => [q, ...prev]);
            setNewContest(prev => ({ ...prev, selectedQuestions: [...prev.selectedQuestions, q.id] }));
            toast.success('Question added');
            setNewQuestion({ title: '', difficulty: 'medium', topic: '', points: 100, type: 'coding', options: ['', '', '', ''], correctAnswer: '' });
            setShowNextQuestionPrompt(true);
            return;
        }
        const q: Question = {
            id: `new-${Date.now()}`,
            title: newQuestion.title,
            difficulty: newQuestion.difficulty,
            topic: newQuestion.topic,
            points: newQuestion.points,
            type: 'coding',
        };
        setQuestionBank(prev => [q, ...prev]);
        setNewContest(prev => ({ ...prev, selectedQuestions: [...prev.selectedQuestions, q.id] }));
        toast.success('Question added');
        setNewQuestion({ title: '', difficulty: 'medium', topic: '', points: 100, type: 'coding', options: ['', '', '', ''], correctAnswer: '' });
        setShowNextQuestionPrompt(true);
    };

    const toggleQuestionSelection = (id: string) => { setNewContest(prev => ({ ...prev, selectedQuestions: prev.selectedQuestions.includes(id) ? prev.selectedQuestions.filter(qId => qId !== id) : [...prev.selectedQuestions, id] })); };

    const handleDeleteContest = () => { if (selectedContest) { setContests(contests.filter(c => c.id !== selectedContest.id)); toast.success('Deleted'); setShowDeleteDialog(false); setSelectedContest(null); } };

    const getStatusColor = (s: string) => { switch (s) { case 'active': return 'bg-green-100 text-green-700'; case 'scheduled': return 'bg-blue-100 text-blue-700'; case 'completed': return 'bg-neutral-100 text-neutral-700'; case 'draft': return 'bg-yellow-100 text-yellow-700'; default: return 'bg-neutral-100 text-neutral-700'; } };
    const getDifficultyColor = (d: string) => { switch (d) { case 'easy': return 'bg-green-100 text-green-700'; case 'medium': return 'bg-yellow-100 text-yellow-700'; case 'hard': return 'bg-red-100 text-red-700'; default: return 'bg-neutral-100 text-neutral-700'; } };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-amber-50 border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-neutral-900">Coding Contest</h2>
                        <p className="text-neutral-600 mt-1">Create and manage coding competitions</p>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)} className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-xl shadow-md font-medium" style={{ color: 'white' }}>
                        <Plus className="w-4 h-4 mr-2" style={{ color: 'white' }} />Create Contest
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-neutral-200"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-neutral-600">Total Contests</p><h3 className="mt-1 text-2xl font-bold">{contests.length}</h3></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100"><Trophy className="w-6 h-6 text-blue-600" /></div></div></CardContent></Card>
                    <Card className="shadow-sm border-neutral-200"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-neutral-600">Active</p><h3 className="mt-1 text-2xl font-bold">{contests.filter(c => c.status === 'active').length}</h3></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100"><Clock className="w-6 h-6 text-green-600" /></div></div></CardContent></Card>
                    <Card className="shadow-sm border-neutral-200"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-neutral-600">Participants</p><h3 className="mt-1 text-2xl font-bold">{contests.reduce((sum, c) => sum + c.participants, 0)}</h3></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100"><Users className="w-6 h-6 text-purple-600" /></div></div></CardContent></Card>
                    <Card className="shadow-sm border-neutral-200"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-neutral-600">Questions</p><h3 className="mt-1 text-2xl font-bold">{contests.reduce((sum, c) => sum + c.totalQuestions, 0)}</h3></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100"><Code className="w-6 h-6 text-amber-600" /></div></div></CardContent></Card>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
            </div>

            <Card className="shadow-sm border-neutral-200"><CardHeader><CardTitle>Contests</CardTitle></CardHeader><CardContent>
                {filteredContests.length === 0 ? (<div className="text-center py-12"><Trophy className="w-12 h-12 mx-auto text-neutral-300 mb-4" /><p className="text-neutral-600">No contests found</p></div>) : (
                    <Table><TableHeader><TableRow className="bg-neutral-50"><TableHead>Contest</TableHead><TableHead>Questions</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead>Participants</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>{filteredContests.map(c => (<TableRow key={c.id} className="hover:bg-neutral-50 transition">
                            <TableCell className="font-semibold">{c.name}</TableCell>
                            <TableCell>{c.totalQuestions}</TableCell>
                            <TableCell className="text-sm">{c.startTime}</TableCell>
                            <TableCell className="text-sm">{c.endTime}</TableCell>
                            <TableCell>{c.participants}</TableCell>
                            <TableCell><Badge className={getStatusColor(c.status)}>{c.status}</Badge></TableCell>
                            <TableCell className="text-center">
                                <div className="inline-flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedContest(c); setShowQuestionDialog(true); }}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedContest(c); setShowDeleteDialog(true); }} className="text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>))}</TableBody>
                    </Table>
                )}
            </CardContent></Card>

            <Dialog open={showCreateDialog} onOpenChange={(o) => { setShowCreateDialog(o); if (!o) resetForm(); }}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-neutral-900">Create Contest</DialogTitle>
                        <DialogDescription className="text-neutral-600">
                            Step {currentStep} of 2 · Provide basic details then add questions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center mb-6">
                        <div className={`w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-neutral-50 text-neutral-600'}`}>1</div>
                        <div className="flex-1 mx-3 h-1 bg-neutral-200 rounded-full overflow-hidden">
                            <div className={`h-full bg-blue-600 transition-all`} style={{ width: currentStep === 1 ? '50%' : '100%' }} />
                        </div>
                        <div className={`w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-neutral-50 text-neutral-600'}`}>2</div>
                    </div>

                    {currentStep === 1 && (<div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" />Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Contest Name *</label>
                                <Input placeholder="e.g., Weekly Challenge" value={newContest.name} onChange={(e) => setNewContest(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Description</label>
                                <Textarea placeholder="Describe..." value={newContest.description} onChange={(e) => setNewContest(p => ({ ...p, description: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Start *</label>
                                <Input type="datetime-local" value={newContest.startTime} onChange={(e) => setNewContest(p => ({ ...p, startTime: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">End *</label>
                                <Input type="datetime-local" value={newContest.endTime} onChange={(e) => setNewContest(p => ({ ...p, endTime: e.target.value }))} />
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-800 text-sm border border-blue-100">Tip: keep start and end within the same day for smoother scheduling.</div>
                        <p className="text-sm text-neutral-500">Questions selected: {newContest.selectedQuestions.length}</p>
                    </div>)}

                    {currentStep === 2 && (<div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2"><Code className="w-5 h-5 text-blue-600" />Add Questions</h3>
                        <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                            <p className="text-sm font-medium text-neutral-800">Upload questions file</p>
                            <p className="text-xs text-neutral-600 mb-3">JSON array with fields: title, topic, difficulty, points, type, options, correctAnswer.</p>
                            <Input type="file" accept=".json,.txt" onChange={handleQuestionFileUpload} />
                        </div>
                        {!questionMode && (<div className="grid grid-cols-2 gap-4"><Card className="cursor-pointer hover:border-blue-400" onClick={() => setQuestionMode('fetch')}><CardContent className="pt-6 text-center"><Search className="w-10 h-10 mx-auto text-blue-600 mb-2" /><p className="font-semibold">Fetch Existing</p><p className="text-sm text-neutral-500">From question bank</p></CardContent></Card><Card className="cursor-pointer hover:border-purple-400" onClick={() => setQuestionMode('create')}><CardContent className="pt-6 text-center"><Plus className="w-10 h-10 mx-auto text-purple-600 mb-2" /><p className="font-semibold">Create New</p><p className="text-sm text-neutral-500">Add new question</p></CardContent></Card></div>)}
                        {questionMode === 'fetch' && (<div className="space-y-3"><div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-200"><p className="font-semibold text-lg text-blue-700">Selected: {newContest.selectedQuestions.length}</p><Button variant="outline" size="sm" onClick={() => setQuestionMode(null)} className="hover:bg-neutral-100"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></div><div className="max-h-[500px] overflow-y-auto border rounded-xl shadow-inner scrollbar-thin scrollbar-thumb-neutral-200">{questionBank.map(q => (<div key={q.id} className={`p-4 border-b last:border-0 cursor-pointer hover:bg-blue-50/30 transition-colors flex justify-between items-center ${newContest.selectedQuestions.includes(q.id) ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`} onClick={() => toggleQuestionSelection(q.id)}><div className="flex items-center gap-4"><div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${newContest.selectedQuestions.includes(q.id) ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-sm' : 'border-neutral-300'}`}>{newContest.selectedQuestions.includes(q.id) && <CheckCircle2 className="w-4 h-4" />}</div><div><p className="font-semibold text-neutral-800">{q.title}</p><p className="text-sm text-neutral-500 font-medium">{q.topic} • {q.points}pts</p></div></div><Badge className={`${getDifficultyColor(q.difficulty)} px-3 py-1 rounded-full uppercase text-[10px] tracking-wider`}>{q.difficulty}</Badge></div>))}</div></div>)}
                        {questionMode === 'create' && (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium">New Question</p>
                                    <Button variant="outline" size="sm" onClick={() => setQuestionMode('fetch')}>Back</Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block mb-1">Title *</label>
                                        <Input placeholder="Title" value={newQuestion.title} onChange={(e) => setNewQuestion(p => ({ ...p, title: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block mb-1">Topic *</label>
                                        <Input placeholder="e.g., Arrays" value={newQuestion.topic} onChange={(e) => setNewQuestion(p => ({ ...p, topic: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Difficulty</label>
                                        <Select value={newQuestion.difficulty} onValueChange={(v: 'easy' | 'medium' | 'hard') => setNewQuestion(p => ({ ...p, difficulty: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Points</label>
                                        <Input type="number" value={newQuestion.points} onChange={(e) => setNewQuestion(p => ({ ...p, points: parseInt(e.target.value) || 0 }))} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Type</label>
                                        <Select value={newQuestion.type} onValueChange={(v: 'coding' | 'mcq') => setNewQuestion(p => ({ ...p, type: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="coding">Coding</SelectItem>
                                                <SelectItem value="mcq">MCQ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {newQuestion.type === 'mcq' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block mb-1">Options</label>
                                        {(newQuestion.options || []).map((opt, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const options = [...(newQuestion.options || [])];
                                                        options[idx] = e.target.value;
                                                        const cleaned = options.map(o => o.trim()).filter(o => o);
                                                        const nextCorrect = cleaned.includes(newQuestion.correctAnswer || '') ? newQuestion.correctAnswer : '';
                                                        setNewQuestion(p => ({ ...p, options, correctAnswer: nextCorrect }));
                                                    }}
                                                    placeholder={`Option ${idx + 1}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const options = (newQuestion.options || []).filter((_, i) => i !== idx);
                                                        const cleaned = options.map(o => o.trim()).filter(o => o);
                                                        const nextCorrect = cleaned.includes(newQuestion.correctAnswer || '') ? newQuestion.correctAnswer : '';
                                                        setNewQuestion(p => ({ ...p, options, correctAnswer: nextCorrect }));
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
                                            onClick={() => setNewQuestion(p => ({ ...p, options: [...(p.options || []), ''] }))}
                                            className="w-fit"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />Add Option
                                        </Button>
                                        <div>
                                            <label className="text-sm font-medium block mb-1">Correct Answer</label>
                                            <Select value={newQuestion.correctAnswer} onValueChange={(v) => setNewQuestion(p => ({ ...p, correctAnswer: v }))}>
                                                <SelectTrigger><SelectValue placeholder="Select answer" /></SelectTrigger>
                                                <SelectContent>
                                                    {(newQuestion.options || [])
                                                        .map(o => o.trim())
                                                        .filter(o => o)
                                                        .map((opt, idx) => (
                                                            <SelectItem key={`${opt}-${idx}`} value={opt}>{opt}</SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                                <Button onClick={handleAddNewQuestion} className="w-full" style={{ color: 'white' }}><Plus className="w-4 h-4 mr-2" style={{ color: 'white' }} />Add Question</Button>
                            </div>
                        )}
                    </div>)}

                    <div className="flex justify-between pt-4 border-t">
                        <Button variant="outline" onClick={currentStep === 1 ? () => setShowCreateDialog(false) : () => setCurrentStep(1)} style={{ color: 'oklch(.205 0 0)' }}><ArrowLeft className="w-4 h-4 mr-2" />{currentStep === 1 ? 'Cancel' : 'Previous'}</Button>
                        {currentStep === 1 ? <Button onClick={handleNextStep} style={{ color: 'white' }}>Next<ArrowRight className="w-4 h-4 ml-2" style={{ color: 'white' }} /></Button> : <Button onClick={handleCreateContest} className="bg-green-600 hover:bg-green-700 text-white" style={{ color: 'white' }}><Trophy className="w-4 h-4 mr-2" style={{ color: 'white' }} />Create</Button>}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}><DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle className="text-2xl">{selectedContest?.name} - Questions</DialogTitle></DialogHeader>{selectedContest && (<div className="space-y-4 mt-4">{selectedContest.questions.map((q, i) => (<div key={q.id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-neutral-50 transition-colors shadow-sm"><div className="flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">{i + 1}</span><div><p className="font-bold text-neutral-800 text-lg">{q.title}</p><p className="text-sm text-neutral-500 font-medium italic">{q.topic} • {q.points}pts</p></div></div><Badge className={`${getDifficultyColor(q.difficulty)} px-4 py-1.5 rounded-full text-xs font-semibold`}>{q.difficulty}</Badge></div>))}</div>)}</DialogContent></Dialog>

            <AlertDialog open={showNextQuestionPrompt} onOpenChange={setShowNextQuestionPrompt}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            Question Added Successfully
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-600">
                            The question has been added to your contest. Would you like to add another one now?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end mt-4">
                        <AlertDialogCancel onClick={() => { setShowNextQuestionPrompt(false); setQuestionMode('fetch'); }} className="border-neutral-200">
                            No, View All
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => { setShowNextQuestionPrompt(false); setQuestionMode('create'); }} className="bg-blue-600 hover:bg-blue-700">
                            Yes, Add Another
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete</AlertDialogTitle><AlertDialogDescription>Delete "{selectedContest?.name}"?</AlertDialogDescription></AlertDialogHeader><div className="flex gap-3 justify-end"><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteContest} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></div></AlertDialogContent></AlertDialog>
        </div>
    );
}
