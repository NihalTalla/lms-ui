import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Settings, LogOut, Code2, Home, BookOpen, FileCode, MessageSquare, Award, Users, BarChart3, Calendar, User, AlertCircle, ChevronDown, Trophy, CreditCard, Send, ClipboardList, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

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
              <Code2 className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              <span className="font-bold text-xl">Codify LMS</span>
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
                    onClick={() => {
                      toast.info('Issue reporting feature coming soon');
                    }}
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
    </div>
  );
}