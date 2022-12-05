export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type WeatherInfo = {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: string;
  sunrise: string;
  sunset: string;
  icon: string;
};
