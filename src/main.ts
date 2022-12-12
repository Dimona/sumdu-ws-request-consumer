import dayjs from 'dayjs';
import { WeatherRequestEntity } from '@workshop/lib-nest-weather-request';
import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';
import { AppService } from '@app/services/app.service';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const now = new Date().valueOf();
  const payload = {
    payload: { latitude: 50.918277273524616, longitude: 34.82831322453743 },
    expireAt: dayjs().add(1, 'days').unix(),
    updatedAt: now,
    status: 'DONE',
    createdAt: now,
    nextTime: now,
    email: 'd.mona22@gmail.com',
    id: 'b47d0cbd2740bf9fd6f1',
    targetDate: '15.12.2022',
  };

  await app.get(AppService).execute(payload as WeatherRequestEntity);
  process.exit();
};

bootstrap();
