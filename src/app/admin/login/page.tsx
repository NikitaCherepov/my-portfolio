'use client';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../hooks/useLoginMutation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  login: string;
  password: string;
}

export default function AdminLoginPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>();

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(
      { login: data.login, password: data.password },
      {
        onError: (error: any) => {
          console.error(error);
          toast.error(error.error || 'Ошибка входа');
        },
        onSuccess: (data) => {
          console.log(data);
          toast.success('Успешный вход');
          router.push('/admin/catalog');
        }
      }
    );
  };

  if (isAuthenticated && user) {
    router.push('/admin/catalog');
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Проверка аутентификации...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h1>Админ-панель</h1>
      <p>Войдите для доступа к управлению</p>

      <form onSubmit={handleSubmit(handleLogin)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="login">Логин:</label>
          <input
            id="login"
            type="text"
            {...register('login', {
              required: 'Логин обязателен',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа'
              }
            })}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.login ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.login && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.login.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 6,
                message: 'Минимум 6 символов'
              }
            })}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.password ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.password && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loginMutation.isPending}
          style={{
            padding: '10px 20px',
            backgroundColor: isSubmitting || loginMutation.isPending ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting || loginMutation.isPending ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting || loginMutation.isPending ? 'Вход...' : 'Войти'}
        </button>
      </form>

      {loginMutation.error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          Ошибка: {(loginMutation.error as any)?.error || 'Ошибка входа'}
        </div>
      )}
    </div>
  );
}