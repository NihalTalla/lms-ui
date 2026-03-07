import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Settings, LogOut, Code2, Home, BookOpen, FileCode, MessageSquare, Award, Users, BarChart3, Calendar, User, AlertCircle, ChevronDown, Trophy, CreditCard, Send, ClipboardList, TrendingUp, FileText } from 'lucide-react';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { EdRealmLogo } from './EdRealmLogo';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  hideSidebar?: boolean;
}

export function Layout({ children, currentPage, onNavigate, hideSidebar = false }: LayoutProps) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const [isInstitutionsOpen, setIsInstitutionsOpen] = React.useState(false);
  const [isAssessmentsOpen, setIsAssessmentsOpen] = React.useState(false);

  const [isIssueDialogOpen, setIsIssueDialogOpen] = React.useState(false);
  const [issueTitle, setIssueTitle] = React.useState('');
  const [issueCategory, setIssueCategory] = React.useState('');
  const [issuePriority, setIssuePriority] = React.useState('Medium');
  const [issueDescription, setIssueDescription] = React.useState('');

  const [submittedIssues, setSubmittedIssues] = React.useState([
    {
      id: 1,
      title: 'Unable to load assignment history',
      date: '2026-03-05',
      category: 'Academic',
      priority: 'Medium',
      status: 'In-progress',
      description: 'Assignment history panel stays blank for some users. Support team will update this issue status as progress is made.'
    }
  ]);

  const handleIssueSubmit = () => {
    if (!issueTitle.trim() || !issueDescription.trim() || !issueCategory.trim()) {
      toast.error('Please provide a title, category, and description for the issue.');
      return;
    }

    setSubmittedIssues([
      {
        id: Date.now(),
        title: issueTitle,
        date: new Date().toISOString().split('T')[0],
        category: issueCategory,
        priority: issuePriority,
        status: 'Open',
        description: 'Support team will review this issue shortly.'
      },
      ...submittedIssues
    ]);

    toast.success('Your issue has been submitted successfully.');
    setIssueTitle('');
    setIssueCategory('');
    setIssuePriority('Medium');
    setIssueDescription('');
  };


  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'courses', label: 'Courses', icon: BookOpen },
    ];

    if (currentUser.role === 'student') {
      return [
        ...common,
        { id: 'problems', label: 'Problems', icon: FileCode },
        { id: 'contests', label: 'Contests', icon: Trophy },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
      ];
    } else if (currentUser.role === 'faculty') {
      return [
        ...common,
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
      ];
    } else if (currentUser.role === 'trainer') {
      return [
        ...common,
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
        { id: 'tests', label: 'Tests', icon: FileCode },
        { id: 'materials', label: 'Materials', icon: FileText },
      ];
    } else {
      return [
        ...common,
        { id: 'users', label: 'Users', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
        { id: 'trainer-invitation', label: 'Trainer Invitation', icon: Send },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'coding-contest', label: 'Coding Contest', icon: Trophy },
        { id: 'tests', label: 'Tests', icon: FileCode },
        { id: 'materials', label: 'Materials', icon: FileText },
      ];

    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-50 overflow-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate('dashboard')}
            >
              <EdRealmLogo size="small" />
              <div
                className="px-2 py-1 rounded text-xs capitalize"
                style={{
                  backgroundColor: currentUser.role === 'student'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : currentUser.role === 'faculty'
                      ? 'rgba(20, 184, 166, 0.1)'
                      : 'rgba(124, 58, 237, 0.1)',
                  color: currentUser.role === 'student'
                    ? 'var(--color-accent)'
                    : currentUser.role === 'faculty'
                      ? 'var(--color-secondary)'
                      : 'var(--color-primary)',
                }}
              >
                {currentUser.role}
              </div>
            </div>

            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search courses, problems, or users..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Dropdown - For All Users */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-transparent">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ backgroundColor: currentUser.role === 'student' ? '#7C3AED' : 'var(--color-primary)', color: 'white' }}>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-0 rounded-lg shadow-lg border border-neutral-200">
                <div className="p-1">
                  <DropdownMenuItem
                    onClick={() => setIsIssueDialogOpen(true)}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-md hover:bg-neutral-50 focus:bg-neutral-50"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-neutral-700 text-sm">Raise an Issue</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-md hover:bg-neutral-50 focus:bg-neutral-50"
                  >
                    <User className="w-4 h-4 text-neutral-600" />
                    <span className="text-neutral-700 text-sm">View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      toast.success('Logged out successfully');
                    }}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-md hover:bg-neutral-50 focus:bg-neutral-50 text-neutral-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="px-3 py-3 bg-neutral-100 rounded-b-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback style={{ backgroundColor: currentUser.role === 'student' ? '#7C3AED' : 'var(--color-primary)', color: 'white' }}>
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate text-neutral-900">{currentUser.name.toUpperCase()}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Fixed Sidebar */}
      {!hideSidebar && (
        <aside className="fixed left-0 bg-white border-r border-neutral-200 flex flex-col overflow-hidden z-40 transition-all duration-200 w-64 opacity-100 visible" style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'text-white shadow-md'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:shadow-sm'
                    }`}
                  style={isActive ? { backgroundColor: 'var(--color-primary)' } : {}}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Institutions Dropdown for Admin */}
            {currentUser.role === 'admin' && (
              <div className="space-y-1">
                <button
                  onClick={() => setIsInstitutionsOpen(!isInstitutionsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-neutral-700 hover:bg-neutral-100 uppercase text-xs font-bold tracking-wider mt-4`}
                >
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    INSTITUTIONS
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isInstitutionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isInstitutionsOpen && (
                  <div className="pl-4 space-y-1">
                    <button
                      onClick={() => onNavigate('manage-institutions')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'manage-institutions'
                        ? 'bg-neutral-100 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">Manage Institutions</span>
                    </button>
                    <button
                      onClick={() => onNavigate('batch-years')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'batch-years'
                        ? 'bg-neutral-100 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Batch Years</span>
                    </button>
                    <button
                      onClick={() => onNavigate('batches')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'batches'
                        ? 'bg-neutral-100 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Batches</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Assessments Dropdown for Admin */}
            {currentUser.role === 'admin' && (
              <div className="space-y-1">
                <button
                  onClick={() => setIsAssessmentsOpen(!isAssessmentsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-neutral-700 hover:bg-neutral-100 uppercase text-xs font-bold tracking-wider`}
                >
                  <span className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4" />
                    ASSESSMENTS
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAssessmentsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAssessmentsOpen && (
                  <div className="pl-4 space-y-1">
                    <button
                      onClick={() => onNavigate('assessments-management')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'assessments-management'
                        ? 'bg-neutral-100 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Reports</span>
                    </button>
                    <button
                      onClick={() => onNavigate('assessments-management')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'assessments-management'
                        ? 'bg-neutral-100 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Progress</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </nav>

          {/* Bottom Profile & Logout Section */}
          <div className="p-4 border-t border-neutral-200 space-y-2">
            {currentUser.role === 'student' && (
              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentPage === 'settings'
                  ? 'text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:shadow-sm'
                  }`}
                style={currentPage === 'settings' ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            )}
            <button
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto transition-all duration-200" style={{ marginLeft: hideSidebar ? '0' : '256px' }}>
        <div className="p-6 min-h-full">
          {children}
        </div>
      </main>
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">
          <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50 block">
            <div className="mb-8 relative">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Raise an Issue</h2>
              <p className="text-black">Report bugs, platform issues, or support requests.</p>

              <button
                onClick={() => setIsIssueDialogOpen(false)}
                className="absolute -top-2 right-0 p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Form */}
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Submit New Issue</h3>
                  <p className="text-sm text-neutral-500">Share details so support can resolve it faster.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="issue-title" className="text-sm font-semibold text-slate-700">Issue Title</label>
                    <Input
                      id="issue-title"
                      placeholder="Example: Profile image upload fails"
                      className="bg-neutral-50 border-neutral-200"
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="issue-category" className="text-sm font-semibold text-slate-700">Category</label>
                    <select
                      id="issue-category"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={issueCategory}
                      onChange={(e) => setIssueCategory(e.target.value)}
                    >
                      <option value="" disabled>Choose category</option>
                      <option value="Academic">Academic</option>
                      <option value="Technical">Technical / Platform Bug</option>
                      <option value="Billing">Billing or Payment</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="issue-priority" className="text-sm font-semibold text-slate-700">Priority</label>
                    <select
                      id="issue-priority"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={issuePriority}
                      onChange={(e) => setIssuePriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="issue-desc" className="text-sm font-semibold text-slate-700">Description</label>
                    <Textarea
                      id="issue-desc"
                      placeholder="Describe what happened, expected behavior, and steps to reproduce."
                      className="h-28 bg-neutral-50 border-neutral-200 resize-none"
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleIssueSubmit}
                  className="w-full mt-2 font-semibold h-11"
                  style={{ backgroundColor: '#111827', color: 'white' }}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Submit Issue
                </Button>
              </div>

              {/* Right Column: History */}
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">My Issue History</h3>
                  <p className="text-sm text-neutral-500">Track your reported issues and statuses.</p>
                </div>

                <div className="space-y-4">
                  {submittedIssues.map((issue) => (
                    <div key={issue.id} className="p-4 border border-neutral-100 rounded-lg hover:border-neutral-200 transition-colors bg-white shadow-xs">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800 flex-1 pr-4">{issue.title}</h4>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                            {issue.priority}
                          </span>
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${issue.status.toLowerCase() === 'open' ? 'bg-orange-50 text-orange-600' :
                            issue.status.toLowerCase() === 'in-progress' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-green-50 text-green-600'
                            }`}>
                            {issue.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-500 mb-3 font-medium">
                        {issue.date} • {issue.category}
                      </div>

                      <div className="bg-neutral-50 rounded p-3 flex gap-3 text-sm text-neutral-600">
                        <Settings className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
                        <p>{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
