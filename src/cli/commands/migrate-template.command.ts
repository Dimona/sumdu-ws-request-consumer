import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { CliUtils } from '../utils/cli.utils';
import { AwsSesTemplateService } from '@workshop/lib-nest-aws/dist/services/ses';
import { EmailService } from '@emails/services/email.service';
import path from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { EMAIL_CONFIG } from '@emails/constants/email.constants';
import { EmailConfig } from '@emails/types/email.types';
import { EmailTemplate } from '@emails/enums/email.enums';

@Injectable()
export class MigrateSesTemplateCommand {
  private readonly logger = new Logger(MigrateSesTemplateCommand.name);

  constructor(
    private readonly configService: ConfigService,
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
    const template = this.configService.get<EmailConfig>(EMAIL_CONFIG).templates[EmailTemplate.WEATHER_REQUEST];
    this.emailService
      .compile(path.resolve(__dirname, 'src/emails/templates/', name, `${name}.template.hbs`))
      .toString();
    const time = await CliUtils.getScripTime(async () => {
      try {
        await this.awsSesTemplateService.delete({
          TemplateName: template,
        });
        const source = fs.readFileSync(
          path.resolve(__dirname, 'src/emails/templates/', name, `${name}.template.hbs`),
          'utf8',
        );

        if (!source) {
          throw new Error(`File not found: ${path}`);
        }
        await this.awsSesTemplateService.create({
          Template: {
            TemplateName: template,
            HtmlPart: source,
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
