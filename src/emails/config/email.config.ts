import { registerAs } from '@nestjs/config';
import { EMAIL_CONFIG } from '@emails/constants/email.constants';
import { EmailConfig } from '@emails/types/email.types';
import { EmailTemplate } from '@emails/enums/email.enums';

export const emailConfig = registerAs(
  EMAIL_CONFIG,
  () =>
    <EmailConfig>{
      templates: {
        [EmailTemplate.WEATHER_REQUEST]: process.env.WEATHER_REQUEST_TEMPLATE,
      },
    },
);
