## Viami Backend API

Viami API is developed by me Nihel Ouanassi and my colleague Tania Olivia as part of our master's degree project. This API serves as the backend for the Viami application, which is designed to connect solo travelers and facilitate the discovery of activities in their destination countries.

### Description
Viami is an application aimed at solo travelers who seek to connect with other travelers and discover activities to do in their destination countries. This API serves as the backend system for the Viami application, providing endpoints for user authentication, activity management, messaging, and more.

## Developers
- Tania Olivia
- Nihel Ouanassi

## Technologies Used
- Node.js: Backend JavaScript runtime environment.
- Express: Web application framework for Node.js.
- Docker: Containerization platform for deploying applications.
- MySQL: Relational database management system.
- Swagger: OpenAPI documentation tool for API specification.
- Render: Hosting platform for deploying the API.
- Amazon RDS: Relational Database Service for hosting MySQL database.
- Amazon S3: Simple Storage Service for hosting images.
- Amazon CloudFront : is used as a content delivery network for caching and delivering images

## Project Structure
- **src/api:** 
- **/controllers:** Contains controllers for handling business logic.
- **/middlewares:** Contains middleware functions for request processing.
- **/services:** Contains service functions for interacting with the database.

## Setup
1. **Clone the repository:** 
```git clone https://github.com/taniaolivia/Viami-Back.git```

2. **Navigate to the project directory:**
    cd viami-back
3. **Environment variables:**
Create a `.env` file in the root directory of the project and add the necessary environment variables. Refer to the `.env.example` file for required variables.

4. **Database setup:**
Before using the API, ensure that the database is populated with the necessary data [localhost:8080]

5. **Build the Docker image:**
```docker-compose up --build```

6. **Run the Docker container:**

```docker-compose up```

7. **API documentation:**
Access the API documentation using Swagger UI at [http://localhost:3333/api/docs]

8. **Database Setup:**
Before using the API, ensure that the database is populated with the necessary data

## Database and Local API Access

- **Database Access**: http://localhost:8080
- **Local API Access**: http://localhost:3333/api

## Stopping the Docker Container

To stop the Docker container running the API, use the following command:

```docker-compose down```

## License

This project is licensed under the terms of the MIT license.

## Copyright

Copyright (c) 2023 Viami. All rights reserved.
