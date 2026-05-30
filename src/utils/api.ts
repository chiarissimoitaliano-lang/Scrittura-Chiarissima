/**
 * Returns the fully qualified API URL or relative path depending on where the application is hosted.
 * If visited on standard localhost or on direct Cloud Run instances, we use the relative path.
 * If visited on third-party static hosts (like Netlify or Vercel), we route requests to the active
 * Cloud Run instance backend to ensure that submissions, corrections, and AI agents work perfectly.
 */
export function getApiUrl(endpoint: string): string {
  const host = window.location.hostname;
  
  // If we are on localhost or on direct Cloud Run, relative APIs work perfectly.
  if (
    host === "localhost" || 
    host === "127.0.0.1" || 
    host.endsWith("run.app")
  ) {
    return endpoint;
  }
  
  // If we are on Netlify or elsewhere, route to the live backend instance
  const baseUrl = "https://ais-pre-am3rmyyt2afox46wx5afiw-567953750766.us-west2.run.app";
  
  // Normalize forward slash combination
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}
