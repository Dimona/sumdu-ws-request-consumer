import { Module } from '@nestjs/common';
import { MeteomaticsModule } from '@weather/strategies/meteomatics/meteomatics.module';
import { MeteomaticsService } from '@weather/strategies/meteomatics/services/meteomatics.service';
import { WEATHER_STRATEGY } from '@weather/constants/weather.constants';
import { WeatherService } from '@weather/services/weather.service';

@Module({
  imports: [MeteomaticsModule],
  providers: [
    {
      provide: WEATHER_STRATEGY,
      useFactory: (meteomaticsService: MeteomaticsService) => meteomaticsService,
      inject: [MeteomaticsService],
    },
    WeatherService,
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
