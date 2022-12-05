import { registerAs } from '@nestjs/config';
import { METEOMATICS_CONFIG } from '@weather/strategies/meteomatics/constants/meteomatics.constants';
import { MeteomaticsConfig, MeteomaticsRequestAttrs } from '@weather/strategies/meteomatics/types/meteomatics.types';
import { TemperatureUnit } from '@weather/strategies/meteomatics/enums/meteomatics.enums';

export const meteomaticsConfig = registerAs(
  METEOMATICS_CONFIG,
  (): MeteomaticsConfig => ({
    domain: 'api.meteomatics.com',
    protocol: 'https',
    user: process.env.METEOMATICS_USER,
    password: process.env.METEOMATICS_PASSWORD,
  }),
);

export const meteomaticsRequestAttrs: MeteomaticsRequestAttrs = Object.freeze({
  temperature: {
    build: ({ unit }: { unit: TemperatureUnit }): string => `t_2m:${unit}`,
    description:
      'Instantaneous temperature at 2m above ground in degrees Celsius (C), kelvin (K) or degree Fahrenheit (F)',
  },
  windSpeed: {
    build: (): string => `wind_speed_10m:ms`,
    description: 'Instantaneous wind speed at 10m above ground',
  },
  windDirection: {
    build: (): string => `wind_dir_10m:d`,
    description: 'Instantaneous wind direction at 10m above ground in degrees\n',
  },
  precipitation: {
    build: (): string => 'precip_24h:mm',
    description:
      'Precipitation accumulated over the past 24 hours in millimeter (equivalent to litres per square meter)',
  },
  weatherSymbol: {
    build: (): string => 'weather_symbol_24h:idx',
    description: 'Weather symbol giving an overall impression of the weather state of the past 24 hours.',
  },
  sunrise: {
    build: (): string => 'sunrise:sql',
    description: 'Sunrise',
  },
  sunset: {
    build: (): string => 'sunset:sql',
    description: 'Sunset',
  },
});

export const meteomaticsWeatherSymbols = Object.freeze([
  'https://static.meteomatics.com/widgeticons/wsymbol_0999_unknown.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0001_sunny.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0002_sunny_intervals.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0043_mostly_cloudy.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0003_white_cloud.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0018_cloudy_with_heavy_rain.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0021_cloudy_with_sleet.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0020_cloudy_with_heavy_snow.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0009_light_rain_showers.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0011_light_snow_showers.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0013_sleet_showers.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0006_mist.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0007_fog.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0050_freezing_rain.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0024_thunderstorms.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0048_drizzle.png',
  'https://static.meteomatics.com/widgeticons/wsymbol_0056_dust_sand.png',
]);
