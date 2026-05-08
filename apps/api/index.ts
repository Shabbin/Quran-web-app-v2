import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  getAllSurahs,
  getSurahById,
  searchAyahs,
} from "@quran-web-app/data";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "OPTIONS"],
  })
);

app.get("/", (c) => {
  return c.json({
    message: "Quran Web App API",
    status: "running",
    endpoints: ["/health", "/surahs", "/surahs/:id", "/search?q=mercy"],
  });
});

app.get("/health", (c) => {
  return c.json({
    ok: true,
    service: "quran-web-app-api",
  });
});

app.get("/surahs", (c) => {
  return c.json({
    data: getAllSurahs(),
  });
});

app.get("/surahs/:id", (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1 || id > 114) {
    return c.json(
      {
        error: "Invalid surah id. Surah id must be between 1 and 114.",
      },
      400
    );
  }

  const surah = getSurahById(id);

  if (!surah) {
    return c.json(
      {
        error: "Surah not found.",
      },
      404
    );
  }

  return c.json({
    data: surah,
  });
});

app.get("/search", (c) => {
  const query = c.req.query("q") ?? "";

  return c.json({
    query,
    data: searchAyahs(query),
  });
});

const port = Number(process.env.PORT ?? 4000);

export default {
  port,
  fetch: app.fetch,
};

console.log(`API running at http://localhost:${port}`);