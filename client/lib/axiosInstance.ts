import axios from "axios";

// Define a type for the headers that includes both ContentType and optionally Host
type Headers = {
  ContentType: string;
  Host?: string; // The '?' makes the Host property optional
};

const CLIENT_API_BASE_URL = "/api";
const SERVER_API_BASE_URL =
  "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api";

// Function to conditionally set the base URL

const baseURL =
  typeof window !== "undefined" ? CLIENT_API_BASE_URL : SERVER_API_BASE_URL;

// Function to conditionally set headers
const getHeaders = (): Headers => {
  // Use the Headers type for the return value
  // Default headers
  const headers: Headers = {
    // Explicitly declare headers as type Headers
    ContentType: "application/json",
  };

  // Add the Host header for server-side requests
  if (typeof window === "undefined") {
    // This means it's server-side
    headers["Host"] = "ticket-app.com";
  }

  return headers;
};

const axiosInstance = axios.create({
  baseURL,
  headers: getHeaders(),
});

export default axiosInstance;
