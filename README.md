# SwiftCloud API Project Setup

This project is designed to run within Docker containers, facilitating a straightforward setup and execution environment for the SwiftCloud API. Before getting started, ensure you have the necessary prerequisites fulfilled on your system.

## Prerequisites

- **Docker:** Ensure Docker is installed and the daemon is running on your system.
- **Make:** The `make` utility should be installed for executing commands from the Makefile.
- **Git:** Git is required for cloning the project repository.

## Getting Started

Follow these steps to clone, setup, and run the project:

### 1. Clone the Project Repository

```bash
git clone https://github.com/puneet-lab/swiftcloud-api.git
cd swiftcloud-api
```

### 2. Project Setup (One-Time Configuration)

Execute the following make commands to set up the project. This involves creating a Docker network and setting up the PostgreSQL database within a container.

```bash
make setup   # Create Docker network and setup PostgreSQL database container
make seed    # Seed the database by creating required objects
```

### 3. Starting the Project

To start the Nest.js project, use the following make command:

```bash
make start   # Start the Nest.js project
```

### 4. Stopping the Project

When you wish to stop running the project, use the following make command to stop all the containers:

```bash
make stop    # Stop running containers
```

By following the aforementioned steps, you should have a running instance of the SwiftCloud API, encapsulated within Docker containers for easy management and execution.
