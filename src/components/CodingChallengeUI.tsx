import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Terminal,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface CodingChallengeUIProps {
  topicTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemDescription: string;
  examples: Array<{
    id: string;
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    hidden: boolean;
  }>;
  starterCode?: { [language: string]: string };
  onSubmit: (code: string, language: string) => void;
  onBack: () => void;
}

export function CodingChallengeUI({
  topicTitle,
  difficulty,
  problemDescription,
  examples,
  testCases,
  starterCode,
  onSubmit,
  onBack,
}: CodingChallengeUIProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [activeBottomTab, setActiveBottomTab] = useState<'testcases' | 'console' | 'custom'>('testcases');
  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(true);
  const [testResults, setTestResults] = useState<{ passed: number; failed: number; total: number }>({
    passed: 0,
    failed: 0,
    total: testCases.length,
  });
  const [consoleOutput, setConsoleOutput] = useState('');
  const [customInput, setCustomInput] = useState('');

  // Initialize starter code
  useEffect(() => {
    const javaTemplate = `public class Solution {
    public int solve(String input) {
        // Write your solution here
        return 0;
    }
}`;
    setCode(javaTemplate);
  }, []);

  const handleRunCode = () => {
    // Simulate running code
    setConsoleOutput('Code executed successfully');
    setTestResults({
      passed: 2,
      failed: 1,
      total: testCases.length,
    });
    toast.success('Code executed! Check the output below.');
    setActiveBottomTab('console');
  };

  const handleSubmit = () => {
    toast.success('Code submitted successfully!');
    onSubmit(code, language);
  };

  const getDifficultyColor = () => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      {/* HEADER */}
      <header className="px-6 py-3 bg-white border-b border-neutral-200 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-neutral-900">{topicTitle}</h1>
          <Badge className={`rounded-full px-3 py-1 text-xs font-bold ${getDifficultyColor()}`}>
            {difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-neutral-700 border-neutral-300"
            onClick={onBack}
          >
            ← Back
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            onClick={handleSubmit}
          >
            Submit →
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT: Three columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT — Problem Description (Fixed Width, Scrollable) */}
        <div className="w-80 bg-white border-r border-neutral-200 overflow-y-auto">
          <div className="p-4 space-y-5">
            {/* Problem Statement */}
            <div>
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">Problem Statement</h3>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {problemDescription}
              </p>
            </div>

            {/* Examples */}
            {examples.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-3">Examples</h3>
                <div className="space-y-3">
                  {examples.map((ex, idx) => (
                    <div key={ex.id} className="bg-neutral-50 border border-neutral-200 rounded p-3 text-xs">
                      <div className="mb-2">
                        <p className="text-neutral-600 font-semibold mb-1">Input:</p>
                        <p className="font-mono text-neutral-800 text-xs break-words">{ex.input}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600 font-semibold mb-1">Output:</p>
                        <p className="font-mono text-neutral-800 text-xs">{ex.output}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Toolbar */}
          <div className="px-4 py-2 bg-white border-b border-neutral-200 flex items-center justify-between">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 h-8 text-sm border-neutral-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setCode('')}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex overflow-hidden bg-neutral-50">
            {/* Line Numbers */}
            <div className="w-12 bg-neutral-100 border-r border-neutral-200 flex-shrink-0 overflow-hidden">
              <div className="py-3 px-2 text-right">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="text-[10px] text-neutral-500 font-mono leading-6 h-6 select-none">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm text-neutral-900 bg-white resize-none border-0 focus:outline-none overflow-auto"
              spellCheck="false"
              style={{ tabSize: 2 }}
              placeholder="Write your code here..."
            />

            {/* Run Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <Button
                onClick={handleRunCode}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 text-sm font-semibold flex items-center gap-2"
              >
                ▶ Try Code
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT — Testcases Panel */}
        <div className="w-96 bg-white border-l border-neutral-200 flex flex-col overflow-hidden">

          {/* Tabs */}
          <div className="border-b border-neutral-200 bg-neutral-50 px-3 flex gap-1">
            <button
              onClick={() => setActiveBottomTab('testcases')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeBottomTab === 'testcases'
                  ? 'border-orange-500 text-neutral-900'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setActiveBottomTab('console')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeBottomTab === 'console'
                  ? 'border-orange-500 text-neutral-900'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {'>_'} Console
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            
            {/* TESTCASES */}
            {activeBottomTab === 'testcases' && (
              <div className="space-y-2">
                {testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    onClick={() => setActiveTestCase(idx)}
                    className={`p-2 rounded border text-xs cursor-pointer transition-all ${
                      activeTestCase === idx
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        idx < testResults.passed ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {idx < testResults.passed ? (
                          <span className="text-green-600 text-xs">✓</span>
                        ) : (
                          <span className="text-red-600 text-xs">✕</span>
                        )}
                      </div>
                      <span className="font-semibold text-neutral-900">Case {idx + 1}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="text-neutral-700">
                        <span className="text-neutral-600">str: </span>
                        <span className="font-mono">{tc.input}</span>
                      </div>
                      <div className="text-neutral-700">
                        <span className="text-neutral-600">Expected: </span>
                        <span className="font-mono text-green-700">{tc.expectedOutput}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONSOLE */}
            {activeBottomTab === 'console' && (
              <div className="bg-neutral-100 border border-neutral-200 rounded p-2 font-mono text-xs text-neutral-800 min-h-20">
                {consoleOutput || <span className="text-neutral-500">// Ready for output</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
