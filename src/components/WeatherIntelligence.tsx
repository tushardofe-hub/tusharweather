import React from 'react';
import {
  Umbrella,
  Shirt,
  Footprints,
  Sun,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CurrentWeather, DailyForecast, TempUnit } from '../types/weather';
import { generatePlanningInsights, getWeekOverview } from '../utils/weatherUtils';

interface WeatherIntelligenceProps {
  current: CurrentWeather;
  daily: DailyForecast;
  unit: TempUnit;
}

export const WeatherIntelligence: React.FC<WeatherIntelligenceProps> = ({
  current,
  daily,
  unit,
}) => {
  const insights = generatePlanningInsights(current, daily, unit);
  const weekOverview = getWeekOverview(daily, unit);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'umbrella':
        return <Umbrella className="w-5 h-5 text-sky-400" />;
      case 'clothing':
        return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'activity':
      case 'commute':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  const getStatusBadge = (level: string) => {
    switch (level) {
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          colorText: 'text-rose-400',
          border: 'border-rose-500/30',
          bg: 'bg-rose-950/20',
        };
      case 'caution':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          colorText: 'text-amber-400',
          border: 'border-amber-500/30',
          bg: 'bg-amber-950/20',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          colorText: 'text-emerald-400',
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20',
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-sky-400" />,
          colorText: 'text-sky-400',
          border: 'border-sky-500/30',
          bg: 'bg-sky-950/20',
        };
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Planning & Advisory Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time actionable recommendations for gear, wardrobe, and commute
          </p>
        </div>
      </div>

      {/* Grid of smart planning cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const statusStyle = getStatusBadge(insight.level);
          return (
            <div
              key={insight.id + insight.title}
              className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0">
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border ${statusStyle.border} ${statusStyle.bg} ${statusStyle.colorText}`}
                  >
                    {statusStyle.icon}
                    <span>{insight.subtitle}</span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white tracking-tight">
                  {insight.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Weekly Planning Synthesis Card */}
        {weekOverview && (
          <div className="rounded-xl bg-gradient-to-br from-slate-900/90 to-sky-950/30 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-sky-900/40 border border-sky-800/50 shrink-0">
                  <CalendarCheck className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-xs font-mono tabular-nums text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded-md">
                  7-Day Outlook
                </div>
              </div>

              <h3 className="text-base font-semibold text-white tracking-tight">
                Weekly Planning Synthesis
              </h3>

              <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Warmest window:</span>
                  <span className="font-semibold text-white font-mono tabular-nums">
                    {weekOverview.warmestDayName} ({weekOverview.maxTemp})
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Coolest trough:</span>
                  <span className="font-semibold text-white font-mono tabular-nums">
                    {weekOverview.coolestDayName} ({weekOverview.minTemp})
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Precipitation days:</span>
                  <span className="font-semibold text-sky-300 font-mono tabular-nums">
                    {weekOverview.rainyDaysCount} of {weekOverview.totalDays} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
