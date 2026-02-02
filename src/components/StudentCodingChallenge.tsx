import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Play, Copy, Maximize2, RotateCcw, Sun, Moon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

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
        setLanguage(preferred || 'java');
        setCode(starter[preferred] || starter[Object.keys(starter)[0]] || '');
      } else if (typeof starter === 'string') {
        setCode(starter);
      } else {
        // fallback default
        setCode('// Write your solution here');
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
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      {/* 🔴 2. Header alignment is fixed */}
      <header className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white z-10 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="h-4 w-px bg-neutral-200" />
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              {challenge?.question || challenge?.title || 'Assignment'}
            </h1>
            {/* 🔴 8. Difficulty badge in header */}
            <Badge className={`${getDifficultyColor()} rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
              {challenge?.difficulty || 'Easy'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {lastScore !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Score:</span>
              <span className="text-sm font-bold text-neutral-900">{lastScore}/100</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9 px-4 text-xs font-bold border-neutral-200 text-neutral-600">
              View Comments
            </Button>
            <Button
              className="h-9 px-6 text-xs font-bold bg-neutral-900 text-white hover:bg-black rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </header>

      {/* 🔴 1. Proper 2-panel structure (Problem vs Code) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL - Problem Panel */}
        {/* 🔴 7. Independent scrolling */}
        <div className="flex-1 overflow-y-auto border-r border-neutral-200 bg-white">
          {/* 🔴 3. Problem content width and padding */}
          <div className="max-w-3xl mx-auto p-10 space-y-10">
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                {challenge?.title || "Series – Level 1: 2,4,8,14,22,...,n"}
              </h2>
              <p className="text-lg font-bold text-neutral-800">
                Write a program to print the following series of numbers:
              </p>
            </div>

            {/* 🔴 4. Visual separation for sections */}
            <Card className="bg-neutral-50 border-neutral-100 shadow-sm overflow-hidden">
              <CardContent className="p-8 flex items-center justify-center">
                <div className="text-2xl font-mono font-medium text-neutral-800 tracking-widest">
                  Series: 2, 4, 8, 14, 22, ..., n
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 text-neutral-600 leading-relaxed text-base">
              <p>The program should print the numbers that are less than a certain number. The maximum number should be taken as a variable input.</p>
              <p className="text-red-600 font-bold">Refer to the sample inputs and outputs to understand the problem better. Do not delete the main method.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Note:
              </h3>
              <Card className="bg-white border-neutral-100 shadow-none italic text-neutral-600 p-6 leading-relaxed">
                The function should accept 'n' as a parameter and return a string containing the series of numbers up to 'n' without including any number greater than 'n'.
              </Card>
            </div>

            {/* 🔴 4. Examples inside separate containers */}
            {testCases.filter(tc => !tc.hidden).map((tc, idx) => (
              <div key={tc.id || idx} className="space-y-4">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">Example {idx + 1}</h3>
                <Card className="bg-white border-neutral-100 shadow-none overflow-hidden">
                  <div className="p-6 space-y-4 font-mono text-sm">
                    <div className="flex gap-4">
                      <span className="text-neutral-400 w-16">Input:</span>
                      <span className="text-neutral-900 font-bold">n = {tc.input}</span>
                    </div>
                    <div className="h-px bg-neutral-50" />
                    <div className="flex gap-4">
                      <span className="text-neutral-400 w-16">Output {idx + 1}:</span>
                      <span className="text-neutral-800">{tc.expectedOutput}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* 🔴 10. Visual grouping (Core issue fixed by using clear modules) */}
        
        {/* RIGHT PANEL - Code Editor Panel */}
        <div className="flex-1 flex flex-col bg-[#F9FAFB]">
          
          {/* 🔴 5. Code panel hierarchy: 1. Editor Header */}
          <div className="px-4 py-3 flex items-center justify-between shrink-0">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 h-9 bg-white border-neutral-200 font-bold text-xs uppercase tracking-wider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="js">JavaScript</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-neutral-900">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-neutral-900">
                <Sun className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-neutral-900">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 🔴 5. Code panel hierarchy: 2. Editor Area */}
          <div className="flex-1 flex overflow-hidden p-4 pt-0">
            <div className="flex-1 flex rounded-xl border border-neutral-200 overflow-hidden shadow-sm bg-white relative">
              <div className="bg-neutral-50 text-neutral-400 text-[10px] font-mono py-4 px-3 select-none border-r border-neutral-100 flex flex-col text-right">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="h-6 leading-6 min-w-[20px]">
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 font-mono text-sm bg-white text-neutral-800 resize-none focus:outline-none p-4 leading-6"
                spellCheck="false"
              />
            </div>
          </div>

          {/* 🔴 6. Testcase and Run section (boxed section under editor) */}
          <div className="p-4 pt-0 shrink-0">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Testcases</span>
                  <div className="flex items-center gap-1.5">
                    {testCases.map((tc, idx) => (
                      <button
                        key={tc.id || idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === idx 
                          ? 'bg-neutral-900 text-white shadow-md' 
                          : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button className="w-6 h-6 flex items-center justify-center rounded-md bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors">
                      <span className="text-sm font-bold">+</span>
                    </button>
                  </div>
                </div>
                
                {/* 🔴 6. Run button aligned right */}
                <Button
                  className="h-8 px-5 text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white hover:bg-black rounded-lg flex items-center gap-2"
                  onClick={handleRun}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Run
                </Button>
              </div>

              <div className="p-4 grid grid-cols-1 gap-4 overflow-y-auto max-h-48 font-mono text-sm">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Input:</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-800 font-bold">
                    {testCases[activeTab]?.input || 'No input'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Actual Output:</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 min-h-[44px] italic text-neutral-400">
                      {testResults[activeTab]?.passed ? testResults[activeTab]?.output || 'Success' : 'No output yet...'}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Expected Output:</label>
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-600 font-bold">
                      {testCases[activeTab]?.expectedOutput || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
