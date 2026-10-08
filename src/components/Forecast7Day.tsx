import React, { useState } from 'react';
import { DailyForecast, TempUnit } from '../types/weather';
import {
  getWeatherCodeInfo,
  formatTemp,
  formatDayLabel,
  convertTemp,
  isPrecipitationCode,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import { ChevronDown, ChevronUp, Droplets } from 'lucide-react';

interface Forecast7DayProps {
  daily: DailyForecast;
  unit: TempUnit;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({ daily, unit }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(0);

  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate week-wide min and max for proportional range bar
  const weekMaxC = Math.max(...daily.temperature_2m_max);
  const weekMinC = Math.min(...daily.temperature_2m_min);
  const totalDelta = Math.max(1, weekMaxC - weekMinC);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            7-Day Extended Forecast
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Daily trajectory with temperature variance & conditions
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-xl">
        {daily.time.map((isoDate, idx) => {
          const { dayName, formattedDate } = formatDayLabel(isoDate, idx);
          const weatherCode = daily.weathercode[idx] ?? 0;
          const maxTempC = daily.temperature_2m_max[idx] ?? 0;
          const minTempC = daily.temperature_2m_min[idx] ?? 0;
          const codeInfo = getWeatherCodeInfo(weatherCode);
          const hasRain = isPrecipitationCode(weatherCode);
          const isSelected = selectedDayIdx === idx;

          // Percentage bar positioning
          const leftPercent = Math.max(0, Math.min(100, ((minTempC - weekMinC) / totalDelta) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxTempC - minTempC) / totalDelta) * 100));

          return (
            <div
              key={isoDate}
              className={`transition-colors ${
                isSelected ? 'bg-slate-850/70' : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Row Trigger */}
              <button
                type="button"
                onClick={() => setSelectedDayIdx(isSelected ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                aria-expanded={isSelected}
              >
                {/* Day & Date */}
                <div className="w-28 sm:w-36 shrink-0">
                  <div className="text-sm sm:text-base font-semibold text-white">
                    {dayName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formattedDate}
                  </div>
                </div>

                {/* Weather icon & status text */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="shrink-0 p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                    <WeatherIcon name={codeInfo.iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <div className="text-sm font-medium text-slate-200 truncate">
                      {codeInfo.label}
                    </div>
                    {hasRain && (
                      <div className="text-xs text-sky-400 flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>Precipitation forecast</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Temperature bar comparison (hidden on mobile, visible sm+) */}
                <div className="hidden md:flex items-center gap-3 w-44 lg:w-56 shrink-0">
                  <span className="text-xs text-slate-400 font-mono tabular-nums w-10 text-right">
                    {formatTemp(minTempC, unit)}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-200 font-mono tabular-nums w-10 text-left">
                    {formatTemp(maxTempC, unit)}
                  </span>
                </div>

                {/* Mobile / Compact High & Low */}
                <div className="flex md:hidden items-center gap-2 text-right shrink-0">
                  <span className="text-sm font-bold text-white font-mono tabular-nums">
                    {formatTemp(maxTempC, unit)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    / {formatTemp(minTempC, unit)}
                  </span>
                </div>

                {/* Expand indicator */}
                <div className="text-slate-500 pl-1">
                  {isSelected ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Expanded details for selected day */}
              {isSelected && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 bg-slate-900/90 text-xs sm:text-sm text-slate-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-750">
                      <div className="text-slate-400 text-xs">Condition Summary</div>
                      <div className="font-semibold text-white mt-1">{codeInfo.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{codeInfo.description}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-750">
                      <div className="text-slate-400 text-xs">Diurnal Temperature Spread</div>
                      <div className="font-semibold text-white font-mono tabular-nums mt-1">
                        Δ {convertTemp(maxTempC - minTempC, unit)}° difference
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        High: {formatTemp(maxTempC, unit)} · Low: {formatTemp(minTempC, unit)}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-750">
                      <div className="text-slate-400 text-xs">Day Recommendation</div>
                      <div className="font-semibold text-white mt-1">
                        {hasRain
                          ? 'Pack umbrella & rainwear'
                          : maxTempC >= 22
                          ? 'Light clothing recommended'
                          : maxTempC <= 10
                          ? 'Warm jacket required'
                          : 'Comfortable day layers'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {hasRain
                          ? 'Rain or shower patterns anticipated'
                          : 'Ideal conditions for scheduled activities'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
