'use client';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../hooks/useLoginMutation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import styles from './admin-login.module.scss';

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
    setValue,
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

  const handleGuestLogin = () => {
    setValue('login', 'guest');
    setValue('password', 'guestpassword');
  };

  if (isAuthenticated && user) {
    router.push('/admin/catalog');
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.login__loading}>
        Проверка аутентификации...
      </div>
    );
  }

  return (
    <div className={styles.login}>
      <div className={styles.login__formWrapper}>
        <form onSubmit={handleSubmit(handleLogin)} className={styles.login__form}>
          
                  <button
          type="button"
          onClick={() => router.push('/')}
          className={styles.login__backButton}
        >
          ← Назад к сайтам
        </button>
          <h1 className={styles.login__title}>Админ-панель</h1>
          <p className={styles.login__subtitle}>Войдите для доступа к управлению</p>

          <div className={styles.login__field}>
            <label htmlFor="login" className={styles.login__label}>Логин:</label>
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
              className={`${styles.login__input} ${errors.login ? styles.login__input_error : ''}`}
            />
            {errors.login && (
              <p className={styles.login__error}>
                {errors.login.message}
              </p>
            )}
          </div>

          <div className={styles.login__field}>
            <label htmlFor="password" className={styles.login__label}>Пароль:</label>
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
              className={`${styles.login__input} ${errors.password ? styles.login__input_error : ''}`}
            />
            {errors.password && (
              <p className={styles.login__error}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
            className={styles.login__button}
          >
            {isSubmitting || loginMutation.isPending ? 'Вход...' : 'Войти'}
          </button>

          {loginMutation.error && (
            <div className={styles.login__errorBox}>
              Ошибка: {(loginMutation.error as any)?.error || 'Ошибка входа'}
            </div>
          )}

                <div className={styles.login__guestContainer}>
          <h2 className={styles.login__guestTitle}>Гостевые параметры</h2>
          <div className={styles.login__guestInfo}>
            <div className={styles.login__guestCredentials}>
              <p className={styles.login__guestLabel}>Логин:</p>
              <p className={styles.login__guestValue}>guest</p>
            </div>
            <div className={styles.login__guestCredentials}>
              <p className={styles.login__guestLabel}>Пароль:</p>
              <p className={styles.login__guestValue}>guestpassword</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGuestLogin}
            className={styles.login__guestButton}
          >
            Быстрый вход
          </button>
        </div>
        </form>


      </div>

    </div>
  );
}