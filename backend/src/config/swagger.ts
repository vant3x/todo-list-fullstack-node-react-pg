import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Fracttal Backend API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Fracttal backend application.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1', 
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/api/routes/*.ts', 
    './src/api/schemas/*.ts', 
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
