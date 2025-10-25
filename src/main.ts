import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
        description:
          'Masukkan token akses dari login (Bearer token) untuk mengakses endpoint yang membutuhkan autentikasi',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'BE-CABDINDIKWIL2 API Docs',
    swaggerOptions: {
      layout: 'BaseLayout',
      presets: undefined,
      persistAuthorization: true,
    },
    customCss: `
      .swagger-ui .topbar { 
        display: none; 
      }
    `,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📘 Swagger Docs available at http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
