'use client';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../hooks/useLoginMutation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import styles from './admin-login.module.scss';

interface LoginFormData {
  login: string;
  password: string;
}

export default function AdminLoginPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const { t } = useTranslation();

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
          toast.error(error.error || t('admin.login.loginError'));
        },
        onSuccess: (data) => {
          console.log(data);
          toast.success(t('admin.login.loginSuccess'));
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
        {t('admin.checkingAuth')}
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
          ← {t('admin.login.back')}
        </button>
          <h1 className={styles.login__title}>{t('admin.login.title')}</h1>
          <p className={styles.login__subtitle}>{t('admin.login.subtitle')}</p>

          <div className={styles.login__field}>
            <label htmlFor="login" className={styles.login__label}>{t('admin.login.loginLabel')}</label>
            <input
              id="login"
              type="text"
              {...register('login', {
                required: t('admin.login.loginRequired'),
                minLength: {
                  value: 3,
                  message: t('admin.login.loginMinLength')
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
            <label htmlFor="password" className={styles.login__label}>{t('admin.login.passwordLabel')}</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: t('admin.login.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('admin.login.passwordMinLength')
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
            {isSubmitting || loginMutation.isPending ? t('admin.login.loggingIn') : t('admin.login.signIn')}
          </button>

          {loginMutation.error && (
            <div className={styles.login__errorBox}>
              {t('admin.login.errorPrefix')} {(loginMutation.error as any)?.error || t('admin.login.loginError')}
            </div>
          )}

                <div className={styles.login__guestContainer}>
          <h2 className={styles.login__guestTitle}>{t('admin.login.guestTitle')}</h2>
          <div className={styles.login__guestInfo}>
            <div className={styles.login__guestCredentials}>
              <p className={styles.login__guestLabel}>{t('admin.login.loginLabel')}</p>
              <p className={styles.login__guestValue}>guest</p>
            </div>
            <div className={styles.login__guestCredentials}>
              <p className={styles.login__guestLabel}>{t('admin.login.passwordLabel')}</p>
              <p className={styles.login__guestValue}>guestpassword</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGuestLogin}
            className={styles.login__guestButton}
          >
            {t('admin.login.quickLogin')}
          </button>
        </div>
        </form>


      </div>

    </div>
  );
}