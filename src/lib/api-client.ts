import { createClient } from "@/api/client";

export const client = createClient({
  baseUrl:
    "https://kosongin-backend-production.up.railway.app/api",
});