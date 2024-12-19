'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SizeColumn } from './column';
import { Button } from '@/components/ui/button';
import { CopyIcon, EditIcon, MoreHorizontal, TrashIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { AlertModal } from '@/components/modals/AlertModal';

interface CellActionProps {
        data: SizeColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
        const router = useRouter();
        const params = useParams();
        const [loading, setLoading] = useState(false);
        const [open, setOpen] = useState(false);
        const onCopy = (id: string) => {
                navigator.clipboard.writeText(id);
                toast.success(' Size ID copied to the clipboard.');
        };

        const onDelete = async () => {
                try {
                        setLoading(true);
                        await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
                        window.location.reload();
                        router.push(`/${params.storeId}/sizes`);
                        toast.success('Size deleted successfully');
                } catch (error) {
                        toast.error('Make sure you removed all products using this size first');
                        console.log(error);
                } finally {
                        setLoading(false);
                        setOpen(false);
                }
        };
        return (
                <>
                        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
                        <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => onCopy(data.id)}>
                                                <CopyIcon className="mr-2 h-4 w-4" /> Copy ID
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}>
                                                <EditIcon className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                                                <TrashIcon className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                </DropdownMenuContent>
                        </DropdownMenu>
                </>
        );
};
