'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { columns, SizeColumn } from './column';
import { DataTable } from '@/components/ui/dataTable';
import { ApiList } from '@/components/ui/apiList';

interface SizeClientProps {
        data: SizeColumn[];
}
export const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
        const router = useRouter();
        const params = useParams();
        return (
                <>
                        <div className="flex items-center justify-between">
                                <Heading title={`Sizes (${data.length})`} description="Manage sizes for your store" />
                                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                                        <PlusIcon className="mr-2 h-5 w-5" />
                                        Add New
                                </Button>
                        </div>
                        <Separator />
                        <DataTable columns={columns} data={data} searchKey="name" />
                        <Heading title="API" description="API calls for Sizes" />
                        <Separator />
                        <ApiList entityName="sizes" entityIdName="sizeId" />
                </>
        );
};
