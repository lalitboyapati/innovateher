import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export interface Judge {
  id: string;
  name: string;
  specialization: string;
}

interface AddJudgesPageProps {
  onNext: (judges: Judge[]) => void;
  onBack: () => void;
  initialJudges?: Judge[];
}

const specializations = [
  'AI/ML',
  'Full Stack',
  'UX/UI Design',
  'Mobile Development',
  'Data Science',
  'DevOps',
  'Cybersecurity',
  'IoT',
  'Blockchain',
  'General',
];

export function AddJudgesPage({ onNext, onBack, initialJudges }: AddJudgesPageProps) {
  const [judges, setJudges] = useState<Judge[]>(initialJudges || []);
  const [currentJudge, setCurrentJudge] = useState({
    name: '',
    specialization: '',
  });

  const addJudge = () => {
    if (currentJudge.name.trim() && currentJudge.specialization) {
      const newJudge: Judge = {
        id: Date.now().toString(),
        name: currentJudge.name,
        specialization: currentJudge.specialization,
      };
      setJudges([...judges, newJudge]);
      setCurrentJudge({ name: '', specialization: '' });
    }
  };

  const removeJudge = (id: string) => {
    setJudges(judges.filter(judge => judge.id !== id));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Judges" />
      
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Judge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judgeName">Judge Name *</Label>
              <Input
                id="judgeName"
                placeholder="Enter judge name"
                value={currentJudge.name}
                onChange={(e) => setCurrentJudge({ ...currentJudge, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select 
                value={currentJudge.specialization} 
                onValueChange={(value) => setCurrentJudge({ ...currentJudge, specialization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addJudge} disabled={!currentJudge.name.trim() || !currentJudge.specialization}>
              <Plus className="h-4 w-4 mr-2" />
              Add Judge
            </Button>
          </CardContent>
        </Card>

        {judges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Judges Added ({judges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {judges.map((judge) => (
                  <div key={judge.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                      {getInitials(judge.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{judge.name}</h3>
                      <p className="text-sm text-gray-600">{judge.specialization}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeJudge(judge.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => onNext(judges)} disabled={judges.length === 0}>
            Next: Assign Judges
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
