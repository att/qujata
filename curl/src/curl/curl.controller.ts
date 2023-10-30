import { Controller, Post, Body, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { CurlService } from './curl.service';
import { CurlRequest } from '../dto/curl-request.dto';
import { CurlResponse } from '../entities/analysis.entity';

@Controller('curl')
export class CurlController {
  constructor(private readonly curlService: CurlService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() curlRequest: CurlRequest): void {
    console.log('[CurlController:create] In Post func. Body: ', curlRequest);
    this.curlService.run(curlRequest);
  }
}
