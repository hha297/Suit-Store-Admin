'use client';

import { useForm } from 'react-hook-form';
import { useStoreModal } from '@/hooks/useStoreModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/modal';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const formSchema = z.object({
        name: z.string().min(1, 'Name is required'),
});
export const StoreModal = () => {
        const storeModal = useStoreModal();
        const [loading, setLoading] = useState(false);
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        name: '',
                },
        });

        const onSubmit = async (values: z.infer<typeof formSchema>) => {
                try {
                        setLoading(true);
                        const response = await axios.post('/api/stores', values);
                        window.location.assign(`/${response.data.id}`);
                        toast.success('Store created successfully');
                } catch (error) {
                        toast.error('Something went wrong');
                } finally {
                        setLoading(false);
                }
        };
        return (
                <Modal title="Create store" description="Add a new store to manage products and categories" isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
                        <div>
                                <div className="space-y-4 py-2 pb-4">
                                        <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                                        <FormField
                                                                control={form.control}
                                                                name="name"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Name</FormLabel>
                                                                                <FormControl>
                                                                                        <Input disabled={loading} placeholder="E-Commerce" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                                                <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                                                                        Cancel
                                                                </Button>
                                                                <Button disabled={loading} type="submit">
                                                                        Continue
                                                                </Button>
                                                        </div>
                                                </form>
                                        </Form>
                                </div>
                        </div>
                </Modal>
        );
};
