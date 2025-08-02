import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { OAuthButtons } from './OAuthButtons';
import { PasswordStrength } from './PasswordStrength';
import { toast } from '@/hooks/use-toast';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;



import { useNavigate } from 'react-router-dom';

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setFieldErrors({});
    setGeneralError(null);
    const result = await signup(data.email, data.password, data.username);
    if (result.error) {
      if (result.error.fieldErrors) setFieldErrors(result.error.fieldErrors);
      if (result.error.detail) {
        setGeneralError(result.error.detail);
        toast({
          title: "Signup failed",
          description: result.error.detail,
          variant: "destructive",
        });
      }
      setIsLoading(false);
      return;
    }
    toast({
      title: "Account created!",
      description: "Welcome to our platform. You've successfully signed up.",
    });
    // Role-based redirect
    if (result.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex items-center justify-center"
    >
      <Card className="max-w-md backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <h2 className="text-2xl font-semibold text-center">Create Account</h2>
          <p className="text-sm text-muted-foreground text-center">
            Sign up to get started with your account
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <OAuthButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="pl-10"
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
              {fieldErrors.username && (
                <p className="text-sm text-destructive">{fieldErrors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" size={20} onClick={() => setShowPassword(false)} />
                  ) : (
                    <FiEye className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" size={20} onClick={() => setShowPassword(true)} />
                  )}
                </Button>
              </div>
              {password && <PasswordStrength password={password} />}
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  {...register('confirmPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" size={20} onClick={() => setShowConfirmPassword(false)} />
                  ) : (
                    <FiEye className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" size={20} onClick={() => setShowConfirmPassword(true)} />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {generalError && (
              <div className="text-sm text-destructive text-center pb-2">{generalError}</div>
            )}
            <Button type="submit" className="w-full flex items-center justify-center" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto font-semibold" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};