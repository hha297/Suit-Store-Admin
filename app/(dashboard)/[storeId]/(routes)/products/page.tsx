import React from 'react';
import { ProductClient } from './components/client';
import prismadb from '@/lib/prismadb';

import { format } from 'date-fns';
import { ProductColumn } from './components/column';
import { formatter } from '@/lib/utils';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
        const products = await prismadb.product.findMany({
                where: {
                        storeId: params.storeId,
                },
                include: {
                        category: true,
                        store: true,
                        color: true,
                        size: true,
                },
                orderBy: {
                        createdAt: 'desc',
                },
        });

        const formattedProducts: ProductColumn[] = products.map((item) => ({
                id: item.id,
                name: item.name,
                isFeatured: item.isFeatured,
                isArchived: item.isArchived,
                category: item.category.name,
                size: item.size.name,
                color: item.color.value,
                price: formatter.format(item.price.toNumber()),
                createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        }));
        return (
                <div className="flex-col ">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                                <ProductClient data={formattedProducts} />
                        </div>
                </div>
        );
};

export default ProductsPage;
