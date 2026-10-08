import React from 'react';
import { Wind, Compass, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { CurrentWeather, DailyForecast, TempUnit } from '../types/weather';
import { getWeatherCodeInfo, formatTemp, getWindDirection } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  locationName: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast;
  unit: TempUnit;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  locationName,
  country,
  admin1,
  latitude,
  longitude,
  timezone,
  current,
  daily,
  unit,
  onRefresh,
  isRefreshing,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weathercode);
  const todayMax = daily.temperature_2m_max[0] ?? current.temperature;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature;
  const windDirText = getWindDirection(current.winddirection);

  const formattedTime = (() => {
    try {
      const date = new Date();
      return new Intl.DateTimeFormat(undefined, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return '';
    }
  })();

  const locationSubtitle = [admin1, country].filter(Boolean).join(', ');

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Ambient background glow according to condition */}
      <div
        className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
          codeInfo.category === 'clear'
            ? 'bg-amber-400'
            : codeInfo.category === 'rain' || codeInfo.category === 'drizzle'
            ? 'bg-sky-500'
            : codeInfo.category === 'thunderstorm'
            ? 'bg-purple-600'
            : codeInfo.category === 'snow'
            ? 'bg-indigo-300'
            : 'bg-slate-400'
        }`}
      />

      {/* Top row: Location details & refresh button */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {locationName}
          </h1>
          {/* Zero-pill metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs sm:text-sm text-slate-400">
            {locationSubtitle && <span>{locationSubtitle}</span>}
            {locationSubtitle && <span aria-hidden="true">·</span>}
            <span className="font-mono tabular-nums text-slate-400">
              {latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E
            </span>
            {formattedTime && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">Local time {formattedTime}</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh weather data"
          className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </div>

      {/* Main hero display: Large Temperature, Icon & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8 pt-6 border-t border-slate-800/80 relative z-10">
        {/* Left column: Temperature & condition */}
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 shrink-0">
            <WeatherIcon
              name={codeInfo.iconName}
              isDay={current.is_day}
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-mono tabular-nums">
                {formatTemp(current.temperature, unit)}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-semibold text-slate-200 mt-1">
              {codeInfo.label}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-sm">
              {codeInfo.description}
            </div>
          </div>
        </div>

        {/* Right column: Key metrics grid (High/Low, Wind, Day stats) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 sm:p-5">
          {/* Day High */}
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
              Day High
            </div>
            <div className="text-lg sm:text-xl font-semibold text-white font-mono tabular-nums mt-1">
              {formatTemp(todayMax, unit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Peak temperature</div>
          </div>

          {/* Day Low */}
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
              Day Low
            </div>
            <div className="text-lg sm:text-xl font-semibold text-white font-mono tabular-nums mt-1">
              {formatTemp(todayMin, unit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Overnight low</div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              Wind Flow
            </div>
            <div className="text-lg sm:text-xl font-semibold text-white font-mono tabular-nums mt-1">
              {Math.round(current.windspeed)} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>{windDirText} ({current.winddirection}°)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
