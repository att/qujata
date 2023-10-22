import { QuantumSafeAlgorithms } from './quantum-safe-algorithms.enum';
import { ClassicOrHybridAlgorithms } from './classic-or-hybrid-algorithms.enum';

export const AllowedAlgorithms = {
  ...QuantumSafeAlgorithms,
  ...ClassicOrHybridAlgorithms,
};

export type AllowedAlgorithmsType = typeof AllowedAlgorithms;
