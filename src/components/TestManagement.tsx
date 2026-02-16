import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Eye, Edit, Trash2, Video, AlertCircle, CheckCircle2, Clock, Users, FileCode } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { batches } from '../lib/data';
import { loadTests, saveTests, Test, TestCase, TestQuestion } from '../lib/test-store';
import { toast } from 'sonner';

interface TestManagementProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function TestManagement({ onNavigate }: TestManagementProps) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isTrainer = currentUser?.role === 'trainer';

  const defaultTests: Test[] = [
    {
      id: 'test-1',
      title: 'DSA Midterm Exam',
      batchId: 'batch-1',
      batchName: 'DSA Batch - Fall 2025',
      duration: 120,
      questions: [
        {
          id: 'q1',
          title: 'Two Sum',
          description: 'Given an array of integers...',
          difficulty: 'easy',
          points: 20,
          type: 'coding',
          testCases: [
            { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
            { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: true },
          ],
        },
        {
          id: 'q2',
          title: 'Time Complexity',
          description: 'What is the time complexity of binary search?',
          difficulty: 'easy',
          points: 10,
          type: 'mcq',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
          correctAnswer: 'O(log n)',
        },
      ],
      status: 'active',
      startDate: '2025-01-15T10:00:00',
      endDate: '2025-01-15T12:00:00',
      students: 12,
      flagged: 2,
      createdAt: '2025-01-01T09:00:00Z',
    },
  ];

  const [tests, setTests] = useState<Test[]>(() => {
    const stored = loadTests();
    return stored.length > 0 ? stored : defaultTests;
  });

  const [questionBank] = useState<TestQuestion[]>([
    {
      id: 'bank-1',
      title: 'Reverse Linked List',
      description: 'Given the head of a singly linked list...',
      difficulty: 'medium',
      points: 30,
      type: 'coding',
      testCases: [
        { input: '1->2->3', expectedOutput: '3->2->1', isHidden: false },
      ],
    },
    {
      id: 'bank-2',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters...',
      difficulty: 'easy',
      points: 15,
      type: 'coding',
      testCases: [
        { input: '()[]{}', expectedOutput: 'true', isHidden: false },
      ],
    },
    {
      id: 'bank-3',
      title: 'Stack Usage',
      description: 'Which data structure uses LIFO order?',
      difficulty: 'easy',
      points: 10,
      type: 'mcq',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 'Stack',
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<TestQuestion[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [showNextQuestionPrompt, setShowNextQuestionPrompt] = useState(false);

  const [newQuestion, setNewQuestion] = useState<Partial<TestQuestion>>({
    title: '',
    description: '',
    difficulty: 'easy',
    points: 10,
    type: 'coding',
    testCases: [],
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const [newTest, setNewTest] = useState({
    title: '',
    batchId: '',
    duration: 120,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    saveTests(tests);
  }, [tests]);

  const handleAddExistingQuestion = (question: TestQuestion) => {
    if (selectedQuestions.find(q => q.id === question.id)) {
      toast.error('Question already added to test');
      return;
    }
    setSelectedQuestions([...selectedQuestions, question]);
    toast.success('Question added from bank');
  };

  const handleAddNewQuestion = () => {
    if (!newQuestion.title || !newQuestion.description) {
      toast.error('Please fill in question title and description');
      return;
    }

    if (newQuestion.type === 'mcq') {
      const options = (newQuestion.options || []).map(o => o.trim()).filter(o => o);
      if (options.length < 2) {
        toast.error('Please add at least two options');
        return;
      }
      if (!newQuestion.correctAnswer) {
        toast.error('Please select the correct answer');
        return;
      }
      const question: TestQuestion = {
        id: `new-q-${Date.now()}`,
        title: newQuestion.title as string,
        description: newQuestion.description as string,
        difficulty: newQuestion.difficulty as any,
        points: newQuestion.points as number,
        type: 'mcq',
        options,
        correctAnswer: newQuestion.correctAnswer as string,
      };
      setSelectedQuestions([...selectedQuestions, question]);
      setNewQuestion({
        title: '',
        description: '',
        difficulty: 'easy',
        points: 10,
        type: 'coding',
        testCases: [],
        options: ['', '', '', ''],
        correctAnswer: '',
      });
      // setIsAddingQuestion(false);
      setShowNextQuestionPrompt(true);
      toast.success('New question created and added');
      return;
    }

    const question: TestQuestion = {
      id: `new-q-${Date.now()}`,
      title: newQuestion.title as string,
      description: newQuestion.description as string,
      difficulty: newQuestion.difficulty as any,
      points: newQuestion.points as number,
      type: 'coding',
      testCases: newQuestion.testCases as TestCase[],
    };

    setSelectedQuestions([...selectedQuestions, question]);
    setNewQuestion({
      title: '',
      description: '',
      difficulty: 'easy',
      points: 10,
      type: 'coding',
      testCases: [],
      options: ['', '', '', ''],
      correctAnswer: '',
    });
    // setIsAddingQuestion(false);
    setShowNextQuestionPrompt(true);
    toast.success('New question created and added');
  };

  const handleAddTestCase = () => {
    const testCases = [...(newQuestion.testCases || []), { input: '', expectedOutput: '', isHidden: false }];
    setNewQuestion({ ...newQuestion, testCases });
  };

  const handleUpdateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const testCases = [...(newQuestion.testCases || [])];
    testCases[index] = { ...testCases[index], [field]: value };
    setNewQuestion({ ...newQuestion, testCases });
  };

  const handleRemoveTestCase = (index: number) => {
    const testCases = (newQuestion.testCases || []).filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, testCases });
  };

  const handleCreateTest = () => {
    if (!newTest.title || !newTest.batchId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedQuestions.length === 0) {
      toast.error('Please add at least one question to the test');
      return;
    }

    const batchName = batches.find(b => b.id === newTest.batchId)?.name || 'Selected Batch';
    const now = new Date();
    const startDate = newTest.startDate ? new Date(newTest.startDate) : null;
    const endDate = newTest.endDate ? new Date(newTest.endDate) : null;
    let status: Test['status'] = 'draft';
    if (startDate) {
      if (endDate && endDate < now) {
        status = 'completed';
      } else if (startDate > now) {
        status = 'scheduled';
      } else {
        status = 'active';
      }
    }

    const studentCount = batches.find(b => b.id === newTest.batchId)?.students || 0;
    const test: Test = {
      id: `test-${Date.now()}`,
      title: newTest.title,
      batchId: newTest.batchId,
      batchName,
      duration: newTest.duration,
      questions: selectedQuestions,
      status,
      startDate: newTest.startDate,
      endDate: newTest.endDate,
      students: studentCount,
      flagged: 0,
      createdAt: new Date().toISOString(),
    };

    setTests([...tests, test]);
    setIsCreateDialogOpen(false);
    setNewTest({ title: '', batchId: '', duration: 120, startDate: '', endDate: '' });
    setSelectedQuestions([]);
    toast.success('Test created successfully!');
  };

  const handleMonitorTest = (test: Test) => {
    if (onNavigate) {
      onNavigate('test-monitoring', { testName: test.title, batch: test.batchName });
    } else {
      toast.info(`Opening monitoring dashboard for ${test.title}`);
    }
  };

  const handleDeleteTest = (testId: string) => {
    setTests(tests.filter(t => t.id !== testId));
    toast.success('Test deleted successfully');
  };

  const getStatusBadge = (status: Test['status']) => {
    const styles = {
      draft: 'bg-neutral-100 text-neutral-700',
      scheduled: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
    };

    const icons = {
      draft: Clock,
      scheduled: Clock,
      active: CheckCircle2,
      completed: CheckCircle2,
    };

    const Icon = icons[status];

    return (
      <Badge className={styles[status]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Test Management</h2>
          <p className="text-neutral-600 mt-1">
            {isAdmin
              ? 'Create and manage coding tests with proctoring features'
              : 'Monitor active tests and track student activity'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: 'var(--color-primary)' }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
                <DialogDescription>
                  Create a new coding test with multiple questions and proctoring features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Test Title</Label>
                    <Input
                      id="title"
                      value={newTest.title}
                      onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      placeholder="e.g., DSA Midterm Exam"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch">Select Batch</Label>
                    <Select value={newTest.batchId} onValueChange={(value) => setNewTest({ ...newTest, batchId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newTest.duration}
                      onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) || 120 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date & Time</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newTest.startDate}
                      onChange={(e) => setNewTest({ ...newTest, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newTest.endDate}
                      onChange={(e) => setNewTest({ ...newTest, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <hr />

                {/* Selected Questions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Questions ({selectedQuestions.length})</h3>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            From Bank
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Question Bank</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {questionBank.map((q) => (
                              <Card key={q.id} className="hover:border-blue-300 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-neutral-800">{q.title}</h4>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant="outline" className="bg-neutral-50">{q.difficulty}</Badge>
                                      <Badge variant="outline" className="text-[10px] h-5 bg-neutral-50">{q.type === 'mcq' ? 'MCQ' : 'Coding'}</Badge>
                                      <span className="text-sm text-neutral-500 font-medium">{q.points} pts</span>
                                    </div>
                                  </div>
                                  <Button size="sm" onClick={() => handleAddExistingQuestion(q)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Add to Test
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => setIsAddingQuestion(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Question
                      </Button>
                    </div>
                  </div>

                  {selectedQuestions.length > 0 ? (
                    <div className="space-y-2">
                      {selectedQuestions.map((q, idx) => (
                        <div key={q.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-neutral-400">#{idx + 1}</span>
                            <div>
                              <p className="font-medium">{q.title}</p>
                              <p className="text-xs text-neutral-500">{q.difficulty} • {q.points} points • {q.type === 'mcq' ? 'MCQ' : 'Coding'}</p>
                              {q.type === 'mcq' && q.correctAnswer && (
                                <p className="text-xs text-neutral-400">Answer: {q.correctAnswer}</p>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedQuestions(selectedQuestions.filter(sq => sq.id !== q.id))}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg bg-neutral-50 text-neutral-500">
                      No questions added yet. Add from bank or create a new one.
                    </div>
                  )}
                </div>

                {/* New Question Form */}
                {isAddingQuestion && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-md">Create New Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Question Title</Label>
                          <Input
                            value={newQuestion.title}
                            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                            placeholder="e.g., Bubble Sort Implementation"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={newQuestion.type || 'coding'}
                            onValueChange={(v) =>
                              setNewQuestion({
                                ...newQuestion,
                                type: v as any,
                                options: v === 'mcq' ? (newQuestion.options?.length ? newQuestion.options : ['', '', '', '']) : newQuestion.options,
                                testCases: v === 'coding' ? (newQuestion.testCases || []) : [],
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coding">Coding</SelectItem>
                              <SelectItem value="mcq">MCQ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <Select
                            value={newQuestion.difficulty}
                            onValueChange={(v) => setNewQuestion({ ...newQuestion, difficulty: v as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newQuestion.description}
                          onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                          placeholder="Detailed problem description..."
                        />
                      </div>
                      {newQuestion.type === 'mcq' ? (
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {(newQuestion.options || []).map((opt, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={opt}
                                onChange={(e) => {
                                  const options = [...(newQuestion.options || [])];
                                  options[idx] = e.target.value;
                                  const cleaned = options.map(o => o.trim()).filter(o => o);
                                  const nextCorrect = cleaned.includes(newQuestion.correctAnswer || '') ? newQuestion.correctAnswer : '';
                                  setNewQuestion({ ...newQuestion, options, correctAnswer: nextCorrect });
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
                                  setNewQuestion({ ...newQuestion, options, correctAnswer: nextCorrect });
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
                            onClick={() => setNewQuestion({ ...newQuestion, options: [...(newQuestion.options || []), ''] })}
                            className="w-fit"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Option
                          </Button>
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Select
                              value={newQuestion.correctAnswer || ''}
                              onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent>
                                {(newQuestion.options || [])
                                  .map(o => o.trim())
                                  .filter(o => o)
                                  .map((opt, idx) => (
                                    <SelectItem key={`${opt}-${idx}`} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Test Cases</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddTestCase}>
                              <Plus className="w-3 h-3 mr-1" /> Add Case
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {newQuestion.testCases?.map((tc, idx) => (
                              <div key={idx} className="p-3 bg-white rounded-md border space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Input"
                                    value={tc.input}
                                    onChange={(e) => handleUpdateTestCase(idx, 'input', e.target.value)}
                                  />
                                  <Input
                                    placeholder="Expected Output"
                                    value={tc.expectedOutput}
                                    onChange={(e) => handleUpdateTestCase(idx, 'expectedOutput', e.target.value)}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`hidden-${idx}`}
                                      checked={tc.isHidden}
                                      onChange={(e) => handleUpdateTestCase(idx, 'isHidden', e.target.checked)}
                                    />
                                    <Label htmlFor={`hidden-${idx}`} className="text-xs cursor-pointer">Hidden Case</Label>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTestCase(idx)}>
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setIsAddingQuestion(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleAddNewQuestion}>Add to Test</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTest} style={{ backgroundColor: 'var(--color-primary)' }}>
                    Create Test
                  </Button>
                </div>
              </div>
            </DialogContent>

          </Dialog>
        )}
      </div>

      {/* Tests List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
          <CardDescription>
            {isAdmin
              ? 'Manage all tests across batches'
              : 'View and monitor tests assigned to your batches'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flagged</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.title}</TableCell>
                  <TableCell>{test.batchName}</TableCell>
                  <TableCell>{test.duration} min</TableCell>
                  <TableCell>{test.questions.length}</TableCell>
                  <TableCell>

                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-neutral-500" />
                      {test.students}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>
                    {test.flagged > 0 ? (
                      <Badge variant="outline" className="border-red-300 text-red-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {test.flagged}
                      </Badge>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {test.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMonitorTest(test)}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Monitor
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Viewing ${test.title} details`)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {isAdmin && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => toast.info(`Editing ${test.title}`)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTest(test.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Test Features Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Test Proctoring Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Camera & Microphone Access</h4>
              </div>
              <p className="text-sm text-neutral-600">
                Students must grant camera and microphone access. All sessions are recorded for review.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium">Tab Switching Detection</h4>
              </div>
              <p className="text-sm text-neutral-600">
                System automatically detects when students switch tabs or open new windows during the test.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium">AI Usage Detection</h4>
              </div>
              <p className="text-sm text-neutral-600">
                Advanced monitoring detects potential AI tool usage and suspicious activity patterns.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">Auto-End on Cheating</h4>
              </div>
              <p className="text-sm text-neutral-600">
                Tests are automatically ended if cheating is detected. Only trainers/admins can restore access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNextQuestionPrompt} onOpenChange={setShowNextQuestionPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Question Added
            </DialogTitle>
            <DialogDescription>
              The question has been added to this test. Would you like to add another one?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => { setShowNextQuestionPrompt(false); setIsAddingQuestion(false); }}>
              Done for Now
            </Button>
            <Button onClick={() => setShowNextQuestionPrompt(false)} className="bg-blue-600 hover:bg-blue-700">
              Add Another
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


