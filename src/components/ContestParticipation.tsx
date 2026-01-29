import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Camera,
  Settings,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  description: string;
}

interface ContestSession {
  contestId: string;
  contestName: string;
  startTime: string;
  endTime: string;
  questions: Question[];
}

interface MediaConstraints {
  audio: boolean;
  video: boolean;
}

export function ContestParticipation({
  contestSession,
  onSubmit,
  onExit,
}: {
  contestSession: ContestSession;
  onSubmit: (answers: any) => void;
  onExit: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{
    camera: boolean;
    microphone: boolean;
  }>({ camera: false, microphone: false });
  const [submissions, setSubmissions] = useState<{
    questionId: string;
    status: 'submitted' | 'draft';
  }[]>([]);

  // Initialize camera and microphone
  useEffect(() => {
    initializeMedia();
    return () => {
      stopMedia();
    };
  }, []);

  // Update timer
  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(contestSession.endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining('Time up!');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contestSession.endTime]);

  const initializeMedia = async () => {
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      });

      mediaStreamRef.current = stream;
      setPermissionStatus({ camera: true, microphone: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast.success('Camera and Microphone enabled');
    } catch (error: any) {
      toast.error(`Media access denied: ${error.message}`);
      setShowPermissionDialog(true);
      setPermissionStatus({
        camera: error.name === 'NotAllowedError',
        microphone: error.name === 'NotAllowedError',
      });
    }
  };

  const stopMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleMicrophone = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicEnabled(!isMicEnabled);
      toast.info(isMicEnabled ? 'Microphone disabled' : 'Microphone enabled');
    }
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
      toast.info(isVideoEnabled ? 'Camera disabled' : 'Camera enabled');
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        setIsScreenSharing(false);
        toast.info('Screen sharing stopped');
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
        });
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);
        toast.success('Screen sharing started');

        // Stop screen share if user stops it from the browser
        screenStream.getTracks()[0].onended = () => {
          setIsScreenSharing(false);
          toast.info('Screen sharing stopped');
        };
      }
    } catch (error: any) {
      if (error.name !== 'NotAllowedError') {
        toast.error('Screen sharing not supported or denied');
      }
    }
  };

  const submitQuestion = () => {
    const answer = answers[contestSession.questions[currentQuestion].id];
    if (!answer || answer.trim() === '') {
      toast.error('Please provide an answer');
      return;
    }

    setSubmissions(prev => [
      ...prev.filter(s => s.questionId !== contestSession.questions[currentQuestion].id),
      { questionId: contestSession.questions[currentQuestion].id, status: 'submitted' },
    ]);
    toast.success('Question submitted');

    if (currentQuestion < contestSession.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = () => {
    if (confirm('Are you sure you want to submit your answers?')) {
      onSubmit(answers);
      stopMedia();
      toast.success('Answers submitted successfully');
    }
  };

  const question = contestSession.questions[currentQuestion];
  const isSubmitted = submissions.some(
    s => s.questionId === question.id && s.status === 'submitted'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Media Access Required
            </DialogTitle>
            <DialogDescription>
              To participate in the contest, you need to grant camera and microphone permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="font-medium">Camera</span>
              {permissionStatus.camera ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="font-medium">Microphone</span>
              {permissionStatus.microphone ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              Click Allow when your browser prompts for camera/microphone access.
            </p>
          </div>
          <Button onClick={() => setShowPermissionDialog(false)} className="w-full">
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      {/* Header with Timer */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{contestSession.contestName}</h1>
              <p className="text-sm text-neutral-600">Question {currentQuestion + 1} of {contestSession.questions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Clock className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                <p className="text-lg font-mono font-bold text-neutral-900">{timeRemaining}</p>
              </div>
              <Button variant="destructive" onClick={onExit} size="sm">
                Exit Contest
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{question.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          question.difficulty === 'easy'
                            ? 'outline'
                            : question.difficulty === 'medium'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {question.difficulty.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-semibold text-neutral-600">
                        {question.points} points
                      </span>
                    </div>
                  </div>
                  {isSubmitted && (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-neutral-700 whitespace-pre-wrap">{question.description}</p>
                </div>

                {/* Code Editor Placeholder */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-neutral-900 text-white p-4 font-mono text-sm">
                    <div className="text-neutral-500">// Write your solution here</div>
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={e =>
                        setAnswers(prev => ({
                          ...prev,
                          [question.id]: e.target.value,
                        }))
                      }
                      className="w-full h-64 bg-neutral-900 text-neutral-100 border-none resize-none focus:outline-none font-mono"
                      placeholder="Enter your code here..."
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Previous
                  </Button>
                  <div className="space-x-2">
                    <Button
                      onClick={submitQuestion}
                      disabled={isSubmitted}
                      variant={isSubmitted ? 'outline' : 'default'}
                    >
                      {isSubmitted ? 'Submitted' : 'Submit'} Question
                    </Button>
                    {currentQuestion < contestSession.questions.length - 1 && (
                      <Button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        variant="outline"
                      >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Camera, Microphone, Questions List */}
          <div className="space-y-6">
            {/* Camera Feed */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Camera Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-900 rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-48 object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    width={640}
                    height={480}
                  />
                </div>

                {/* Media Controls */}
                <div className="space-y-2">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Your camera and microphone are active. Ensure they're properly positioned.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={isMicEnabled ? 'default' : 'destructive'}
                      onClick={toggleMicrophone}
                      className="w-full"
                    >
                      {isMicEnabled ? (
                        <>
                          <Mic className="w-4 h-4 mr-1" />
                          Mic On
                        </>
                      ) : (
                        <>
                          <MicOff className="w-4 h-4 mr-1" />
                          Mic Off
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={isVideoEnabled ? 'default' : 'destructive'}
                      onClick={toggleCamera}
                      className="w-full"
                    >
                      {isVideoEnabled ? (
                        <>
                          <Video className="w-4 h-4 mr-1" />
                          Cam On
                        </>
                      ) : (
                        <>
                          <VideoOff className="w-4 h-4 mr-1" />
                          Cam Off
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant={isScreenSharing ? 'destructive' : 'outline'}
                    onClick={toggleScreenShare}
                    className="w-full"
                  >
                    {isScreenSharing ? (
                      <>
                        <MonitorOff className="w-4 h-4 mr-1" />
                        Stop Share
                      </>
                    ) : (
                      <>
                        <Monitor className="w-4 h-4 mr-1" />
                        Share Screen
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2 pr-4">
                    {contestSession.questions.map((q, index) => {
                      const isCurrentQuestion = index === currentQuestion;
                      const isAnswerSubmitted = submissions.some(
                        s => s.questionId === q.id && s.status === 'submitted'
                      );

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(index)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            isCurrentQuestion
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-neutral-900">
                                Q{index + 1}: {q.title}
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">
                                {q.points} pts
                              </p>
                            </div>
                            {isAnswerSubmitted && (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Finish Button */}
            <Button
              onClick={handleFinish}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Finish & Submit All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
