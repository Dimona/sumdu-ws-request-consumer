import dayjs from 'dayjs';
import { Inject, Injectable } from '@nestjs/common';
import { IWeatherStrategy } from '@weather/interfaces/weather.interfaces';
import { Coordinates, WeatherInfo } from '@weather/types/weather.types';
import { WEATHER_STRATEGY } from '@weather/constants/weather.constants';

@Injectable()
export class WeatherService implements IWeatherStrategy {
  constructor(@Inject(WEATHER_STRATEGY) private readonly weatherStrategy: IWeatherStrategy) {}

  retrieveForDate(coordinates: Coordinates, date: dayjs.Dayjs): Promise<WeatherInfo> {
    return this.weatherStrategy.retrieveForDate(coordinates, date);
  }
}
