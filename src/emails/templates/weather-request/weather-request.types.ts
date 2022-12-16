import { WeatherFieldData } from '@weather/types/weather.types';

export type WeatherRequest = {
  name: string;
  date: string;
  latitude: string;
  longitude: string;
  weatherIcon: string;
  temperature: WeatherFieldData;
  windSpeed: WeatherFieldData;
  windDirection: WeatherFieldData;
};

export enum DiffClass {
  up = 'up',
  down = 'down',
}
