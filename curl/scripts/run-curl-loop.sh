 #!/bin/bash

# This script expects four arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"

i=0 ; 
while [ $i -le ${iteration_count} ] ; do 
    curl https://${nginx_host}:${nginx_port}  -k  --curves  ${algorithm} -so /dev/null &
    i=`expr $i + 1`
done 
echo "done";