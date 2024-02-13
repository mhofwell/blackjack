import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        // validate email and password
        console.log(email, password);

        const hashedPw = await hash(password, 10);

        const response = NextResponse.json({ status: 200 });

        return response;

        // zod is a good validator package
    } catch (e) {
        console.log('Error', { e });

        const response = NextResponse.json({ status: 400 });

        return response;
    }
}