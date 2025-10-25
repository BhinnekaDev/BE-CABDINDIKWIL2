import 'dotenv/config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import express, { Request, Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let cachedServer: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (cachedServer) return cachedServer;

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Dokumentasi API CAB DINDIK WILAYAH II')
    .setDescription(
      'Dokumentasi resmi API untuk sistem Backend Cabang Dinas Pendidikan Wilayah II Kabupaten Rejang Lebong',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Bearer token',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  server.use('/docs', swaggerUi.serve, swaggerUi.setup(document) as any);

  await app.init();
  cachedServer = server;
  return server;
}

// =====================
// Local dev
// =====================
if (process.env.LOCAL === 'true') {
  void getServer()
    .then((server) => {
      const port = Number(process.env.PORT) || 3000;
      server.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
        console.log(`📘 Swagger Docs: http://localhost:${port}/docs`);
      });
    })
    .catch(console.error);
}

// =====================
// Vercel serverless
// =====================
export default async (req: Request, res: Response) => {
  const server = await getServer();
  server(req, res);
};
