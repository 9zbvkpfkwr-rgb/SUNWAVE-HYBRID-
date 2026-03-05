
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 group ${className}`}>
      <div className="relative w-12 h-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
        {/* Stylized Solar/Wave Icon mimicking the uploaded logo */}
        <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
          {/* Sun Rays - Animating rotation on hover */}
          <g className="transition-all duration-700 group-hover:animate-rotate-slow origin-[35px_30px]">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line 
                key={angle}
                x1="35" y1="30" 
                x2={35 + 25 * Math.cos(angle * Math.PI / 180)} 
                y2={30 + 25 * Math.sin(angle * Math.PI / 180)} 
                stroke="#F37021" strokeWidth="3" strokeLinecap="round"
                className="transition-all duration-500 group-hover:stroke-[#FFCB05]"
              />
            ))}
          </g>

          {/* Sun Core */}
          <circle 
            cx="35" cy="30" r="18" 
            fill="url(#sunGradient)" 
            className="transition-all duration-500 group-hover:r-[20]"
          />

          {/* Waves - Subtle translation on hover */}
          <path 
            d="M10 55C30 45 50 65 90 55" 
            stroke="#00A651" strokeWidth="6" strokeLinecap="round" 
            className="transition-all duration-700 group-hover:translate-x-1"
          />
          <path 
            d="M5 65C25 55 45 75 85 65" 
            stroke="#00AEEF" strokeWidth="6" strokeLinecap="round" 
            className="transition-all duration-700 group-hover:-translate-x-1 delay-75"
          />
          <path 
            d="M0 75C20 65 40 85 80 75" 
            stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" 
            className="transition-all duration-700 group-hover:translate-x-0.5 delay-150"
          />
          
          <defs>
            <linearGradient id="sunGradient" x1="17" y1="12" x2="53" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F37021" />
              <stop offset="1" stopColor="#FFCB05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none transition-transform duration-500 group-hover:translate-x-1">
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            SUNWAVE
          </span>
          <div className="flex items-center gap-1">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-600 to-transparent transition-all duration-500 group-hover:from-brand-orange"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase transition-colors duration-500 group-hover:text-brand-orange">
              HYBRID
            </span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-emerald-600 to-transparent transition-all duration-500 group-hover:from-brand-orange"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
