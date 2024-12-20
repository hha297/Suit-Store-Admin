'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ColorColumn, columns } from './column';
import { DataTable } from '@/components/ui/dataTable';
import { ApiList } from '@/components/ui/apiList';

interface ColorClientProps {
        data: ColorColumn[];
}
export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
        const router = useRouter();
        const params = useParams();
        return (
                <>
                        <div className="flex items-center justify-between">
                                <Heading title={`Colors (${data.length})`} description="Manage colors for your store" />
                                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                                        <PlusIcon className="mr-2 h-5 w-5" />
                                        Add New
                                </Button>
                        </div>
                        <Separator />
                        <DataTable columns={columns} data={data} searchKey="name" />
                        <Heading title="API" description="API calls for Colors" />
                        <Separator />
                        <ApiList entityName="colors" entityIdName="ColorId" />
                </>
        );
};
