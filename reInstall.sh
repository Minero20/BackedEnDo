#!/bin/bash
cd /root/PMRP/docker/ 
docker stop pmrp_service 
docker start ma
docker rm pmrp_service 
docker rmi pmrp_service 
docker build --no-cache -t pmrp_service .
docker stop ma
docker run --name pmrp_service \
-v /root/PMRP/demo/uploads:/usr/src/app/uploads \
-v /root/PMRP/logs:/usr/src/app/logs \
-v /root/PMRP/ftp:/usr/src/app/ftp \
-d -p 9090:3000 pmrp_service
