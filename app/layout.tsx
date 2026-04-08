import type {Metadata} from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ClientShell } from '@/components/shell/ClientShell';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'], variable: '--font-family-display' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-family-ui' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-family-mono' });

export const metadata: Metadata = {
  title: 'Prisma Link',
  description: 'Chat à personas IA — Liquid Glass OS',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
