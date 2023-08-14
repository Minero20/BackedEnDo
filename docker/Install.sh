#!/bin/bash
cd /root/PMRP
docker build --no-cache -t pmrp_service .
docker run --name pmrp_service \
-v /root/PMRP/out/uploads:/usr/src/app/uploads \
-v /root/PMRP/out/logs:/usr/src/app/logs \
-v /root/PMRP/out/ftp:/usr/src/app/ftp \
-d -p 5000:4000 pmrp_service

docker ps