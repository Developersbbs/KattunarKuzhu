### **Project Plan: Kattunar Kuzhu NestJS Server**

This plan outlines the development of the backend services for the Kattunar Kuzhu application, covering everything from project setup to the implementation of core features.

#### **Phase 1: Project Setup & Core Foundation**

*   **Objective**: Initialize the NestJS project and establish the core architecture, including database connection and foundational data models.
*   **Tasks**:
    1.  Create a new directory: `kattunar-kuzhu-server`.
    2.  Initialize a new NestJS project inside the directory.
    3.  Integrate Mongoose and connect to a MongoDB database.
    4.  Set up environment variable management (`@nestjs/config`) for configuration.
    5.  Define the initial Mongoose schemas for core entities: `User`, `Business`, `Group`, `Role`, and `Permission`.

#### **Phase 2: Authentication & Role-Based Access Control (RBAC)**

*   **Objective**: Implement a secure authentication system and a granular, permission-based authorization layer.
*   **Tasks**:
    1.  Create an `Auth` module.
    2.  Implement a custom authentication strategy to validate Firebase ID tokens from the client.
    3.  Upon successful Firebase token validation, generate and return a local session JWT.
    4.  Create the RBAC module to manage `Roles` and `Permissions`.
    5.  Develop custom Guards to protect API endpoints based on user roles and specific permissions (e.g., `create:meeting`).
    6.  Create a database seeding script to populate the initial set of roles (`Member`, `Group Head`, `Admin`, `Super Admin`) and their permissions.

#### **Phase 3: User, Business, & Registration Flow**

*   **Objective**: Build the endpoints for managing user/business profiles and implement the complete member registration and approval workflow.
*   **Tasks**:
    1.  Develop `Users` and `Business` modules with full CRUD functionality.
    2.  Create the multi-step registration endpoint that handles user and business data submission.
    3.  Implement the approval workflow logic (`pending_group_head_approval` -> `pending_admin_approval` -> `active`).
    4.  Set up a temporary local file storage solution for profile picture uploads.

#### **Phase 4: Group Management**

*   **Objective**: Implement the functionality for creating and managing groups.
*   **Tasks**:
    1.  Create a `Groups` module.
    2.  Implement endpoints for creating, viewing, and managing groups.
    3.  Add functionality for members to request to join a group.
    4.  Implement logic for `Group Heads` to approve or reject membership requests for their specific group.

#### **Phase 5: Core Feature - Requirements & Posts**

*   **Objective**: Build the system for creating, viewing, and managing requirement posts.
*   **Tasks**:
    1.  Create a `Posts` module and define the `RequirementPost` schema.
    2.  Implement CRUD endpoints for managing posts.
    3.  Add advanced filtering capabilities (by category, status, timeframe).
    4.  Integrate WebSockets (`@nestjs/websockets`) to provide real-time updates for new posts and responses.

#### **Phase 6: Core Feature - Meetings & Scheduling**

*   **Objective**: Develop the comprehensive meetings and one-on-one scheduling system.
*   **Tasks**:
    1.  Create a `Meetings` module with schemas for `Meeting` and `OneOnOne`.
    2.  Build endpoints for scheduling and managing group meetings (General, Special, Training).
    3.  Implement the one-on-one meeting workflow: request, accept/decline, and view past/upcoming.
    4.  Develop functionality for marking attendance and uploading verification selfies (using the temporary local storage).
    5.  Use WebSockets to push real-time notifications for meeting requests and status changes.

#### **Phase 7: Notification System**

*   **Objective**: Integrate services for sending push and email notifications for key application events.
*   **Tasks**:
    1.  Create a `Notifications` module.
    2.  Integrate a push notification provider (like Firebase Cloud Messaging) to send alerts to mobile devices.
    3.  Integrate the **Resend** email service for transactional emails.
    4.  Implement service methods to trigger notifications for events like registration approval, new meeting requests, post responses, etc.

#### **Phase 8: Finalization & API Documentation**

*   **Objective**: Polish the application with robust validation, logging, and documentation to prepare it for deployment.
*   **Tasks**:
    1.  Implement thorough input validation on all DTOs using `class-validator`.
    2.  Set up structured logging for monitoring and debugging.
    3.  Integrate Swagger (`@nestjs/swagger`) to automatically generate API documentation.
    4.  Prepare for future AWS S3 integration by creating an abstract `StorageService` that can easily be switched from local storage to S3.
