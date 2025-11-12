const { app } = require("@azure/functions");
const { Client } = require("pg");

app.http("testdb", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    const client = new Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT || 5432,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      const result = await client.query("SELECT NOW() AS current_time");
      await client.end();

      return { jsonBody: { connected: true, result: result.rows[0] } };
    } catch (err) {
      ctx.log("DB connection error:", err);
      return { status: 500, jsonBody: { connected: false, error: err.message } };
    }
  },
});
