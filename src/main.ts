import 'dotenv/config';
import express from 'express';
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import swaggerUi from 'swagger-ui-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, INestApplication } from '@nestjs/common';

const server = express();
let nestApp: INestApplication | null = null;

export async function createNestApp() {
  if (!nestApp) {
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

    if (process.env.LOCAL === 'true') {
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

      server.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(document, {
          customCss: `.topbar { display: none }`,
          swaggerOptions: {
            docExpansion: 'none',
            defaultModelsExpandDepth: -1,
          },
        }),
      );
    }

    await app.init();
    nestApp = app;
  }

  return nestApp;
}

// =====================
// Local dev server
// =====================
if (process.env.LOCAL === 'true') {
  void createNestApp().then(() => {
    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  });
}

export { server };
