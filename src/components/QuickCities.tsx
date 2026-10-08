import React from 'react';

interface QuickCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const PRESET_CITIES: QuickCity[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 },
  { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006 },
  { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488 },
  { name: 'San Francisco', country: 'United States', latitude: 37.7749, longitude: -122.4194 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8678, longitude: 151.2073 },
  { name: 'Reykjavik', country: 'Iceland', latitude: 64.1355, longitude: -21.8954 },
];

interface QuickCitiesProps {
  currentCityName: string;
  onSelectCity: (city: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
  }) => void;
  isLoading: boolean;
}

export const QuickCities: React.FC<QuickCitiesProps> = ({
  currentCityName,
  onSelectCity,
  isLoading,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
      <span className="text-xs text-slate-400 font-medium shrink-0 mr-1">
        Popular Cities:
      </span>
      {PRESET_CITIES.map((city) => {
        const isActive = currentCityName.toLowerCase() === city.name.toLowerCase();
        return (
          <button
            key={city.name}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 border ${
              isActive
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            } disabled:opacity-50`}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};
