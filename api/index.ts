import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const server = express();

async function getSwaggerDocument() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('API CAB DINDIK WILAYAH II')
    .setDescription('Dokumentasi resmi API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  await app.close();
  return document;
}

let swaggerSetup = false;

export default async function handler(req, res) {
  if (!swaggerSetup) {
    const document = await getSwaggerDocument();
    server.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(document, {
        customCss: `.topbar { display: none }`,
        swaggerOptions: { docExpansion: 'none', defaultModelsExpandDepth: -1 },
      }),
    );
    swaggerSetup = true;
  }

  server(req, res);
}
