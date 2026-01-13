import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Play, RotateCcw, ArrowLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';

export function CodePracticeConsole({ onBack }: { onBack?: () => void }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to the Code Practice Console!
// Write your JavaScript code here and click Run to execute it.

console.log("Hello, World!");

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...\n');

    try {
      // Capture console.log outputs
      let logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute the code
      const result = eval(code);

      // Restore console.log
      console.log = originalConsoleLog;

      // Format output
      let outputText = logs.join('\n');
      if (result !== undefined) {
        outputText += '\n\nResult: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      }

      setOutput(outputText || 'Code executed successfully (no output)');
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }

    setIsRunning(false);
  };

  const clearConsole = () => {
    setOutput('');
  };

  const resetCode = () => {
    setCode(`// Welcome to the Code Practice Console!
// Write your JavaScript code here and click Run to execute it.

console.log("Hello, World!");

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));`);
    setOutput('');
  };

  return (
    <Card className="h-screen flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            )}
            <CardTitle>Code Practice Console</CardTitle>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python" disabled>Python (Coming Soon)</SelectItem>
              <SelectItem value="java" disabled>Java (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runCode} disabled={isRunning} size="sm">
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={clearConsole} variant="outline" size="sm">
            Clear Console
          </Button>
          <Button onClick={resetCode} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        <div className="flex-1">
          <Editor
            height="300px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="border-t border-neutral-200">
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Console Output</h4>
            <ScrollArea className="h-32 w-full rounded border bg-black text-green-400 p-2 font-mono text-sm">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}