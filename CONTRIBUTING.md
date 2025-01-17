### 1. Folder Structure

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

---

### 2. General Best Practices

**1. TypeScript:**

- Always define types or interfaces for function parameters and return values.
- Avoid any unless absolutely necessary.
- Use readonly for immutability where applicable.

**2. Code Style:**

- Use Prettier for consistent formatting.
- Follow ESLint rules for TypeScript (typescript-eslint).
- Avoid magic numbers and hard-coded values; use constants or environment variables.
- Limit function size to improve readability.

**3. Error Handling:**

- Always use try...catch blocks for asynchronous operations.

**4.Environment Variables:**

- Use a .env file for configuration and load it using dotenv.

---

### 3. Naming Conventions

**Files:**

- Use **kebab-case** for filenames:
    - user-detail.ts
    - user-profile.ts

**Variables:**

- Use **camelCase** for variables and functions:
    ```
    const userName = `John Doe`;
    ```
- Use PascalCase for classes and types:
    ```
    class UserService {}
    interface User { id: number; name: string; }
    ```
- Use **UPPER_SNAKE_CASE** for constants:
    ```
    const MAX_RETRIES = 5;
    ```

**Function Sorting:**

Import and exports are sorted alphabetically. (Prefers also sort functions or variables inside the file)

---

### 4. Linting and Formatting

Use EsLint with Prettier, the config can be found at [eslint.config.mjs](/eslint.config.mjs)

**For Visual Studio Code User**

Install extension of [ESLint](dbaeumer.vscode-eslint) and [Prettier](esbenp.prettier-vscode), to automate the lint and format

---

### 5. Git Workflow

#### Branching Strategy

We follow a structured Git branching strategy to ensure smooth collaboration and deployment processes. Below are the types of branches and their purposes:

1. **Main Branch**

- **Purpose**: The production-ready branch.
- **Rules**:
    - Direct commits to `main` are **not allowed**.
    - Only merge `feature` branches that are approved for production.
    - Each merge into `main` requires a new tag for production deployment.

2. **Development Branch**

- **Purpose**: The staging branch for integration and testing.
- **Rules**:
    - All `feature` and `bugfix` branches must be merged into `development` for QA testing.
    - Merging into `development` triggers automatic deployment to the development server via CI/CD.

3. **Feature Branches** (`feature/ticket-number-short-description`)

- **Purpose**: For developing new features.
- **Naming Convention**: `feature/123-login-page`
- **Rules**:
    - Always create a new feature branch by checking out from `main`.
    - After completing the feature, request QA approval to merge into `development`.
    - Once QA approves and the feature is ready for production, merge into `main`.

4. **Bugfix Branches** (`bugfix/ticket-number-short-description`)

- **Purpose**: For fixing bugs.
- **Naming Convention**: `bugfix/456-login-error`
- **Rules**:
    - Always create a new bugfix branch by checking out from `main`.
    - After completing the fix, request QA approval to merge into `development`.
    - For urgent production bugs, merge directly into `main` with approval.

#### Workflow for Developing a New Feature or Bugfix

##### Step 1: Create a New Branch

1. Always checkout from the `main` branch:
    ```bash
    git checkout main
    git pull origin main
    git checkout -b feature/ticket-number-short-description
    ```
2. Follow the naming convention for the branch.

##### Step 2: Commit Your Changes

- Use clear and descriptive commit messages. Follow the format:
    ```
    [TICKET-NUMBER] Short description of the changes
    ```
    Example:
    ```
    [123] Added login page with email and password fields
    ```

##### Step 3: Push Your Branch

- Push your branch to the remote repository:
    ```bash
    git push origin feature/ticket-number-short-description
    ```

##### Step 4: Create a Pull Request (PR)

- Open a PR to merge your branch into `development`.
- Trigger github action to notify slack
- Include the following in the PR description:
    - **Ticket number and description**
    - **Summary of changes**
    - **Steps for QA to test the feature**

##### Step 5: QA Testing

- QA will review and test your changes.
- If QA approves, the PR will be merged into `development`.
- Merging into `development` triggers CI/CD to deploy the changes to the development server.

##### Step 6: Staging Deployment (Manual)

- Once the feature is stable on `development`, a manual deployment to the staging server can be initiated.
- Use the staging environment for final validation.

##### Step 7: Production Deployment

1. When the feature is approved for production, open a new PR to merge the `feature` branch into `main`.
2. After merging into `main`, create a tag for the release
3. Tag uses 3dots version. eg vX.Y.Z. X is major update, Y is minor update, Z is patch update
4. The release will trigger the CI/CD pipeline to deploy the changes to the production server.

---

### Additional Guidelines For Git

#### Code Review

- All PRs must be reviewed by at least one team member before merging.
- Address all comments from reviewers before merging.

#### Resolving Conflicts

- Always resolve conflicts locally before pushing your changes.
- Inform the reviewer if conflicts are resolved.

#### Keeping Your Branch Updated

- Regularly rebase or merge `main` into your branch to keep it up-to-date:
    ```bash
    git pull --rebase origin main
    ```

---

### 6. Dependencies

- Keep dependencies updated using `npm outdated` and `npm-check-updates`.
- Categorize dependencies and devDependencies properly.

---

### 7. Documentation

1. Use Swagger for API documentation:
    - Install `swagger-ui-express`
    - Set up a swagger config at `src/shared/swagger`
    - Generate html for swagger-ui from `request.ts` and `response.ts` at `endpoints` folder

---

### 8. Database

1. Unique Identifiers
    - Every table in the database must include a unique identifier, such as `userId`, `postId`, etc.
    - These identifiers are generated using the Snowflake technique implemented in as postgresql function shows at [`snowflake migration`](/src/data-access/migrations/20250113100606_create-snowflake-function.js).
    - **What is the Snowflake Technique?**
        - A method for generating unique, sortable IDs based on, inspired by twitter:
            - **Timestamp:** Ensures uniqueness across time.
            - **Machine Identifier:** Differentiates servers generating IDs.
            - **Sequence Number:** Resolves collisions within the same millisecond.
        - The generated IDs are globally unique, ordered by creation time, and efficient for storage and indexing.
2. Migrations and Seeders
    - **Migrations:**
        - Define the schema and structure of your database.
        - Located in src/data-access/migrations/.
        - Automatically applied when the project starts, ensuring that the database is always synchronized with the application code.
    - **Seeders:**
        - Populate the database with essential data.
        - Development seeders are placed in `src/data-access/seeds-dev/`, and production seeders in `src/data-access/seeds-prod/`.
        - Seeders also run automatically at project startup to ensure that necessary data is initialized.
3. Repository Structure and SQL Management
    - Repository Files:
        - Each repository file (e.g., user.ts) in src/data-access/repositories/ contains logic for CRUD operations and other business-specific queries.
        - All database interactions use Knex.js but leverage raw queries exclusively.
    - **Raw Query Separation:**
        - Raw SQL queries are stored in separate .sql files under `src/data-access/repositories/queries/` for better organization and maintainability. easy debugging copying into PostgreSQL editor.
4. Knex.js Usage Philosophy
    - The project uses `knex.raw()` exclusively, separating query logic into `.sql` files. This provides:
        - Better readability for complex queries.
        - Easier query tuning and testing directly in SQL.
        - Improved team collaboration for SQL-focused development.
    - It adopts a hybrid approach, where:
        - Simple queries use Knex.js functions.
        - Complex queries use `knex.raw()` and `.sql` files.
5. Linter and Formatter
    - _No formatter and linter_ applied for this starter yet.
    - It could [`SQLFluff`](https://docs.sqlfluff.com/en/stable/gettingstarted.html) to used
    - It could use `sql-formatter` with options
        ```
        {
            language: 'postgresql', keywordCase: 'upper', functionCase: 'upper'
        }
        ```
6. Pagination

---
