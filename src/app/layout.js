import './globals.css';
import dataConfig from '../data/dataConfig.json';

export const metadata = {
  title: dataConfig.metadata.title,
  description: dataConfig.metadata.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 print:bg-white">{children}</body>
    </html>
  );
}