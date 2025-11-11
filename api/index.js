const { app } = require('@azure/functions');

app.http('hello', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    return { jsonBody: { message: 'Hello from Azure Functions!' } };
  }
});
