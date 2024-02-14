 #!/bin/bash

# This script expects five arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"
message_size="$5"
num_processes=$(($(getconf _NPROCESSORS_ONLN) * 2))

# Generates a random message with the specified size and saves it to a temporary file.
# This is useful for cases where the payload is too large to be sent in the curl command as text.
generate_message() {
  local size="$1"
  tr -dc '[:print:]' </dev/urandom | head -c "$size" > /tmp/message.txt
}

# Generate the message
generate_message "$message_size"

seq "$iteration_count" | xargs -P "$num_processes" -n 1 -I % curl "https://${nginx_host}:${nginx_port}" -k --curves "${algorithm}" -XPOST -d "@/tmp/message.txt" -H "Content-Type: text/plain" -o /dev/null