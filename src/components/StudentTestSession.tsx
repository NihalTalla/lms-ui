import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Video, Mic, AlertTriangle, Timer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Test } from '../lib/test-store';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-neutral-900">{test.title}</h2>
            <Badge className="bg-green-100 text-green-700">Live</Badge>
            <Badge variant="outline" className="text-[11px]">{test.batchName}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <span className="inline-flex items-center gap-2"><Timer className="w-4 h-4" /> {test.duration} min</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Camera & Mic required</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> {test.questions.length} questions</span>
          </div>
        </div>
        <div className="w-48">
          <Button
            style={{ backgroundColor: 'var(--color-primary)' }}
            disabled={permissionState !== 'granted' || isActive}
            onClick={handleStart}
            className="w-full"
          >
            {permissionState === 'granted' ? 'Start Test' : isStarting ? 'Requesting...' : 'Allow Camera & Mic'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Proctoring Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg overflow-hidden bg-neutral-900 aspect-video flex items-center justify-center text-white">
              {permissionState === 'granted' ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-sm text-neutral-200">
                  <AlertTriangle className="w-6 h-6 text-amber-300" />
                  <span>{permissionState === 'denied' ? 'Access denied. Please allow camera & mic.' : 'Requesting permissions...'}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2"><Video className="w-4 h-4" /> Video required</div>
              <div className="flex items-center gap-2"><Mic className="w-4 h-4" /> Mic required</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Monitoring on</div>
              <div className="flex items-center gap-2"><Timer className="w-4 h-4" /> {test.duration} min</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={requestAccess} disabled={isStarting}>
                Retry Access
              </Button>
              <Button variant="ghost" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="xl:col-span-3 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Question List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
                {test.questions.map((question, idx) => {
                  const answered = Boolean(answers[question.id]);
                  return (
                    <button
                      key={question.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left border rounded-lg px-3 py-3 transition ${
                        selectedIndex === idx ? 'border-purple-400 bg-purple-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                      disabled={!isActive}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-neutral-900">Q{idx + 1}. {question.title}</div>
                        <Badge variant="outline" className="text-[10px]">{question.points} pts</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <Badge variant="outline" className="text-[10px]">{question.type === 'mcq' ? 'MCQ' : 'Coding'}</Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">{question.difficulty}</Badge>
                        {answered && <span className="text-green-600 font-semibold">Answered</span>}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Work Area</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isActive && (
                  <div className="p-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-neutral-600 text-sm">
                    Start the test after granting camera & microphone to unlock questions.
                  </div>
                )}
                {isActive && currentQuestion && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm uppercase text-neutral-500">Question {selectedIndex + 1}</div>
                        <div className="text-lg font-semibold text-neutral-900">{currentQuestion.title}</div>
                        <p className="text-sm text-neutral-600">{currentQuestion.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{currentQuestion.points} pts</Badge>
                        <Badge variant="outline" className="capitalize">{currentQuestion.difficulty}</Badge>
                        <Badge variant="outline">{currentQuestion.type === 'mcq' ? 'MCQ' : 'Coding'}</Badge>
                      </div>
                    </div>

                    {currentQuestion.type === 'mcq' ? (
                      <RadioGroup
                        value={answers[currentQuestion.id] || ''}
                        onValueChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))}
                        className="space-y-2"
                      >
                        {(currentQuestion.options || []).map((opt, idx) => (
                          <div key={`${currentQuestion.id}-${idx}`} className="flex items-center space-x-2 border rounded-lg px-3 py-2 hover:bg-neutral-50">
                            <RadioGroupItem value={opt} id={`${currentQuestion.id}-${idx}`} />
                            <Label htmlFor={`${currentQuestion.id}-${idx}`}>{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Textarea
                        rows={6}
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                        placeholder="Write your solution here..."
                        className="font-mono text-sm"
                      />
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={onCancel}>Save & Exit</Button>
                      <Button onClick={handleSubmit} style={{ backgroundColor: 'var(--color-primary)' }}>
                        Submit Test
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
