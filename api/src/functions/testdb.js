const { app } = require("@azure/functions");

app.http("testdb", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    ctx.log("➡️ /api/testdb called");

    // 1) Check that env vars are actually present
    ctx.log("PGHOST:", process.env.PGHOST);
    ctx.log("PGUSER:", process.env.PGUSER);
    ctx.log("PGDATABASE:", process.env.PGDATABASE);
    ctx.log("PGPORT:", process.env.PGPORT);

    // 2) Try to load pg *inside* the handler
    let Client;
    try {
      const pg = require("pg");
      Client = pg.Client;
      ctx.log("pg module loaded");
    } catch (err) {
      ctx.log("❌ Failed to load 'pg' module:", err);
      return {
        status: 500,
        jsonBody: {
          connected: false,
          where: "require-pg",
          error: err.message,
        },
      };
    }

    const client = new Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: Number(process.env.PGPORT) || 5432,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000, // fail fast if network/firewall blocks
    });

    try {
      ctx.log("🔌 Connecting to Postgres...");
      await client.connect();
      ctx.log("✅ Connected, running SELECT NOW()");
      const result = await client.query("SELECT NOW() AS current_time");
      ctx.log("✅ Query finished");

      return {
        jsonBody: {
          connected: true,
          result: result.rows[0],
        },
      };
    } catch (err) {
      ctx.log("❌ DB connection/query error:", err);
      return {
        status: 500,
        jsonBody: {
          connected: false,
          where: "connect-or-query",
          error: err.message,
        },
      };
    } finally {
      try {
        await client.end();
        ctx.log("🔌 Client disconnected");
      } catch (err) {
        ctx.log("⚠️ Error closing client:", err);
      }
    }
  },
});
