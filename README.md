# Roommate Compatibility & PG Booking Website

A comprehensive full-stack application that matches users for roommate compatibility and allows PG owners to list and manage accommodations. Built with a MERN stack (MongoDB, Express, React, Node.js) and powered by a separate FastAPI Python Machine Learning service to rank compatibility using AI.

## Architecture

*   **Frontend**: React, Vite, TailwindCSS, Socket.IO Client.
*   **Backend**: Node.js, Express, MongoDB, Socket.IO, JWT.
*   **ML Service**: FastAPI, scikit-learn, joblib (Cosine Similarity for matchmaking).
*   **Third-Party Services**: Google Maps API (Distance Matrix), Cloudinary (Image/File Uploads).

## Features

1.  **AI-Powered Matchmaking**: Ranks users based on their lifestyle preferences, location, and personality vectors.
2.  **PG Discovery & Booking**: Users can discover PGs from matched users and book rooms.
3.  **Real-Time Chat**: Integrated Socket.IO chat to converse with potential roommates.
4.  **Notifications**: Browser-native push notifications for incoming real-time messages.

## Prerequisites

*   Node.js (v18+)
*   Python (v3.10+)
*   MongoDB Cluster (Atlas or local)
*   Cloudinary Account (for file uploads)
*   Google Maps API Key (for location distance calculation)

## Environment Variables

You need to configure `.env` files for both the `backend` and `frontend`.

### `backend/.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
GOOGLE_MAP_KEY=your_google_maps_api_key
ML_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Running the Application Locally

1.  **Start the Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```

2.  **Start the ML Service**:
    ```bash
    cd backend/ml-service
    pip install -r requirements.txt
    uvicorn app:app --host 0.0.0.0 --port 8000
    ```

3.  **Start the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Production Deployment

The backend server is configured to serve the compiled frontend statically if the `NODE_ENV` is set to `production`.

1.  Build the frontend:
    ```bash
    cd frontend
    npm run build
    ```
2.  Start the production server:
    ```bash
    cd backend
    export NODE_ENV=production
    npm start
    ```
