import { Module } from '@nestjs/common';
import { CurlService } from './curl.service';
import { CurlController } from './curl.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CurlController],
  providers: [CurlService],
  imports: [ConfigModule],
})
export class CurlModule {}
