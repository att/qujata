import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import {
  AllowedAlgorithms,
  AllowedAlgorithmsType,
} from './allowed-algorithms.type';

export class CurlRequest {
  @IsNotEmpty()
  @IsEnum(AllowedAlgorithms)
  algorithm: AllowedAlgorithmsType;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(100000)
  iterationsCount: number;
}
