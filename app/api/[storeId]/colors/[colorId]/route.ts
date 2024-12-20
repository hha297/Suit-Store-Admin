import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
        try {
                if (!params.colorId) {
                        return new NextResponse('color id is required', { status: 400 });
                }
                const color = await prismadb.color.findUnique({
                        where: {
                                id: params.colorId,
                        },
                });
                return NextResponse.json(color);
        } catch (error) {
                console.log('[color_GET]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
export async function PATCH(req: Request, { params }: { params: { colorId: string; storeId: string } }) {
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
                if (!params.colorId) {
                        return new NextResponse('color id is required', { status: 400 });
                }
                const color = await prismadb.color.updateMany({
                        where: {
                                id: params.colorId,
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
                return NextResponse.json(color);
        } catch (error) {
                console.log('[color_PATCH]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function DELETE(req: Request, { params }: { params: { colorId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!params.colorId) {
                        return new NextResponse('color id is required', { status: 400 });
                }
                const color = await prismadb.color.deleteMany({
                        where: {
                                id: params.colorId,
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

                return NextResponse.json(color);
        } catch (error) {
                console.log('[color_DELETE]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
