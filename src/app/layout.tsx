import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClientProvider, ServerProvider } from 'src/providers/';

import '@/styles/globals.css';
import { cn } from '@/utils/functions/cn';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Specify the weights you need
  style: ['normal', 'italic'], // Specify styles (optional)
  display: 'swap', // Optional: use swap display mode for faster font rendering
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'D² Weather Watch',
  description: 'Simple Weather App',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <body className={cn('antialiased', poppins.className, poppins.variable)}>
        <ServerProvider>
          <ClientProvider>{children}</ClientProvider>
        </ServerProvider>
      </body>
    </html>
  );
};

export default RootLayout;
