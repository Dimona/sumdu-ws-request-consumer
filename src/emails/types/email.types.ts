import { EmailTemplate } from '@emails/enums/email.enums';

export type EmailConfig = {
  templates: Record<EmailTemplate, string>;
};
