import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, BarChart3, ClipboardList } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../lib/auth-context';
import { Course } from '../lib/data';
import { loadTests, Test } from '../lib/test-store';
import { StudentTestSession } from './StudentTestSession';
import { getLatestResultForTest } from '../lib/test-results-store';
import { saveTestResult } from '../lib/test-results-store';
import { recordSubmission, getSubmissionCountsByDay } from '../lib/submission-store';

interface StudentCourseTestsProps {
  course: Course;
  onBack: () => void;
}

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

export function StudentCourseTests({ course, onBack }: StudentCourseTestsProps) {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [showTestSession, setShowTestSession] = useState(false);
  const [highlightTestId, setHighlightTestId] = useState<string | null>(null);

  useEffect(() => {
    setTests(loadTests());
  }, []);

  const filteredTests = useMemo(() => {
    const batchId = course.batchId || currentUser?.batchId;
    if (!batchId) return [];
    return tests.filter(test => test.batchId === batchId);
  }, [tests, course.batchId, currentUser?.batchId]);

  const orderedTests = useMemo(() => {
    if (filteredTests.length === 0) return [];
    const statusOrder: Record<Test['status'], number> = {
      active: 0,
      scheduled: 1,
      completed: 2,
      draft: 3,
    };
    const sorted = [...filteredTests].sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      const dateA = new Date(a.startDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.startDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    const current = sorted.find(test => test.status === 'active') || sorted.find(test => test.status === 'scheduled');
    if (!current) return sorted;
    return [current, ...sorted.filter(test => test.id !== current.id)];
  }, [filteredTests]);

  const statusStyles: Record<Test['status'], string> = {
    active: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-neutral-100 text-neutral-700',
    draft: 'bg-neutral-100 text-neutral-700',
  };

  const resultsByTest = useMemo(() => {
    if (!currentUser) return [];
    return orderedTests.map(test => ({
      test,
      result: getLatestResultForTest(test.id, currentUser.id),
    }));
  }, [orderedTests, currentUser]);

  const totalScore = resultsByTest.reduce((sum, item) => sum + (item.result?.score || 0), 0);
  const totalPossible = resultsByTest.reduce((sum, item) => sum + (item.result?.total || item.test.questions.reduce((s, q) => s + q.points, 0)), 0);

  const submissionCounts = useMemo(() => {
    if (!currentUser) return [];
    return getSubmissionCountsByDay(currentUser.id, 7);
  }, [currentUser]);

  const todayCount = submissionCounts.length ? submissionCounts[submissionCounts.length - 1].count : 0;

  const handleOpenTest = (test: Test, index: number) => {
    if (index === 0 && test.status === 'active') {
      setActiveTest(test);
      setShowTestSession(true);
      return;
    }
    setHighlightTestId(test.id);
    setShowResultsDialog(true);
  };

  const handleTestSubmit = (score: number, total: number) => {
    if (!currentUser || !activeTest) return;
    saveTestResult({
      testId: activeTest.id,
      userId: currentUser.id,
      score,
      total,
    });
    recordSubmission({
      userId: currentUser.id,
      type: 'test',
      meta: { testId: activeTest.id },
    });
    setShowTestSession(false);
    setActiveTest(null);
    setShowResultsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" className="text-neutral-600" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            className="h-9"
            onClick={() => {
              setHighlightTestId(null);
              setShowResultsDialog(true);
            }}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Test Results
          </Button>
          <Button
            variant="outline"
            className="h-9"
            onClick={() => setShowSubmissionsDialog(true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Submissions / Day
          </Button>
        </div>
        <div className="w-36" />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{course.title} - Tests</CardTitle>
          <CardDescription>
            Current test first, followed by previous tests for your batch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orderedTests.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              No tests published for your batch yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedTests.map((test, index) => (
                  <TableRow key={test.id} className={index === 0 ? 'bg-neutral-50' : ''}>
                    <TableCell className="font-semibold">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{test.title}</span>
                        {index === 0 && (
                          <Badge variant="outline" className="text-[10px] h-5">
                            Current Test
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[test.status]}>
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.duration} min</TableCell>
                    <TableCell className="text-sm text-neutral-600">{formatDateTime(test.startDate)}</TableCell>
                    <TableCell className="text-sm text-neutral-600">{formatDateTime(test.endDate)}</TableCell>
                    <TableCell>{test.questions.length}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={index === 0 && test.status === 'scheduled'}
                        onClick={() => handleOpenTest(test, index)}
                      >
                        {index === 0 && test.status === 'active'
                          ? 'Take Test'
                          : index === 0 && test.status === 'scheduled'
                            ? 'Starts Soon'
                            : 'View Results'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTestSession} onOpenChange={setShowTestSession}>
        <DialogContent className={activeTest && showTestSession ? "max-w-[100vw] w-screen h-screen m-0 p-0 rounded-none border-none gap-0" : "max-w-5xl max-h-[90vh] overflow-y-auto"}>
          {!activeTest || !showTestSession ? (
            <DialogHeader>
              <DialogTitle>Start Test</DialogTitle>
              <DialogDescription>
                Camera and microphone access are required to proceed.
              </DialogDescription>
            </DialogHeader>
          ) : null}
          {activeTest && (
            <StudentTestSession
              test={activeTest}
              onCancel={() => {
                setShowTestSession(false);
                setActiveTest(null);
              }}
              onSubmit={handleTestSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Test Results</DialogTitle>
            <DialogDescription>
              Marks for each test in this batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
              <div>
                <div className="text-sm text-neutral-500">Total Score</div>
                <div className="text-2xl font-bold text-neutral-900">{totalScore}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Total Marks</div>
                <div className="text-2xl font-bold text-neutral-900">{totalPossible}</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultsByTest.map(({ test, result }) => (
                  <TableRow key={test.id} className={highlightTestId === test.id ? 'bg-blue-50' : ''}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{result ? result.score : '-'}</TableCell>
                    <TableCell>{result ? result.total : test.questions.reduce((s, q) => s + q.points, 0)}</TableCell>
                    <TableCell>
                      {result ? (
                        <Badge className="bg-green-100 text-green-700">Submitted</Badge>
                      ) : (
                        <Badge className="bg-neutral-100 text-neutral-700">Not Attempted</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmissionsDialog} onOpenChange={setShowSubmissionsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submissions / Day</DialogTitle>
            <DialogDescription>
              Total submissions you have made in the LMS for each day.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500">Today</div>
                <div className="text-2xl font-bold text-neutral-900">{todayCount}</div>
              </div>
              <div className="text-sm text-neutral-500">
                {submissionCounts.length ? submissionCounts[submissionCounts.length - 1].date : '-'}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Submissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionCounts.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
