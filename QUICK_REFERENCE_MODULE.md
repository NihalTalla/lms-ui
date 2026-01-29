# Quick Reference - Student Module Learning Interface

## 🚀 Quick Start

### For Testing
1. Log in as a student
2. Go to Dashboard → Courses
3. Select a course → View Modules
4. Click on an assignment in the module
5. Select a topic from the assignment table
6. Click "Start Coding" to launch the full editor

### Navigation Map
```
Courses → Module → Assignment → Topic → Coding Challenge
           |           |          |           |
         Click      Click      Click      Submit
        Course   Assignment   Topic      or Back
```

---

## 📱 Page Reference

### 1. AssignmentListingPage
**URL Trigger**: `handleNavigate('assignment-listing', data)`

**What it shows:**
- Table of topics in an assignment
- Completion status for each topic
- Difficulty level and time estimate

**Key Elements:**
- Header with assignment name + status
- Data table with columns: Topic, Questions, Status, Action, →
- Retake Test button for each topic
- Back button
- Navigation buttons (Previous/Next)

**User Actions:**
- Click topic row → Go to TopicDetailsPage
- Click Retake Test → Show toast
- Click Back → Return to StudentModuleView

---

### 2. TopicDetailsPage
**URL Trigger**: `handleNavigate('topic-details', data)`

**What it shows:**
- Topic content with sidebar
- All topics in assignment listed on left
- Problem statement and objectives on right
- Progress tracking

**Layout:**
```
Left Sidebar (20%)    |  Right Content (80%)
─────────────────────────────────────────
Back button         |  Topic title
Topics list         |  Problem statement
Status indicators   |  Objectives
Progress bar        |  Info cards
                    |  Action buttons
```

**User Actions:**
- Click topic in sidebar → Update content
- Click "Start Coding" → Go to CodingChallengeUI
- Click Back → Return to AssignmentListingPage

---

### 3. CodingChallengeUI
**URL Trigger**: `handleNavigate('coding-challenge-ui', data)`

**What it shows:**
- Full-screen coding interface
- Problem description on left
- Code editor and test cases on right

**Layout:**
```
Top Header: Logo | Back | Submit
───────────────────────────────────────
Left (35%)           |  Right (65%)
─────────────────────────────────────
Problem Title       |  Language Selector
Problem Statement   |  Code Editor
Examples            |  Test Cases
                    |  Run / Submit Buttons
```

**Editor Features:**
- Language selection (Java, Python, C++, JS)
- Theme toggle (Light/Dark)
- Reset, Copy, Fullscreen buttons
- Line numbers
- Syntax highlighting

**User Actions:**
- Change language → Code updates
- Toggle theme → Editor theme changes
- Copy button → Code copied to clipboard
- Reset button → Code cleared
- Run Code → Visible tests run
- Submit → All tests run
- Back → Return to TopicDetailsPage

---

## 🎨 Color Reference

| Element | Color | Usage |
|---------|-------|-------|
| Easy | Green (#10b981) | Difficulty badge |
| Medium | Yellow (#ca8a04) | Difficulty badge |
| Hard | Red (#dc2626) | Difficulty badge |
| Success | Green (#22c55e) | Status indicator |
| Pending | Yellow (#eab308) | Status indicator |
| Primary Action | Orange (warning) | Buttons |
| Sidebar | Gradient blue | Background |
| Active Item | Orange | Selection |
| Text | Neutral-900 | Primary text |
| Muted | Neutral-600 | Secondary text |

---

## 🔧 Component Props

### AssignmentListingPage
```typescript
{
  assignment: TopicQuestion;           // Assignment data
  moduleName: string;                  // Module title
  courseName: string;                  // Course title
  onSelectTopic: (topic: any) => void; // Click handler
  onBack: () => void;                  // Back button
}
```

### TopicDetailsPage
```typescript
{
  assignmentTitle: string;             // Assignment name
  moduleName: string;                  // Module name
  courseName: string;                  // Course name
  selectedTopicId: string;             // Current topic ID
  onSelectTopic: (topicId: string) => void;  // Topic switch
  onStartCoding: (topicId: string) => void;  // Start button
  onBack: () => void;                  // Back button
}
```

### CodingChallengeUI
```typescript
{
  topicTitle: string;                  // Problem title
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemDescription: string;          // Problem text
  examples: Array<{                    // Example cases
    id: string;
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: Array<{                   // Test cases
    id: string;
    input: string;
    expectedOutput: string;
    hidden: boolean;
  }>;
  starterCode?: { [language: string]: string };
  onSubmit: (code: string, language: string) => void;
  onBack: () => void;
}
```

---

## 📲 Toast Messages

| Message | Trigger |
|---------|---------|
| "Code copied to clipboard" | Click Copy button |
| "Code cleared" | Click Reset button |
| "X / Y visible test cases passed" | Click Run Code |
| "All tests passed. Full score awarded!" | Submit with 100% |
| "Great! X% tests passed" | Submit with > 80% |
| "X% tests passed. Keep trying!" | Submit with < 80% |
| "Switched to: [Topic Name]" | Select topic in sidebar |
| "Starting retake for topic: [ID]" | Click Retake Test |

---

## 🔄 Navigation Flow

```
App.tsx handleNavigate() calls:

'assignment-listing'
  ↓ props: assignment, moduleName, courseName
  ↓ renders: AssignmentListingPage
  ↓
  ├─→ onSelectTopic() → 'topic-details'
  ├─→ onBack() → 'student-module'
  └─→ Previous/Next → stays on page

'topic-details'
  ↓ props: assignment, topic, moduleName, courseName
  ↓ renders: TopicDetailsPage
  ↓
  ├─→ onSelectTopic() → updates sidebar selection
  ├─→ onStartCoding() → 'coding-challenge-ui'
  └─→ onBack() → 'assignment-listing'

'coding-challenge-ui'
  ↓ props: topicTitle, difficulty, problem, examples, testCases
  ↓ renders: CodingChallengeUI
  ↓
  ├─→ onSubmit() → returns to 'topic-details'
  └─→ onBack() → 'topic-details'
```

---

## 🐛 Debugging Tips

### Page Not Showing?
- Check console: F12 → Console tab
- Verify page name matches exactly: `'assignment-listing'`, `'topic-details'`, `'coding-challenge-ui'`
- Check that `pageData` is passed with required properties

### Styling Issues?
- Clear browser cache: Ctrl+Shift+Delete
- Verify Tailwind CSS is loaded
- Check `--color-warning` CSS variable is set in root

### Navigation Not Working?
- Verify `handleNavigate()` is called with correct arguments
- Check Redux/state logging
- Inspect `App.tsx` renderContent() function

### Test Cases Not Showing?
- Verify testCases array is passed
- Check array structure: `id`, `input`, `expectedOutput`, `hidden`
- Verify test cases are not empty

### Code Editor Not Working?
- Check language is set correctly
- Verify textarea element is rendered
- Check for React state update issues

---

## 📝 State Management

### AssignmentListingPage
- No internal state beyond UI interactions
- Props handle all data

### TopicDetailsPage
- `expandedSections`: For collapsible sidebar
- `selectedTopicId`: Tracks current selection
- No data transformation needed

### CodingChallengeUI
- `code`: Current code in editor
- `language`: Selected programming language
- `isDarkTheme`: Theme preference
- `activeTestCase`: Which test case is selected
- `testResults`: Results from running code
- `submissionScore`: Final score from submission

---

## 🎯 Common Tasks

### Change Language
```
1. Click language dropdown
2. Select new language
3. Starter code updates
4. Editor refreshes
```

### Run Tests
```
1. Click "Run Code"
2. Visible test cases execute
3. Results show pass/fail
4. Toast shows count: "X / Y passed"
```

### Submit Code
```
1. Click "Submit"
2. All tests run (including hidden)
3. Score calculated as percentage
4. Toast shows score message
5. User can view results
```

### Switch Themes
```
1. Click sun/moon icon
2. Editor background changes
3. Text color changes
4. All panels update
```

### Copy Code
```
1. Click copy icon
2. Code copied to clipboard
3. Toast: "Code copied"
4. Paste anywhere (Ctrl+V)
```

### Reset Code
```
1. Click reset icon
2. Editor cleared
3. Toast: "Code cleared"
4. Click another language to reset starter code
```

---

## 📊 Test Data Structure

### Assignment Object
```typescript
{
  id: string;
  question: string;  // Assignment title
  testCases?: Array<>;
  type?: string;
}
```

### Topic Object
```typescript
{
  id: string;
  title: string;
  content: string;
  difficulty?: string;
  duration?: string;
  status?: 'completed' | 'in-progress' | 'pending';
  questions?: number;
}
```

### Example Object
```typescript
{
  id: string;
  input: string;      // "abcabcbb"
  output: string;     // "3"
  explanation?: string;
}
```

### TestCase Object
```typescript
{
  id: string;
  input: string;           // "abcabcbb"
  expectedOutput: string;  // "3"
  hidden: boolean;         // true/false
}
```

---

## ✨ UI Polish Details

### Hover Effects
- Buttons: Color darkens, shadow appears
- Rows: Background lightens, cursor changes
- Badges: Scale slightly up
- Icons: Color changes

### Transitions
- Theme toggle: 200ms smooth fade
- Sidebar expand/collapse: 300ms smooth
- Toasts: 300ms fade in/out
- Overlays: 150ms opacity change

### Spacing
- Page padding: 32px (p-8)
- Card padding: 24px (p-6)
- Section gaps: 24px (gap-6)
- Item gaps: 8-12px (gap-2/3)

### Typography
- Headings: Bold, larger size, neutral-900
- Body: Regular, 1rem, neutral-700
- Code: Monospace, 0.875rem
- Labels: 0.75rem, uppercase, bold

---

## 🔐 Security Notes

- No sensitive data in browser console
- Code execution is mocked (no actual compilation)
- Test cases may contain solutions in visible form
- Hidden test cases remain private

---

## 📞 Support Resources

1. **Component Documentation**: See JSDoc comments in component files
2. **Type Definitions**: Check interfaces at top of files
3. **Implementation Guide**: See `STUDENT_MODULE_IMPLEMENTATION.md`
4. **Testing Guide**: See `TESTING_NEW_MODULES.md`
5. **Visual Specs**: See `VISUAL_LAYOUT_DOCUMENTATION.md`

---

**Quick Reference Version**: 1.0
**Last Updated**: January 29, 2026
**Status**: Ready for Production
