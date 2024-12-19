import React from 'react';
import { SizeClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { Billboard } from '@prisma/client';
import { format } from 'date-fns';
import { SizeColumn } from './components/column';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
        const sizes = await prismadb.size.findMany({
                where: {
                        storeId: params.storeId,
                },
                orderBy: {
                        createdAt: 'desc',
                },
        });

        const formattedSizes: SizeColumn[] = sizes.map((item) => ({
                ...item,
                name: item.name,
                value: item.value,
                createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        }));
        return (
                <div className="flex-col ">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                                <SizeClient data={formattedSizes} />
                        </div>
                </div>
        );
};

export default SizesPage;
