# loweredNG: tool web untuk menurunkan (ceperin) mod BeamNG

Author: RFVNX

Status: prototype satu halaman sudah jalan. Dokumen ini merangkum konsep, alur, keputusan arsitektur, apa yang sudah terbukti, dan langkah berikutnya.

## 1. Tujuan

Pengguna mengunggah zip mod mobil BeamNG.drive. Tool mengubah batas min/maks variabel alignment (camber, toe, offset, tinggi) di file `suspension_f` dan `suspension_r`, lalu mengembalikan zip yang sama dengan hanya angka itu yang berubah.

## 2. Alur pengguna

1. Unggah zip mod (drag-drop atau pilih file).
2. Aplikasi mencari file `*.jbeam`, menebak sisi depan/belakang dari nama file, dan membaca tabel `variables`. Pengguna bisa mengubah tebakan per file (Depan / Belakang / Lewati).
3. Pengguna mengisi setelan min/maks per parameter dan per sisi. Kolom kosong berarti tidak diubah.
4. Pratinjau menampilkan tiap variabel yang cocok: rentang lama, rentang baru, nilai default, status. Pengguna bisa mencentang atau membatalkan per baris.
5. Unduh zip hasil edit (`namamod_loweredNG.zip`).

## 3. Setelan awal (dari catatan pemilik ide)

Angka ini belum diverifikasi terhadap game. Bandingkan dengan kolom "lama" di pratinjau sebelum dipercaya.

| Parameter | Depan min | Depan maks | Belakang min | Belakang maks |
| --------- | --------- | ---------- | ------------ | ------------- |
| Camber    | 0.55      | 1.25       | 0.55         | 1.25          |
| Toe       | 0.60      | 1.50       | 0.60         | 1.25          |
| Offset    | tetap     | 0.1        | tetap        | 0.1           |
| Tinggi    | -0.50     | tetap      | -0.50        | tetap         |

Input menerima koma desimal (`0,55`) dan mengubahnya ke titik.

## 4. Arsitektur

**Frontend saja, hosting statis. Tanpa backend Node.**

- Semua proses (baca zip, edit jbeam, susun zip, unduh) jalan di browser pengguna.
- File mod tidak pernah diunggah ke server. Privasi terjaga dan kamu tidak ikut menyimpan atau menyebarkan mod orang lain.
- Hosting nanti saya lakukan menggunakan domain saya yang sudah ada
- Backend baru masuk akal kalau nanti ada akun pengguna, preset yang dibagikan lewat link, atau statistik pemakaian.
- Serverless function tidak disarankan untuk memproses zip: batas ukuran request biasanya hanya beberapa MB (cek dokumentasi hosting), sedangkan zip mod bisa puluhan sampai ratusan MB.

Stack yang dipakai prototype: HTML + JS biasa, JSZip 3.10.1. Rencana versi serius: Vite + React + TypeScript, JSZip dari npm.

## 5. Logika inti (`core.js`, tanpa DOM)

| Fungsi                         | Tugas                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `scanFile(text)`               | Menemukan setiap `"variables": [...]`, membaca barisnya, mengembalikan variabel alignment beserta posisi karakter sel min/maks |
| `detectAxle(path)`             | `suspension_f` / `suspension_front` menjadi `F`, `suspension_r` / `suspension_rear` menjadi `R`, selain itu `null`             |
| `planFor(row, axle, settings)` | Menghitung rentang baru, edit yang diperlukan, dan status (`ok`, `warn`, `same`, `skip`)                                       |
| `applyEdits(text, edits)`      | Mengganti teks sel dari belakang ke depan supaya posisi tidak bergeser                                                         |

Keputusan penting:

- **Edit di tempat berdasarkan posisi karakter, bukan parse lalu serialisasi ulang.** JBeam bukan JSON valid (ada komentar, koma berlebih, bahkan koma yang hilang), jadi `JSON.parse` gagal dan serialisasi ulang akan merusak format dan komentar.
- Scanner mengenali string, komentar `//` dan `/* */`, objek/array bersarang, dan elemen tanpa koma.
- Kolom dicari dari baris header (`name`, `type`, `default`, `min`, `max`), tidak mengandalkan nomor urut kolom.
- Hanya variabel bertipe `range` yang disentuh.
- Pencocokan nama variabel memakai pola (tanpa `$` dan huruf kecil): berisi `camber`, `toe`, `offset`, atau `height`. Nama persis berbeda antar mod.
- Sisi depan/belakang ditentukan dari nama file, bukan dari akhiran nama variabel.
- Baris dilewati bila min baru ≥ maks, atau bila min/maks di file bukan angka biasa.
- Baris diberi tanda "Cek default" bila nilai default jatuh di luar rentang baru. Perubahan tetap diterapkan.
- Saat membuat zip, file jbeam yang tidak dipilih dikembalikan ke teks aslinya, jadi unduhan ulang dengan pilihan berbeda tidak membawa sisa edit sebelumnya.

## 6. Yang sudah terbukti (uji di Node)

- Edit jbeam menghasilkan output identik byte per byte dengan aslinya, kecuali angka yang diganti (termasuk baris CRLF dan teks komentar yang mengandung kata `variables`).
- Menjalankan edit dua kali tidak mengubah apa-apa lagi (idempoten).
- Round-trip zip dengan JSZip asli: struktur folder sama, file non-jbeam (tekstur, `info.json`) identik byte per byte, hanya file `suspension_F` dan `suspension_R` yang berubah.

## 7. Yang belum terbukti

1. **Mod BeamNG asli.** Semua tes memakai data buatan sendiri. Nama variabel di mod asli bisa berbeda dari pola.
2. **Skala angka.** Belum diketahui apakah angka di bagian 3 sesuai skala variabel di mod asli (misalnya multiplier dengan default 1, atau derajat).
3. **Efek di game.** Belum dicek apakah BeamNG menerima rentang yang diperlebar dan apakah mobil benar-benar jadi lebih ceper. Belum dicek juga bagaimana game menangani default yang di luar rentang.
4. **UI di browser.** Tombol, drag-drop, dan unduhan belum dijalankan di browser. Sintaks script sudah dicek.
5. **Mod tanpa file suspensi.** Mod yang hanya berisi roda atau body biasanya memakai suspensi bawaan game, jadi tool ini tidak berlaku. Ide mod kecil berisi file override belum dites, dan prioritas part bernama sama di BeamNG belum dipastikan.

## 8. Risiko dan catatan

- Zip besar dimuat penuh ke memori browser (JSZip). Aman untuk puluhan MB, bisa lambat atau gagal untuk ratusan MB di perangkat ber-RAM kecil. Alternatif nanti: library streaming.
- Prototype memuat JSZip dari CDN. Untuk deploy, bundle sendiri lewat npm. Font Google juga bisa di-host sendiri.
- Tombol unduh punya dua jalur: jalur khusus Claude, dan unduhan browser biasa (`<a download>`) sebagai cadangan. Jalur kedua belum dites di hosting biasa.

## 9. Langkah berikutnya

1. **Tes satu mod asli** yang suspensinya ada di dalam zip. Kirim tabel pratinjaunya untuk mengecek pencocokan variabel dan skala angka.
2. Tes hasil zip di game: mobil benar-benar lebih ceper, slider di UI game memakai rentang baru, tidak ada error di log.
3. Sesuaikan pola nama dan setelan awal sesuai temuan dari mod asli.
4. Pindah ke Vite + React + TypeScript:
   - `core.js` menjadi modul TypeScript (mis. `src/core/jbeam.ts`).
   - Kasus uji di `test.js` dipindah ke Vitest.
   - JSZip dipasang dari npm.
   - UI dipecah jadi komponen: Dropzone, SettingsGrid, FileList, PreviewTable, DownloadBar.
5. Deploy ke hosting statis dan tes unduhan di browser biasa (desktop dan HP).
6. Pertimbangkan nanti: dukungan beberapa mod sekaligus, preset (misalnya "agak ceper", "ceper ekstrem"), dan penanganan mod tanpa suspensi.
