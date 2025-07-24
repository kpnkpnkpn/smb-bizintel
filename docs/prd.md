# Local Business Intelligence Platform Product Requirements Document (PRD)

## Goals and Background Context

#### Goals
* To create a personal business intelligence tool that significantly reduces the time and effort required for deal sourcing and competitive intelligence research.
* To replace a manual, fragmented workflow with a centralized, filterable, and map-based platform.
* To build an MVP focused on Texas restoration businesses that serves as a scalable foundation for future expansion into other sectors and geographies.

#### Background Context
The project addresses the challenge of gathering and analyzing data on local service businesses, which is currently a manual and inefficient process. By aggregating scattered information (reviews, location, NAICS codes, etc.) into a single, structured tool, the user can make faster, more informed decisions for personal investment and research. The MVP is a purpose-built tool for the user's specific workflow, prioritizing function over form to quickly deliver value.

#### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-07-24 | 1.0 | Initial PRD Draft from Project Brief | John (PM) |

---

## Requirements

#### Functional
1.  The system shall aggregate data for restoration businesses located in Texas from various online sources.
2.  The system shall collect and store the following data points for each business: contact info, owner info, reviews, star ratings, website link, year started, and NAICS code.
3.  The user shall be able to filter the aggregated list of businesses by any of the collected core data points.
4.  The system shall display the filtered business data in a sortable list or table view.
5.  The system shall display the geographic locations of filtered businesses on an interactive map.

#### Non Functional
1.  All filtering and map update operations shall complete and render in under two seconds.
2.  The system shall operate as a standalone, single-user application without requiring user authentication or accounts.
3.  The system must have a mechanism to refresh the aggregated data to ensure it is up-to-date. Real-time updates are not required for the MVP.
4.  The application shall be built using the specified technology stack: React (frontend), Python (backend), and PostgreSQL (database).
5.  The application shall be deployable to Vercel.

---

## User Interface Design Goals

#### Overall UX Vision
The UX vision is a data-centric, highly functional interface that prioritizes speed and clarity over aesthetic complexity. The goal is to provide the user with the quickest possible path to finding, filtering, and analyzing the business data they need.

#### Key Interaction Paradigms
* **Central Filter Panel:** A persistent and powerful filtering panel will be the primary method of interacting with the data.
* **Dual View (List/Map):** The user can instantly toggle between a detailed, sortable list view and a geographic map view of the filtered results.
* **Direct Data Access:** The interface will provide clear, direct links to source data (e.g., the business's website) for quick verification.

#### Core Screens and Views
* **Main Dashboard:** A single-page application view containing the filter panel, the data display area (which toggles between list and map views), and the results. No other major screens are planned for the MVP.

#### Accessibility
* **WCAG AA:** While this is a personal tool, the UI will adhere to basic accessibility standards to ensure usability.

#### Branding
* No specific branding is required for the MVP. A clean, minimalist, and professional design will be used.

#### Target Device and Platforms
* **Web Responsive:** The primary target is a desktop web browser. The application should be responsive and functional on mobile browsers, but the experience will be optimized for desktop.

---

## Technical Assumptions

#### Repository Structure
* **Monorepo:** A single repository will be used for both the frontend and backend code to simplify project management.

#### Service Architecture
* **Monolith:** The backend will be built as a single, unified application, which is a suitable and efficient approach for this project's MVP.

#### Testing Requirements
* **Unit + Integration:** The testing strategy will include both unit tests for individual components and integration tests to ensure different parts of the application work together correctly. This provides a good balance of speed and confidence for the MVP.

#### Additional Technical Assumptions and Requests
* **Frontend:** The frontend will be built with **React**.
* **Backend:** The backend will be built with **Python**.
* **Database:** The database will be **PostgreSQL**.
* **Hosting:** The application will be deployed on **Vercel**.
* **Performance:** All user-facing data operations (filtering, map updates) must complete in under two seconds.
* **Target Platform:** The primary target platform is modern desktop browsers.

---

## Epic List

* **Epic 1: Foundation & Core Data Display:** Establish the full-stack application foundation, deployment pipeline, and core data aggregation logic to display a basic list of businesses with their key data points.
* **Epic 2: Interactive Analysis - Filtering & Map View:** Implement the core interactive features, including the multi-variable filtering panel and the geographic map visualization.

---

## Epic 1: Foundation & Core Data Display

**Goal:** To establish the complete, end-to-end technical foundation of the application. This includes setting up the frontend and backend projects within a monorepo, establishing the database schema, and creating a basic data pipeline to ingest and display business information. By the end of this epic, we will have a deployed, working application that successfully pulls data from a single source and displays it in a list, proving the viability of the core architecture.

#### Story 1.1: Project Scaffolding & Initial Deployment
*As the platform owner, I want a complete project structure with a frontend and backend, deployed to Vercel, so that I have a working foundation to build features on.*
* **Acceptance Criteria:**
    1. A monorepo is initialized to hold the project's code.
    2. A basic React application is created in the `frontend` directory.
    3. A basic Python application is created in the `backend` directory.
    4. A PostgreSQL database is provisioned and connected to the backend application.
    5. The project is successfully deployed to Vercel, displaying a simple placeholder page.

#### Story 1.2: Database Schema & Model Creation
*As the platform owner, I want the database schema for storing business information created, so that the application has a place to save aggregated data.*
* **Acceptance Criteria:**
    1. A 'businesses' table is created in the PostgreSQL database.
    2. The table includes columns for all core data points (e.g., name, address, rating, naics_code, owner_info, website, year_started).
    3. A corresponding data model is created in the Python backend to interact with the 'businesses' table.

#### Story 1.3: Backend Data Ingestion Service
*As the platform owner, I want a backend service that can retrieve data for a business from an API source, so that the data pipeline is established.*
* **Acceptance Criteria:**
    1. A backend service is created that calls an external API (e.g., Google Places) to fetch data for a specific business.
    2. The retrieved data is correctly mapped to the database model from Story 1.2.
    3. The data for at least one sample business is successfully saved to the 'businesses' table.

#### Story 1.4: Backend API Endpoint for Businesses
*As the platform owner, I want a backend API endpoint that returns a list of all stored businesses, so that the frontend has a data source to consume.*
* **Acceptance Criteria:**
    1. An API endpoint (e.g., `/api/businesses`) is created in the Python backend.
    2. When called, the endpoint retrieves all records from the 'businesses' table.
    3. The data is returned in a structured JSON format.

#### Story 1.5: Frontend Data Display
*As a user, I want to see the list of aggregated businesses in a simple table view, so that I can verify the data is being collected.*
* **Acceptance Criteria:**
    1. The React frontend calls the `/api/businesses` endpoint on page load.
    2. The retrieved list of businesses is displayed in a simple, unstyled table.
    3. The table correctly shows all the core data points for each business retrieved from the backend.

---

## Epic 2: Interactive Analysis - Filtering & Map View

**Goal:** To transform the basic data display from Epic 1 into a powerful, interactive analysis tool. We will build the core user-facing features: a comprehensive filtering panel and a dynamic map visualization. By the end of this epic, the user will be able to actively query their aggregated data and analyze it geographically, fulfilling the primary use case of the application.

#### Story 2.1: Frontend Filtering UI Panel
*As a user, I want a filtering panel with controls for all core data points, so that I can define my search criteria.*
* **Acceptance Criteria:**
    1. A dedicated filter panel component is created in the React frontend.
    2. The panel includes input fields or dropdowns for each core data point (name, city, star rating, NAICS code, etc.).
    3. The state of the filter inputs is managed within the frontend application.
    4. An "Apply Filters" button is present and clearly visible.

#### Story 2.2: Backend Filtering Logic
*As the platform owner, I want the `/api/businesses` endpoint to accept filter parameters, so that it can return a targeted subset of data.*
* **Acceptance Criteria:**
    1. The `/api/businesses` endpoint in the Python backend is updated to accept query parameters corresponding to the filterable fields.
    2. The database query correctly applies the provided filters to the 'businesses' table.
    3. If no filters are provided, the endpoint returns all businesses, maintaining existing functionality.
    4. The endpoint returns the filtered list of businesses in the correct JSON format.

#### Story 2.3: Frontend Filter Integration
*As a user, I want to click the 'Apply Filters' button and see the business list update with my search results, so that I can perform my analysis.*
* **Acceptance Criteria:**
    1. When the "Apply Filters" button is clicked, the frontend makes a request to the `/api/businesses` endpoint with the current filter state as query parameters.
    2. The business list view is cleared and re-populated with the data returned from the API.
    3. A loading indicator is displayed while the data is being fetched.
    4. If no results are found, a "No results found" message is displayed.

#### Story 2.4: Basic Map Component Integration
*As a user, I want to see a map of the United States centered on Texas, so that I have a canvas for geographic visualization.*
* **Acceptance Criteria:**
    1. A new map component is added to the main dashboard view.
    2. An external mapping library (e.g., Leaflet, Mapbox) is integrated into the React application.
    3. The map component correctly displays on the dashboard, initially showing a view centered on Texas.

#### Story 2.5: Plotting Filtered Businesses on the Map
*As a user, I want to see the filtered businesses appear as pins on the map, so that I can understand their geographic distribution.*
* **Acceptance Criteria:**
    1. After a list of businesses is fetched, a pin is placed on the map for each business at its correct geographic coordinates.
    2. Clicking on a pin displays a simple popup with the business's name.
    3. The map view updates with new pins whenever the filter results change.
    4. The map automatically adjusts its zoom and center to appropriately display all the pins from the current search result.

---

## Checklist Results Report

The BMad Product Manager checklist has been executed against this PRD. All sections meet the criteria for clarity, completeness, and readiness for the architecture and design phase.

| Category | Status | Critical Issues |
| :--- | :--- | :--- |
| 1. Problem Definition & Context | PASS | None |
| 2. MVP Scope Definition | PASS | None |
| 3. User Experience Requirements | PASS | None |
| 4. Functional Requirements | PASS | None |
| 5. Non-Functional Requirements | PASS | None |
| 6. Epic & Story Structure | PASS | None |
| 7. Technical Guidance | PASS | None |
| 8. Cross-Functional Requirements | PASS | None |
| 9. Clarity & Communication | PASS | None |

**Final Decision:** READY FOR ARCHITECT & UX

---

## Next Steps

#### UX Expert Prompt
This PRD is now complete. Please review the 'User Interface Design Goals' section and use this document as the primary input to create the detailed UI/UX Specification.

#### Architect Prompt
This PRD is now complete. Please review the 'Technical Assumptions' and 'Requirements' sections and use this document as the primary input to create the detailed Architecture Document.