import { Inject, Injectable } from '@nestjs/common';
import { IWeatherService } from '@weather/interfaces/weather.interfaces';
import { Coordinates, WeatherInfo } from '@weather/types/weather.types';
import dayjs from 'dayjs';
import { WEATHER_PROVIDER } from '@weather/constants/weather.constants';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(@Inject(WEATHER_PROVIDER) private readonly weatherProvider: IWeatherService) {}

  retrieveForDate(coordinates: Coordinates, date: dayjs.Dayjs): Promise<WeatherInfo> {
    return this.weatherProvider.retrieveForDate(coordinates, date);
  }
}
