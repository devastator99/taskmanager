import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Link,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ m: 1, bgcolor: 'secondary.main', p: 2, borderRadius: '50%' }}>
            <LockOutlined sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Task Manager
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleFormSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Use "testuser" with password "testpassword" for testing'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Or create a new user in the Django admin'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
