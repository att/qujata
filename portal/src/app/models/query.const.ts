
enum QueryIterationsCount {
    HUNDRED = 100,
    FIVE_HUNDRED = 500,
    THOUSAND = 1000,
    TWO_THOUSAND = 2000,
    FIVE_THOUSAND = 5000,
    TEN_THOUSAND = 10000,
    FIFTY_THOUSAND = 50000
}

enum ClassicOrHybridAlgorithms {
    /* Classic Algorithms */
    PRIME256V1 = 'prime256v1',
    SECP384R1 = 'secp384r1',
    /* Hybrid Algorithms */
    P256_KYBER512 = 'p256_kyber512',
    P384_KYBER768 = 'p384_kyber768',
    X25519_KYBER786 = 'x25519_kyber768',
}
