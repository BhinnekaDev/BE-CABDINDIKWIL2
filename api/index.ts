import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const server = express();

// ===== Generate Swagger document sekali saat module load =====
const swaggerSetupPromise: Promise<boolean> = (async () => {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('API CAB DINDIK WILAYAH II')
    .setDescription('Dokumentasi resmi API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  await app.close();

  server.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customCss: `.topbar { display: none }`,
      swaggerOptions: { docExpansion: 'none', defaultModelsExpandDepth: -1 },
    }),
  );

  return true;
})();

// ===== Handler serverless Vercel =====
export default async function handler(req, res) {
  // Tunggu Swagger siap sebelum handle request
  await swaggerSetupPromise;

  server(req, res);
}
