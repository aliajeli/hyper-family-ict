import './globals.css';

export const metadata = {
  title: 'Hyper Family ICT',
  description: 'Network Management System for Hyper Family Stores',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}