 #!/bin/bash

# This script expects four arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"
num_processes=$(($(nproc) * 2))

seq  ${iteration_count} | xargs -P $num_processes -n 1 -I % curl https://${nginx_host}:${nginx_port}  -k  --curves  ${algorithm} -so /dev/null