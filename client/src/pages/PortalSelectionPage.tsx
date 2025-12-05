import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';

export function PortalSelectionPage() {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'participant',
      title: 'Participant',
      icon: 'P',
      symbol: '♦',
      color: 'bg-gradient-to-br from-purple-200 to-pink-200',
      hoverColor: 'hover:shadow-2xl hover:scale-105',
    },
    {
      id: 'judge',
      title: 'Judge',
      icon: 'J',
      symbol: '♥',
      color: 'bg-gradient-to-br from-pink-200 to-rose-200',
      hoverColor: 'hover:shadow-2xl hover:scale-105',
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: 'A',
      symbol: '♣',
      color: 'bg-gradient-to-br from-amber-200 to-orange-200',
      hoverColor: 'hover:shadow-2xl hover:scale-105',
    },
  ];

  const handlePortalClick = (portalId: string) => {
    if (portalId === 'participant') {
      navigate('/auth/participant');
    } else if (portalId === 'judge') {
      navigate('/auth/judge');
    } else if (portalId === 'admin') {
      navigate('/auth/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#3d4f68] flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl md:text-5xl text-center mb-16 text-pink-300 tracking-wide uppercase">
          Ready? Choose Your Mode:
        </h1>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {portals.map((portal) => (
            <button
              key={portal.id}
              onClick={() => handlePortalClick(portal.id)}
              className="group"
            >
              <Card className={`${portal.color} ${portal.hoverColor} transition-all duration-300 p-0 overflow-hidden border-0 cursor-pointer`}>
                <div className="aspect-[3/4] relative p-8 flex flex-col">
                  {/* Top left corner */}
                  <div className="absolute top-4 left-4">
                    <div className="text-3xl">{portal.icon}</div>
                    <div className="text-2xl">{portal.symbol}</div>
                  </div>

                  {/* Center illustration */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-48 h-48 bg-white/30 rounded-full flex items-center justify-center">
                      <div className="text-6xl">👑</div>
                    </div>
                  </div>

                  {/* Bottom right corner (mirrored) */}
                  <div className="absolute bottom-4 right-4 transform rotate-180">
                    <div className="text-3xl">{portal.icon}</div>
                    <div className="text-2xl">{portal.symbol}</div>
                  </div>
                </div>

                {/* Title at bottom */}
                <div className="bg-white/90 py-4 text-center">
                  <h2 className="text-2xl text-[#3d4f68]">{portal.title}</h2>
                </div>
              </Card>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
