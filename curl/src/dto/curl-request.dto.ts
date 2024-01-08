import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CurlRequest {

  @IsNotEmpty()
  algorithm: String;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  iterationsCount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  messageSize: number;
}
