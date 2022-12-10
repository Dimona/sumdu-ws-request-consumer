import { Coordinates, WeatherInfo } from '@weather/types/weather.types';
import dayjs from 'dayjs';

export interface IWeatherStrategy {
  retrieveForDate(coordinates: Coordinates, date: dayjs.Dayjs): Promise<WeatherInfo>;
}
