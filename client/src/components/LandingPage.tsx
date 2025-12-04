import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onRoleSelect?: (role: string) => void;
}

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
    <div className="min-h-screen" style={{ backgroundColor: '#D4A5A5' }}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Logo Section - Centered */}
        <div className="text-center mb-16">
          <div className="mb-12">
            <h1 className="text-7xl md:text-9xl font-serif italic text-white mb-3 leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400 }}>
              innovate
            </h1>
            <h2 className="text-7xl md:text-9xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              {'</HER>'}
            </h2>
          </div>
          
          {/* "Are you ready?" text */}
          <p className="text-4xl md:text-5xl font-light text-white mt-12 italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 300 }}>
            are you ready?
          </p>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-16">
          {/* Participant Card - Queen of Diamonds */}
          <div 
            className="relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => handleRoleSelect('participant')}
          >
            <div className="bg-white rounded-lg shadow-2xl w-72 h-[500px] flex flex-col border-4 border-black relative overflow-hidden">
              {/* Top Left Corner - Diamond */}
              <div className="absolute top-3 left-3 text-3xl font-bold" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div className="absolute top-2 left-2 text-xl font-bold" style={{ color: '#D4A5A5' }}>Q</div>
              
              {/* Top Right Corner - Diamond */}
              <div className="absolute top-3 right-3 text-3xl font-bold" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              
              {/* Bottom Left Corner - Diamond (upside down) */}
              <div className="absolute bottom-3 left-3 text-3xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div className="absolute bottom-2 left-2 text-xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>Q</div>
              
              {/* Bottom Right Corner - Diamond (upside down) */}
              <div className="absolute bottom-3 right-3 text-3xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              
              {/* Queen Figure - Centered */}
              <div className="flex-1 flex items-center justify-center mt-6 mb-6">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Queen silhouette with crown */}
                  <div className="text-center relative" style={{ width: '180px', height: '280px' }}>
                    {/* Crown */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                      <svg className="w-20 h-20" style={{ color: '#D4A5A5' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 2c0 1.11-.89 2-2 2H7c-1.11 0-2-.89-2-2v-1h14v1z"/>
                      </svg>
                    </div>
                    {/* Head/face circle */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-black flex items-center justify-center" style={{ backgroundColor: '#D4A5A5', zIndex: 5 }}>
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-black"></div>
                    </div>
                    {/* Body/Dress - flowing queen dress */}
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-36 h-48 rounded-t-full border-4 border-black" style={{ backgroundColor: '#D4A5A5', zIndex: 3 }}>
                      <div className="w-full h-full rounded-t-full bg-white border-2 border-black mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Participant</h2>
              </div>
            </div>
          </div>

          {/* Judge Card - Queen of Hearts */}
          <div 
            className="relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => handleRoleSelect('judge')}
          >
            <div className="bg-white rounded-lg shadow-2xl w-72 h-[500px] flex flex-col border-4 border-black relative overflow-hidden">
              {/* Top Left Corner - Heart */}
              <div className="absolute top-3 left-3 text-3xl font-bold" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="absolute top-2 left-2 text-xl font-bold" style={{ color: '#D4A5A5' }}>Q</div>
              
              {/* Top Right Corner - Heart */}
              <div className="absolute top-3 right-3 text-3xl font-bold" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              
              {/* Bottom Left Corner - Heart (upside down) */}
              <div className="absolute bottom-3 left-3 text-3xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="absolute bottom-2 left-2 text-xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>Q</div>
              
              {/* Bottom Right Corner - Heart (upside down) */}
              <div className="absolute bottom-3 right-3 text-3xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              
              {/* Queen Figure - Centered */}
              <div className="flex-1 flex items-center justify-center mt-6 mb-6">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Queen silhouette with crown */}
                  <div className="text-center relative" style={{ width: '180px', height: '280px' }}>
                    {/* Crown */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                      <svg className="w-20 h-20" style={{ color: '#D4A5A5' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 2c0 1.11-.89 2-2 2H7c-1.11 0-2-.89-2-2v-1h14v1z"/>
                      </svg>
                    </div>
                    {/* Head/face circle */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-black flex items-center justify-center" style={{ backgroundColor: '#D4A5A5', zIndex: 5 }}>
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-black"></div>
                    </div>
                    {/* Body/Dress - flowing queen dress */}
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-36 h-48 rounded-t-full border-4 border-black" style={{ backgroundColor: '#D4A5A5', zIndex: 3 }}>
                      <div className="w-full h-full rounded-t-full bg-white border-2 border-black mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Judge</h2>
              </div>
            </div>
          </div>

          {/* Admin Card - Queen of Spades */}
          <div 
            className="relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="bg-white rounded-lg shadow-2xl w-72 h-[500px] flex flex-col border-4 border-black relative overflow-hidden">
              {/* Top Left Corner - Spade */}
              <div className="absolute top-3 left-3 text-3xl font-bold" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8 2 5 5 5 9c0 4 3.5 7.5 7 10.5 3.5-3 7-6.5 7-10.5 0-4-3-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.88-2.88 5.69-5 7.88C9.88 16.69 7 13.88 7 11c0-2.76 2.24-5 5-5z"/>
                  <path d="M12 20v-3"/>
                </svg>
              </div>
              <div className="absolute top-2 left-2 text-xl font-bold" style={{ color: '#D4A5A5' }}>Q</div>
              
              {/* Top Right Corner - Spade */}
              <div className="absolute top-3 right-3 text-3xl font-bold" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8 2 5 5 5 9c0 4 3.5 7.5 7 10.5 3.5-3 7-6.5 7-10.5 0-4-3-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.88-2.88 5.69-5 7.88C9.88 16.69 7 13.88 7 11c0-2.76 2.24-5 5-5z"/>
                  <path d="M12 20v-3"/>
                </svg>
              </div>
              
              {/* Bottom Left Corner - Spade (upside down) */}
              <div className="absolute bottom-3 left-3 text-3xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8 2 5 5 5 9c0 4 3.5 7.5 7 10.5 3.5-3 7-6.5 7-10.5 0-4-3-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.88-2.88 5.69-5 7.88C9.88 16.69 7 13.88 7 11c0-2.76 2.24-5 5-5z"/>
                  <path d="M12 20v-3"/>
                </svg>
              </div>
              <div className="absolute bottom-2 left-2 text-xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>Q</div>
              
              {/* Bottom Right Corner - Spade (upside down) */}
              <div className="absolute bottom-3 right-3 text-3xl font-bold rotate-180" style={{ color: '#D4A5A5' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8 2 5 5 5 9c0 4 3.5 7.5 7 10.5 3.5-3 7-6.5 7-10.5 0-4-3-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.88-2.88 5.69-5 7.88C9.88 16.69 7 13.88 7 11c0-2.76 2.24-5 5-5z"/>
                  <path d="M12 20v-3"/>
                </svg>
              </div>
              
              {/* Queen Figure - Centered */}
              <div className="flex-1 flex items-center justify-center mt-6 mb-6">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Queen silhouette with crown */}
                  <div className="text-center relative" style={{ width: '180px', height: '280px' }}>
                    {/* Crown */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                      <svg className="w-20 h-20" style={{ color: '#D4A5A5' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 2c0 1.11-.89 2-2 2H7c-1.11 0-2-.89-2-2v-1h14v1z"/>
                      </svg>
                    </div>
                    {/* Head/face circle */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-black flex items-center justify-center" style={{ backgroundColor: '#D4A5A5', zIndex: 5 }}>
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-black"></div>
                    </div>
                    {/* Body/Dress - flowing queen dress */}
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-36 h-48 rounded-t-full border-4 border-black" style={{ backgroundColor: '#D4A5A5', zIndex: 3 }}>
                      <div className="w-full h-full rounded-t-full bg-white border-2 border-black mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Admin</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
