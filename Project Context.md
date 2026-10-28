# PELITA — Personal Life Assistant

> **Pembaruan konteks:** 14 Oktober 2026

> **Tagline:** *Plan your time. Control your money. Understand your health.*

## 1. Tujuan Dokumen

Dokumen ini menjadi **konteks utama dan acuan keputusan produk PELITA**. Gunakan dokumen ini ketika melanjutkan diskusi, menyusun kebutuhan, merancang sistem, membuat UI/UX, mengembangkan aplikasi, dan menyiapkan dokumen akademik. Informasi yang sudah ditetapkan di sini tidak perlu ditanyakan kembali, kecuali memang ada konflik atau keputusan baru.

Dokumen ini menjelaskan konsep produk dan merupakan **sumber keputusan utama (*single source of truth*)** untuk PELITA. Kita tidak akan menyusun PRD terpisah; deskripsi konteks Markdown ini dianggap cukup untuk menjelaskan tujuan, cakupan, perilaku, dan keputusan produk. Dokumen formal berikutnya adalah SRS, SDD, STD/DUPL, dan User Manual. Jika dokumen lain tidak konsisten dengan dokumen ini, gunakan dokumen ini sebagai acuan lalu perbarui dokumen turunannya.

---

## 2. Gambaran Umum Produk

**PELITA (Personal Life Assistant)** adalah aplikasi **web-based yang responsif untuk desktop/laptop dan mobile**, dengan antarmuka berbahasa Inggris. PELITA membantu pengguna mengelola tiga aspek kehidupan sehari-hari yang saling terhubung:

1. **Schedule** — agenda, tugas, rapat, kegiatan, tenggat waktu, kalender, dan pengingat.
2. **Finance** — dompet, saldo, pemasukan, pengeluaran, kategori transaksi, batas pengeluaran, dan laporan.
3. **Nutrition Tracking** — catatan makanan, estimasi nutrisi, target pribadi, kemajuan nutrisi harian, dan pengingat.

PELITA adalah **satu aplikasi terintegrasi**, bukan tiga aplikasi yang terpisah. Aplikasi menyediakan:

- **AI Chat / Quick Input:** cara cepat untuk memasukkan atau melaporkan informasi melalui teks, foto/gambar, dan pesan suara.
- **Dashboard dan halaman domain:** tempat meninjau, mencari, mengubah, menghapus, memvisualisasikan, dan mengekspor data yang sudah dicatat.
- **PWA dan Web Push Notification:** agar pengguna dapat memasang PELITA di Home Screen dan menerima pengingat melalui notifikasi perangkat jika platform mendukungnya.

AI merupakan bagian inti dari cara pengguna berinteraksi dengan data PELITA, bukan chatbot umum yang berdiri sendiri.

## 3. Prinsip Utama Produk

Pengguna seharusnya dapat menyampaikan kebutuhan dengan bahasa sehari-hari, tanpa perlu mengisi formulir panjang. AI memahami input, menentukan domain yang relevan, menghasilkan tindakan terstruktur, dan menyimpan data melalui backend setelah validasi yang sesuai.

Contoh:

- **Teks:** `Tadi sekitar jam 12 saya sarapan nasi goreng seharga Rp20.000.` AI mencatat makanan ke Nutrition dan pengeluaran ke Finance jika konteksnya cukup jelas.
- **Pesan suara:** `Ingatkan ya, besok jam 1 WIB aku ada meeting sama tim lomba.` Sistem mengubah suara menjadi teks, mengenali agenda serta waktunya, lalu menyimpan jadwal dan reminder.
- **Foto makanan:** AI mengenali atau memperkirakan makanan dan kandungan nutrisinya. Hasilnya dicatat sebagai estimasi yang dapat diperbaiki.
- **Foto struk:** AI/OCR membaca informasi transaksi dan menyiapkan catatan pengeluaran yang sesuai.
- **Pertanyaan:** `Berapa pengeluaran saya minggu ini?` AI menjawab berdasarkan data yang benar-benar tersimpan milik pengguna.

Data di database merupakan **sumber kebenaran utama (*source of truth*)**. AI tidak boleh mengarang transaksi, jadwal, atau hasil laporan yang tidak didukung data.

---

## 4. Aturan Perilaku AI Chat

AI Chat mendukung empat jenis interaksi:

1. **Mencatat:** membuat agenda, transaksi keuangan, atau catatan makanan/nutrisi.
2. **Mengelola catatan:** mencari, mengubah, atau menghapus catatan yang sudah ada.
3. **Menjawab pertanyaan:** menjawab pertanyaan yang berkaitan dengan Schedule, Finance, atau Nutrition berdasarkan data pengguna.
4. **Membuat ringkasan/laporan:** menyusun ringkasan periode tertentu berdasarkan data yang tersimpan.

Pesan yang tidak berkaitan dengan empat jenis interaksi tersebut tidak diproses sebagai tindakan. AI mengarahkan pengguna kembali dengan respons singkat, misalnya: **“Hi! Is there anything you’d like me to record?”** Pesan di luar konteks tidak disimpan sebagai catatan maupun riwayat percakapan.

### Bahasa dan waktu

- Bahasa seluruh UI aplikasi adalah **bahasa Inggris**.
- AI harus memahami bahasa Indonesia informal, singkatan, bahasa campuran, serta bahasa Inggris.
- **Bahasa balasan AI mengikuti bahasa pengguna**.
- Zona waktu default akun adalah **Asia/Jakarta (WIB)**. Pengguna dapat menentukan zona waktu lain jika diperlukan.
- AI memahami ungkapan relatif seperti “besok siang”, “tadi jam 12”, atau “satu jam sebelumnya”. Waktu relatif ditafsirkan terhadap waktu lokal akun dan harus diubah menjadi tanggal/waktu yang eksplisit sebelum disimpan.
- Jika tanggal/waktu, zona waktu, atau informasi penting ambigu, AI bertanya, bukan menebak. Agenda yang melintasi tengah malam harus menyimpan tanggal dan waktu mulai serta selesai secara benar; waktu selesai tidak boleh diam-diam dianggap terjadi sebelum waktu mulai.
- Agenda berulang dapat didukung (misalnya harian atau mingguan). Saat pengguna mengubah atau menghapus agenda berulang, AI harus membedakan satu kejadian dari seluruh rangkaian dan meminta klarifikasi jika maksudnya belum jelas.

### Tindakan terstruktur, validasi, dan duplikasi

- AI menghasilkan **tindakan terstruktur** untuk operasi create/read/update/delete/query, bukan menjalankan perubahan database secara langsung.
- Backend memvalidasi skema, tipe data, rentang nilai, kepemilikan record, field wajib, dan aturan bisnis sebelum melakukan tindakan apa pun.
- Setiap tindakan dibatasi pada akun yang sedang terautentikasi. AI tidak boleh mengakses atau mengubah data akun lain, meskipun pengguna memberikan ID record secara manual.
- Sistem harus mencegah input yang sama tersimpan dua kali akibat retry, jaringan terputus, atau pengiriman tombol yang berulang. Gunakan identitas/idempotency untuk operasi yang sesuai dan periksa hasil operasi sebelum mengulanginya.
- Respons **“Noted — saved”** hanya boleh diberikan setelah backend mengonfirmasi bahwa penyimpanan berhasil. Jika gagal, sampaikan kegagalan dengan jelas dan jangan berpura-pura bahwa data telah tersimpan.
- Untuk input yang cukup jelas, AI boleh langsung menyimpan. Jika informasi penting kurang atau ambigu, AI mengajukan pertanyaan klarifikasi.
- Satu input dapat menghasilkan catatan di lebih dari satu domain hanya bila konteksnya mendukungnya. Contohnya, makanan beserta harga yang jelas dapat membuat catatan Nutrition dan Finance.

### Perubahan dan penghapusan data

- Untuk perubahan, AI harus menentukan record yang tepat dan merangkum nilai yang akan diubah. Jika ada beberapa record yang mungkin cocok atau perubahan berisiko mengubah maksud catatan, AI meminta pengguna memilih atau mengklarifikasi terlebih dahulu.
- **Sebelum menghapus, AI wajib menampilkan detail record yang akan dihapus**, misalnya domain, judul/tanggal agenda, atau tanggal/nominal/kategori/wallet transaksi, lalu meminta konfirmasi eksplisit.
- Jika target tidak unik, AI harus meminta pengguna memilih record yang benar dan tidak boleh menebak.
- Setelah pengguna mengonfirmasi penghapusan, record dihapus **secara permanen**. Tidak ada mekanisme soft-delete atau pemulihan dari aplikasi setelah konfirmasi. Lampiran yang secara eksklusif terkait dengan record tersebut juga harus dihapus sesuai aturan retensi dan konsistensi data. Dampak pada data turunan/laporan harus diperbarui.
- Untuk penghapusan besar atau rangkaian agenda berulang, ringkasan dampaknya harus ditampilkan dan konfirmasi harus secara jelas mencakup semua record yang terdampak.

### Estimasi gambar, suara, dan kegagalan

- Untuk hasil OCR struk atau estimasi nutrisi dari foto yang kurang meyakinkan, AI menampilkan hasil sementara dan meminta konfirmasi/koreksi sebelum menyimpan bagian yang tidak pasti.
- Pemrosesan suara harus menyediakan hasil transkripsi atau ringkasan input yang dapat diperiksa ketika pengenalannya tidak meyakinkan.
- Jika layanan AI, OCR, atau speech-to-text gagal, sistem memberi tahu pengguna dan tidak membuat record parsial yang menyesatkan. Jika sebagian operasi multi-domain berhasil sedangkan bagian lain gagal, tampilkan status tiap operasi dengan jelas dan sediakan cara aman untuk melanjutkan tanpa membuat duplikasi.

### Penyimpanan percakapan dan data

- **Riwayat percakapan AI tidak disimpan secara persisten.** Pesan pengguna dan balasan AI hanya diperlukan selama proses aktif untuk menyelesaikan interaksi; pesan chat mentah, percakapan di luar konteks, dan transkrip suara tidak dijadikan arsip chat permanen.
- Yang disimpan secara persisten adalah **data domain yang memang dibuat atau diubah** (Schedule, Finance, Nutrition), lampiran yang diperlukan dan ditautkan pada record, data akun/pengaturan, serta metadata operasional minimum yang diperlukan untuk autentikasi dan pengiriman reminder. Metadata operasional tidak boleh menyimpan isi percakapan lebih dari yang dibutuhkan.
- Foto makanan atau struk yang disimpan sebagai lampiran harus terkait ke record relevan, hanya dapat diakses pemiliknya, dan ikut ditangani ketika record dihapus.

### Privasi pemrosesan hybrid dan pengelolaan file

- Karena PELITA menggunakan AI hybrid, sebagian input mungkin diproses oleh layanan/API eksternal. Backend hanya mengirim data minimum yang diperlukan untuk tugas tersebut; jangan mengirim seluruh profil atau seluruh riwayat domain pengguna jika tugas hanya memerlukan satu catatan.
- Sebelum pemrosesan eksternal digunakan pertama kali, pengguna harus diberi penjelasan yang jelas dan tersedia pengaturan untuk menonaktifkan pemrosesan eksternal. Jika dinonaktifkan, sistem tidak boleh mengirim data ke provider eksternal; gunakan pemrosesan lokal hanya jika tugas didukung secara memadai, selain itu beri tahu pengguna bahwa tugas tersebut belum dapat diselesaikan.
- Status default pengaturan pemrosesan eksternal (aktif atau nonaktif pada akun baru) belum ditetapkan dan harus diputuskan secara eksplisit pada desain SRS/SDD/UX sebelum implementasi; jangan mengasumsikannya diam-diam.
- API key dan rahasia integrasi hanya disimpan serta digunakan di server, tidak pernah ditanam di frontend atau dikirim ke browser.
- Provider eksternal harus dievaluasi pada tahap SDD berdasarkan kebijakan retensi data, penggunaan data untuk pelatihan, kontrol privasi, biaya, dan kemampuan yang diperlukan. Kebijakan yang berlaku harus dijelaskan kepada pengguna secara transparan.
- File sementara untuk transkripsi, OCR, atau analisis gambar dihapus setelah pemrosesan selesai atau setelah kegagalan dipastikan tidak memerlukan retry. File audio mentah dan transkrip tidak disimpan sebagai riwayat permanen.
- Lampiran permanen hanya dipertahankan jika memang terkait dengan catatan domain, seperti foto struk sebagai bukti transaksi. Lampiran tersebut mengikuti akses dan penghapusan record induknya. Jika sebuah file dipakai oleh lebih dari satu record, file baru dihapus setelah tidak lagi direferensikan oleh record lain.
- Bila layanan eksternal tidak tersedia, sistem dapat mencoba pemrosesan lokal hanya jika tugas tersebut didukung dengan kualitas yang memadai. Jika tidak, sistem menjelaskan kegagalan dan meminta pengguna mencoba kembali; jangan mengklaim proses berhasil.

---

## 5. Akun dan Autentikasi

PELITA mendukung dua metode autentikasi: **akun lokal** (email dan password) serta **Google Sign-In**. Akun PELITA dapat mengubah nama tampilan/username dan menghapus akun, tetapi kemampuan pengelolaan password berbeda menurut metode login.

### Akun lokal (email/password)

- Pengguna dapat membuat akun, login, logout, mengubah nama tampilan/username, mengubah password, meminta reset password melalui tautan email, dan menghapus akun PELITA.
- Pendaftaran dilakukan secara mandiri oleh pengguna yang dapat mengakses aplikasi melalui jaringan privat Tailscale. Tidak ada kode undangan dan tidak ada dashboard administrator. Pembatasan jaringan bukan pengganti autentikasi maupun otorisasi di backend.
- **Verifikasi email wajib** untuk akun lokal. Akun lokal belum dapat digunakan secara penuh sampai alamat email diverifikasi. Jika layanan email belum dikonfigurasi atau pengiriman verifikasi gagal, aplikasi tidak boleh berpura-pura bahwa email telah terkirim atau akun telah diverifikasi; pengguna menerima pesan yang jelas. Google Sign-In tetap menjadi metode login terpisah.
- Perubahan password ketika sudah login memerlukan verifikasi yang sesuai, misalnya password saat ini atau alur verifikasi ulang yang aman.
- Tautan reset password harus sekali pakai, memiliki masa berlaku terbatas, dan menggunakan token acak yang tidak menyimpan password. Permintaan reset tidak boleh membocorkan apakah suatu alamat email terdaftar.
- Reset password lewat email bergantung pada layanan SMTP/API email yang dikonfigurasi pada server. Jika layanan belum dikonfigurasi atau gagal mengirim, aplikasi harus memberi pesan yang jujur dan tidak mengklaim tautan telah dikirim.
- Password wajib disimpan sebagai hash yang kuat, bukan teks asli.

### Akun Google

- Pengguna dapat login melalui Google dan mengubah nama tampilan/username di PELITA.
- Pengguna **tidak dapat mengubah password Google melalui PELITA**; pengelolaan password tetap dilakukan melalui Google.
- Pengguna dapat menghapus akun PELITA. Penghapusan tersebut tidak menghapus akun Google pengguna.

### Aturan umum akun

- Pengguna dapat mengubah foto profil jika fitur tersebut tersedia untuk akun mereka, serta mengatur tema dan preferensi notifikasi.
- Penghapusan akun harus memerlukan konfirmasi eksplisit dan autentikasi ulang yang sesuai dengan metode login. Sebelum konfirmasi akhir, UI harus menjelaskan bahwa penghapusan bersifat permanen.
- Setelah penghapusan akun dikonfirmasi, sistem menghapus akun PELITA dan seluruh data yang dimiliki akun tersebut, termasuk record Schedule, Finance, Nutrition, wallet, profil/pengaturan, lampiran milik akun, langganan Web Push, dan sesi aktif. Data tidak dapat dipulihkan melalui aplikasi. Penghapusan ini tidak menghapus akun Google itu sendiri.
- PELITA tidak menggabungkan dua akun secara otomatis hanya karena emailnya sama. Fitur pengaitan/merger akun Google dan akun lokal tidak termasuk cakupan saat ini. Jika email bertabrakan dengan metode login yang berbeda, sistem harus memberi pesan yang jelas dan tidak menggabungkan atau memindahkan data secara diam-diam.
- Logout mengakhiri sesi terkait. Sesi autentikasi harus memiliki masa berlaku yang wajar dan dapat dicabut; rahasia layanan disimpan di konfigurasi server yang tidak dipublikasikan.

PELITA mendukung **beberapa akun pengguna**. Data setiap pengguna harus terisolasi sepenuhnya: agenda, transaksi, wallet, nutrisi, profil, lampiran, pengaturan, dan laporan satu pengguna tidak boleh dapat diakses atau tercampur dengan pengguna lain. Pemeriksaan kepemilikan dilakukan di backend untuk setiap permintaan, termasuk akses langsung melalui ID record, unduhan lampiran, ekspor, dan konteks yang dikirim ke AI. Data sensitif tidak boleh ditulis ke log aplikasi tanpa alasan dan perlindungan yang memadai.

Setelah login normal, halaman tujuan adalah **Dashboard**. Jika pengguna masuk melalui shortcut khusus AI Chat di mobile, aplikasi mengarahkan pengguna ke AI Chat setelah sesi terverifikasi. Jika sesi sudah kedaluwarsa, pengguna login terlebih dahulu lalu dikembalikan ke halaman tujuan awal.

---

## 6. Fitur Utama

### 6.1 Dashboard

Dashboard merupakan ringkasan tiga domain dan menyediakan akses cepat ke detailnya. Konten dapat mencakup:

- Agenda mendatang, tugas, dan reminder.
- Total saldo seluruh wallet, transaksi terbaru, serta status anggaran.
- Ringkasan nutrisi hari ini dibandingkan target.
- Peringatan relevan dan aktivitas terbaru.

Dashboard tidak menggantikan halaman domain; pengguna tetap dapat membuka detail, mengubah catatan, dan melihat laporan. Dashboard menampilkan ringkasan utama, sedangkan setiap halaman domain menyediakan filter periode, grafik yang relevan dengan domainnya, dan ekspor CSV/JSON. Analisis lintas-domain yang lebih kompleks bukan kebutuhan dashboard yang ditetapkan saat ini.

### 6.2 Schedule

Schedule mengelola agenda yang telah berlalu maupun yang akan datang, termasuk tugas, kegiatan, kelas, rapat, acara, dan deadline.

Fitur:

- Menggunakan **satu model agenda terpadu** dengan tipe seperti `Task`, `Event`, dan `Deadline`, bukan tiga sistem terpisah. Field umum (judul, deskripsi, tanggal/waktu, zona waktu, kategori, status, dan reminder) digunakan bersama; field khusus hanya diisi bila relevan dengan tipe tersebut.
- Membuat, melihat, mengubah, dan menghapus agenda.
- Detail seperti judul, deskripsi, tanggal, waktu, zona waktu, kategori, status, dan informasi terkait.
- Status disesuaikan dengan tipe: misalnya task dapat berstatus pending/in progress/completed/cancelled, sedangkan event atau deadline menggunakan status yang sesuai. Daftar nilai final dan aturan validasinya ditetapkan dalam SRS.
- Tampilan daftar dan kalender, dengan penanda visual pada tanggal yang memiliki agenda.
- Agenda berulang mendukung pola standar: harian, mingguan dengan pilihan hari, dan bulanan. Pengulangan dapat diakhiri pada tanggal tertentu atau setelah jumlah kejadian tertentu. Saat pengguna mengubah atau menghapus agenda berulang, sistem harus membedakan satu kejadian dari seluruh rangkaian dan meminta klarifikasi/konfirmasi bila cakupannya belum jelas.
- Membuat atau mengubah agenda melalui AI Chat maupun antarmuka manual.
- Pengaturan waktu reminder per agenda.
- Ekspor catatan berdasarkan rentang tanggal ke **CSV** atau **JSON**.

**Aturan reminder Schedule:**

- Default: **1 jam sebelum agenda dimulai**.
- Pengguna dapat meminta atau mengubah reminder melalui AI Chat atau antarmuka.
- Pengingat disampaikan melalui notifikasi dalam aplikasi dan PWA Web Push jika sudah diaktifkan dan perangkat mendukungnya.
- Gunakan zona waktu yang disebut pengguna (misalnya WIB). Jika tidak disebutkan, gunakan zona waktu akun; default awal akun adalah **Asia/Jakarta (WIB)**. Simpan nilai waktu secara timezone-aware agar waktu tetap benar ketika ditampilkan atau dihitung.
- Jika agenda diubah atau dibatalkan, reminder terkait harus ikut diperbarui atau dibatalkan agar tidak mengirim notifikasi usang.

### 6.3 Finance

Finance merupakan sistem pencatatan keuangan pribadi yang menyimpan pemasukan dan pengeluaran, mengelola saldo, serta memantau anggaran.

Fitur:

- Membuat beberapa **wallet**.
- Saat membuat wallet, pengguna menetapkan **saldo awal**.
- Wallet yang tidak lagi digunakan **diarsipkan**, bukan dihapus beserta riwayatnya. Wallet arsip tetap tersedia untuk melihat transaksi dan laporan historis, tetapi tidak dapat dipilih untuk transaksi baru kecuali diaktifkan kembali melalui alur yang ditentukan.
- Mencatat pemasukan dan pengeluaran yang terkait dengan wallet.
- Menampilkan saldo setiap wallet dan **total saldo dari seluruh wallet**.
- Menampilkan riwayat transaksi berdasarkan tanggal atau rentang tanggal.
- Menyediakan kategori bawaan serta mengizinkan pengguna membuat, mengubah, dan mengarsipkan kategori Finance sendiri.
- Jika kategori sudah dipakai transaksi, kategori tidak dihapus dengan cara yang merusak histori; kategori dapat diarsipkan atau transaksi dipindahkan ke kategori lain secara eksplisit. Transaksi lama tetap dapat menampilkan nama/kategori yang benar.
- AI membantu menentukan kategori, membaca detail struk, serta menyusun transaksi dari input teks, foto, atau suara.
- Pengguna dapat memperbaiki nominal, tanggal, kategori, wallet, deskripsi, atau detail transaksi.
- Ekspor data berdasarkan rentang tanggal ke **CSV** dan **JSON**.

**Aturan Finance yang sudah ditetapkan:**

- Mata uang utama: **Rupiah (IDR)**.
- Tidak perlu fitur transfer saldo antar-wallet untuk cakupan saat ini.
- Anggaran harian dan mingguan bisa diatur pengguna.
- Transaksi otomatis berulang tidak termasuk cakupan saat ini. Pengguna membuat setiap transaksi melalui UI atau AI seperti transaksi biasa; tidak ada scheduler yang otomatis menciptakan transaksi rutin.
- Contoh batas bawaan yang direncanakan: **Rp50.000 per hari** dan **Rp350.000 per minggu**; pengguna tetap dapat menyesuaikan nilai tersebut.
- Minggu keuangan dihitung dari **Senin sampai Minggu**.
- Sistem mengirim peringatan saat pengeluaran mendekati batas dan saat batas benar-benar terlampaui. Ambang “mendekati batas” awal yang direkomendasikan adalah **80%** dari limit; ambang ini dapat dibuat sebagai pengaturan.
- Peringatan dapat ditampilkan pada AI Chat/notifikasi dalam aplikasi dan melalui PWA Web Push jika diaktifkan.
- Hindari mengirim peringatan yang sama terus-menerus untuk kondisi yang sama; catat status peringatannya dan kirim lagi hanya bila diperlukan.

Data transaksi sebaiknya memiliki nominal, waktu/tanggal, jenis pemasukan/pengeluaran, wallet, kategori, deskripsi/merchant, dan referensi bukti transaksi jika tersedia. Pengeluaran dari foto struk harus divalidasi dan dapat dikoreksi. Saldo dan laporan dihitung dari transaksi tersimpan, bukan dari teks yang dibuat AI secara bebas.

**Aturan perhitungan dan koreksi Finance:**

- Saldo wallet dihitung dari saldo awal ditambah seluruh pemasukan dan dikurangi seluruh pengeluaran yang valid. Saldo tidak boleh diketik ulang sebagai pengganti transaksi.
- Nominal setiap transaksi disimpan sebagai nilai numerik IDR; jenis transaksi menentukan apakah nilai tersebut menambah atau mengurangi saldo. Jangan mengandalkan tanda minus yang diketik pengguna untuk menentukan jenis transaksi.
- Mengubah atau menghapus transaksi harus menghitung ulang saldo wallet, ringkasan, grafik, dan penggunaan anggaran yang terdampak.
- Transaksi bertanggal lampau tetap masuk ke periode berdasarkan tanggal transaksi, bukan waktu saat record dibuat. Perubahan transaksi lama memperbarui laporan periode terkait, tetapi tidak memicu notifikasi anggaran yang seolah-olah terjadi saat ini untuk periode yang sudah berlalu.
- Refund dicatat sebagai transaksi tersendiri dengan kategori **Refund**, dan ditautkan ke pengeluaran asal jika diketahui. Saldo wallet bertambah pada tanggal refund. Refund yang tertaut ditampilkan terpisah dan dapat mengurangi pengeluaran bersih pada periode tanggal refund; transaksi pengeluaran asal tidak dihapus atau ditimpa. Refund yang tidak dapat ditautkan tetap dicatat sebagai pemasukan dengan kategori Refund dan tidak boleh secara otomatis mengubah transaksi lain.
- Sistem harus membantu mendeteksi kemungkinan transaksi ganda (misalnya merchant, tanggal, dan nominal serupa), tetapi meminta konfirmasi pengguna sebelum menggabungkan atau menghapus transaksi yang tampak mirip. Pencegahan retry teknis tetap dilakukan dengan idempotency agar satu pengiriman tidak membuat dua record.
- Laporan sebaiknya membedakan total pemasukan, total pengeluaran bruto, refund, dan pengeluaran bersih agar pengaruh refund tidak tersembunyi. Perhitungan anggaran harus konsisten dengan definisi net spending tersebut dan dijelaskan di UI.

### 6.4 Nutrition Tracking

Nutrition Tracking mengelola catatan makanan dan estimasi asupan nutrisi harian pengguna.

Sebelum mulai menggunakan fitur ini, pengguna menyiapkan profil nutrisi, yang dapat mencakup:

- Tujuan: **bulking, cutting, atau maintenance**.
- Umur, jenis kelamin, tinggi badan, berat badan saat ini, berat badan target, serta komponen lain yang diperlukan untuk estimasi kebutuhan harian.
- Target nutrisi yang dihitung otomatis berdasarkan profil.

Sistem menampilkan **target ideal yang disarankan**, tetapi pengguna tetap dapat menyesuaikan target secara manual. Nilai manual tidak boleh ditolak hanya karena berbeda dari rekomendasi sistem. Jika target yang dimasukkan tampak tidak wajar atau berpotensi tidak sesuai, berikan pemberitahuan yang menjelaskan kekhawatirannya tanpa diam-diam mengubah target pengguna.

**Komponen nutrisi yang dilacak:**

- Kalori/energi.
- Protein.
- Karbohidrat.
- Gula.
- Lemak.
- Serat.
- Air.
- Natrium.
- Komponen lain dapat ditambahkan bila dibutuhkan dan sumber datanya memadai.

**Input dan estimasi makanan:**

- Makanan dapat dicatat dari teks, pesan suara, atau foto.
- AI memperkirakan makanan dan kandungan nutrisinya; nilai dari foto wajib diberi label **estimasi**, bukan ukuran pasti.
- Porsi makanan menggunakan tiga kategori: **sedikit, sedang, banyak**.
- Jika porsi tidak bisa diketahui secara wajar dari input, AI menanyakan ukuran porsi kepada pengguna sebelum menyelesaikan estimasi.
- Pengguna dapat memperbaiki makanan, porsi, dan nilai nutrisi.
- Pengguna dapat membuat **makanan kustom** bila item tidak ditemukan di sumber data. Makanan kustom dapat digunakan kembali pada pencatatan berikutnya; nutrisi yang tidak diketahui harus tetap ditandai tidak tersedia/estimasi, bukan diisi dengan angka pasti yang dikarang AI.
- Nilai makanan kustom harus mencatat basis satuan/porsi yang jelas (misalnya per 100 gram atau per serving) sehingga perhitungan porsi konsisten.
- Jika input mengandung makanan sekaligus harga/biaya yang jelas, AI dapat membuat catatan Finance dan Nutrition.

**Target dan pengingat nutrisi:**

- Dashboard menampilkan total harian dan progres setiap komponen dibandingkan target atau batasnya.
- Default pengingat adalah **5 jam sebelum pergantian hari** untuk komponen yang targetnya belum terpenuhi. Waktu pengingat dapat diubah pengguna.
- Pengingat mempertimbangkan zona waktu akun.
- Berikan peringatan jika komponen yang memiliki batas maksimum harian—misalnya gula atau natrium—melewati batasnya.
- Bedakan target yang ingin dicapai (misalnya protein atau air) dari batas maksimum yang sebaiknya tidak dilampaui (misalnya natrium atau gula jika pengguna mengaturnya sebagai limit).
- Satu catatan makan dapat berisi beberapa item makanan, masing-masing dengan porsi dan nilai nutrisi sendiri. Pengguna dapat menyimpan kombinasi item sebagai menu favorit untuk dipakai kembali pada pencatatan berikutnya.
- Satuan standar Nutrition adalah metrik: kg, cm, gram, mililiter, dan kcal. Data dari sumber yang menggunakan satuan lain harus dikonversi secara konsisten sebelum perhitungan atau penyimpanan yang relevan. Preferensi satuan imperial tidak termasuk cakupan yang ditetapkan saat ini.
- Ekspor data berdasarkan rentang tanggal ke **CSV** dan **JSON**.

**Sumber data dan perhitungan Nutrition:**

- Pada tahap SDD, pilih sumber data nutrisi yang dapat ditelusuri dan metode perhitungan target harian yang sesuai untuk estimasi umum. Hindari menampilkan angka seolah-olah presisi jika bahan atau porsinya belum diketahui.
- Gunakan satuan yang konsisten untuk jumlah makanan dan cairan (misalnya gram, mililiter, atau ukuran porsi) serta tampilkan asumsi yang berarti bagi hasil estimasi.
- Jika makanan tidak dikenali dengan cukup yakin, AI meminta nama/bahan/porsi atau menawarkan pencatatan manual, bukan membuat kandungan nutrisi yang seolah-olah pasti.
- Jika pengguna mengoreksi bahan, porsi, atau nilai nutrisi, perhitungan harian harus diperbarui dari catatan yang sudah dikoreksi.
- Rekomendasi target harian harus memperlihatkan bahwa angka tersebut merupakan perkiraan berbasis profil dan aktivitas pengguna. Target manual tetap dihormati, disertai peringatan jika terlihat ekstrem atau tidak masuk akal; sistem tidak boleh mendiagnosis atau menjanjikan hasil medis.

Estimasi nutrisi bukan diagnosis medis dan akurasinya dapat dipengaruhi foto, bahan, resep, serta ukuran porsi. UI harus menjelaskan bahwa hasil merupakan perkiraan.

### 6.5 AI Chat / Quick Input

AI Chat adalah ruang percakapan utama untuk mengirim:

- Teks.
- Foto/gambar, khususnya makanan dan struk.
- Pesan suara atau file audio yang dapat diproses menjadi teks.

AI Chat memungkinkan pengguna mencatat, mengelola catatan, bertanya tentang data, dan meminta ringkasan. Respons untuk input yang berhasil harus singkat dan jelas, misalnya “Noted — saved to Schedule” atau “Noted — nutrition estimate saved”. Jika perlu klarifikasi, AI bertanya dengan bahasa alami dan tidak membuat catatan final sebelum informasi yang dibutuhkan tersedia.

Notifikasi reminder juga dapat direpresentasikan sebagai pesan atau item notifikasi di aplikasi, tetapi **jangan mengandalkan chat yang sedang terbuka sebagai satu-satunya mekanisme pengiriman reminder**. Pengiriman di luar halaman dilakukan melalui backend scheduler dan PWA Web Push.

### 6.6 Settings

Halaman Settings mencakup:

- Mengubah nama pengguna/nama tampilan.
- Mengubah foto profil.
- Mengubah password untuk akun lokal email/password.
- Beralih antara Light Mode dan Dark Mode.
- Mengaktifkan/menonaktifkan izin/langganan push jika didukung.
- Mengatur preferensi reminder yang relevan.
- Sign out.


### 6.7 Aturan Umum Pengeditan, Penghapusan, dan Ekspor

**Pengeditan dan penghapusan** mengikuti aturan pada bagian AI Chat, baik perubahan dimulai melalui AI maupun UI manual. UI harus memperlihatkan record yang dipilih sebelum pengguna mengubah atau menghapusnya. Penghapusan permanen melalui UI juga memerlukan konfirmasi yang jelas. Jika suatu record memiliki lampiran, antarmuka menjelaskan bahwa lampiran terkait ikut dihapus.

**Aturan ekspor yang konsisten:**

- Pengguna memilih domain dan rentang tanggal yang ingin diekspor; tanggal awal dan akhir termasuk dalam rentang.
- Filter tanggal mengikuti tanggal peristiwa domain: tanggal/waktu agenda untuk Schedule, tanggal transaksi untuk Finance, dan waktu konsumsi untuk Nutrition.
- CSV dan JSON harus memakai nama field yang konsisten. Nilai uang diekspor sebagai angka tanpa simbol mata uang di dalam nilai numerik, dengan mata uang dinyatakan sebagai IDR; waktu memakai format tanggal/waktu ISO 8601 dengan zona waktu yang jelas.
- CSV harus mengutip/menangani delimiter, baris baru, dan tanda kutip secara benar. Ekspor hanya berisi data yang boleh diakses oleh akun yang meminta ekspor.
- Ekspor standar memuat record dan metadata yang relevan, bukan isi file lampiran. Lampiran tidak diikutkan ke CSV/JSON kecuali ada fitur ekspor lampiran terpisah yang dirancang kemudian.
- Jika rentang tidak memiliki data, sistem menghasilkan file valid yang menjelaskan tidak ada record (atau daftar kosong pada JSON) dan bukan file rusak.

---

## 7. UI/UX dan Navigasi

Seluruh label dan antarmuka utama menggunakan **bahasa Inggris**. Aplikasi harus responsif dan dirancang sesuai kebiasaan penggunaan desktop maupun mobile.

### Desktop/laptop

Urutan tata letak dari kiri ke kanan:

1. **Sidebar** — Dashboard, Schedule, Finance, Nutrition, Settings.
2. **Main content** — konten halaman aktif.
3. **AI Chat panel** — panel di sisi kanan yang mudah dibuka dan digunakan.

Panel AI bisa dilipat atau disembunyikan bila pengguna memerlukan ruang lebih luas untuk kalender, tabel transaksi, grafik, atau laporan.

### Mobile

- Jangan sekadar mengecilkan tata letak tiga kolom desktop.
- Gunakan konten satu kolom dan navigasi ringkas yang sesuai untuk layar kecil.
- AI Chat/Quick Input harus mudah dijangkau.
- Input foto dan rekaman suara harus nyaman digunakan di layar sentuh.
- Sediakan navigasi menuju Schedule, Finance, Nutrition, dan Dashboard.

### Jalur akses AI Chat di mobile

- Membuka aplikasi secara normal setelah login mengarah ke **Dashboard**.
- Sediakan **shortcut PWA/Home Screen khusus AI Chat** yang membuka AI Chat/Quick Input secara langsung tanpa harus melalui Dashboard.
- Jika sesi masih valid, shortcut langsung membuka chat. Jika sesi kedaluwarsa, tampilkan login lalu kembalikan pengguna ke AI Chat setelah login sukses.
- Shortcut tambahan seperti “Log Food” dapat dipertimbangkan jika didukung platform, tetapi shortcut AI Chat merupakan kebutuhan utama.

Tujuan desainnya adalah memudahkan pengguna mengambil foto makanan dan mengirimkannya dalam sesedikit mungkin langkah, tanpa mengorbankan struktur aplikasi utama.

---

## 8. PWA dan Push Notification

PELITA direncanakan sebagai **Progressive Web App (PWA)** agar dapat dipasang di Home Screen dan mendukung Web Push Notification.

- Backend scheduler harus berjalan persisten di server, bukan hanya menggunakan `setTimeout()` atau timer di halaman browser.
- Saat reminder jatuh tempo, backend mengirim Web Push melalui layanan push browser; service worker menangani notifikasi pada perangkat.
- Web Push memerlukan HTTPS, izin dan langganan pengguna, koneksi internet keluar dari server, serta browser/perangkat yang kompatibel.
- Pengiriman ditujukan mendekati waktu yang dijadwalkan (*near-real-time*), tetapi waktu kedatangan tidak dapat dijamin sampai detik yang persis sama.
- Pengguna tidak harus selalu mengaktifkan Tailscale di HP hanya untuk menerima Web Push yang sudah dikonfigurasi. Namun, Tailscale harus aktif ketika pengguna mengetuk notifikasi dan ingin membuka dashboard yang hanya tersedia di jaringan privat.
- Uji notifikasi pada perangkat sasaran. PWA Web Push di iOS/iPadOS memiliki persyaratan platform tersendiri.
- Pengingat yang telah dikirim harus ditandai agar tidak terjadi pengiriman ganda. Reminder harus diperbarui atau dibatalkan jika agenda berubah/dihapus.
- Fitur jam tenang (*quiet hours*) tidak termasuk cakupan saat ini. Notifikasi mengikuti pengaturan reminder tiap fitur, waktu agenda, zona waktu akun, serta izin dan dukungan platform.
- Setiap pengingat memiliki status operasional minimum, misalnya **pending, sent, failed, atau expired**. Status ini bukan riwayat percakapan dan tidak boleh menyimpan isi chat.
- Kegagalan sementara dapat dicoba ulang secara terbatas dengan jeda bertahap. Batas retry harus mencegah pengiriman berulang terus-menerus; gunakan identitas pengiriman agar retry tidak membuat notifikasi ganda.
- Jika push tidak diaktifkan, tidak didukung, atau pengirimannya gagal, reminder tetap dapat dilihat pada area notifikasi/in-app saat pengguna membuka aplikasi. Status push yang gagal tidak boleh dilaporkan sebagai notifikasi yang pasti sudah diterima.
- Jika reminder sudah kedaluwarsa karena agenda berlalu atau berubah, jangan mengirim notifikasi usang. Perubahan jadwal harus menyinkronkan pekerjaan scheduler dan status pengiriman terkait.

Telegram bukan interface utama dan tidak menjadi ketergantungan versi yang direncanakan. Fokus utama adalah AI Chat native dan PWA Web Push.

---

## 9. Konteks Home Server dan Akses

PELITA akan dijalankan pada home server di rumah orang tua. Pengguna akan mengakses aplikasi secara privat dari kampus melalui Tailscale VPN.

Spesifikasi server yang diketahui:

- Barebone: **ASRock DeskMini X600**.
- CPU: **AMD Ryzen 7 8700G**.
- RAM: **32 GB DDR5, single-channel**.
- SSD: **ADATA SX8200 Pro NVMe 512 GB**.
- OS: **Ubuntu Desktop 24.04**.
- Memori grafis terintegrasi yang dialokasikan: sekitar **4 GB VRAM**.
- Akses aplikasi direncanakan menggunakan jaringan privat Tailscale; tidak direncanakan membuka port masuk publik untuk akses normal.

Spesifikasi tersebut memadai untuk aplikasi web/PWA, database, scheduler, dan pemanggilan AI melalui API eksternal untuk penggunaan personal. Menjalankan model AI multimodal berukuran besar secara lokal bukan kebutuhan dasar agar aplikasi berjalan; kemampuan, kualitas, dan kecepatan model lokal harus diuji pada server nyata sebelum dijadikan jalur utama.

### Rekomendasi tech stack utama

**Keputusan rekomendasi:** gunakan **Next.js App Router + TypeScript sebagai aplikasi full-stack utama**, dengan PostgreSQL dan worker Node.js terpisah untuk pekerjaan terjadwal. Ini menggantikan rancangan awal React + Vite + FastAPI/Python sebagai baseline teknologi. React tetap digunakan sebagai library UI di dalam Next.js; Vite dan FastAPI tidak menjadi komponen inti pada baseline ini.

| Lapisan | Pilihan rekomendasi | Peran |
|---|---|---|
| Framework aplikasi | **Next.js (App Router) + React + TypeScript** | UI desktop/mobile, rendering, server-side logic, Route Handlers untuk API, dan Server Actions jika sesuai. |
| UI dan styling | **Tailwind CSS + shadcn/ui** | Membuat dashboard, form, dialog konfirmasi, panel chat, dan UI responsif secara konsisten. |
| Validasi data | **Zod** | Validasi skema input di server dan berbagi tipe/aturan validasi yang sesuai antara UI dan backend. Validasi browser tidak menggantikan validasi server. |
| Database | **PostgreSQL** | Penyimpanan akun, Schedule, Finance, Nutrition, pengaturan, lampiran metadata, status notifikasi, dan antrean pekerjaan. |
| ORM dan migrasi | **Prisma ORM** | Query database bertipe, relasi, transaksi, dan migrasi skema. Gunakan rilis stabil yang kompatibel pada saat implementasi, bukan release candidate untuk sistem utama. |
| Autentikasi | **Better Auth** sebagai kandidat utama | Mengintegrasikan akun email/password, Google Sign-In, sesi, serta alur reset password. Penghapusan akun, isolasi data, pencegahan account linking otomatis, dan aturan PELITA tetap harus dirancang serta diuji secara eksplisit. |
| Background jobs | **Worker Node.js/TypeScript terpisah + pg-boss** | Menjalankan reminder, pengiriman Web Push/email, retry terbatas, dan pekerjaan terjadwal meskipun halaman atau proses request Next.js tidak sedang aktif. pg-boss menggunakan PostgreSQL sehingga baseline tidak perlu menambahkan Redis. |
| PWA dan push | **Web App Manifest, service worker, Web Push API, `web-push`** | Instalasi Home Screen dan notifikasi perangkat sesuai dukungan browser/platform. |
| AI hybrid | **Lapisan adapter/provider di server; API lokal seperti Ollama dievaluasi; API eksternal dipakai selektif** | Merutekan tugas sesuai biaya, privasi, mutu, serta waktu respons. Jangan menganggap model lokal pasti mampu menangani semua gambar/audio dengan baik sebelum benchmark. |
| File | **Folder/volume server khusus** | Menyimpan lampiran domain yang dipertahankan; database hanya menyimpan metadata dan referensinya. File sementara dibersihkan sesuai kebijakan. |
| Testing | **Vitest + Playwright**, ditambah pengujian manual | Vitest untuk fungsi/aturan bisnis yang dapat diuji tanpa browser; Playwright untuk alur end-to-end; tes manual untuk AI dan push pada perangkat nyata. |
| Deployment | **Docker Compose pada Ubuntu + akses privat melalui Tailscale Serve atau konfigurasi HTTPS yang sesuai** | Menjalankan web app, worker, PostgreSQL, dan layanan opsional secara konsisten tanpa membuka database ke internet publik. |

**Mengapa pilihan ini paling sesuai:** sebagian besar fungsi PELITA merupakan aplikasi web, pengelolaan data, autentikasi, laporan, serta pengiriman request AI. Next.js dapat melayani UI dan kebutuhan API umum dalam satu codebase TypeScript, sehingga lebih sedikit bahasa dan integrasi yang perlu dipelajari dibanding frontend terpisah dengan backend FastAPI. AI eksternal dan model lokal yang menyediakan API HTTP tidak mengharuskan backend inti ditulis dalam Python.

**Batas arsitektur yang penting:** Next.js tidak boleh dijadikan satu-satunya proses untuk pekerjaan yang harus terus berjalan. Worker persisten dijalankan sebagai proses/container terpisah, walaupun tetap berada dalam repository TypeScript yang sama. Operasi berat atau lama tidak boleh mengandalkan timer browser atau request UI yang dibiarkan menggantung. Semua tindakan AI tetap melewati service layer backend, validasi, otorisasi per pengguna, transaksi database, dan pencegahan duplikasi.

Python **tidak menjadi backend inti pada baseline**. Service Python terpisah baru ditambahkan jika evaluasi SDD membuktikan library atau runtime Python tertentu memberikan keuntungan nyata untuk OCR, speech-to-text, atau pemrosesan AI lokal. Ini menghindari kompleksitas dua backend sebelum benar-benar diperlukan.

Rujukan awal untuk desain teknis: [Next.js Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend), [Next.js Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting), [Next.js PWA](https://nextjs.org/docs/app/guides/progressive-web-apps), [Prisma ORM](https://www.prisma.io/docs/orm), [Better Auth + Prisma](https://better-auth.com/docs/adapters/prisma), dan [pg-boss](https://github.com/timgit/pg-boss). Kesesuaian versi stabil, dukungan platform, serta cara integrasi semua paket harus diverifikasi lagi saat implementasi.

### Strategi AI: Hybrid

Keputusan produk adalah menggunakan pendekatan **hybrid**, menggabungkan model/layanan lokal dengan API eksternal. Rancangan teknis akan menentukan penempatan tugas berdasarkan kemampuan, privasi, biaya, kecepatan, dan ketersediaan perangkat. Sebagai arah awal, model lokal dapat dipertimbangkan untuk tugas ringan atau pemrosesan awal bila kualitasnya memadai, sedangkan API eksternal dapat dipakai untuk tugas multimodal atau penalaran yang memerlukan kemampuan lebih tinggi. Provider, model, fallback, dan batas biaya belum diputuskan. Jangan mengirim data pribadi lebih banyak dari yang diperlukan ke layanan eksternal; pemrosesan lokal versus eksternal harus dijelaskan pada desain teknis dan diuji.

### Tidak ada fitur backup di aplikasi

PELITA **tidak menyediakan sistem backup atau restore sebagai fitur aplikasi**. Tidak ada backup otomatis, jadwal backup, tombol ekspor backup database penuh, ataupun antarmuka restore di PELITA. Jika pemilik server ingin membuat salinan cadangan, ia melakukannya sendiri di luar aplikasi dengan mengakses database/server, lalu mengunduh atau menyalin file yang diperlukan. Cara teknis yang aman bergantung pada jenis database dan lokasi penyimpanan lampiran yang dipilih pada tahap SDD; penyalinan harus menjaga konsistensi data dan, bila diperlukan, mencakup file lampiran juga. Ini merupakan prosedur administrasi server oleh pemilik, bukan fitur pengguna PELITA. Kehilangan data tetap mungkin terjadi jika pemilik server tidak membuat salinan manualnya sendiri.

Implementasi PWA dan Web Push memerlukan HTTPS yang sesuai. Server tetap memerlukan koneksi internet keluar untuk API eksternal dan layanan push. **Baseline tech stack yang dipilih adalah Next.js + TypeScript, PostgreSQL, Prisma ORM, Better Auth, worker Node.js/TypeScript dengan pg-boss, dan Docker Compose.** Provider/model AI spesifik, runtime model lokal, speech-to-text, teknologi OCR, penyedia email, serta konfigurasi deployment rinci dan sumber data nutrisi masih harus dievaluasi pada tahap SDD.

---

## 10. Ketentuan Guidebook IMPAL

PELITA merupakan rencana project **Tubes IMPAL (Implementation and Testing Project)**.

Ketentuan penting dari guidebook IMPAL:

- Project menggunakan Scrum dan dipresentasikan melalui **3 Sprint**.
- Kelompok IMPAL melanjutkan kelompok APPL; **SRS dan SDD dari APPL menjadi dasar implementasi dan testing**.
- Topik boleh diubah, tetapi SRS/SDD harus disesuaikan dengan topik baru.
- Kompleksitas minimal harus setara aplikasi POS yang memiliki proses seperti memasukkan kode barang dan harga, memasukkan jumlah dan menghitung total, memasukkan pembayaran dan menghitung kembalian, serta membuat/mencetak struk.
- **Sprint 0:** review spesifikasi minimum SRS, desain database, modul program, dan prototype UI.
- **Sprint 1:** review implementasi UI, database, dan code untuk **Login Use Case**.
- **Sprint 2:** review implementasi UI, database, dan code untuk **Order & Payment Use Case**.
- **Sprint 3:** review use case lain, **User Manual**, dan **Software Test Document**.

PELITA harus memiliki alur transaksi Finance yang jelas dan business logic yang memadai. Walaupun transaksi keuangan pribadi merupakan bagian alami dari Finance, guidebook tidak otomatis memastikan bahwa alur ini diterima sebagai pengganti Order & Payment bergaya POS. SRS/SDD harus mendeskripsikan alur, validasi, perhitungan, perubahan saldo/anggaran, bukti transaksi, koreksi, dan pelaporan secara jelas. Jika interpretasi terhadap persyaratan Sprint 2 meragukan, konfirmasikan kepada dosen/asisten.

Guidebook tidak memberikan rubrik angka terperinci untuk setiap fitur. Karena itu, fokuskan mutu pada kebutuhan yang jelas, alur yang berfungsi, desain database dan arsitektur yang konsisten, UI/UX yang baik, validasi, testing, dokumentasi, dan bukti penerapan Scrum.

**Catatan cakupan:** fitur-fitur yang dijelaskan di dokumen ini merupakan cakupan produk yang direncanakan. Jangan menghapus atau otomatis memindahkan fitur ke kategori “future” hanya untuk membuat ringkasan. Implementasi dan pembagian kerja tetap perlu direncanakan sesuai Sprint, tetapi semua kebutuhan produk perlu dipertimbangkan dalam rancangan keseluruhan.

---

## 11. Dokumen Lanjutan yang Akan Disusun

Dokumen Markdown ini adalah konteks utama dan sumber keputusan PELITA. **PRD terpisah tidak akan disusun** karena tujuan produk, ruang lingkup, perilaku, konteks pengguna, dan keputusan yang telah ditetapkan sudah dicatat di sini.

Dokumen lanjutan yang direncanakan:

### 11.1 SRS — Software Requirements Specification

Menjabarkan kebutuhan perangkat lunak secara jelas dan dapat diuji, termasuk:

- Aktor dan jenis akun.
- Functional requirements untuk autentikasi dan penghapusan akun, Dashboard, Schedule, Finance, Nutrition, AI Chat, ekspor, Settings, dan reminder. Backup/restore database penuh bukan fitur aplikasi PELITA.
- Non-functional requirements seperti keamanan, privasi, responsivitas, reliabilitas, performa, dan kompatibilitas.
- Use Case, aturan bisnis, kondisi awal/akhir, alur utama dan alternatif, validasi, kondisi gagal, serta acceptance criteria.
- Requirement ID untuk memastikan setiap kebutuhan dapat ditelusuri ke desain dan pengujian.

SRS APPL yang sudah ada perlu diperiksa dan disesuaikan untuk PELITA sesuai ketentuan IMPAL; dokumen lama tidak boleh dianggap sudah sesuai tanpa ditinjau.

### 11.2 SDD — Software Design Description

Menjelaskan bagaimana kebutuhan di SRS dirancang dan diimplementasikan, termasuk arsitektur, modul, database/ERD, isolasi data per akun, UI/UX, backend/API, autentikasi, validasi tindakan AI, integrasi hybrid AI, penanganan file, scheduler, Web Push, ekspor, dan alur kegagalan. Backup/restore penuh bukan fitur PELITA; cara pemilik server menyalin file di luar aplikasi tidak perlu menjadi modul produk. SDD tidak boleh memperkenalkan perilaku yang bertentangan dengan dokumen konteks atau SRS tanpa keputusan perubahan yang disengaja.

Baseline tech stack untuk SDD adalah **Next.js App Router + TypeScript** untuk aplikasi full-stack/PWA, **Tailwind CSS + shadcn/ui** untuk UI, **Zod** untuk validasi, **PostgreSQL + Prisma ORM** untuk data dan migrasi, **Better Auth** sebagai pilihan utama autentikasi, serta **worker Node.js/TypeScript persisten dengan pg-boss** untuk reminder dan background jobs. Gunakan `web-push` untuk Web Push; file domain disimpan pada folder/volume server terpisah dengan metadata di PostgreSQL. Docker Compose menjadi pilihan deployment utama pada Ubuntu, dengan akses privat HTTPS melalui Tailscale Serve atau konfigurasi reverse proxy yang sesuai. Versi paket yang stabil, model AI/provider, konfigurasi autentikasi Google, layanan email, pengaturan volume, secrets, serta deployment final dikunci di SDD dan diuji sebelum digunakan.

### 11.3 STD / DUPL — Software Test Document / Dokumen Uji Perangkat Lunak

Mendefinisikan strategi pengujian, test case, prasyarat, data uji, langkah, expected result, actual result, status, bukti, bug, dan regression test. Cakupan penting termasuk pendaftaran melalui akses privat, verifikasi email akun lokal, autentikasi tiap metode login, reset password email, perubahan password akun lokal, konfirmasi penghapusan akun dan data permanen, otorisasi serta isolasi data, operasi AI (create/update/delete/query), konfirmasi penghapusan record, deteksi duplikasi, pengulangan Schedule (harian/mingguan/bulanan dan cakupan perubahan satu kejadian versus seluruh rangkaian), perhitungan Finance, tidak adanya pembuatan transaksi otomatis berulang, kategori kustom, pengarsipan wallet, catatan makan multi-item dan menu favorit, konversi satuan metrik, pengaturan pemrosesan AI eksternal, target Nutrition, laporan per domain, ekspor, reminder tanpa quiet hours, status kegagalan layanan, dan push. Backup/restore database penuh tidak diuji sebagai fitur aplikasi karena tidak disediakan. Hasil aktual hanya diisi setelah tes benar-benar dijalankan.

Target lingkungan pengujian awal adalah **Windows 11 dengan Chrome/Edge** dan **Android dengan Chrome**. Pengujian menggabungkan tes otomatis untuk logika inti dan integrasi (misalnya validasi/backend, saldo/anggaran, otorisasi, serta aturan data) dengan pengujian manual untuk UI responsif, perilaku AI, dan notifikasi nyata di perangkat.

Tools yang direkomendasikan untuk diuji pada tahap SDD adalah Vitest untuk unit test/fungsi layanan TypeScript dan Playwright untuk alur UI/end-to-end yang dapat diotomatisasi. STD/DUPL harus berisi screenshot untuk alur UI penting; tes API/backend dapat memakai output pengujian atau log yang sudah disamarkan dari informasi sensitif. Nilai actual result/status tidak boleh diisi seolah-olah pengujian telah berhasil sebelum tes benar-benar dijalankan.

Target performa awal bersifat realistis: halaman dan operasi database biasa harus terasa responsif, sedangkan proses AI boleh lebih lama dengan indikator progres dan status yang jelas. Batas angka tidak ditentukan secara arbitrer; lakukan baseline pada home server dan koneksi sasaran terlebih dahulu, lalu tetapkan ambang penerimaan yang terukur **sebelum** menjalankan pengujian penerimaan.

### 11.4 User Manual

Menjelaskan registrasi/login, Quick Input, mengelola Schedule, Finance dan Nutrition, meninjau estimasi AI, mengonfirmasi penghapusan, mengatur reminder, mengekspor data, pengaturan profil, memasang PWA, mengaktifkan notifikasi, dan prosedur relevan bagi pengguna.

### 11.5 Hubungan antar-dokumen

Urutan kerja yang disarankan:

`Konteks PELITA (dokumen ini) → SRS → SDD → Implementasi → STD/DUPL + User Manual`

Requirement ID pada SRS ditelusuri ke rancangan SDD dan test case. Jika kebutuhan atau keputusan berubah, perbarui dokumen konteks ini terlebih dahulu, kemudian sinkronkan SRS, SDD, test case, dan User Manual. Dokumen turunan tidak boleh menjadi sumber keputusan yang bertentangan dengan dokumen ini.

### 11.6 Keputusan SRS yang sudah ditetapkan

- **Aktor:** pengguna biasa saja. Tidak ada role administrator atau dashboard admin di aplikasi; administrasi host/server dilakukan di luar PELITA.
- **Pemulihan password lokal:** menggunakan tautan email sekali pakai dengan masa berlaku terbatas. Fitur ini bergantung pada konfigurasi layanan email. Jika layanan belum tersedia/gagal, UI harus menyatakan kegagalan dengan jelas dan tidak mengaku telah mengirim email.
- **Schedule:** satu model agenda dengan tipe `Task`, `Event`, dan `Deadline`, menggunakan field umum dan aturan status sesuai tipe.
- **Kategori Finance:** kategori bawaan ditambah kategori buatan pengguna; pengguna dapat mengubah dan mengarsipkan kategori. Kategori yang sudah digunakan tidak boleh menghilangkan informasi histori transaksi.
- **Wallet:** wallet yang tidak lagi digunakan diarsipkan agar histori tetap tersimpan dan wallet tidak digunakan untuk transaksi baru secara tidak sengaja.
- **Makanan:** pengguna bisa menyimpan item makanan kustom untuk digunakan kembali dengan basis porsi/satuan yang jelas.
- **Refund:** dicatat pada periode tanggal refund; refund tertaut mengurangi pengeluaran bersih pada periode refund, tanpa menulis ulang transaksi pembelian asal.
- **Sumber data Nutrition:** rekomendasi awal adalah memprioritaskan sumber resmi Indonesia untuk komoditas yang tercakup, menggunakan sumber internasional yang dapat ditelusuri sebagai pelengkap, dan menyediakan makanan kustom untuk menu lokal/olahan yang tidak cocok. Estimasi AI hanya digunakan sebagai perkiraan yang dapat dikoreksi. Ketersediaan data, lisensi/syarat penggunaan, serta cara integrasi diverifikasi saat SDD.

### 11.7 Keputusan SDD yang sudah ditetapkan dan rekomendasi awal

- **Database:** PostgreSQL. Data terstruktur disimpan di database; lampiran berada pada storage/folder server terpisah dan direferensikan oleh metadata yang tervalidasi di database.
- **Stack utama yang dipilih:** Next.js App Router + TypeScript, Tailwind CSS + shadcn/ui, Zod, PostgreSQL, Prisma ORM, Better Auth, worker Node.js/TypeScript dengan pg-boss, `web-push`, serta Docker Compose. Tailscale Serve atau reverse proxy HTTPS yang sesuai digunakan untuk akses privat. Python tidak menjadi bagian backend inti; service Python hanya ditambahkan jika evaluasi AI/OCR/speech-to-text membuktikan kebutuhannya.
- **AI hybrid hemat biaya:** prioritaskan model lokal untuk tugas yang mampu ditangani dengan mutu memadai; gunakan API eksternal secara selektif untuk tugas yang memerlukan kemampuan lebih tinggi atau multimodal. Ukur mutu, waktu, dan penggunaan biaya; provider, model, fallback, dan batas biaya numerik belum final.
- **Pemrosesan eksternal:** diizinkan dengan minimisasi data, pengungkapan yang jelas kepada pengguna, serta evaluasi kebijakan retensi/pelatihan dari provider. API key hanya tersedia di backend. Pilihan ini tidak menetapkan persetujuan per permintaan sebagai kewajiban, tetapi privasi dan penggunaan data eksternal harus dijelaskan secara transparan.
- **Penyimpanan lampiran:** file sementara OCR/transkripsi/analisis dibersihkan setelah selesai atau sesudah retry tak lagi diperlukan; lampiran permanen hanya disimpan jika terkait dengan record domain dan ikut dihapus ketika tidak lagi direferensikan.
- **Reset password/email:** arsitektur mendukung penyedia SMTP/API yang dikonfigurasi melalui environment/server secret. Nama provider, kredensial, biaya, dan pengujian deliverability diverifikasi saat SDD. Jika belum dikonfigurasi, fitur reset email tidak boleh melaporkan keberhasilan palsu.
- **Penyalinan data manual:** tidak ada backup/restore dalam aplikasi. Untuk PostgreSQL, prosedur administrasi manual sebaiknya menggunakan dump konsisten (misalnya `pg_dump`) dan menyalin folder lampiran terkait; menyalin direktori data database yang sedang berjalan secara mentah tidak boleh dianggap sebagai salinan yang konsisten tanpa prosedur snapshot/stop yang benar.
- **Sumber nutrisi yang direkomendasikan untuk dievaluasi:** prioritaskan [Tabel Komposisi Pangan Segar Indonesia dari Badan Pangan Nasional](https://badanpangan.go.id/tabel-komposisi-pangan-segar-indonesia) untuk komoditas lokal yang memang tercakup; gunakan [USDA FoodData Central](https://fdc.nal.usda.gov/) / [API Guide](https://fdc.nal.usda.gov/api-guide/) sebagai sumber pelengkap bila perlu cakupan bahan yang lebih luas. Data Bapanas yang tersedia mencakup komoditas pangan segar, sehingga tidak boleh diasumsikan mencakup seluruh makanan matang/campuran. USDA FoodData Central menyediakan API pencarian/detail makanan dan memerlukan API key jika diintegrasikan melalui API. Sebelum memilih integrasi final, verifikasi kelengkapan hidangan Indonesia, field nutrisi, syarat penggunaan, kebutuhan API key, biaya/limit jika relevan, dan opsi cache lokal. Untuk hidangan olahan yang tidak cocok, gunakan makanan kustom dan/atau estimasi AI berlabel perkiraan, bukan membuat kepastian palsu.

### 11.8 Keputusan STD/DUPL yang sudah ditetapkan

- **Perangkat/browser utama:** Windows 11 dengan Chrome dan Edge; Android dengan Chrome.
- **Metode:** gabungan test otomatis dan manual. Tes otomatis memprioritaskan aturan bisnis, validasi, akses per akun, saldo/anggaran, dan integrasi backend; tes manual memeriksa UI responsif, alur AI, dan notifikasi aktual.
- **Tools rekomendasi:** Vitest untuk unit test/fungsi layanan TypeScript; Playwright untuk UI/end-to-end. Tes manual tetap diperlukan untuk AI dan push pada perangkat nyata. Jika service Python terpisah kelak dibuat, pytest dapat digunakan untuk service itu.
- **Bukti:** screenshot pada alur UI yang relevan. Tes API/backend dapat menggunakan output test/log yang tidak membocorkan rahasia atau data pribadi.
- **Performa:** tentukan target angka berdasarkan baseline pengukuran pada server dan jaringan sasaran; angka target harus ditetapkan sebelum tes penerimaan. Halaman/operasi database biasa diharapkan responsif, sedangkan pemrosesan AI memakai indikator progres/status.
- **Kejujuran hasil:** STD/DUPL boleh memuat template test case sejak awal, tetapi expected result, actual result, status, defect dan bukti eksekusi harus dibedakan. Jangan mengisi status Pass atau hasil aktual fiktif.


### 11.9 Keputusan tambahan untuk SRS/UX yang sudah ditetapkan

- **Pendaftaran mandiri:** pendaftaran akun dapat dilakukan oleh pengguna yang dapat mengakses PELITA melalui jaringan privat Tailscale; tidak diperlukan kode undangan dan tidak ada dashboard administrator. Akses jaringan privat tetap bukan pengganti autentikasi dan otorisasi server.
- **Verifikasi email lokal:** wajib sebelum akun lokal dapat digunakan secara penuh. Jika layanan email tidak tersedia/gagal, aplikasi harus menjelaskan kegagalan secara jujur; implementasi tidak boleh mengklaim email terkirim atau akun terverifikasi.
- **Schedule berulang:** mendukung pola standar harian, mingguan dengan pilihan hari, dan bulanan, dengan akhir berdasarkan tanggal atau jumlah kejadian. Perubahan/penghapusan satu kejadian dan seluruh rangkaian harus dibedakan secara eksplisit.
- **Finance berulang:** pembuatan transaksi otomatis berulang tidak termasuk cakupan saat ini. Transaksi rutin dicatat secara manual melalui UI atau AI.
- **Nutrition multi-item:** satu catatan makan dapat berisi beberapa makanan dengan porsi masing-masing. Pengguna dapat menyimpan kombinasi sebagai menu favorit untuk penggunaan ulang.
- **Satuan Nutrition:** sistem metrik menjadi standar (kg, cm, gram, mililiter, kcal). Konversi dari satuan sumber harus konsisten; pengaturan satuan imperial tidak termasuk cakupan yang dipilih saat ini.
- **Pemrosesan AI eksternal:** pengguna diberi penjelasan sebelum pemrosesan eksternal pertama kali dan dapat menonaktifkan pemrosesan eksternal melalui pengaturan. Jika nonaktif, tidak ada data yang boleh dikirim ke provider eksternal; gunakan model lokal bila memadai, atau jelaskan keterbatasan bila tidak. Status default pengaturan pada akun baru masih perlu diputuskan sebelum implementasi.
- **Quiet hours:** fitur jam tenang tidak termasuk cakupan. Reminder mengikuti pengaturan fitur, waktu agenda, zona waktu akun, dan dukungan/izin platform.
- **Dashboard dan laporan:** Dashboard berfokus pada ringkasan lintas tiga domain. Setiap halaman domain menyediakan filter periode, grafik yang relevan, dan ekspor CSV/JSON. Analisis lintas-domain tingkat lanjut tidak termasuk kebutuhan yang ditetapkan saat ini.

---

## 12. Keputusan yang Sudah Ditetapkan

- [x] Nama: **PELITA — Personal Life Assistant**.
- [x] Tagline: **“Plan your time. Control your money. Understand your health.”**
- [x] Aplikasi berbasis web, responsif, dengan UI berbahasa Inggris.
- [x] Tiga domain utama: Schedule, Finance, dan Nutrition Tracking.
- [x] AI Chat/Quick Input native menerima teks, gambar, dan pesan suara.
- [x] AI dapat mencatat, mengelola catatan, menjawab pertanyaan data, dan membuat ringkasan terkait ketiga domain.
- [x] Pesan di luar konteks dijawab dengan pengalihan singkat dan tidak disimpan.
- [x] AI mengikuti bahasa pengguna saat membalas, termasuk bahasa Indonesia informal.
- [x] Input yang jelas dapat disimpan otomatis; AI mengklarifikasi input ambigu dan meminta konfirmasi untuk hasil gambar yang kurang meyakinkan.
- [x] Pengguna dapat memperbaiki catatan; sebelum menghapus AI wajib menampilkan detail record dan meminta konfirmasi eksplisit. Setelah dikonfirmasi, penghapusan bersifat permanen.
- [x] PELITA mendukung beberapa akun dengan pemisahan data yang ditegakkan di backend untuk record, file, ekspor, dan konteks AI.
- [x] Tidak ada role administrator di aplikasi; hanya akun pengguna. Administrasi server dilakukan di luar PELITA.
- [x] Akun lokal dapat mengubah username/password, meminta reset password melalui tautan email, serta menghapus akun PELITA; reset email bergantung pada layanan email yang dikonfigurasi. Akun Google dapat mengubah username dan menghapus akun PELITA, tetapi password Google dikelola di Google.
- [x] Menghapus akun PELITA menghapus data PELITA milik akun itu secara permanen dan tidak menghapus akun Google pengguna.
- [x] Tidak ada penggabungan akun otomatis berdasarkan email; pengaitan akun tidak termasuk cakupan saat ini.
- [x] Pendaftaran mandiri tersedia bagi pengguna yang bisa mengakses PELITA melalui jaringan privat Tailscale; tidak ada kode undangan atau dashboard admin.
- [x] Verifikasi email wajib untuk akun lokal sebelum akun dapat digunakan secara penuh; alur gagal harus menyatakan status secara jujur.
- [x] Schedule memakai satu model agenda terpadu dengan tipe Task, Event, dan Deadline.
- [x] Schedule berulang mendukung pola standar harian, mingguan dengan pilihan hari, dan bulanan; pengulangan berakhir pada tanggal atau jumlah kejadian.
- [x] Finance tidak membuat transaksi otomatis berulang; pencatatan transaksi rutin dilakukan sebagai transaksi biasa.
- [x] Finance menggunakan IDR, saldo awal per wallet, tidak memiliki fitur transfer antar-wallet pada cakupan sekarang, dan periode minggu Senin–Minggu.
- [x] Kategori Finance bawaan dapat dilengkapi kategori kustom pengguna; kategori yang dipakai histori diarsipkan, bukan dihapus secara merusak.
- [x] Wallet yang tidak digunakan diarsipkan sehingga histori transaksi tetap tersedia dan wallet tidak dipakai untuk transaksi baru secara tidak sengaja.
- [x] Pengguna dapat membuat makanan kustom yang dapat digunakan kembali, dengan satuan/porsi dan sumber/ketidakpastian nutrisi yang jelas.
- [x] Satu catatan makan Nutrition dapat memiliki beberapa item dengan porsi masing-masing; kombinasi dapat disimpan sebagai menu favorit.
- [x] Nutrition menggunakan satuan metrik (kg, cm, gram, ml, kcal); pengaturan satuan imperial tidak termasuk cakupan yang dipilih.
- [x] Contoh batas Finance: Rp50.000/hari dan Rp350.000/minggu; dapat disesuaikan pengguna.
- [x] Target nutrisi dihitung otomatis sebagai rekomendasi, tetapi dapat diedit manual; target tidak wajar memicu pemberitahuan, bukan penolakan otomatis.
- [x] Estimasi porsi makanan menggunakan kategori sedikit, sedang, dan banyak; jika tidak diketahui, AI bertanya.
- [x] Reminder Schedule default 1 jam sebelum agenda.
- [x] Reminder nutrisi default 5 jam sebelum pergantian hari untuk target yang belum terpenuhi.
- [x] Dashboard normal setelah login; shortcut PWA/Home Screen di mobile membuka AI Chat langsung.
- [x] Tata letak desktop: sidebar → main content → AI Chat panel.
- [x] PWA Web Push dan backend scheduler digunakan untuk pengingat di luar halaman browser jika platform mendukung.
- [x] Hosting direncanakan pada home server Ubuntu 24.04 melalui akses privat Tailscale.
- [x] Pendekatan AI adalah hybrid yang memprioritaskan biaya rendah: model lokal digunakan jika kualitas memadai, API eksternal dipakai selektif; nama model/provider dan batas biaya numerik diverifikasi di SDD.
- [x] Pemrosesan eksternal boleh digunakan dengan minimisasi data dan pemberitahuan privasi yang transparan; secrets hanya berada di backend.
- [x] Pengguna diberi penjelasan sebelum pemrosesan AI eksternal pertama kali dan dapat menonaktifkan pemrosesan eksternal; default aktif/nonaktif pada akun baru masih harus ditetapkan sebelum implementasi.
- [x] Stack utama yang dipilih: Next.js App Router + TypeScript, Tailwind CSS + shadcn/ui, Zod, PostgreSQL + Prisma ORM, Better Auth, worker persisten Node.js/TypeScript + pg-boss, `web-push`, dan Docker Compose; versi paket dan konfigurasi deployment diverifikasi di SDD.
- [x] Target tes utama: Windows 11 Chrome/Edge dan Android Chrome; metode gabungan otomatis/manual, bukti screenshot untuk UI, serta target performa numerik ditetapkan setelah baseline sebelum acceptance test.
- [x] Riwayat chat tidak disimpan permanen; hanya data domain dan metadata operasional minimum yang diperlukan.
- [x] PELITA tidak memiliki fitur backup/restore. Pemilik server boleh menyalin database dan file terkait secara manual di luar aplikasi; cara teknisnya bergantung pada pilihan database/storage saat SDD.
- [x] Penghapusan record permanen setelah konfirmasi eksplisit; tidak ada soft-delete/pemulihan di aplikasi.
- [x] Zona waktu default Asia/Jakarta; operasi AI tervalidasi backend, mencegah duplikasi, dan memberi status kegagalan secara jujur.
- [x] Notifikasi memiliki status pengiriman, retry terbatas, pencegahan duplikasi, dan fallback in-app bila memungkinkan.
- [x] Ekspor CSV/JSON menggunakan rentang tanggal yang inklusif, definisi waktu per domain, format yang konsisten, dan hanya data milik akun aktif.
- [x] Fitur quiet hours tidak disediakan; notifikasi mengikuti pengaturan reminder, waktu agenda, zona waktu, serta dukungan/izin platform.
- [x] Dashboard menampilkan ringkasan utama; tiap domain menyediakan filter periode, grafik yang relevan, dan ekspor CSV/JSON. Analisis lintas-domain tingkat lanjut tidak termasuk cakupan yang ditetapkan.
- [x] Seluruh fitur dalam deskripsi merupakan cakupan produk yang direncanakan; tidak ada pengelompokan wajib menjadi MVP versus fitur masa depan.
- [x] Dokumen konteks Markdown ini merupakan acuan keputusan utama; tidak dibuat PRD terpisah. Dokumen lanjutan: SRS, SDD, STD/DUPL, dan User Manual.

---

## 13. Hal Teknis yang Masih Harus Diverifikasi

Keputusan produk dan preferensi desain sudah ditetapkan pada bagian sebelumnya. Daftar di bawah ini adalah rincian teknis yang masih perlu dipilih atau dibuktikan melalui evaluasi; ini bukan alasan untuk mengubah keputusan yang telah dicatat tanpa pembahasan.

- **Stack dan deployment:** baseline sudah ditetapkan sebagai Next.js App Router + TypeScript, Tailwind CSS + shadcn/ui, Zod, PostgreSQL + Prisma ORM, Better Auth, worker Node.js/TypeScript + pg-boss, `web-push`, dan Docker Compose. Verifikasi kompatibilitas versi stabil, alur migrasi, struktur modul, lifecycle worker, logging, secrets, HTTPS/reverse proxy, serta konfigurasi Tailscale Serve.
- **Database/storage:** desain ERD, batas transaksi, indeks, migrasi, kebijakan penyimpanan lampiran, dan prosedur penyalinan database/lampiran secara manual yang konsisten.
- **Google Sign-In dan sesi:** detail implementasi OAuth, pengelolaan sesi/token, autentikasi ulang sebelum penghapusan akun, rate limit, proteksi CSRF bila relevan, dan strategi keamanan browser.
- **Pendaftaran/email verification:** detail layar pendaftaran privat, perilaku akun sebelum verifikasi, kedaluwarsa/penggunaan token verifikasi, rate limit pengiriman email, dan perilaku saat SMTP/API email belum dikonfigurasi. Keputusan bahwa verifikasi email lokal wajib sudah final.
- **Pemrosesan eksternal AI:** desain UI penjelasan pertama kali, penyimpanan preferensi aktif/nonaktif per akun, serta nilai default pengaturan untuk akun baru masih perlu diputuskan sebelum implementasi. Keputusan bahwa pengguna dapat menonaktifkan pemrosesan eksternal sudah final.
- **Schedule berulang dan menu Nutrition:** skema penyimpanan recurrence, cara menangani pengecualian kejadian/seri, dan skema item-menu favorit perlu dirancang serta diuji; pola standar yang didukung sudah ditetapkan.
- **Reset password/email:** provider SMTP/API, URL reset yang dapat dijangkau pengguna di jaringan yang sesuai, masa berlaku token, pencegahan enumeration, konfigurasi secret, dan uji pengiriman email. Fitur reset melalui email tidak dapat dianggap operasional sampai layanan terkonfigurasi.
- **AI hybrid hemat biaya:** model lokal yang cocok, kemungkinan memakai layanan lokal seperti Ollama sebagai kandidat, API eksternal yang dievaluasi, routing tugas, fallback, batas biaya/pemakaian, rate limit, dan mekanisme agar retry tidak menggandakan tindakan. Performa model lokal harus diuji langsung pada server yang tersedia.
- **Speech-to-text dan OCR:** pilih teknologi dan provider berdasarkan akurasi bahasa Indonesia, kebutuhan file, biaya, privasi, dan pengalaman pengguna.
- **Sumber data dan kalkulasi Nutrition:** verifikasi sumber nutrisi kandidat Indonesia/internasional, lisensi/syarat penggunaan, cakupan hidangan lokal, dan unit nutrisi. Tetapkan formula estimasi target harian yang transparan serta metode estimasi makanan campuran.
- **Testing/performa:** susun test data, skenario regresi, serta baseline performa pada server dan jaringan target. Ambang angka harus ditetapkan sebelum pengujian penerimaan, bukan disesuaikan sesudah melihat hasil.
- **Desain UI, diagram arsitektur, sequence diagram AI, skema database, kontrak API, serta backlog dan pembagian pekerjaan per Sprint.**
- **Kesesuaian IMPAL:** konfirmasikan kepada dosen/asisten apakah alur transaksi Finance PELITA memenuhi persyaratan Order & Payment Use Case untuk Sprint 2.


---

## 14. Ringkasan Inti untuk AI

**PELITA adalah aplikasi web/PWA responsif berbahasa Inggris untuk Schedule, Finance, dan Nutrition Tracking. AI Chat/Quick Input menerima teks, gambar, dan suara untuk menghasilkan tindakan terstruktur yang divalidasi backend, mencatat/mengelola data domain, menjawab pertanyaan, dan membuat ringkasan berdasarkan data pengguna yang tersimpan. AI mengikuti bahasa pengguna, memahami ungkapan waktu, memakai Asia/Jakarta sebagai zona waktu default, mencegah record duplikat, dan tidak mengaku berhasil sebelum backend mengonfirmasi penyimpanan. Sebelum penghapusan, AI menampilkan detail record dan meminta konfirmasi eksplisit; setelah dikonfirmasi, data dihapus permanen. Riwayat percakapan tidak disimpan permanen; data domain dan metadata operasional minimum yang diperlukan tetap disimpan. Data akun, record, file, ekspor, serta konteks AI dipisahkan dan divalidasi di backend. Tidak ada role administrator dalam aplikasi. Pengguna yang dapat mengakses aplikasi melalui jaringan privat Tailscale dapat mendaftar mandiri tanpa kode undangan; akun lokal wajib memverifikasi email sebelum digunakan secara penuh dan alur verifikasi bergantung pada layanan email yang dikonfigurasi. Akun lokal dapat mengubah username/password, mereset password melalui tautan email jika layanan email dikonfigurasi, dan menghapus akun; akun Google dapat mengubah username dan menghapus akun PELITA, tetapi tidak mengubah password Google dari PELITA. Penghapusan akun PELITA menghapus data PELITA secara permanen tanpa menghapus akun Google, dan akun tidak digabung otomatis hanya karena email sama. Schedule memakai satu model agenda bertipe Task/Event/Deadline dengan pengulangan harian, mingguan (pilihan hari), dan bulanan yang dapat diakhiri berdasarkan tanggal atau jumlah kejadian. Finance tidak membuat transaksi otomatis berulang; transaksi rutin dicatat sebagai transaksi biasa. Finance menggunakan IDR, saldo awal per wallet, kategori bawaan dan kustom, pengarsipan wallet/kategori untuk menjaga histori, tanpa transfer antar-wallet, periode mingguan Senin–Minggu, serta batas bawaan contoh Rp50.000/hari dan Rp350.000/minggu yang dapat diubah. Refund mengurangi pengeluaran bersih pada periode tanggal refund. Nutrition mengizinkan makanan kustom yang dapat digunakan kembali, mencatat beberapa item makanan per satu catatan makan dan menyimpan kombinasi sebagai menu favorit, menggunakan satuan metrik (kg, cm, gram, mililiter, kcal), menghitung target rekomendasi dari profil, mengizinkan penyesuaian manual, serta menandai estimasi foto sebagai perkiraan. Reminder Schedule default satu jam sebelum agenda; reminder nutrisi default lima jam sebelum pergantian hari. Notifikasi diproses oleh backend scheduler dengan status pengiriman, retry terbatas, pencegahan duplikasi, dan fallback in-app yang wajar. Strategi AI hybrid memprioritaskan opsi lokal untuk menekan biaya dan menggunakan API eksternal secara selektif dengan minimisasi data dan penjelasan privasi; pengguna dapat menonaktifkan pemrosesan eksternal, sedangkan nilai default pengaturan pada akun baru masih harus ditetapkan. Model/provider dan batas biaya numerik diverifikasi di SDD. Stack utama yang dipilih adalah Next.js App Router + TypeScript, Tailwind CSS + shadcn/ui, Zod, PostgreSQL + Prisma ORM, Better Auth, worker Node.js/TypeScript persisten dengan pg-boss, `web-push`, serta Docker Compose untuk deployment. Model lokal seperti Ollama dievaluasi, bukan diasumsikan pasti memadai; service Python hanya ditambahkan jika diperlukan untuk teknologi AI/OCR/speech-to-text tertentu. Detail versi dan konfigurasi diverifikasi di SDD. Pengujian awal menargetkan Windows 11 Chrome/Edge dan Android Chrome, menggabungkan tes otomatis dan manual dengan screenshot untuk UI serta target performa angka yang ditetapkan setelah baseline sebelum acceptance test. PELITA tidak menyediakan fitur backup/restore; pemilik server menyalin database dan file terkait secara manual di luar aplikasi bila diperlukan. Home server Ubuntu 24.04 diakses privat melalui Tailscale; PWA Web Push membutuhkan konfigurasi HTTPS dan dukungan platform. Fitur quiet hours tidak disediakan. Dashboard menampilkan ringkasan utama dan masing-masing domain menyediakan filter periode, grafik relevan, serta ekspor CSV/JSON; analisis lintas-domain tingkat lanjut tidak termasuk cakupan yang ditetapkan. Dokumen Markdown ini adalah sumber keputusan utama; PRD terpisah tidak dibuat. Dokumen lanjutan adalah SRS, SDD, STD/DUPL, dan User Manual, mengikuti kebutuhan guidebook IMPAL serta pelacakan requirement sampai pengujian.**
