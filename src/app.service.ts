import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getLandingPageHTML(): string {
    return `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>CABDINDIKWIL2 API Service</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background: radial-gradient(circle at top left, #0f172a, #1e293b);
              color: #e2e8f0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              text-align: center;
              overflow: hidden;
            }
            h1 {
              font-size: 2.5rem;
              font-weight: 600;
              color: #f8fafc;
              margin-bottom: 0.75rem;
              letter-spacing: 0.5px;
            }
            p {
              font-size: 1.05rem;
              color: #94a3b8;
              margin-bottom: 2rem;
            }
            a {
              display: inline-block;
              background: linear-gradient(135deg, #2563eb, #1e40af);
              color: #fff;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 500;
              text-decoration: none;
              letter-spacing: 0.3px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
            }
            a:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
            }
            .glow {
              position: absolute;
              width: 500px;
              height: 500px;
              background: radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 70%);
              filter: blur(60px);
              z-index: 0;
            }
            .glow.top-left {
              top: -100px;
              left: -100px;
            }
            .glow.bottom-right {
              bottom: -100px;
              right: -100px;
            }
            footer {
              position: absolute;
              bottom: 20px;
              font-size: 0.85rem;
              color: #64748b;
              z-index: 1;
            }
          </style>
        </head>
        <body>
          <div class="glow top-left"></div>
          <div class="glow bottom-right"></div>

          <main style="z-index: 1;">
            <h1>Layanan API CABDINDIK WILAYAH 2</h1>
            <p>Sistem backend terpusat untuk layanan dan data pendidikan.</p>
            <a href="/docs">📘 Lihat Dokumentasi API</a>
          </main>

          <footer>© ${new Date().getFullYear()} Bhinneka Dev — Seluruh hak cipta dilindungi.</footer>
        </body>
      </html>
    `;
  }
}
