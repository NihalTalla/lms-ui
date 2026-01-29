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
    <div className="flex h-full bg-neutral-100 font-sans text-neutral-900">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-white text-neutral-900">
        <div className="p-8 w-full text-neutral-900">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="text-neutral-500 hover:text-neutral-900 mb-6 p-0 h-auto font-medium transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Module
            </Button>

            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-neutral-900">
                    {selectedTopic.title}
                  </h1>
                  <Badge
                    className={`rounded-full px-3 py-1 ${selectedTopic.status === 'completed'
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
          <div className="flex gap-4 justify-end mb-12">
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
