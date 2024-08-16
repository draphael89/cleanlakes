import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cleanlakes");
    const lakes = await db.collection("lakes").find({}).limit(10).toArray();
    return NextResponse.json(lakes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch lakes' }, { status: 500 });
  }
}