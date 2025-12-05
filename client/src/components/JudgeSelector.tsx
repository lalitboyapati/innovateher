import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft } from 'lucide-react';

interface Judge {
  id: string;
  name: string;
  specialization: string;
}

interface JudgeSelectorProps {
  judges: Judge[];
  onSelectJudge: (judgeName: string) => void;
  onBack: () => void;
}

export function JudgeSelector({ judges, onSelectJudge, onBack }: JudgeSelectorProps) {
  const [selectedJudge, setSelectedJudge] = useState('');
  const [customName, setCustomName] = useState('');

  const handleContinue = () => {
    const name = selectedJudge === 'custom' ? customName : selectedJudge;
    if (name.trim()) {
      onSelectJudge(name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Judge Portal" subtitle="Select your name to begin" />
      
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Who are you?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judge">Select Your Name</Label>
              <Select value={selectedJudge} onValueChange={setSelectedJudge}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from the list" />
                </SelectTrigger>
                <SelectContent>
                  {judges.map((judge) => (
                    <SelectItem key={judge.id} value={judge.name}>
                      {judge.name} - {judge.specialization}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Enter custom name...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedJudge === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customName">Enter Your Name</Label>
                <Input
                  id="customName"
                  placeholder="Your name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleContinue}
                disabled={!selectedJudge || (selectedJudge === 'custom' && !customName.trim())}
              >
                Continue to Judging
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
