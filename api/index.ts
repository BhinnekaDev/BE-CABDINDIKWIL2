import { server, createNestApp } from '@/main';

export default async function handler(req: any, res: any) {
  await createNestApp();
  server(req, res);
}
