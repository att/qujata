import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CurlRequest {

  @IsNotEmpty()
  algorithm: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  iterationsCount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  messageSize: number;
}
