import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, expiresIn } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Calcular fecha de expiración
    const maxAge = expiresIn || 900; // 15 minutos por defecto
    
    // Establecer cookie desde el servidor (más confiable que document.cookie)
    response.cookies.set({
      name: 'access_token',
      value: token,
      httpOnly: false, // Necesita ser accesible desde el cliente
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set cookie' },
      { status: 500 }
    );
  }
}
