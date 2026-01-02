import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Settings, LogOut, Code2, Home, BookOpen, FileCode, MessageSquare, Award, Users, BarChart3, Calendar, User, AlertCircle, ChevronDown } from 'lucide-react';
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
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'courses', label: 'Courses', icon: BookOpen },
    ];

    if (currentUser.role === 'student') {
      return [
        ...common,
        { id: 'problems', label: 'Problems', icon: FileCode },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
      ];
    } else if (currentUser.role === 'faculty') {
      return [
        ...common,
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'grading', label: 'Grading Queue', icon: FileCode },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
      ];
    } else if (currentUser.role === 'trainer') {
      return [
        ...common,
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'grading', label: 'Grading Queue', icon: FileCode },
        { id: 'messages', label: 'Q&A', icon: MessageSquare },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
        { id: 'tests', label: 'Tests', icon: FileCode },
      ];
    } else {
      return [
        ...common,
        { id: 'users', label: 'Users', icon: Users },
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award },
        { id: 'tests', label: 'Tests', icon: FileCode },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-neutral-200 flex flex-col">
          <nav className="p-4 space-y-1 flex-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
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
          </nav>

          {/* Bottom Profile & Logout Section */}
          <div className="p-4 border-t border-neutral-200 space-y-2">
            {currentUser.role === 'student' && (
              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === 'settings'
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
