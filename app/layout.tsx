import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { ModalProvider } from '@/providers/ModalProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
        title: 'Admin Dashboard',
        description: 'Admin Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
                <ClerkProvider>
                        <html lang="en">
                                <body>
                                        <ModalProvider />
                                        <header>
                                                <SignedOut>
                                                        <SignInButton />
                                                </SignedOut>
                                                <SignedIn>
                                                        <UserButton />
                                                </SignedIn>
                                        </header>
                                        {children}
                                </body>
                        </html>
                </ClerkProvider>
        );
}
