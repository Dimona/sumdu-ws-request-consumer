import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';
import { AppService } from '@app/services/app.service';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const payload = {
    payload: { latitude: 50.918277273524616, longitude: 34.82831322453743 },
    expireAt: 1652392,
    updatedAt: 1670071287,
    status: 'DONE',
    createdAt: 1670068615,
    nextTime: 1670070414,
    email: 'd.mona22@gmail.com',
    id: 'b47d0cbd2740bf9fd6f1',
    targetDate: '05.12.2022',
  };

  await app.get(AppService).execute(payload as WeatherRequestEntity);
  process.exit();
};

bootstrap();
