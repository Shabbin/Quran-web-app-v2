import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Quran Web App API",
    status: "running",
  });
});

app.get("/health", (c) => {
  return c.json({
    ok: true,
    service: "quran-web-app-api",
  });
});

const port = 4000;

export default {
  port,
  fetch: app.fetch,
};

console.log(`API running at http://localhost:${port}`);