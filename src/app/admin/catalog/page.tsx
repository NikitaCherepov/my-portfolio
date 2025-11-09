'use client';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '@/app/hooks/useLogoutMutation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminCatalogPage() {
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Выход выполнен успешно');
        router.push('/admin');
      },
      onError: (error: any) => {
        toast.error('Ошибка при выходе');
        console.error('Logout error:', error);
      }
    });
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2>Управление каталогом</h2>
          <p>Добро пожаловать, {user?.name || user?.login}!</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: logoutMutation.isPending ? 'not-allowed' : 'pointer'
          }}
        >
          {logoutMutation.isPending ? 'Выход...' : 'Выйти'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3>Управление сайтами</h3>
          <p>Добавление, редактирование и удаление сайтов</p>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Управление сайтами
          </button>
        </div>

        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3>Управление музыкой</h3>
          <p>Добавление, редактирование и удаление музыкальных треков</p>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Управление музыкой
          </button>
        </div>

        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3>Управление жанрами</h3>
          <p>Добавление и редактирование музыкальных жанров</p>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Управление жанрами
          </button>
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <h3>Статистика</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>0</h4>
            <p>Сайтов</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#28a745', margin: '0 0 10px 0' }}>0</h4>
            <p>Музыкальных треков</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#ffc107', margin: '0 0 10px 0' }}>0</h4>
            <p>Жанров</p>
          </div>
        </div>
      </div>
    </div>
  );
}