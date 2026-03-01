'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      if (user?.publicMetadata?.role !== 'admin') {
        // No es admin: Cerrar sesión en esta app y redirigir
        signOut().then(() => {
          router.push('/sign-in?error=not-admin');
        });
      } else {
        // Es admin: Permitir ver el contenido
        setIsAuthorized(true);
      }
    }
  }, [isLoaded, isSignedIn, user, signOut, router]);

  if (!isLoaded || (!isAuthorized && isSignedIn)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
