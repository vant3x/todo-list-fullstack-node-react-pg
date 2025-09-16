import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Fracttal Backend API Documentation',
    version: '1.0.0',
    description: 'Documentación de la API para la aplicación backend de Fracttal. Esta API tiene un límite de 100 solicitudes por cada 15 minutos por dirección IP.',
  },
  servers: [
    {
      url: 'http://localhost:3001/api', 
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
    './src/api/schemas/*.ts', 
    './src/api/routes/*.ts', 
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
