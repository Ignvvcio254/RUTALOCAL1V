'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/lib/auth/auth.service';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const hasSession = AuthService.hasActiveSession();

      if (!hasSession) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
