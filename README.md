# Student-Management
# Student Management System — MERN Stack

A full-stack web application for managing student records using MongoDB, Express.js, React, and Node.js. This project is also intended to provide hands-on experience with Docker, Docker Compose, and AWS EC2 deployment.

## Project Overview

The Student Management System provides a simple interface to create, view, update, delete, and search student records. It follows a client-server architecture, with React handling the user interface, Express.js providing REST APIs, and MongoDB storing student information.

## Features

- Add new student records
- View all registered students
- Update student information
- Delete student records
- Search students by name or email
- Dashboard summary of student information
- REST API integration between frontend and backend
- Planned containerization using Docker and Docker Compose
- Planned deployment on AWS EC2

> **Project status:** In development. Features will be marked complete as they are implemented and tested.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Node.js | JavaScript runtime for the backend |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| Vite | Frontend development server and build tool |
| Docker | Application containerization |
| Docker Compose | Running multiple services together |
| AWS EC2 | Planned cloud deployment |
| Git and GitHub | Version control and source hosting |

## Architecture

```text
                 User / Browser
                       |
                       v
                React Frontend
                       |
                 HTTP REST API
                       |
                       v
              Node.js + Express
                       |
                    Mongoose
                       |
                       v
                 MongoDB Atlas

Deployment plan:
Docker Compose → AWS EC2
```

## Project Structure

```text
student-management/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
├── .gitignore
└── README.md
```

The structure may evolve as the application develops.

## Prerequisites

Install or configure the following:

- Node.js and npm
- Git
- Visual Studio Code
- Windows Subsystem for Linux (WSL) with Ubuntu, or another supported development environment
- A MongoDB Atlas account and database cluster

Docker and AWS access will be required during the deployment phase.

## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd student-management
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Replace the MongoDB placeholder with your actual Atlas connection string. Do not commit this file to GitHub.

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

### 4. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend is expected to listen on port `5000` once its server implementation and development script are configured.

### 5. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite normally serves the frontend at:

```text
http://localhost:5173
```

The frontend and backend must both be running for API-driven features to work.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB Atlas connection string |

Keep credentials and secrets in environment variables. Use a separate environment configuration for deployment where appropriate.

## Planned API Endpoints

The following endpoints describe the intended REST API. They must be implemented and tested before they can be used.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | Retrieve all students |
| GET | `/api/students/:id` | Retrieve a student by ID |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

Example student record:

```json
{
  "name": "Sample Student",
  "email": "student@example.com",
  "department": "Computer Science",
  "year": 4
}
```

The actual schema and validation rules will be finalized during backend development.

## Docker and Deployment Roadmap

The deployment work will be completed after the application works locally.

1. Create a Dockerfile for the React frontend.
2. Create a Dockerfile for the Node.js backend.
3. Configure Docker Compose for the application services.
4. Configure MongoDB connectivity and persistent storage where applicable.
5. Test the application in containers.
6. Launch an AWS EC2 instance and configure secure network access.
7. Deploy the application and verify it through a browser.

MongoDB Atlas remains the planned cloud database, so a local MongoDB container is not required unless the deployment design changes.

## Security Considerations

- Never commit `.env` files, passwords, or API secrets.
- Restrict MongoDB Atlas network access to trusted IP addresses.
- Use a database user with only the permissions the application requires.
- Validate and sanitize incoming API data.
- Avoid exposing the backend or database ports publicly in production.
- Configure AWS security groups to allow only the required traffic.

## Learning Objectives

This project is designed to develop practical skills in:

- Full-stack application development
- REST API design and integration
- MongoDB database connectivity
- Environment-based configuration
- Docker images and containers
- Multi-service application orchestration
- Basic cloud deployment and networking
- Application troubleshooting

## Future Improvements

- Student authentication and authorization
- Pagination and advanced filtering
- Input validation and improved error handling
- Automated tests
- CI/CD pipeline
- HTTPS and production reverse proxy
- Application monitoring and logging

## License

This project is intended for educational and portfolio use. Add a license file if you choose to distribute it under a specific open-source license.

