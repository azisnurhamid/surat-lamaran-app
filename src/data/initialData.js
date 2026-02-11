import dataConfig from './dataConfig.json';

const initialData = {
  kotaPembuatan: '',
  tanggalPembuatan: new Date().toISOString().split('T')[0],
  tujuanJabatan: '',
  tujuanPerusahaan: '',
  tujuanAlamat: '',
  perihal: dataConfig.defaults.perihal,
  fontFamily: dataConfig.defaults.fontFamily,
  nama: '',
  alamat: '',
  email: '',
  noHp: '',
  website: '',
  posisiDilamar: '',
  sumberInfo: '',
  pendidikan: '',
  jurusan: '',
  pengalaman: '',
  metodeLamaran: dataConfig.defaults.metodeLamaran,
  lampiran: [],
  ttd: null,
  ttdX: 0,
  ttdY: 0,
  ttdScale: 1,
  ttdRotation: 0
};

export default initialData;
