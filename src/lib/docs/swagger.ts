import swaggerJsdoc from 'swagger-jsdoc'
import { version } from '../../../package.json'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GBP Tracker API',
      version,
      description: 'API documentation for the GBP Tracker application'
    },
    servers: [
      {
        url: '/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/types/*.ts']
}

export const swaggerSpec = swaggerJsdoc(options)