# Insurance Application


## Prerequisites

- [Java 21](https://adoptium.net/)
- [PNPM](https://pnpm.io/installation)
- [MySQL](https://dev.mysql.com/downloads/) (for backend database)
- [Maven](https://maven.apache.org/download.cgi)

## Setup and Running the Backend (insurance-api)

1. Navigate to the backend directory:
   ```bash
   cd insurance-api
   ```

2. Build the application:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080` by default.

## Setup and Running the Frontend (insurance-web)



1. Navigate to the frontend directory:
   ```bash
   cd insurance-web
   ```

2. Install dependencies using PNPM:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend will start on `http://localhost:5173` by default.

## API Endpoints

The backend exposes the following API endpoints:
- Health check: `GET /api/health`
- Vehicles: `GET /api/vehicles`
- Insurance: `GET /api/insurance`

For more details, please refer to the Postman collection in `insurance-api/insurance-api.postman_collection.json`.

## Additional Commands

### Backend
- Run tests: `mvn test`
- Package the application: `mvn package`

### Frontend
- Build for production: `pnpm build`
- Preview the production build: `pnpm preview`
- Lint the code: `pnpm lint` 