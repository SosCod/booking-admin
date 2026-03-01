export type Booking = {
  id: number;
  userId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentId?: string | null;
  specialRequests?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    email: string;
    name: string;
  };
  room?: {
    id: number;
    name: string;
    hotel?: {
      id: number;
      name: string;
    };
  };
};
