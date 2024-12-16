'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';
import { ImagePlus, ImagePlusIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
        disabled?: boolean;
        onChange: (value: string) => void;
        onRemove: (value: string) => void;

        value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
        const [isMounted, setIsMounted] = useState(false);
        useEffect(() => {
                setIsMounted(true);
        });

        const onUpload = (result: any) => {
                onChange(result.info.secure_url);
        };

        if (!isMounted) return null;

        return (
                <div>
                        <div className="mb-4 flex items-center gap-4">
                                {value.map((url) => (
                                        <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                                                <div className="z-10 absolute top-2 right-2">
                                                        <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                                                <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                                <Image fill className="object-cover" alt="Image" src={url} />
                                        </div>
                                ))}
                        </div>
                        <CldUploadWidget onSuccess={onUpload} uploadPreset="suitstoreAdmin">
                                {({ open }) => {
                                        const onClick = () => {
                                                open();
                                        };
                                        return (
                                                <Button type="button" disabled={disabled} onClick={onClick} variant="secondary">
                                                        <ImagePlus className="mr-2 h-5 w-5" />
                                                        Upload an image
                                                </Button>
                                        );
                                }}
                        </CldUploadWidget>
                </div>
        );
};

export default ImageUpload;
