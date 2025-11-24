import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from '#routes/index.js';
import errorMiddleware from '#middlewares/error.middleware.js';
import requestLogger from '#middlewares/requestLogger.middleware.js';
import { setupSwagger } from '#config/swagger.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Seguridad
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  })
);

app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas solicitudes desde esta IP',
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Swagger documentation
setupSwagger(app);

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="icon" href="favicon.ico">
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Geist', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0a0e15;
          }
          .icons-container{
          margin-top: 50px;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .icons-container img {
            width: 100px;
            height: 100px;
            padding: 10px;
            border-radius: 5px;
            background-color: #e0e0e0;
            border: 5px solid rgba(255, 255, 255, 0.7);
            transition: all 0.3s ease-in-out;
          }
          .icons-container img:hover {
            scale: 1.1;
          }
          h1 {
            color: #fff;
          }
          h2 {
            color: #fff;
          }
          p {
            color: #fff;
          }
          a {
            color: #fff;
            font-weight: bold;
            text-decoration: none;
          }
          a:hover {
            text-decoration: none;
          }
          section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 50px;
          }
          .card-img {
            width: 40px;
            height: 40px;
            background-color: #f0db4f;
            padding: 10px;
            border-radius: 5px;
            transition: all 0.3s ease-in-out;
          }

          .card-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            max-width: 650px;
            margin: 0 auto;
            justify-content: center;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            gap: 10px;
          }

          .card {
            width: 100px;
            display: flex;
            background-color: #110f18;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            gap: 10px;
            padding: 10px;
            transition: all 0.3s ease-in-out;
          }

          .card:hover {
            scale: 1.1;
            background-color: rgba(240, 219, 79, 0.1);
          }
          .introduction {
            max-width: 90vw;
            text-align: center;
            color: #fff;
            font-size: 1.1rem;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <section>
          <div class="icons-container">
            <img src="nodejs.svg" alt="Node.js" title="Node.js">
            <img src="javascript.svg" alt="JavaScript" title="JavaScript">
          </div>
          <h1>API funcionando correctamente</h1>
          <p>Version: ${process.env.API_VERSION_LONG}</p>
          <p>Node.js Version: ${process.version}</p>
          <p>Mode: ${process.env.NODE_ENV}</p>
          <div class="card-container">
            <div class="card">
              <img class="card-img" src="health.svg" alt="Health">
              <p><a href="/health">Health</a></p>
            </div>
            <div class="card">
              <img class="card-img" src="docs.svg" alt="Docs">
              <p><a href="/api-docs">Docs</a></p>
            </div>
          </div>
          </section>
          <section>
           <p class="introduction"> Plantilla de API para proyectos pequeños-medianos con Node.js, Express y javascript, ideal si estás comenzando con Node.js y quieres una base sólida para tu proyecto, con autenticación JWT y documentación con Swagger.</p>

           <h2>Tecnologias</h2>
           <div class="card-container">
            <div class="card">
              <img class="card-img" src="nodejs.svg" alt="Node.js">
              <p>Node.js</p>
            </div>
            <div class="card">
              <img class="card-img" src="javascript.svg" alt="JavaScript">
              <p>JavaScript</p>
            </div>
            <div class="card">
              <img class="card-img" src="express.svg" alt="Express">
              <p>Express</p>
            </div>
            <div class="card">
              <img class="card-img" src="jwt.svg" alt="JWT">
              <p>JWT</p>
            </div>
            <div class="card">
              <img class="card-img" src="prisma.svg" alt="Prisma">
              <p>Prisma</p>
            </div>
            <div class="card">
              <img class="card-img" src="jest.svg" alt="Jest">
              <p>Jest</p>
            </div>
            <div class="card">
              <img class="card-img" src="nodemon.svg" alt="Nodemon">
              <p>Nodemon</p>
            </div>
            <div class="card">
              <img class="card-img" src="swagger.svg" alt="Swagger">
              <p>Swagger</p>
            </div>
            <div class="card">
              <img class="card-img" src="prettier.svg" alt="Prettier">
              <p>Prettier</p>
            </div>
            <div class="card">
              <img class="card-img" src="docker.svg" alt="Docker">
              <p>Docker</p>
            </div>
           </div>
        </section>
      </body>
    </html>
  `);
});

app.use('/api/', limiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
const apiVersion = process.env.API_VERSION;
app.use(`/api/${apiVersion}`, routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Error handler
app.use(errorMiddleware);

export default app;
