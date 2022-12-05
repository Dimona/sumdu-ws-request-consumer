import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from '@app/app.module';
import { AppService } from '@app/services/app.service';
import { INestApplicationContext } from '@nestjs/common';

let app: INestApplicationContext;

export const handler: Handler = async (event: any, context: Context) => {
  console.log(event?.Records);

  app = app || (await NestFactory.createApplicationContext(AppModule));
  const service = app.get(AppService);

  for await (const record of event.Records) {
    console.log(JSON.parse(record.body));
    const message = JSON.parse(record.body).message;
    await service.execute(typeof message === 'object' ? message : JSON.parse(message));
  }
};
