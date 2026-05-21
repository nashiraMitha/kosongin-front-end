import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://kosongin-backend-production.up.railway.app",
});

export default api;