docker build -t pmrp_ocean_back .
docker run -d -p 9090:3000 pmrp_ocean_back
docker run --name pmrp_ocean_back -v /root/PMRP/shard:/usr/src/app/uploads -d -p 9090:3000 pmrp_ocean_back 