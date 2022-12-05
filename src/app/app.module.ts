import { Module } from '@nestjs/common';
import { RequestModule } from '@requests/request.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from '@app/services/app.service';
import { WeatherModule } from '@weather/weather.module';
import { AwsSesModule, AwsSesModuleOptions } from '@workshop/lib-nest-aws/dist/services/ses';
import { awsSesConfig } from '@app/config/aws.ses.config';
import { AWS_SES_CONFIG } from '@app/constants/aws.ses.constatns';
import { EmailModule } from '@emails/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forFeature(awsSesConfig),
    AwsSesModule.registerAsync({
      useFactory(configService: ConfigService) {
        return configService.get<AwsSesModuleOptions>(AWS_SES_CONFIG);
      },
      inject: [ConfigService],
    }),
    RequestModule,
    WeatherModule,
    EmailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
