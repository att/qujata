import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService],
  imports: [ConfigModule],
})
export class AnalysisModule {}
