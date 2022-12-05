import { Module } from '@nestjs/common';
import { MeteomaticsService } from '@weather/strategies/meteomatics/services/meteomatics.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { meteomaticsConfig } from '@weather/strategies/meteomatics/config/meteomatics.config';

@Module({
  imports: [
    ConfigModule.forFeature(meteomaticsConfig),
    HttpModule,
    // HttpModule.register({
    //   timeout: 5000,
    //   maxRedirects: 2,
    // }),
  ],
  providers: [MeteomaticsService],
  exports: [MeteomaticsService],
})
export class MeteomaticsModule {}
