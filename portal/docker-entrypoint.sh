#!/bin/sh
set -e
WORK_DIR=/usr/share/nginx/html/qujata


case ${1} in
  app:start)
    echo "----------------------------------------------------------------"
    echo "---------------${1} PQC_PORTAL Starting... -------------------"
    echo "----------------------------------------------------------------"
    node -v
    # Injecting Environment Variables
    node ${WORK_DIR}/inject-env-variables.js $WORK_DIR
    ;;
  *)
    exec "$@"
    ;;
esac

nginx -g 'daemon off;'
