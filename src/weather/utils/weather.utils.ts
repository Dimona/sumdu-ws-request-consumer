import { WeatherFieldData, WeatherInfo } from '@weather/types/weather.types';
import { DiffClass } from '@emails/templates/weather-request/weather-request.types';

export class WeatherUtils {
  static buildData(
    field: keyof WeatherInfo,
    weather: WeatherInfo,
    prev: WeatherInfo = <WeatherInfo>{},
  ): WeatherFieldData {
    const value = weather[field];
    const diff = prev[field] !== undefined ? Number(value) - Number(prev[field]) : 0;
    return {
      value: String(value),
      diff: diff >= 0 ? `+${diff}` : `-${diff}`,
      class: diff >= 0 ? DiffClass.up : DiffClass.down,
    };
  }
}
