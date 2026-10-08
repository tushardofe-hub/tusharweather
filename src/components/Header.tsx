import React from 'react';
import { Locate, CloudRain } from 'lucide-react';
import { TempUnit } from '../types/weather';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: (unit: TempUnit) => void;
  onLocateUser: () => void;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onLocateUser,
  isLocating,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <a
            href="/"
            className="text-lg font-semibold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap"
          >
            Aether Weather
          </a>
        </div>

        {/* Zone 2: Navigation / quiet links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Open-Meteo Public API
          </span>
        </div>

        {/* Zone 3: 1-2 primary actions (Unit Toggle & Geolocation) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Temperature unit switch */}
          <div
            role="group"
            aria-label="Temperature unit selector"
            className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5"
          >
            <button
              type="button"
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                unit === 'celsius'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                unit === 'fahrenheit'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Current Location button */}
          <button
            type="button"
            onClick={onLocateUser}
            disabled={isLocating}
            title="Use current geolocation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Locate className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
