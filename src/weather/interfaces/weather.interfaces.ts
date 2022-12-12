import dayjs from 'dayjs';
import { Coordinates, WeatherInfo } from '@weather/types/weather.types';

export interface IWeatherStrategy {
  retrieveForDate(coordinates: Coordinates, date: dayjs.Dayjs): Promise<WeatherInfo>;
}
