import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { QuickCities } from './components/QuickCities';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherIntelligence } from './components/WeatherIntelligence';
import { Forecast7Day } from './components/Forecast7Day';
import { ErrorMessage } from './components/ErrorMessage';
import { TempUnit, WeatherForecastResponse } from './types/weather';
import { fetchWeatherForecast, OpenMeteoError } from './services/openMeteo';
import { Loader2 } from 'lucide-react';

interface ActiveLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

const DEFAULT_LOCATION: ActiveLocation = {
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5085,
  longitude: -0.1257,
};

export default function App() {
  const [activeLocation, setActiveLocation] = useState<ActiveLocation>(() => {
    try {
      const saved = localStorage.getItem('aether_last_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [forecastData, setForecastData] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    try {
      const saved = localStorage.getItem('aether_temp_unit');
      return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
    } catch {
      return 'celsius';
    }
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load weather for active location
  const loadWeather = useCallback(
    async (loc: ActiveLocation, isManualRefresh = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const data = await fetchWeatherForecast(loc.latitude, loc.longitude, controller.signal);
        setForecastData(data);
        try {
          localStorage.setItem('aether_last_location', JSON.stringify(loc));
        } catch {
          // ignore storage error
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (err instanceof OpenMeteoError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('City not found or network error. Please try again later.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadWeather(activeLocation);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeLocation, loadWeather]);

  const handleSelectCity = (city: ActiveLocation) => {
    setActiveLocation(city);
  };

  const handleToggleUnit = (unit: TempUnit) => {
    setTempUnit(unit);
    try {
      localStorage.setItem('aether_temp_unit', unit);
    } catch {
      // ignore
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLoc: ActiveLocation = {
          name: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setActiveLocation(userLoc);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please select a city using the search bar.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try searching for your city.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        unit={tempUnit}
        onToggleUnit={handleToggleUnit}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Search & City Presets Header */}
        <section className="space-y-3">
          <SearchBar
            onSelectCity={handleSelectCity}
            isLoading={isLoading}
            onError={(msg) => setErrorMessage(msg)}
          />

          <div className="max-w-2xl mx-auto">
            <QuickCities
              currentCityName={activeLocation.name}
              onSelectCity={handleSelectCity}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Global Error Notice if any */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto">
            <ErrorMessage
              message={errorMessage}
              onRetry={() => loadWeather(activeLocation, true)}
              onDismiss={() => setErrorMessage(null)}
            />
          </div>
        )}

        {/* Loading state skeleton */}
        {isLoading && !forecastData ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sky-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Fetching Atmospheric Forecast</h2>
              <p className="text-xs text-slate-400 mt-1">
                Connecting to Open-Meteo telemetry for {activeLocation.name}...
              </p>
            </div>
          </div>
        ) : forecastData ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Primary Current Weather Display */}
            <CurrentWeatherCard
              locationName={activeLocation.name}
              country={activeLocation.country}
              admin1={activeLocation.admin1}
              latitude={forecastData.latitude}
              longitude={forecastData.longitude}
              timezone={forecastData.timezone}
              current={forecastData.current_weather}
              daily={forecastData.daily}
              unit={tempUnit}
              onRefresh={() => loadWeather(activeLocation, true)}
              isRefreshing={isRefreshing}
            />

            {/* Smart Planning Recommendations / Weather Intelligence */}
            <WeatherIntelligence
              current={forecastData.current_weather}
              daily={forecastData.daily}
              unit={tempUnit}
            />

            {/* 7-Day Extended Forecast */}
            <Forecast7Day daily={forecastData.daily} unit={tempUnit} />
          </div>
        ) : null}
      </main>

      {/* Clean Footer adhering to Section 1.B: Quiet copyright and data attribution */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Aether Weather Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Accurate Open-Meteo API Modeling</span>
          </div>
          <div className="text-slate-400">
            Weather data via{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
            >
              Open-Meteo Public API
            </a>{' '}
            (Free & Non-commercial CC BY 4.0)
          </div>
        </div>
      </footer>
    </div>
  );
}
