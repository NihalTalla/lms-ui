# Student Module Learning Interface - Implementation Guide

## Overview
This document describes the newly implemented student module learning interface for the Codify LMS. The system follows a progressive disclosure pattern where students navigate through courses → modules → assignments → topics → coding challenges.

## Navigation Flow

```
Student Dashboard
    ↓
Courses Page (CoursesPage.tsx)
    ↓
Course Modules Page (CourseModulesPage.tsx)
    ↓
Module View - Sidebar with Assignments (StudentModuleView.tsx)
    ↓
Assignment Listing - Topics Table (AssignmentListingPage.tsx) ← NEW
    ↓
Topic Details - Content + Left Sidebar (TopicDetailsPage.tsx) ← NEW
    ↓
Full-Screen Coding Challenge (CodingChallengeUI.tsx) ← NEW
```

## New Components

### 1. AssignmentListingPage.tsx
**Purpose:** Display all topics/subtopics within an assignment with their completion status.

**Key Features:**
- Clean white background with card-based layout
- Header showing assignment name, submission status, and timestamp
- Table displaying topics with columns:
  - Topic name and metadata (difficulty, duration)
  - Questions completed count
  - Status badge (Submitted/Pending)
  - Retake Test button
  - Chevron icon for navigation
- Bottom navigation buttons (Previous/Next)

**Props:**
```typescript
interface AssignmentListingPageProps {
  assignment: TopicQuestion;
  moduleName: string;
  courseName: string;
  onSelectTopic: (topic: any) => void;
  onBack: () => void;
}
```

**Navigation:**
- Click on a topic row → TopicDetailsPage
- Click Back → StudentModuleView
- Click Next/Previous → Navigate between assignments

---

### 2. TopicDetailsPage.tsx
**Purpose:** Display detailed content of a topic with interactive sidebar for topic selection.

**Key Features:**
- **Left Sidebar (Dark Gradient):**
  - Back button
  - Topic/Assignment title
  - Progress indicator showing completion percentage
  - Expandable section showing all topics in the assignment
  - Each topic item shows:
    - Status icon (checkmark for completed)
    - Title
    - Questions count and duration
  - Highlight current selection with orange accent

- **Right Content Area (White):**
  - Large title with completion badge
  - Problem statement
  - Learning objectives (bulleted list)
  - Info cards showing:
    - Total questions count
    - Estimated time to complete
  - "Start Coding" button (orange)
  - "View Resources" button (outline)

**Props:**
```typescript
interface TopicDetailsPageProps {
  assignmentTitle: string;
  moduleName: string;
  courseName: string;
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onStartCoding: (topicId: string) => void;
  onBack: () => void;
}
```

**Layout:** Full-height split screen (20% sidebar, 80% content)

---

### 3. CodingChallengeUI.tsx
**Purpose:** Full-screen LeetCode-like coding interface for solving problems.

**Key Features:**
- **Top Header:**
  - Logo + "Gradious" text
  - Back button
  - Submit button (orange)

- **Main Layout (Split Screen):**
  
  **Left Panel (35% - Problem Description):**
  - Problem title with difficulty badge
  - Problem statement (scrollable)
  - Example section with multiple example cards
  - Each example shows: input, output, explanation
  
  **Right Panel (65% - Editor & Tests):**
  - Code Editor Card:
    - Language selector (Java, Python, C++, JavaScript)
    - Toolbar: Reset, Theme toggle (light/dark), Copy, Fullscreen icons
    - Line numbers
    - Syntax-highlighted editor (dark mode by default)
  
  - Test Cases Card:
    - Tabs for each test case
    - Shows passed/failed status
    - Displays input and expected output
    - Score badge showing submission percentage
  
  - Action Buttons:
    - "Run Code" button (orange) - runs visible tests
    - "Submit" button (green) - runs all tests including hidden

**Theme Support:**
- Dark theme (default): Dark editor with green text
- Light theme: Light editor with dark text
- Toggle button to switch themes

**Props:**
```typescript
interface CodingChallengeUIProps {
  topicTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemDescription: string;
  examples: Array<{ id: string; input: string; output: string; explanation?: string }>;
  testCases: Array<{ id: string; input: string; expectedOutput: string; hidden: boolean }>;
  starterCode?: { [language: string]: string };
  onSubmit: (code: string, language: string) => void;
  onBack: () => void;
}
```

**Color Scheme:**
- Easy: Green badge
- Medium: Yellow badge
- Hard: Red badge
- Primary action: Orange (Submit, Run Code)
- Secondary action: Green (Submit final)

---

## Integration with App.tsx

### New Navigation Pages
Four new pages added to the navigation system:

1. **`assignment-listing`** - Shows topics table for an assignment
2. **`topic-details`** - Shows topic content with sidebar and start coding button
3. **`coding-challenge-ui`** - Full-screen coding interface
4. Existing **`student-module`** - Updated to navigate to assignment-listing

### Data Flow Through Pages

```javascript
// Student clicks on assignment in StudentModuleView
→ handleNavigate('assignment-listing', {
    assignment: TopicQuestion,
    moduleName: string,
    courseName: string,
    previousData: StudentModuleViewData
  })

// Student clicks on topic in assignment table
→ handleNavigate('topic-details', {
    assignment: TopicQuestion,
    topic: TopicData,
    moduleName: string,
    courseName: string
  })

// Student clicks "Start Coding" button
→ handleNavigate('coding-challenge-ui', {
    topicTitle: string,
    difficulty: string,
    problemDescription: string,
    examples: ExampleData[],
    testCases: TestCaseData[]
  })

// Student submits code
→ Back to topic-details → Back to assignment-listing → Back to student-module
```

---

## Styling Specifications

### Color Palette
- **Primary Orange:** `var(--color-warning)` - Used for action buttons and highlights
- **Success Green:** `#22c55e`, `#10b981` - Status indicators
- **Status Yellow:** `#eab308`, `#ca8a04` - Medium difficulty, pending status
- **Error Red:** `#ef4444`, `#dc2626` - Hard difficulty, failed tests
- **Dark Gradient:** `from-slate-900 via-blue-900 to-slate-950` - Sidebar background
- **Neutral:** `neutral-900` to `neutral-50` - Text and backgrounds

### Typography
- **Headings:** Bold, Large size (3xl-4xl)
- **Body:** Regular weight, `text-sm` to `text-base`
- **Code:** Monospace font, `text-sm`
- **Labels:** `text-xs`, Bold

### Components Used
All components use shadcn/ui library:
- `Button` - Action buttons
- `Badge` - Status indicators
- `Card`, `CardContent` - Content containers
- `Table`, `TableHead`, `TableBody`, etc. - Data tables
- `Progress` - Progress indicators
- `Select`, `SelectTrigger`, `SelectContent` - Dropdowns
- Icons from `lucide-react`

---

## Features Demonstrated

### 1. Responsive Sidebar Navigation
- Collapsible sections
- Visual indicators for current selection
- Smooth hover effects
- Accessibility with keyboard navigation

### 2. Rich Code Editor
- Syntax highlighting support
- Language selection
- Line numbers
- Reset and copy functionality
- Theme toggling
- Fullscreen option

### 3. Test Case Management
- Visible vs. hidden test cases
- Click to view test details
- Pass/fail status indicators
- Score calculation
- Toast notifications for results

### 4. Problem Presentation
- Clear problem statement
- Multiple examples with explanations
- Difficulty levels with color coding
- Expected output highlighting

### 5. Progressive Disclosure
Each page shows exactly what the student needs without overwhelming:
- Assignment page: Overview of all topics
- Topic page: Content + navigation
- Coding page: Problem + editor, no distractions

---

## Usage Example

```tsx
// From StudentModuleView, trigger assignment view:
onNavigate('assignment-listing', {
  assignment: selectedQuestion,
  moduleName: 'Problem Solving with Iteration',
  courseName: 'Java Advanced',
  previousData: moduleViewData
});

// AssignmentListingPage → TopicDetailsPage
onSelectTopic(topic) {
  handleNavigate('topic-details', {
    assignment: topic,
    topic: topicData,
    moduleName: 'Problem Solving with Iteration',
    courseName: 'Java Advanced'
  });
}

// TopicDetailsPage → CodingChallengeUI
onStartCoding() {
  handleNavigate('coding-challenge-ui', {
    topicTitle: 'Longest Substring Without Repeating Characters',
    difficulty: 'Easy',
    problemDescription: 'Find the length of the longest substring...',
    examples: examplesArray,
    testCases: testCasesArray
  });
}
```

---

## Mobile Responsiveness
The current implementation is optimized for desktop viewing. For mobile support, consider:
- Collapsing the left sidebar on smaller screens
- Full-width editor on mobile
- Vertical stacking of panels
- Touch-friendly button sizes

---

## Future Enhancements
1. **Backend Integration:** Connect to actual problem database and code execution engine
2. **Real-time Collaboration:** Pair programming features
3. **Video Tutorials:** Embed tutorial videos in topic details
4. **Gamification:** Points, badges, streaks
5. **Analytics:** Track student progress and performance
6. **Discussion Forum:** Per-topic Q&A
7. **Code Review:** Instructor feedback on submissions
8. **Code Plagiarism Detection:** Prevent cheating
