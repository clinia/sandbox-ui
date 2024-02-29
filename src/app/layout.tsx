import { fontSans } from '@/config/fonts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Metadata } from 'next';
import '@/styles/globals.css';

function cn(...inputs: string[]) {
  const cls = clsx(inputs);
  return twMerge(cls);
}

export const metadata: Metadata = {
  title: 'Clinia Sandbox',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
