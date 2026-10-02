import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ShoppingBag, Lock, Mail, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex@example.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 sm:py-16">
      <div className="bg-surface-raised border border-edge-subtle rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-ink-primary">Welcome Back</h1>
          <p className="text-xs text-ink-muted">Sign in to access your saved bag and order history</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="shadow-lg shadow-brand-500/25"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        {/* Demo Account Hint */}
        <div className="p-3 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-950 space-y-1">
          <p className="font-bold">⚡ Quick Demo Credentials:</p>
          <p className="text-[11px] opacity-80">Email: <code className="font-mono">alex@example.com</code> | Pass: <code className="font-mono">password123</code></p>
        </div>

        {/* Register link */}
        <div className="text-center text-xs text-ink-secondary">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
