#!/bin/bash
cd /root/PMRP_TEST/docker/ 
docker stop pmrp_service_test 
docker rm pmrp_service_test 
docker rmi pmrp_service_test 
docker build --no-cache -t pmrp_service_test .
docker run --name pmrp_service_test \
-v /root/PMRP_TEST/docker/uploads:/usr/src/app/uploads \
-v /root/PMRP_TEST/docker/logs:/usr/src/app/logs \
-v /root/PMRP_TEST/docker/ftp:/usr/src/app/ftp \
-v /root/PMRP_TEST/docker/ftp:/usr/src/ftp \
-d -p 9999:3000 pmrp_service_test

sleep 1
docker ps -a