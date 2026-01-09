import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Users, 
  Calendar, 
  Clock,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Settings,
  BookOpen,
  Video,
  FileText,
  Award,
  Upload,
  X,
  CheckCircle,
  UserPlus,
  ClipboardList,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { batches, courses, users, problems } from '../lib/data';
import { toast } from 'sonner';
import { CSVBatchDialog } from './CSVBatchDialog';
// import { CreateAssessmentWizard } from './CreateAssessmentWizard';
import { Assessment } from '../lib/data';

interface BatchManagementProps {
  onNavigate: (page: string, data?: any) => void;
  role?: 'admin' | 'faculty';
}

export function BatchManagement({ onNavigate, role = 'faculty' }: BatchManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvStudents, setCsvStudents] = useState<any[]>([]);
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'csv'>('manual');
  const [assignFacultyDialogOpen, setAssignFacultyDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [createAssessmentWizardOpen, setCreateAssessmentWizardOpen] = useState(false);
  const [addProblemDialogOpen, setAddProblemDialogOpen] = useState(false);
  const [problemMode, setProblemMode] = useState<'select' | 'existing' | 'create'>('select');
  const [selectedExistingProblem, setSelectedExistingProblem] = useState('');
  const [newProblemData, setNewProblemData] = useState({
    title: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    description: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    explanation: '',
    tags: '',
    points: '',
  });
  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string; hidden: boolean }>>([
    { input: '', expectedOutput: '', hidden: false }
  ]);

  const batchStats = {
    activeBatches: batches.length,
    totalStudents: batches.reduce((sum, batch) => sum + batch.students, 0),
    avgAttendance: 87,
    completionRate: 76,
  };

  const batchesWithDetails = batches.map(batch => {
    const course = courses.find(c => c.id === batch.courseId);
    return {
      ...batch,
      course,
      progress: Math.floor(Math.random() * 40) + 60, // Mock progress
      attendance: Math.floor(Math.random() * 20) + 80, // Mock attendance
      activeStudents: Math.floor(batch.students * 0.85),
    };
  });

  const studentsList = [
    { id: 'st-1', name: 'Emma Wilson', email: 'emma.w@example.com', progress: 85, attendance: 92, points: 1250 },
    { id: 'st-2', name: 'Liam Martinez', email: 'liam.m@example.com', progress: 78, attendance: 88, points: 1180 },
    { id: 'st-3', name: 'Olivia Taylor', email: 'olivia.t@example.com', progress: 92, attendance: 95, points: 1420 },
    { id: 'st-4', name: 'Noah Anderson', email: 'noah.a@example.com', progress: 68, attendance: 75, points: 890 },
    { id: 'st-5', name: 'Sophia Brown', email: 'sophia.b@example.com', progress: 88, attendance: 90, points: 1320 },
  ];

  const facultyList = users.filter(u => u.role === 'faculty');

  const handleAssignFaculty = () => {
    if (selectedFaculty.length === 0) {
      toast.error('Please select at least one faculty or trainer');
      return;
    }
    toast.success(`Assigned ${selectedFaculty.length} faculty/trainer(s) to ${selectedBatch.name}`);
    setAssignFacultyDialogOpen(false);
    setSelectedFaculty([]);
  };

  const handleAssessmentCreated = (assessment: Assessment) => {
    // Here you would typically save to backend
    console.log('Assessment created:', assessment);
    toast.success(`Assessment "${assessment.name}" created successfully!`);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', hidden: false }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expectedOutput' | 'hidden', value: string | boolean) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleAddExistingProblem = () => {
    if (!selectedExistingProblem) {
      toast.error('Please select a problem');
      return;
    }
    const problem = problems.find(p => p.id === selectedExistingProblem);
    toast.success(`Problem "${problem?.title}" added to ${selectedBatch.name}`);
    setAddProblemDialogOpen(false);
    setProblemMode('select');
    setSelectedExistingProblem('');
  };

  const handleCreateNewProblem = () => {
    if (!newProblemData.title || !newProblemData.description || !newProblemData.points) {
      toast.error('Please fill all required fields');
      return;
    }
    if (testCases.some(tc => !tc.input || !tc.expectedOutput)) {
      toast.error('Please fill all test case fields');
      return;
    }
    toast.success(`Problem "${newProblemData.title}" created and added to ${selectedBatch.name}`);
    setAddProblemDialogOpen(false);
    setProblemMode('select');
    setNewProblemData({
      title: '',
      difficulty: 'easy',
      description: '',
      constraints: '',
      sampleInput: '',
      sampleOutput: '',
      explanation: '',
      tags: '',
      points: '',
    });
    setTestCases([{ input: '', expectedOutput: '', hidden: false }]);
  };

  const resetProblemDialog = () => {
    setAddProblemDialogOpen(false);
    setProblemMode('select');
    setSelectedExistingProblem('');
    setNewProblemData({
      title: '',
      difficulty: 'easy',
      description: '',
      constraints: '',
      sampleInput: '',
      sampleOutput: '',
      explanation: '',
      tags: '',
      points: '',
    });
    setTestCases([{ input: '', expectedOutput: '', hidden: false }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Batch Management</h2>
          <p className="text-neutral-600 mt-1">
            {role === 'admin' ? 'Manage all batches across the platform' : 'Manage your assigned batches'}
          </p>
        </div>
        {role === 'admin' && <CSVBatchDialog />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Batches</p>
                <h3 className="mt-1">{batchStats.activeBatches}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Students</p>
                <h3 className="mt-1">{batchStats.totalStudents}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avg. Attendance</p>
                <h3 className="mt-1">{batchStats.avgAttendance}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Completion Rate</p>
                <h3 className="mt-1">{batchStats.completionRate}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batch Cards */}
      {!selectedBatch ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batchesWithDetails.map((batch) => (
            <Card key={batch.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]" onClick={() => setSelectedBatch(batch)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{batch.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {batch.course?.title}
                    </CardDescription>
                  </div>
                  <Badge style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Users className="w-4 h-4" />
                    <span>{batch.students} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    <span>{batch.schedule.split('-')[0].trim()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Progress</span>
                    <span className="font-medium">{batch.progress}%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        width: `${batch.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-neutral-600">Attendance</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>
                      {batch.attendance}%
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-neutral-600">Active Students</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>
                      {batch.activeStudents}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Batch Detail View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedBatch(null)}>
              ← Back to Batches
            </Button>
            <div className="flex gap-2">
              <Button style={{ backgroundColor: 'var(--color-primary)' }}>
                <Video className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedBatch.name}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {selectedBatch.course?.title}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-3 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedBatch.startDate} - {selectedBatch.endDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedBatch.schedule}
                    </div>
                  </div>
                </div>
                <Badge className="text-base px-4 py-1" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg text-center">
                  <Users className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
                  <p className="text-2xl font-semibold">{selectedBatch.students}</p>
                  <p className="text-xs text-neutral-600 mt-1">Total Students</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-accent)' }} />
                  <p className="text-2xl font-semibold">{selectedBatch.progress}%</p>
                  <p className="text-xs text-neutral-600 mt-1">Progress</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-secondary)' }} />
                  <p className="text-2xl font-semibold">{selectedBatch.attendance}%</p>
                  <p className="text-xs text-neutral-600 mt-1">Attendance</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg text-center">
                  <Award className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-warning)' }} />
                  <p className="text-2xl font-semibold">4.6</p>
                  <p className="text-xs text-neutral-600 mt-1">Avg Rating</p>
                </div>
              </div>

              {/* Settings Section */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                      Batch Settings
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Manage faculty assignments and assessments for this batch
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAssignFacultyDialogOpen(true)}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                          <UserPlus className="w-6 h-6" style={{ color: 'var(--color-secondary)' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Assign Faculty & Trainer</h4>
                          <p className="text-sm text-neutral-600">
                            Assign faculty members and trainers to this batch
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCreateAssessmentWizardOpen(true)}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                          <ClipboardList className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Create Test/Assessment</h4>
                          <p className="text-sm text-neutral-600">
                            Create and schedule tests or assessments for this batch
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
<Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAddProblemDialogOpen(true)}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                            <FileText className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">Add Problems</h4>
                            <p className="text-sm text-neutral-600">
                              Add coding problems and challenges to this batch
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              </div>

              {/* Students List */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg">Students</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </div>
                <div className="space-y-2">
                  {studentsList.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-neutral-600">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <p className="text-neutral-600">Progress</p>
                          <p className="font-medium">{student.progress}%</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Attendance</p>
                          <p className="font-medium">{student.attendance}%</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Points</p>
                          <p className="font-medium" style={{ color: 'var(--color-primary)' }}>
                            {student.points}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assign Faculty Dialog */}
      <Dialog open={assignFacultyDialogOpen} onOpenChange={setAssignFacultyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Faculty & Trainer</DialogTitle>
            <DialogDescription>
              Assign faculty and trainers to {selectedBatch?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Faculty</Label>
              <div className="p-3 bg-neutral-50 rounded-lg">
                {selectedBatch?.faculty.length > 0 ? (
                  selectedBatch.faculty.map((fId: string) => {
                    const faculty = users.find(u => u.id === fId);
                    return (
                      <div key={fId} className="text-sm text-neutral-700">
                        {faculty?.name || 'Unknown Faculty'}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-neutral-500">No faculty assigned</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Faculty/Trainers</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-lg p-3">
                {facultyList.map((faculty) => (
                  <div key={faculty.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`faculty-${faculty.id}`}
                      checked={selectedFaculty.includes(faculty.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFaculty([...selectedFaculty, faculty.id]);
                        } else {
                          setSelectedFaculty(selectedFaculty.filter(id => id !== faculty.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                    <Label htmlFor={`faculty-${faculty.id}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium">{faculty.name}</div>
                      <div className="text-xs text-neutral-500">{faculty.email}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1" 
                style={{ backgroundColor: 'var(--color-primary)' }}
                onClick={handleAssignFaculty}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Faculty
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setAssignFacultyDialogOpen(false);
                  setSelectedFaculty([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Assessment Wizard */}
      <CreateAssessmentWizard
        open={createAssessmentWizardOpen}
        onOpenChange={setCreateAssessmentWizardOpen}
        batchId={selectedBatch?.id || ''}
        batchName={selectedBatch?.name || ''}
        onAssessmentCreated={handleAssessmentCreated}
      />

        {/* Add Problem Dialog */}
        <Dialog open={addProblemDialogOpen} onOpenChange={(open) => { if (!open) resetProblemDialog(); else setAddProblemDialogOpen(true); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Problem to Batch</DialogTitle>
              <DialogDescription>
                Add a coding problem to {selectedBatch?.name}
              </DialogDescription>
            </DialogHeader>

            {problemMode === 'select' && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary"
                  onClick={() => setProblemMode('existing')}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                      <Search className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Add Existing Problem</h4>
                    <p className="text-sm text-neutral-600">
                      Select from existing problems in the system
                    </p>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary"
                  onClick={() => setProblemMode('create')}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <Plus className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Create New Problem</h4>
                    <p className="text-sm text-neutral-600">
                      Create a new problem with test cases
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {problemMode === 'existing' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setProblemMode('select')}>
                  ← Back
                </Button>
                <div className="space-y-2">
                  <Label>Select Problem</Label>
                  <Select value={selectedExistingProblem} onValueChange={setSelectedExistingProblem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a problem..." />
                    </SelectTrigger>
                    <SelectContent>
                      {problems.map((problem) => (
                        <SelectItem key={problem.id} value={problem.id}>
                          <div className="flex items-center gap-2">
                            <span>{problem.title}</span>
                            <Badge 
                              variant="outline"
                              className={
                                problem.difficulty === 'easy'
                                  ? 'border-green-300 text-green-700'
                                  : problem.difficulty === 'medium'
                                  ? 'border-yellow-300 text-yellow-700'
                                  : 'border-red-300 text-red-700'
                              }
                            >
                              {problem.difficulty}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedExistingProblem && (
                  <div className="p-4 bg-neutral-50 rounded-lg space-y-2">
                    <h4 className="font-semibold">{problems.find(p => p.id === selectedExistingProblem)?.title}</h4>
                    <p className="text-sm text-neutral-600">{problems.find(p => p.id === selectedExistingProblem)?.description.slice(0, 150)}...</p>
                    <div className="flex gap-2">
                      {problems.find(p => p.id === selectedExistingProblem)?.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    style={{ backgroundColor: 'var(--color-primary)' }}
                    onClick={handleAddExistingProblem}
                  >
                    Add Problem
                  </Button>
                  <Button variant="outline" onClick={resetProblemDialog}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {problemMode === 'create' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setProblemMode('select')}>
                  ← Back
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="problem-title">Title *</Label>
                    <Input
                      id="problem-title"
                      placeholder="e.g., Two Sum"
                      value={newProblemData.title}
                      onChange={(e) => setNewProblemData({ ...newProblemData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problem-difficulty">Difficulty *</Label>
                    <Select 
                      value={newProblemData.difficulty} 
                      onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewProblemData({ ...newProblemData, difficulty: value })}
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
                  <Label htmlFor="problem-description">Description *</Label>
                  <Textarea
                    id="problem-description"
                    placeholder="Problem description..."
                    rows={4}
                    value={newProblemData.description}
                    onChange={(e) => setNewProblemData({ ...newProblemData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sample-input">Sample Input</Label>
                    <Textarea
                      id="sample-input"
                      placeholder="[2,7,11,15], target = 9"
                      rows={2}
                      value={newProblemData.sampleInput}
                      onChange={(e) => setNewProblemData({ ...newProblemData, sampleInput: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sample-output">Sample Output</Label>
                    <Textarea
                      id="sample-output"
                      placeholder="[0,1]"
                      rows={2}
                      value={newProblemData.sampleOutput}
                      onChange={(e) => setNewProblemData({ ...newProblemData, sampleOutput: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="problem-tags">Tags (comma separated)</Label>
                    <Input
                      id="problem-tags"
                      placeholder="Array, Hash Table"
                      value={newProblemData.tags}
                      onChange={(e) => setNewProblemData({ ...newProblemData, tags: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problem-points">Points *</Label>
                    <Input
                      id="problem-points"
                      type="number"
                      placeholder="100"
                      value={newProblemData.points}
                      onChange={(e) => setNewProblemData({ ...newProblemData, points: e.target.value })}
                    />
                  </div>
                </div>

                {/* Test Cases Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Test Cases *</Label>
                    <Button variant="outline" size="sm" onClick={handleAddTestCase}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Test Case
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {testCases.map((tc, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="font-medium text-sm">Test Case {index + 1}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={tc.hidden}
                                onCheckedChange={(checked) => handleTestCaseChange(index, 'hidden', checked)}
                              />
                              <Label className="text-sm flex items-center gap-1 cursor-pointer">
                                {tc.hidden ? (
                                  <>
                                    <EyeOff className="w-4 h-4" />
                                    Hidden
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4" />
                                    Visible
                                  </>
                                )}
                              </Label>
                            </div>
                            {testCases.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveTestCase(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Input *</Label>
                            <Textarea
                              placeholder="Input value..."
                              rows={2}
                              value={tc.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Expected Output *</Label>
                            <Textarea
                              placeholder="Expected output..."
                              rows={2}
                              value={tc.expectedOutput}
                              onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Hidden test cases are not visible to students during submission
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    style={{ backgroundColor: 'var(--color-primary)' }}
                    onClick={handleCreateNewProblem}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Problem
                  </Button>
                  <Button variant="outline" onClick={resetProblemDialog}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
