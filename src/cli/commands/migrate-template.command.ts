import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { CliUtils } from '../utils/cli.utils';
import { AwsSesTemplateService } from '@workshop/lib-nest-aws/dist/services/ses';
import { WEATHER_REQUEST_TEMPLATE } from '@emails/templates/weather-request/weather-request.constants';
import { EmailService } from '@emails/services/email.service';
import path from 'path';

@Injectable()
export class MigrateSesTemplateCommand {
  private readonly logger = new Logger(MigrateSesTemplateCommand.name);

  constructor(
    private readonly awsSesTemplateService: AwsSesTemplateService,
    private readonly emailService: EmailService,
  ) {}

  @Command({
    command: 'migrate:ses:template <name>',
    describe: 'Migrate ses template to aws service',
  })
  async migrateSesTemplate(
    @Positional({
      name: 'name',
      describe: 'Template name',
      type: 'string',
    })
    name: string,
  ) {
    this.logger.verbose('----------------------Start-------------------');
    this.emailService
      .compile(path.resolve(__dirname, 'src/emails/templates/', name, `${name}.template.hbs`))
      .toString();
    const time = await CliUtils.getScripTime(async () => {
      try {
        await this.awsSesTemplateService.delete({
          TemplateName: WEATHER_REQUEST_TEMPLATE,
        });
        await this.awsSesTemplateService.create({
          Template: {
            TemplateName: WEATHER_REQUEST_TEMPLATE,
            HtmlPart: this.emailService
              .compile(path.resolve(__dirname, 'src/emails/templates/', name, `${name}.template.hbs`))
              .toString(),
            SubjectPart: 'Weather Notification',
          },
        });
        this.logger.verbose(`Template '${name}' successfully migrated to aws`);
        this.logger.verbose('----------------------Finish-------------------');
      } catch (err) {
        this.logger.error(err.stack);
      }
    });
    this.logger.verbose(`Script time: ${CliUtils.msToStringTime(time)}`);
  }
}
