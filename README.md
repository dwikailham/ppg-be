# Backend PPG Malang Selatan

Repositori ini berisi kode sumber untuk backend aplikasi PPG Malang. Berikut adalah dokumentasi sistematis mengenai seluruh konten yang ada di dalam codebase.

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Struktur Direktori](#struktur-direktori)
3. [Instalasi](#instalasi)
4. [Konfigurasi](#konfigurasi)
5. [Menjalankan Aplikasi](#menjalankan-aplikasi)
6. [Fitur Utama](#fitur-utama)
7. [Testing](#testing)

---

## Pendahuluan

PPG adalah backend untuk aplikasi PPG yang dibangun menggunakan ExpressJS. Backend ini menyediakan API untuk pengelolaan data dan fitur aplikasi.

## Struktur Direktori

```
.
├── src/                # Kode sumber utama
│   ├── controllers/    # Logika pengendali API
│   ├── models/         # Definisi model database
│   ├── routes/         # Definisi rute API
│   └── utils/          # Fungsi utilitas
├── tests/              # Skrip pengujian
├── .env.example        # Contoh konfigurasi environment
├── package.json        # Konfigurasi npm
└── README.md           # Dokumentasi
```

## Instalasi

1. Clone repositori:

```bash
git clone https://github.com/PPG-Malang-Selatan/ppg-be.git
```

2. Masuk ke direktori proyek:

```bash
cd ppg-be
```

3. Install dependensi:

```bash
npm install
```

## Konfigurasi

- Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasi sesuai kebutuhan (database, port, dsb).
- Lakukan migrasi database

```bash
npm run migrate
```

## Menjalankan Aplikasi

- Jalankan server dengan perintah:
  ```bash
  npm start
  ```
- Untuk mode pengembangan:
  ```bash
  npm run dev
  ```

## Fitur Utama

- Autentikasi pengguna
- API RESTful untuk CRUD
- Validasi dan error handling

## Testing

- Jalankan pengujian dengan:
  ```bash
  npm test
  ```
