import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, hackathonsAPI } from '../services/api';
import CongratulationsScreen from './CongratulationsScreen';

const AVAILABLE_TRACKS = [
  'Healthcare Innovation',
  'Sustainability',
  'AI & ML',
  'Full Stack',
  'UX Design',
  'Fintech',
  'Education Tech',
  'Social Impact'
];

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hackathonId, setHackathonId] = useState<string | null>(null);
  const [loadingHackathon, setLoadingHackathon] = useState(true);

  useEffect(() => {
    // Fetch active hackathon
    const fetchHackathon = async () => {
      try {
        const hackathon = await hackathonsAPI.getActive();
        if (hackathon && hackathon._id) {
          setHackathonId(hackathon._id);
        }
      } catch (err: any) {
        console.error('Error fetching hackathon:', err);
        // Silently handle error - backend will handle hackathon creation if needed
      } finally {
        setLoadingHackathon(false);
      }
    };

    fetchHackathon();
  }, []);

  const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isOverLimit = wordCount > 150;

  const handleTrackToggle = (track: string) => {
    setSelectedTracks(prev =>
      prev.includes(track)
        ? prev.filter(t => t !== track)
        : [...prev, track]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit || selectedTracks.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Submit project to API (hackathonId is optional - backend will find or create one)
      await projectsAPI.create({
        name: projectName,
        description: description,
        githubUrl: githubLink,
        category: selectedTracks[0], // Primary track
        hackathonId: hackathonId || undefined, // Optional - backend will handle it
        status: 'submitted',
      });

      setSubmitted(true);
      setShowCongratulations(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit project. Please try again.');
      console.error('Error submitting project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCongratulationsComplete = () => {
    // Reset form for new submission
    setProjectName('');
    setDescription('');
    setGithubLink('');
    setSelectedTracks([]);
    setSubmitted(false);
    setShowCongratulations(false);
  };

  if (showCongratulations) {
    return <CongratulationsScreen projectName={projectName} selectedTracks={selectedTracks} onComplete={handleCongratulationsComplete} />;
  }

  if (loadingHackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
        <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#333' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#d4a5a5' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-white mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2.5rem', lineHeight: '1' }}>
          innovate
        </h1>
        <h2 className="text-white" style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '1.75rem', lineHeight: '1', letterSpacing: '0.05em' }}>
          {'</HER>'}
        </h2>
      </div>
      <div className="max-w-3xl mx-auto">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg p-6 mb-6" style={{ border: '3px solid #000' }}>
          <h3 className="mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#333' }}>
            welcome, participant
          </h3>
          <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>
            Submit your hackathon project below
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
            <p style={{ fontFamily: 'Georgia, serif', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {/* Submission Form */}
        {!submitted ? (
          <div className="bg-white rounded-lg p-8 relative" style={{ border: '3px solid #000' }}>
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
            <div className="absolute top-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>

            <h3 className="mb-6" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
              Project Submission
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="projectName" className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter your project name"
                  className="w-full px-4 py-3 rounded-md focus:outline-none transition"
                  style={{ 
                    border: '2px solid #000',
                    fontFamily: 'Georgia, serif'
                  }}
                  required
                />
              </div>

              {/* GitHub Link */}
              <div>
                <label htmlFor="github" className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                  GitHub Repository *
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#666' }} />
                  <input
                    type="url"
                    id="github"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full pl-11 pr-4 py-3 rounded-md focus:outline-none transition"
                    style={{ 
                      border: '2px solid #000',
                      fontFamily: 'Georgia, serif'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Project Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                    Project Description *
                  </label>
                  <span 
                    className="text-sm" 
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      color: isOverLimit ? '#dc2626' : '#666'
                    }}
                  >
                    {wordCount}/150 words
                  </span>
                </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-md focus:outline-none transition resize-none"
                  style={{ 
                    border: isOverLimit ? '2px solid #dc2626' : '2px solid #000',
                    fontFamily: 'Georgia, serif'
                  }}
                  required
                />
                {isOverLimit && (
                  <p className="mt-2" style={{ fontFamily: 'Georgia, serif', color: '#dc2626', fontSize: '0.875rem' }}>
                    Description exceeds 150 word limit
                  </p>
                )}
              </div>

              {/* Track Selection */}
              <div>
                <label className="block mb-3" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                  Select Track(s) * {selectedTracks.length > 0 && `(${selectedTracks.length} selected)`}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_TRACKS.map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => handleTrackToggle(track)}
                      className="px-4 py-3 rounded-md transition hover:opacity-80 text-left"
                      style={{
                        border: '2px solid #000',
                        backgroundColor: selectedTracks.includes(track) ? '#c89999' : 'white',
                        color: selectedTracks.includes(track) ? 'white' : '#333',
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      {track}
                    </button>
                  ))}
                </div>
                {selectedTracks.length === 0 && (
                  <p className="mt-2" style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                    Please select at least one track
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isOverLimit || selectedTracks.length === 0 || loading || !projectName.trim() || !githubLink.trim() || !description.trim()}
                  className="w-full py-3 rounded-md transition hover:opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: '#c89999',
                    color: '#fff',
                    border: '2px solid #000',
                    fontFamily: 'Georgia, serif',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                  }}
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT PROJECT'}
                </button>
                {!loading && (
                  <div className="mt-2 text-sm" style={{ fontFamily: 'Georgia, serif', color: '#666' }}>
                    {isOverLimit && <p>• Description exceeds 150 word limit</p>}
                    {selectedTracks.length === 0 && <p>• Please select at least one track</p>}
                    {!projectName.trim() && <p>• Project name is required</p>}
                    {!githubLink.trim() && <p>• GitHub repository URL is required</p>}
                    {!description.trim() && <p>• Project description is required</p>}
                    {!isOverLimit && selectedTracks.length > 0 && projectName.trim() && githubLink.trim() && description.trim() && (
                      <p style={{ color: '#22c55e' }}>✓ All requirements met - Ready to submit!</p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

