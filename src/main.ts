import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import express, { Request, Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
let nestAppPromise: Promise<void> | null = null;

// Hanya buat server NestJS sekali
const createNestServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  await app.init();
};

export default async function handler(req: Request, res: Response) {
  if (!nestAppPromise) {
    nestAppPromise = createNestServer();
    await nestAppPromise;
  }
  server(req, res);
}
