'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { columns, ProductColumn } from './column';
import { DataTable } from '@/components/ui/dataTable';
import { ApiList } from '@/components/ui/apiList';

interface ProductClientProps {
        data: ProductColumn[];
}
export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
        const router = useRouter();
        const params = useParams();
        return (
                <>
                        <div className="flex items-center justify-between">
                                <Heading title={`Products (${data.length})`} description="Manage products for your store" />
                                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                                        <PlusIcon className="mr-2 h-5 w-5" />
                                        Add New
                                </Button>
                        </div>
                        <Separator />
                        <DataTable columns={columns} data={data} searchKey="name" />
                        <Heading title="API" description="API calls for Products" />
                        <Separator />
                        <ApiList entityName="products" entityIdName="productId" />
                </>
        );
};
