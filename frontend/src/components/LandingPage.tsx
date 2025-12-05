import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Plus, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  weight: number;
}

interface LandingPageProps {
  onContinue: (tracks: string[], categories: Category[]) => void;
}

export function LandingPage({ onContinue }: LandingPageProps) {
  const [tracks, setTracks] = useState<string[]>(['']);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Innovation', weight: 25 },
    { id: '2', name: 'Technical Implementation', weight: 25 },
    { id: '3', name: 'Design & UX', weight: 25 },
    { id: '4', name: 'Presentation', weight: 25 },
  ]);

  const addTrack = () => {
    setTracks([...tracks, '']);
  };

  const updateTrack = (index: number, value: string) => {
    const newTracks = [...tracks];
    newTracks[index] = value;
    setTracks(newTracks);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    const newId = (Math.max(...categories.map(c => parseInt(c.id)), 0) + 1).toString();
    setCategories([...categories, { id: newId, name: '', weight: 0 }]);
  };

  const updateCategory = (id: string, field: 'name' | 'weight', value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
  const validTracks = tracks.filter(t => t.trim() !== '');
  const validCategories = categories.filter(c => c.name.trim() !== '');
  const isValid = totalWeight === 100 && validTracks.length > 0 && validCategories.length > 0;

  const handleContinue = () => {
    if (isValid) {
      onContinue(validTracks, validCategories);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="InnovateHer Judging Portal" 
        subtitle="February 7-8, 2026 • Purdue University"
      />
      
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tracks</CardTitle>
            <p className="text-sm text-gray-600">
              Add at least one track for the competition
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {tracks.map((track, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Track ${index + 1} (e.g., AI/ML, Web Dev, Social Impact)`}
                  value={track}
                  onChange={(e) => updateTrack(index, e.target.value)}
                  className="flex-1"
                />
                {tracks.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeTrack(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addTrack} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Track
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Judging Categories & Weights</CardTitle>
            <p className="text-sm text-gray-600">
              Total Weight: {totalWeight}% {totalWeight !== 100 && totalWeight > 0 && (
                <span className="text-amber-600">(Should equal 100%)</span>
              )}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <Input
                    placeholder="Category name"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  {categories.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeCategory(category.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Weight</Label>
                    <span className="text-sm">{category.weight}%</span>
                  </div>
                  <Slider
                    value={[category.weight]}
                    onValueChange={(value) => updateCategory(category.id, 'weight', value[0])}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addCategory} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {!isValid && (
            <div className="text-sm text-amber-600 text-right">
              {validTracks.length === 0 && <div>• Please add at least one track</div>}
              {totalWeight !== 100 && <div>• Category weights must total 100%</div>}
              {validCategories.length === 0 && <div>• Please add at least one category</div>}
            </div>
          )}
          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleContinue}
              disabled={!isValid}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
