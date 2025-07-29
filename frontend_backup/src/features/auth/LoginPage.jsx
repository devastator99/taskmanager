import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Lock } from 'lucide-react';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      // Determine the correct API URL
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      console.log('API URL from env:', process.env.REACT_APP_API_URL);
      console.log('Using apiUrl:', apiUrl);

      // Construct the full URL, ensuring we don't have double slashes
      const fullUrl = apiUrl.endsWith('/auth/token/')
        ? apiUrl
        : `${apiUrl.replace(/\/$/, '')}/auth/token/`;
      console.log('Full fetch URL:', fullUrl);

      // Make the API request
      const resp = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Response status:', resp.status);

      if (!resp.ok) {
        const errorText = await resp.text();
        console.log('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: errorText || 'Invalid username or password' };
        }
        setError(errorData.detail || 'Invalid username or password');
        return;
      }

      const tokens = await resp.json();
      console.log('Login successful, tokens received:', tokens);

      // Extract user info from token payload (basic implementation)
      let user = null;
      try {
        const payload = JSON.parse(atob(tokens.access.split('.')[1]));
        user = {
          id: payload.user_id,
          username: payload.username || data.username,
        };
      } catch (e) {
        console.warn('Could not parse user info from token:', e);
        user = { username: data.username };
      }

      dispatch(setCredentials({ ...tokens, user }));
      navigate('/tasks');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleFormSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Use &lsquo;testuser&rsquo; with password &lsquo;testpassword&rsquo; for testing
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            &lsquo;Or create a new user in the Django admin&rsquo;
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
