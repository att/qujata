from enum import Enum

class Metric(Enum):
    SERVER_AVERAGE_CPU = 'server_avg_cpu'
    SERVER_AVERAGE_MEMORY = 'server_avg_memory'
    CLIENT_AVERAGE_CPU = 'client_avg_cpu'
    CLIENT_AVERAGE_MEMORY = 'client_avg_memory'
    ERROR_RATE = 'error_rate'
    BYTES_THROUGHPUT_PER_SECOND = 'bytes_throughput_per_sec'
    MESSAGES_THROUGHPUT_PER_SECOND = 'msg_throughput_per_sec'
    AVERAGE_TLS_HANDSHAKE_TIME = 'avg_tls_handshake_time'
