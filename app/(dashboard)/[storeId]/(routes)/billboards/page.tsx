import React from 'react';
import { BillboardClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { Billboard } from '@prisma/client';
import { format } from 'date-fns';
import { BillboardColumn } from './components/column';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
        const billboards = await prismadb.billboard.findMany({
                where: {
                        storeId: params.storeId,
                },
                orderBy: {
                        createdAt: 'desc',
                },
        });

        const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
                ...item,
                createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        }));
        return (
                <div className="flex-col ">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                                <BillboardClient data={formattedBillboards} />
                        </div>
                </div>
        );
};

export default BillboardsPage;
