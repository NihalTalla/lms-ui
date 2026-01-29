import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  ChevronRight,
  Layout as LayoutIcon
} from 'lucide-react';
import { Course, Topic } from '../lib/data';

interface StudentModuleViewProps {
  course: Course;
  selectedModule: Topic;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export function StudentModuleView({ course, selectedModule, onNavigate, onBack }: StudentModuleViewProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    iterations: true,
  });

  const [activeItem, setActiveItem] = useState('Assignment – 1');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleStartCoding = (topic: any) => {
    onNavigate('coding-challenge-ui', {
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
    });
  };

  const menuItems = [
    { title: 'Java Programming Basics (Iterations)', duration: '5m' },
    { title: 'Assignment – 1', duration: '1h 40m' },
    { title: 'Assignment – 2', duration: '1h 40m' },
    { title: 'Assignment – 3', duration: '1h 40m' },
    { title: 'Assignment – 4', duration: '1h 40m' },
    { title: 'Assignment – 5', duration: '1h 40m' },
  ];

  const tableTopics = [
    { title: 'Series – Level 1', questions: '3/3 Completed', status: 'Submitted', difficulty: 'Easy' },
    { title: 'Series – Level 2', questions: '2/2 Completed', status: 'Submitted', difficulty: 'Medium' },
  ];

  return (
    <div className="flex h-full w-full bg-neutral-50 overflow-hidden font-sans text-neutral-900">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto flex flex-col text-neutral-900">
        <main className="flex-1 p-8 w-full text-neutral-900">
          {/* Header Row */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-neutral-500 hover:text-neutral-900 p-0 h-auto font-medium transition-colors"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-extrabold text-neutral-900">{activeItem}</h1>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-4 py-1.5 font-semibold text-xs">
                  Submitted
                </Badge>
              </div>
              <div className="text-sm font-medium text-neutral-500">
                Sunday, November 30, 2025 11:55 PM
              </div>
            </div>
          </div>

          {/* Topics Table Card */}
          <Card className="rounded-2xl border border-neutral-100 shadow-sm bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/80 border-neutral-100 hover:bg-neutral-50/80">
                  <TableHead className="py-4 px-6 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Topic Content</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Progress</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                  <TableHead className="py-4 px-6 text-right font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableTopics.map((topic) => (
                  <TableRow
                    key={topic.title}
                    className="group border-neutral-100 hover:bg-neutral-50/20 cursor-pointer transition-all"
                    onClick={() => handleStartCoding(topic)}
                  >
                    <TableCell className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-800 text-base group-hover:text-orange-600 transition-colors">
                          {topic.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{topic.difficulty} • Coding Challenge</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <span className="font-semibold text-neutral-600 text-sm">
                        {topic.questions}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <Badge className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-100 rounded-full px-3 py-1 font-bold text-[10px] uppercase shadow-sm">
                        {topic.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8 px-4 font-bold text-xs text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all border border-transparent hover:border-orange-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartCoding(topic);
                          }}
                        >
                          Retake Test
                        </Button>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Bottom Right CTA */}
          <div className="flex justify-end mt-12 pb-12">
            <Button
              className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-8 py-2.5 h-auto font-bold text-sm shadow-md group transition-all"
            >
              Continue to next module
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
