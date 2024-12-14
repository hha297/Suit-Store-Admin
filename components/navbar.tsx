import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { MainNav } from './mainNav';
import StoreSwitcher from './storeSwitcher';
import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';

const Navbar = async () => {
        const { userId } = await auth();

        if (!userId) {
                redirect('/sign-in');
        }

        const stores = await prismadb.store.findMany({ where: { userId } });
        return (
                <div className="border-b">
                        <div className="flex justify-between items-center p-4">
                                <StoreSwitcher items={stores} />

                                <MainNav className="mx-6" />
                                <div className="ml-auto flex items-center space-x-4">
                                        <UserButton afterSignOutUrl="/" />
                                </div>
                        </div>
                </div>
        );
};

export default Navbar;
