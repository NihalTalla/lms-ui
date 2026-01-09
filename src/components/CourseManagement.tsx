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
import { Plus, Edit, Trash2, Eye, Calendar, Clock, Users, BookOpen } from 'lucide-react';
import { courses } from '../lib/data';
import { toast } from 'sonner';

export function CourseManagement() {
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
  });

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error('Please fill in all required fields');
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
    };
    
    setCourseList([...courseList, course]);
    setIsCreateDialogOpen(false);
    setNewCourse({ title: '', description: '', level: 'beginner', duration: '', lessons: 0, tags: '' });
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
          }
        : c
    );
    
    setCourseList(updated);
    setIsEditDialogOpen(false);
    setSelectedCourse(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Course Management</h2>
          <p className="text-neutral-600 mt-1">
            Create, edit, and manage courses across the platform
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: 'var(--color-primary)' }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g., Advanced System Design"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Course description..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="level">Level</Label>
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
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    placeholder="e.g., 12 weeks"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lessons">Number of Lessons</Label>
                  <Input
                    id="lessons"
                    type="number"
                    value={newCourse.lessons}
                    onChange={(e) => setNewCourse({ ...newCourse, lessons: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newCourse.tags}
                    onChange={(e) => setNewCourse({ ...newCourse, tags: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
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
      </div>

      {/* Courses List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            Manage all courses available on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Lessons</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseList.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{getLevelBadge(course.level)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      {course.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-neutral-500" />
                      {course.lessons}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-neutral-500" />
                      {course.enrolled}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {course.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCourse(course)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                rows={4}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-lessons">Number of Lessons</Label>
                <Input
                  id="edit-lessons"
                  type="number"
                  value={newCourse.lessons}
                  onChange={(e) => setNewCourse({ ...newCourse, lessons: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={newCourse.tags}
                  onChange={(e) => setNewCourse({ ...newCourse, tags: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse} style={{ backgroundColor: 'var(--color-primary)' }}>
                Update Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


