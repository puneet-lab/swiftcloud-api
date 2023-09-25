# Makefile

# The name of the Docker image
IMAGE_NAME=swiftcloud-api

# The port on which the app runs inside the Docker container
CONTAINER_PORT=3000

# The port on your machine to which traffic will be forwarded
HOST_PORT=3000

PATH=$(shell pwd)

DB_CONTAINER_NAME=swiftcloud

DB_CREDENTIALS=swiftcloud

setup:
	docker run -d --name ${DB_CONTAINER_NAME} -p 5432:5432 -e POSTGRES_USER=${DB_CREDENTIALS} -e POSTGRES_PASSWORD=${DB_CREDENTIALS} -e POSTGRES_DB=swiftcloud postgres:latest

db-start:
		docker start ${DB_CONTAINER_NAME}

# Builds the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Runs the Docker container
run:
	docker run -p $(HOST_PORT):$(CONTAINER_PORT) -v $(PATH):/usr/src/app $(IMAGE_NAME)

# Convenience target to build and then run the Docker container
start: build run

# Stops all running Docker containers
stop:
	docker stop $(APP_CONTAINER_NAME) $(DB_CONTAINER_NAME)
