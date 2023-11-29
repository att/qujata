from enum import Enum

class QuantumSafeAlgorithms(Enum):
    BIKEL1 = 'bikel1'
    BIKEL3 = 'bikel3'
    KYBER512 = 'kyber512'
    KYBER768 = 'kyber768'
    KYBER1024 = 'kyber1024'
    KYBER90S512 = 'kyber90s512'
    KYBER90S768 = 'kyber90s768'
    KYBER90S1024 = 'kyber90s1024'
    FRODO640AES = 'frodo640aes'
    FRODO640SHAKE = 'frodo640shake'
    FRODO976AES = 'frodo976aes'
    FRODO976SHAKE = 'frodo976shake'
    FRODO1344AES = 'frodo1344aes'
    FRODO1344SHAKE = 'frodo1344shake'
    HQC128 = 'hqc128'
    HQC192 = 'hqc192'
    HQC256 = 'hqc256'

class ClassicAlgorithms(Enum):
    PRIME256V1 = 'prime256v1'
    SECP384R1 = 'secp384r1'

class HybridAlgorithms(Enum):
    P256_KYBER512 = 'p256_kyber512'
    P384_KYBER768 = 'p384_kyber768'
    X25519_KYBER768 ='x25519_kyber768'


