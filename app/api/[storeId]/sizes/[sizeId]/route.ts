import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
        try {
                if (!params.sizeId) {
                        return new NextResponse('size id is required', { status: 400 });
                }
                const size = await prismadb.size.findUnique({
                        where: {
                                id: params.sizeId,
                        },
                });
                return NextResponse.json(size);
        } catch (error) {
                console.log('[size_GET]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
export async function PATCH(req: Request, { params }: { params: { sizeId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                const body = await req.json();
                const { name, value } = body;
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!name) {
                        return new NextResponse('Name is required', { status: 400 });
                }
                if (!value) {
                        return new NextResponse('Value is required', { status: 400 });
                }
                if (!params.sizeId) {
                        return new NextResponse('size id is required', { status: 400 });
                }
                const size = await prismadb.size.updateMany({
                        where: {
                                id: params.sizeId,
                        },
                        data: {
                                name,
                                value,
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
                return NextResponse.json(size);
        } catch (error) {
                console.log('[size_PATCH]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function DELETE(req: Request, { params }: { params: { sizeId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!params.sizeId) {
                        return new NextResponse('size id is required', { status: 400 });
                }
                const size = await prismadb.size.deleteMany({
                        where: {
                                id: params.sizeId,
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

                return NextResponse.json(size);
        } catch (error) {
                console.log('[size_DELETE]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
