import { Module } from '@nestjs/common';
import { AnalysisModule } from './pqc/analysis.module';
import configuration from "./config/configuration";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AnalysisModule,  
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ]
})
export class AppModule {}
