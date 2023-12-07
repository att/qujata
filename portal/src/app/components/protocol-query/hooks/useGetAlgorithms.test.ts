import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useGetAlgorithms } from './useGetAlgorithms';

jest.mock('../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
  
describe('useGetAlgorithms', () => {
  test('Should be in Success mode', () => {
    const mockData = {
      classic: ["prime256v1","secp384r1"],
      hybrid: ["p256_kyber512","p384_kyber768","x25519_kyber768"],
      quantumSafe: ["bikel1","bikel3","kyber512","kyber768","kyber1024","frodo640aes","frodo640shake","frodo976aes","frodo976shake","frodo1344aes","frodo1344shake","hqc128","hqc192","hqc256"]
    };

    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: mockData,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useGetAlgorithms());
    const mockDataNumOfAlgos = mockData.classic.length + mockData.hybrid.length + mockData.quantumSafe.length;
    expect(result.current.options.length).toEqual(mockDataNumOfAlgos + 3);
  });
});