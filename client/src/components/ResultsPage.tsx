import { useMemo } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trophy, Download, ArrowLeft } from 'lucide-react';
import { Team } from './AddTeamsPage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Category {
  id: string;
  name: string;
  weight: number;
}

interface ResultsPageProps {
  teams: Team[];
  categories: Category[];
  onBack: () => void;
  onStartOver: () => void;
}

export function ResultsPage({ teams, categories, onBack, onStartOver }: ResultsPageProps) {
  const results = useMemo(() => {
    return teams.map(team => {
      const categoryScores: Record<string, number> = {};
      const categoryComments: Record<string, string[]> = {};

      // Calculate average score for each category
      categories.forEach(category => {
        const judgeScores: number[] = [];
        const judgeComments: string[] = [];

        Object.entries(team.scores).forEach(([_, scoreData]) => {
          const score = (scoreData as any).score?.[category.id];
          const comment = (scoreData as any).comment?.[category.id];
          
          if (score !== undefined) {
            judgeScores.push(score);
          }
          if (comment) {
            judgeComments.push(comment);
          }
        });

        const avgScore = judgeScores.length > 0 
          ? judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length 
          : 0;
        
        categoryScores[category.id] = avgScore;
        categoryComments[category.id] = judgeComments;
      });

      // Calculate weighted total
      const totalScore = categories.reduce((total, category) => {
        const categoryScore = categoryScores[category.id] || 0;
        const weightedScore = (categoryScore / 10) * category.weight;
        return total + weightedScore;
      }, 0);

      return {
        team,
        categoryScores,
        categoryComments,
        totalScore,
        judgesCount: Object.keys(team.scores).length,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [teams, categories]);

  const chartData = results.map(result => {
    const data: any = {
      name: result.team.name.length > 15 
        ? result.team.name.substring(0, 15) + '...' 
        : result.team.name,
      total: Math.round(result.totalScore * 10) / 10,
    };
    
    categories.forEach(cat => {
      data[cat.name] = Math.round(result.categoryScores[cat.id] * 10) / 10;
    });
    
    return data;
  });

  const exportResults = () => {
    const csvContent = [
      ['Rank', 'Team Name', 'Track', 'Total Score', ...categories.map(c => c.name), 'Judges Count'].join(','),
      ...results.map((result, index) => 
        [
          index + 1,
          `"${result.team.name}"`,
          result.team.track,
          result.totalScore.toFixed(2),
          ...categories.map(cat => result.categoryScores[cat.id].toFixed(2)),
          result.judgesCount,
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'innovateher-results.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Results & Winners" />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Winner Card */}
        {results.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <CardTitle className="text-2xl">Winner: {results[0].team.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-purple-100 text-purple-700">
                      {results[0].team.track}
                    </Badge>
                    <span className="text-lg font-semibold">
                      Total Score: {results[0].totalScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Leaderboard Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Leaderboard</CardTitle>
            <Button onClick={exportResults} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    {categories.map(cat => (
                      <TableHead key={cat.id} className="text-right">
                        {cat.name} ({cat.weight}%)
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Judges</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={result.team.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                          <span className="font-medium">#{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{result.team.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-700">
                          {result.team.track}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {result.totalScore.toFixed(2)}
                      </TableCell>
                      {categories.map(cat => (
                        <TableCell key={cat.id} className="text-right">
                          {result.categoryScores[cat.id].toFixed(1)} / 10
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        {result.judgesCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Score Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8b5cf6" name="Total Score" />
                {categories.map((cat, index) => {
                  const colors = ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'];
                  return (
                    <Bar 
                      key={cat.id} 
                      dataKey={cat.name} 
                      fill={colors[index % colors.length]} 
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Scores Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map(category => (
              <div key={category.id} className="space-y-2">
                <h3 className="font-medium">{category.name} ({category.weight}%)</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {results.map(result => (
                    <div 
                      key={result.team.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{result.team.name}</span>
                      <span className="font-medium">
                        {result.categoryScores[category.id].toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scoring
          </Button>
          <Button onClick={onStartOver}>
            Start New Event
          </Button>
        </div>
      </div>
    </div>
  );
}
