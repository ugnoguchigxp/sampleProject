import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/bbs/api';
import { useAuth } from '../../contexts/AuthContext';
import { FiUserPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerSchema = z.object({
    email: z.string()
      .min(1, t('emailRequired'))
      .email(t('invalidEmail')),
    username: z.string()
      .min(3, t('usernameMinLength'))
      .max(20, t('usernameMaxLength')),
    password: z.string()
      .min(6, t('passwordMinLength')),
    confirmPassword: z.string()
      .min(1, t('confirmPasswordRequired'))
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('passwordsDoNotMatch'),
    path: ['confirmPassword']
  });

  type RegisterForm = z.infer<typeof registerSchema>;
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      login(response.data.token, response.data.user);
      navigate('/bbs/list');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error.response?.data?.error || error.message);
    },
  });

  const onSubmit = (data: RegisterForm): void => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div id="register-screen" className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('createAccount')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <input
                id="email"
                {...register('email')}
                type="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {t('username')}
              </label>
              <input
                id="username"
                {...register('username')}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('usernamePlaceholder')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <input
                id="password"
                {...register('password')}
                type="password"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('passwordPlaceholder')}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                {...register('confirmPassword')}
                type="password"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('confirmPasswordPlaceholder')}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {registerMutation.error && (
            <div className="text-red-600 text-sm text-center">
              {(registerMutation.error as any)?.response?.data?.error || t('registrationFailed')}
            </div>
          )}

          <div>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 items-center gap-2"
              disabled={registerMutation.status === 'pending'}
              type="submit"
            >
              <FiUserPlus className="inline-block" />
              {registerMutation.status === 'pending' ? t('creatingAccount') : t('createAccount')}
            </Button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                {t('signInHere')}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;