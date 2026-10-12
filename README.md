# KampusKita - Portal Akademik & Laboratorium Audit Keamanan (M5–M6 KSI)

Portal Akademik Kampus Fiktif **KampusKita** dirancang secara khusus untuk memenuhi kebutuhan pengujian, demonstrasi, dan penyusunan **Laporan Audit Keamanan Sistem Informasi (KSI) Modul M5–M6**.

Aplikasi ini mengintegrasikan fungsi operasional perguruan tinggi harian (manajemen nilai, pengumpulan tugas, forum kelas) dengan modul audit keamanan interaktif untuk menganalisis risiko **Insecure Direct Object References (IDOR)** dan **Eskalasi Hak Akses (Privilege Escalation)** secara terkontrol dan aman.

---

## 1. Ringkasan Proyek

- **Nama Aplikasi:** KampusKita
- **Tujuan:** Media pengujian empiris kontrol akses berbasis peran (RBAC) dan demonstrasi mitigasi celah otorisasi web untuk tugas audit akademik M5–M6 KSI.
- **Karakteristik Data:** 100% Data Sintetis (fiktif), bebas dari data pribadi nyata, dan tidak terhubung ke API eksternal berbayar maupun LLM.
- **Arsitektur:** Antarmuka Front-End murni (Client-Side Single Page Experience) yang siap dipublikasikan secara langsung menggunakan **GitHub Pages**.

---

## 2. Fitur Utama Berdasarkan Peran

### A. Mahasiswa (Student)
1. **Autentikasi:** Masuk dan keluar akun dengan simulasi sesi.
2. **Dashboard Pribadi:** Ringkasan statistik IPK, total SKS aktif, status tugas diserahkan, dan agenda kuliah.
3. **Kartu Hasil Studi (KHS):** Melihat daftar nilai semester resmi miliknya sendiri (Kode MK, SKS, Dosen, Nilai Tugas, UTS, UAS, Nilai Akhir, dan Huruf Mutu).
4. **Pengumpulan Tugas:** Formulir unggah berkas tugas (pilihan mata kuliah, judul tugas, catatan, dan berkas lampiran simulasi).
5. **Riwayat Tugas & Nilai:** Memantau status evaluasi (*Menunggu Penilaian* vs *Sudah Dinilai*), melihat umpan balik dosen, serta mengunduh berkas yang telah dikumpulkan.
6. **Forum Diskusi:** Membaca dan mengirim pesan interaktif per mata kuliah dengan perlindungan sanitasi teks.

### B. Dosen (Lecturer)
1. **Dashboard Dosen:** Pemantauan statistik berkas masuk, jumlah tugas yang menunggu penilaian, dan kelas yang diampu.
2. **Manajemen Penilaian Tugas:** Daftar seluruh berkas yang diserahkan mahasiswa lengkap dengan filter status.
3. **Unduh Berkas Demo:** Mengunduh berkas representasi tugas mahasiswa.
4. **Evaluasi & Nilai (0–100):** Modal dialog penilaian interaktif dengan validasi rentang angka 0–100 dan catatan evaluasi/feedback dosen.
5. **Forum Diskusi:** Memberikan pengumuman atau membalas pertanyaan mahasiswa di forum kelas.

### C. Administrator (Admin)
1. **Dashboard Admin:** Pemantauan metrik akun terdaftar, status proteksi sistem, dan volume log aktivitas.
2. **Kelola Akun Sintetis:** Formulir penambahan akun demo baru (Username, Password, Nama, Peran) dan penghapusan akun kustom.
3. **Jejak Audit Komprehensif:** Tabel pencatatan seluruh peristiwa keamanan dan keputusan sistem (*DISETUJUI*, *DITOLAK*, *DITAHAN*, *PERINGATAN*).
4. **Ekspor CSV:** Mengunduh seluruh riwayat jejak audit ke dalam format berkas `.csv` berstandar UTF-8 (kompatibel dengan Microsoft Excel).

---

## 3. Akun Demo Sintetis

Gunakan kredensial pengujian berikut pada formulir login (tersedia juga tombol **Pilih Cepat** pada halaman login):

| Peran (Role) | Nama Lengkap | Username | Password | Deskripsi Pengujian |
| :--- | :--- | :--- | :--- | :--- |
| **Mahasiswa 1** | Ahmad Fauzi | `mhs001` | `mhs123` | Uji akses nilai pribadi & pengumpulan tugas |
| **Mahasiswa 2** | Siti Nurhaliza | `mhs002` | `mhs123` | Akun pembanding objek target simulasi IDOR |
| **Dosen** | Dr. Budi Santoso, M.Kom. | `dosen01` | `dosen123` | Uji pemberian nilai tugas (skala 0–100) & feedback |
| **Admin** | Administrator Sistem | `admin01` | `admin123` | Uji penambahan akun, tinjau audit log, & ekspor CSV |

---

## 4. Laboratorium Audit Keamanan (M5–M6 KSI)

Modul **Simulasi Audit KSI** menyediakan lingkungan pengujian visual untuk memahami bagaimana kontrol akses gagal dan bagaimana kontrol yang tepat diterapkan:

### Kerentanan 1: Insecure Direct Object References (IDOR / CWE-639)
- **Skenario:** Sesi aktif adalah `mhs001` (Ahmad Fauzi) yang mencoba meminta data nilai milik `mhs002` (Siti Nurhaliza) dengan memanipulasi parameter URL/objek: `student_id=mhs002`.
- **Tombol "Simulasikan Risiko IDOR":**
  - Menggambarkan perilaku endpoint yang rentan di mana server langsung mengembalikan data milik korban tanpa memeriksa identitas sesi pemohon.
  - Menampilkan data nilai privat milik Siti Nurhaliza kepada Ahmad Fauzi.
  - Dicatat ke Log Audit dengan keputusan `DITAHAN` / peringatan kebocoran data.
- **Tombol "Jalankan Pemeriksaan Aman":**
  - Menggambarkan penerapan kontrol otorisasi aman sisi server (`session.user_id === requested_resource.owner_id`).
  - Menolak akses dengan kode status `HTTP 403 Forbidden`.
  - Dicatat ke Log Audit dengan keputusan `DITOLAK`.

### Kerentanan 2: Eskalasi Hak Akses (Privilege Escalation / CWE-269)
- **Skenario:** Pengguna dengan peran mahasiswa mencoba memanipulasi atribut peran pada peramban melalui payload: `{ "role": "admin" }`.
- **Tombol "Simulasikan Risiko Eskalasi":**
  - Menggambarkan kelemahan *Mass Assignment* atau kepercayaan buta server terhadap klaim peran dari peramban klien.
  - Menjelaskan dampak fatal jika pengguna biasa memperoleh akses administratif.
  - *Catatan Keamanan:* Simulasi ini tidak benar-benar mengubah hak akses akun aktif pengguna, melainkan memperagakan risiko secara terkontrol.
  - Dicatat ke Log Audit dengan keputusan `PERINGATAN`.
- **Tombol "Tunjukkan Kontrol Aman":**
  - Menggambarkan penegakan *Role-Based Access Control* (RBAC) di sisi server di mana masukan peran dari klien diabaikan secara tegas dan peran diverifikasi ke basis data otoritatif.
  - Sesi tetap dipertahankan pada tingkat `mahasiswa`.
  - Dicatat ke Log Audit dengan keputusan `DITOLAK`.

---

## 5. Log Keputusan Audit & Ekspor CSV

Setiap tindakan penting dalam aplikasi dicatat secara otomatis ke dalam **Jejak Audit** dengan kolom:
1. **Waktu Aktivitas:** Format stempel waktu `YYYY-MM-DD HH:mm:ss`.
2. **Pengguna:** Nama akun pelaku aktivitas.
3. **Peran:** Peran akun saat aktivitas berlangsung.
4. **Jenis Aktivitas:** Kategori pengujian atau proses operasional.
5. **Keputusan Kontrol:** Status penegakan keamanan (`DISETUJUI`, `DITOLAK`, `DITAHAN`, `PERINGATAN`).
6. **Alasan Kontrol:** Keterangan teknis di balik keputusan keamanan tersebut.

Fitur **Ekspor Log ke CSV** dapat diakses melalui tab *Log Keputusan Audit* untuk mengunduh laporan berformat spreadsheet untuk lampiran laporan KSI.

---

## 6. Teknologi yang Digunakan

- **HTML5:** Struktur semantik, formulir tervalidasi, dropzone unggah berkas, dan dialog modal.
- **CSS3:** Tata letak modern kustom (Grid & Flexbox), palet warna korporat biru-putih khas portal universitas, status badges, dan animasi transisi halus.
- **JavaScript (ES6+):** Logika autentikasi demo, manipulasi DOM aman, filter tabel dinamis, simulator audit IDOR & eskalasi, serta generator berkas CSV.
- **localStorage & sessionStorage:** Penyimpanan state data sintetis lokal pada peramban peranti.

---

## 7. Batasan & Keterbukaan Keamanan (Security Disclosure)

Untuk keperluan pelaporan akademik yang objektif dan jujur, perhatikan batasan arsitektur berikut:

> [!IMPORTANT]
> 1. **Penyimpanan Lokal (localStorage):** `localStorage` hanya menyimpan data di peramban komputer pengguna saat ini. Data **tidak tersinkronisasi antar perangkat atau antar pengguna yang berbeda**.
> 2. **Bukan Database Bersama:** Jangan menganggap `localStorage` sebagai database produksi terpusat. Tombol *Reset Data Demo* disediakan jika ingin mengembalikan kondisi data ke bawaan pabrik.
> 3. **Bukan Autentikasi Produksi:** Autentikasi dan pengecekan kata sandi pada kode ini berjalan di sisi *front-end* untuk keperluan demonstrasi tugas. Pada lingkungan produksi nyata, seluruh validasi kredensial, hashing kata sandi (seperti Argon2 / Bcrypt), dan verifikasi izin objek (RBAC/ABAC) **wajib dilakukan secara ketat pada server-side backend**.
> 4. **Pencegahan XSS:** Seluruh data teks masukan pengguna yang ditampilkan kembali ke layar disanitasi menggunakan fungsi `escapeHTML` guna mengeliminasi injeksi skrip peramban.

---

## 8. Panduan Menjalankan Proyek Secara Lokal

### Menggunakan Antigravity / Browser Langsung:
1. Buka folder proyek di file manager laptop Anda:
   `c:\Users\USER\Documents\Proyek mandiri\portal-kampus-m56`
2. Klik dua kali pada berkas `index.html` untuk langsung membukanya di browser favorit Anda (Google Chrome, Mozilla Firefox, Microsoft Edge).
3. Atau, jika menggunakan ekstensi *Live Server* / HTTP server lokal:
   ```powershell
   npx serve .
   ```
4. Buka URL lokal yang muncul (misalnya `http://localhost:3000`).

---

## 9. Panduan Mengunggah ke GitHub & Mengaktifkan GitHub Pages

Proyek ini dirancang agar dapat di-host secara gratis dan instan di **GitHub Pages** tanpa memerlukan build step atau konfigurasi server tambahan.

### Langkah 1: Inisialisasi Git dan Commit Lokal
Buka terminal PowerShell pada direktori proyek:
```powershell
# 1. Masuk ke direktori proyek (jika belum)
cd "c:\Users\USER\Documents\Proyek mandiri\portal-kampus-m56"

# 2. Inisialisasi repositori Git
git init

# 3. Tambahkan semua berkas ke staging area
git add .

# 4. Buat commit pertama
git commit -m "feat: inisialisasi portal akademik KampusKita dan modul audit KSI M5-M6"
```

### Langkah 2: Buat Repositori di GitHub
1. Masuk ke akun [GitHub](https://github.com/) Anda.
2. Klik tombol **New Repository**.
3. Beri nama repositori, contohnya: `portal-kampus-m56` atau `kampuskita-audit`.
4. Pilih opsi **Public** (wajib Public jika menggunakan akun GitHub gratis untuk GitHub Pages).
5. Jangan centang "Initialize this repository with a README" (karena kita sudah memilikinya).
6. Klik **Create repository**.

### Langkah 3: Hubungkan dan Dorong (Push) Kode ke GitHub
Repositori telah berhasil dihubungkan dan di-push ke GitHub:
```powershell
git remote add origin https://github.com/FARIDZZ292/portal-kampus-m56.git
git push -u origin main
```

### Langkah 4: Mengaktifkan GitHub Pages
Fitur GitHub Pages telah diaktifkan secara otomatis pada branch `main` folder `/ (root)`.

### URL Publik GitHub & GitHub Pages:
- **Tautan Repositori GitHub:** [https://github.com/FARIDZZ292/portal-kampus-m56](https://github.com/FARIDZZ292/portal-kampus-m56)
- **Tautan Publik GitHub Pages:** [https://faridzz292.github.io/portal-kampus-m56/](https://faridzz292.github.io/portal-kampus-m56/)

---

## 10. Checklist Pengujian Wajib (Verification Checklist)

Gunakan daftar periksa berikut saat mendemonstrasikan aplikasi:

- [x] **1. Login sebagai Mahasiswa (`mhs001` / `mhs123`)** — Berhasil masuk dan menampilkan profil mahasiswa Ahmad Fauzi.
- [x] **2. Melihat Nilai Sendiri (KHS)** — Menampilkan tabel nilai mata kuliah milik akun aktif beserta kalkulasi IPK dan SKS.
- [x] **3. Mengunggah Tugas Kuliah** — Mahasiswa berhasil mengunggah berkas tugas baru, status menjadi *Menunggu Penilaian*.
- [x] **4. Mengirim Pesan Diskusi** — Pesan diskusi terkirim dan muncul di feed forum kelas secara aman.
- [x] **5. Login sebagai Dosen (`dosen01` / `dosen123`)** — Tampilan menu berubah khusus dosen, daftar pengumpulan tugas mahasiswa terlihat.
- [x] **6. Memberikan Nilai & Feedback Dosen** — Dosen berhasil menilai tugas dengan angka 0–100 dan status berubah menjadi *Sudah Dinilai*.
- [x] **7. Mengunduh Berkas Tugas Mahasiswa** — Dosen dapat mengunduh berkas simulasi tugas langsung di peramban.
- [x] **8. Login sebagai Admin (`admin01` / `admin123`)** — Menu *Kelola Akun Demo* aktif, dapat menambah akun sintetis baru dan menghapusnya.
- [x] **9. Memeriksa Jejak Log Aktivitas** — Seluruh riwayat login, submit tugas, penilaian, dan manipulasi akun tercatat rapi.
- [x] **10. Menjalankan Simulasi IDOR** — Tombol simulasi rentan memperlihatkan kebocoran data `mhs002`, tombol aman memperlihatkan penolakan HTTP 403.
- [x] **11. Menjalankan Simulasi Eskalasi Hak Akses** — Tombol simulasi rentan memperlihatkan risiko parameter peran klien, tombol aman menegakkan RBAC server.
- [x] **12. Ekspor Log Audit ke CSV** — Berkas `log_audit_kampuskita_YYYY-MM-DD.csv` terunduh dengan isi yang valid.
- [x] **13. Uji Persistensi Data (Refresh Browser)** — Data tugas, nilai, dan akun baru tetap tersimpan di `localStorage` saat halaman dimuat ulang.
- [x] **14. Tampilan Responsif** — Antarmuka beradaptasi dengan baik pada layar laptop maupun ponsel cerdas (mobile menu drawer aktif).

---

*Dikembangkan untuk Tugas Audit Keamanan Sistem Informasi (KSI) Modul M5–M6.*
