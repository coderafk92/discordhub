import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Logged out' },
    {
      status: 200,
      headers: {
        'Set-Cookie': 'session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
      },
    }
  );
}
