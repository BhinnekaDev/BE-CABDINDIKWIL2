import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

const server = express();
let nestAppPromise: Promise<void> | null = null;

const createNestServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();

  // OpenAPI config
  const config = new DocumentBuilder()
    .setTitle('BE-CABDINDIKWIL2 API')
    .setDescription('Backend API Cabang Dinas Pendidikan Wilayah II')
    .setVersion('1.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  // Redoc endpoint
  server.get('/api-docs', (req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Docs</title>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </head>
        <body>
          <redoc spec-url='/api/api-json'></redoc>
        </body>
      </html>
    `);
  });

  // OpenAPI JSON
  server.get('/api/api-json', (req: Request, res: Response) => {
    res.json(document);
  });

  await app.init();
};

// Halaman Selamat Datang Interaktif
server.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Selamat Datang BE-CABDINDIKWIL2</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: #fff;
        }
        .container {
          text-align: center;
          background: rgba(0,0,0,0.4);
          padding: 50px 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          max-width: 500px;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.1em;
          margin-bottom: 30px;
        }
        button {
          padding: 15px 30px;
          font-size: 1.1em;
          border: none;
          border-radius: 50px;
          background: #ff9800;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #ffa733;
          transform: scale(1.05);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Selamat Datang!</h1>
        <p>Ini adalah backend API untuk Cabang Dinas Pendidikan Wilayah II.</p>
        <button onclick="window.location.href='/api-docs'">Lanjutkan ke Dokumentasi</button>
      </div>
    </body>
    </html>
  `);
});

export default async function handler(req: Request, res: Response) {
  if (!nestAppPromise) {
    nestAppPromise = createNestServer();
    await nestAppPromise;
  }
  server(req, res);
}
