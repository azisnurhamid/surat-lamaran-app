'use client';

import { useState } from 'react';
import dataConfig from '../data/dataConfig.json';
import constants from '../data/constants.json';

const SuratLamaranForm = ({ onDataChange, initialData }) => {
  const initialKotaOptions = dataConfig.labels.kotaOptions.slice(0, -1);
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isOtherCitySelected, setIsOtherCitySelected] = useState(
    !initialKotaOptions.includes(initialData.kotaPembuatan)
  );
  const [isOtherWilayahSelected, setIsOtherWilayahSelected] = useState(
    !initialKotaOptions.includes(initialData.wilayah)
  );

  const mandatoryFields = [
    'kotaPembuatan',
    'tanggalPembuatan',
    'tujuanPerusahaan',
    'tujuanAlamat',
    'perihal',
    'nama',
    'alamat',
    'email',
    'noHp',
    'posisiDilamar',
    'wilayah',
    'sumberInfo',
    'pendidikan',
    'jurusan',
    'pengalaman',
    'lampiran'
  ];

  const capitalizedFields = [
    'tujuanPerusahaan',
    'tujuanAlamat',
    'perihal',
    'nama',
    'alamat',
    'posisiDilamar',
    'pendidikan',
    'jurusan',
    'pengalaman'
  ];

  const mandatoryFieldsByStep = {
    1: ['kotaPembuatan', 'tanggalPembuatan', 'tujuanPerusahaan', 'tujuanAlamat', 'perihal'],
    2: ['nama', 'alamat', 'email', 'noHp'],
  };

  const isFormValid = (currentData) => {
      for (const field of mandatoryFields) {
          if (!currentData[field] || String(currentData[field]).trim() === '') {
              return false;
          }
      }
      return true;
  };

  const isStepValid = (step, currentData) => {
      const fields = mandatoryFieldsByStep[step];
      if (!fields) return true; 

      for (const field of fields) {
          if (!currentData[field] || String(currentData[field]).trim() === '') {
              return false;
          }
      }
      return true;
  };

  const toTitleCase = (str) => {
    let processedStr = str.replace(/(pt|cv)\s*\./gi, '$1'); 

    return processedStr.replace(/\w\S*/g, (txt) => {
      if (txt.toLowerCase() === 'pt') {
        return 'PT';
      }
      if (txt.toLowerCase() === 'cv') {
        return 'CV';
      }
      if (txt.toLowerCase() === 'rt') {
        return 'RT';
      }
      if (txt.toLowerCase() === 'rw') {
        return 'RW';
      }
      if (txt.toLowerCase() === 'sd') {
        return 'SD';
      }
      if (txt.toLowerCase() === 'smp') {
        return 'SMP';
      }
      if (txt.toLowerCase() === 'sma') {
        return 'SMA';
      }
      if (txt.toLowerCase() === 'smk') {
        return 'SMK';
      }
      if (txt.toLowerCase() === 'dll') {
        return 'dll';
      }
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const sanitizeValue = (value) => {
    if (typeof value !== 'string') return value;

    if (value.startsWith(' ')) {
        value = value.trimStart();
    }
    
    value = value.replace(/\s{2,}/g, ' ');
    
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let sanitizedValue = sanitizeValue(value);
    let finalValue = sanitizedValue;

    if (capitalizedFields.includes(name)) {
        finalValue = toTitleCase(sanitizedValue);
    }
    
    const newData = { ...data };

    if (name === 'kotaPembuatan') {
        if (value === dataConfig.labels.otherOption) {
            setIsOtherCitySelected(true);
            newData[name] = ''; 
        } else {
            setIsOtherCitySelected(false);
            newData[name] = value;
        }
    } else if (name === 'otherKotaPembuatan') {
        finalValue = toTitleCase(sanitizedValue); 
        newData['kotaPembuatan'] = finalValue;
    } else if (name === 'wilayah') {
        if (value === dataConfig.labels.otherOption) {
            setIsOtherWilayahSelected(true);
            newData[name] = ''; 
        } else {
            setIsOtherWilayahSelected(false);
            newData[name] = value;
        }
    } else if (name === 'otherWilayah') {
        finalValue = toTitleCase(sanitizedValue); 
        newData['wilayah'] = finalValue;
    } else {
        newData[name] = finalValue;
    }
    
    setData(newData);
    onDataChange(newData);
  };
  
  const handleLampiranChange = (e) => {
    const { value, checked } = e.target;
    
    const currentLampiranSet = new Set(data.lampiran.split('\n').map(item => item.trim()).filter(item => item !== ''));

    if (checked) {
      currentLampiranSet.add(value);
    } else {
      currentLampiranSet.delete(value);
    }
    
    const sortedLampiranArray = dataConfig.labels.lampiranOptions.filter(option => 
      currentLampiranSet.has(option)
    );
    
    const newLampiranString = sortedLampiranArray.join('\n');
    
    const newData = { ...data, lampiran: newLampiranString };
    setData(newData);
    onDataChange(newData);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (value && value.endsWith(' ')) {
        const trimmedValue = value.trimEnd();
        
        const syntheticEvent = { target: { name, value: trimmedValue } };
        
        handleChange(syntheticEvent);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'image/png') {
          alert(dataConfig.labels.ttdAlertPNG);
          e.target.value = null;
          return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = { 
            ...data, 
            tandaTangan: reader.result,
            ttdScale: 1.0, 
            ttdRotation: 0,
            ttdOffsetX: 0,
            ttdOffsetY: 0,
        };
        setData(newData);
        onDataChange(newData);
      };
      reader.readAsDataURL(file);
    } else {
        const newData = { ...data, tandaTangan: null };
        setData(newData);
        onDataChange(newData);
    }
  };
  
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mt-4";
  const steps = [
    { id: 1, title: dataConfig.form.steps.step1 },
    { id: 2, title: dataConfig.form.steps.step2 },
    { id: 3, title: dataConfig.form.steps.step3 },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 border-b pb-1">{dataConfig.form.steps.step1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="kotaPembuatan" className={labelClass}>{dataConfig.labels.kotaPembuatan}</label>
                <select 
                  id="kotaPembuatan" 
                  name="kotaPembuatan" 
                  value={isOtherCitySelected ? dataConfig.labels.otherOption : data.kotaPembuatan}
                  onChange={handleChange} 
                  className={inputClass}
                  onBlur={handleBlur}
                >
                  {dataConfig.labels.kotaOptions.map(kota => (
                    <option key={kota} value={kota}>
                      {kota}
                    </option>
                  ))}
                </select>
                {isOtherCitySelected && (
                  <input 
                    type="text" 
                    id="otherKotaPembuatan" 
                    name="otherKotaPembuatan" 
                    value={data.kotaPembuatan}
                    onChange={handleChange} 
                    className={`${inputClass} mt-2`}
                    placeholder={dataConfig.labels.otherKotaPlaceholder}
                    onBlur={handleBlur}
                  />
                )}
              </div>
              <div>
                <label htmlFor="tanggalPembuatan" className={labelClass}>{dataConfig.labels.tanggalPembuatan}</label>
                <input type="date" id="tanggalPembuatan" name="tanggalPembuatan" value={data.tanggalPembuatan} onChange={handleChange} className={inputClass} onBlur={handleBlur} />
              </div>
            </div>

            <label htmlFor="tujuanPerusahaan" className={labelClass}>{dataConfig.labels.tujuanPerusahaan}</label>
            <input type="text" id="tujuanPerusahaan" name="tujuanPerusahaan" value={data.tujuanPerusahaan} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="tujuanAlamat" className={labelClass}>{dataConfig.labels.tujuanAlamat}</label>
            <textarea id="tujuanAlamat" name="tujuanAlamat" value={data.tujuanAlamat} onChange={handleChange} className={`${inputClass} h-20`} onBlur={handleBlur}></textarea>

            <label htmlFor="perihal" className={labelClass}>{dataConfig.labels.perihal}</label>
            <input type="text" id="perihal" name="perihal" value={data.perihal} onChange={handleChange} className={inputClass} onBlur={handleBlur} />
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 border-b pb-1">{dataConfig.form.steps.step2}</h3>
            <label htmlFor="nama" className={labelClass}>{dataConfig.labels.nama}</label>
            <input type="text" id="nama" name="nama" value={data.nama} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="alamat" className={labelClass}>{dataConfig.labels.alamat}</label>
            <textarea id="alamat" name="alamat" value={data.alamat} onChange={handleChange} className={`${inputClass} h-16`} onBlur={handleBlur}></textarea>

            <label htmlFor="email" className={labelClass}>{dataConfig.labels.email}</label>
            <input type="email" id="email" name="email" value={data.email} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="noHp" className={labelClass}>{dataConfig.labels.noHp}</label>
            <input type="tel" id="noHp" name="noHp" value={data.noHp} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="website" className={labelClass}>{dataConfig.labels.website}</label>
            <input type="text" id="website" name="website" value={data.website} onChange={handleChange} className={inputClass} onBlur={handleBlur} />
          </>
        );
      case 3:
        const isPrintDisabled = !isFormValid(data);
        
        return (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 border-b pb-1">{dataConfig.form.steps.step3}</h3>
            
            <label htmlFor="posisiDilamar" className={labelClass}>{dataConfig.labels.posisiDilamar}</label>
            <input type="text" id="posisiDilamar" name="posisiDilamar" value={data.posisiDilamar} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="wilayah" className={labelClass}>{dataConfig.labels.wilayah}</label>
            <select 
                id="wilayah" 
                name="wilayah" 
                value={isOtherWilayahSelected ? dataConfig.labels.otherOption : data.wilayah}
                onChange={handleChange} 
                className={inputClass}
                onBlur={handleBlur}
            >
                {dataConfig.labels.kotaOptions.map(wilayah => (
                    <option key={wilayah} value={wilayah}>
                        {wilayah}
                    </option>
                ))}
            </select>
            {isOtherWilayahSelected && (
                <input 
                    type="text" 
                    id="otherWilayah" 
                    name="otherWilayah" 
                    value={data.wilayah}
                    onChange={handleChange} 
                    className={`${inputClass} mt-2`}
                    placeholder={dataConfig.labels.otherWilayahPlaceholder}
                    onBlur={handleBlur}
                />
            )}
            
            <label htmlFor="pendidikan" className={labelClass}>{dataConfig.labels.pendidikan}</label>
            <input type="text" id="pendidikan" name="pendidikan" value={data.pendidikan} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="jurusan" className={labelClass}>{dataConfig.labels.jurusan}</label>
            <input type="text" id="jurusan" name="jurusan" value={data.jurusan} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label htmlFor="pengalaman" className={labelClass}>{dataConfig.labels.pengalaman}</label>
            <textarea id="pengalaman" name="pengalaman" value={data.pengalaman} onChange={handleChange} className={`${inputClass} h-24`} onBlur={handleBlur}></textarea>
            
            <label htmlFor="sumberInfo" className={labelClass}>{dataConfig.labels.sumberInfo}</label>
            <input type="text" id="sumberInfo" name="sumberInfo" value={data.sumberInfo} onChange={handleChange} className={inputClass} onBlur={handleBlur} />

            <label className={labelClass}>{dataConfig.labels.lampiran}</label>
            <div className="mt-2 space-y-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                {dataConfig.labels.lampiranOptions.map((option, index) => (
                    <div key={index} className="flex items-center">
                        <input 
                            type="checkbox" 
                            id={`lampiran-${index}`} 
                            name="lampiran" 
                            value={option}
                            checked={data.lampiran.split('\n').some(item => item.trim() === option)}
                            onChange={handleLampiranChange} 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`lampiran-${index}`} className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                            {option}
                        </label>
                    </div>
                ))}
            </div>

            <label htmlFor="tandaTangan" className={labelClass}>{dataConfig.labels.tandaTangan}</label>
            <input 
                type="file" 
                id="tandaTangan" 
                name="tandaTangan" 
                accept={constants.urls.ttdFileType} 
                onChange={handleFileChange} 
                className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            />
            {data.tandaTangan && (
                <div className="mt-2 p-2 border rounded-md flex items-center justify-between bg-gray-50">
                    <span className="text-sm text-gray-600">{dataConfig.labels.ttdSuccess}</span>
                    <button 
                        onClick={() => {
                            const newData = { ...data, tandaTangan: null };
                            setData(newData);
                            onDataChange(newData);
                        }} 
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                        {dataConfig.labels.ttdDeleteButton}
                    </button>
                </div>
            )}

            <button
              onClick={() => window.print()}
              className={`mt-6 w-full text-white py-3 rounded-md transition duration-150 print:hidden font-bold ${
                  isPrintDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isPrintDisabled}
            >
              {constants.icons.buttonPrintIcon} {dataConfig.form.buttonPrint}
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = !isStepValid(currentStep, data);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto sticky top-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{constants.icons.formTitleIcon} {dataConfig.form.title}</h2>
      
      <div className="flex justify-between items-center mb-6">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-200 ${
                currentStep === step.id 
                  ? 'bg-blue-600' 
                  : currentStep > step.id 
                    ? 'bg-green-500' 
                    : 'bg-gray-400'
              }`}
            >
              {step.id}
            </div>
            <p className={`text-xs mt-1 transition-colors duration-200 ${currentStep === step.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>{step.title}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        {renderStepContent()}
      </div>

      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-150 font-semibold"
          >
            {constants.icons.buttonPrevIcon} {dataConfig.form.buttonPrev}
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={nextStep}
            className={`py-2 px-4 rounded-md transition duration-150 font-semibold ${
              isNextDisabled
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${currentStep > 1 ? 'ml-auto' : 'ml-auto'}`}
            disabled={isNextDisabled}
          >
            {dataConfig.form.buttonNext} {constants.icons.buttonNextIcon}
          </button>
        )}
      </div>
      
    </div>
  );
};

export default SuratLamaranForm;