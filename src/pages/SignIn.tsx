import React, { useState } from 'react';
import { TextField, Button, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../api';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const data = await signIn({ email:email.toLowerCase(), password });
      login(data.accessToken) // Store JWT
      navigate('/welcome'); // Redirect on successful sign-in
    } catch (err: unknown) {
      console.error('Sign-in error:', err); // Log the error for debugging
      if (typeof err === 'string') {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message );
      } else {
        setError( 'An unknown error occurred');
      }
    }
  };

  const handleSwitchToSignUp = () => {
    navigate('/signup'); // Navigate to SignUp page
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Sign In
        </Button>
        <Button variant="text" onClick={handleSwitchToSignUp} fullWidth>
          Don't have an account? Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignIn;
