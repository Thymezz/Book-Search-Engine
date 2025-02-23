/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GRAPHQL_URI: string; // ✅ Define your GraphQL URI environment variable
    readonly VITE_API_BASE_URL?: string; // ✅ (Optional) Define other environment variables if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  