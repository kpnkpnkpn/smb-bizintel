# Local Business Intelligence Platform Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for the Local Business Intelligence Platform, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

#### Starter Template or Existing Project
The project will be built from scratch, but will use a modern scaffolding strategy instead of a single, monolithic starter template. We will use best-in-class tools to set up each part of our stack (React, Python) within a Vercel-optimized Monorepo managed by Turborepo. This approach provides flexibility and leverages modern best practices.

#### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-07-24 | 1.0 | Initial Draft | Winston (Architect) |

---

## High Level Architecture

#### Architectural Patterns
* **Serverless Architecture:** We will use Vercel's Serverless Functions for the Python backend.
    * _Rationale:_ This is cost-effective for a personal tool with variable traffic, scales automatically, and integrates seamlessly with the chosen Vercel hosting platform.
* **Component-Based UI:** The React frontend will be built as a collection of reusable, self-contained components.
    * _Rationale:_ This is the standard for modern React development and promotes a maintainable, scalable, and testable frontend codebase.
* **Repository Pattern:** The Python backend will use the repository pattern to abstract data access logic from the core business logic.
    * _Rationale:_ This decouples the application logic from the database, which makes the code significantly easier to test and allows for potential database changes in the future with minimal refactoring.
* **API Gateway Pattern:** Vercel's routing will act as a unified API Gateway for the frontend.
    * _Rationale:_ This provides a single, consistent entry point for all API calls from the React application, simplifying frontend configuration and centralizing routing and security rules.

#### Technical Summary
The project will be a full-stack, data-centric application built within a Turborepo-managed monorepo. The frontend will be a modern React single-page application created with Vite. The backend will be a Python-based REST API built with the FastAPI framework, connected to a PostgreSQL database. The entire application will be deployed on Vercel, leveraging its capabilities for hosting both the frontend and the Python serverless functions for the backend.

#### Platform and Infrastructure Choice
* **Platform:** Vercel
* **Key Services:** Vercel Hosting (Frontend), Vercel Serverless Functions (Python Backend), and a managed PostgreSQL provider (e.g., Vercel Postgres, Neon, or Supabase).

#### Repository Structure
* **Structure:** Monorepo
* **Monorepo Tool:** Turborepo
* **Package Organization:** The monorepo will contain separate packages for the `frontend` application, the `backend` API, and a `shared` package for any common types or utilities.

#### High Level Architecture Diagram
```mermaid
graph TD
    subgraph User
        U[User's Browser]
    end

    subgraph Vercel Platform
        V_Edge[Vercel Edge Network]
        V_FE[React Frontend]
        V_BE[Python/FastAPI Serverless Functions]
    end

    subgraph Data Layer
        DB[(PostgreSQL Database)]
    end
    
    subgraph External Services
        ExtAPI[External Data APIs]
    end

    U --> V_Edge
    V_Edge --> V_FE
    V_FE --> V_BE
    V_BE --> DB
    V_BE --> ExtAPI



## Tech Stack

#### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| Frontend Language | TypeScript | 5.x | Primary language for frontend | Type safety and scalability. |
| Frontend Framework | React | 18.x | UI library for building components | User preference and vast ecosystem. |
| UI Component Library| Mantine | 7.x | Pre-built, accessible components | Accelerates UI development; highly configurable. |
| State Management | Zustand | 4.x | Lightweight state management | Simple, fast, and minimal boilerplate compared to Redux. |
| Backend Language | Python | 3.11+ | Primary language for backend | User preference. |
| Backend Framework | FastAPI | 0.110.x | API framework | High performance, modern, excellent for building APIs. |
| API Style | REST | N/A | API design paradigm | Standard, well-understood, and native to FastAPI. |
| Database | PostgreSQL | 16.x | Relational database | User preference; powerful and reliable for structured data. |
| Authentication | API Key | N/A | Secure backend endpoints | Simple, effective for a personal tool without user logins. |
| Frontend Testing | Vitest & RTL | latest | Unit & component testing | Fast, modern, and integrates perfectly with Vite. |
| Backend Testing | Pytest | 8.x | Unit & integration testing | De facto standard for testing in the Python ecosystem. |
| E2E Testing | Playwright | 1.4x.x | End-to-end testing | Modern, reliable, and powerful for testing user flows. |
| Build Tool | Vite | 5.x | Frontend build tool | Extremely fast development server and optimized builds. |
| CI/CD | Vercel | N/A | Deployment and hosting | User preference; seamless Git integration. |
| Monitoring | Vercel Analytics | N/A | Usage and performance tracking | Built-in to the Vercel platform, easy setup. |
| Logging | Vercel Log Drains| N/A | Log management | Native integration with the Vercel platform. |
| CSS Framework | Tailwind CSS | 3.x | Utility-first styling | Rapid UI development and easy customization. |

---

## Data Models

#### Business
* **Purpose:** To store all aggregated information for a single business entity.
* **Key Attributes:**
    * `id`: (UUID) - Unique identifier for the business.
    * `name`: (Text) - The name of the business.
    * `address`: (Text) - The full street address.
    * `city`: (Text) - The city.
    * `state`: (Text) - The state (fixed to 'TX' for the MVP).
    * `zipCode`: (Text) - The postal code.
    * `latitude`: (Numeric) - The geographic latitude.
    * `longitude`: (Numeric) - The geographic longitude.
    * `website`: (Text, Nullable) - The business's website URL.
    * `phoneNumber`: (Text, Nullable) - The primary contact phone number.
    * `ownerName`: (Text, Nullable) - The name of the owner, if available.
    * `yearStarted`: (Integer, Nullable) - The year the business was founded.
    * `starRating`: (Numeric, Nullable) - The average customer rating (e.g., 4.5).
    * `reviewCount`: (Integer, Nullable) - The total number of reviews.
    * `naicsCode`: (Text, Nullable) - The North American Industry Classification System code.
* **Relationships:** For the MVP, this is a standalone model. Future iterations might introduce separate `Review` or `Owner` models.

##### TypeScript Interface
```typescript
export interface Business {
  id: string; // UUID
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  website?: string | null;
  phoneNumber?: string | null;
  ownerName?: string | null;
  yearStarted?: number | null;
  starRating?: number | null;
  reviewCount?: number | null;
  naicsCode?: string | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

---

## API Specification

```yaml
openapi: 3.0.0
info:
  title: Local Business Intelligence API
  version: 1.0.0
  description: API for retrieving and filtering local business data for a personal tool.
servers:
  - url: /api
    description: API server
paths:
  /businesses:
    get:
      summary: List and Filter Businesses
      description: Retrieves a list of businesses, with optional query parameters for filtering.
      security:
        - ApiKeyAuth: []
      parameters:
        - name: city
          in: query
          required: false
          schema:
            type: string
          description: Filter businesses by city.
        - name: starRating
          in: query
          required: false
          schema:
            type: number
            format: float
          description: Filter businesses with a star rating greater than or equal to the provided value.
        - name: naicsCode
          in: query
          required: false
          schema:
            type: string
          description: Filter businesses by a specific NAICS code.
        - name: yearStarted
          in: query
          required: false
          schema:
            type: integer
          description: Filter businesses started in a specific year.
      responses:
        '200':
          description: A JSON array of business objects.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Business'
components:
  schemas:
    Business:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        address:
          type: string
        city:
          type: string
        state:
          type: string
        zipCode:
          type: string
        latitude:
          type: number
          format: float
        longitude:
          type: number
          format: float
        website:
          type: string
          nullable: true
        phoneNumber:
          type: string
          nullable: true
        ownerName:
          type: string
          nullable: true
        yearStarted:
          type: integer
          nullable: true
        starRating:
          type: number
          format: float
          nullable: true
        reviewCount:
          type: integer
          nullable: true
        naicsCode:
          type: string
          nullable: true
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key


## Unified Project Structure

```plaintext
/
├── apps/
│   ├── frontend/         # React (Vite) application
│   │   ├── public/
│   │   ├── src/
│   │   └── package.json
│   └── backend/          # Python (FastAPI) application
│       ├── api/          # Vercel Serverless Functions location
│       │   └── index.py  # Main FastAPI app
│       ├── core/         # Core logic, services, etc.
│       ├── tests/
│       └── requirements.txt
├── packages/
│   ├── shared-types/     # Shared TypeScript interfaces (e.g., Business)
│   │   └── index.ts
│   └── config/           # Shared configs (ESLint, TSConfig)
├── .gitignore
├── package.json          # Root package.json with Turborepo workspaces
├── turbo.json            # Turborepo configuration
└── vercel.json           # Vercel deployment configuration


## Development Workflow

#### Local Development Setup
1.  **Prerequisites:** A developer will need Node.js (v20+), Python (v3.11+), and Turborepo CLI (`npm i -g turbo`) installed.
2.  **Initial Setup:** Run `npm install` in the root directory to install all dependencies for the monorepo.
3.  **Environment Variables:** Create a `.env` file in the `apps/backend` directory based on an `.env.example` file. It will contain the `DATABASE_URL` and keys for any external data APIs.

#### Development Commands
* **`turbo dev`:** This single command will run from the root directory to start the frontend Vite server and the backend FastAPI server concurrently.
* **`turbo test`:** This will run all frontend and backend tests.
* **`turbo lint`:** This will lint all code in the monorepo.

## Deployment Architecture

#### Deployment Strategy
* **Frontend:** The React application will be deployed as a static site to Vercel's Edge Network for global performance.
* **Backend:** The Python/FastAPI application will be deployed as Serverless Functions on Vercel.
* **Trigger:** Deployments will be automatically triggered by pushes to the `main` branch in our Git repository.

#### CI/CD Pipeline
* The entire CI/CD process is managed natively by Vercel, configured through the `vercel.json` and `turbo.json` files. For each Pull Request, Vercel will automatically build, deploy, and provide a unique Preview URL for review.

---

## Testing Strategy

* **Testing Pyramid:** Our strategy will be based on a strong foundation of fast unit tests, a comprehensive suite of integration tests for our API and data layers, and a few critical end-to-end (E2E) tests for the primary user flow (filtering and viewing results).
* **Test Organization:** Tests will live alongside the code. The `apps/frontend/src` directory will contain component tests (e.g., `MyComponent.test.tsx`), and the `apps/backend/tests` directory will contain the API tests.
* **Test Tools:** We will use **Vitest** for the frontend and **Pytest** for the backend. E2E tests will use **Playwright**.


---

## Coding Standards

* **Linting & Formatting:** We will use ESLint for the frontend and Ruff for the backend, with shared configurations in the `packages/config` directory to enforce a consistent style.
* **Critical Rules:**
    * **Shared Types:** All shared data structures (like the `Business` interface) **MUST** be defined in `packages/shared-types` and imported by both the frontend and backend to ensure type safety.
    * **Environment Variables:** Environment variables **MUST** be accessed through a dedicated configuration module, not directly from the environment.
    * **API Validation:** All backend API endpoints **MUST** validate incoming request data (bodies, parameters).

---

## Error Handling Strategy

* **Error Flow:** When the backend encounters an error, it will respond with a standardized JSON error format. The React frontend will have a global error handler to catch these API errors and display a user-friendly message from the UI/UX specification.
* **Error Response Format:** All API errors will return a JSON object with a consistent structure, for example: `{"detail": {"code": "RESOURCE_NOT_FOUND", "message": "The requested business could not be found."}}`.

---

## Security and Performance

#### Security Requirements
* **Backend Security:** The primary security measure for the MVP is **API Key Authentication**. The backend API will reject any requests that do not include a valid, secret API key in the request header.
* **Secret Management:** The API key and database credentials will be stored securely as environment variables on Vercel and must not be committed to the Git repository.

#### Performance Optimization
* **Frontend Performance:** The application will target a First Contentful Paint (FCP) of under 2.5 seconds, leveraging Vite's build optimizations and Vercel's Edge Network.
* **Backend Performance:** API response time for all filter queries will be under 2 seconds, as defined in the PRD.

---

## Monitoring and Observability

* **Monitoring Stack:** We will use **Vercel Analytics** for frontend usage and performance monitoring and **Vercel Log Drains** for backend serverless function logging.
* **Key Metrics:** We will monitor Core Web Vitals, API error rates, and serverless function execution duration to ensure the application remains healthy and performant.

---

## Checklist Results Report

With all sections defined, the final BMad Architect's Solution Validation Checklist has been run against this document. The architecture is sound, complete, and aligns with all project requirements.

* **Overall Readiness:** High
* **Critical Risks Identified:** None within the architectural plan. Key external risks (Data Availability) are noted in the Project Brief.
* **AI Implementation Readiness:** High. The architecture's clarity, defined patterns, and detailed structure are well-suited for AI agent implementation.
