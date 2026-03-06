import React, { useMemo, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowUpDown, ChevronDown, ExternalLink, FileText, Star, Trophy } from 'lucide-react';
import { problems, Problem } from '../lib/data';

interface ProblemsPageProps {
  onSelectProblem: (problem: Problem) => void;
}

interface TopicStat {
  name: string;
  total: number;
}

interface CategoryDefinition {
  id: string;
  name: string;
  tags: string[];
}

const ORDERED_TOPICS = [
  'Array',
  'String',
  'Hash Table',
  'Depth-First Search',
  'Dynamic Programming',
  'Sorting',
  'Breadth-First Search',
  'Math',
  'Two Pointers',
  'Tree',
  'Matrix',
  'Binary Search',
  'Binary Tree',
  'Greedy',
  'Stack',
  'Design',
  'Heap (Priority Queue)',
  'Linked List',
  'Sliding Window',
  'Backtracking',
  'Bit Manipulation',
  'Union Find',
  'Prefix Sum',
  'Counting',
  'Graph Theory',
  'Simulation',
  'Binary Search Tree',
  'Recursion',
  'Divide and Conquer',
  'Trie',
  'Queue',
  'Topological Sort',
  'Monotonic Stack',
  'Graph',
  'Interactive',
  'Data Stream',
  'Hash Function',
  'Memoization',
  'Shortest Path',
  'String Matching',
  'Bitmask DP',
  'Enumeration',
  'Ordered Set',
  'Combinatorics',
  'Counting Sort',
  'Doubly-Linked List',
  'Game Theory',
  'Iterator',
  'Monotonic Queue',
  'Number Theory',
  'Quickselect',
  'Sweep Line',
  'Bucket Sort',
  'Merge Sort',
  'Minimum Spanning Tree',
  'Randomized',
  'Binary Indexed Tree',
  'Eulerian Circuit',
  'Geometry',
  'Probability and Statistics',
  'Radix Sort',
  'Rolling Hash',
  'Segment Tree',
  'Strongly Connected Component',
];

export function ProblemsPage({ onSelectProblem }: ProblemsPageProps) {
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [starredProblems, setStarredProblems] = useState<Set<string>>(new Set());

  const solvedProblems = useMemo(() => new Set(['problem-1', 'problem-2']), []);

  const topicStats = useMemo<TopicStat[]>(() => {
    const tagCounts = new Map<string, number>();
    problems.forEach(problem => {
      problem.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const ordered = ORDERED_TOPICS.filter(tag => tagCounts.has(tag));
    const extra = Array.from(tagCounts.keys()).filter(tag => !ORDERED_TOPICS.includes(tag));

    return [...ordered, ...extra]
      .map(tag => ({ name: tag, total: tagCounts.get(tag) || 0 }))
      .filter(stat => stat.total > 0);
  }, []);

  const categories = useMemo<CategoryDefinition[]>(
    () => [
      { id: 'arrays-hashing', name: 'Arrays & Hashing', tags: ['Array', 'Hash Table'] },
      { id: 'two-pointers', name: 'Two Pointers', tags: ['Two Pointers'] },
      { id: 'sliding-window', name: 'Sliding Window', tags: ['Sliding Window'] },
      { id: 'stack', name: 'Stack', tags: ['Stack', 'Monotonic Stack'] },
      { id: 'binary-search', name: 'Binary Search', tags: ['Binary Search'] },
      { id: 'linked-list', name: 'Linked List', tags: ['Linked List', 'Doubly-Linked List'] },
      { id: 'trees', name: 'Trees', tags: ['Tree', 'Binary Tree', 'Binary Search Tree'] },
      { id: 'heap', name: 'Heap / Priority Queue', tags: ['Heap (Priority Queue)'] },
      { id: 'backtracking', name: 'Backtracking', tags: ['Backtracking'] },
      { id: 'tries', name: 'Tries', tags: ['Trie'] },
      { id: 'graphs', name: 'Graphs', tags: ['Graph', 'Graph Theory', 'Minimum Spanning Tree', 'Shortest Path'] },
    ],
    [],
  );

  const categoriesWithProblems = useMemo(() => {
    return categories
      .map(category => {
        const categoryProblems = problems.filter(problem =>
          category.tags.some(tag => problem.tags.includes(tag)),
        );
        const visibleProblems = selectedTopic
          ? categoryProblems.filter(problem => problem.tags.includes(selectedTopic))
          : categoryProblems;
        const solvedCount = categoryProblems.filter(problem => solvedProblems.has(problem.id)).length;
        return {
          ...category,
          total: categoryProblems.length,
          solved: solvedCount,
          problems: visibleProblems,
        };
      })
      .filter(category => category.total > 0);
  }, [categories, selectedTopic, solvedProblems]);

  const visibleTopics = topicsExpanded ? topicStats : topicStats.slice(0, 8);

  const handleStarToggle = (problemId: string) => {
    setStarredProblems(prev => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      return next;
    });
  };

  const renderProblemRow = (problem: Problem) => {
    const isSolved = solvedProblems.has(problem.id);
    const isStarred = starredProblems.has(problem.id);
    return (
      <TableRow key={problem.id} className="border-neutral-200 hover:bg-neutral-50">
        <TableCell className="pl-4">
          <Checkbox checked={isSolved} aria-label="Problem solved" disabled />
        </TableCell>
        <TableCell>
          <button
            type="button"
            onClick={() => handleStarToggle(problem.id)}
            className="inline-flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors"
            aria-label={isStarred ? 'Remove star' : 'Star problem'}
          >
            <Star className={`w-5 h-5 ${isStarred ? 'fill-amber-400' : ''}`} />
          </button>
        </TableCell>
        <TableCell className="min-w-[260px]">
          <button
            type="button"
            onClick={() => onSelectProblem(problem)}
            className="group inline-flex items-center gap-2 font-semibold text-neutral-900 hover:text-neutral-700"
          >
            {problem.title}
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
          </button>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={
              problem.difficulty === 'easy'
                ? 'border-emerald-400/60 text-emerald-300'
                : problem.difficulty === 'medium'
                  ? 'border-amber-400/60 text-amber-300'
                  : 'border-rose-400/60 text-rose-300'
            }
          >
            {problem.difficulty}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <button
            type="button"
            className="inline-flex items-center justify-center text-neutral-500 hover:text-neutral-800"
            aria-label="View solution"
          >
            <FileText className="w-4 h-4" />
          </button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Practice Problems</h2>
          <p className="text-neutral-600 mt-1">
            Solve coding challenges to improve your skills
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-neutral-600">Problems Solved</p>
            <p className="font-mono">{solvedProblems.size} / {problems.length}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center" style={{ borderColor: 'var(--color-primary)' }}>
            <Trophy className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
      </div>

      <Card className="bg-white border-neutral-200 text-neutral-900 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Topics</div>
            <button
              type="button"
              onClick={() => setTopicsExpanded(prev => !prev)}
              className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {topicsExpanded ? 'Collapse' : 'Expand'}
              <ChevronDown className={`w-4 h-4 transition-transform ${topicsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={topicsExpanded ? 'flex flex-wrap gap-3' : 'flex items-center gap-4 overflow-x-auto whitespace-nowrap'}>
            {visibleTopics.map(topic => {
              const active = selectedTopic === topic.name;
              return (
                <button
                  key={topic.name}
                  type="button"
                  onClick={() => setSelectedTopic(active ? null : topic.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 border text-sm font-semibold transition-colors ${
                    active
                      ? 'text-neutral-900 border-neutral-300 bg-neutral-100'
                      : 'text-neutral-700 border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-neutral-900">{topic.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600">
                    {topic.total}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {categoriesWithProblems.length === 0 ? (
        <Card className="bg-white border-neutral-200 text-neutral-900">
          <CardContent className="p-8 text-center text-neutral-500">
            No topics match your current selection.
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible defaultValue={categoriesWithProblems[0]?.id} className="space-y-3">
          {categoriesWithProblems.map(category => {
            const progress = category.total ? Math.round((category.solved / category.total) * 100) : 0;
            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border border-neutral-200 rounded-xl bg-white px-4 text-neutral-900 shadow-sm"
              >
                <AccordionTrigger className="py-4 hover:no-underline [&>svg]:text-neutral-400">
                  <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3 text-lg font-semibold">
                      <span>{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4 md:justify-end">
                      <span className="text-sm font-semibold text-neutral-600">
                        {category.solved} / {category.total}
                      </span>
                      <div className="w-36 md:w-56">
                        <Progress
                          value={progress}
                          className="h-2 bg-neutral-200"
                          indicatorClassName="bg-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="rounded-lg border border-neutral-200 bg-white">
                    <Table className="text-neutral-700">
                      <TableHeader className="bg-neutral-50">
                        <TableRow className="border-neutral-200">
                          <TableHead className="pl-4 text-neutral-500">Status</TableHead>
                          <TableHead className="text-neutral-500">Star</TableHead>
                          <TableHead className="text-neutral-500">
                            <span className="inline-flex items-center gap-2">
                              Problem
                              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                            </span>
                          </TableHead>
                          <TableHead className="text-neutral-500">
                            <span className="inline-flex items-center gap-2">
                              Difficulty
                              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                            </span>
                          </TableHead>
                          <TableHead className="text-center text-neutral-500">Solution</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.problems.length === 0 ? (
                          <TableRow className="border-neutral-200">
                            <TableCell colSpan={5} className="py-6 text-center text-neutral-500">
                              No problems in this topic.
                            </TableCell>
                          </TableRow>
                        ) : (
                          category.problems.map(problem => renderProblemRow(problem))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
