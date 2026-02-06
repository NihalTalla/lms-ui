import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Play, Copy, Maximize2, RotateCcw, Sun, Moon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { useAuth } from '../lib/auth-context';
import { recordSubmission } from '../lib/submission-store';

interface StudentCodingChallengeProps {
  challenge: any;
  module: any;
  course: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

const ExampleCard = ({ example, index }: { example: any; index: number }) => (
  <div className="border border-neutral-200 rounded-lg p-4 bg-white hover:shadow-sm transition">
    <h4 className="font-semibold text-neutral-900 mb-3">Example {index + 1}</h4>
    <div className="space-y-2 font-mono text-sm">
      <div className="text-neutral-700">
        <span className="text-neutral-500">num1:</span> <span className="font-medium">{example.num1}</span>
      </div>
      <div className="text-neutral-700">
        <span className="text-neutral-500">num2:</span> <span className="font-medium">{example.num2}</span>
      </div>
      <div className="text-neutral-700">
        <span className="text-neutral-500">num3:</span> <span className="font-medium">{example.num3}</span>
      </div>
      <div className="border-t border-neutral-200 mt-3 pt-3 text-green-700 font-semibold">
        Output {index + 1}: {example.output}
      </div>
    </div>
  </div>
);

export function StudentCodingChallenge({
  challenge,
  module,
  course,
  onNavigate,
  onBack,
}: StudentCodingChallengeProps) {
  const { currentUser } = useAuth();
  const templates: Record<string, string> = {
    python: 'def solve():\n    # Write your solution here\n    pass\n',
    java: 'class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
    c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
  };
  const allowedLanguages = ['java', 'python', 'cpp', 'c'];
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [activeTab, setActiveTab] = useState(0);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const examples = (challenge && challenge.examples) || [];

  useEffect(() => {
    if (challenge) {
      // initialize starter code and language
      const starter = challenge.starterCode || challenge.starter || null;
      if (starter && typeof starter === 'object') {
        // pick a preferred language if present
        const preferred = starter.java ? 'java' : Object.keys(starter)[0];
        const safePreferred = allowedLanguages.includes(preferred) ? preferred : 'java';
        setLanguage(safePreferred);
        setCode(
          starter[safePreferred] ||
          starter[Object.keys(starter)[0]] ||
          templates[safePreferred] ||
          '// Write your solution here'
        );
      } else if (typeof starter === 'string') {
        setCode(starter);
      } else {
        // fallback default
        setCode(templates[language] || '// Write your solution here');
      }

      // initialize test cases
      const cases = (challenge.testCases || []).map((tc: any, i: number) => ({
        id: tc.id || `tc-${i}`,
        input: tc.input || tc.inputExample || '',
        expectedOutput: tc.expectedOutput || tc.expected || '',
        hidden: !!tc.hidden,
      }));
      if (cases.length === 0) {
        // fallback small set
        setTestCases([
          { id: 't1', input: '45 23 67', expectedOutput: '67', hidden: false },
        ]);
      } else setTestCases(cases);
      setTestResults([]);
      setLastScore(null);
    }
  }, [challenge]);

  const simulateRun = (includeHidden = false) => {
    const cases = testCases.filter((tc) => (includeHidden ? true : !tc.hidden));
    const results = cases.map((tc) => {
      // simple heuristic: pass if user's code contains expected output or input
      const passed = (tc.expectedOutput && code.includes(tc.expectedOutput)) || (tc.input && code.includes(tc.input));
      return { ...tc, passed };
    });
    setTestResults(results);
    return results;
  };

  const handleRun = () => {
    const results = simulateRun(false);
    const passed = results.filter((r) => r.passed).length;
    toast.success(`${passed} / ${results.length} visible tests passed`);
  };

  const handleSubmit = () => {
    const results = simulateRun(true);
    const passed = results.filter((r) => r.passed).length;
    const total = results.length || 1;
    const score = Math.round((passed / total) * 100);
    setLastScore(score);
    if (passed === total) {
      toast.success('All tests passed. Full score awarded!');
    } else {
      toast('Submission received. Some tests failed. Partial score awarded.');
    }

    if (currentUser) {
      recordSubmission({
        userId: currentUser.id,
        type: 'course_challenge',
        meta: { challengeId: challenge?.id || 'challenge' },
      });
    }
  };

  const getDifficultyColor = () => {
    const difficulty = 'easy';
    return difficulty === 'easy'
      ? 'bg-green-100 text-green-700'
      : difficulty === 'medium'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700';
  };

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen flex flex-col bg-neutral-50 overflow-hidden">
      {/* Header with Back button and Score */}
      <div className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-neutral-700 hover:bg-neutral-100"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module
        </Button>
        {lastScore !== null && (
          <div className="text-sm font-semibold text-neutral-900">
            Score: <span style={{ color: 'var(--color-accent)' }}>{lastScore}/100</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* LEFT COLUMN - Problem Description (fixed width, scrollable) */}
        <div className="w-1/3 min-w-[350px] bg-white border-r border-neutral-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title and Difficulty */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {challenge?.question || challenge?.title || 'Assignment'}
                </h1>
                <Badge className={`${getDifficultyColor()} rounded-full px-3 py-1 whitespace-nowrap`}>
                  {challenge?.difficulty || 'Assignment'}
                </Badge>
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Problem Statement</h3>
              <p className="text-neutral-700 leading-relaxed text-sm whitespace-pre-wrap">
                {challenge?.question || challenge?.description || 'No problem statement provided.'}
              </p>
            </div>

            {/* Examples / Sample Tests */}
            {testCases.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-neutral-900">Sample Input & Output</h3>
                {testCases.filter((tc) => !tc.hidden).map((tc, idx) => (
                  <div key={tc.id || idx} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                    <h4 className="font-semibold text-neutral-900 mb-2 text-sm">Example {idx + 1}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-neutral-600">Input:</span>
                        <div className="font-mono text-neutral-900 mt-1">{tc.input}</div>
                      </div>
                      <div className="border-t border-neutral-200 pt-2">
                        <span className="text-neutral-600">Output:</span>
                        <div className="font-mono text-green-700 font-semibold mt-1">{tc.expectedOutput}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Editor and Test Cases (flex column) */}
        <div className="flex-1 flex flex-col bg-neutral-50 overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-white m-4 rounded-lg border border-neutral-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-neutral-600 hover:bg-neutral-100">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-neutral-600 hover:bg-neutral-100">
                  <Sun className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-neutral-600 hover:bg-neutral-100">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden relative">
              <div className="bg-neutral-100 text-neutral-500 text-xs font-mono py-4 px-2 select-none overflow-hidden">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="h-6 leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 font-mono text-sm bg-neutral-950 text-green-400 resize-none focus:outline-none focus:ring-0 border-0 p-4"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="h-48 bg-white m-4 mt-0 rounded-lg border border-neutral-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900 text-sm">Test Cases</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {testCases.map((tc, idx) => (
                <div key={tc.id || idx} className="flex items-center justify-between p-3 rounded border border-neutral-200 bg-neutral-50 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">Test {idx + 1} {tc.hidden ? '🔒' : ''}</div>
                    <div className="text-xs text-neutral-600">Input: {tc.input}</div>
                  </div>
                  <div className={`font-semibold ${testResults[idx]?.passed ? 'text-green-600' : testResults[idx] ? 'text-red-600' : 'text-neutral-500'}`}>
                    {testResults[idx] ? (testResults[idx].passed ? '✓ Pass' : '✗ Fail') : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 bg-white border-t border-neutral-200 flex justify-end gap-2">
            <Button
              className="rounded-lg gap-2 px-6"
              style={{ backgroundColor: 'var(--color-warning)' }}
              onClick={handleRun}
            >
              <Play className="w-4 h-4" />
              Run Code
            </Button>
            <Button
              className="rounded-lg gap-2 px-6"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
