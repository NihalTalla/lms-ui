import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { SignIn } from './components/SignIn';
import { Layout } from './components/Layout';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { TrainerDashboard } from './components/TrainerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProblemsPage } from './components/ProblemsPage';
import { CodeEditor } from './components/CodeEditor';
import { CodePracticeConsole } from './components/CodePracticeConsole';
import { Leaderboard } from './components/Leaderboard';
import { Messages } from './components/Messages';

import { CoursesPage } from './components/CoursesPage';
import { GradingQueue } from './components/GradingQueue';
import { BatchManagement } from './components/BatchManagement';
import { ManageInstitutions } from './components/ManageInstitutions';
import { BatchYears } from './components/BatchYears';
import { TrainerInvitation } from './components/TrainerInvitation';
import { Billing } from './components/Billing';
import { CodingContest } from './components/CodingContest';
import { AssessmentsManagement } from './components/AssessmentsManagement';
import { UserManagement } from './components/UserManagement';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AttendancePage } from './components/AttendancePage';
import { StudentSettings } from './components/StudentSettings';
import { StudentProfile } from './components/StudentProfile';
import { TestManagement } from './components/TestManagement';
import { Problem } from './lib/data';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [pageData, setPageData] = useState<any>(null);

  // Reset page state when user changes (including logout/login)
  React.useEffect(() => {
    if (currentUser) {
      setCurrentPage('dashboard');
      setSelectedProblem(null);
      setPageData(null);
    }
  }, [currentUser?.id]); // Reset when user ID changes

  if (!currentUser) {
    return <SignIn />;
  }

  const handleNavigate = (page: string, data?: any) => {
    setPageData(data || null);
    if (page === 'problem' && data) {
      setSelectedProblem(data);
      setCurrentPage('editor');
    } else {
      setCurrentPage(page);
      setSelectedProblem(null);
    }
  };

  const renderContent = () => {
    // Code Editor view (no layout)
    if (currentPage === 'editor' && selectedProblem) {
      return <CodeEditor problem={selectedProblem} onBack={() => setCurrentPage('problems')} />;
    }

    // Code Practice Console view (no layout)
    if (currentPage === 'code-practice') {
      return <CodePracticeConsole onBack={() => setCurrentPage('dashboard')} />;
    }

    // All other views use Layout
    return (
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {currentPage === 'dashboard' && (
          <>
            {currentUser.role === 'student' && <StudentDashboard onNavigate={handleNavigate} />}
            {currentUser.role === 'faculty' && <FacultyDashboard onNavigate={handleNavigate} />}
            {currentUser.role === 'trainer' && <TrainerDashboard onNavigate={handleNavigate} />}
            {currentUser.role === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
          </>
        )}
        {currentPage === 'problems' && <ProblemsPage onSelectProblem={(problem) => handleNavigate('problem', problem)} />}
        {currentPage === 'leaderboard' && <Leaderboard />}
        {currentPage === 'messages' && <Messages />}
        {currentPage === 'profile' && currentUser.role === 'student' && <StudentProfile onNavigate={handleNavigate} />}
        {currentPage === 'profile' && currentUser.role !== 'student' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Profile</h2>
              <p className="text-neutral-600 mt-1">View and manage your profile information</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <p className="text-neutral-600">Profile management coming soon...</p>
            </div>
          </div>
        )}
        {currentPage === 'courses' && <CoursesPage onNavigate={handleNavigate} />}
        {currentPage === 'batches' && <BatchManagement onNavigate={handleNavigate} role={currentUser.role} initialFilters={pageData} />}
        {currentPage === 'manage-institutions' && <ManageInstitutions />}
        {currentPage === 'batch-years' && <BatchYears onNavigate={handleNavigate} />}
        {currentPage === 'trainer-invitation' && <TrainerInvitation />}
        {currentPage === 'billing' && <Billing />}
        {currentPage === 'coding-contest' && <CodingContest />}
        {currentPage === 'assessments-management' && <AssessmentsManagement />}
        {currentPage === 'grading' && <GradingQueue onNavigate={handleNavigate} />}
        {currentPage === 'users' && <UserManagement onNavigate={handleNavigate} />}
        {currentPage === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
        {currentPage === 'attendance' && <AttendancePage />}
        {currentPage === 'settings' && currentUser.role === 'student' && <StudentSettings onNavigate={handleNavigate} />}
        {currentPage === 'tests' && (currentUser.role === 'admin' || currentUser.role === 'trainer') && <TestManagement />}
      </Layout>
    );
  };

  return (
    <>
      {renderContent()}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}