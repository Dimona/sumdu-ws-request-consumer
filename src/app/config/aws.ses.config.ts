import { registerAs } from '@nestjs/config';
import { AWS_SES_CONFIG } from '@app/constants/aws.ses.constatns';
import { AWS_SES_API_VERSION, AwsSesModuleOptions } from '@workshop/lib-nest-aws/dist/services/ses';

export const awsSesConfig = registerAs(AWS_SES_CONFIG, () => {
  const env = process.env.ENVIRONMENT;

  return <AwsSesModuleOptions>{
    client: {
      apiVersion: process.env.AWS_SES_API_VERSION || AWS_SES_API_VERSION,
      endpoint: env === 'local' ? process.env.SQS_LOCAL : undefined,
      retryMode: 'standard',
    },
    email: {
      source: process.env.SES_SOURCE_EMAIL,
    },
  };
});
