const { app } = require('@azure/functions');

// New Azure Function: /api/greet
app.http('greet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    // Get the "name" query parameter, e.g. /api/greet?name=Kenath
    const name = request.query.get('name') || 'stranger';

    // Log the request for debugging
    context.log(`Greeting request for: ${name}`);

    // Return a JSON response
    return { jsonBody: { message: `Hello, ${name}!` } };
  },
});
