import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  Code2,
  BookOpen,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';

interface Topic {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'pending';
  content?: string;
  questions?: number;
}

interface TopicDetailsPageProps {
  assignmentTitle: string;
  moduleName: string;
  courseName: string;
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onStartCoding: (topicId: string) => void;
  onBack: () => void;
}

export function TopicDetailsPage({
  assignmentTitle,
  moduleName,
  courseName,
  selectedTopicId,
  onSelectTopic,
  onStartCoding,
  onBack,
}: TopicDetailsPageProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    topics: true,
  });

  // Mock topics data
  const topics: Topic[] = [
    {
      id: 'topic-1',
      title: 'Series – Level 1',
      duration: '15m',
      status: 'completed',
      content:
        'Introduction to series and sequences. Learn the basics of arithmetic and geometric series.',
      questions: 3,
    },
    {
      id: 'topic-2',
      title: 'Series – Level 2',
      duration: '25m',
      status: 'completed',
      content:
        'Advanced series problems. Complex patterns and sum formulas. Solve real-world applications.',
      questions: 2,
    },
    {
      id: 'topic-3',
      title: 'Series – Level 3',
      duration: '30m',
      status: 'pending',
      content: 'Expert level series challenges. Infinite series, convergence, and advanced techniques.',
      questions: 3,
    },
  ];

  const selectedTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];
  const totalProgress =
    (topics.filter((t) => t.status === 'completed').length / topics.length) * 100;
  const totalDuration = topics.reduce(
    (sum, t) => sum + parseInt(t.duration),
    0
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTopicSelect = (topicId: string) => {
    onSelectTopic(topicId);
    toast.info(`Switched to: ${topics.find((t) => t.id === topicId)?.title}`);
  };

  const handleStartCoding = () => {
    onStartCoding(selectedTopicId);
  };

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950 text-white overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-blue-800/50">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-6 w-full justify-start"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Assignment Title */}
          <h2 className="text-2xl font-bold mb-1">{assignmentTitle}</h2>
          <p className="text-sm text-blue-200 mb-4">{topics.length} Topics</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-blue-200 font-semibold">Progress</span>
              <span className="text-xs text-blue-100 font-bold">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>

          {/* Total Duration */}
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <Clock className="w-3 h-3" />
            <span>Total: {totalDuration}m</span>
          </div>
        </div>

        {/* Topics Section */}
        <div className="p-6 space-y-4">
          {/* Section Header */}
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-3 rounded-lg transition"
            onClick={() => toggleSection('topics')}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Topics</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.topics ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Topic Items */}
          {expandedSections.topics && (
            <div className="space-y-2 pl-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-3 rounded-lg cursor-pointer transition group ${
                    selectedTopicId === topic.id
                      ? 'bg-orange-500/20 border-l-2 border-orange-400 bg-white/10'
                      : 'bg-white/10 hover:bg-white/20 border-l-2 border-transparent'
                  }`}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex-shrink-0" />
                        )}
                        <p
                          className={`font-medium text-sm group-hover:text-orange-300 transition ${
                            selectedTopicId === topic.id
                              ? 'text-orange-300'
                              : 'text-white'
                          }`}
                        >
                          {topic.title}
                        </p>
                      </div>
                      <p className="text-xs text-blue-300 ml-6">
                        {topic.questions} questions • {topic.duration}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-neutral-900">
                    {selectedTopic.title}
                  </h1>
                  <Badge
                    className={`rounded-full px-3 py-1 ${
                      selectedTopic.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {selectedTopic.status === 'completed' ? '✓ Completed' : 'In Progress'}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600">
                  Module: <span className="font-semibold">{moduleName}</span> • Course:{' '}
                  <span className="font-semibold">{courseName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Topic Content */}
          <Card className="mb-8 shadow-sm border-neutral-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Title Section */}
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    Problem Statement
                  </h2>
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTopic.content ||
                      'No content available for this topic.'}
                  </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Code2 className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">Total Questions</p>
                          <p className="text-2xl font-bold text-neutral-900">
                            {selectedTopic.questions}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">Estimated Time</p>
                          <p className="text-2xl font-bold text-neutral-900">
                            {selectedTopic.duration}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-neutral-700">
                      <BookOpen className="w-4 h-4 mt-1 text-orange-500 flex-shrink-0" />
                      <span>Understand fundamental concepts and principles</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-700">
                      <BookOpen className="w-4 h-4 mt-1 text-orange-500 flex-shrink-0" />
                      <span>Apply techniques to solve real-world problems</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-700">
                      <BookOpen className="w-4 h-4 mt-1 text-orange-500 flex-shrink-0" />
                      <span>Master advanced algorithms and patterns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              View Resources
            </Button>
            <Button
              className="rounded-lg px-6 gap-2"
              style={{ backgroundColor: 'var(--color-warning)' }}
              onClick={handleStartCoding}
            >
              <Play className="w-4 h-4" />
              Start Coding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
