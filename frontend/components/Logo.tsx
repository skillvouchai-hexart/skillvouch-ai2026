import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * SkillVouch AI Icon
 * High-fidelity, premium SVG representation of the SkillVouch logo.
 * Adaptive to both light and dark modes with subtle shadows.
 */
export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} filter drop-shadow-md`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>

        <linearGradient id="leftFigGrad" x1="20" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>

        <linearGradient id="rightFigGrad" x1="50" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      <rect width="100" height="100" rx="28" fill="url(#bgGrad)" />

      {/* Figures with handshake detail */}
      <circle cx="32" cy="34" r="10" fill="url(#leftFigGrad)" />
      <path d="M22 50 C22 46 25 44 32 44 C39 44 42 46 42 50 V 80 C42 84 38 86 32 86 C26 86 22 84 22 80 V 50 Z" fill="url(#leftFigGrad)" />
      
      <circle cx="68" cy="34" r="10" fill="url(#rightFigGrad)" />
      <path d="M58 50 C58 46 61 44 68 44 C75 44 78 46 78 50 V 80 C78 84 74 86 68 86 C62 86 58 84 58 80 V 50 Z" fill="url(#rightFigGrad)" />

      {/* Checkmark detailing */}
      <path 
        d="M40 38 L 48 46 L 62 28" 
        stroke="white" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

/**
 * Full SkillVouch AI Branding
 * Includes Icon and Adaptive Typography
 */
export const SkillVouchBrand: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="w-8 h-8" />
      <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-outfit">
        SkillVouch <span className="text-indigo-600 dark:text-indigo-400">AI</span>
      </span>
    </div>
  );
};

/**
 * VConnectU Branding
 * Premium gradient typography matching the shared logo perfectly.
 */
export const VConnectULogo: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center">
        <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 font-outfit">
          VConnectU
        </span>
      </div>
    </div>
  );
};