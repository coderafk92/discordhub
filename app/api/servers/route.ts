import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const db = getDb();
    const servers = db.prepare(`
      SELECT s.*, u.username, u.avatar_url
      FROM servers s
      LEFT JOIN users u ON s.owner_id = u.id
      ORDER BY s.upvotes DESC
      LIMIT 50
    `).all();

    return NextResponse.json(servers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { owner_id, server_name, invite_link, category, description } = await req.json();
    const db = getDb();

    const serverId = randomUUID();
    const now = Math.floor(Date.now() / 1000);

    db.prepare(`
      INSERT INTO servers (id, owner_id, server_name, invite_link, category, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(serverId, owner_id, server_name, invite_link, category, description, now, now);

    return NextResponse.json({ id: serverId }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Failed to create server' }, { status: 500 });
  }
}
