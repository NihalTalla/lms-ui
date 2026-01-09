import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  Video,
  FileText,
  Award,
  Trash2,
  Eye,
  EyeOff,
  UserPlus,
  ClipboardList,
  Building2
} from 'lucide-react';
import { batches, courses, users, problems, institutions } from '../lib/data';
import { toast } from 'sonner';
import { CSVBatchDialog } from './CSVBatchDialog';

interface BatchManagementProps {
  onNavigate: (page: string, data?: any) => void;
  role?: 'admin' | 'faculty' | 'trainer';
}

export function BatchManagement({ onNavigate, role = 'faculty' }: BatchManagementProps) {
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  
  // Dialog states
  const [assignFacultyDialogOpen, setAssignFacultyDialogOpen] = useState(false);
  const [addProblemDialogOpen, setAddProblemDialogOpen] = useState(false);
  const [problemMode, setProblemMode] = useState<'select' | 'existing' | 'create'>('select');
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
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
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '', hidden: false }]);

  // Get unique years for the selected institution
  const availableYears = Array.from(new Set(
    batches
      .filter(b => !selectedInstitution || b.institutionId === selectedInstitution)
      .map(b => b.year)
  )).sort((a, b) => b.localeCompare(a));

  const filteredBatches = batches.filter(batch => {
    const matchesInstitution = !selectedInstitution || batch.institutionId === selectedInstitution;
    const matchesYear = !selectedYear || batch.year === selectedYear;
    const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInstitution && matchesYear && matchesSearch;
  });

  const batchesWithDetails = filteredBatches.map(batch => {
    const course = courses.find(c => c.id === batch.courseId);
    return {
      ...batch,
      course,
      progress: Math.floor(Math.random() * 40) + 60,
      attendance: Math.floor(Math.random() * 20) + 80,
      activeStudents: Math.floor(batch.students * 0.85),
    };
  });

  const handleAssignFaculty = () => {
    if (selectedFaculty.length === 0) {
      toast.error('Please select at least one faculty or trainer');
      return;
    }
    toast.success(`Assigned ${selectedFaculty.length} faculty/trainer(s) to ${selectedBatch.name}`);
    setAssignFacultyDialogOpen(false);
    setSelectedFaculty([]);
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
    toast.success(`Problem "${newProblemData.title}" created and added to ${selectedBatch.name}`);
    setAddProblemDialogOpen(false);
    resetProblemDialog();
  };

  const resetProblemDialog = () => {
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

  const isSelectionMade = selectedInstitution && selectedYear;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Batch Management</h2>
          <p className="text-neutral-600 mt-1">
            {role === 'admin' ? 'Manage all batches across the platform' : 'Manage your assigned batches'}
          </p>
        </div>
        {role === 'admin' && <CSVBatchDialog />}
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <Label>Select Institution</Label>
          <Select value={selectedInstitution} onValueChange={(val) => { setSelectedInstitution(val); setSelectedYear(''); }}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-400" />
                <SelectValue placeholder="Choose Institution" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {institutions.map(inst => (
                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-1.5">
          <Label>Select Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!selectedInstitution}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <SelectValue placeholder="Choose Year" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isSelectionMade && (
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label>Search Batches</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}
      </div>

      {!isSelectionMade ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-neutral-300">
          <Users className="w-12 h-12 text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">Select Institution and Year</h3>
          <p className="text-neutral-500">Please select both filters above to view the batches.</p>
        </div>
      ) : !selectedBatch ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batchesWithDetails.length > 0 ? (
            batchesWithDetails.map((batch) => (
              <Card key={batch.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.01]" onClick={() => setSelectedBatch(batch)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{batch.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {batch.course?.title}
                      </CardDescription>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{batch.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{batch.schedule}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Course Progress</span>
                      <span className="font-medium">{batch.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${batch.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-neutral-500">No batches found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedBatch(null)}>
              ← Back to Batches
            </Button>
            <div className="flex gap-2">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                  <CardDescription className="text-base mt-1">
                    {selectedBatch.course?.title}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {selectedBatch.startDate} to {selectedBatch.endDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {selectedBatch.schedule}
                    </div>
                  </div>
                </div>
                <Badge className="px-4 py-1.5 bg-indigo-600 text-white border-0">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', value: selectedBatch.students, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Avg. Progress', value: `${selectedBatch.progress}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Attendance', value: `${selectedBatch.attendance}%`, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Batch Health', value: 'Good', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl ${stat.bg} text-center`}>
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-xs text-neutral-600 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900">Management Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAssignFacultyDialogOpen(true)}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <UserPlus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900">Assign Staff</h4>
                          <p className="text-sm text-neutral-600">Faculty & trainers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <ClipboardList className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900">Assessments</h4>
                          <p className="text-sm text-neutral-600">Create & schedule</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAddProblemDialogOpen(true)}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900">Add Problems</h4>
                          <p className="text-sm text-neutral-600">DSA & Coding tasks</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={assignFacultyDialogOpen} onOpenChange={setAssignFacultyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Faculty & Trainer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Staff Members</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                {users.filter(u => u.role === 'faculty' || u.role === 'trainer').map(staff => (
                  <div key={staff.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-md">
                    <input
                      type="checkbox"
                      checked={selectedFaculty.includes(staff.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedFaculty([...selectedFaculty, staff.id]);
                        else setSelectedFaculty(selectedFaculty.filter(id => id !== staff.id));
                      }}
                      className="rounded border-neutral-300 text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-medium">{staff.name}</p>
                      <p className="text-xs text-neutral-500 uppercase">{staff.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleAssignFaculty}>
              Save Assignments
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addProblemDialogOpen} onOpenChange={(open) => { if (!open) resetProblemDialog(); setAddProblemDialogOpen(open); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Problem to Batch</DialogTitle>
          </DialogHeader>
          
          {problemMode === 'select' ? (
            <div className="grid grid-cols-2 gap-4 py-6">
              <button onClick={() => setProblemMode('existing')} className="p-6 border-2 border-dashed rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-center group">
                <Search className="w-8 h-8 mx-auto mb-3 text-neutral-400 group-hover:text-indigo-600" />
                <span className="font-bold text-neutral-900">Existing Problem</span>
              </button>
              <button onClick={() => setProblemMode('create')} className="p-6 border-2 border-dashed rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all text-center group">
                <Plus className="w-8 h-8 mx-auto mb-3 text-neutral-400 group-hover:text-emerald-600" />
                <span className="font-bold text-neutral-900">Create New</span>
              </button>
            </div>
          ) : problemMode === 'existing' ? (
            <div className="space-y-4 py-4">
              <Select value={selectedExistingProblem} onValueChange={setSelectedExistingProblem}>
                <SelectTrigger><SelectValue placeholder="Search problems..." /></SelectTrigger>
                <SelectContent>
                  {problems.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setProblemMode('select')}>Back</Button>
                <Button className="bg-indigo-600" onClick={handleAddExistingProblem}>Add Problem</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <Input placeholder="Problem Title" value={newProblemData.title} onChange={e => setNewProblemData({...newProblemData, title: e.target.value})} />
              <Textarea placeholder="Description" value={newProblemData.description} onChange={e => setNewProblemData({...newProblemData, description: e.target.value})} />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setProblemMode('select')}>Back</Button>
                <Button className="bg-emerald-600 text-white" onClick={handleCreateNewProblem}>Create & Add</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
