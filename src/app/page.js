'use client';

import { useState } from 'react';
import SuratLamaranForm from '../components/SuratLamaranForm';
import SuratLamaranPreview from '../components/SuratLamaranPreview';
import initialData from '../data/initialData';

export default function Home() {
  const [suratData, setSuratData] = useState(initialData);

  const handleDataChange = (newData) => {
    setSuratData(newData);
  };
  
  const handleTtdSettingChange = (name, value) => {
    setSuratData(prevData => ({
        ...prevData,
        [name]: value
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col lg:flex-row gap-8 print:block">
      <div className="lg:w-1/2 print:hidden overflow-y-auto">
        <SuratLamaranForm onDataChange={handleDataChange} initialData={initialData} />
      </div>
      <div className="lg:w-1/2 print:w-full print:p-0 overflow-auto">
        <SuratLamaranPreview 
          data={suratData} 
          onTtdSettingChange={handleTtdSettingChange}
        />
      </div>
    </div>
  );
}