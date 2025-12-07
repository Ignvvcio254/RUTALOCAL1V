import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Rutas de autenticación (si ya está autenticado, redirige al dashboard)
const authRoutes = ['/login', '/register'];

// Modo desarrollo - deshabilitar middleware de autenticación
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // En modo desarrollo, permitir acceso a todas las rutas sin validación
  if (DEV_MODE) {
    console.log('🔧 [Middleware] DEV_MODE activo - Sin validación de auth');
    return NextResponse.next();
  }

  // Obtener token de las cookies
  const token = request.cookies.get('access_token')?.value;

  // También verificar en headers para soporte de localStorage
  const authHeader = request.headers.get('authorization');
  const hasToken = token || authHeader?.startsWith('Bearer ');

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Si no hay token y la ruta no es pública → Login
  if (!hasToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token y está en ruta de auth → Dashboard
  if (hasToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirigir raíz a login si no autenticado
  if (pathname === '/' && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigir raíz a dashboard si autenticado
  if (pathname === '/' && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/map-interactive/:path*',
    '/builder/:path*',
    '/login',
    '/register',
  ],
};
