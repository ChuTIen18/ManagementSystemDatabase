import express from 'express';
import { createServer } from '../api/server';

let apiServer: any = null;

export async function startAPIServer(): Promise<any> {
  try {
    const app = createServer();
    const port = process.env.API_PORT || 3001;

    return new Promise((resolve, reject) => {
      apiServer = app.listen(port, () => {
        console.log(`✓ API Server running on http://localhost:${port}`);
        resolve(apiServer);
      });

      apiServer.on('error', (error: any) => {
        console.error('Failed to start API server:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
    throw error;
  }
}

export function stopAPIServer(): void {
  if (apiServer) {
    apiServer.close(() => {
      console.log('API Server stopped');
    });
    apiServer = null;
  }
}
