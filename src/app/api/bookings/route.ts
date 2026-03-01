import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: 'No email found for user' },
        { status: 400 },
      );
    }

    // Find or create the user in the database
    let dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email,
          name: clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
            : 'Guest User',
        },
      });
    }

    const userId = dbUser.id;
    const { roomId, checkIn, checkOut, guests, specialRequests } =
      await req.json();

    // Check if room is available for the selected dates
    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        AND: [
          { checkIn: { lt: new Date(checkOut) } },
          { checkOut: { gt: new Date(checkIn) } },
          { status: { in: ['CONFIRMED', 'PENDING'] } },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Room is not available for the selected dates' },
        { status: 400 },
      );
    }

    // Get room details for price calculation
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Calculate total price (simplified calculation)
    const days = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalPrice = room.price * days;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice,
        specialRequests,
        status: 'PENDING',
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const dbUser = email
      ? await prisma.user.findUnique({ where: { email } })
      : null;

    if (!dbUser) {
      return NextResponse.json([]); // No db user means no bookings
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      include: {
        user: true,
        room: {
          include: {
            hotel: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
