import { Inter } from 'next/font/google';
import './globals.css';

// components
import Navigation from './components/Navigation.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'EPL Blackjack!',
    description: 'EPL Blackjack',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navigation />
                {children}
            </body>
        </html>
    );
}
