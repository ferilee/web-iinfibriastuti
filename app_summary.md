Ringkasan rancangan alur aplikasi dan fitur-fitur utama:

### 🌟 Fitur Utama Website

Website ini akan dibagi menjadi dua bagian: **Halaman Publik** (untuk pengunjung/masyarakat) dan **Dashboard Admin** (khusus untuk Ibu Iin).

**1. Halaman Publik (Sisi Pengunjung)**

* **Beranda (Landing Page):** Menyajikan profil singkat Ibu Iin, kata sambutan, serta visi dan misi kepemimpinan di SMPN 2 Temanggung. Antarmuka akan terlihat bersih dan profesional berkat Shadcn UI dan Tailwind CSS.
* **Ruang Artikel & Opini (Blog):** Tempat pengunjung membaca tulisan, esai, atau pemikiran Ibu seputar dunia pendidikan, parenting, atau manajemen sekolah.
* **Galeri & Jejak Langkah:** Menampilkan dokumentasi foto/video kegiatan penting di SMPN 2 Temanggung, prestasi siswa, atau kegiatan dinas.
* **Halaman Kontak:** Formulir sederhana bagi masyarakat, guru, atau instansi lain yang ingin mengirimkan pesan langsung ke Ibu.

**2. Dashboard Admin (Area Privat)**

* **Autentikasi Aman:** Halaman login khusus menggunakan email dan password untuk mengakses panel kontrol.
* **Manajemen Konten (CRUD CMS):**
* Tulis, edit, hapus, dan publikasikan artikel blog.
* Unggah dan atur foto untuk halaman galeri.


* **Kotak Masuk (Inbox):** Membaca dan mengelola pesan yang masuk dari pengunjung melalui formulir kontak di halaman publik.

---
### 🔄 Alur Aplikasi (Application Flow)

Bagaimana aplikasi ini bekerja secara teknis dari ujung ke ujung:

**1. Alur Pengunjung (Visitor Flow)**

* Pengunjung membuka domain website Ibu.
* **Node.js** menyajikan antarmuka (UI) yang sudah dipercantik dengan komponen **Tailwind CSS** dan **Shadcn UI**.
* Ketika pengunjung membuka halaman "Artikel", Node.js akan meminta data ke *database* **SQLite** menggunakan **Drizzle ORM** (alat untuk menjembatani kode backend dengan database).
* Data artikel dikembalikan dan ditampilkan secara instan ke layar pengunjung.

**2. Alur Admin (Admin Flow)**

* Ibu Iin masuk ke rute khusus (misalnya `/admin`) dan melakukan *login*.
* Setelah masuk, Ibu berada di Dashboard. Jika Ibu ingin menulis artikel baru, Ibu mengetik di *text editor* yang tersedia dan menekan "Simpan".
* Data artikel baru tersebut dikirim ke *backend* Node.js, lalu **Drizzle ORM** akan memproses dan menyimpannya ke dalam file **SQLite** secara permanen.

**3. Alur Infrastruktur (Docker Flow)**

* Seluruh kode program (Frontend, Backend) dan *database* (SQLite) dibungkus ke dalam sebuah **Docker Container**.
* Ini berarti aplikasi memiliki "lingkungannya sendiri". Ketika Ibu memindahkan aplikasi ini ke server (VPS) manapun, aplikasinya dijamin langsung berjalan lancar tanpa perlu repot menginstal ulang Node.js atau *tools* lainnya di server.

---
