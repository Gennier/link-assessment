# Link Assessment API

This project is a RESTful API built with Bun, Elysia, and Prisma.

Requirements:

- To create Booking with no overlapping on instructor and machine
- Allow machine to have a 10mins cooldown time between bookings
- Assume that the booking must have both machine and instructor

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL database

## Getting Started

1. Clone the repository
2. Install dependencies

```bash
bun install
```

3. Set up your environment variables by creating a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/link_assessment"
JWT_SECRET="supersecretkey"
```

4. Set up the database

```bash
# Generate Prisma client
bun prisma:generate

# Run migrations
bun prisma:deploy

# Seed the database (Must run this to get the initial data)
bun seed
```

## Development

Start the development server with hot reloading:

```bash
bun dev
```

The server will be available at http://localhost:3000 by default.

## Scripts

- `bun dev` - Start the development server with hot reloading
- `bun start` - Start the server
- `bun test` - Run tests
- `bun seed` - Seed the database
- `bun prisma:format` - Format Prisma schema
- `bun prisma:generate` - Generate Prisma client
- `bun prisma:migration` - Create a new migration
- `bun prisma:deploy` - Apply migrations to the database

## API Endpoints

Remember to seed first.

```bash
# Test user account to login
email: test@example.com
password: password123

# Login to get the JWT token
POST /auth/login
```

- There are 4 endpoints that are protected by authentication:
  - `POST /bookings`
  - `GET /instructors`
  - `GET /machines`
  - `GET /users`
- The JWT token is required to access these endpoints
- The JWT token is sent in the `Authorization` header with the prefix `Bearer `
- The JWT token can be obtained from `POST /auth/login`

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Other endpoints

- `GET /machines` - Get all machines

```bash
# Request Query
GET /machines?startDate=2025-04-03T11:00:00Z&endDate=2025-04-03T13:00:00Z
```

- `GET /instructors` - Get all instructors

```bash
# Request Query
GET /instructors?startDate=2025-04-03T11:00:00Z&endDate=2025-04-03T13:00:00Z
```

- `GET /users` - Get all users
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create a new booking

```bash
# Request Body
POST /bookings
{
    "instructorId": "1527d5f7-829f-45f3-8348-20de2f5534f7",
    "machineId": "dedf577d-0e2c-42ae-8453-0c0f3ef0ede7",
    "startDate": "2025-04-02T13:11:00Z",
    "endDate": "2025-04-02T14:00:00Z"
}
```

## Technologies

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Elysia](https://elysiajs.com/) - TypeScript framework for Bun
- [Prisma](https://www.prisma.io/) - ORM for database access
- [JWT](https://jwt.io/) - Authentication mechanism

## Notes

- I use a modularized file structure to keep the code organized and easy to maintain. Inspired by Nestjs
- Authentication is handled using JWT, and is applied to all endpoints that require authentication
