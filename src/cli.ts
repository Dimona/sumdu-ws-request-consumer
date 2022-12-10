import { NestFactory } from '@nestjs/core';
import { CliAppModule } from './cli/cli-app.module';
import { CommandModule, CommandService } from 'nestjs-command';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(CliAppModule, {
    logger: ['error', 'debug', 'log', 'warn', 'verbose'],
  });

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
};
bootstrap();
