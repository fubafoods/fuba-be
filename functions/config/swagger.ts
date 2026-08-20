import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT || 3000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fuba API',
      version: '1.0.0',
      description: 'API documentation for the Fuba backend (auth, users, vendors, restaurants, meals, orders, cart, promos and file uploads).',
    },
    servers: [
      { url: 'https://fuba-be-hbjt.onrender.com', description: 'Production (Render)' },
      { url: `http://localhost:${port}`, description: 'Local server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error_code: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [
    './features/**/*.route.ts',
    './lib/features/**/*.route.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
