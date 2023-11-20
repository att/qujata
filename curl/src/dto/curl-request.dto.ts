import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CurlRequest {

  @IsNotEmpty()
  algorithm: String;

  @IsNotEmpty()
  @IsNumber()
  @Min(500)
  @Max(100000)
  iterationsCount: number;
}
