const { app } = require("@azure/functions");
const { Client } = require("pg");

app.http("testdb", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (_req, ctx) => {
    const client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      const r = await client.query("SELECT NOW() AS current_time;");
      await client.end();
      return { jsonBody: { ok: true, current_time: r.rows[0].current_time } };
    } catch (e) {
      ctx.log("DB error:", e);
      return { status: 500, jsonBody: { ok: false, error: e.message } };
    }
  },
});