import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const server = express();
let nestAppPromise: Promise<void> | null = null;

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
