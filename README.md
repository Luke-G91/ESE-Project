# Flux

A private, Twitter-like platform designed exclusively for groups of friends. Flux offers a secure, real-time social experience, allowing users to share updates, interact with posts, and manage friend groups within a trusted environment.

## Table of Contents

- [Overview](#overview)
- [Project Aim & Objectives](#project-aim--objectives)
- [System Architecture](#system-architecture)
- [Enterprise Considerations](#enterprise-considerations)
- [Key Features](#key-features)
- [Deployment](#deployment)
- [Installation & Usage Instructions](#installation--usage-instructions)
- [Known Issues & Future Enhancements](#known-issues--future-enhancements)
- [Video Demonstration](#video-demonstration)
- [References](#references)

## Overview

Flux is a full-stack enterprise application that mimics the core functionalities of Twitter, but is restricted to use by groups of friends. This application has a secure authentication system and focuses on performance, scalability, and a user-friendly design.

## Project Aim & Objectives

### Aim

To develop a secure, scalable, and user-friendly platform that provides a private social network for small groups of friends to communicate, share updates, and manage interactions in a trusted environment. The platform will provide security, efficient group management, and real-time communication.

### Objectives

- **Secure Authentication:** Utilise robust security measures (JWT, Hashing, and Salting) for user authentication, to protect users and sensitive data.
- **Group Management:** Enable users to create and manage friend groups for targeted communication.
- **Real-Time Interaction:** Implement real-time updates for groups, posts, and comments.
- **Robust Error Handling:** Provide comprehensive error handling and logging for reliability, improved issue identification, and ease of maintainance.

## System Architecture

The architecture is built using a three-layer structure, integrating modern frameworks and tools for efficiency, scalability, and user experience enhancement.

### Frontend

- Developed using TypeScript for robust type support, ensuring code reliability and maintainability.
- Vite is a build tool, which allows fast development and provides optimised performance.
- React provides the foundation for the reactive user interface, enabling a responsive and interactive web experience.
- React Query is used for efficient data fetching and state management, allowing easy integration with the backend.
- Axios is used as a replacement for the built-in fetch API, allowing communication with the backend API, and handling HTTP requests. Axios offers benefits such as simplified handling of complex request payloads, and automatic request cancellations, enhancing error handling and performance.
- React Router DOM manages navigation between pages, providing navigation between routes in a single page setup.
- React Toastify provides user notifications via toast messages, improving the interface's feedback mechanisms.

### Backend

- The backend is also developed using TypeSript for consistency between the frotend and backend, and the same declaration of types.
- The server-side logic is built using Express, a lightweight framework for handling business logic and data processing.
- JSON Web Tokens (JWT) are utilised for securing user sessions and authentication.
- Prisma acts as an ORM to manage database interactions with strong type safety and optimised performance.
- Dotenv is used for managing configuration variables securely, keeping sensitive data protected.
- Bcrypt ensures secure password handling via strong hashing and salting methods, offering protection against unauthorised access.

### Database

- The application uses PostgreSQL for storing user data, posts, and group information. This relational database ensures data integrity, scalability, and efficient query processing.

## Enterprise Considerations

- **Performance:**

  - In PostgreSQL, primary keys are indexed by default. Additional indexes have been created on user emails and post creation dates, chosen to improve query performance and reduce latency, as these values are frequently used for finding and sorting datafinding and sorting datafinding and sorting datafinding and sorting datafinding and sorting datafinding and sorting datafinding and sorting datafinding and sorting datafinding and sorting data.
  - Frontend optimisations are achieved using Vite's default features, including hot module replacement (HMR) and code splitting. HMR allows real-time updates without a full refresh during development, preserving application state, while code splitting reduces initial load times by splitting the code into smaller chunks loaded on demand.

- **Scalability:**

  - Vercel and Railway both support automatic scaling of the frontend and backend to manage varying traffic. However, this scalability is dependant on the selected plan. The free plan offers fewer resources compared to the pro plan, so future upgrades may be necessary to accommodate very high usage and growth.
  - Supabase offers horizontal scaling capabilities for the PostgreSQL database, accommodating increasing data storage and query demands as the application grows.

- **Robustness:**

  - TypeScript is utilised on both the frontend and backend to provide type safety, enhancing development efficiency and reducing potential runtime errors.
  - Comprehensive error handling systems are in place on both the backend and frontend, with backend error handling designed to present user-readable messages, but more detailed error messages can be found in the logs. React Query on the frontend handles error states efficiently, while React Toastify is used to display error notifications, preventing application crashes.
  - Prisma ORM standardises and optimises database interactions, providing a history of migrations for easy rollback and updates.
  - Logging provided by Railway, Vercel, and Supabase enables real-time issue diagnosis.

- **Security:**

  - The application uses industry-standard security practices with JWT for authentication, minimising server-side session management and freeing up server resources. Bcrypt is used for secure password hashing, and environment variables ensure configurations remain secure.
  - Prisma helps in preventing SQL injection by using parameterised queries, which automatically handle input sanitisation, ensuring that user inputs are safely interpreted by the database.
  - Both frontend and backend validation are implemented, ensuring data integrity and security by validating user inputs such as passwords, before processing.

- **Additional Considerations:**
  - Modular design on both the backend and frontend promote code reuse and maintainability, allowing easier updates and debugging.
  - Express, combined with async/await, efficiently handles concurrent requests, enhancing server responsiveness.

## Key Features

### User Authentication

- **Purpose:** Secure login and registration ensures that only authorised users can access the application. This protects personal data and maintains privacy within the friend group.
- **Code Location:**
  - Backend:
    - [User controller](./backend/api/controllers/userController.ts)
    - [Auth router](backend/api/routers/authRouter.ts)
  - Frontend:
    - [Login page](./frontend/src/pages/Login.tsx)
    - [Register page](./frontend/src/pages/Register.tsx)
- **Technical Details:**

  - Endpoints:
    - `POST /register` for user registration
    - `POST /login` for user login
    - `POST /logout` for user logout
    - `GET /userInfo` for fetching current user details
  - Relevant Modules/Classes:
    - [Auth middleware](./backend/api/middleware/authenticateToken.ts)
    - [User models](./backend/api/models/user/)
    - [Frotend API handler](./frontend/src/api/auth.ts)
    - [Auth context provider](./frontend/src/context/AuthContext.tsx)
    - [Protected routes](./frontend/src/components/ProtectedRoute.tsx)

### Group Management

- **Purpose:** Manage friend groups for private interactions. This feature enables users to create personalised circles, ensuring that content is shared selectively and remains within trusted communities.
- **Code Location:**
  - Backend:
    - [Group controller](./backend/api/controllers/groupController.ts)
    - [Group router](./backend/api/routers/groupRouter.ts)
  - Frontend:
    - [Group component](./frontend/src/components/Group.tsx)
    - [Specific group page](./frontend/src/pages/GroupDetails.tsx)
    - [Group list page](./frontend/src/pages/Groups.tsx)
- **Technical Details:**

  - Endpoints:
    - `GET /group` for fetching a user's groups
    - `POST /group` for creating a new group
    - `GET /group/{groupId}` for fetching a specific group
    - `GET /group/{groupId}/post` for fetching the posts within a group
    - `POST /group/{groupId}/user` for adding a user to a group
    - `DELETE /group/{groupId}/user` for removing a user from a group
  - Relevant Modules/Classes:
    - [Group models](./backend/api/models/group/)
    - [Frotend API handler](./frontend/src/api/group.ts)

### Post Creation & Timeline

- **Purpose:** Users can create posts and view a real-time feed from friends. This core functionality allows for communication between friends, allowing users to express themselves and stay updated in a private, controlled network.
- **Code Location:**
  - Backend:
    - [Post controller](./backend/api/controllers/postController.ts)
    - [Post router](./backend/api/routers/postRouter.ts)
  - Frontend:
    - [Post component](./frontend/src/components/Post.tsx)
    - [Home page with post list](./frontend/src/pages/Home.tsx)
- **Technical Details:**

  - Endpoints:
    - `GET /post` for fetching the users timeline feed
    - `GET /post/{postId}` for fetching a specific post
    - `POST /post` for creating a post
  - Relevant Modules/Classes:
    - [Post models](./backend/api/models/post/)
    - [Frotend API handler](./frontend/src/api/post.ts)

### Interactions (Liking and Commenting)

- **Purpose:** Enhance post engagement through liking and commenting features, promoting active participation within the social network.
- **Code Location:**
  - Backend:
    - [Like controller](./backend/api/controllers/postLikeController.ts)
    - [Post router with like routes](./backend/api/routers/postRouter.ts)
    - [Comment controller](./backend/api/controllers/commentController.ts)
    - [Comment router](./backend/api/routers/commentRouter.ts)
  - Frontend:
    - [Post component with like button](./frontend/src/components/Post.tsx)
    - [Post comment list](./frontend/src/pages/PostDetail.tsx)
    - [Comment component](./frontend/src/components/Comment.tsx)
- **Technical Details:**
  - Endpoints:
    - `POST /post/{postId}/like` for liking a post
    - `DELETE /post/{postId}/like` for removing a like from a post
    - `GET /post/{postId}/comment` for fetching the comments on a post
    - `POST /post/{postId}/comment` for commenting on a post
  - Relevant Modules/Classes:
    - [Comment models](./backend/api/models/comment/)
    - [Frotend API handler](./frontend/src/api/comment.ts)

## Deployment

- **Database:** The PostgreSQL database is hosted on Supabase. This setup provides a robust, scalable, and fully managed SQL database, with reliable data storage and efficient query processing for the application's data needs.
- **Backend:** The backend was previously deployed as serverless functions on Vercel. This approach removes the need for traditional servers, offering on-demand scaling, reduced maintenance, and cost efficiency while allowing fast and secure API responses. However, due to free plan limits on the number of functions availiable this was moved to a server hosted on Railway.
- **Frontend:** The frontend is also deployed on Vercel. Vercel’s optimised hosting environment means the application benefits from fast load times, ensuring a smooth and responsive user experience.
- **Environment Variables:** Sensitive configuration details such as the database URL and authentication secrets are stored securely using environment variables. These are managed within Vercel and Railway to ensure security, and prevent unauthorised access.

## Installation & Usage Instructions

### Prerequisites

- Node.js and npm
- Serve npm package (Only required to serve frontend from build, not necessary for local running)
- Git
- A PostgreSQL database, or Docker to follow local database setup

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone git@github.com:Luke-G91/ESE-Project.git
   cd ESE-Project/
   ```

_Note: All subsequent command blocks assume you are in the root `ESE-Project/` directory._

2. **Install Dependencies**

   ```bash
   cd backend/
   npm i
   cd ../frontend/
   npm i
   ```

3. **Configure Environment Variables**
   - Create a `.env` file with necessary configurations.

#### **Frontend Environment Variables (./frontend/.env)**

```env
VITE_API_URL=<backend-base-url> # The URL where your backend is hosted
```

#### **Backend Environment Variables (./backend/.env)**

```env
DATABASE_URL=<your-database-url> # Example format: postgresql://<username>:<password>@<host>:<port>/<database-name>
PORT=<backend-port> # The port number your backend server will run on, App defaults to 3000 if not provided
JWT_SECRET=<your-jwt-secret-key> # A secret key for JWT signing
FRONTEND_URL=<frontend-base-url> # The URL where your frontend is hosted
```

4. **Setup**

   - Local database (Optional):

     ```bash
     docker compose up
     ```

   - Apply migrations:

     ```bash
     cd backend/
     npx prisma generate
     npx prisma migrate deploy
     ```

   Use `DATABASE_URL=postgresql://myuser:mypassword@localhost:5433/mydatabase` in the backend env

5. **Run the Application**

   - Start the backend:

     ```bash
     cd backend/
     npm run dev
     ```

   - Build the backend:

     ```bash
     cd backend/
     npm run build
     cd ..
     ```

   This can then be run with `node backend/dist/app.js`

   - Start the frontend:

     ```bash
     cd frontend/
     npm run dev
     ```

   - Build the frontend:

     ```bash
     cd frontend/
     npm run build
     cd ..
     ```

     The static html can then be served `serve -s frontend/dist`

## Known Issues & Future Enhancements

### Known Issues

- **Single Server Location:** Currently, the application is hosted in a single server location (EU West). This can lead to slower API request response times for users further from the server, as latency increases with geographic distance. Expanding to multiple server locations would improve the experience for these users.
- **Limited Free Plan Resources:** The current infrastructure relies on free plans, which limits the available resources. Under high demand, performance will be lower, and could lead to service throttling, limiting the application's scalability and reliability.
- **Cross-Browser Compatibility:** The application was only tested on a single browser (Arc), there could be inconsistencies when using other browsers or older versions.
- **Real-Time Features:** In areas with poor connectivity, users may experience delays or interruptions in receiving the latest updates for post, comments and likes.
- **Mobile Responsiveness:** The application was designed for use on desktop, and so the layout and design may not work as intended on mobile devices.

### Future Enhancements

- Enable editing and deletion of posts and comments, allowing users to better manage their content.
- Implement group roles, such as admin and user, to improve group management and prevent unauthorised addition or removal of members.
- Introduce media support within posts, which will require a storage solution such as blob storage. This will improve the user experience by allowing users to express themselves more.
- Add loading indicators on buttons to indicate pending API requests and prevent redundant repeated requests.
- Improve the home page by adding sorting, filtering, and searching capabilities, providing users with greater control over the content they view.

## Video Demonstration

[Video Walkthrough](https://youtu.be/dQw4w9WgXcQ?si=_EgZeKjfwuHzK69Q)

## References

### Development Tools and Frameworks

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Vite](https://vitejs.dev/)

### Libraries

- [Axios](https://axios-http.com/)
- [React Query](https://tanstack.com/query/latest)
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction)
- [React Router DOM](https://www.npmjs.com/package/react-router-dom)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Dotenv](https://www.npmjs.com/package/dotenv)

### Database and ORM

- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)

### Authentication and Security

- [JSON Web Tokens (JWT)](https://jwt.io/)

### Hosting and Deployment Platforms

- [Vercel](https://vercel.com/)
- [Railway](https://railway.app/)
- [Supabase](https://supabase.com/)

### Version Control

- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)

### Additional Tools

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
