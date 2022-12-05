import { Coordinates } from '@weather/types/weather.types';
import dayjs from 'dayjs';

export interface IWeatherService {
  retrieveForDate(coordinates: Coordinates, date: dayjs.Dayjs): any;
}
