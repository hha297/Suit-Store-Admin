'use client';

import { AlertModal } from '@/components/modals/AlertModal';
import { ApiAlert } from '@/components/ui/apiAlert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
interface SettingsFormProps {
        initialData: Store;
}

const formSchema = z.object({
        name: z.string().min(1).max(50),
});

type SettingsFormValues = z.infer<typeof formSchema>;
const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const params = useParams();
        const router = useRouter();
        const form = useForm<SettingsFormValues>({
                resolver: zodResolver(formSchema),
                defaultValues: initialData,
        });

        const onSubmit = async (data: SettingsFormValues) => {
                try {
                        setLoading(true);
                        await axios.patch(`/api/stores/${params.storeId}`, data);
                        toast.success('Store updated successfully');
                        router.refresh();
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
                        await axios.delete(`/api/stores/${params.storeId}`);
                        router.refresh();
                        router.push('/');
                        toast.success('Store deleted successfully');
                } catch (error) {
                        toast.error('Make sure you removed all products and categories first');
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
                                <Heading title="Settings" description="Manage store preferences" />
                                <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
                                        <Trash2Icon className="w-4 h-4" />
                                </Button>
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
                                                                                <Input disabled={loading} placeholder="Store name" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </div>
                                        <Button disabled={loading} className="ml-auto" type="submit">
                                                Save changes
                                        </Button>
                                </form>
                        </Form>
                        <Separator />
                        <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
                </>
        );
};

export default SettingsForm;
