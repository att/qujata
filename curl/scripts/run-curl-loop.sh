 #!/bin/bash

# This script expects five arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"
message_size="$5"
num_processes=$(($(getconf _NPROCESSORS_ONLN) * 2))

# Generate random message with specified size
generate_message() {
  local size="$1"
  tr -dc '[:print:]' </dev/urandom | head -c "$size" > /tmp/message.txt
}

# Generate the message
generate_message "$message_size"

# Perform curl requests using xargs
#seq "$iteration_count" | xargs -P "$num_processes" -n 1 -I % sh -c "curl 'https://${nginx_host}:${nginx_port}' -k --curves '${algorithm}' -XPOST -d @/tmp/message.txt -H 'Content-Type: text/plain' -o /dev/null"
#seq ${iteration_count} | xargs -P $num_processes -n 1 -I % curl https://${nginx_host}:${nginx_port} -k --curves ${algorithm} -XPOST -d "$payload" -H "Content-Type: text/plain" -o /dev/null
seq "$iteration_count" | xargs -P "$num_processes" -n 1 -I % curl "https://${nginx_host}:${nginx_port}" -k --curves "${algorithm}" -XPOST -d "@/tmp/message.txt" -H "Content-Type: text/plain" -o /dev/null