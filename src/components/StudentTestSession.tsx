import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Video, Mic, AlertTriangle, Timer, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Play, Send, Settings, BookOpen, Clock, Activity, Sun, Moon } from 'lucide-react';
import { Test } from '../lib/test-store';
import Editor from '@monaco-editor/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';

interface StudentTestSessionProps {
  test: Test;
  onCancel: () => void;
  onSubmit: (score: number, total: number) => void;
}

export function StudentTestSession({ test, onCancel, onSubmit }: StudentTestSessionProps) {
  const [permissionState, setPermissionState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [isStarting, setIsStarting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const totalPoints = useMemo(() => {
    return test.questions.reduce((sum, q) => sum + q.points, 0);
  }, [test.questions]);

  const currentQuestion = test.questions[selectedIndex];

  const requestAccess = async () => {
    setIsStarting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissionState('denied');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionState('granted');
    } catch (error) {
      console.error('Media access denied', error);
      setPermissionState('denied');
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    requestAccess();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isActive, selectedIndex]);

  const handlePrev = () => setSelectedIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setSelectedIndex(prev => Math.min(test.questions.length - 1, prev + 1));

  const handleStart = () => {
    if (permissionState !== 'granted') return;
    setIsActive(true);
    setSelectedIndex(0);
  };

  const handleSubmit = () => {
    let score = 0;
    test.questions.forEach((question) => {
      if (question.type === 'mcq') {
        if (answers[question.id] && answers[question.id] === question.correctAnswer) {
          score += question.points;
        }
      } else {
        const response = answers[question.id] || '';
        if (response.trim().length > 8) {
          score += question.points;
        }
      }
    });
    onSubmit(score, totalPoints);
  };

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <Badge className="bg-blue-100 text-blue-700 px-3 py-1 mb-2">Pre-test Checklist</Badge>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">{test.title}</h2>
          <p className="text-neutral-600">Please complete the proctoring setup to begin your assessment.</p>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <Clock className="w-6 h-6 text-purple-600" />
            <div className="text-xs text-neutral-500 uppercase font-bold">Duration</div>
            <div className="font-semibold">{test.duration} min</div>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <div className="text-xs text-neutral-500 uppercase font-bold">Questions</div>
            <div className="font-semibold">{test.questions.length} Qs</div>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <Activity className="w-6 h-6 text-green-600" />
            <div className="text-xs text-neutral-500 uppercase font-bold">Points</div>
            <div className="font-semibold">{totalPoints} pts</div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative group">
            {permissionState === 'granted' ? (
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-neutral-800 p-6 text-center border">
                <AlertTriangle className="w-12 h-12 text-amber-400 mb-4 animate-pulse" />
                <p className="font-medium text-lg mb-2">{permissionState === 'denied' ? 'Access Denied' : 'Waiting for Permissions'}</p>
                <p className="text-sm text-neutral-400 max-w-xs">We need access to your camera and microphone to ensure test integrity.</p>
              </div>
            )}
            {permissionState === 'granted' && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge className="bg-red-500/80 backdrop-blur-sm border-none flex items-center gap-1.5"><Activity className="w-3 h-3" /> Live View</Badge>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 h-12 text-lg font-semibold rounded-xl border-2"
              onClick={requestAccess}
              disabled={isStarting}
            >
              {isStarting ? <Activity className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
              Retry Setup
            </Button>
            <Button
              variant="ghost"
              className="h-12 px-6 rounded-xl text-neutral-500 font-medium"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>

        <Button
          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          disabled={permissionState !== 'granted'}
          onClick={handleStart}
          className="w-full h-14 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          I'm Ready, Start Test
        </Button>

        <p className="text-xs text-neutral-400 text-center max-w-sm">
          By starting, you agree to being recorded and monitored throughout the session. Tab switching is strictly prohibited.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-100 flex flex-col overflow-hidden select-none relative">
      {/* Test Header */}
      <div className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">C</div>
            <h2 className="font-bold text-lg tracking-tight text-neutral-800">{test.title}</h2>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Time Remaining</span>
              <div className="flex items-center gap-2 text-red-600 font-mono font-bold">
                <Timer className="w-4 h-4" />
                <span>{test.duration}:00</span>
              </div>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Progress</span>
              <div className="text-sm font-bold text-neutral-700">{test.questions.filter(q => !!answers[q.id]).length} / {test.questions.length} Solved</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-700">Live Monitoring Active</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-lg">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 rounded-lg shadow-sm">
            End & Submit Test
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Question Navigator Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} className="bg-white border-r border-neutral-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              <section>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Question List</h3>
                <div className="grid grid-cols-1 gap-2">
                  {test.questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${selectedIndex === idx
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-neutral-100 hover:bg-neutral-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${selectedIndex === idx ? 'bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-600'
                          }`}>{idx + 1}</span>
                        <span className="font-semibold text-neutral-700">{q.title}</span>
                      </div>
                      {answers[q.id] && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </button>
                  ))}
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest ">Camera Feed</h3>
                <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden relative shadow-inner">
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-amber-50 border border-amber-100 text-[10px] text-amber-800 leading-relaxed font-medium">
                  <div className="flex gap-2"><AlertTriangle className="w-3 h-3 shrink-0" /> AI tracking is analyzing your movement.</div>
                  <div className="flex gap-2"><ShieldCheck className="w-3 h-3 shrink-0" /> Tab switches are being logged.</div>
                </div>
              </section>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={80} className="h-full">
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={40} minSize={20} className="bg-white h-full">
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="h-12 px-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs font-bold text-neutral-500 px-3 border">Question {selectedIndex + 1}</Badge>
                      <Badge className="bg-blue-100 text-blue-700 px-3 border">{currentQuestion.points} Points</Badge>
                      <Badge className="bg-purple-100 text-purple-700 px-3 capitalize border">{currentQuestion.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {currentQuestion ? (
                      <>
                        <div className="space-y-2">
                          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{currentQuestion.title}</h1>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-neutral-500 font-medium px-2 border">Topic: {(currentQuestion as any).topic || 'General'}</Badge>
                          </div>
                        </div>
                        <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed font-normal">
                          <p className="whitespace-pre-wrap">{currentQuestion.description || 'No description provided.'}</p>
                        </div>

                        {((currentQuestion.type as string) === 'coding' || (currentQuestion.type as string) === 'code') && (
                          <div className="space-y-4 pt-4">
                            <h4 className="font-bold text-sm text-neutral-900 border-l-4 border-purple-600 pl-3">Expected Constraints</h4>
                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-sm font-mono text-neutral-600">
                              Time Limit: 2s | Memory Limit: 256MB
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-400">
                        Select a question to view details
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={60} className="bg-white flex flex-col h-full">
                <div className="h-12 px-6 bg-neutral-900 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      {((currentQuestion.type as string) === 'mcq' || (currentQuestion.type as string) === 'multiple_choice') ? 'Select Answer' : 'Editor'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mr-4">
                      {answers[currentQuestion.id] ? 'Draft Saved' : 'Auto-saving...'}
                    </div>
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white"><Settings className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden bg-neutral-900 flex flex-col">
                  {!currentQuestion ? (
                    <div className="flex-1 flex items-center justify-center text-neutral-500">
                      Please select a question to begin
                    </div>
                  ) : ((currentQuestion.type as string) === 'mcq' || (currentQuestion.type as string) === 'multiple_choice') ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 p-8 overflow-y-auto">
                      <RadioGroup
                        value={answers[currentQuestion.id] || ''}
                        onValueChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl"
                      >
                        {(currentQuestion.options || []).map((opt, idx) => (
                          <div
                            key={`${currentQuestion.id}-${idx}`}
                            onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))}
                            className={`flex items-center space-x-4 border-2 rounded-2xl p-6 transition-all cursor-pointer group ${answers[currentQuestion.id] === opt
                              ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-500/10'
                              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${answers[currentQuestion.id] === opt ? 'bg-purple-600 border-purple-600 scale-110' : 'border-neutral-700 group-hover:border-neutral-600'
                              }`}>
                              <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${answers[currentQuestion.id] === opt ? 'scale-100' : 'scale-0'}`} />
                            </div>
                            <RadioGroupItem value={opt} id={`${currentQuestion.id}-${idx}`} className="sr-only" />
                            <Label htmlFor={`${currentQuestion.id}-${idx}`} className="text-lg font-medium text-neutral-200 cursor-pointer">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      <Editor
                        width="100%"
                        height="100%"
                        defaultLanguage="python"
                        language={(currentQuestion as any).language || 'python'}
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        value={answers[currentQuestion.id] || (currentQuestion as any).starterCode || ''}
                        onChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val || '' }))}
                        options={{
                          fontSize: 16,
                          fontFamily: 'JetBrains Mono, Fira Code, monospace',
                          minimap: { enabled: false },
                          padding: { top: 20 },
                          scrollbar: { vertical: 'auto', horizontal: 'auto' },
                          lineNumbers: 'on',
                          automaticLayout: true,
                          wordWrap: 'on',
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Bar */}
                <div className="h-16 px-6 bg-white border-t border-neutral-200 flex items-center justify-between shrink-0 shadow-lg">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={selectedIndex === 0}
                      onClick={handlePrev}
                      className="rounded-xl border-2 font-bold px-4 hover:bg-neutral-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={selectedIndex === test.questions.length - 1}
                      onClick={handleNext}
                      className="rounded-xl border-2 font-bold px-4 hover:bg-neutral-50"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-neutral-400 font-bold tracking-tight bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                      Question {selectedIndex + 1} of {test.questions.length}
                    </div>
                    <Button size="icon" variant="ghost" className="text-neutral-400"><Send className="w-4 h-4" /></Button>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

const Separator = ({ className, orientation = 'horizontal' }: { className?: string, orientation?: 'horizontal' | 'vertical' }) => (
  <div className={`${className} ${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'} bg-neutral-200`} />
);
