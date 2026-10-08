import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
  isDay?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, isDay = 1, className = '', ...props }) => {
  switch (name) {
    case 'Sun':
    case 'SunMedium':
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`text-sky-300 ${className}`} {...props} />;
    case 'Cloud':
      return <Cloud className={`text-slate-300 ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`text-slate-400 ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`text-teal-400 ${className}`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`text-sky-400 ${className}`} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={`text-indigo-200 ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`text-yellow-400 ${className}`} {...props} />;
    default:
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
  }
};
