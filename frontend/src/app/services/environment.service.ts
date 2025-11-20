import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private getEnvironmentVariable(varName: string): string | null {
    // Check for browser environment with window object
    if (typeof window !== 'undefined') {
      // Check if environment variables are available via window object
      if ((window as any).process?.env) {
        return (window as any).process.env[varName] || null;
      }
      
      // Check for environment variables injected at build time
      if ((window as any).__env && (window as any).__env[varName]) {
        return (window as any).__env[varName];
      }
    }
    
    // Fallback for server-side environment variables
    if (typeof process !== 'undefined' && process.env) {
      return process.env[varName] || null;
    }
    
    return null;
  }

  // PUBLIC_INTERFACE
  getApiBaseUrl(): string | null {
    /**
     * Returns the API base URL from environment variables.
     * Checks NG_APP_API_BASE first, then NG_APP_BACKEND_URL.
     */
    return this.getEnvironmentVariable('NG_APP_API_BASE') || 
           this.getEnvironmentVariable('NG_APP_BACKEND_URL');
  }

  // PUBLIC_INTERFACE
  isProductionMode(): boolean {
    /**
     * Determines if the application is running in production mode.
     */
    const nodeEnv = this.getEnvironmentVariable('NG_APP_NODE_ENV');
    return nodeEnv === 'production';
  }
}
