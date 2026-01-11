import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppStateProvider } from '@/context/app-state-context';
import { CrisisAlertModal } from '@/components/crisis-alert-modal';

export const metadata: Metadata = {
  title: 'Oceanus Proxima Mission Control',
  description: 'Mission Control Dashboard for Oceanus Proxima, a manned research habitat on Europa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppStateProvider>
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-headline antialiased bg-background text-foreground/90">
          {children}
          <Toaster />
          <CrisisAlertModal />
        </body>
      </html>
    </AppStateProvider>
  );
}
