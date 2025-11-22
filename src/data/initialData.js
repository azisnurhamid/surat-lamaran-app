const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const formattedDateInput = `${year}-${month}-${day}`;

const initialData = {
  kotaPembuatan: 'Purwokerto',
  tanggalPembuatan: formattedDateInput,
  tujuanPerusahaan: '',
  tujuanAlamat: '',
  perihal: 'Surat lamaran Pekerjaan',
  nama: 'Azis Nurhamid',
  alamat: 'Jl. Sunan Bonang RT 004 RW 002, Desa Tambaksari Kidul, Kec. Kembaran, Kab. Banyumas, Jawa Tengah',
  email: 'admin@azisnurhamid.my.id',
  noHp: '0896-6663-2577',
  website: 'azisnurhamid.my.id',
  sumberInfo: 'Instagram lokerpurwokerto.id',
  posisiDilamar: '',
  wilayah: 'Purwokerto',
  pendidikan: 'SMK Bina Teknologi Purwokerto',
  jurusan: 'Teknik Komputer dan Jaringan',
  pengalaman: '3 Tahun sebagai Spesialis Pemasaran Digital dan Mengelola Website Perusahaan',
  lampiran: 'Curriculum Vitae\nScan Kartu Tanda Penduduk (KTP)\nScan Ijazah Terakhir\nPas Foto',
  tandaTangan: null,
  ttdScale: 1.0, 
  ttdRotation: 0,
  ttdOffsetX: 0,
  ttdOffsetY: 0,
};

export default initialData;