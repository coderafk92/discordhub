import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const db = getDb();
    const listings = db.prepare(`
      SELECT l.*, u.username, u.avatar_url, u.reputation
      FROM listings l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.status = 'active'
      ORDER BY l.created_at DESC
      LIMIT 50
    `).all();

    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user_id, type, offering, looking_for, price, description } = await req.json();
    const db = getDb();

    const listingId = randomUUID();
    const now = Math.floor(Date.now() / 1000);

    db.prepare(`
      INSERT INTO listings (id, user_id, type, offering, looking_for, price, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(listingId, user_id, type, offering, looking_for, price || null, description, now, now);

    return NextResponse.json({ id: listingId }, { status: 201 });
  } catch (error) {
    console.error('Listing error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
