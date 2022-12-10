import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Injectable, Logger } from '@nestjs/common';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { WeatherService } from '@weather/services/weather.service';
import { HOUR_IN_MILLISECONDS, WEATHER_DATE_DEFAULT_FORMAT } from '@app/constants/app.constants';
import { RequestService } from '@requests/services/request.service';
import { RequestStatus } from '@requests/enums/request.enums';
import { AwsSesEmailService, AwsSesModuleOptions } from '@workshop/lib-nest-aws/dist/services/ses';
import { EmailService } from '@emails/services/email.service';
import { ConfigService } from '@nestjs/config';
import { AWS_SES_CONFIG } from '@app/constants/aws.ses.constatns';
import { WEATHER_REQUEST_TEMPLATE } from '@emails/templates/weather-request/weather-request.constants';
import { WeatherUtils } from '@weather/utils/weather.utils';
import { WeatherRequestTypes } from '@emails/templates/weather-request/weather-request.types';

dayjs.extend(customParseFormat);

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly weatherService: WeatherService,
    private readonly requestService: RequestService,
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
      await this.requestService.update({
        primaryKeyAttributes: { id: request.id, targetDate: request.targetDate },
        body: { status: RequestStatus.DONE, data: weather, nextTime: request.nextTime + HOUR_IN_MILLISECONDS },
      });

      this.logger.log(`Successfully finished at ${new Date().toISOString()}`);
    } catch (err) {
      this.logger.error(err);

      await this.requestService.update({
        primaryKeyAttributes: { id: request.id, targetDate: request.targetDate },
        body: { status: RequestStatus.FAILED, error: err },
      });

      throw err;
    }
  }
}
