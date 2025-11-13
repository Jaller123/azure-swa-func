const { app } = require("@azure/functions");

app.http("ping", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    return { jsonBody: { ok: true, message: "pong" } };
  },
});