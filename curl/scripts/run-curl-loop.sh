 #!/bin/bash

# This script expects five arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"
payload="$5"
num_processes=$(($(getconf _NPROCESSORS_ONLN) * 2))

seq ${iteration_count} | xargs -P $num_processes -n 1 -I % curl https://${nginx_host}:${nginx_port} -k --curves ${algorithm} -XPOST -d "$payload" -H "Content-Type: text/plain" -o /dev/null