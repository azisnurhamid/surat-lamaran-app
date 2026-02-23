'use client';

import { useState } from 'react';
import SuratLamaranForm from '../components/SuratLamaranForm';
import SuratLamaranPreview from '../components/SuratLamaranPreview';
import initialData from '../data/initialData';

const normalizedFields = new Set(['email', 'website']);

export default function Home() {
  const [data, setData] = useState(initialData);
  const updateDataField = (name, value) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const normalizeValue = (name, value, trim = false) => {
    if (typeof value !== 'string') return value;

    let result = value;

    if (normalizedFields.has(name)) {
      result = result.replace(/\s+/g, '').toLowerCase();
    } else {
      result = result.replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return trim ? result.trim() : result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (Array.isArray(value)) {
      updateDataField(name, value);
    } else {
      updateDataField(name, normalizeValue(name, value));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (typeof value === 'string') {
      updateDataField(name, normalizeValue(name, value, true));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'image/png') {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prevData) => ({
        ...prevData,
        ttd: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 print:p-0 print:bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
        <div className="print:hidden">
          <SuratLamaranForm
            data={data}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleFileChange={handleFileChange}
          />
        </div>
        <div className="bg-white shadow-lg print:shadow-none print:m-0">
          <SuratLamaranPreview data={data} />
        </div>
      </div>
    </main>
  );
}
