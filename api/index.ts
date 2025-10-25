import { server, createNestApp } from '@/main';

export default async function handler(req, res) {
  try {
    await createNestApp();
    server(req, res);
  } catch (err) {
    console.error('Vercel Function Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
