'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { BillboardColumn, columns } from './column';
import { DataTable } from '@/components/ui/dataTable';
import { ApiList } from '@/components/ui/apiList';

interface BillboardClientProps {
        data: BillboardColumn[];
}
export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
        const router = useRouter();
        const params = useParams();
        return (
                <>
                        <div className="flex items-center justify-between">
                                <Heading title={`Billboards (${data.length})`} description="Manage billboards for your store" />
                                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                                        <PlusIcon className="mr-2 h-5 w-5" />
                                        Add New
                                </Button>
                        </div>
                        <Separator />
                        <DataTable columns={columns} data={data} searchKey="label" />
                        <Heading title="API" description="API calls for Billboards" />
                        <Separator />
                        <ApiList entityName="billboards" entityIdName="billboardId" />
                </>
        );
};
