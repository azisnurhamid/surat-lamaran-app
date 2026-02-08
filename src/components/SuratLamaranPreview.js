import dataConfig from '../data/dataConfig.json';

const SuratLamaranPreview = ({ data }) => {
  const formatTanggal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const template = dataConfig.template;

  return (
    <div className="p-8 md:p-12 text-gray-900 bg-white min-h-[1123px] font-serif leading-relaxed text-justify">
      <div className="mb-8">
        <p className="text-right mb-6">
          {data.kotaPembuatan || 'Kota'}, {formatTanggal(data.tanggalPembuatan) || 'Tanggal'}
        </p>
        
        <div className="mb-6">
          <p>Hal: <span className="font-bold underline">{data.perihal || 'Lamaran Pekerjaan'}</span></p>
        </div>

        <div className="mb-8">
          <p>Yth. {data.tujuanJabatan || 'HRD Manager'}</p>
          <p className="font-bold">{data.tujuanPerusahaan || 'Nama Perusahaan'}</p>
          <p className="max-w-xs">{data.tujuanAlamat || 'Alamat Perusahaan'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p>{template.salamPembuka}</p>

        <p>
          {template.pembuka.replace('{sumberInfo}', data.sumberInfo || '...').replace('{posisiDilamar}', data.posisiDilamar || '...')}
        </p>

        <div className="ml-4 space-y-1">
          <div className="grid grid-cols-[150px_10px_1fr]">
            <span>Nama</span><span>:</span><span className="font-semibold">{data.nama || '...'}</span>
          </div>
          <div className="grid grid-cols-[150px_10px_1fr]">
            <span>Pendidikan</span><span>:</span><span>{data.pendidikan || '...'} {data.jurusan || ''}</span>
          </div>
          <div className="grid grid-cols-[150px_10px_1fr]">
            <span>Alamat</span><span>:</span><span>{data.alamat || '...'}</span>
          </div>
          <div className="grid grid-cols-[150px_10px_1fr]">
            <span>No. HP / WA</span><span>:</span><span>{data.noHp || '...'}</span>
          </div>
          <div className="grid grid-cols-[150px_10px_1fr]">
            <span>Email</span><span>:</span><span>{data.email || '...'}</span>
          </div>
          {data.website && (
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Portofolio</span><span>:</span><span>{data.website}</span>
            </div>
          )}
        </div>

        <p>{data.pengalaman || '...'}</p>

        <p>{template.penutupLampiran}</p>

        <ul className="ml-8 list-decimal">
          {data.lampiran && data.lampiran.length > 0 ? (
            data.lampiran.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li className="text-gray-400 italic">Belum ada lampiran dipilih</li>
          )}
        </ul>

        <p>{template.penutupHarapan}</p>
        
        <p>{template.salamPenutup}</p>
      </div>

      <div className="mt-12 flex flex-col items-end">
        <div className="text-center min-w-[200px]">
          <p className="mb-4">Hormat Saya,</p>
          <div className="h-24 flex items-center justify-center mb-2">
            {data.ttd ? (
              <img 
                src={data.ttd} 
                alt="Tanda Tangan" 
                className="max-h-full max-w-[150px] object-contain"
              />
            ) : (
              <div className="w-32 border-b border-gray-300 h-16"></div>
            )}
          </div>
          <p className="font-bold underline">{data.nama || 'Nama Lengkap'}</p>
        </div>
      </div>
    </div>
  );
};

export default SuratLamaranPreview;