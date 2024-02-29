import type { Metadata } from "next";
import { fontSans } from '@/config/fonts';
import '@/styles/globals.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: string[]) {
  const cls = clsx(inputs);
  return twMerge(cls);
}


export const metadata: Metadata = {
  title: "Clinia Sandbox",
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
          'bg-background min-h-screen font-sans antialiased',
          fontSans.variable
        )}
      >{children}</body>
    </html>
  );
}
