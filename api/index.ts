import { server, createNestApp } from '@/main';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await createNestApp();
  server(req, res);
}
