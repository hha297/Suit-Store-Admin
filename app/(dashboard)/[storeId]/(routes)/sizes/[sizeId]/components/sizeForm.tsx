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
import { Size } from '@prisma/client';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
interface SizeFormProps {
        initialData: Size | null;
}

const formSchema = z.object({
        name: z.string().min(1),
        value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;
const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const form = useForm<SizeFormValues>({
                resolver: zodResolver(formSchema),
                defaultValues: initialData || { name: '', value: '' },
        });

        const title = initialData ? 'Edit size' : 'Create size';
        const description = initialData ? 'Edit a size' : 'Add a new size';
        const toastMessage = initialData ? 'Size updated.' : 'Size created.';
        const action = initialData ? 'Save changes' : 'Create';

        const onSubmit = async (data: SizeFormValues) => {
                try {
                        setLoading(true);
                        if (initialData) {
                                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
                        } else {
                                await axios.post(`/api/${params.storeId}/sizes`, data);
                        }
                        toast.success(toastMessage);
                        router.refresh();

                        router.push(`/${params.storeId}/sizes`);
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
                        await axios.delete(`/api/${params.storeId}/sizes/${params.sizeID}`);
                        router.refresh();
                        router.push(`/${params.storeId}/sizes`);
                        toast.success('Sizes deleted successfully');
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
                                        <div className="grid grid-cols-3 gap-8">
                                                <FormField
                                                        control={form.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Name</FormLabel>
                                                                        <FormControl>
                                                                                <Input disabled={loading} placeholder="Size name" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="value"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Value</FormLabel>
                                                                        <FormControl>
                                                                                <Input disabled={loading} placeholder="Size value" {...field} />
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

export default SizeForm;
