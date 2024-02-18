import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CurlService } from './curl.service';
import { CurlRequest } from '../dto/curl-request.dto';

@Controller('curl')
export class CurlController {
  constructor(private readonly curlService: CurlService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() curlRequest: CurlRequest) {
    console.log('[CurlController:create] In Post func. Body: ', curlRequest);
    const curlInfo = await this.curlService.run(curlRequest);
    console.log('[CurlController:create] In Post func. Response: ', curlInfo)
    return curlInfo;
  }
}
