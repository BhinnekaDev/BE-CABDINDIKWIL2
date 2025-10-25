import { server, createNestApp } from '../src/main';
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    await createNestApp();
    server(req as any, res as any);
  } catch (error) {
    console.error('NestJS serverless error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
