import { Module } from '@nestjs/common';
import { AwsSesModule, AwsSesModuleOptions } from '@workshop/lib-nest-aws/dist/services/ses';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AWS_SES_CONFIG } from '@app/constants/aws.ses.constatns';
import { awsSesConfig } from '@app/config/aws.ses.config';
import { CommandModule } from 'nestjs-command';
import { EmailModule } from '@emails/email.module';
import { MigrateSesTemplateCommand } from './commands/migrate-template.command';

@Module({
  imports: [
    CommandModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forFeature(awsSesConfig),
    AwsSesModule.registerAsync({
      useFactory(configService: ConfigService) {
        return configService.get<AwsSesModuleOptions>(AWS_SES_CONFIG);
      },
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  providers: [MigrateSesTemplateCommand],
})
export class CliAppModule {}
