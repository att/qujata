import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CurlService } from './curl.service';
import { CurlRequest } from '../dto/curl-request.dto';
import { CurlResponse } from '../entities/analysis.entity';

@Controller('curl')
export class CurlController {
  constructor(private readonly curlService: CurlService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async create(@Body() curlRequest: CurlRequest): Promise<CurlResponse> {
    console.log('[CurlController:create] In Post func. Body: ', curlRequest);
    return this.curlService.create(curlRequest);
  }
}
