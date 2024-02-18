import { login } from '@/lib/auth/utils';
import prisma from '@/lib/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validator/authSchema';
import vine, { errors } from '@vinejs/vine';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const inputValidator = vine.compile(registerSchema);
        const output = await inputValidator.validate(data);

        console.log('Validated Form');

        // login

        // redirect

        return NextResponse.json(output, { status: 200 });
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json(error.messages, { status: 400 });
        }
        return NextResponse.json(error);
    }
}
