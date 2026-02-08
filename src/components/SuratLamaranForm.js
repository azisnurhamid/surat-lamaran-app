'use client';

import { useState } from 'react';
import dataConfig from '../data/dataConfig.json';
import constants from '../data/constants.json';

const InputField = ({ label, name, value, onChange, onBlur, type = "text", required = false, placeholder = "", error = "" }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500 ml-1">{dataConfig.labels.requiredMark}</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`border rounded-md p-2 text-sm focus:ring-2 outline-none transition ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
      required={required}
    />
    {error && <span className="text-[10px] text-red-500 font-medium">{error}</span>}
  </div>
);

const TextAreaField = ({ label, name, value, onChange, onBlur, rows = 3, required = false, placeholder = "" }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500 ml-1">{dataConfig.labels.requiredMark}</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      rows={rows}
      placeholder={placeholder}
      className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
      required={required}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500 ml-1">{dataConfig.labels.requiredMark}</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
      required={required}
    >
      <option value="" disabled>-- {dataConfig.labels.select} {label} --</option>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const CheckboxGroup = ({ label, selectedOptions, options, prefix, onChange }) => {
  const handleToggle = (optionBase) => {
    const fullOption = `${prefix} ${optionBase}`;
    let newSelection = selectedOptions.includes(fullOption)
      ? selectedOptions.filter((item) => item !== fullOption)
      : [...selectedOptions, fullOption];
    onChange({ target: { name: 'lampiran', value: newSelection } });
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        {label} <span className="text-red-500 ml-1">{dataConfig.labels.requiredMark}</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-200 p-3 rounded-md bg-gray-50 max-h-60 overflow-y-auto">
        {options.map((option, index) => {
          const isChecked = selectedOptions.some(item => item.endsWith(option));
          return (
            <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
              <input type="checkbox" checked={isChecked} onChange={() => handleToggle(option)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">{prefix} {option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const SuratLamaranForm = ({ data, handleChange, handleBlur, handleFileChange }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showOtherJabatan, setShowOtherJabatan] = useState(false);
  const steps = dataConfig.steps;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateNoHp = (no) => /^08[0-9]{8,11}$/.test(no);
  const validateWebsite = (web) => { if (!web) return true; return /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/.test(web); };

  const validateStep = (step) => {
    switch (step) {
      case 0: return data.kotaPembuatan?.trim() && data.tanggalPembuatan?.trim() && data.tujuanPerusahaan?.trim() && data.tujuanAlamat?.trim() && data.perihal?.trim() && data.tujuanJabatan?.trim();
      case 1: return data.nama?.trim() && data.alamat?.trim() && validateEmail(data.email) && validateNoHp(data.noHp) && validateWebsite(data.website);
      case 2: return data.posisiDilamar?.trim() && data.sumberInfo?.trim() && data.pendidikan?.trim() && data.jurusan?.trim() && data.pengalaman?.trim();
      case 3: return data.lampiran && data.lampiran.length > 0;
      default: return true;
    }
  };

  const handleNext = () => { if (validateStep(activeStep)) setActiveStep(prev => prev + 1); };
  const handlePrev = () => { if (activeStep > 0) setActiveStep(prev => prev - 1); };
  const handlePrint = () => { window.print(); };

  const handleMetodeChange = (e) => {
    const newMetode = e.target.value;
    const oldPrefix = data.metodeLamaran === "Online Scan" ? "Scan" : "Fotocopy";
    const newPrefix = newMetode === "Online Scan" ? "Scan" : "Fotocopy";
    
    const updatedLampiran = data.lampiran.map(item => {
      if (typeof item === 'string' && item.startsWith(oldPrefix)) {
        return item.replace(oldPrefix, newPrefix);
      }
      return `${newPrefix} ${item}`;
    });

    handleChange(e);
    handleChange({ target: { name: 'lampiran', value: updatedLampiran } });
  };

  const prefix = data.metodeLamaran === "Online Scan" ? "Scan" : "Fotocopy";

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800">{steps[activeStep]}</h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{activeStep + 1} / {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}></div>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-6 min-h-[420px]">
        {activeStep === 0 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label={dataConfig.labels.kotaPembuatan} name="kotaPembuatan" value={data.kotaPembuatan} onChange={handleChange} onBlur={handleBlur} required={true} />
              <InputField label={dataConfig.labels.tanggalPembuatan} name="tanggalPembuatan" value={data.tanggalPembuatan} onChange={handleChange} type="date" required={true} />
            </div>
            {!showOtherJabatan ? (
              <SelectField label={dataConfig.labels.tujuanJabatan} name="tujuanJabatan" value={data.tujuanJabatan} onChange={(e) => { if(e.target.value === dataConfig.labels.otherOption) { setShowOtherJabatan(true); handleChange({target:{name:'tujuanJabatan', value:''}}); } else { handleChange(e); } }} options={dataConfig.options.tujuanJabatan} required={true} />
            ) : (
              <InputField label={dataConfig.labels.tujuanJabatan} name="tujuanJabatan" value={data.tujuanJabatan} onChange={handleChange} onBlur={handleBlur} placeholder={dataConfig.labels.placeholderJabatan} required={true} />
            )}
            <InputField label={dataConfig.labels.tujuanPerusahaan} name="tujuanPerusahaan" value={data.tujuanPerusahaan} onChange={handleChange} onBlur={handleBlur} required={true} />
            <TextAreaField label={dataConfig.labels.tujuanAlamat} name="tujuanAlamat" value={data.tujuanAlamat} onChange={handleChange} onBlur={handleBlur} rows={2} required={true} />
            <InputField label={dataConfig.labels.perihal} name="perihal" value={data.perihal} onChange={handleChange} onBlur={handleBlur} required={true} />
          </div>
        )}
        {activeStep === 1 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <InputField label={dataConfig.labels.nama} name="nama" value={data.nama} onChange={handleChange} onBlur={handleBlur} required={true} />
            <TextAreaField label={dataConfig.labels.alamat} name="alamat" value={data.alamat} onChange={handleChange} onBlur={handleBlur} rows={2} required={true} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label={dataConfig.labels.email} name="email" value={data.email} onChange={handleChange} onBlur={handleBlur} type="email" required={true} error={data.email && !validateEmail(data.email) ? dataConfig.messages.emailError : ""} />
              <InputField label={dataConfig.labels.noHp} name="noHp" value={data.noHp} onChange={handleChange} onBlur={handleBlur} type="tel" required={true} error={data.noHp && !validateNoHp(data.noHp) ? dataConfig.messages.noHpError : ""} />
            </div>
            <InputField label={dataConfig.labels.website} name="website" value={data.website} onChange={handleChange} onBlur={handleBlur} error={data.website && !validateWebsite(data.website) ? dataConfig.messages.websiteError : ""} />
          </div>
        )}
        {activeStep === 2 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <InputField label={dataConfig.labels.posisiDilamar} name="posisiDilamar" value={data.posisiDilamar} onChange={handleChange} onBlur={handleBlur} required={true} />
            <SelectField label={dataConfig.labels.sumberInfo} name="sumberInfo" value={data.sumberInfo} onChange={handleChange} options={dataConfig.options.sumberInfo} required={true} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label={dataConfig.labels.pendidikan} name="pendidikan" value={data.pendidikan} onChange={handleChange} options={dataConfig.options.pendidikan} required={true} />
              <InputField label={dataConfig.labels.jurusan} name="jurusan" value={data.jurusan} onChange={handleChange} onBlur={handleBlur} required={true} />
            </div>
            <TextAreaField label={dataConfig.labels.pengalaman} name="pengalaman" value={data.pengalaman} onChange={handleChange} onBlur={handleBlur} rows={3} required={true} />
          </div>
        )}
        {activeStep === 3 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <SelectField label={dataConfig.labels.metodeLamaran} name="metodeLamaran" value={data.metodeLamaran} onChange={handleMetodeChange} options={dataConfig.options.metodeLamaran} required={true} />
            <CheckboxGroup label={dataConfig.labels.lampiran} selectedOptions={data.lampiran} options={dataConfig.options.lampiranBaseOptions} prefix={prefix} onChange={handleChange} />
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-sm font-semibold text-gray-700">{dataConfig.labels.uploadTtd}</label>
              <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <p className="text-xs text-gray-500 mt-1">{dataConfig.labels.ttdNote}</p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
        <button onClick={handlePrev} disabled={activeStep === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-sm'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={constants.icons.prev}></path></svg>
          {dataConfig.navigation.prev}
        </button>
        {activeStep === steps.length - 1 ? (
            <button onClick={handlePrint} disabled={!validateStep(activeStep)} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold shadow-md transition ${validateStep(activeStep) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={constants.icons.print}></path></svg>
              {dataConfig.navigation.finish}
            </button>
        ) : (
            <button onClick={handleNext} disabled={!validateStep(activeStep)} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold shadow-md transition ${validateStep(activeStep) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              {dataConfig.navigation.next}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={constants.icons.next}></path></svg>
            </button>
        )}
      </div>
    </div>
  );
};

export default SuratLamaranForm;