'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {error === 'not-admin' && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center max-w-sm">
          <p className="font-bold">Acceso Denegado</p>
          <p className="text-sm">
            Inicie sesión con una cuenta de Administrador para acceder al panel.
          </p>
        </div>
      )}
      <SignIn />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          Cargando...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
