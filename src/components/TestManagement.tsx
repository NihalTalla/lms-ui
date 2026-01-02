import React, { useState } from 'react';
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
import { toast } from 'sonner';

interface Test {
  id: string;
  title: string;
  batchId: string;
  batchName: string;
  duration: number; // in minutes
  questions: number;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  startDate?: string;
  endDate?: string;
  students: number;
  flagged: number;
}

interface TestQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  testCases: number;
}

export function TestManagement() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isTrainer = currentUser?.role === 'trainer';
  
  const [tests, setTests] = useState<Test[]>([
    {
      id: 'test-1',
      title: 'DSA Midterm Exam',
      batchId: 'batch-1',
      batchName: 'DSA Batch - Fall 2025',
      duration: 120,
      questions: 5,
      status: 'active',
      startDate: '2025-01-15T10:00:00',
      endDate: '2025-01-15T12:00:00',
      students: 12,
      flagged: 2,
    },
    {
      id: 'test-2',
      title: 'Algorithm Quiz',
      batchId: 'batch-2',
      batchName: 'Web Dev Batch - Fall 2025',
      duration: 60,
      questions: 3,
      status: 'scheduled',
      startDate: '2025-01-20T14:00:00',
      endDate: '2025-01-20T15:00:00',
      students: 8,
      flagged: 0,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    batchId: '',
    duration: 120,
    startDate: '',
    endDate: '',
  });

  const handleCreateTest = () => {
    if (!newTest.title || !newTest.batchId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const test: Test = {
      id: `test-${Date.now()}`,
      title: newTest.title,
      batchId: newTest.batchId,
      batchName: 'Selected Batch',
      duration: newTest.duration,
      questions: 0,
      status: 'draft',
      startDate: newTest.startDate,
      endDate: newTest.endDate,
      students: 0,
      flagged: 0,
    };
    
    setTests([...tests, test]);
    setIsCreateDialogOpen(false);
    setNewTest({ title: '', batchId: '', duration: 120, startDate: '', endDate: '' });
    toast.success('Test created successfully!');
  };

  const handleMonitorTest = (test: Test) => {
    toast.info(`Opening monitoring dashboard for ${test.title}`);
    // In a real app, this would navigate to a monitoring page
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
                <DialogDescription>
                  Create a new coding test with multiple questions and proctoring features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Test Title</Label>
                  <Input
                    id="title"
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                    placeholder="e.g., DSA Midterm Exam"
                  />
                </div>
                <div>
                  <Label htmlFor="batch">Select Batch</Label>
                  <Select value={newTest.batchId} onValueChange={(value) => setNewTest({ ...newTest, batchId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batch-1">DSA Batch - Fall 2025</SelectItem>
                      <SelectItem value="batch-2">Web Dev Batch - Fall 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newTest.duration}
                      onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) || 120 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date & Time</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newTest.startDate}
                      onChange={(e) => setNewTest({ ...newTest, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newTest.endDate}
                    onChange={(e) => setNewTest({ ...newTest, endDate: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
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
                  <TableCell>{test.questions}</TableCell>
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
    </div>
  );
}


