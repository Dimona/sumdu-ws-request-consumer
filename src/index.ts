import { NestFactory } from '@nestjs/core';
import { Handler, SQSEvent } from 'aws-lambda';
import { AppModule } from '@app/app.module';
import { AppService } from '@app/services/app.service';
import { INestApplicationContext } from '@nestjs/common';

let app: INestApplicationContext;

export const handler: Handler = async (event: SQSEvent) => {
  app = app || (await NestFactory.createApplicationContext(AppModule));
  const service = app.get(AppService);

  for await (const record of event.Records) {
    console.log(record.body);
    await service.execute(JSON.parse(record.body));
  }
};
