import { WeatherCodeInfo, PlanningInsight, TempUnit, DailyForecast, CurrentWeather } from '../types/weather';

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: 'Cloudless and bright skies with clear visibility',
        category: 'clear',
        iconName: 'Sun',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly sunny with scattered faint clouds',
        category: 'clear',
        iconName: 'SunMedium',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Mixture of sun and developing cloud cover',
        category: 'partly_cloudy',
        iconName: 'CloudSun',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense cloud cover spanning the sky',
        category: 'cloudy',
        iconName: 'Cloud',
      };
    case 45:
      return {
        label: 'Foggy',
        description: 'Reduced horizontal visibility due to surface fog',
        category: 'fog',
        iconName: 'CloudFog',
      };
    case 48:
      return {
        label: 'Depositing Rime Fog',
        description: 'Icy fog forming rime deposits on exposed surfaces',
        category: 'fog',
        iconName: 'CloudFog',
      };
    case 51:
      return {
        label: 'Light Drizzle',
        description: 'Very light, gentle precipitation droplets',
        category: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 53:
      return {
        label: 'Moderate Drizzle',
        description: 'Steady mist and drizzle with damp surfaces',
        category: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 55:
      return {
        label: 'Dense Drizzle',
        description: 'Thick drizzle significantly reducing visibility',
        category: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 56:
      return {
        label: 'Light Freezing Drizzle',
        description: 'Cold drizzle creating risk of surface icing',
        category: 'drizzle',
        iconName: 'CloudSnow',
      };
    case 57:
      return {
        label: 'Dense Freezing Drizzle',
        description: 'Dense sub-zero drizzle accumulating on roadways',
        category: 'drizzle',
        iconName: 'CloudSnow',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Intermittent light raindrops falling',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Continuous moderate rainfall',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Substantial downpour and rapid puddling',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 66:
      return {
        label: 'Light Freezing Rain',
        description: 'Supercooled liquid droplets freezing on impact',
        category: 'rain',
        iconName: 'CloudSnow',
      };
    case 67:
      return {
        label: 'Heavy Freezing Rain',
        description: 'Severe freezing rain with hazardous road ice',
        category: 'rain',
        iconName: 'CloudSnow',
      };
    case 71:
      return {
        label: 'Slight Snow Fall',
        description: 'Light snowflakes falling gracefully',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 73:
      return {
        label: 'Moderate Snow Fall',
        description: 'Steady snowfall with noticeable accumulation',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 75:
      return {
        label: 'Heavy Snow Fall',
        description: 'Dense heavy snow reducing visibility significantly',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Opaque ice pellets falling without shattering',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 80:
      return {
        label: 'Slight Rain Showers',
        description: 'Brief localized light showers',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 81:
      return {
        label: 'Moderate Rain Showers',
        description: 'Passing shower cells with gusty pulses',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 82:
      return {
        label: 'Violent Rain Showers',
        description: 'Torrential shower bursts with sudden pooling',
        category: 'rain',
        iconName: 'CloudLightning',
      };
    case 85:
      return {
        label: 'Slight Snow Showers',
        description: 'Scattered brief snow squalls',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 86:
      return {
        label: 'Heavy Snow Showers',
        description: 'Intense snow showers with gusting winds',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Electrical storm with thunder and lightning activity',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    case 96:
      return {
        label: 'Thunderstorm with Slight Hail',
        description: 'Thunderstorm producing small hail and squally winds',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    case 99:
      return {
        label: 'Thunderstorm with Heavy Hail',
        description: 'Severe electrical storm with damaging hail stones',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    default:
      return {
        label: 'Variable Conditions',
        description: 'Atmospheric conditions fluctuating',
        category: 'cloudy',
        iconName: 'Cloud',
      };
  }
}

export function convertTemp(celsius: number, unit: TempUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  const value = convertTemp(celsius, unit);
  return `${value}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

export function isPrecipitationCode(code: number): boolean {
  // codes 51 to 99 are drizzle, rain, snow, showers, thunderstorms
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 99);
}

export function isSnowCode(code: number): boolean {
  return (code >= 71 && code <= 77) || code === 85 || code === 86;
}

export function formatDayLabel(isoDate: string, index: number): { dayName: string; formattedDate: string } {
  try {
    const date = new Date(isoDate + 'T00:00:00');
    if (index === 0) {
      return {
        dayName: 'Today',
        formattedDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    }
    if (index === 1) {
      return {
        dayName: 'Tomorrow',
        formattedDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    }
    return {
      dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
      formattedDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };
  } catch {
    return { dayName: `Day ${index + 1}`, formattedDate: isoDate };
  }
}

export function generatePlanningInsights(
  current: CurrentWeather,
  daily: DailyForecast,
  unit: TempUnit
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const currentTempC = current.temperature;
  const currentCode = current.weathercode;
  const todayCode = daily.weathercode[0] ?? currentCode;
  const todayMaxC = daily.temperature_2m_max[0] ?? currentTempC;
  const todayMinC = daily.temperature_2m_min[0] ?? currentTempC;
  const windKmH = current.windspeed;

  // 1. Umbrella & Precipitation Alert
  const hasRainToday = isPrecipitationCode(currentCode) || isPrecipitationCode(todayCode);
  const hasSnowToday = isSnowCode(currentCode) || isSnowCode(todayCode);

  if (hasSnowToday) {
    insights.push({
      id: 'umbrella',
      title: 'Snow & Thermal Gear Needed',
      subtitle: 'Snowfall expected today',
      description: 'Wear waterproof insulated winter footwear and a hooded winter coat. Clear walkways before freeze-up.',
      level: 'caution',
      category: 'umbrella',
    });
  } else if (hasRainToday) {
    insights.push({
      id: 'umbrella',
      title: 'Umbrella Essential Today',
      subtitle: 'Precipitation in forecast',
      description: 'Active rain or showers detected. Keep a portable umbrella handy and wear water-resistant shoes.',
      level: 'warning',
      category: 'umbrella',
    });
  } else {
    insights.push({
      id: 'umbrella',
      title: 'Clear Skies & Dry Pavements',
      subtitle: 'No precipitation expected',
      description: 'No umbrella required today. Great conditions for outdoor travel without wet weather gear.',
      level: 'success',
      category: 'umbrella',
    });
  }

  // 2. Clothing & Wardrobe Tips
  if (todayMaxC >= 28) {
    insights.push({
      id: 'clothing',
      title: 'Lightweight & Breathable Fabrics',
      subtitle: `High of ${formatTemp(todayMaxC, unit)}`,
      description: 'Opt for loose cotton or linen wear. Consider UV sunglasses and stay consistently hydrated.',
      level: 'info',
      category: 'clothing',
    });
  } else if (todayMaxC >= 20) {
    insights.push({
      id: 'clothing',
      title: 'Pleasantly Warm Dressing',
      subtitle: `Comfortable peak at ${formatTemp(todayMaxC, unit)}`,
      description: 'Short sleeves or light casual shirts are ideal. Keep a light top layer if out late.',
      level: 'success',
      category: 'clothing',
    });
  } else if (todayMaxC >= 14) {
    insights.push({
      id: 'clothing',
      title: 'Mild Layering Recommended',
      subtitle: `Range ${formatTemp(todayMinC, unit)} to ${formatTemp(todayMaxC, unit)}`,
      description: 'A light sweater, jacket, or denim overshirt will keep you comfortable across morning and evening swings.',
      level: 'info',
      category: 'clothing',
    });
  } else if (todayMaxC >= 6) {
    insights.push({
      id: 'clothing',
      title: 'Cool Weather Layers',
      subtitle: `Crisp high of ${formatTemp(todayMaxC, unit)}`,
      description: 'Wear an insulated medium jacket, cozy knitwear, and long trousers to stay comfortable outdoors.',
      level: 'info',
      category: 'clothing',
    });
  } else {
    insights.push({
      id: 'clothing',
      title: 'Heavy Winter Insulation',
      subtitle: `Freezing chill (${formatTemp(todayMaxC, unit)} max)`,
      description: 'Thermal undergarments, heavy overcoat, wool beanie, and gloves are recommended to retain core warmth.',
      level: 'caution',
      category: 'clothing',
    });
  }

  // 3. Commute & Outdoor Activities
  if (currentCode >= 95) {
    insights.push({
      id: 'commute',
      title: 'Thunderstorm Advisory',
      subtitle: 'Lightning and heavy downpours',
      description: 'Delay non-essential outdoor trips during storm peaks. Exercise caution on highways with reduced visibility.',
      level: 'warning',
      category: 'commute',
    });
  } else if (windKmH > 35) {
    insights.push({
      id: 'commute',
      title: 'Breezy & Gusty Winds',
      subtitle: `Winds clocked at ${Math.round(windKmH)} km/h`,
      description: 'Cycling against headwinds will require extra exertion. Secure lightweight balcony or patio furniture.',
      level: 'caution',
      category: 'commute',
    });
  } else if (currentCode === 45 || currentCode === 48) {
    insights.push({
      id: 'commute',
      title: 'Reduced Road Visibility',
      subtitle: 'Morning fog density',
      description: 'Use low-beam headlights and maintain safe braking distances when driving or cycling.',
      level: 'caution',
      category: 'commute',
    });
  } else if (!hasRainToday && !hasSnowToday && todayMaxC >= 15 && todayMaxC <= 26) {
    insights.push({
      id: 'commute',
      title: 'Prime Outdoor Conditions',
      subtitle: 'Optimal running & cycling window',
      description: 'Superb weather for a morning run, brisk walk, outdoor dining, or commuting by bicycle.',
      level: 'success',
      category: 'activity',
    });
  } else {
    insights.push({
      id: 'commute',
      title: 'Standard Commute Routine',
      subtitle: `Winds gentle at ${Math.round(windKmH)} km/h`,
      description: 'Roads and transit routes are running under standard conditions without weather-induced delays.',
      level: 'info',
      category: 'commute',
    });
  }

  // 4. Sun & Sunlight / UV
  if (currentCode === 0 || currentCode === 1) {
    insights.push({
      id: 'sun',
      title: 'Direct Sunlight Exposure',
      subtitle: 'Unobstructed solar rays',
      description: 'Extended midday outdoor stays warrant UV protection (sunglasses or SPF 30 sunscreen).',
      level: 'info',
      category: 'sun',
    });
  }

  return insights;
}

export function getWeekOverview(daily: DailyForecast, unit: TempUnit) {
  if (!daily.time || daily.time.length === 0) return null;

  let maxTemp = -Infinity;
  let minTemp = Infinity;
  let maxDayIdx = 0;
  let minDayIdx = 0;
  let rainyDaysCount = 0;

  daily.temperature_2m_max.forEach((max, idx) => {
    if (max > maxTemp) {
      maxTemp = max;
      maxDayIdx = idx;
    }
  });

  daily.temperature_2m_min.forEach((min, idx) => {
    if (min < minTemp) {
      minTemp = min;
      minDayIdx = idx;
    }
  });

  daily.weathercode.forEach((code) => {
    if (isPrecipitationCode(code)) {
      rainyDaysCount++;
    }
  });

  const warmestDay = formatDayLabel(daily.time[maxDayIdx], maxDayIdx);
  const coolestDay = formatDayLabel(daily.time[minDayIdx], minDayIdx);

  return {
    maxTemp: formatTemp(maxTemp, unit),
    warmestDayName: warmestDay.dayName,
    minTemp: formatTemp(minTemp, unit),
    coolestDayName: coolestDay.dayName,
    rainyDaysCount,
    totalDays: daily.time.length,
    overallRangeC: { min: minTemp, max: maxTemp },
  };
}
