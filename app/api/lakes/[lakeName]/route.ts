import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { lakeName: string } }
) {
  const { lakeName } = params;

  try {
    const client = await clientPromise;
    const db = client.db("cleanlakes");
    const lake = await db.collection("lakes").findOne({ 
      name: { $regex: new RegExp(lakeName, 'i') } 
    });

    if (!lake) {
      return NextResponse.json(
        { message: 'Lake not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lake);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching lake data' },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 405 });
}

export async function POST() {
  return new NextResponse(null, { status: 405 });
}

export async function PUT() {
  return new NextResponse(null, { status: 405 });
}

export async function DELETE() {
  return new NextResponse(null, { status: 405 });
}

export async function PATCH() {
  return new NextResponse(null, { status: 405 });
}