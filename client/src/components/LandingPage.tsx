import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lightbulb, Briefcase, Crown } from 'lucide-react';

interface LandingPageProps {
  onRoleSelect?: (role: string) => void;
}

// Queen playing card icon component
const QueenIcon = () => (
  <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crown */}
    <path d="M40 20 L45 30 L50 20 L55 30 L60 15 L65 30 L70 20 L75 30 L80 20 L80 35 L40 35 Z" fill="#c89999" stroke="#000" strokeWidth="2"/>
    {/* Head */}
    <circle cx="60" cy="50" r="20" fill="white" stroke="#000" strokeWidth="3"/>
    {/* Hair */}
    <path d="M42 45 Q40 35 50 32 Q55 30 60 30 Q65 30 70 32 Q80 35 78 45" fill="#000" stroke="#000" strokeWidth="2"/>
    {/* Body/Dress */}
    <path d="M60 70 L40 75 L35 95 L35 120 L42 140 L78 140 L85 120 L85 95 L80 75 Z" fill="white" stroke="#000" strokeWidth="3"/>
    {/* Dress Details */}
    <path d="M50 85 L50 130" stroke="#c89999" strokeWidth="2"/>
    <path d="M60 85 L60 130" stroke="#c89999" strokeWidth="2"/>
    <path d="M70 85 L70 130" stroke="#c89999" strokeWidth="2"/>
    {/* Arms */}
    <path d="M40 75 L25 90 L28 95 L43 85" fill="white" stroke="#000" strokeWidth="3"/>
    <path d="M80 75 L95 90 L92 95 L77 85" fill="white" stroke="#000" strokeWidth="3"/>
    {/* Flower in hand */}
    <circle cx="23" cy="90" r="5" fill="#c89999" stroke="#000" strokeWidth="2"/>
    <circle cx="97" cy="90" r="5" fill="#c89999" stroke="#000" strokeWidth="2"/>
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    if (onRoleSelect) {
      onRoleSelect(role);
    } else {
      navigate(`/login?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-white mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '4rem', lineHeight: '1' }}>
          innovate
        </h1>
        <h2 className="text-white mb-8" style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '3rem', lineHeight: '1', letterSpacing: '0.05em' }}>
          {'</HER>'}
        </h2>
        <p className="text-white" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem' }}>
          are you ready?
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Participant Card */}
        <div 
          className="bg-white rounded-lg p-8 relative flex flex-col items-center cursor-pointer transition hover:scale-105" 
          style={{ border: '4px solid #000', minHeight: '400px' }}
          onClick={() => handleRoleSelect('participant')}
        >
          {/* Corner Icons */}
          <Briefcase className="absolute top-4 left-4 w-8 h-8" style={{ color: '#c89999' }} />
          <Briefcase className="absolute top-4 right-4 w-8 h-8" style={{ color: '#c89999' }} />
          <Briefcase className="absolute bottom-16 left-4 w-8 h-8" style={{ color: '#c89999' }} />
          <Briefcase className="absolute bottom-16 right-4 w-8 h-8" style={{ color: '#c89999' }} />
          
          {/* Crown */}
          <div className="mt-8 mb-6">
            <Crown className="w-12 h-12" style={{ color: '#c89999' }} />
          </div>

          {/* Queen Icon */}
          <div className="flex-1 flex items-center justify-center">
            <QueenIcon />
          </div>

          {/* Label */}
          <h3 className="mt-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
            Participant
          </h3>
        </div>

        {/* Judge Card */}
        <div 
          className="bg-white rounded-lg p-8 relative flex flex-col items-center cursor-pointer transition hover:scale-105" 
          style={{ border: '4px solid #000', minHeight: '400px' }}
          onClick={() => handleRoleSelect('judge')}
        >
          {/* Corner Icons */}
          <Heart className="absolute top-4 left-4 w-8 h-8" style={{ color: '#c89999', fill: '#c89999' }} />
          <Heart className="absolute top-4 right-4 w-8 h-8" style={{ color: '#c89999', fill: '#c89999' }} />
          <Heart className="absolute bottom-16 left-4 w-8 h-8" style={{ color: '#c89999', fill: '#c89999' }} />
          <Heart className="absolute bottom-16 right-4 w-8 h-8" style={{ color: '#c89999', fill: '#c89999' }} />
          
          {/* Crown */}
          <div className="mt-8 mb-6">
            <Crown className="w-12 h-12" style={{ color: '#c89999' }} />
          </div>

          {/* Queen Icon */}
          <div className="flex-1 flex items-center justify-center">
            <QueenIcon />
          </div>

          {/* Label */}
          <h3 className="mt-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
            Judge
          </h3>
        </div>

        {/* Admin Card */}
        <div 
          className="bg-white rounded-lg p-8 relative flex flex-col items-center cursor-pointer transition hover:scale-105" 
          style={{ border: '4px solid #000', minHeight: '400px' }}
          onClick={() => handleRoleSelect('admin')}
        >
          {/* Corner Icons */}
          <Lightbulb className="absolute top-4 left-4 w-8 h-8" style={{ color: '#c89999' }} />
          <Lightbulb className="absolute top-4 right-4 w-8 h-8" style={{ color: '#c89999' }} />
          <Lightbulb className="absolute bottom-16 left-4 w-8 h-8" style={{ color: '#c89999' }} />
          <Lightbulb className="absolute bottom-16 right-4 w-8 h-8" style={{ color: '#c89999' }} />
          
          {/* Crown */}
          <div className="mt-8 mb-6">
            <Crown className="w-12 h-12" style={{ color: '#c89999' }} />
          </div>

          {/* Queen Icon */}
          <div className="flex-1 flex items-center justify-center">
            <QueenIcon />
          </div>

          {/* Label */}
          <h3 className="mt-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
            Admin
          </h3>
        </div>
      </div>
    </div>
  );
};
