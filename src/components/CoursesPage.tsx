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
import { BookOpen, Clock, Users, Award, ArrowRight, Star, Plus, Edit, Trash2, Eye, Lock, Unlock, ChevronDown, ChevronRight } from 'lucide-react';
import { courses, institutions, batches, Topic, TopicQuestion } from '../lib/data';
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
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewCourse, setViewCourse] = useState<any>(null);

  const handleTopicToggleLock = (topicIndex: number) => {
    const updatedTopics = [...newCourse.topics];
    updatedTopics[topicIndex].isLocked = !updatedTopics[topicIndex].isLocked;
    setNewCourse({ ...newCourse, topics: updatedTopics });
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
    };
    setNewCourse({ ...newCourse, topics: [...newCourse.topics, topic] });
    setCurrentTopic({ title: '', content: '' });
    toast.success('Topic added');
  };

  const handleAddQuestion = (topicIndex: number) => {
    if (!currentQuestion.question || !currentQuestion.correctAnswer) {
      toast.error('Please fill in question and correct answer');
      return;
    }
    const question: TopicQuestion = {
      id: `q-${Date.now()}`,
      question: currentQuestion.question,
      options: currentQuestion.options.filter(o => o.trim() !== ''),
      correctAnswer: currentQuestion.correctAnswer,
    };

    const updatedTopics = [...newCourse.topics];
    updatedTopics[topicIndex].questions.push(question);
    setNewCourse({ ...newCourse, topics: updatedTopics });
    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    toast.success('Question added to topic');
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
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Institution</Label>
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
                    <Label htmlFor="batch">Batch</Label>
                    <Select
                      value={newCourse.batchId}
                      onValueChange={(val) => setNewCourse({ ...newCourse, batchId: val })}
                      disabled={!newCourse.institutionId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.filter(b => true).map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                    rows={3}
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

                {/* Topics Management */}
                <div className="border rounded-lg p-4 bg-neutral-50 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course Topics
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <Label>Topic Title</Label>
                      <Input
                        value={currentTopic.title}
                        onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                        placeholder="Introduction to..."
                      />
                    </div>
                    <div>
                      <Label>Topic Content</Label>
                      <Textarea
                        value={currentTopic.content}
                        onChange={(e) => setCurrentTopic({ ...currentTopic, content: e.target.value })}
                        placeholder="Content for this topic..."
                        rows={2}
                      />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTopic}>
                      <Plus className="w-4 h-4 mr-2" /> Add Topic
                    </Button>
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
                              {topic.title} ({topic.questions.length} Questions)
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
                            <p className="text-xs text-neutral-600 italic">{topic.content}</p>

                            <div className="border-t pt-2 space-y-2">
                              <Label className="text-xs font-bold">Add Question to Topic</Label>
                              <Input
                                placeholder="Question"
                                className="text-xs"
                                value={currentQuestion.question}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                {currentQuestion.options.map((opt, oIdx) => (
                                  <Input
                                    key={oIdx}
                                    placeholder={`Option ${oIdx + 1}`}
                                    className="text-xs h-7"
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
                                placeholder="Correct Answer"
                                className="text-xs h-7"
                                value={currentQuestion.correctAnswer}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleAddQuestion(tIdx)}
                              >
                                Add Question
                              </Button>
                            </div>

                            {topic.questions.length > 0 && (
                              <ul className="text-xs space-y-1 pl-4 list-disc text-neutral-500">
                                {topic.questions.map((q, qIdx) => (
                                  <li key={q.id}>{q.question}</li>
                                ))}
                              </ul>
                            )}
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
        )}
      </div>

      {/* Admin Course Management Table */}
      {isAdmin && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>
              Create, edit, and manage courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Institution/Batch</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseList.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{course.title}</span>
                        <span className="text-xs text-neutral-500">{course.topics?.length || 0} Topics</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">
                          {institutions.find(i => i.id === course.institutionId)?.name || 'N/A'}
                        </span>
                        <span className="text-neutral-500">
                          {batches.find(b => b.id === course.batchId)?.name || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        {course.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-neutral-500" />
                        {course.enrolled}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleLock(course.id)}
                        className={course.isLocked ? "text-red-600" : "text-green-600"}
                      >
                        {course.isLocked ? (
                          <><Lock className="w-4 h-4 mr-1" /> Locked</>
                        ) : (
                          <><Unlock className="w-4 h-4 mr-1" /> Unlocked</>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setViewCourse(course); setIsViewDialogOpen(true); }}>
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
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Add Assessment Question</h4>
                          <div className="space-y-2">
                            <Input
                              placeholder="Enter question..."
                              className="text-sm"
                              value={currentQuestion.question}
                              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                            />
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
                            <div className="flex gap-2">
                              <Input
                                placeholder="Correct Answer"
                                className="text-xs h-8 flex-1"
                                value={currentQuestion.correctAnswer}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                              />
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 px-4"
                                onClick={() => handleAddQuestion(tIdx)}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
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

      {/* Enrolled Courses */}
      {!isAdmin && (
        <div>
          <h3 className="mb-4">My Courses</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.slice(0, 2).map((course) => (
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

                  <div className="flex gap-2">
                    <Button className="flex-1" style={{ backgroundColor: 'var(--color-primary)' }} onClick={() => toast.success('Continuing learning...')}>
                      Continue Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={() => toast.info('View course details')}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {!isAdmin && (
        <div>
          <h3 className="mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'rec-1',
                title: 'Advanced System Design',
                level: 'advanced',
                duration: '10 weeks',
                lessons: 40,
                enrolled: 180,
                rating: 4.8,
                tags: ['System Design', 'Scalability', 'Architecture'],
              },
              {
                id: 'rec-2',
                title: 'Competitive Programming',
                level: 'intermediate',
                duration: '8 weeks',
                lessons: 32,
                enrolled: 220,
                rating: 4.9,
                tags: ['Algorithms', 'Problem Solving', 'Optimization'],
              },
              {
                id: 'rec-3',
                title: 'Database Fundamentals',
                level: 'beginner',
                duration: '6 weeks',
                lessons: 24,
                enrolled: 315,
                rating: 4.7,
                tags: ['SQL', 'NoSQL', 'Database Design'],
              },
            ].map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
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
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.lessons} lessons
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => toast.success(`Enrolled in ${course.title}!`)}>
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
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
                      <AccordionContent className="space-y-4">
                        <div className="bg-neutral-50 p-4 rounded-md">
                          <p className="text-sm text-neutral-700 leading-relaxed">{topic.content}</p>
                        </div>
                        {topic.questions.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase text-neutral-500 tracking-wider">Assessment Questions</h4>
                            <div className="space-y-4">
                              {topic.questions.map((q, idx) => (
                                <div key={q.id} className="border-l-2 border-primary/20 pl-4 py-1">
                                  <p className="font-medium text-sm mb-2">{idx + 1}. {q.question}</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {q.options.map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className={`text-xs p-2 rounded border ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-medium' : 'bg-white border-neutral-100'}`}
                                      >
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
    </div>
  );
}
