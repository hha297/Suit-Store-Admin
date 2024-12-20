import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
        try {
                if (!params.categoryId) {
                        return new NextResponse('Billboard id is required', { status: 400 });
                }
                const category = await prismadb.category.findUnique({
                        where: {
                                id: params.categoryId,
                        },
                });
                return NextResponse.json(category);
        } catch (error) {
                console.log('[CATEGORY_GET]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
export async function PATCH(req: Request, { params }: { params: { categoryId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                const body = await req.json();
                const { name, billboardId } = body;
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!name) {
                        return new NextResponse('Name is required', { status: 400 });
                }
                if (!billboardId) {
                        return new NextResponse('Billboard id is required', { status: 400 });
                }
                if (!params.categoryId) {
                        return new NextResponse('Category id is required', { status: 400 });
                }
                const category = await prismadb.category.updateMany({
                        where: {
                                id: params.categoryId,
                        },
                        data: {
                                name,
                                billboardId,
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
                return NextResponse.json(category);
        } catch (error) {
                console.log('[CATEGORY_PATCH]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function DELETE(req: Request, { params }: { params: { categoryId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!params.categoryId) {
                        return new NextResponse('Category id is required', { status: 400 });
                }
                const category = await prismadb.category.deleteMany({
                        where: {
                                id: params.categoryId,
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

                return NextResponse.json(category);
        } catch (error) {
                console.log('[CATEGORY_DELETE]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
