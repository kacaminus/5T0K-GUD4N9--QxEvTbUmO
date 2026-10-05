# Aplikasi Stok Gudang SPPG

Aplikasi web statis (tanpa server sendiri). Data disimpan di Supabase, tampilan dihosting gratis.

## Isi folder
- `login.html`, `index.html` (Beranda), `stok.html`, `habis.html`, `masuk.html`, `keluar.html`, `riwayat.html`, `barang.html`, `cetak.html`: satu file per halaman
- `js/config.js`: **file penyambung ke database** (isi URL dan kunci Supabase)
- `js/db.js`: semua perintah ke database
- `js/app.js`: fungsi bersama (hitung stok, menu, form)
- `css/style.css`: tampilan
- `supabase/schema.sql`: pembuat tabel dan data awal 80 barang Gudang Kering

## Langkah pemasangan
1. Daftar di supabase.com, lalu buat project baru (pilih region terdekat, mis. Singapore).
2. Buka **SQL Editor > New query**, tempel seluruh isi `supabase/schema.sql`, klik **Run**.
3. Buka **Authentication > Users > Add user**, buat akun untuk tiap staf (email + kata sandi, centang auto-confirm).
4. Buka **Authentication > Sign In / Providers** (atau Settings), matikan **Allow new users to sign up** supaya orang luar tidak bisa mendaftar sendiri.
5. Buka **Project Settings > API**. Salin **Project URL** dan kunci **anon / publishable** ke `js/config.js`. Jangan pakai kunci `service_role` / secret.
6. Pasang seluruh folder ini ke hosting gratis, misalnya Cloudflare Pages atau Netlify (pilih unggah folder / drag and drop). Buka alamat yang diberikan, lalu masuk dengan akun dari langkah 3.

## Catatan
- Paket gratis Supabase menjeda project yang tidak ada aktivitas selama 1 minggu. Kalau dipakai harian, ini tidak akan terjadi. Jika sempat terjeda, aktifkan kembali dari dashboard (data tidak hilang). Cek ketentuan terbaru di halaman harga Supabase.
- Ekspor cadangan data berkala dari **Table Editor** (Export to CSV).
- Untuk mencoba di komputer sendiri, jalankan di server lokal (misalnya `python3 -m http.server`), jangan hanya klik dua kali file HTML.
