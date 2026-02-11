import dataConfig from '../data/dataConfig.json';
import Image from 'next/image';

const SuratLamaranPreview = ({ data }) => {
  const previewConfig = dataConfig.preview;
  const fallback = previewConfig.fallbacks;
  const labels = previewConfig.labels;
  const messages = previewConfig.messages;
  const fontFamily = data.fontFamily || dataConfig.defaults.fontFamily;
  const baseFontSize = Number(previewConfig.baseFontSizePx) || 16;
  const fontScale = previewConfig.fontScale?.[fontFamily] || 1;
  const fontSize = `${baseFontSize * fontScale}px`;
  const lampiranItems = Array.isArray(data.lampiran) ? data.lampiran : [];
  const lampiranLeftCount = Math.ceil(lampiranItems.length / 2);
  const lampiranLeft = lampiranItems.slice(0, lampiranLeftCount);
  const lampiranRight = lampiranItems.slice(lampiranLeftCount);
  const identityRows = [
    { label: labels.nama, value: data.nama || fallback.value },
    { label: labels.pendidikan, value: `${data.pendidikan || fallback.value} ${data.jurusan || ''}`.trim() },
    { label: labels.alamat, value: data.alamat || fallback.value },
    { label: labels.noHp, value: data.noHp || fallback.value },
    { label: labels.email, value: data.email || fallback.value },
  ];

  if (data.website) {
    identityRows.push({ label: labels.portofolio, value: data.website });
  }

  const signatureStyle = {
    transform: `translate(${Number(data.ttdX) || 0}px, ${Number(data.ttdY) || 0}px) scale(${Number(data.ttdScale) || 1}) rotate(${Number(data.ttdRotation) || 0}deg)`,
    transformOrigin: 'center',
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(previewConfig.dateLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const template = dataConfig.template;

  return (
    <div className="p-8 md:p-12 text-gray-900 bg-white min-h-[1123px] leading-relaxed text-justify" style={{ fontFamily, fontSize }}>
      <div className="mb-8">
        <p className="text-right mb-6">
          {data.kotaPembuatan || fallback.kota}, {formatTanggal(data.tanggalPembuatan) || fallback.tanggal}
        </p>
        
        <div className="mb-6">
          <p>{labels.hal} <span className="underline">{data.perihal || fallback.perihal}</span></p>
        </div>

        <div className="mb-8">
          <p>{labels.yth} {data.tujuanJabatan || fallback.tujuanJabatan}</p>
          <p className="font-bold">{data.tujuanPerusahaan || fallback.tujuanPerusahaan}</p>
          <p className="max-w-xs">{data.tujuanAlamat || fallback.tujuanAlamat}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p>{template.salamPembuka}</p>

        <p>
          {template.pembuka.replace('{sumberInfo}', data.sumberInfo || fallback.value).replace('{posisiDilamar}', data.posisiDilamar || fallback.value)}
        </p>

        <div className="ml-4 space-y-1">
          {identityRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[150px_10px_1fr]">
              <span>{row.label}</span><span>:</span><span className={row.className || ''}>{row.value}</span>
            </div>
          ))}
        </div>

        {data.pengalaman?.trim() && <p>{data.pengalaman.trim()}</p>}

        <p>{template.penutupLampiran}</p>

        {lampiranItems.length > 0 ? (
          <div className="ml-8 grid grid-cols-2 gap-x-10">
            <ol className="list-decimal space-y-1">
              {lampiranLeft.map((item, index) => (
                <li key={`left-${index}`}>{item}</li>
              ))}
            </ol>
            <ol className="list-decimal space-y-1" start={lampiranLeftCount + 1}>
              {lampiranRight.map((item, index) => (
                <li key={`right-${index}`}>{item}</li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="ml-8 text-gray-400 italic">{messages.lampiranKosong}</p>
        )}

        <p>{template.penutupHarapan}</p>
        
        <p>{template.salamPenutup}</p>
      </div>

      <div className="mt-12 flex flex-col items-end">
        <div className="text-center min-w-[200px]">
          <p className="mb-2">{messages.hormatSaya}</p>
          <div className="h-16 flex items-center justify-center mb-1">
            {data.ttd ? (
              <div style={signatureStyle}>
                <Image
                  src={data.ttd}
                  alt={messages.ttdAlt}
                  width={150}
                  height={96}
                  unoptimized
                  className="max-h-full max-w-[150px] object-contain"
                />
              </div>
            ) : (
              <div className="w-32 border-b border-gray-300 h-16"></div>
            )}
          </div>
          <p className="font-bold underline">{data.nama || fallback.namaLengkap}</p>
        </div>
      </div>
    </div>
  );
};

export default SuratLamaranPreview;
