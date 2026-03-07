import React, { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Test } from '../lib/test-store';

interface StudentTestSessionProps {
  test: Test;
  onCancel: () => void;
  onSubmit: (score: number, total: number) => void;
}

export function StudentTestSession({ test, onCancel, onSubmit }: StudentTestSessionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedCodingQuestions, setSubmittedCodingQuestions] = useState<Record<string, boolean>>({});

  const totalPoints = useMemo(() => {
    return test.questions.reduce((sum, q) => sum + q.points, 0);
  }, [test.questions]);

  const currentQuestion = test.questions[selectedIndex];

  const isCodingQuestion = (question?: Test['questions'][number]) =>
    !!question && ((question.type as string) === 'coding' || (question.type as string) === 'code');

  const isQuestionAnswered = (question: Test['questions'][number]) => {
    if ((question.type as string) === 'mcq' || (question.type as string) === 'multiple_choice') {
      return !!answers[question.id];
    }
    return !!submittedCodingQuestions[question.id] && !!(answers[question.id] || '').trim();
  };

  const handlePrev = () => setSelectedIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setSelectedIndex(prev => Math.min(test.questions.length - 1, prev + 1));

  const handleSubmit = () => {
    let score = 0;
    test.questions.forEach((question) => {
      if ((question.type as string) === 'mcq' || (question.type as string) === 'multiple_choice') {
        if (answers[question.id] && answers[question.id] === question.correctAnswer) {
          score += question.points;
        }
      } else {
        const response = answers[question.id] || '';
        if (submittedCodingQuestions[question.id] && response.trim().length > 0) {
          score += question.points;
        }
      }
    });
    onSubmit(score, totalPoints);
  };

  const answeredCount = test.questions.filter(question => isQuestionAnswered(question)).length;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="h-14 border-b border-neutral-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 h-auto text-neutral-600 hover:text-neutral-900" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="h-5 w-px bg-neutral-200" />
          <span className="font-semibold">{test.title}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span>{answeredCount}/{test.questions.length} answered</span>
          <Button size="sm" onClick={handleSubmit}>Submit</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <aside className="border border-neutral-200 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Questions</p>
            <div className="space-y-2">
              {test.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full text-left rounded-md border px-3 py-2 text-sm transition-colors ${
                    selectedIndex === index ? 'border-neutral-900 bg-neutral-100' : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{index + 1}. {question.title}</span>
                    {isQuestionAnswered(question) && <span className="text-xs text-emerald-600">Done</span>}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Question {selectedIndex + 1}</Badge>
              <Badge variant="outline">{currentQuestion.points} pts</Badge>
              {currentQuestion.difficulty && (
                <Badge variant="outline" className="capitalize">{currentQuestion.difficulty}</Badge>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
              <p className="text-neutral-600 mt-2">{currentQuestion.description}</p>
            </div>

            {isCodingQuestion(currentQuestion) ? (
              <div className="space-y-2">
                <Label htmlFor="coding-answer" className="text-sm text-neutral-600">Your Answer</Label>
                <Textarea
                  id="coding-answer"
                  rows={10}
                  placeholder="Write your solution here..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSubmittedCodingQuestions(prev => ({ ...prev, [currentQuestion.id]: true }))}
                  >
                    Save Answer
                  </Button>
                </div>
              </div>
            ) : (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))}
                className="space-y-3"
              >
                {(currentQuestion.options || []).map(option => (
                  <div key={option} className="flex items-center space-x-3 rounded-lg border border-neutral-200 px-3 py-2">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                    <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={handlePrev} disabled={selectedIndex === 0}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext} disabled={selectedIndex === test.questions.length - 1}>
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
