import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import {
  FolderPlus,
  FileText,
  ChevronDown,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Filter,
  FileBarChart,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { institutions, batches } from '../lib/data';

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface AssessmentReport {
  id: string;
  categoryId: string;
  assessmentId: string;
  categoryName: string;
  assessmentName: string;
  totalStudents: number;
  passedStudents: number;
  averageScore: number;
  generatedAt: string;
}

export function AssessmentManagement() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat-1',
      name: 'Internal Assessments',
      description: 'Regular assessments conducted during the course',
      createdAt: '2025-10-01'
    },
    {
      id: 'cat-2',
      name: 'External Assessments',
      description: 'Final examinations and certification tests',
      createdAt: '2025-10-01'
    }
  ]);

  const [reports, setReports] = useState<AssessmentReport[]>([
    {
      id: 'rep-1',
      categoryId: 'cat-1',
      assessmentId: 'ass-1',
      categoryName: 'Internal Assessments',
      assessmentName: 'DSA Fundamentals Quiz',
      totalStudents: 45,
      passedStudents: 38,
      averageScore: 82.5,
      generatedAt: '2025-10-15'
    }
  ]);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');

  // New state for Reports and Progress
  const [reportsFilters, setReportsFilters] = useState({
    institution: '',
    batch: '',
    batchYear: ''
  });
  const [progressFilters, setProgressFilters] = useState({
    institution: '',
    batch: '',
    batchYear: ''
  });
  const [filteredReports, setFilteredReports] = useState<AssessmentReport[]>(reports);
  const [progressData, setProgressData] = useState<any[]>([]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  const handleCreateCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const category: Category = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '' });
    setIsCategoryDialogOpen(false);
    toast.success('Category created successfully');
  };

  const handleGenerateReport = () => {
    if (!selectedCategory || !selectedAssessment) {
      toast.error('Please select category and assessment');
      return;
    }

    const report: AssessmentReport = {
      id: `rep-${Date.now()}`,
      categoryId: selectedCategory,
      assessmentId: selectedAssessment,
      categoryName: categories.find(c => c.id === selectedCategory)?.name || '',
      assessmentName: 'Sample Assessment',
      totalStudents: Math.floor(Math.random() * 50) + 30,
      passedStudents: Math.floor(Math.random() * 30) + 20,
      averageScore: Math.floor(Math.random() * 30) + 70,
      generatedAt: new Date().toISOString().split('T')[0]
    };

    setReports([...reports, report]);
    setSelectedCategory('');
    setSelectedAssessment('');
    setIsReportDialogOpen(false);
    toast.success('Report generated successfully');
  };

  const handleDownloadConsolidatedReport = () => {
    toast.success('Downloading consolidated report...');
    // In a real implementation, this would generate and download a PDF/Excel report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Assessment Management</h2>
          <p className="text-neutral-600 mt-1">
            Manage assessment categories and generate performance reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadConsolidatedReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Consolidated Report
          </Button>
        </div>
      </div>

      {/* Assessment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Dashboard</CardTitle>
          <CardDescription>Access reports and track assessment progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {/* Reports Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-10 px-4">
                  <div className="bg-primary/10 p-1 rounded">
                    <FileBarChart className="w-4 h-4 text-primary" />
                  </div>
                  Reports
                  <ChevronDown className="w-4 h-4 text-neutral-400 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-96 p-0">
                <div className="p-3 border-b bg-neutral-50 flex justify-between items-center">
                  <span className="text-sm font-semibold">Assessment Reports</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white"
                    onClick={handleDownloadConsolidatedReport}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Institution</Label>
                    <Select value={reportsFilters.institution} onValueChange={(value) => setReportsFilters({...reportsFilters, institution: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select Institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map(inst => <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Batch</Label>
                    <Select
                      value={reportsFilters.batch}
                      onValueChange={(value) => setReportsFilters({...reportsFilters, batch: value})}
                      disabled={!reportsFilters.institution}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map(batch => <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Batch Year</Label>
                    <Select value={reportsFilters.batchYear} onValueChange={(value) => setReportsFilters({...reportsFilters, batchYear: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full h-8"
                    onClick={() => {
                      // Filter reports based on selection
                      const filtered = reports.filter(report =>
                        (!reportsFilters.institution || report.categoryId.includes(reportsFilters.institution)) &&
                        (!reportsFilters.batch || report.assessmentId.includes(reportsFilters.batch))
                      );
                      setFilteredReports(filtered);
                      toast.success(`Found ${filtered.length} completed assessments`);
                    }}
                  >
                    Search Reports
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Progress Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-10 px-4">
                  <div className="bg-primary/10 p-1 rounded">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  Progress
                  <ChevronDown className="w-4 h-4 text-neutral-400 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-96 p-0">
                <div className="p-3 border-b bg-neutral-50">
                  <span className="text-sm font-semibold">Assessment Progress</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Institution</Label>
                    <Select value={progressFilters.institution} onValueChange={(value) => setProgressFilters({...progressFilters, institution: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select Institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map(inst => <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Batch</Label>
                    <Select
                      value={progressFilters.batch}
                      onValueChange={(value) => setProgressFilters({...progressFilters, batch: value})}
                      disabled={!progressFilters.institution}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map(batch => <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Batch Year</Label>
                    <Select value={progressFilters.batchYear} onValueChange={(value) => setProgressFilters({...progressFilters, batchYear: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full h-8"
                    onClick={() => {
                      // Generate mock progress data
                      const mockProgress = [
                        { assessment: 'DSA Fundamentals', completed: 45, total: 50, percentage: 90 },
                        { assessment: 'Web Development', completed: 32, total: 50, percentage: 64 },
                        { assessment: 'Database Design', completed: 28, total: 50, percentage: 56 }
                      ];
                      setProgressData(mockProgress);
                      toast.success('Progress data loaded');
                    }}
                  >
                    View Progress
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {category.createdAt}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">{category.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtered Reports Section */}
      {filteredReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Reports</CardTitle>
            <CardDescription>Completed assessments based on your filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{report.assessmentName}</h3>
                      <p className="text-sm text-neutral-600">{report.categoryName}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span>Total Students: {report.totalStudents}</span>
                        <span>Passed: {report.passedStudents}</span>
                        <span>Avg Score: {report.averageScore}%</span>
                      </div>
                    </div>
                    <Badge variant="outline">{report.generatedAt}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Section */}
      {progressData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Progress</CardTitle>
            <CardDescription>Current assessment completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.assessment}</h3>
                    <span className="text-sm text-neutral-600">{item.completed}/{item.total} completed</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{item.percentage}% complete</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{report.assessmentName}</h3>
                    <p className="text-sm text-neutral-600">{report.categoryName}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span>Total Students: {report.totalStudents}</span>
                      <span>Passed: {report.passedStudents}</span>
                      <span>Avg Score: {report.averageScore}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new assessment category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Internal Assessments"
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Describe the category..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Assessment Report</DialogTitle>
            <DialogDescription>
              Select category and assessment to generate report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="report-category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report-assessment">Assessment</Label>
              <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ass-1">DSA Fundamentals Quiz</SelectItem>
                  <SelectItem value="ass-2">Web Development Test</SelectItem>
                  <SelectItem value="ass-3">System Design Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport}>
                Generate Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}