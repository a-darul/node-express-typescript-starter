# Node-Express-TypeScript Starter

A clean and modern boilerplate for building scalable and maintainable Node.js applications using Express and TypeScript. This starter project includes tools for linting, formatting, and enforcing code quality standards.

## Features

- **Express.js**: A minimalist web framework for building robust APIs.`
- **TypeScript**: Type-safe development with modern JavaScript features.
- **ESLint + Prettier**: Ensures consistent code style and best practices.
- **Husky**: Pre-commit hooks for linting, building, and testing.
- **Extensible**: Easy to customize and scale for your needs.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Code Quality**: ESLint, Prettier, Husky
- **Build**: TypeScript Compiler (`tsc`)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/node-express-typescript-starter.git
    cd node-express-typescript-starter
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Setting the `.env` file
4. Run development with auto restart when file changing
    ```bash
    npm run dev
    ```
5. To run on production
    ```
    npm run build
    npm run start
    ```

## Development Workflow

### Code Quality

- **EsLint** is configured with rules for TypeScript and JavaScript to enforce consistent coding standards.
- **Prettier** ensures uniform formatting.

### Pre-Commit Hooks

- **EsLint** is configured with rules for TypeScript and JavaScript to enforce consistent coding standards.
- **Husky** runs the following checks before each commit: - **Linting** (`npm run lint`) - **Building** (`npm run build`) - **Running tests** (`npm test`)
  This ensures that only high-quality, tested code is committed.

## Folder Structure

```
node-express-typescript-starter/
├── src/
│   ├── bl/                 # Business Logic - Handles core application logic
│   ├── data-access/        # Data Access Layer
│   │   ├── migrations/     # Database migrations
│   │   ├── models/         # TypeScript models and interfaces for database entities
│   │   ├── repositories/   # Database interaction logic
│   │   │   └── queries/              # Folder for large SQL files
│   │   │       ├── users/            # Organized by domain
│   │   │       │   ├── get-user-by-id.sql
│   │   │       │   └── create-user.sql
│   │   │       ├── orders/
│   │   │       │   ├── get-orders.sql
│   │   │       │   └── create-order.sql
│   │   │       └── ...other-queries.sql
│   │   ├── schedulers/     # Scheduled tasks and jobs
│   │   ├── seeds-dev/      # Seed data for development
│   │   ├── seeds-prod/     # Seed data for production
│   │   └── index.ts        # Entry point for the DAL
│   ├── endpoints/          # API endpoint definitions grouped by domain
│   │   ├── admin/          # Endpoints for admin dashboard
│   │   │   ├── auth/       # Auth endpoints for admin
│   │   │   │   ├── config.ts      # Endpoint configuration
│   │   │   │   ├── executor.ts    # Calls business logic (services)
│   │   │   │   ├── request.ts     # JSON schema for request validation
│   │   │   │   └── response.ts    # JSON schema for response formatting
│   │   │   └── user/       # User management endpoints for admin
│   │   ├── auth/           # Auth-related endpoints
│   │   │   ├── v1/
│   │   │   │   ├── config.ts
│   │   │   │   ├── executor.ts
│   │   │   │   ├── request.ts
│   │   │   │   └── response.ts
│   │   ├── user/           # User-related endpoints
│   │   │   ├── v1/
│   │   │   │   ├── config.ts
│   │   │   │   ├── executor.ts
│   │   │   │   ├── request.ts
│   │   │   │   └── response.ts
│   │   └── index.ts        # Main entry to dynamically register routes
│   ├── integrations/       # Third-party service integrations
│   │   ├── aws-s3.ts       # AWS S3 integration
│   │   ├── twilio.ts       # Twilio integration
│   │   └── ...other.ts
│   ├── shared/             # Shared modules across the application
│   │   ├── enums/          # Enumerations
│   │   ├── interface/      # Global TypeScript interfaces
│   │   ├── swagger/        # Swagger configuration (auto-registers endpoints)
│   │   ├── validators/     # Input validation and authorization logic
│   │   └── config.ts       # Centralized application configuration
│   ├── utils/              # Utility functions and helpers
│   └── app.ts              # Main application entry point
├── tests/                  # Unit and integration tests
│   ├── integration/        # Integration tests
│   │  	 ├── endpoints/       # End-to-end tests for APIs
│   │ 	 └── integrations/    # Tests for external services
│   └── unit/               # Unit tests
│        ├── bl/            # Tests for business logic
│        ├── core/          # Tests for shared modules
│        ├── dal/           # Tests for repositories and schedulers
│        ├── endpoints/     # Tests for API endpoints
│        └── utils/         # Tests for utility functions
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Requirements

- Node.js >= 22.13
- npm >= 10

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](/CONTRIBUTING.md) for details.
