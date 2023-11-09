import { Module } from '@nestjs/common';
import { CurlModule } from './curl/curl.module';
import configuration from "./config/configuration";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CurlModule,  
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ]
})
export class AppModule {}
