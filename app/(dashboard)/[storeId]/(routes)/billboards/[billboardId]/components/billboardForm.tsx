'use client';

import { AlertModal } from '@/components/modals/AlertModal';
import { ApiAlert } from '@/components/ui/apiAlert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/imageUpload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useOrigin } from '@/hooks/useOrigin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Store } from '@prisma/client';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
interface BillBoardFormProps {
        initialData: Billboard | null;
}

const formSchema = z.object({
        label: z.string().min(1),
        imageUrl: z.string().min(1),
});

type BillBoardFormValues = z.infer<typeof formSchema>;
const BillBoardForm: React.FC<BillBoardFormProps> = ({ initialData }) => {
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const form = useForm<BillBoardFormValues>({
                resolver: zodResolver(formSchema),
                defaultValues: initialData || { label: '', imageUrl: '' },
        });

        const title = initialData ? 'Edit billboard' : 'Create billboard';
        const description = initialData ? 'Edit a billboard' : 'Add a new billboard';
        const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
        const action = initialData ? 'Save changes' : 'Create';

        const onSubmit = async (data: BillBoardFormValues) => {
                try {
                        setLoading(true);
                        if (initialData) {
                                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
                        } else {
                                await axios.post(`/api/${params.storeId}/billboards`, data);
                        }
                        toast.success(toastMessage);
                        router.refresh();

                        router.push(`/${params.storeId}/billboards`);
                } catch (error) {
                        toast.error('Something went wrong');
                        console.log(error);
                } finally {
                        setLoading(false);
                }
        };

        const onDelete = async () => {
                try {
                        setLoading(true);
                        await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
                        router.refresh();
                        router.push(`/${params.storeId}/billboards`);
                        toast.success('Billboard deleted successfully');
                } catch (error) {
                        toast.error('Make sure you removed all categories using this billboard first');
                        console.log(error);
                } finally {
                        setLoading(false);
                        setOpen(false);
                }
        };
        return (
                <>
                        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
                        <div className="flex items-center justify-between">
                                <Heading title={title} description={description} />
                                {initialData && (
                                        <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
                                                <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                )}
                        </div>
                        <Separator />
                        <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                                        <FormField
                                                control={form.control}
                                                name="imageUrl"
                                                render={({ field }) => (
                                                        <FormItem>
                                                                <FormLabel>Background Image</FormLabel>
                                                                <FormControl>
                                                                        <ImageUpload
                                                                                value={field.value ? [field.value] : []}
                                                                                disabled={loading}
                                                                                onChange={(url) => field.onChange(url)}
                                                                                onRemove={() => field.onChange('')}
                                                                        />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}
                                        />
                                        <div className="grid grid-cols-3 gap-8">
                                                <FormField
                                                        control={form.control}
                                                        name="label"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Label</FormLabel>
                                                                        <FormControl>
                                                                                <Input disabled={loading} placeholder="Billboard label" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </div>
                                        <Button disabled={loading} className="ml-auto" type="submit">
                                                {action}
                                        </Button>
                                </form>
                        </Form>
                        <Separator />
                        <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
                </>
        );
};

export default BillBoardForm;
