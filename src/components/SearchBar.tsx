import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, MapPin, History } from 'lucide-react';
import { GeocodingResult } from '../types/weather';
import { searchCities, OpenMeteoError } from '../services/openMeteo';

interface SearchBarProps {
  onSelectCity: (city: {
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }) => void;
  isLoading: boolean;
  onError: (msg: string | null) => void;
}

interface RecentSearchItem {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, isLoading, onError }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const saved = localStorage.getItem('aether_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query, controller.signal);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const saveRecentSearch = (item: RecentSearchItem) => {
    try {
      const filtered = recentSearches.filter(
        (r) =>
          !(
            r.name.toLowerCase() === item.name.toLowerCase() &&
            Math.abs(r.latitude - item.latitude) < 0.1 &&
            Math.abs(r.longitude - item.longitude) < 0.1
          )
      );
      const updated = [item, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('aether_recent_searches', JSON.stringify(updated));
    } catch {
      // Ignore local storage error
    }
  };

  const handleSelect = (city: {
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }) => {
    onError(null);
    setQuery(`${city.name}${city.country ? `, ${city.country}` : ''}`);
    setIsOpen(false);
    saveRecentSearch(city);
    onSelectCity(city);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    onError(null);
    try {
      const results = await searchCities(trimmed);
      if (results && results.length > 0) {
        const top = results[0];
        handleSelect({
          name: top.name,
          latitude: top.latitude,
          longitude: top.longitude,
          country: top.country,
          admin1: top.admin1,
        });
      } else {
        onError(`City "${trimmed}" not found. Please verify the name or check spelling.`);
      }
    } catch (err: unknown) {
      if (err instanceof OpenMeteoError) {
        onError(err.message);
      } else {
        onError('City not found or network error. Please check spelling or internet connection.');
      }
    } finally {
      setIsSearching(false);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onError(null);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 sm:left-4 text-slate-400 pointer-events-none">
          {isSearching || isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 || recentSearches.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search any global city (e.g. Kyoto, Vancouver, Zurich)..."
          className="w-full pl-11 sm:pl-12 pr-24 py-3.5 sm:py-4 bg-slate-900/90 text-white placeholder-slate-400 text-sm sm:text-base rounded-xl border border-slate-750 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all shadow-lg shadow-black/20"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 sm:right-22 p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-2 sm:right-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg transition-colors shadow-sm"
        >
          Search
        </button>
      </form>

      {/* Dropdown Menu for Autocomplete & Recent */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-40 overflow-hidden divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
          {/* Geocoding matches */}
          {suggestions.length > 0 ? (
            <div className="py-1.5">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider">
                LOCATIONS FOUND
              </div>
              {suggestions.map((loc) => {
                const regionDetails = [loc.admin1, loc.country].filter(Boolean).join(', ');
                return (
                  <button
                    key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                    type="button"
                    onClick={() =>
                      handleSelect({
                        name: loc.name,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        country: loc.country,
                        admin1: loc.admin1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-left hover:bg-slate-800/80 flex items-center justify-between gap-3 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-sky-300 truncate">
                          {loc.name}
                        </div>
                        {regionDetails && (
                          <div className="text-xs text-slate-400 truncate">
                            {regionDetails}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </span>
                  </button>
                );
              })}
            </div>
          ) : query.trim().length >= 2 && !isSearching ? (
            <div className="px-4 py-3 text-xs text-slate-400 text-center">
              No matching locations found for "{query}". Press Enter or try another spelling.
            </div>
          ) : null}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="py-1.5 bg-slate-900/50">
              <div className="px-3.5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 tracking-wider">
                <span>RECENT SEARCHES</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecentSearches([]);
                    localStorage.removeItem('aether_recent_searches');
                  }}
                  className="text-slate-400 hover:text-slate-300 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((item, idx) => (
                <button
                  key={`${item.name}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300 transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">
                    {item.name}
                    {item.country ? ` · ${item.country}` : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
