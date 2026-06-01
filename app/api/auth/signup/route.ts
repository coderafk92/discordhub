import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    // Create user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, username, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, email, passwordHash, username, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`);

    // Create session
    const sessionId = randomUUID();
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

    db.prepare('INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
      .run(sessionId, userId, sessionId, expiresAt);

    return NextResponse.json({
      id: userId,
      email,
      username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      sessionId,
    }, {
      status: 201,
      headers: {
        'Set-Cookie': `session=${sessionId}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Lax`,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
