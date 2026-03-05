import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.KRAK_API_URL ?? process.env.NEXT_PUBLIC_KRAK_API_URL;

export async function middleware(request: NextRequest) {
    // Forward auth cookies to the API to verify the session
    const cookie = request.headers.get('cookie') ?? '';

    try {
        const response = await fetch(`${apiUrl}/api/auth/get-session`, {
            headers: { cookie },
        });

        if (!response.ok) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const session = await response.json();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
