import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { cn } from '@tradelink/ui/lib/utils';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../context/auth-context';

import { useNavigate, useSearch } from '@tanstack/react-router';
import type React from 'react';

export type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps extends React.ComponentProps<'form'> {
  onShowRegister: () => void;
}

export function LoginFormFields({ className, onShowRegister, ...props }: LoginFormProps) {
  const auth = useAuth();
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<LoginFormData>();

  const onSubmitForm = async (data: LoginFormData) => {
    try {
      await auth.login(data);
      if (search.redirect) {
        navigate({ to: search.redirect });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Login error:', error.message);
        setFormError('root', { message: error.message });
      } else {
        setFormError('root', { message: 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={cn('grid gap-6', className)} {...props}>
      <div className="grid gap-6">
        <FormInput
          label="Email"
          type="email"
          required
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.email?.message}
          placeholder="m@example.com"
        />
        <div className="space-y-2">
          <FormInput
            label="Password"
            type="password"
            required
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
          />
          <div className="flex justify-end">
            <a href="#" className="text-sm underline-offset-4 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onShowRegister}
          className="underline underline-offset-4 hover:no-underline cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
