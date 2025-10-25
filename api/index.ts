import { server, createNestApp } from '@/main';

export default async function handler(req: any, res: any) {
  try {
    await createNestApp();
    server(req, res);
  } catch (err) {
    console.error('Vercel function error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
