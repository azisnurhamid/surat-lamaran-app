import './globals.css';

export const metadata = {
  title: 'Generator Surat Lamaran',
  description: 'Buat surat lamaran kerja profesional dengan mudah',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}