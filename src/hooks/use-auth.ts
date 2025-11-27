
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    const isLoginPage = pathname === '/admin/login';

    if (!sessionCookie && !isLoginPage) {
      router.replace('/admin/login');
    } else if (sessionCookie && isLoginPage) {
      router.replace('/admin/courses');
    }
  }, [pathname, router]);
}
