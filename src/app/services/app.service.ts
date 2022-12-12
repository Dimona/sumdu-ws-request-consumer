import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '@weather/services/weather.service';
import { HOUR_IN_MILLISECONDS, WEATHER_DATE_DEFAULT_FORMAT } from '@app/constants/app.constants';
import { AwsSesEmailService, AwsSesModuleOptions } from '@workshop/lib-nest-aws/dist/services/ses';
import { ConfigService } from '@nestjs/config';
import { AWS_SES_CONFIG } from '@app/constants/aws.ses.constatns';
import { WEATHER_REQUEST_TEMPLATE } from '@emails/templates/weather-request/weather-request.constants';
import { WeatherUtils } from '@weather/utils/weather.utils';
import { WeatherRequestTypes } from '@emails/templates/weather-request/weather-request.types';
import { WeatherRequestEntity, WeatherRequestService, WeatherRequestStatus } from '@workshop/lib-nest-weather-request';

dayjs.extend(customParseFormat);

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly weatherService: WeatherService,
    private readonly weatherRequestService: WeatherRequestService,
    private readonly awsSesEmailService: AwsSesEmailService,
  ) {}

  async execute(request: WeatherRequestEntity): Promise<void> {
    const config = this.configService.get<AwsSesModuleOptions>(AWS_SES_CONFIG);
    try {
      // Retrieve location weather info
      const weather = await this.weatherService.retrieveForDate(
        request.payload,
        dayjs(request.targetDate, WEATHER_DATE_DEFAULT_FORMAT),
      );

      // Send email
      await this.awsSesEmailService.sendTemplatedEmail({
        Template: WEATHER_REQUEST_TEMPLATE,
        TemplateData: JSON.stringify(<WeatherRequestTypes>{
          name: 'User',
          date: request.targetDate,
          latitude: String(request.payload.latitude),
          longitude: String(request.payload.longitude),
          weatherIcon: weather.icon,
          temperature: WeatherUtils.buildData('temperature', weather, request.data),
          windSpeed: WeatherUtils.buildData('windSpeed', weather, request.data),
          windDirection: WeatherUtils.buildData('windDirection', weather, request.data),
        }),
        Source: config.email.source,
        Destination: {
          ToAddresses: [request.email],
        },
      });

      // Update dynamodb record
      await this.weatherRequestService.update({
        primaryKeyAttributes: { id: request.id, targetDate: request.targetDate },
        body: { status: WeatherRequestStatus.DONE, data: weather, nextTime: request.nextTime + HOUR_IN_MILLISECONDS },
      });

      this.logger.log(`Successfully finished at ${new Date().toISOString()}`);
    } catch (err) {
      this.logger.error(err);

      await this.weatherRequestService.update({
        primaryKeyAttributes: { id: request.id, targetDate: request.targetDate },
        body: { status: WeatherRequestStatus.FAILED, error: err },
      });

      throw err;
    }
  }
}
