import React from 'react';
import { ColorClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { Billboard } from '@prisma/client';
import { format } from 'date-fns';
import { ColorColumn } from './components/column';

const ColorPage = async ({ params }: { params: { storeId: string } }) => {
        const colors = await prismadb.color.findMany({
                where: {
                        storeId: params.storeId,
                },
                orderBy: {
                        createdAt: 'desc',
                },
        });

        const formattedColors: ColorColumn[] = colors.map((item) => ({
                ...item,
                name: item.name,
                value: item.value,
                createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        }));
        return (
                <div className="flex-col ">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                                <ColorClient data={formattedColors} />
                        </div>
                </div>
        );
};

export default ColorPage;
