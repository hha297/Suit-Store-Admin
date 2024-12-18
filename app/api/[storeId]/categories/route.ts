import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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
                if (!params.storeId) {
                        return new NextResponse('Store id is required', { status: 400 });
                }
                const category = await prismadb.category.create({
                        data: {
                                name,
                                billboardId,
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
                return NextResponse.json(category);
        } catch (error) {
                console.error(error);
                return new NextResponse('Internal error', { status: 500 });
        }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
        try {
                if (!params.storeId) {
                        return new NextResponse('Store id is required', { status: 400 });
                }
                const categories = await prismadb.category.findMany({
                        where: {
                                storeId: params.storeId,
                        },
                });
                return NextResponse.json(categories);
        } catch (error) {
                console.error(error);
                return new NextResponse('Internal error', { status: 500 });
        }
}
