import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StoreProvider from '@/lib/provider/StoreProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Premiere League Blackjack',
    description: 'Cards and football.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <StoreProvider>
                <body className={inter.className}>{children}</body>
            </StoreProvider>
        </html>
    );
}
