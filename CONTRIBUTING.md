## Folder Structure
```
project/
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
│   ├── shared/             # Shared modules across the application
│   │   ├── enums/          # Enumerations
│   │   ├── interface/      # Global TypeScript interfaces
│   │   ├── swagger/        # Swagger configuration (auto-registers endpoints)
│   │   ├── validators/     # Input validation and authorization logic
│   │   └── config.ts       # Centralized application configuration
│   ├── integrations/       # Third-party service integrations
│   │   ├── aws-s3.ts       # AWS S3 integration
│   │   ├── twilio.ts       # Twilio integration
│   ├── utils/              # Utility functions and helpers
│   └── app.ts              # Main application entry point
├── tests/                  # Unit and integration tests
│   ├── unit/               # Unit tests
│   │    ├── bl/            # Tests for business logic
│   │    ├── core/          # Tests for shared modules
│   │    ├── dal/           # Tests for repositories and schedulers
│   │    ├── endpoints/     # Tests for API endpoints
│   │    └── utils/         # Tests for utility functions
│   └── integration/        # Integration tests
│      ├── endpoints/       # End-to-end tests for APIs
│      └── integrations/    # Tests for external services
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```