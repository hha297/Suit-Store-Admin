import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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
                if (!params.storeId) {
                        return new NextResponse('Store id is required', { status: 400 });
                }
                const billboard = await prismadb.billboard.create({
                        data: {
                                label,
                                imageUrl,
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
                console.log('[BILLBOARDS_POST]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
        try {
                if (!params.storeId) {
                        return new NextResponse('Store id is required', { status: 400 });
                }
                const billboards = await prismadb.billboard.findMany({
                        where: {
                                storeId: params.storeId,
                        },
                });
                return NextResponse.json(billboards);
        } catch (error) {
                console.log('[BILLBOARDS_GET]', error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
