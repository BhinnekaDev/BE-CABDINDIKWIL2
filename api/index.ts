import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import express, { Request, Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const server = express();
let nestAppPromise: Promise<void> | null = null;

const createNestServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('BE-CABDINDIKWIL2 API')
    .setDescription('Backend API Cabang Dinas Pendidikan Wilayah II')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.init();
};

server.get('/', (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>Selamat Datang</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>Selamat Datang di BE-CABDINDIKWIL2!</h1>
        <p>Klik tombol di bawah untuk menuju dokumentasi API (Swagger).</p>
        <button onclick="window.location.href='/api-docs'">Lanjutkan</button>
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
