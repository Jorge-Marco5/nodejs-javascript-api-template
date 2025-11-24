import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST con Node.js + JavaScript',
      version: '1.0.0',
      description: 'Documentación completa de la API',
      contact: {
        name: 'Tu Nombre',
        email: 'tu@email.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {
        Example: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único del ejemplo',
            },
            name: {
              type: 'string',
              description: 'Nombre del ejemplo',
            },
            description: {
              type: 'string',
              description: 'Descripción del ejemplo',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
  tagsSorter: 'alpha',
  pathsSorter: 'alpha',

  securitySchemes: {
    cookieAuth: {
      type: 'http',
      scheme: 'cookie',
      bearerFormat: 'JWT',
    },
  },
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = app => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API - Documentación',
    })
  );

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
