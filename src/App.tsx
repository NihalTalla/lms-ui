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
import { ContestNotificationProvider, ContestNotificationPopup } from './components/ContestNotification';
import { StudentContestDashboard } from './components/StudentContestDashboard';
import { ContestParticipation } from './components/ContestParticipation';
import { CoursesPage } from './components/CoursesPage';
import { GradingQueue } from './components/GradingQueue';
import { BatchManagement } from './components/BatchManagement';
import { ManageInstitutions } from './components/ManageInstitutions';
import { BatchYears } from './components/BatchYears';
import { Billing } from './components/Billing';
import { CodingContest } from './components/CodingContest';
import { MyTrainers, SendInvitation } from './components/TrainerInvitation';
import { AssessmentManagement } from './components/AssessmentManagement';
import { UserManagement } from './components/UserManagement';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AttendancePage } from './components/AttendancePage';
import { StudentSettings } from './components/StudentSettings';
import { StudentProfile } from './components/StudentProfile';
import { TestManagement } from './components/TestManagement';
import { CourseModulesPage } from './components/CourseModulesPage';
import { TestMonitoring } from './components/TestMonitoring';
import { ProgramizCompiler } from './components/ProgramizCompiler';
import { StudentModuleView } from './components/StudentModuleView';
import { StudentCodingChallenge } from './components/StudentCodingChallenge';
import { AssignmentListingPage } from './components/AssignmentListingPage';
import { TopicDetailsPage } from './components/TopicDetailsPage';
import { CodingChallengeUI } from './components/CodingChallengeUI';
import { StudentCourseTests } from './components/StudentCourseTests';
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

        // Assignment Listing Page (no layout)
        if (currentPage === 'assignment-listing' && pageData) {
            return (
                <AssignmentListingPage
                    assignment={pageData.assignment}
                    moduleName={pageData.moduleName}
                    courseName={pageData.courseName}
                    onSelectTopic={(topic) => {
                        handleNavigate('coding-challenge-ui', {
                            topicTitle: topic.title,
                            difficulty: topic.difficulty || 'Easy',
                            problemDescription: 'Find the length of the longest substring without repeating characters in a given string.',
                            examples: [
                                {
                                    id: 'ex-1',
                                    input: 'str = "abcabcbb"',
                                    output: '3',
                                    explanation: 'The longest substring without repeating characters is "abc", with the length of 3.',
                                },
                            ],
                            testCases: [
                                { id: 'tc-1', input: 'abcabcbb', expectedOutput: '3', hidden: false },
                                { id: 'tc-2', input: 'bbbbb', expectedOutput: '1', hidden: false },
                                { id: 'tc-3', input: 'pwwkew', expectedOutput: '3', hidden: false },
                            ],
                            previousData: pageData,
                        });
                    }}
                    onBack={() => handleNavigate('student-module', pageData.previousData)}
                />
            );
        }

        // Topic Details Page (no layout)
        if (currentPage === 'topic-details' && pageData) {
            return (
                <TopicDetailsPage
                    assignmentTitle={pageData.assignment.question}
                    moduleName={pageData.moduleName}
                    courseName={pageData.courseName}
                    selectedTopicId={pageData.topic.id}
                    onSelectTopic={(topicId) => {
                        const updatedData = { ...pageData, topic: { ...pageData.topic, id: topicId } };
                        setPageData(updatedData);
                    }}
                    onStartCoding={() => {
                        handleNavigate('coding-challenge-ui', {
                            topicTitle: pageData.topic.title,
                            difficulty: pageData.topic.difficulty || 'Easy',
                            problemDescription: pageData.topic.content,
                            examples: [
                                {
                                    id: 'ex-1',
                                    input: 'abcabcbb',
                                    output: '3',
                                    explanation: 'The longest substring without repeating characters is "abc".',
                                },
                            ],
                            testCases: [
                                { id: 'tc-1', input: 'abcabcbb', expectedOutput: '3', hidden: false },
                                { id: 'tc-2', input: 'bbbbb', expectedOutput: '1', hidden: false },
                                { id: 'tc-3', input: 'pwwkew', expectedOutput: '3', hidden: true },
                            ],
                        });
                    }}
                    onBack={() => setCurrentPage('assignment-listing')}
                />
            );
        }

        // Student Module View (no layout - has its own sidebar)
        if (currentPage === 'student-module' && pageData) {
            return (
                <StudentModuleView
                    course={pageData.course}
                    selectedModule={pageData.module}
                    onNavigate={(page, data) => {
                        if (page === 'assignment-listing') {
                            handleNavigate('assignment-listing', {
                                assignment: data,
                                moduleName: pageData.module.title,
                                courseName: pageData.course.title,
                                previousData: pageData,
                            });
                        } else {
                            handleNavigate(page, data);
                        }
                    }}
                    onBack={() => handleNavigate('course-modules', pageData.course)}
                />
            );
        }

        // Full-Screen Coding Challenge (no layout)
        if (currentPage === 'coding-challenge-ui' && pageData) {
            return (
                <CodingChallengeUI
                    topicTitle={pageData.topicTitle}
                    difficulty={pageData.difficulty}
                    problemDescription={pageData.problemDescription}
                    examples={pageData.examples}
                    testCases={pageData.testCases}
                    onSubmit={(code, language) => {
                        console.log('Code submitted:', { code, language });
                        if (pageData.previousData) {
                            handleNavigate('assignment-listing', pageData.previousData);
                        } else {
                            handleNavigate('dashboard');
                        }
                    }}
                    onBack={() => {
                        if (pageData.previousData) {
                            handleNavigate('assignment-listing', pageData.previousData);
                        } else {
                            handleNavigate('dashboard');
                        }
                    }}
                />
            );
        }

        // Full-Screen Coding Challenge (no layout)
        if (currentPage === 'student-coding' && pageData) {
            return (
                <StudentCodingChallenge
                    challenge={pageData.challenge}
                    module={pageData.module}
                    course={pageData.course}
                    onNavigate={handleNavigate}
                    onBack={() => setCurrentPage('student-module')}
                />
            );
        }

        // Full-Screen Contest Participation (no layout)
        if (currentPage === 'contest-play' && pageData) {
            return (
                <ContestParticipation
                    contest={pageData.contest}
                    onSubmit={(answers) => {
                        console.log('Contest submitted:', answers);
                        handleNavigate('contests');
                    }}
                    onExit={() => handleNavigate('contests')}
                />
            );
        }

        // All other views use Layout
        return (
            <Layout
                currentPage={currentPage}
                onNavigate={handleNavigate}
                hideSidebar={['courses', 'course-tests', 'course-modules', 'student-module', 'assignment-listing', 'topic-details', 'student-coding', 'coding-challenge-ui'].includes(currentPage)}
            >
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
                {currentPage === 'course-tests' && pageData && currentUser.role === 'student' && (
                    <StudentCourseTests course={pageData.course} onBack={() => handleNavigate('courses')} />
                )}
                {currentPage === 'batches' && <BatchManagement onNavigate={handleNavigate} role={currentUser.role} initialFilters={pageData} />}
                {currentPage === 'manage-institutions' && <ManageInstitutions />}
                {currentPage === 'batch-years' && <BatchYears onNavigate={handleNavigate} />}
                {currentPage === 'trainer-invitation' && <MyTrainers onNavigate={handleNavigate} />}
                {currentPage === 'send-invitation' && <SendInvitation onNavigate={handleNavigate} />}
                {currentPage === 'billing' && <Billing />}
                {currentPage === 'coding-contest' && currentUser.role === 'admin' && <CodingContest />}
                {currentPage === 'contests' && currentUser.role === 'student' && <StudentContestDashboard onNavigate={handleNavigate} />}
                {(currentPage === 'assessments-management' || currentPage === 'assessment') && <AssessmentManagement />}
                {currentPage === 'grading' && <GradingQueue onNavigate={handleNavigate} />}
                {currentPage === 'users' && <UserManagement onNavigate={handleNavigate} />}
                {currentPage === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
                {currentPage === 'attendance' && <AttendancePage />}
                {currentPage === 'settings' && currentUser.role === 'student' && <StudentSettings onNavigate={handleNavigate} />}
                {currentPage === 'tests' && (currentUser.role === 'admin' || currentUser.role === 'trainer') && <TestManagement onNavigate={handleNavigate} />}
                {currentPage === 'course-modules' && pageData && currentUser.role === 'student' && (
                    <CourseModulesPage
                        course={pageData}
                        onNavigate={handleNavigate}
                        userRole={currentUser.role as 'faculty' | 'trainer' | 'student'}
                        canLock={false}
                    />
                )}
                {currentPage === 'course-modules' && pageData && (currentUser.role === 'faculty' || currentUser.role === 'trainer') && (
                    <CourseModulesPage
                        course={pageData}
                        onNavigate={handleNavigate}
                        userRole={currentUser.role as 'faculty' | 'trainer' | 'student'}
                        canLock={currentUser.role === 'faculty' || currentUser.role === 'trainer'}
                    />
                )}

                {currentPage === 'test-monitoring' && pageData && (
                    <TestMonitoring
                        testName={pageData.testName}
                        batch={pageData.batch}
                        onNavigate={handleNavigate}
                        userRole={currentUser.role as 'faculty' | 'trainer'}
                    />
                )}
                {currentPage === 'trainer-compiler' && <ProgramizCompiler onBack={() => setCurrentPage('dashboard')} />}
            </Layout>
        );
    };

    return (
        <>
            {renderContent()}
            <ContestNotificationPopup />
            <Toaster richColors position="top-right" />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ContestNotificationProvider>
                <AppContent />
            </ContestNotificationProvider>
        </AuthProvider>
    );
}
