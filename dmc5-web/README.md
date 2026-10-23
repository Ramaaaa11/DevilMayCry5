# DEVIL MAY CRY 5 — Red Grave Incident

Website fan concept interaktif bertema Devil May Cry 5, dibuat dengan HTML, CSS, dan JavaScript murni. Sebagian tekstur dan animasi dibuat lewat CSS/Canvas, sedangkan artwork karakter/monster serta lagu berada di folder `assets/`. File audio aslinya berformat AAC dalam kontainer MP4, jadi disimpan dengan ekstensi `.m4a`; jangan memindahkan file audio atau gambar keluar dari folder tersebut.

## File yang dibutuhkan

- `index.html` — struktur dan konten halaman.
- `style.css` — desain, layout responsif, dan animasi.
- `script.js` — interaksi karakter, Devil Trigger, simulasi Style Rank, navigasi, partikel, efek slash/darah, dan kontrol musik.
- `assets/` — artwork karakter/monster lokal dan file musik `addiction-slowed.m4a` yang diberikan pengguna.

## Cara menjalankan di VS Code

1. Ekstrak folder `dmc5-web` dari file ZIP.
2. Buka VS Code → **File → Open Folder** → pilih folder `dmc5-web`.
3. Buka `index.html`.
4. Jalankan dengan ekstensi **Live Server** (klik kanan `index.html` → **Open with Live Server**) atau buka `index.html` langsung di browser.

## Fitur interaktif

- Preloader dengan progress animation.
- Background partikel bara berbasis Canvas.
- Tombol **Devil Trigger** untuk mengaktifkan mode visual merah dan glitch.
- Navigasi mobile dan indikator bagian aktif.
- Pemilih dossier Nero, Dante, V, dan Vergil dengan statistik yang berubah.
- Galeri mini karakter di hero; foto dossier berganti saat Nero, Dante, V, atau Vergil dipilih.
- Pemutar musik lokal dengan tombol ON/OFF dan pengatur volume. Klik tombol musik untuk memulai; browser biasanya tidak mengizinkan autoplay sebelum interaksi.
- Tentakel/monster di tepi layar, efek blood-drip dekoratif, slash, flash, screen shake, dan partikel bara.
- Simulasi combo untuk menaikkan Style Rank dari D sampai SSS.
- Mission files yang dapat dibuka/tutup dan dialog misi.
- Animasi saat scroll, progress bar, dan custom cursor untuk perangkat mouse.
- Mendukung layout mobile dan preferensi `prefers-reduced-motion`.

## Catatan

Google Fonts memerlukan koneksi internet. Jika offline, situs tetap berjalan dengan font fallback bawaan. Ini adalah fan-made concept, bukan situs resmi Capcom.
