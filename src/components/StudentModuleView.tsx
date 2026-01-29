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
    <div className="flex h-screen w-full bg-neutral-50 overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="w-80 flex-shrink-0 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-white/10">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 mb-6 p-0 h-auto font-medium transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Module Title */}
          <h2 className="text-xl font-bold mb-1 leading-tight">
            Problem-Solving with Iteration
          </h2>
          <div className="flex items-center justify-between mt-1 mb-4">
            <span className="text-xs text-white/50">1 Chapters</span>
            <span className="text-xs font-bold text-orange-400">100%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-orange-500" />
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <div
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
              onClick={() => toggleSection('iterations')}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                </div>
                <span className="font-semibold text-sm">Iterations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">8h 25m</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${expandedSections.iterations ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {expandedSections.iterations && (
              <div className="mt-1 space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeItem === item.title;
                  return (
                    <div
                      key={item.title}
                      onClick={() => setActiveItem(item.title)}
                      className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive
                          ? 'bg-orange-500/10 border-r-4 border-orange-500'
                          : 'hover:bg-white/5'
                        }`}
                    >
                      <Code2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-white/40 group-hover:text-white/60'}`} />
                      <div>
                        <p className={`text-sm font-medium leading-tight ${isActive ? 'text-orange-500' : 'text-white/80 group-hover:text-white'}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-white/40 mt-1">{item.duration}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <main className="flex-1 p-10 max-w-6xl mx-auto w-full">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
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

          {/* Topics Table Card */}
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50 border-neutral-100 hover:bg-neutral-50/50">
                  <TableHead className="py-4 px-8 font-bold text-neutral-400 uppercase tracking-wider text-[11px]">Topic</TableHead>
                  <TableHead className="py-4 px-8 font-bold text-neutral-400 uppercase tracking-wider text-[11px]">Questions</TableHead>
                  <TableHead className="py-4 px-8 font-bold text-neutral-400 uppercase tracking-wider text-[11px]">Status</TableHead>
                  <TableHead className="py-4 px-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableTopics.map((topic) => (
                  <TableRow
                    key={topic.title}
                    className="group border-neutral-100 hover:bg-neutral-50/30 cursor-pointer transition-colors"
                    onClick={() => handleStartCoding(topic)}
                  >
                    <TableCell className="py-6 px-8">
                      <span className="font-bold text-neutral-800 text-lg group-hover:text-orange-600 transition-colors">
                        {topic.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <span className="font-semibold text-neutral-600">
                        {topic.questions}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-4 py-1.5 font-semibold text-xs">
                        {topic.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-neutral-200 text-neutral-600 hover:bg-neutral-50 px-6 font-bold text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartCoding(topic);
                          }}
                        >
                          Retake Test
                        </Button>
                        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Bottom Right CTA */}
          <div className="flex justify-end mt-12 pb-20">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 py-6 h-auto font-bold text-lg shadow-lg shadow-orange-500/20 group transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
