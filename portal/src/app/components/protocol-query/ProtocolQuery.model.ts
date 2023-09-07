import { AttSelectOption } from '../../shared/components/att-select';

export enum AlgorithmTypeEnum {
  BIKE = 'BIKE',
  CRYSTALS_Kyber = 'CRYSTALS-Kyber',
  FrodoKEM = 'FrodoKEM',
  HQC = 'HQC'
}

export type AlgorithmsPerTypeMapType = { [key in AlgorithmTypeEnum]: AttSelectOption[] };
