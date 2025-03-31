# docker storage

C:\Users\<YourUsername>\AppData\Local\Docker\wsl\data\ext4.vhdx

# docker execution commands

docker exec -it <container name or id> /bin/bash

# clearing the Docker build cache

docker builder prune -a

docker compose up --build
docker-compose build --no-cache

docker-compose logs nginx

## removing old image

docker rmi wealthpsychology-app-server:latest

### How to overwrite or deploy the tag in docker hub

# first update docker desktop tag

docker build -t wealthpsychology-app-server:latest .

# Then create the same tag of the already existing in docker hub

docker tag wealthpsychology-app-server:latest knkrn5/wealthpsychology-app-server:v1.0.1

# and then push the same again to docker hub

docker push knkrn5/wealthpsychology-app-server:v1.0.1
