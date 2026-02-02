import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Terminal,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  Expand,
  X,
  RefreshCw,
  Plus,
  Send,
  Code,
  GripVertical,
  Info,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

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

interface TestResult {
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  failedCase?: {
    input: string;
    expected: string;
    actual: string;
  };
  error?: string;
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: 'passed' | 'failed' | 'running' | null }>({});
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [submitResult, setSubmitResult] = useState<TestResult | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>('');

  // Initialize starter code
  useEffect(() => {
    const javaTemplate = `public class TestClass {\n    public static String printSeries(int n) {\n        // Please write your return statement here\n        String str="";\n        int i=2;\n        int j=2;\n        while(i<n){\n            if(!str.isEmpty()){\n                str+=",";\n            }\n            str+=i;\n            i=i+j;\n            j+=2;\n        }\n        return str;\n        \n        //Please don't modify the below code\n    }\n}`;
    setCode(starterCode?.[language] || javaTemplate);
  }, [language, starterCode]);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results: any = {};
      testCases.forEach(tc => {
        results[tc.id] = Math.random() > 0.2 ? 'passed' : 'failed';
      });
      setTestResults(results);
      setIsRunning(false);
      toast.success('Code execution finished');
    }, 1500);
  };

  const handleSubmitCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const passedCount = testCases.filter(() => Math.random() > 0.1).length;
      const totalCount = testCases.length;

      const result: TestResult = {
        passed: passedCount === totalCount,
        testCasesPassed: passedCount,
        totalTestCases: totalCount,
        failedCase: passedCount < totalCount ? {
          input: testCases[0].input,
          expected: testCases[0].expectedOutput,
          actual: "Wrong Answer"
        } : undefined,
        error: passedCount < totalCount ? "One or more test cases failed." : undefined
      };

      setSubmitResult(result);
      setIsRunning(false);
      setShowResultDialog(true);
    }, 1500);
  };

  const handleFinalSubmit = () => {
    onSubmit(code, language);
    setShowResultDialog(false);
    toast.success('Solution submitted successfully!');
  };

  return (
    <div className={`h-screen w-full flex flex-col ${isDarkMode ? 'dark bg-neutral-900 text-white' : 'bg-[#F8F9FB] text-neutral-900'} font-sans overflow-hidden transition-colors duration-300`}>
      {/* 🚀 TOP HEADER */}
      <header className="h-[60px] bg-white border-b border-neutral-200 flex items-center justify-between px-6 flex-shrink-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div className="h-4 w-[1px] bg-neutral-300 mx-2" />
          </div>

          <nav className="flex items-center gap-2 text-sm font-medium text-neutral-500">
            <span className="hover:text-neutral-900 cursor-pointer transition-colors">Iterations</span>
            <ChevronRight className="w-4 h-4" />
            <div className="flex items-center gap-1 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
              <span className="text-neutral-900 font-bold">{topicTitle}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-bold underline underline-offset-4 decoration-orange-500 decoration-2">Question 1</span>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-4 py-1.5 rounded-full">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Score:</span>
            <span className="text-sm font-black text-neutral-900">10/10</span>
            <Info className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-orange-500 transition-colors" />
          </div>

          <Button variant="outline" className="h-9 rounded-xl border-neutral-200 text-neutral-700 font-bold hover:bg-neutral-50 transition-all flex items-center gap-2 px-5">
            View Comments
          </Button>

          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs shadow-sm shadow-orange-200 border border-orange-200">
            NT
          </div>
        </div>
      </header>

      {/* 🧩 MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative">
        {/* Left Section: Problem & Examples (1/3 of page) */}
        <section className="w-[33.33%] flex flex-col gap-4 overflow-hidden">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit flex items-center gap-2 text-neutral-500 hover:text-neutral-900 p-0 h-auto font-bold text-xs uppercase tracking-widest transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Card className="flex-1 flex flex-col bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
            <div className="p-8 space-y-8 overflow-y-auto h-full custom-scrollbar">
              <div className="flex items-start justify-between">
                <h1 className="text-[28px] font-black leading-tight tracking-tight text-neutral-900">
                  {topicTitle}: 2,4,8,14,22,...,n
                </h1>
                <Badge className="bg-orange-50 text-orange-600 font-black uppercase text-[10px] px-3 py-1 rounded-full border-none tracking-widest">
                  {difficulty}
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-4 text-neutral-700 leading-relaxed font-medium">
                  <p className="font-bold text-neutral-900 text-lg underline decoration-orange-300 underline-offset-8">Write a program to print the following series of numbers:</p>
                  <div className="bg-neutral-50 border border-neutral-100 p-6 rounded-2xl font-black text-xl text-neutral-900 text-center tracking-widest shadow-inner">
                    Series: 2, 4, 8, 14, 22, ..., n
                  </div>
                  <p>The program should print the numbers that are less than a certain number. The maximum number should be taken as a variable input.</p>
                  <p>Refer to the sample inputs and outputs to understand the problem better. <span className="text-red-600 font-bold">Do not delete the main method.</span></p>

                  <div className="bg-orange-50/50 border-l-4 border-orange-400 p-5 rounded-r-xl">
                    <p className="text-sm font-bold text-orange-800">Note:</p>
                    <p className="text-sm text-orange-700 italic">The function should accept 'n' as a parameter and return a string containing the series of numbers up to 'n' without including any number greater than 'n'.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {examples.map((example, idx) => (
                    <div key={example.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Example {idx + 1}</h3>
                      <Card className="border-neutral-100 bg-neutral-50/50 rounded-2xl overflow-hidden shadow-inner">
                        <CardContent className="p-6 font-mono text-sm space-y-4">
                          <div className="flex items-center gap-4">
                            <span className="text-neutral-400 font-bold w-12 uppercase text-[10px] tracking-widest">Input:</span>
                            <span className="text-neutral-900 font-black">{example.input}</span>
                          </div>
                          <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
                            <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-widest">Output {idx + 1}:</span>
                            <span className="text-neutral-900 font-black tracking-tight">{example.output}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Right Section: Editor & Console */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Editor Container */}
          <Card className="flex-1 flex flex-col bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden relative">
            <header className="h-[52px] px-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 flex-shrink-0">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-8 text-xs bg-white border-neutral-200 font-bold rounded-xl shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-8 w-8 text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900 transition-colors">
                  <Expand className="w-4 h-4" />
                </Button>
              </div>
            </header>

            <div className="flex-1 relative overflow-hidden group">
              <textarea
                className={`h-full w-full p-8 font-mono text-sm outline-none resize-none bg-white transition-all duration-300 ${isDarkMode ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-900'}`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="// Write your code here..."
              />

              <Button
                className="absolute bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm px-6 py-6 rounded-2xl shadow-xl shadow-orange-600/30 gap-2 transform transition-all hover:scale-105 active:scale-95 flex items-center"
                onClick={() => toast.info('Try logic activated!')}
              >
                <Play className="w-4 h-4 fill-current" />
                Try Code
              </Button>
            </div>
          </Card>

          {/* Testcases Container */}
          <Card className="h-[320px] flex flex-col bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
            <header className="h-[52px] px-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 flex-shrink-0">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">Testcases</span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </header>

            <div className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {testCases.map((tc, idx) => (
                    <button
                      key={tc.id}
                      onClick={() => setActiveTestCase(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTestCase === idx ? 'bg-neutral-900 text-white shadow-lg scale-105' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                  <button className="h-8 w-8 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-200 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs gap-2 px-6 h-9 rounded-xl border border-orange-200 transition-all flex items-center"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run
                </Button>
              </div>

              <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar pr-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">n:</label>
                    <Card className="bg-neutral-50 border-neutral-100 rounded-xl p-3 shadow-inner">
                      <span className="font-mono text-sm font-bold">{testCases[activeTestCase]?.input}</span>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Actual Output:</label>
                    <Card className="bg-neutral-50 border-neutral-100 rounded-xl p-3 shadow-inner min-h-[40px]">
                      <span className="font-mono text-sm font-bold text-neutral-400 italic">No output yet...</span>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Expected Output:</label>
                    <Card className="bg-neutral-50 border-neutral-100 rounded-xl p-3 shadow-inner">
                      <span className="font-mono text-sm font-bold text-blue-600">{testCases[activeTestCase]?.expectedOutput}</span>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-10 space-y-8">
            <header className="flex flex-col items-center gap-4 text-center">
              {submitResult?.passed ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
              )}
              <h2 className={`text-3xl font-black tracking-tight ${submitResult?.passed ? 'text-green-700' : 'text-red-700'}`}>
                {submitResult?.passed ? 'Excellent Work!' : 'Almost There!'}
              </h2>
              <p className="text-neutral-500 font-medium">Your solution has been evaluated against all hidden test cases.</p>
            </header>

            <div className={`p-8 rounded-[24px] text-center space-y-1 ${submitResult?.passed ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-black">{submitResult?.testCasesPassed}</span>
                <span className="text-2xl font-bold opacity-40">/ {submitResult?.totalTestCases}</span>
              </div>
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${submitResult?.passed ? 'text-green-600' : 'text-red-600'}`}>Test Cases Passed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-neutral-200 font-bold text-neutral-700 hover:bg-neutral-50 transition-all"
                onClick={() => setShowResultDialog(false)}
              >
                Try Again
              </Button>
              <Button
                className="h-14 rounded-2xl bg-black hover:bg-neutral-900 text-white font-bold shadow-xl shadow-black/20 transition-all"
                onClick={handleFinalSubmit}
              >
                Submit Solution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d4; }
      `}} />
    </div>
  );
}
