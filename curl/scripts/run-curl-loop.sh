 #!/bin/bash

# This script expects five arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"
message_size="$5"

url="https://${nginx_host}:${nginx_port}"
header="Content-Type: text/plain"
# Generates a random message with the specified size and saves it to a temporary file.
# This is useful for cases where the payload is too large to be sent in the curl command as text.
generate_message() {
  local size="$1"
  tr -dc '[:print:]' </dev/urandom | head -c "$size" > /tmp/message.txt
}
# create the tmp file with generated message
generate_message "$message_size"

# Execute the first curl command and capture output(request size) and errors
response=$(curl -sS -D - "${url}" -k --curves "${algorithm}" -XPOST -d "@/tmp/message.txt" -H "${header}" -o /dev/null 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "Error: Failed to execute curl command."
    exit 1
fi
request_size=$(echo "$response" | awk '/Total-Request-Size/ {print $2}')
if [ -z "$request_size" ]; then
    request_size=0
fi

num_processes=$(($(getconf _NPROCESSORS_ONLN) * 2))

# Execute the subsequent curl commands, continue on failure
seq $((iteration_count - 1)) | xargs -P $num_processes -n 1 -I % curl ${url} -k --curves ${algorithm} -XPOST -d "@/tmp/message.txt" -H "${header}" -o /dev/null 2>/dev/null

wait

echo -n "$((request_size * iteration_count))"