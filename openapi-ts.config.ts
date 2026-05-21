import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    "https://raw.githubusercontent.com/polaariiss/kosongin-backend/refs/heads/main/openapi.yaml",

  output: "src/api",
});