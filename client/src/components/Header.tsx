import { Award } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-8 w-8" />
          <h1>{title}</h1>
        </div>
        {subtitle && (
          <p className="opacity-90 ml-11">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
