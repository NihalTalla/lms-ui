import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle2, Clock, X, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasMarkedToday, setHasMarkedToday] = useState(false);

  // Mock attendance data
  const attendanceRecords = [
    { id: 1, date: 'Dec 20, 2024', time: '9:15 AM', session: 'Data Structures - Trees', status: 'present' },
    { id: 2, date: 'Dec 18, 2024', time: '9:20 AM', session: 'Algorithms - Sorting', status: 'present' },
    { id: 3, date: 'Dec 16, 2024', time: '-', session: 'Dynamic Programming', status: 'absent' },
    { id: 4, date: 'Dec 13, 2024', time: '9:10 AM', session: 'Graph Algorithms', status: 'present' },
    { id: 5, date: 'Dec 11, 2024', time: '9:25 AM', session: 'Binary Search Trees', status: 'late' },
    { id: 6, date: 'Dec 9, 2024', time: '9:05 AM', session: 'Hash Tables', status: 'present' },
    { id: 7, date: 'Dec 6, 2024', time: '9:30 AM', session: 'Linked Lists', status: 'late' },
    { id: 8, date: 'Dec 4, 2024', time: '9:15 AM', session: 'Arrays & Strings', status: 'present' },
  ];

  const stats = {
    totalSessions: 25,
    attended: 21,
    percentage: 84,
    onTime: 18,
    late: 3,
    absent: 4,
  };

  const handleMarkAttendance = () => {
    setHasMarkedToday(true);
    toast.success('Attendance marked successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case 'late':
        return (
          <Badge className="bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-100 text-red-700">
            <X className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return null;
    }
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Attendance</h2>
        <p className="text-neutral-600 mt-1">
          Mark and track your class attendance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Attendance Rate</p>
                <h3 className="mt-1">{stats.percentage}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="mt-3 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  width: `${stats.percentage}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Present</p>
                <h3 className="mt-1">{stats.attended}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-neutral-600 mt-2">out of {stats.totalSessions} sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Late</p>
                <h3 className="mt-1">{stats.late}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-neutral-600 mt-2">sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Absent</p>
                <h3 className="mt-1">{stats.absent}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                <X className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-neutral-600 mt-2">sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mark Today's Attendance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              Record your attendance for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium">Today's Session</span>
                </div>
                <Badge style={{ backgroundColor: 'var(--color-primary)' }}>Active</Badge>
              </div>
              <p className="text-sm text-neutral-700 mb-1">Data Structures - Trees</p>
              <p className="text-xs text-neutral-600">Monday, {today}</p>
              <p className="text-xs text-neutral-600">9:00 AM - 11:00 AM</p>
            </div>

            {!hasMarkedToday ? (
              <div className="space-y-3">
                <Button
                  className="w-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  onClick={handleMarkAttendance}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Present
                </Button>
                <p className="text-xs text-neutral-600 text-center">
                  Click to mark your attendance for today's session
                </p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-green-700">Attendance Marked</p>
                <p className="text-xs text-green-600 mt-1">You're all set for today!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              View your past attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">{record.session}</p>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.date}
                      </div>
                      {record.time !== '-' && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.time}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>
            Your attendance pattern for December 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-neutral-600 py-2">
                {day}
              </div>
            ))}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const hasSession = day % 2 === 1 && day <= 20;
              const status = hasSession
                ? day % 7 === 0
                  ? 'absent'
                  : day % 5 === 0
                  ? 'late'
                  : 'present'
                : null;

              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-md text-sm ${
                    hasSession
                      ? status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : status === 'late'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-neutral-50 text-neutral-400'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 rounded" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-neutral-50 rounded border" />
              <span>No Session</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
