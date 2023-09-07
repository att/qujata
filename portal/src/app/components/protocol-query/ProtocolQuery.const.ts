import { AttSelectOption } from '../../shared/components/att-select';
import { AlgorithmsPerTypeMapType, AlgorithmTypeEnum } from './ProtocolQuery.model';

export const AlgorithmTypeOptions: AttSelectOption[] = [
  {
    label: AlgorithmTypeEnum.BIKE,
    value: AlgorithmTypeEnum.BIKE,
  },
  {
    label: AlgorithmTypeEnum.CRYSTALS_Kyber,
    value: AlgorithmTypeEnum.CRYSTALS_Kyber,
  },
  {
    label: AlgorithmTypeEnum.FrodoKEM,
    value: AlgorithmTypeEnum.FrodoKEM,
  },
  {
    label: AlgorithmTypeEnum.HQC,
    value: AlgorithmTypeEnum.HQC,
  },
];

export const BikeAlgorithms: AttSelectOption[] = ['bikel1', 'bikel3'].map((algo: string) => ({ label: algo, value: algo }));

const CRYSTALSKyberAlgorithms: AttSelectOption[] = ['kyber512', 'kyber768', 'kyber1024', 'kyber90s512', 'kyber90s768', 'kyber90s1024']
  .map((algo: string) => ({ label: algo, value: algo }));

const FrodoKEMAlgorithms: AttSelectOption[] = ['frodo640aes', 'frodo640shake', 'frodo976aes',
  'frodo976shake', 'frodo1344aes', 'frodo1344shake'].map((algo: string) => ({ label: algo, value: algo }));

const HQCAlgorithms: AttSelectOption[] = ['hqc128', 'hqc192', 'hqc256'].map((algo: string) => ({ label: algo, value: algo }));
export const PQAlgorithms: AttSelectOption[] = [...BikeAlgorithms, ...CRYSTALSKyberAlgorithms, ...HQCAlgorithms];
export const ClassicAlgorithms: AttSelectOption[] = ['prime256v1', 'secp384r1'].map((algo: string) => ({ label: algo, value: algo }));
export const HybridAlgorithms: AttSelectOption[] = ['p256_kyber512', 'p384_kyber768', 'x25519_kyber768'].map((algo: string) => ({ label: algo, value: algo }));
export const AlgorithmTitles: AttSelectOption[] = ['─────────── Classic ───────────', '─────────── Hybrid ───────────', '──────────── PQ ───────────']
  .map((algo: string) => ({ label: algo, value: algo, isDisabled: true }));

export const AllAlgorithms: AttSelectOption[] = [
  AlgorithmTitles[0],
  ...ClassicAlgorithms,
  AlgorithmTitles[1],
  ...HybridAlgorithms,
  AlgorithmTitles[2],
  ...PQAlgorithms
];

export const AlgorithmsPerTypeMap: AlgorithmsPerTypeMapType = {
  [AlgorithmTypeEnum.BIKE]: BikeAlgorithms,
  [AlgorithmTypeEnum.CRYSTALS_Kyber]: CRYSTALSKyberAlgorithms,
  [AlgorithmTypeEnum.FrodoKEM]: FrodoKEMAlgorithms,
  [AlgorithmTypeEnum.HQC]: HQCAlgorithms,
};
