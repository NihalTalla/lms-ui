import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Users, FileCode, MessageSquare, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { batches, courses } from '../lib/data';

interface FacultyDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function FacultyDashboard({ onNavigate }: FacultyDashboardProps) {
  const activeBatches = batches.length;
  const totalStudents = batches.reduce((sum, batch) => sum + batch.students, 0);
  const pendingGrading = 12;
  const unansweredQuestions = 5;

  const recentSubmissions = [
    { id: 1, student: 'Emma Wilson', problem: 'Two Sum', status: 'pending', time: '10 min ago' },
    { id: 2, student: 'Liam Martinez', problem: 'Merge Intervals', status: 'pending', time: '25 min ago' },
    { id: 3, student: 'Olivia Taylor', problem: 'Valid Parentheses', status: 'graded', time: '1 hour ago' },
  ];

  const flaggedQuestions = [
    { id: 1, student: 'Emma Wilson', question: 'How to optimize the two-pointer approach?', time: '2 hours ago' },
    { id: 2, student: 'Liam Martinez', question: 'Clarification on merge sort implementation', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Faculty Dashboard</h2>
        <p className="text-neutral-600 mt-1">
          Monitor student progress and manage your batches
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Batches</p>
                <h3 className="mt-1">{activeBatches}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Students</p>
                <h3 className="mt-1">{totalStudents}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: 'var(--color-secondary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending Grading</p>
                <h3 className="mt-1">{pendingGrading}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <FileCode className="w-6 h-6" style={{ color: 'var(--color-warning)' }} />
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" onClick={() => onNavigate('grading')}>
              View Queue →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Unanswered Q&A</p>
                <h3 className="mt-1">{unansweredQuestions}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <MessageSquare className="w-6 h-6" style={{ color: 'var(--color-danger)' }} />
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" onClick={() => onNavigate('messages')}>
              Answer Now →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submissions</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('grading')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                          {submission.student.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{submission.student}</p>
                        <p className="text-sm text-neutral-600">{submission.problem}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-500">{submission.time}</span>
                      {submission.status === 'pending' ? (
                        <Badge variant="outline" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Graded
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flagged Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />
                  <CardTitle>Flagged Questions</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('messages')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flaggedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                            {question.student.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{question.student}</p>
                          <p className="text-xs text-neutral-500">{question.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                        Urgent
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-700 mb-3">{question.question}</p>
                    <Button size="sm" style={{ backgroundColor: 'var(--color-primary)' }}>
                      Reply
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Batches */}
          <Card>
            <CardHeader>
              <CardTitle>My Batches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {batches.map((batch) => {
                const course = courses.find(c => c.id === batch.courseId);
                return (
                  <div
                    key={batch.id}
                    className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
                    onClick={() => onNavigate('batch', batch)}
                  >
                    <h4 className="text-sm mb-1">{batch.name}</h4>
                    <p className="text-xs text-neutral-600 mb-3">{course?.title}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {batch.students} students
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {batch.schedule.split('-')[0].trim()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Live Session
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileCode className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-neutral-50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                  <p className="text-sm">Trees & Graphs</p>
                </div>
                <p className="text-xs text-neutral-600">Monday, 6:00 PM - 8:00 PM</p>
                <p className="text-xs text-neutral-500 mt-1">DSA Batch - Fall 2025</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }} />
                  <p className="text-sm">React Hooks Deep Dive</p>
                </div>
                <p className="text-xs text-neutral-600">Tuesday, 7:00 PM - 9:00 PM</p>
                <p className="text-xs text-neutral-500 mt-1">Web Dev Batch - Fall 2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
