import { RequestStatus } from '@requests/enums/request.enums';
import { WeatherInfo } from '@weather/types/weather.types';

export type TRequest<T extends Record<string, any>> = {
  id: string;
  email: string;
  status: RequestStatus;
  payload: T;
  createdAt: number;
  updatedAt: number;
  error: any;
  data?: WeatherInfo;
};

export type TWeatherPayload = {
  longitude: number;
  latitude: number;
};
