# SISKO Frontend

Frontend SISKO menggunakan React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, dan Axios. Kontrak backend yang menjadi acuan ada di `../backend/docs/API_CONTRACT.md`.

## Menjalankan lokal

```sh
npm install
npm run dev
```

Salin `.env.example` menjadi `.env.local`. Saat pengembangan, Vite mendengarkan koneksi LAN dan meneruskan `/api` serta `/sanctum` ke backend di port 8000. Pastikan Laravel aktif di komputer yang sama.

```env
VITE_API_BASE_URL=
VITE_API_ORIGIN=
VITE_PROXY_API_TARGET=http://localhost:8000
```

Kosongkan `VITE_API_BASE_URL` dan `VITE_API_ORIGIN` untuk memakai proxy development same-origin. Jika backend berada di host lain, isi keduanya dengan origin backend; backend perlu mengizinkan origin frontend di CORS dan Sanctum.

Untuk membuka aplikasi dari HP, sambungkan HP dan komputer ke Wi-Fi yang sama, jalankan Vite, lalu buka `http://<IP-komputer>:3000` dari browser HP. Backend tetap diakses server Vite melalui `localhost:8000`, sehingga HP tidak perlu mengarahkan `localhost` ke backend. Izinkan koneksi LAN ke port 3000 pada firewall komputer jika diperlukan. Gunakan HTTPS dan konfigurasi CORS/Sanctum yang sesuai di luar jaringan development lokal.

### HTTPS lokal untuk memasang PWA dari HP

Chrome dan Samsung Internet perlu HTTPS untuk mengenali situs sebagai PWA. Buat CA dan sertifikat lokal untuk IP LAN komputer:

```sh
npm run cert:local -- 192.168.1.23
npm run build
npm run preview
```

Ganti `192.168.1.23` dengan IP LAN komputer. Setelah sertifikat dibuat, Vite Preview melayani build production di `https://<IP-komputer>:4173` dan tetap mem-proxy API ke Laravel di port 8000. Ini memakai service worker production SISKO.

Pindahkan **hanya** `certs/sisko-local-ca.crt` ke HP, lalu pasang sebagai CA certificate dari pengaturan keamanan Android/Samsung. Jangan pindahkan `sisko-local-ca-key.pem` atau `sisko-local-key.pem`. Pastikan HP mempercayai CA tersebut, lalu buka URL HTTPS di Chrome. Hapus sertifikat CA dari HP setelah selesai menguji.

Folder `certs/` diabaikan Git. Jika IP LAN berubah, jalankan ulang perintah sertifikat dengan IP baru; CA yang sudah dipercaya tetap sama.

## Progressive Web App

Build produksi sudah menyertakan manifest, ikon SISKO, dan service worker. Deploy frontend melalui HTTPS agar browser ponsel mengizinkan instalasi. Di Android, buka SISKO di Chrome lalu pilih **Install app** atau **Tambahkan ke layar utama**. Di iPhone/iPad, buka lewat Safari, tekan **Bagikan**, lalu **Tambahkan ke Layar Utama**.

Service worker menyimpan app shell dan aset statis agar SISKO dapat dibuka saat koneksi terputus. Setiap build memberi versi baru pada cache dan URL ikon PWA; service worker memeriksa versi baru saat aplikasi dibuka atau kembali aktif, lalu memuat ulang aplikasi jika versi baru mengambil alih. Browser/OS dapat memerlukan waktu untuk memperbarui ikon launcher, tetapi aplikasi tidak perlu dihapus dan dipasang ulang. Request API, autentikasi, dan data sekolah tidak disimpan atau ditampilkan offline; fitur operasional memerlukan koneksi ke backend.

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
- Dashboard dan navigasi menyesuaikan gabungan role. Ringkasan yang gagal diakses tidak ditampilkan sebagai metrik kosong.
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
