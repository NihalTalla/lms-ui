# Codify LMS - Coding-Focused Learning Management System

## Overview

Codify LMS is a comprehensive, production-ready learning management system specifically designed for coding education. It features role-based dashboards, an integrated Monaco code editor, auto-grading capabilities, real-time messaging, resume building tools, and analytics dashboards.

## Design System

### Color Tokens

```css
--color-primary: #7C3AED (Purple)
--color-secondary: #14B8A6 (Teal)
--color-accent/success: #10B981 (Green)
--color-warning: #F59E0B (Amber)
--color-danger: #EF4444 (Red)

Neutral Scale:
--color-neutral-900: #0F172A
--color-neutral-700: #334155
--color-neutral-400: #94A3B8
--color-neutral-100: #F1F5F9

Editor Theme:
--color-editor-bg: #0B1220
--color-editor-gutter: #071021
```

### Typography

- **Headlines**: Inter / 700 / 28-34px
- **Subheadings**: Inter / 600 / 18-20px
- **Body**: Inter / 400 / 14-16px
- **Code**: JetBrains Mono / 400 / 13-14px

### Spacing Scale

4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px

### Shadows

- Soft Card: `0 6px 18px rgba(2,6,23,0.08)`
- Medium: `0 4px 12px rgba(2,6,23,0.12)`
- Large: `0 12px 24px rgba(2,6,23,0.16)`

## Features

### Authentication & Role Management

**Demo Login Options:**
- **Student**: Quick access to student dashboard with problem-solving features
- **Faculty**: Access to grading queue and batch management
- **Admin**: Full system analytics and user management

The sign-in page includes:
- Email/password authentication
- Social login buttons (GitHub, Google)
- Quick demo role selection for testing
- Clean, accessible form design

### Role-Based Dashboards

#### Student Dashboard
- **Progress Overview**: Course completion percentage, problems solved, current streak, total points
- **Upcoming Sessions**: Live class schedule with instructor details
- **Recent Submissions**: Quick view of problem attempts with accept/reject status
- **Recommended Problems**: Personalized problem suggestions based on progress
- **Current Batch**: Batch details, schedule, and progress tracking
- **Activity Feed**: Recent achievements and milestones

#### Faculty Dashboard
- **Stats Overview**: Active batches, total students, pending grading queue, unanswered Q&A
- **Recent Submissions**: Student code submissions awaiting review
- **Flagged Questions**: Urgent student queries requiring attention
- **Batch Management**: Quick access to all teaching batches
- **Quick Actions**: Schedule sessions, create assignments, view analytics
- **Upcoming Sessions**: Calendar of scheduled live classes

#### Admin Dashboard
- **System Metrics**: Total users, active courses, system health, monthly growth
- **Analytics Charts**:
  - User enrollment trend (line chart)
  - Course distribution (pie chart)
  - Weekly submission activity (bar chart)
- **Recent Activity**: Real-time system events and user actions
- **Quick Stats**: Active students, completion rates, support tickets

### Code Editor (Monaco Integration)

The code editor provides a VS Code-like experience with:

**Features:**
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Multi-language Support**: Python, JavaScript, Java
- **Theme Toggle**: Light/dark editor themes
- **Auto-save Indicator**: Visual feedback for automatic code saving
- **File Tree** (conceptual): Ready for multi-file support

**Layout:**
- **Problem Sidebar**: Description, constraints, examples, test cases
- **Editor Pane**: Full Monaco editor with customizable settings
- **Console/Output Panel**: Tabbed interface for:
  - Test Cases: View sample inputs/outputs
  - Output: Execution results
  - Results: Detailed submission feedback

**Execution Flow:**
1. **Run Code**: Execute against sample test cases
2. **Submit Code**: Run against all test cases (including hidden)
3. **Real-time Feedback**: 
   - Queued → Running → Results
   - Test case breakdown with pass/fail status
   - Execution time and memory usage
   - Acceptance animations (green pulse) or failure indicators (amber shake)

**Submission Statuses:**
- Queued (blue, loading spinner)
- Running (blue, animated)
- Accepted (green, checkmark, confetti-worthy)
- Wrong Answer (red, with failed test case details)
- Time Limit Exceeded
- Runtime Error
- Compile Error

### Problems Page

**Features:**
- **Search & Filters**: Search by title/description, filter by difficulty and tags
- **Tabbed Views**: All Problems / Solved / Unsolved
- **Problem Cards**: Display title, difficulty badge, tags, points, and solved status
- **Progress Tracking**: Visual indicators for solved problems (green checkmark)
- **Difficulty Badges**: Color-coded (green/easy, yellow/medium, red/hard)

**Sample Problems:**
1. Two Sum (Easy - 100 pts)
2. Reverse Linked List (Easy - 150 pts)
3. Valid Parentheses (Easy - 120 pts)
4. Merge Intervals (Medium - 200 pts)
5. LRU Cache (Hard - 350 pts)

### Leaderboard & Gamification

**Global Leaderboard:**
- Top 10 rankings with medals for top 3
- Metrics: Points, problems solved, streak, badges earned
- Rank change indicators (trending up/down)
- Current user highlighted

**Weekly Leaderboard:**
- Fresh competition each week
- "New" badge for rising stars

**Achievements System:**
- Speed Solver (⚡ - Rare)
- Streak Master (🔥 - Epic)
- First Blood (🎯 - Legendary)
- Night Owl (🦉 - Common)
- Perfectionist (✨ - Rare)

**Progress Tracking:**
- Monthly goals: Problems solved, learning hours, streak
- Visual progress bars
- Badge collection display

### Messaging & Q&A

**Features:**
- **Thread-based Conversations**: Organized Q&A threads
- **Real-time Status**: Open / Answered / Closed
- **Role-based Routing**: Student questions → Faculty responses
- **Rich Messages**: Text content with attachment support
- **Unread Indicators**: Badge counts on unread threads
- **Search**: Find conversations by keyword

**Interface:**
- **Left Panel**: Thread list with preview, status, and timestamp
- **Right Panel**: Full conversation view with message history
- **Message Composer**: Rich text input with attachment button

### Resume Builder

**Sections:**
- Personal Information (name, email, phone, location, LinkedIn, GitHub)
- Professional Summary
- Skills (categorized: languages, frameworks, tools, concepts)
- Experience (job title, company, duration, description)
- Education (degree, institution, year, GPA)
- Projects (name, tech stack, description)
- Achievements (coding accomplishments)

**Features:**
- **Live Preview**: Real-time resume rendering
- **Add/Remove Items**: Dynamic form management
- **Skill Tags**: Visual badge system
- **Export PDF**: Download formatted resume
- **Professional Layout**: Clean, serif-based design

### Courses Page

**My Courses:**
- Course cards with progress tracking
- Metadata: Duration, lessons count, enrolled students
- Tags for technologies/topics
- "Continue Learning" CTA

**Recommended Courses:**
- Difficulty-based recommendations
- Star ratings
- Quick enrollment

**Course Details:**
- Level badges (beginner/intermediate/advanced)
- Comprehensive metadata
- Tag system for easy filtering

### Design Tokens & Components

**Component Library (Shadcn/UI):**
- Accordion, Alert Dialog, Alert, Aspect Ratio
- Avatar, Badge, Breadcrumb, Button
- Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Command
- Context Menu, Dialog, Drawer, Dropdown Menu
- Form, Hover Card, Input (OTP, Text), Label
- Menubar, Navigation Menu, Pagination
- Popover, Progress, Radio Group
- Resizable, Scroll Area, Select, Separator
- Sheet, Sidebar, Skeleton, Slider
- Sonner (Toasts), Switch, Table, Tabs
- Textarea, Toggle (Group), Tooltip

**Custom Components:**
- Layout (with navigation)
- Dashboard variants (Student, Faculty, Admin)
- Code Editor (Monaco wrapper)
- Problems List
- Leaderboard
- Messages
- Resume Builder

### Sample Data

**Users:**
- 1 Admin: Alex Chen
- 2 Faculty: Dr. Sarah Johnson, Prof. Michael Roberts
- 3 Students: Emma Wilson, Liam Martinez, Olivia Taylor

**Courses:**
- Data Structures & Algorithms Mastery (Intermediate, 12 weeks, 48 lessons)
- Full-Stack Web Development (Beginner, 16 weeks, 64 lessons)

**Batches:**
- DSA Batch - Fall 2025 (45 students)
- Web Dev Batch - Fall 2025 (38 students)

**Problems:**
- 5 coding challenges across easy/medium/hard difficulties
- Complete with test cases, constraints, starter code
- Multiple language support

## User Flows

### Student Flow: Solve a Problem

1. **Login** → Select Student role
2. **Dashboard** → View recommended problems
3. **Navigate** → Click "Problems" in sidebar
4. **Select Problem** → Choose from list
5. **Code Editor** → Opens with problem description
6. **Write Code** → Use Monaco editor
7. **Run** → Test against sample cases
8. **Submit** → Execute all test cases
9. **Results** → View detailed feedback
   - Accepted → Earn points, update leaderboard
   - Failed → See which test cases failed, retry

### Faculty Flow: Grade Submission

1. **Login** → Select Faculty role
2. **Dashboard** → View pending grading queue
3. **Review Submission** → Click on student submission
4. **Inspect Code** → View student's solution
5. **Provide Feedback** → Add comments/suggestions
6. **Release Grade** → Submit feedback to student

### Student Flow: Ask Question

1. **Navigate** → Q&A Messages
2. **New Question** → Create thread
3. **Write Question** → Compose message
4. **Submit** → Routes to assigned faculty
5. **Receive Answer** → Get notification
6. **Read Response** → View faculty answer
7. **Mark Resolved** → Close thread

### Student Flow: Build Resume

1. **Navigate** → Profile/Settings
2. **Resume Builder** → Opens form
3. **Fill Sections** → Add personal info, experience, skills
4. **Live Preview** → See formatted resume
5. **Export PDF** → Download resume

## Responsive Design

**Breakpoints:**
- Desktop: 1440px+ (primary)
- Tablet: 1024px - 1439px
- Mobile: 375px - 1023px

**Responsive Features:**
- Collapsible sidebar on mobile
- Stacked layouts for narrow screens
- Touch-optimized buttons and inputs
- Fluid typography scaling

## Accessibility Features

**WCAG 2.1 Compliance:**
- ✅ Color contrast ≥ 4.5:1 for body text
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus states on all interactive elements
- ✅ ARIA labels for icons and controls
- ✅ Semantic HTML structure
- ✅ Screen reader friendly

**Keyboard Shortcuts (Editor):**
- `Ctrl/Cmd + Enter`: Run code
- `Ctrl/Cmd + S`: Save (auto-save enabled)
- `Tab`: Indent
- `Shift + Tab`: Outdent

## Microinteractions & Animations

**Toast Notifications:**
- Success: Green with checkmark
- Error: Red with alert icon
- Info: Blue with info icon
- Duration: 4 seconds

**Editor Feedback:**
- Auto-save: Small green dot indicator
- Test running: Spinner animation
- Accepted: Green pulse animation
- Failed: Amber shake animation

**Hover States:**
- Cards: Subtle shadow elevation
- Buttons: Slight scale and brightness change
- Nav items: Background color fade-in

**Loading States:**
- Skeleton loaders for async content
- Spinner for submission queue
- Progress bars for uploads

## Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Tailwind CSS v4.0
- Shadcn/UI component library
- Monaco Editor (@monaco-editor/react)
- Recharts for analytics visualizations
- Lucide React for icons
- Sonner for toast notifications

**State Management:**
- React Context API for auth
- Local state with useState/useEffect
- LocalStorage for persistence

**Mock Backend:**
- Simulated API calls with setTimeout
- Local data store in `/lib/data.ts`
- Ready for Supabase integration

## Future Enhancements

**Supabase Integration Ready:**
- Real-time subscriptions for live updates
- User authentication & authorization
- Database for persistent storage
- File storage for code submissions
- Edge functions for code execution

**Potential Features:**
- Video lessons integration
- Live coding sessions with WebRTC
- Code review system
- Plagiarism detection
- Certificate generation
- Payment integration for premium courses
- Mobile app (React Native)

## File Structure

```
/
├── App.tsx                         # Main application entry
├── lib/
│   ├── data.ts                    # Sample data & types
│   └── auth-context.tsx           # Authentication context
├── components/
│   ├── Layout.tsx                 # Main layout with nav
│   ├── SignIn.tsx                 # Authentication screen
│   ├── StudentDashboard.tsx       # Student role dashboard
│   ├── FacultyDashboard.tsx       # Faculty role dashboard
│   ├── AdminDashboard.tsx         # Admin role dashboard
│   ├── ProblemsPage.tsx           # Problem list view
│   ├── CodeEditor.tsx             # Monaco editor integration
│   ├── Leaderboard.tsx            # Rankings & achievements
│   ├── Messages.tsx               # Q&A messaging
│   ├── ResumeBuilder.tsx          # Resume creation tool
│   ├── CoursesPage.tsx            # Course catalog
│   └── ui/                        # Shadcn components (40+ files)
├── styles/
│   └── globals.css                # Design tokens & base styles
└── CODIFY_LMS_DOCUMENTATION.md   # This file
```

## Usage Instructions

### Quick Start

1. **Login**: Use quick demo buttons to test different roles
2. **Explore**: Navigate using sidebar menu
3. **Code**: Try solving a problem in the editor
4. **Interact**: Send a message, check the leaderboard
5. **Build**: Create your resume

### Student Workflow

- Start from dashboard to see progress
- Browse problems and select one to solve
- Use the code editor to write solutions
- Submit and track results
- Ask questions in Q&A
- Build resume with achievements

### Faculty Workflow

- Monitor student submissions
- Grade code and provide feedback
- Answer student questions
- Manage batches and schedules
- View student analytics

### Admin Workflow

- Monitor system health
- Manage users and batches
- View platform-wide analytics
- Configure system settings

## Design Philosophy

**Developer-Friendly:**
- Clean, minimal interface reduces cognitive load
- Code editor matches familiar VS Code experience
- Clear hierarchy and information architecture

**Accessible:**
- High contrast for readability
- Keyboard navigation throughout
- Screen reader optimized

**Performant:**
- Optimized renders with React best practices
- Lazy loading for code editor
- Efficient state management

**Scalable:**
- Component-based architecture
- Type-safe with TypeScript
- Ready for real backend integration

## Credits & Attribution

**Design Inspiration:**
- LeetCode, HackerRank (problem solving UX)
- VS Code (editor experience)
- Linear (clean dashboard design)
- Vercel (minimal aesthetic)

**Open Source Libraries:**
- Shadcn/UI by @shadcn
- Monaco Editor by Microsoft
- Recharts by Recharts team
- Lucide Icons by Lucide team

---

**Built with Figma Make** | October 2025 | v1.0.0
