'use client';

import { useState, useEffect, useRef } from 'react';
import dataConfig from '../data/dataConfig.json';
import constants from '../data/constants.json';

const replaceTemplate = (template, data) => {
    let result = template;
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            result = result.replace(regex, data[key]);
        }
    }
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return result;
};

const TtdSlider = ({ name, label, icon, min, max, step, value, onChange }) => (
  <div className='flex flex-col items-center justify-center p-2'>
      <label htmlFor={name} className="text-sm font-semibold text-gray-800">{icon} {label}</label>
      <input 
          type="range" 
          id={name} 
          name={name} 
          value={value} 
          onChange={onChange} 
          min={min} 
          max={max} 
          step={step} 
          className="w-full h-2 cursor-pointer" 
      />
      <span className='text-xs text-gray-600'>{value.toFixed(name === 'ttdScale' ? 1 : 0)}{name === 'ttdRotation' ? '°' : (name === 'ttdScale' ? 'x' : 'px')}</span>
  </div>
);

const TtdSettingsOverlay = ({ data, onRangeChange, setTtdActive }) => {
  const customStyles = {
      ttdScale: constants.icons.ttdScaleIcon,
      ttdRotation: constants.icons.ttdRotationIcon,
      ttdOffsetX: constants.icons.ttdOffsetXIcon,
      ttdOffsetY: constants.icons.ttdOffsetYIcon
  };
  const { ttdScale, ttdRotation, ttdOffsetX, ttdOffsetY } = data;
  
  return (
    <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-lg border border-blue-400 z-10 p-2 w-[350px] print:hidden">
        <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                setTtdActive(false); 
            }} 
            className="absolute top-1 right-2 text-gray-500 hover:text-red-500 font-bold text-lg"
        >
            &times;
        </button>
        <h5 className="text-center font-bold text-sm mb-2 text-blue-600 border-b pb-1">{dataConfig.labels.ttdSettings}</h5>
        
        <div className="grid grid-cols-2 gap-2">
            <TtdSlider 
                name="ttdScale" 
                icon={customStyles.ttdScale}
                label={dataConfig.labels.ttdScale} 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={ttdScale}
                onChange={onRangeChange}
            />
            <TtdSlider 
                name="ttdRotation" 
                icon={customStyles.ttdRotation}
                label={dataConfig.labels.ttdRotation} 
                min="-45" 
                max="45" 
                step="1" 
                value={ttdRotation}
                onChange={onRangeChange}
            />
        </div>
        <h6 className="text-center font-semibold text-xs mt-3 mb-1 text-gray-700">{dataConfig.labels.ttdPositionHelp}</h6>
        <div className="grid grid-cols-2 gap-2">
             <TtdSlider 
                name="ttdOffsetX" 
                icon={customStyles.ttdOffsetX}
                label={dataConfig.labels.ttdOffsetX} 
                min="-100" 
                max="100" 
                step="1" 
                value={ttdOffsetX}
                onChange={onRangeChange}
            />
            <TtdSlider 
                name="ttdOffsetY" 
                icon={customStyles.ttdOffsetY}
                label={dataConfig.labels.ttdOffsetY} 
                min="-100" 
                max="100" 
                step="1" 
                value={ttdOffsetY}
                onChange={onRangeChange}
            />
        </div>
    </div>
  );
};

const SuratLamaranPreview = ({ data, onTtdSettingChange }) => {
  const {
    kotaPembuatan,
    tanggalPembuatan,
    tujuanPerusahaan,
    tujuanAlamat,
    perihal,
    nama,
    alamat,
    email,
    noHp,
    website,
    sumberInfo,
    posisiDilamar,
    wilayah,
    pendidikan,
    jurusan,
    pengalaman,
    lampiran,
    tandaTangan,
    ttdScale,
    ttdRotation,
    ttdOffsetX,
    ttdOffsetY
  } = data;

  const [ttdActive, setTtdActive] = useState(false);
  const ttdRef = useRef(null); 

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        if (isNaN(dateObj)) return dateString;
        return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    onTtdSettingChange(name, parseFloat(value));
  };
  
  const handleDragStart = (e) => {
    if (e.target.tagName !== 'IMG') return;
    
    e.preventDefault(); 
    e.stopPropagation(); 
    
    setTtdActive(true);

    if (e.button !== 0 && !e.touches) return; 

    const initialClientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const initialClientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const initialOffsetX = ttdOffsetX;
    const initialOffsetY = ttdOffsetY;

    const dragHandler = (moveEvent) => {
        const currentClientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX) || 0;
        const currentClientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY) || 0;

        const newOffsetX = initialOffsetX + (currentClientX - initialClientX);
        const newOffsetY = initialOffsetY + (currentClientY - initialClientY);
        
        onTtdSettingChange('ttdOffsetX', newOffsetX);
        onTtdSettingChange('ttdOffsetY', newOffsetY);
    };

    const dragEndHandler = () => {
        document.removeEventListener('pointermove', dragHandler);
        document.removeEventListener('pointerup', dragEndHandler);
        document.removeEventListener('touchmove', dragHandler, { passive: false });
        document.removeEventListener('touchend', dragEndHandler); 
    };

    document.addEventListener('pointermove', dragHandler);
    document.addEventListener('pointerup', dragEndHandler);
    document.addEventListener('touchmove', dragHandler, { passive: false });
    document.addEventListener('touchend', dragEndHandler);
  };
  
  const handleClickOutside = (event) => {
      if (ttdRef.current && !ttdRef.current.contains(event.target)) {
        setTtdActive(false);
      }
  };
  
  useEffect(() => {
    if (ttdActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ttdActive]);


  const formattedTanggal = formatDate(tanggalPembuatan);

  const ttdBaseStyle = {
      position: 'relative',
      transform: `translate(${ttdOffsetX}px, ${ttdOffsetY}px) scale(${ttdScale}) rotate(${ttdRotation}deg)`,
  };

  const paragrafIsi1 = replaceTemplate(dataConfig.surat.paragrafIsi1Template, {
      posisiDilamar, wilayah, sumberInfo, pendidikan, jurusan, pengalaman
  });

  const penutupSurat = replaceTemplate(dataConfig.surat.penutupSuratTemplate, {
      tujuanPerusahaan
  });

  return (
    <div className="flex flex-col gap-4">
        <div className="surat-container font-sans">
          <div className="flex justify-end">
            <span>{kotaPembuatan}, {formattedTanggal}</span>
          </div>

          <div className="mt-6">
            <p>{dataConfig.surat.kepadaYth}</p>
            <p><strong>{dataConfig.surat.bpkIbuHrd} {tujuanPerusahaan}</strong></p>
            <p>{tujuanAlamat}</p>
          </div>

          <div className="mt-8">
            <p>Perihal: <strong>{perihal}</strong></p>
          </div>

          <div className="mt-8">
            <p>{dataConfig.surat.denganHormat}</p>
            <p className="mt-4">{dataConfig.surat.pembuka}</p>
          </div>

          <table className="mt-4 w-full border-collapse">
            <tbody>
              <tr>
                <td className="w-40 align-top">{dataConfig.surat.labelNama}</td>
                <td className="w-2 align-top">:</td>
                <td><strong>{nama}</strong></td>
              </tr>
              <tr>
                <td className="align-top">{dataConfig.surat.labelAlamat}</td>
                <td className="w-2 align-top">:</td>
                <td>{alamat}</td>
              </tr>
              <tr>
                <td className="align-top">{dataConfig.surat.labelEmail}</td>
                <td className="w-2 align-top">:</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td className="align-top">{dataConfig.surat.labelNoHp}</td>
                <td className="w-2 align-top">:</td>
                <td>{noHp}</td>
              </tr>
              <tr>
                <td className="align-top">{dataConfig.surat.labelWebsite}</td>
                <td className="w-2 align-top">:</td>
                <td>{website}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <p dangerouslySetInnerHTML={{ __html: paragrafIsi1 }} />
            <p className="mt-4">
              {dataConfig.surat.paragrafIsi2}
            </p>
            <p className="mt-4">
              {dataConfig.surat.paragrafLampiran}
            </p>
            <ul className="list-decimal ml-6 mt-2">
              {lampiran.split('\n').map((item, index) => (
                item.trim() && <li key={index}>{item.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p dangerouslySetInnerHTML={{ __html: penutupSurat }} />
          </div>

          <div className="mt-4 flex justify-end" style={{ breakInside: 'avoid' }}> 
            <div className="w-fit text-center relative"> 
                <p className="text-center">{dataConfig.surat.hormatSaya}</p> 

                <div ref={ttdRef} className="mt-1 h-16 relative print:hidden inline-block" style={{ overflow: 'visible' }}> 
                  {tandaTangan && (
                    <>
                      <img 
                        src={tandaTangan} 
                        alt={dataConfig.labels.ttdAltText} 
                        className={`max-h-16 max-w-[150px] object-contain mx-auto ${ttdActive ? 'ring-2 ring-blue-500 p-1 rounded-lg' : ''}`}
                        style={{
                          ...ttdBaseStyle,
                          filter: 'grayscale(100%) brightness(0) invert(0)', 
                          transition: 'transform 0.1s ease-out',
                          cursor: 'grab',
                        }} 
                        onPointerDown={handleDragStart} 
                        draggable="false"
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setTtdActive(true); 
                        }} 
                      />

                      {ttdActive && (
                          <TtdSettingsOverlay 
                              data={data} 
                              onRangeChange={handleRangeChange} 
                              setTtdActive={setTtdActive} 
                          />
                      )}
                    </>
                  )}
                </div>
                
                <div className="hidden print:block mt-1 relative inline-block" style={{ overflow: 'visible', minHeight: '64px' }}>
                    {tandaTangan && (
                        <img 
                          src={tandaTangan} 
                          alt={dataConfig.labels.ttdAltText} 
                          className="max-h-16 max-w-[150px] object-contain mx-auto"
                          style={{ 
                            ...ttdBaseStyle,
                            filter: 'grayscale(100%) contrast(1000%)',
                            cursor: 'default',
                          }}
                        />
                    )}
                </div>
                
                <div className="mt-[-4] flex justify-center">
                  <p className="border-b border-black inline-block"><strong>{nama}</strong></p> 
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SuratLamaranPreview;