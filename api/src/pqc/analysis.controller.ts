import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { AnalysisReturnObject } from './entities/analysis.entity';

@Controller('analyze')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  create(@Body() createAnalysisDto: CreateAnalysisDto): Promise<AnalysisReturnObject> {
    console.log('[AnalysisController:create] In Post func. Body: ', createAnalysisDto);
    return this.analysisService.create(createAnalysisDto);
  }
}
