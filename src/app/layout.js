import './globals.css';
import constants from '../data/constants.json';

export const metadata = {
  title: constants.app.title,
  description: constants.app.description,
  metadataBase: new URL(constants.urls.base),
};

export default function RootLayout({ children }) {
  return (
    <html lang={constants.app.lang}>
      <body>{children}</body>
    </html>
  );
}
