// import NextAuth from 'next-auth';
// import { authOptions } from '@/lib/auth';

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
export async function GET() {
    return Response.json({ ok: true })
}

export async function POST() {
    return Response.json({ ok: true })
}