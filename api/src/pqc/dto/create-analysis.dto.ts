import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import {
  AllowedAlgorithms,
  AllowedAlgorithmsType,
} from './allowed-algorithms.type';

export class CreateAnalysisDto {
  @IsNotEmpty()
  @IsEnum(AllowedAlgorithms)
  algorithm: AllowedAlgorithmsType;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(150)
  iterationsCount: number;
}
