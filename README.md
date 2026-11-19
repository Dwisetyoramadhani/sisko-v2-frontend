# SISKO Frontend

Frontend SISKO menggunakan React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, dan Axios. Kontrak backend yang menjadi acuan ada di `../backend/docs/API_CONTRACT.md`.

## Menjalankan lokal

```sh
npm install
npm run dev
```

Salin `.env.example` menjadi `.env.local`, lalu isi origin backend. Vite berjalan di `http://localhost:3000` agar cocok dengan konfigurasi lokal backend pada `.env.example` Laravel. Backend juga harus mengizinkan origin frontend melalui CORS dan mengonfigurasi domain frontend sebagai domain Sanctum stateful. Gunakan HTTPS di luar lokal.

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_ORIGIN=http://localhost:8000
```

`VITE_API_BASE_URL` adalah origin backend; aplikasi menambahkan `/api/v1`. `VITE_API_ORIGIN` dipakai untuk meminta `/sanctum/csrf-cookie`. Keduanya boleh dikosongkan jika frontend dan backend berada pada origin yang sama.

## Struktur source

```text
src/
├── app/                 # router, provider, dan layout aplikasi
├── components/          # komponen bersama, termasuk tabel
├── features/            # halaman per area dan role bisnis
├── lib/                 # formatter dan helper
├── services/            # API client dan error handling
├── types/               # tipe response API
├── App.tsx              # entry komposisi aplikasi
└── main.tsx             # bootstrap React
```

## Cakupan saat ini

- Login dan logout memakai cookie session Sanctum dan CSRF; tidak ada penyimpanan token/session di localStorage.
- Dashboard meminta data ringkasan dari endpoint master data, izin, sesi mengajar, pelanggaran, dan laporan harian. Nilai yang tidak dapat diakses per role ditampilkan sebagai `—`.
- Navigasi menyatukan menu untuk semua role yang diterima dari `/auth/me`, termasuk pengguna multi-role. Backend tetap menjadi sumber otorisasi.
- Daftar master data, izin, jadwal, sesi mengajar, jurnal, tugas, pelanggaran, notifikasi, dan laporan terhubung ke endpoint kontrak. Pagination mendukung bentuk envelope paginator Laravel.
- Petugas piket/admin dapat mencatat pengajuan izin dengan unggah surat, melakukan verifikasi, dan membuka dokumen lewat endpoint private. Pencatatan pelanggaran mendukung siswa, kategori, waktu, lokasi, dan bukti. Sekretaris kelas dapat menandai tugas sebagai terdistribusi.
- Admin dapat membuat record master data. Laporan harian, bulanan, semester, serta presensi guru dapat ditampilkan; CSV tersedia lewat query `export=csv` pada endpoint laporan yang mendukungnya.
- Endpoint backend belum menyediakan forgot password, ubah password, atau data profil yang dapat diedit. Fitur tersebut tidak ditampilkan sebagai formulir aktif.

Halaman yang masih perlu implementasi lanjutan agar mencakup keseluruhan alur bisnis SISKO: detail record, edit/hapus master data, presensi harian dan per sesi, check-in guru, pembuatan jurnal dan tugas pengganti, pengelolaan anggota kelas/wali/sekretaris, serta dashboard wali kelas khusus. Daftar operasional yang ada saat ini belum menggantikan workflow tersebut dan belum dianggap selesai.

## Pemeriksaan

```sh
npm run build
npm run lint
```

Belum ada akun demo yang disediakan frontend. Gunakan akun lokal yang dibuat oleh backend.
