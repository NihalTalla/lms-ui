import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, CheckCircle2, ArrowRight, Filter, Trophy } from 'lucide-react';
import { problems, Problem } from '../lib/data';

interface ProblemsPageProps {
  onSelectProblem: (problem: Problem) => void;
}

export function ProblemsPage({ onSelectProblem }: ProblemsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const allTags = Array.from(new Set(problems.flatMap(p => p.tags)));

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'all' || problem.tags.includes(tagFilter);
    
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const solvedProblems = new Set(['problem-1', 'problem-2']); // Mock solved problems

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Practice Problems</h2>
          <p className="text-neutral-600 mt-1">
            Solve coding challenges to improve your skills
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-neutral-600">Problems Solved</p>
            <p className="font-mono">23 / {problems.length}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center" style={{ borderColor: 'var(--color-primary)' }}>
            <Trophy className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Problems ({filteredProblems.length})</TabsTrigger>
          <TabsTrigger value="solved">Solved ({solvedProblems.size})</TabsTrigger>
          <TabsTrigger value="unsolved">Unsolved ({filteredProblems.length - solvedProblems.size})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filteredProblems.map((problem, index) => {
            const isSolved = solvedProblems.has(problem.id);
            return (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectProblem(problem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-sm text-neutral-600">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base">{problem.title}</h4>
                          <Badge
                            variant="outline"
                            className={
                              problem.difficulty === 'easy'
                                ? 'border-green-300 text-green-700'
                                : problem.difficulty === 'medium'
                                ? 'border-yellow-300 text-yellow-700'
                                : 'border-red-300 text-red-700'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                          {isSolved && (
                            <Badge className="bg-green-100 text-green-700">Solved</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {problem.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">Points</p>
                        <p className="font-mono">{problem.points}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="solved" className="space-y-3">
          {filteredProblems
            .filter(p => solvedProblems.has(p.id))
            .map((problem, index) => (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectProblem(problem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base">{problem.title}</h4>
                          <Badge
                            variant="outline"
                            className={
                              problem.difficulty === 'easy'
                                ? 'border-green-300 text-green-700'
                                : problem.difficulty === 'medium'
                                ? 'border-yellow-300 text-yellow-700'
                                : 'border-red-300 text-red-700'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {problem.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="unsolved" className="space-y-3">
          {filteredProblems
            .filter(p => !solvedProblems.has(p.id))
            .map((problem, index) => (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectProblem(problem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100">
                        <span className="text-sm text-neutral-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base">{problem.title}</h4>
                          <Badge
                            variant="outline"
                            className={
                              problem.difficulty === 'easy'
                                ? 'border-green-300 text-green-700'
                                : problem.difficulty === 'medium'
                                ? 'border-yellow-300 text-yellow-700'
                                : 'border-red-300 text-red-700'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {problem.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">Points</p>
                        <p className="font-mono">{problem.points}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
