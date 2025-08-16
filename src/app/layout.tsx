import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NomadWear - Fashion Store',
  description: 'Your destination for trendy clothing and accessories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 