# Makefile

# The name of the Docker image
APP_CONTAINER_NAME=swiftcloud-app

IMAGE_NAME=swiftcloud-api

# The port on which the app runs inside the Docker container
CONTAINER_PORT=3000

# The port on your machine to which traffic will be forwarded
HOST_PORT=3000

PATH=$(shell pwd)

DB_CONTAINER_NAME=swiftcloud

DB_CREDENTIALS=swiftcloud

NETWORK_NAME=swiftcloud-network

create-network:
	docker network create $(NETWORK_NAME)

setup:create-network
	docker run -d --name $(DB_CONTAINER_NAME) --network $(NETWORK_NAME) -p 5432:5432 -e POSTGRES_USER=$(DB_CREDENTIALS) -e POSTGRES_PASSWORD=$(DB_CREDENTIALS) -e POSTGRES_DB=swiftcloud postgres:latest

seed:
	docker cp seed.sql swiftcloud:/seed.sql
	docker exec swiftcloud sh -c 'psql -U swiftcloud -d swiftcloud -f /seed.sql > /dev/null'

db-start:
	docker start $(DB_CONTAINER_NAME)



# Builds the Docker image
build:
	docker build --no-cache -t $(IMAGE_NAME) .

# Runs the Docker container
run:
	docker run --name $(APP_CONTAINER_NAME) --network $(NETWORK_NAME) -p $(HOST_PORT):$(CONTAINER_PORT) -v $(PATH):/usr/src/app $(IMAGE_NAME)

# Convenience target to build and then run the Docker container
start: db-start build run

# Remove all running Docker containers
rm:
	docker rm $(APP_CONTAINER_NAME)

# Stops all running Docker containers
st:
	docker stop $(APP_CONTAINER_NAME) $(DB_CONTAINER_NAME)

stop: st rm
 