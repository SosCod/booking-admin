import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = parseInt(searchParams.get('guests') || '1');
    const location = searchParams.get('location');

    const whereClause: any = {
      isAvailable: true,
      maxGuests: {
        gte: guests,
      },
    };

    if (location) {
      whereClause.hotel = {
        OR: [
          { city: { contains: location, mode: 'insensitive' } },
          { name: { contains: location, mode: 'insensitive' } },
          { address: { contains: location, mode: 'insensitive' } },
        ],
      };
    }

    // If dates are provided, exclude rooms that are already booked
    if (checkIn && checkOut) {
      whereClause.bookings = {
        none: {
          AND: [
            { checkIn: { lt: new Date(checkOut) } },
            { checkOut: { gt: new Date(checkIn) } },
            { status: { in: ['CONFIRMED', 'PENDING'] } },
          ],
        },
      };
    }

    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
            rating: true,
            totalReviews: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Rooms fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
