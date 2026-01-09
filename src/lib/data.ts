// Sample data for Codify LMS

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'trainer' | 'student';
  avatar?: string;
  batchId?: string;
}

export interface Institution {
  id: string;
  name: string;
  location: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  questions: TopicQuestion[];
}

export interface TopicQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  enrolled: number;
  tags: string[];
  thumbnail?: string;
  institutionId?: string;
  batchId?: string;
  topics?: Topic[];
  isLocked?: boolean;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  startDate: string;
  endDate: string;
  students: number;
  faculty: string[];
  schedule: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  testCases: TestCase[];
  starterCode: { [language: string]: string };
  tags: string[];
  points: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'queued' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compile_error';
  testCaseResults: TestCaseResult[];
  executionTime?: number;
  memory?: number;
  timestamp: string;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput?: string;
  executionTime?: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Thread {
  id: string;
  title: string;
  studentId: string;
  facultyId?: string;
  status: 'open' | 'answered' | 'closed';
  messages: Message[];
  createdAt: string;
}

export interface Question {
  id: string;
  courseId: string;
  lessonId?: string; // Optional, if question is specific to a lesson
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  status: 'unanswered' | 'answered' | 'resolved';
  isAnonymous: boolean;
  upvotes: number;
  tags: string[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isAccepted: boolean;
  upvotes: number;
}

export interface QuestionVote {
  id: string;
  questionId: string;
  userId: string;
  isUpvote: boolean;
}

export interface AnswerVote {
  id: string;
  answerId: string;
  userId: string;
  isUpvote: boolean;
}

export interface Assessment {
  id: string;
  name: string;
  category: string;
  description: string;
  batchId: string;
  maxAttempts: number;
  examType: 'single_time' | 'multiple_time' | 'practice';
  cutOffType: 'single' | 'section_wise' | 'percentile';
  password?: string;
  duration: number; // in minutes
  totalMarks: number;
  scheduledDate?: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  createdBy: string;
  createdAt: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'coding';
  options?: string[]; // for multiple choice
  correctAnswer: string;
  marks: number;
  explanation?: string;
}

// Sample Users
export const users: User[] = [
  {
    id: 'admin-1',
    name: 'Alex Chen',
    email: 'admin01@gmail.com',
    role: 'admin',
  },
  {
    id: 'faculty-1',
    name: 'Dr. Sarah Johnson',
    email: 'faculty01@gmail.com',
    role: 'faculty',
  },
  {
    id: 'trainer-1',
    name: 'Prof. Michael Roberts',
    email: 'trainer01@gmail.com',
    role: 'trainer',
  },
  {
    id: 'student-1',
    name: 'Emma Wilson',
    email: 'student01@gmail.com',
    role: 'student',
    batchId: 'batch-1',
  },
  {
    id: 'student-2',
    name: 'Liam Martinez',
    email: 'liam.martinez@student.codify.lms',
    role: 'student',
    batchId: 'batch-1',
  },
  {
    id: 'student-3',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@student.codify.lms',
    role: 'student',
    batchId: 'batch-2',
  },
];

// Sample Institutions
export const institutions: Institution[] = [
  { id: 'inst-1', name: 'Tech Institute of Technology', location: 'San Francisco, CA' },
  { id: 'inst-2', name: 'Global Academy of Science', location: 'New York, NY' },
  { id: 'inst-3', name: 'Elite Coding School', location: 'Austin, TX' },
];

// Sample Courses
export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Data Structures & Algorithms Mastery',
    description: 'Master fundamental and advanced data structures and algorithms with hands-on coding practice.',
    level: 'intermediate',
    duration: '12 weeks',
    lessons: 48,
    enrolled: 245,
    tags: ['DSA', 'Python', 'Problem Solving'],
    institutionId: 'inst-1',
    batchId: 'batch-1',
    isLocked: false,
    topics: [],
  },
  {
    id: 'course-2',
    title: 'Full-Stack Web Development',
    description: 'Build modern web applications from frontend to backend with React, Node.js, and databases.',
    level: 'beginner',
    duration: '16 weeks',
    lessons: 64,
    enrolled: 312,
    tags: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    institutionId: 'inst-2',
    batchId: 'batch-2',
    isLocked: true,
    topics: [],
  },
];

// Sample Batches
export const batches: Batch[] = [
  {
    id: 'batch-1',
    name: 'DSA Batch - Fall 2025',
    courseId: 'course-1',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    students: 45,
    faculty: ['faculty-1'],
    schedule: 'Mon, Wed, Fri - 6:00 PM to 8:00 PM',
  },
  {
    id: 'batch-2',
    name: 'Web Dev Batch - Fall 2025',
    courseId: 'course-2',
    startDate: '2025-09-15',
    endDate: '2026-01-15',
    students: 38,
    faculty: ['faculty-2'],
    schedule: 'Tue, Thu - 7:00 PM to 9:00 PM',
  },
];

// Sample Problems
export const problems: Problem[] = [
  {
    id: 'problem-1',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    testCases: [
      {
        id: 'tc-1',
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        hidden: false,
      },
      {
        id: 'tc-2',
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]',
        hidden: false,
      },
      {
        id: 'tc-3',
        input: '[3,3]\n6',
        expectedOutput: '[0,1]',
        hidden: true,
      },
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
    }
}`,
    },
    tags: ['Array', 'Hash Table'],
    points: 100,
  },
  {
    id: 'problem-2',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    sampleInput: 'head = [1,2,3,4,5]',
    sampleOutput: '[5,4,3,2,1]',
    explanation: 'The list is reversed from 1->2->3->4->5 to 5->4->3->2->1.',
    testCases: [
      {
        id: 'tc-1',
        input: '[1,2,3,4,5]',
        expectedOutput: '[5,4,3,2,1]',
        hidden: false,
      },
      {
        id: 'tc-2',
        input: '[1,2]',
        expectedOutput: '[2,1]',
        hidden: false,
      },
      {
        id: 'tc-3',
        input: '[]',
        expectedOutput: '[]',
        hidden: true,
      },
    ],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # Write your solution here
    pass`,
      javascript: `function reverseList(head) {
    // Write your solution here
}`,
    },
    tags: ['Linked List', 'Recursion'],
    points: 150,
  },
  {
    id: 'problem-3',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    explanation: 'All brackets are properly matched and closed in the correct order.',
    testCases: [
      {
        id: 'tc-1',
        input: '()[]{}',
        expectedOutput: 'true',
        hidden: false,
      },
      {
        id: 'tc-2',
        input: '(]',
        expectedOutput: 'false',
        hidden: false,
      },
      {
        id: 'tc-3',
        input: '([)]',
        expectedOutput: 'false',
        hidden: true,
      },
    ],
    starterCode: {
      python: `def is_valid(s):
    # Write your solution here
    pass`,
      javascript: `function isValid(s) {
    // Write your solution here
}`,
    },
    tags: ['String', 'Stack'],
    points: 120,
  },
  {
    id: 'problem-4',
    title: 'Merge Intervals',
    difficulty: 'medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4',
    ],
    sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
    sampleOutput: '[[1,6],[8,10],[15,18]]',
    explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
    testCases: [
      {
        id: 'tc-1',
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
        hidden: false,
      },
      {
        id: 'tc-2',
        input: '[[1,4],[4,5]]',
        expectedOutput: '[[1,5]]',
        hidden: false,
      },
      {
        id: 'tc-3',
        input: '[[1,4],[0,4]]',
        expectedOutput: '[[0,4]]',
        hidden: true,
      },
    ],
    starterCode: {
      python: `def merge(intervals):
    # Write your solution here
    pass`,
      javascript: `function merge(intervals) {
    // Write your solution here
}`,
    },
    tags: ['Array', 'Sorting'],
    points: 200,
  },
  {
    id: 'problem-5',
    title: 'LRU Cache',
    difficulty: 'hard',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    sampleInput: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
    sampleOutput: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
    explanation: 'LRU cache operations maintain the most recently used items.',
    testCases: [
      {
        id: 'tc-1',
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        expectedOutput: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        hidden: false,
      },
    ],
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # Initialize your data structure here
        pass

    def get(self, key: int) -> int:
        # Write your solution here
        pass

    def put(self, key: int, value: int) -> None:
        # Write your solution here
        pass`,
      javascript: `class LRUCache {
    constructor(capacity) {
        // Initialize your data structure here
    }
    
    get(key) {
        // Write your solution here
    }
    
    put(key, value) {
        // Write your solution here
    }
}`,
    },
    tags: ['Design', 'Hash Table', 'Linked List'],
    points: 350,
  },
];

// Sample Assessments
export const assessments: Assessment[] = [
  {
    id: 'assessment-1',
    name: 'DSA Fundamentals Quiz',
    category: 'Internal Assessments',
    description: 'Test your understanding of basic data structures and algorithms',
    batchId: 'batch-1',
    maxAttempts: 2,
    examType: 'single_time',
    cutOffType: 'single',
    duration: 60,
    totalMarks: 100,
    scheduledDate: '2025-10-15T10:00',
    status: 'published',
    createdBy: 'admin-1',
    createdAt: '2025-10-01T09:00:00Z',
    questions: [
      {
        id: 'q-1',
        assessmentId: 'assessment-1',
        question: 'What is the time complexity of binary search?',
        type: 'multiple_choice',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 'O(log n)',
        marks: 10,
        explanation: 'Binary search divides the search space in half each time, resulting in logarithmic time complexity.'
      },
      {
        id: 'q-2',
        assessmentId: 'assessment-1',
        question: 'Which data structure uses LIFO (Last In, First Out) principle?',
        type: 'multiple_choice',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 'Stack',
        marks: 10,
      }
    ]
  }
];