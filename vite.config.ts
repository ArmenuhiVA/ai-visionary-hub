import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    routers: {
      server: {
        entry: "server",
      }
    }
  },
  nitro: {
    preset: "vercel"
  }
});