import { createClient } from "@/api/client";

export const client = createClient({
  baseUrl:
    "https://kosongin-backend-production.up.railway.app/api",
});

client.interceptors.request.use((request) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return request;
});