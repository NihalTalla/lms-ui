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
  Moon,
  Sun,
  Expand,
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTestcasesCollapsed, setIsTestcasesCollapsed] = useState(false);

  // Initialize starter code
  useEffect(() => {
    const javaTemplate = `public class TestClass {
    public static String printSeries(int n) { // Don't change the number of parameters
        // Please write your return statement here
        String str="";
        int i=1;
        while(i<=n){
            if(!str.isEmpty()){
                str+=",";
            }
            str+=i;
            i=i+9;
        }
        return str;
    }

    //Please don't modify the below code
    public static void main(String[] args) {
        System.out.print(printSeries(Integer.parseInt(args[0])));
    }
}`;
    setCode(javaTemplate);
  }, []);

  const handleRunCode = () => {
    toast.success('Code execution started...');
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-50 overflow-hidden font-sans">
      {/* MAIN CONTENT: Two columns */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Problem Description */}
        <div className="w-[30%] bg-white border-r border-neutral-200 flex flex-col h-full overflow-hidden">
          {/* Fixed Header in Left Panel */}
          <div className="p-4 border-b border-neutral-100 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="text-neutral-500 hover:text-neutral-900 -ml-2 mb-2 h-8"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-neutral-900">{topicTitle}</h1>
              <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-bold ${getDifficultyColor()}`}>
                {difficulty}
              </Badge>
            </div>
          </div>

          {/* Scrollable Content in Left Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
            <div className="space-y-4">
              <p className="text-sm font-bold text-neutral-800">
                Write a program to print the following series of numbers:
              </p>
              <p className="text-sm font-semibold text-neutral-700 italic">
                {topicTitle}
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {problemDescription}
              </p>
              <p className="text-xs text-neutral-600">
                Go through the following examples below to understand the problem better:
              </p>
            </div>

            {/* Examples as Cards */}
            <div className="space-y-4">
              {examples.map((ex, idx) => (
                <Card key={ex.id} className="border border-neutral-200 shadow-none rounded-xl bg-neutral-50/30">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs font-bold text-neutral-800">Example {idx + 1} :</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="text-xs font-semibold text-neutral-600 mr-2 mt-1">n :</span>
                        <span className="text-xs font-mono text-neutral-800 bg-white border border-neutral-100 px-2 py-1 rounded-md">{ex.input}</span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-600 mb-1">Output {idx + 1} :</div>
                        <div className="text-xs font-mono text-neutral-800 bg-white border border-neutral-100 px-2 py-1 rounded-md break-all">{ex.output}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Editor + Testcases */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* TOP — Code Editor Section */}
          <div className={`${isTestcasesCollapsed ? 'flex-1' : 'flex-[0.6]'} flex flex-col bg-white border-b border-neutral-200 overflow-hidden relative transition-all duration-300`}>
            <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-24 h-8 text-xs border-none shadow-none focus:ring-0 bg-neutral-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4 text-neutral-400">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 cursor-pointer hover:text-neutral-600" onClick={() => setCode('')} />
                  <Moon className="w-4 h-4 cursor-pointer hover:text-neutral-600" />
                  <Expand className="w-4 h-4 cursor-pointer hover:text-neutral-600" />
                </div>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-10 bg-neutral-50 border-r border-neutral-100 text-right py-4 px-2 select-none">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="text-[10px] text-neutral-400 font-mono h-[20px] leading-[20px]">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-sm text-neutral-800 resize-none outline-none leading-[20px]"
                spellCheck="false"
              />
            </div>

            {/* Floating button */}
            <Button
              className="absolute bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white gap-2 h-9 px-4 rounded-lg shadow-lg"
              onClick={() => toast.success('Try Code clicked!')}
            >
              <Terminal className="w-4 h-4" />
              Try Code
            </Button>
          </div>

          {/* BOTTOM — Testcases Section */}
          <div className={`${isTestcasesCollapsed ? 'h-12' : 'flex-[0.4]'} bg-white flex flex-col overflow-hidden transition-all duration-300`}>
            <div className="px-6 py-0 h-12 flex items-center justify-between border-b border-neutral-100 cursor-pointer hover:bg-neutral-50/50" onClick={() => setIsTestcasesCollapsed(!isTestcasesCollapsed)}>
              <div className="flex items-center gap-6 h-full overflow-hidden mr-4">
                <h3 className="text-sm font-bold text-neutral-800 flex-shrink-0">Testcases</h3>
                {!isTestcasesCollapsed && (
                  <div className="flex items-center gap-2 h-full py-2 overflow-x-auto no-scrollbar flex-1">
                    {testCases.map((tc, idx) => (
                      <button
                        key={tc.id || idx}
                        onClick={(e) => { e.stopPropagation(); setActiveTestCase(idx); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 flex items-center justify-center ${activeTestCase === idx
                            ? 'bg-neutral-900 text-white shadow-md scale-105'
                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                        style={activeTestCase === idx ? { backgroundColor: '#171717', color: '#ffffff' } : {}}
                      >
                        <span className={activeTestCase === idx ? 'text-white' : ''}>Case {idx + 1}</span>
                      </button>
                    ))}
                    <button onClick={(e) => e.stopPropagation()} className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-400 flex-shrink-0 flex items-center justify-center hover:bg-neutral-200 transition-colors ml-2">
                      +
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 flex-shrink-0 mr-4">
                {!isTestcasesCollapsed && (
                  <Button
                    onClick={(e) => { e.stopPropagation(); handleRunCode(); }}
                    className="bg-orange-500 hover:bg-orange-600 text-white border-none h-8 px-4 gap-2 rounded-lg font-extrabold shadow-sm transform active:scale-95 transition-all text-xs flex items-center justify-center whitespace-nowrap"
                    style={{ backgroundColor: '#f97316', color: '#ffffff', opacity: 1 }}
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Run</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => { e.stopPropagation(); setIsTestcasesCollapsed(!isTestcasesCollapsed); }}
                >
                  {isTestcasesCollapsed ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </Button>
              </div>
            </div>

            {!isTestcasesCollapsed && (
              <div className="flex-1 relative bg-white overflow-hidden flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto pb-24">
                  <div className="space-y-8 max-w-4xl w-full">
                    {/* Case Input Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Input n:</label>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-sm text-neutral-800 font-mono min-h-[3rem] flex items-center shadow-sm">
                        {testCases[activeTestCase]?.input || ''}
                      </div>
                    </div>

                    {/* Actual Output Section */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Actual Output</label>
                      <div className="bg-white border border-neutral-100 rounded-xl p-4 min-h-[3rem] shadow-sm italic text-neutral-400 text-sm">
                        // No output yet. Run code to see results.
                      </div>
                    </div>

                    {/* Expected Output Section */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Expected Output</label>
                      <div className="bg-white border border-neutral-100 rounded-xl p-4 min-h-[3rem] text-sm text-neutral-800 font-mono flex items-center shadow-sm">
                        {testCases[activeTestCase]?.expectedOutput || ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
