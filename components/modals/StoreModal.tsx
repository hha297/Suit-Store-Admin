'use client';

import { useStoreModal } from '@/hooks/useStoreModal';
import { Modal } from '../ui/modal';

export const StoreModal = () => {
        const storeModal = useStoreModal();
        return (
                <Modal title="Store Modal" description="Add a new store to manage products and categories" isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
                        Create Store Form
                </Modal>
        );
};
