# 🖥️ BE-CABDINDIKWIL2

**Backend API untuk website Cabang Dinas Pendidikan Wilayah II Kabupaten Rejang Lebong**

Backend ini dibangun menggunakan **NestJS** dan **TypeScript**, menyediakan API terintegrasi dengan **Supabase** untuk autentikasi pengguna dan pengelolaan data modul seperti Berita, Prakata, Seputar Cabdin, SLB, SMA, SMK, Struktur Organisasi, Tupoksi, dan Visi Misi.

[![Stars](https://img.shields.io/github/stars/BhinnekaDev/BE-CABDINDIKWIL2?style=flat-square)](https://github.com/BhinnekaDev/BE-CABDINDIKWIL2/stargazers)
[![Forks](https://img.shields.io/github/forks/BhinnekaDev/BE-CABDINDIKWIL2?style=flat-square)](https://github.com/BhinnekaDev/BE-CABDINDIKWIL2/network)
[![Last Commit](https://img.shields.io/github/last-commit/BhinnekaDev/BE-CABDINDIKWIL2?style=flat-square)](https://github.com/BhinnekaDev/BE-CABDINDIKWIL2/commits/master)

![Platform](https://img.shields.io/badge/platform-API-blue?style=flat-square)
![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20PostgreSQL-3FCF8E?logo=supabase&style=flat-square)

---

## ⚙️ Teknologi yang Digunakan

| Layer          | Stack / Library                    |
| -------------- | ---------------------------------- |
| **Backend**    | NestJS 11, TypeScript 5            |
| **Auth**       | Supabase Auth (Email/Password)     |
| **Validation** | class-validator, class-transformer |
| **Database**   | Supabase (PostgreSQL)              |
| **Testing**    | Jest, Supertest                    |
| **Linting**    | ESLint, Prettier                   |

---

## 📁 Struktur Direktori

```
E-CABDINDIKWIL2/
├── api/
│   └── index.ts
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── guards/
│   │       ├── auth-request.interface.ts
│   │       └── jwt-auth-guard.ts
│   ├── satpen/
│   │   ├── satpen.controller.ts
│   │   ├── satpen.module.ts
│   │   ├── satpen.service.ts
│   │   ├── dto/
│   │   │   └── filter-satpen.dto.ts
│   │   └── interfaces/
│   │       └── satpen.interface.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── supabase/
│   ├── supabase.client.ts
│   ├── supabase.module.ts
│   └── supabase.service.ts
├── test/
├── types/
│   └── vercel.d.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Modul API

| Modul                   | Deskripsi                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Auth**                | Modul autentikasi pengguna menggunakan Supabase Auth. Mendukung login, register, profil pengguna, dan logout. |
| **Berita**              | CRUD Berita dan pengelolaan konten informasi.                                                                 |
| **Prakata**             | CRUD Prakata Kepala Cabang Dinas Pendidikan.                                                                  |
| **Seputar Cabdin**      | CRUD artikel atau informasi seputar Cabang Dinas.                                                             |
| **SLB / SMA / SMK**     | CRUD data sekolah per kategori.                                                                               |
| **Struktur Organisasi** | CRUD struktur organisasi Cabang Dinas.                                                                        |
| **Tupoksi**             | CRUD tugas dan fungsi Cabang Dinas.                                                                           |
| **Visi Misi**           | CRUD visi dan misi Cabang Dinas.                                                                              |

> ⚠️ Catatan: Modul selain `Auth` bisa ditambahkan sesuai kebutuhan.

---

## 🔌 Konfigurasi `.env`

Buat file `.env` di root project:

```env
PORT=3000
LOCAL=true
SUPABASE_URL=https://your-supabase-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## 🧩 Integrasi Supabase

`supabase/supabase.client.ts` mengelola semua komunikasi dengan Supabase:

```ts
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
```

> ⚠️ Catatan: Gunakan `!` untuk memastikan TypeScript mengetahui bahwa variabel `.env` sudah ada.

---

## 🛠️ Script NPM

| Perintah             | Fungsi                                 |
| -------------------- | -------------------------------------- |
| `npm run start:dev`  | Jalankan server dalam mode development |
| `npm run start`      | Jalankan server NestJS                 |
| `npm run build`      | Build project                          |
| `npm run lint`       | Jalankan ESLint & perbaiki otomatis    |
| `npm run format`     | Format kode menggunakan Prettier       |
| `npm run test`       | Jalankan unit test dengan Jest         |
| `npm run test:watch` | Jalankan test dengan mode watch        |
| `npm run test:e2e`   | Jalankan end-to-end test               |
| `npm run test:cov`   | Generate laporan coverage              |

---

## ⚡ Cara Menjalankan Project

1. Clone repository:

```bash
git clone https://github.com/BhinnekaDev/BE-CABDINDIKWIL2.git
cd BE-CABDINDIKWIL2
```

2. Install dependencies:

```bash
npm install
```

3. Buat file `.env` sesuai contoh di atas.

4. Jalankan server:

```bash
npm run start:dev
```

Server akan berjalan di `http://localhost:PORT`.

---

## 🧪 Testing

- Jalankan unit test:

```bash
npm run test
```

- Jalankan E2E test:

```bash
npm run test:e2e
```

- Generate laporan coverage:

```bash
npm run test:cov
```

---

## 🤝 Kontribusi

1. Fork repo ➜ buat branch baru (`feature/example-module`, `fix/example-bug`, dsb)
2. Tambahkan fitur atau endpoint API baru
3. Jalankan `npm run lint` dan pastikan semua test lolos
4. Buat Pull Request dengan deskripsi perubahan yang jelas

---

## 📜 Lisensi

UNLICENSED © 2025 [Bhinneka Dev](https://github.com/BhinnekaDev)

---
