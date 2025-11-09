'use client';
import { useAuth } from '../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.includes('login') && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Проверка доступа...
      </div>
    );
  }

  if (!isAuthenticated && !pathname.includes('login')) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <header style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Админ-панель</h1>
          <nav>
            <a
              href="/admin/catalog"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)'
              }}
            >
              Каталог
            </a>
          </nav>
        </div>
        <nav>
          <a
            href="/admin/login"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: 'rgba(220,53,69,0.8)'
            }}
          >
            Выйти
          </a>
        </nav>
      </header>

      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}