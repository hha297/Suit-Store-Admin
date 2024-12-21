import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
        try {
                if (!params.productId) {
                        return new NextResponse('Product ID is required', { status: 400 });
                }
                const product = await prismadb.product.findUnique({
                        where: {
                                id: params.productId,
                        },
                        include: {
                                images: true,
                                category: true,
                                color: true,
                                size: true,
                        },
                });
                return NextResponse.json(product);
        } catch (error) {
                console.log('[product_GET]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
export async function PATCH(req: Request, { params }: { params: { productId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                const body = await req.json();
                const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!name) {
                        return new NextResponse('Name is required', { status: 400 });
                }
                if (!price) {
                        return new NextResponse('Price is required', { status: 400 });
                }
                if (!categoryId) {
                        return new NextResponse('Category id is required', { status: 400 });
                }
                if (!colorId) {
                        return new NextResponse('Color id is required', { status: 400 });
                }
                if (!sizeId) {
                        return new NextResponse('Size id is required', { status: 400 });
                }
                if (!images || !images.length) {
                        return new NextResponse('Images are required', { status: 400 });
                }
                if (!params.productId) {
                        return new NextResponse('Product id is required', { status: 400 });
                }

                await prismadb.product.update({
                        where: {
                                id: params.productId,
                                storeId: params.storeId,
                        },
                        data: {
                                name,
                                price,
                                categoryId,
                                colorId,
                                sizeId,
                                images: {
                                        deleteMany: {},
                                },
                                isArchived,
                                isFeatured,
                        },
                });

                const product = await prismadb.product.update({
                        where: {
                                id: params.productId,
                                storeId: params.storeId,
                        },
                        data: {
                                images: {
                                        createMany: {
                                                data: [...images.map((image: { url: string }) => image)],
                                        },
                                },
                        },
                });

                const storeByUserId = await prismadb.store.findFirst({
                        where: {
                                userId: userId,
                                id: params.storeId,
                        },
                });

                if (!storeByUserId) {
                        return new NextResponse('Unauthorized', { status: 403 });
                }
                return NextResponse.json(product);
        } catch (error) {
                console.log('[PRODUCT_PATCH]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function DELETE(req: Request, { params }: { params: { productId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!params.productId) {
                        return new NextResponse('Product ID is required', { status: 400 });
                }
                const product = await prismadb.product.deleteMany({
                        where: {
                                id: params.productId,
                                storeId: params.storeId,
                        },
                });
                const storeByUserId = await prismadb.store.findFirst({
                        where: {
                                userId: userId,
                                id: params.storeId,
                        },
                });

                if (!storeByUserId) {
                        return new NextResponse('Unauthorized', { status: 403 });
                }

                return NextResponse.json(product);
        } catch (error) {
                console.log('[PRODUCT_DELETE]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
