import 'dotenv/config';
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { Request, Response, NextFunction } from 'express';

const server = express();
let initialized = false;

async function initNest(): Promise<void> {
  if (initialized) return;
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

  server.use('/docs', swaggerUi.serve);
  server.get(
    '/docs',
    swaggerUi.setup(document) as unknown as (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void,
  );

  await app.init();
  initialized = true;
}

// =====================
// Local dev
// =====================
if (process.env.LOCAL === 'true') {
  void initNest()
    .then(() => {
      const port = Number(process.env.PORT) || 3000;
      server.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
        console.log(
          `📘 Swagger Docs available at http://localhost:${port}/docs`,
        );
      });
    })
    .catch((err) => console.error(err));
}

// =====================
// Vercel serverless handler
// =====================
export default async (req: Request, res: Response) => {
  await initNest();
  server(req, res);
};
