declare module '@vercel/node' {
  import type { IncomingMessage, ServerResponse } from 'http';
  export type VercelRequest = IncomingMessage & { query: any; body: any };
  export type VercelResponse = ServerResponse & { send: (body: any) => void };
}
