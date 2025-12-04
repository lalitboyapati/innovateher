import { useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CongratulationsScreenProps {
  projectName: string;
  selectedTracks: string[];
  onComplete: () => void;
}

export default function CongratulationsScreen({ projectName, selectedTracks, onComplete }: CongratulationsScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Create confetti effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Launch confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Launch confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-advance after 4 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-lg p-8 text-center relative" style={{ border: '3px solid #000' }}>
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute top-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>

          <CheckCircle className="w-20 h-20 mx-auto mb-6" style={{ color: '#c89999' }} />
          
          <h3 className="mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#333', fontSize: '2rem' }}>
            project submitted!
          </h3>
          
          <p className="mb-6" style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '1.1rem' }}>
            Your project "{projectName}" has been successfully submitted to {selectedTracks.length} track{selectedTracks.length > 1 ? 's' : ''}.
          </p>
          
          <div className="mb-6 p-4 rounded-md" style={{ backgroundColor: '#f9f9f9', border: '2px solid #e5e5e5' }}>
            <p className="mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
              Selected Tracks:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedTracks.map(track => (
                <span 
                  key={track}
                  className="px-3 py-1 rounded"
                  style={{ 
                    backgroundColor: '#c89999',
                    color: 'white',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.875rem'
                  }}
                >
                  {track}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm" style={{ fontFamily: 'Georgia, serif', color: '#999', fontStyle: 'italic' }}>
            Thank you for participating in InnovateHer!
          </p>
        </div>
      </div>
    </div>
  );
}

