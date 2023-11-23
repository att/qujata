import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CurlRequest {

  @IsNotEmpty()
  algorithm: String;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([100, 500, 1000, 2000, 5000, 10000, 50000])
  iterationsCount: number;
}
