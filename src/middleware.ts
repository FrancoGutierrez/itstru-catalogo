import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pdfkxzabspzkgbqwfcic.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_21OY2olbACqDAhcQtuMCiw_FTQcfXKD';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. Redirigir cualquier intento de acceder a la ruta vieja /admin hacia el home ('/')
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Protección estricta de la ruta privada ofuscada /panel-privado-x72
  if (pathname.startsWith('/panel-privado-x72')) {
    const isLoginPage = pathname === '/panel-privado-x72/login';

    // Si ya está logueado y visita la página de login, enviarlo directamente al panel
    if (isLoginPage && user) {
      return NextResponse.redirect(new URL('/panel-privado-x72', request.url));
    }

    // Cualquier petición al panel sin sesión activa es redirigida inmediatamente a la página de inicio ('/')
    if (!user && !isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
    '/panel-privado-x72/:path*',
    '/panel-privado-x72',
  ],
};
