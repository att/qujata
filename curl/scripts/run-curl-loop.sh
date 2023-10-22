 #!/bin/bash

# This script expects three arguments
nginx_host="$1"
nginx_port="$2"
iteration_count="$3"
algorithm="$4"

i=0 ; 
(
    while [ $i -le ${iteration_count} ] ; do 
        curl https://${nginx_host}:${nginx_port}  -k  --curves  ${algorithm} &
        i=`expr $i + 1`
    done 
) &
