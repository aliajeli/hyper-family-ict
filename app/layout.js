import './globals.css'; // <--- این خط باید حتماً باشد

export const metadata = {
  title: 'Hyper Family ICT',
  description: 'Network Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
      </body>
    </html>
  );
}