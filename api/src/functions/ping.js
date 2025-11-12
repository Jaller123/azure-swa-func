const { app } = require("@azure/functions");
app.http("ping", {
  methods: ["GET"], authLevel: "anonymous",
  handler: async () => ({ jsonBody: { ok: true } })
});
