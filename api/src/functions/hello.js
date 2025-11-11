const { app } = require('@azure/functions');

app.http('hello', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    return { jsonBody: { message: 'Hello from Azure Functions!' } };
  }
});
