import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("cleanlakes");
    const lake = await db.collection("lakes").findOne({ _id: new ObjectId(params.id) });

    if (!lake) {
      return NextResponse.json({ error: 'Lake not found' }, { status: 404 });
    }

    return NextResponse.json(lake);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch lake data' }, { status: 500 });
  }
}