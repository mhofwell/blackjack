import { Inter } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from './apollo/client-provider';

// Components
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
                <ApolloWrapper>
                    <Navigation />
                    {children}
                </ApolloWrapper>
            </body>
        </html>
    );
}
