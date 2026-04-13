# Coffee House Management System - UI Renderer

This directory contains the React-based frontend for the Management System, built with Vite and Tailwind CSS.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **Package Manager**: `npm` or `yarn`.
- **Backend API**: Ensure the backend server is running (usually on `http://localhost:3000`) as the UI communicates with it for authentication and data.

## Getting Started

1.  **Install Dependencies**:
    Navigate to the root directory of the project and run:

    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Ensure your environment variables are set up in the root `.env` file to point to the correct API URL:

    ```env
    VITE_API_URL=http://localhost:3000
    ```

3.  **Run in Development Mode**:
    To start the renderer with Hot Module Replacement (HMR):

    ```bash
    npm run dev
    ```

    The application will typically be available at `http://localhost:5173`.

4.  **Build for Production**:
    To generate optimized static assets:
