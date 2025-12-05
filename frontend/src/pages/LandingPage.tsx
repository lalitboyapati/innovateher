import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 66,
    hours: 13,
    minutes: 22,
    seconds: 34,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#3d4f68] text-white">
      {/* Navigation */}
      <nav className="bg-[#e8dcc8] py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="#about" className="text-[#3d4f68] hover:opacity-80 text-sm uppercase tracking-wider transition-opacity">About</a>
            <a href="#tracks" className="text-[#3d4f68] hover:opacity-80 text-sm uppercase tracking-wider transition-opacity">Tracks</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Colorful Background */}
      <div className="relative py-24 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply blur-xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-yellow-300 rounded-full mix-blend-multiply blur-xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white text-[#3d4f68] inline-block px-16 py-12 rounded-2xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-4xl mb-4 italic font-light" style={{ fontFamily: 'Georgia, serif' }}>
              innovate
            </h1>
            <h1 className="text-8xl mb-8" style={{ fontFamily: 'monospace' }}>
              &lt;/HER&gt;
            </h1>
            <div className="text-xl mb-3 uppercase tracking-wide">Starts In:</div>
            <div className="text-5xl font-mono tracking-widest">
              {String(timeLeft.days).padStart(2, '0')} : {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 mt-2 flex justify-around max-w-md mx-auto">
              <span>DAYS</span>
              <span>HOURS</span>
              <span>MINUTES</span>
              <span>SECONDS</span>
            </div>
          </div>
          
          <Button 
            size="lg"
            onClick={() => navigate('/portals')}
            className="bg-[#d4769e] hover:bg-[#c06589] text-white px-10 py-7 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Enter Portal <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl mb-8 uppercase tracking-wide">About Us</h2>
              <div className="space-y-5 text-gray-200 text-lg leading-relaxed">
                <p>
                  We are the inaugural hackathon at Purdue University specifically for and by students 
                  of underrepresented identities in tech.
                </p>
                <p className="text-white">
                  <strong>InnovateHer is a 24-hour event open to all college students.</strong> Our purpose is to foster 
                  a warm, inclusive environment for everyone.
                </p>
                <p>
                  We are committed to inspiring everyone to acknowledge and create solutions for 
                  challenges that underrepresented groups in tech encounter, while highlighting their 
                  extraordinary contributions to the tech field.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 h-40 rounded-2xl shadow-lg flex items-center justify-center">
                <Users className="h-16 w-16 text-white opacity-70" />
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 h-40 rounded-2xl shadow-lg flex items-center justify-center">
                <Trophy className="h-16 w-16 text-white opacity-70" />
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 h-40 rounded-2xl shadow-lg flex items-center justify-center">
                <Calendar className="h-16 w-16 text-white opacity-70" />
              </div>
              <div className="bg-gradient-to-br from-green-400 to-teal-500 h-40 rounded-2xl shadow-lg flex items-center justify-center">
                <ArrowRight className="h-16 w-16 text-white opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 py-12 shadow-2xl">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center px-6">
          <div className="transform hover:scale-110 transition-transform duration-200">
            <div className="text-6xl mb-3">24</div>
            <div className="text-2xl uppercase tracking-wider opacity-90">Hours</div>
          </div>
          <div className="transform hover:scale-110 transition-transform duration-200">
            <div className="text-6xl mb-3">30+</div>
            <div className="text-2xl uppercase tracking-wider opacity-90">Projects</div>
          </div>
          <div className="transform hover:scale-110 transition-transform duration-200">
            <div className="text-6xl mb-3">260+</div>
            <div className="text-2xl uppercase tracking-wider opacity-90">Participants</div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div id="tracks" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl text-center mb-16 uppercase tracking-wide">Tracks</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'AI/ML', color: 'from-purple-500 to-pink-500' },
              { name: 'Web Development', color: 'from-blue-500 to-cyan-500' },
              { name: 'Mobile Apps', color: 'from-green-500 to-teal-500' },
              { name: 'Social Impact', color: 'from-yellow-500 to-orange-500' },
              { name: 'Cybersecurity', color: 'from-red-500 to-pink-500' },
              { name: 'FinTech', color: 'from-indigo-500 to-purple-500' },
              { name: 'HealthTech', color: 'from-teal-500 to-green-500' }
            ].map((track) => (
              <div 
                key={track.name} 
                className={`bg-gradient-to-br ${track.color} p-8 rounded-2xl text-center shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer`}
              >
                <h3 className="text-xl uppercase tracking-wide">{track.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2a3a4f] py-10 mt-20 border-t border-gray-600">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-2xl mb-4 italic" style={{ fontFamily: 'Georgia, serif' }}>
            innovate&lt;/HER&gt;
          </div>
          <p className="text-gray-400">February 7-8, 2026 • Purdue University</p>
          <p className="text-gray-500 text-sm mt-2">Empowering underrepresented identities in tech</p>
        </div>
      </footer>
    </div>
  );
}
