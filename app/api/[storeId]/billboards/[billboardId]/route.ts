import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
        try {
                if (!params.billboardId) {
                        return new NextResponse('Billboard id is required', { status: 400 });
                }
                const billboard = await prismadb.billboard.findUnique({
                        where: {
                                id: params.billboardId,
                        },
                });
                return NextResponse.json(billboard);
        } catch (error) {
                console.log('[BILLBOARD_GET]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
export async function PATCH(req: Request, { params }: { params: { billboardId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                const body = await req.json();
                const { label, imageUrl } = body;
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!label) {
                        return new NextResponse('Label is required', { status: 400 });
                }
                if (!imageUrl) {
                        return new NextResponse('Image URL is required', { status: 400 });
                }
                if (!params.billboardId) {
                        return new NextResponse('Billboard id is required', { status: 400 });
                }
                const billboard = await prismadb.billboard.updateMany({
                        where: {
                                id: params.billboardId,
                                storeId: params.storeId,
                        },
                        data: {
                                label,
                                imageUrl,
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
                return NextResponse.json(billboard);
        } catch (error) {
                console.log('[BILLBOARD_PATCH]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function DELETE(req: Request, { params }: { params: { billboardId: string; storeId: string } }) {
        try {
                const { userId } = await auth();
                if (!userId) {
                        return new NextResponse('Unauthorized', { status: 401 });
                }
                if (!params.billboardId) {
                        return new NextResponse('Billboard id is required', { status: 400 });
                }
                const billboard = await prismadb.billboard.deleteMany({
                        where: {
                                id: params.billboardId,
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

                return NextResponse.json(billboard);
        } catch (error) {
                console.log('[BILLBOARD_DELETE]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
