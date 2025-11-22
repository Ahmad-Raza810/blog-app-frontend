import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ showText = true, className = '' }) => {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 transition-opacity hover:opacity-80 ${className}`}
    >
      <div className="relative">
        {/* Logo icon with gradient background */}
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
          <BookOpen size={24} className="text-white" strokeWidth={2.5} />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-lg bg-primary-400 opacity-20 blur-md"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Blog
          </span>
          <span className="text-sm font-medium text-default-500 -mt-1">
            Platform
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;

