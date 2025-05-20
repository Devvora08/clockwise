import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers';

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error('Error: please add clerk signing secret from clerk dashboard');
    }

    const wh = new Webhook(SIGNING_SECRET);

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_signature || !svix_timestamp) {
        return new Response('Error : missing svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id!,
            'svix-timestamp': svix_timestamp!,
            'svix-signature': svix_signature!,
        }) as WebhookEvent;

        //console.log('Webhook event received:', evt);
    } catch (error) {
        console.error('Error: could not verify webhook:', error)
        return new Response('Error: verification error : ', { status: 400 })
    }


    const eventType = evt.type;



    if (eventType === 'user.created') {
        const { data } = evt;
        const email = data.email_addresses?.[0]?.email_address ?? '';
        const name =
            data.first_name && data.last_name
                ? `${data.first_name} ${data.last_name}`
                : data.username ?? null;
        const imageUrl = data.image_url ?? '';

        await prisma.user.upsert({
            where: { id: data.id },
            update: {},
            create: {
                id: data.id,
                email,
                name,
                imageUrl,
            },
        });

        return NextResponse.json({ status: 'User created (or already exists)' }, { status: 200 });
    }

    if (eventType === 'user.updated') {
        const { data } = evt;
        const email = data.email_addresses?.[0]?.email_address ?? '';
        const name =
            data.first_name && data.last_name
                ? `${data.first_name} ${data.last_name}`
                : data.username ?? null;
        const imageUrl = data.image_url ?? '';

        await prisma.user.update({
            where: { id: data.id },
            data: {
                email,
                name,
                imageUrl,
            },
        });

        return NextResponse.json({ status: 'User updated' }, { status: 200 });
    }

    if (eventType === 'user.deleted') {
        const { data } = evt;
        await prisma.user.delete({
            where: { id: data.id },
        });

        return NextResponse.json({ status: 'User deleted' }, { status: 200 });
    }
    return new Response('Webhook recieved', { status: 200 })
}
