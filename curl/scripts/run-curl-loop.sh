 #!/bin/bash

# This script expects five arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"
payload="$5"

url="https://${nginx_host}:${nginx_port}"
header="Content-Type: text/plain"

# Execute the first curl command and capture output(request size) and errors
request_size=$(curl ${url} -k --curves ${algorithm} -XPOST -d "$payload" -H "${header}" -o /dev/null 2>/dev/null -w '%{size_request}')

if [ $? -ne 0 ]; then
    echo "Error: Failed to execute curl command."
    exit 1
fi

num_processes=$(($(getconf _NPROCESSORS_ONLN) * 2))

# Execute the subsequent curl commands, continue on failure
seq $((iteration_count - 1)) | xargs -P $num_processes -n 1 -I % curl ${url} -k --curves ${algorithm} -XPOST -d "$payload" -H "${header}" -o /dev/null 2>/dev/null

wait

echo -n "$((request_size * iteration_count))"