import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { cn } from '@tradelink/ui/lib/utils';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../context/auth-context';

import { useNavigate, useSearch } from '@tanstack/react-router';
import type React from 'react';

export type RegisterFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

interface RegistrationFormProps extends React.ComponentProps<'form'> {
  onBackToLogin: () => void;
}

export function RegistrationForm({ className, onBackToLogin, ...props }: RegistrationFormProps) {
  const auth = useAuth();
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<RegisterFormData>();

  const onSubmitForm = async (data: RegisterFormData) => {
    try {
      await auth.register(data);
      if (search.redirect) {
        navigate({ to: search.redirect });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Registration error:', error.message);
        setFormError('root', { message: error.message });
      } else {
        setFormError('root', { message: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={cn('grid gap-6', className)} {...props}>
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="First Name"
            required
            {...register('firstName', {
              required: 'First name is required',
            })}
            error={errors.firstName?.message}
          />
          <FormInput
            label="Last Name"
            required
            {...register('lastName', {
              required: 'Last name is required',
            })}
            error={errors.lastName?.message}
          />
        </div>
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
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create Account
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onBackToLogin}
          className="underline underline-offset-4 hover:no-underline cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
