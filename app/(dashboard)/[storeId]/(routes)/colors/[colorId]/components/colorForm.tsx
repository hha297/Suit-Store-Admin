'use client';

import { AlertModal } from '@/components/modals/AlertModal';
import { ApiAlert } from '@/components/ui/apiAlert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useOrigin } from '@/hooks/useOrigin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
interface ColorFormProps {
        initialData: Color | null;
}

const formSchema = z.object({
        name: z.string().min(1),
        value: z.string().min(1),
});

type ColorFormValues = z.infer<typeof formSchema>;
const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const params = useParams();
        const router = useRouter();
        const origin = useOrigin();
        const form = useForm<ColorFormValues>({
                resolver: zodResolver(formSchema),
                defaultValues: initialData || { name: '', value: '' },
        });

        const title = initialData ? 'Edit color' : 'Create color';
        const description = initialData ? 'Edit a color' : 'Add a new color';
        const toastMessage = initialData ? 'Color updated.' : 'Color created.';
        const action = initialData ? 'Save changes' : 'Create';

        const onSubmit = async (data: ColorFormValues) => {
                try {
                        setLoading(true);
                        if (initialData) {
                                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
                        } else {
                                await axios.post(`/api/${params.storeId}/colors`, data);
                        }
                        toast.success(toastMessage);
                        router.refresh();

                        router.push(`/${params.storeId}/colors`);
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
                        await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
                        router.refresh();
                        router.push(`/${params.storeId}/colors`);
                        toast.success('Color deleted successfully');
                } catch (error) {
                        toast.error('Make sure you removed all products using this color first');
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
                                                                                <Input disabled={loading} placeholder="Color name" {...field} />
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
                                                                                <div className="flex items-center gap-x-4">
                                                                                        <Input disabled={loading} placeholder="Color value" {...field} />
                                                                                        <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }}></div>
                                                                                </div>
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

export default ColorForm;
