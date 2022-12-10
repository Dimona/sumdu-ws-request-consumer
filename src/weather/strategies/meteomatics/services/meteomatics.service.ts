import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeteomaticsConfig } from '@weather/strategies/meteomatics/types/meteomatics.types';
import { IMAGE_URL, METEOMATICS_CONFIG } from '@weather/strategies/meteomatics/constants/meteomatics.constants';
import { IWeatherStrategy } from '@weather/interfaces/weather.interfaces';
import { Coordinates, WeatherInfo } from '@weather/types/weather.types';
import dayjs from 'dayjs';
import { HttpService } from '@nestjs/axios';
import {
  meteomaticsRequestAttrs,
  meteomaticsWeatherSymbols,
} from '@weather/strategies/meteomatics/config/meteomatics.config';
import { TemperatureUnit } from '@weather/strategies/meteomatics/enums/meteomatics.enums';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class MeteomaticsService implements IWeatherStrategy {
  private readonly logger = new Logger(MeteomaticsService.name);

  private readonly config: MeteomaticsConfig;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
    this.config = configService.get(METEOMATICS_CONFIG);
  }

  async retrieveForDate(coordinates: Coordinates, date: dayjs.Dayjs): Promise<WeatherInfo> {
    const { protocol, domain, user, password } = this.config;
    const { temperature, windSpeed, windDirection, precipitation, weatherSymbol, sunrise, sunset } =
      meteomaticsRequestAttrs;
    const url = `${protocol}://${domain}/${date.toISOString()}/${[
      temperature.build({ unit: TemperatureUnit.Celsius }),
      windSpeed.build(),
      windDirection.build(),
      precipitation.build(),
      sunrise.build(),
      sunset.build(),
      weatherSymbol.build(),
    ].join(',')}/${[coordinates.latitude, coordinates.longitude].join(',')}/json`;

    const {
      data: { data },
    } = await firstValueFrom(
      this.httpService
        .post(url, null, {
          auth: {
            username: user,
            password,
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err);

            throw err;
          }),
        ),
    );

    return {
      temperature: data[0].coordinates[0].dates[0].value,
      windSpeed: data[1].coordinates[0].dates[0].value,
      windDirection: data[2].coordinates[0].dates[0].value,
      precipitation: data[3].coordinates[0].dates[0].value,
      sunrise: data[4].coordinates[0].dates[0].value,
      sunset: data[5].coordinates[0].dates[0].value,
      icon: meteomaticsWeatherSymbols[data[6].coordinates[0].dates[0].value],
    };
  }
}
