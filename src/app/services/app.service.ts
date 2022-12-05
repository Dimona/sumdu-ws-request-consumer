import { Injectable, Logger } from '@nestjs/common';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { WeatherService } from '@weather/services/weather.service';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { WEATHER_DATE_DEFAULT_FORMAT } from '@app/constants/app.constants';
import { RequestService } from '@requests/services/request.service';
import { RequestStatus } from '@requests/enums/request.enums';
import { AwsSesModuleOptions, AwsSesService } from '@workshop/lib-nest-aws/dist/services/ses';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailService } from '@emails/services/email.service';
import { WeatherRequestPlaceholders } from '@emails/templates/weather.request.placeholders';
import { ConfigService } from '@nestjs/config';
import { AWS_SES_CONFIG } from '@app/constants/aws.ses.constatns';
import path from 'path';

dayjs.extend(customParseFormat);

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly weatherService: WeatherService,
    private readonly requestService: RequestService,
    private readonly awsSesService: AwsSesService,
    private readonly emailService: EmailService,
  ) {}

  async execute(request: WeatherRequestEntity): Promise<void> {
    const config = this.configService.get<AwsSesModuleOptions>(AWS_SES_CONFIG);
    try {
      // Retrieve location weather info
      const weather = await this.weatherService.retrieveForDate(
        request.payload,
        dayjs(request.targetDate, WEATHER_DATE_DEFAULT_FORMAT),
      );

      // Update dynamodb record
      await this.requestService.update({
        primaryKeyAttributes: { id: request.id, targetDate: request.targetDate },
        body: { status: RequestStatus.DONE, data: weather, nextTime: request.nextTime + 60 * 60 * 1000 },
      });

      console.log(weather);
      console.log(
        this.emailService.compile<WeatherRequestPlaceholders>(
          path.resolve(__dirname, 'src/emails/templates/weather.request.email.hbs'),
          {
            temperature: String(weather.temperature),
            temperatureDiff: '+0',
            date: request.targetDate,
            name: 'User',
            latitude: String(request.payload.latitude),
            longitude: String(request.payload.longitude),
            weatherIcon: weather.icon,
            windSpeed: String(weather.windSpeed),
            windSpeedDiff: '+0',
          },
        ),
      );

      // Send email
      await this.awsSesService.sendEmail(
        new SendEmailCommand({
          Message: {
            Body: {
              Html: {
                Data: this.emailService.compile<WeatherRequestPlaceholders>(
                  path.resolve(__dirname, 'src/emails/templates/weather.request.email.hbs'),
                  {
                    temperature: String(weather.temperature),
                    temperatureDiff: '+0',
                    date: request.targetDate,
                    name: 'User',
                    latitude: String(request.payload.latitude),
                    longitude: String(request.payload.longitude),
                    weatherIcon: weather.icon,
                    windSpeed: String(weather.windSpeed),
                    windSpeedDiff: '+0',
                  },
                ),
              },
            },
            Subject: {
              Data: 'Weather Notification',
            },
          },
          Source: config.email.source,
          Destination: {
            ToAddresses: [request.email],
          },
        }),
      );

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
