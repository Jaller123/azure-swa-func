const { app } = require("@azure/functions");
const { Client } = require("pg");

// Reads either short names (host,user,...) or DB_* names
const cfg = {
  host: process.env.DB_HOST || process.env.host,
  user: process.env.DB_USER || process.env.user,
  password: process.env.DB_PASS || process.env.password,
  database: process.env.DB_NAME || process.env.database,
  port: Number(process.env.DB_PORT || process.env.port || 5432),
  ssl: { rejectUnauthorized: false }, // PostgreSQL Flexible Server requires SSL
};

app.http("testdb", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    try {
      const client = new Client(cfg);
      await client.connect();

      // simple ping
      const result = await client.query("SELECT NOW() AS server_time;");
      await client.end();

      return { jsonBody: { ok: true, server_time: result.rows[0].server_time } };
    } catch (err) {
      ctx.log("DB error:", err);
      return {
        status: 500,
        jsonBody: { ok: false, error: err.message, cfgKeys: Object.keys(cfg) },
      };
    }
  },
});
