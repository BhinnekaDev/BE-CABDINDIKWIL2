import 'dotenv/config';
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import * as swaggerUi from 'swagger-ui-express';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { Request, Response, NextFunction } from 'express';

const server = express();

async function createApp(): Promise<void> {
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
}

if (process.env.LOCAL === 'true') {
  void createApp()
    .then(() => {
      const port = Number(process.env.PORT) || 3000;
      server.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
        console.log(
          `📘 Swagger Docs available at http://localhost:${port}/docs`,
        );
      });
    })
    .catch((err: unknown) => console.error(err));
}

export default (req: Request, res: Response): void => {
  server(req, res);
};
