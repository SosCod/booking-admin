import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/admin/bookings/(.*)/invoice',
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = new URL(request.url);

  // Protect all non-public routes (requires sign-in)
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // NOTE: Admin role authorization is handled by src/app/admin/layout.tsx
  // which checks user.publicMetadata.role directly from the Clerk user object.
  // This is more reliable than checking sessionClaims in middleware.
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|pdf|mp3|wav|flac|ogg)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
