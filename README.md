# SwiftCloud API Project Setup

This project is designed to run within Docker containers, facilitating a straightforward setup and execution environment for the SwiftCloud API. Before getting started, ensure you have the necessary prerequisites fulfilled on your system.

## Prerequisites

- **Docker:** Ensure Docker is installed and the daemon is running on your system.
- **Make:** The `make` utility should be installed for executing commands from the Makefile.
- **Git:** Git is required for cloning the project repository.

## Project Overview

This API and Database have been designed keeping in mind the following considerations:

1. Anticipating a scenario where Taylor Swift might one day sing more than 2 million songs.
2. Expecting a high number of users which might necessitate a distributed system. Hence, instead of using a data type auto-generated serially, UUID is used.
3. As the application grows, it has been structured with separate version folders to maintain multiple versions simultaneously, starting with version 1 (v1).
4. Implementing pagination to ensure the application can efficiently handle and display large datasets by breaking down the data into smaller, manageable chunks, thereby improving the overall user experience and performance.

## Future possible feature

Rate limit,Caching,Logging and monitoring,Localization,Analytics etc

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

The API will be running at:

```bash
http://localhost:3000/graphql/v1
```

By following the aforementioned steps, you should have a running instance of the SwiftCloud API, encapsulated within Docker containers for easy management and execution.

````markdown
## API Queries

Here are some sample queries that you can use with this API to obtain information about songs and albums.

### What songs were written in a given year?

```graphql
{
  getAllSongs(
    paginatedSongsInput: { search: [{ column: RELEASE_YEAR, term: "2020" }] }
  ) {
    songs {
      songName
      artist
      releaseYear
    }
    total
    page
    pages
  }
}
```
````

### Which songs or albums were most popular last month?

```graphql
{
  getTopSongs(year: 2023, month: August) {
    songName
    album
  }
}
```

### What about over all months?

```graphql
{
  getTopSongs {
    songName
    album
  }
}
```

### Searches and sorts?

```graphql
{
  getAllSongs(
    paginatedSongsInput: {
      search: [
        { column: SONG_NAME, term: "the" }
        { column: ARTIST, term: "featur" }
      ]
      sort: [{ column: RELEASE_YEAR, order: DESC }]
    }
  ) {
    songs {
      songName
      artist
      releaseYear
    }
    total
    page
    pages
  }
}
```

### Get details of song by song name

```graphql
{
  getAllSongs(
    paginatedSongsInput: {
      search: [{ column: SONG_NAME, term: "Exile" }]
      sort: [{ column: RELEASE_YEAR, order: DESC }]
    }
  ) {
    songs {
      id
      songName
      artist
      releaseYear
      writers
      album
    }
    total
    page
    pages
  }
}
```

### Authentication:

For testing purposes, a test user "michael" has been created. To query user song play count or to find which songs a user has played, you need to generate a token first:

```graphql
{
  getToken(username: "michael")
}
```

This will return a token which should be sent in the request header for subsequent requests:

```json
{
  "Authorization": "Bearer <token>"
}
```

### Example Queries:

```graphql
{
  getUserSongs(
    paginatedSongsInput: { sort: [{ column: PLAY_COUNT, order: DESC }] }
  ) {
    songs {
      songName
      playCount
    }
  }
}

{
  getUserTopSongs(month: June, year: 2023, limit: 50) {
    songName
    releaseYear
    playCount
  }
}
```

Further documentation, including parameter types and input types are available in the GraphQL playground.

This setup enables the return of trending songs and specific user songs, laying the groundwork for features like recommending trending songs and personalized playlists among others.

## Running Tests

Execute the following command to run tests:

```bash
npm test
```

### Database Schema

#### 1. **Songs Table**:

- Stores Taylor Swift songs information.
- Fields:
  - id
  - songName
  - artist
  - album
  - description
  - releaseYear

#### 2. **Users Table**:

- Stores user details.
- Fields:
  - id
  - username
  - name
  - createdAt
  - updatedAt

#### 3. **Plays Table**:

- Maps songID and userID, and stores the playCount based on year and month.
- Fields:
  - id
  - userId
  - songId
  - playMonth
  - playYear
  - playCount
