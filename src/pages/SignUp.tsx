import React, { useState } from 'react';
import { TextField, Button, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; name?: string; password?: string; confirmPassword?: string }>({});
  const navigate = useNavigate();
  const { login } = useAuth()


  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    return minLength && hasLetter && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    // Validate inputs
    const newErrors: { email?: string; name?: string; password?: string; confirmPassword?: string } = {};
    if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!name) newErrors.name = 'Name is required';
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long, contain a letter, a number, and a special character.';
    }
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    // If there are validation errors, set the errors state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    }

    try {
      const data = await signUp({ email:email.toLowerCase(), name, password }); // Call the signUp API
      login(data.accessToken) // Store JWT
      navigate('/welcome'); // Redirect on successful sign-up
    } catch (err: unknown) {
        debugger
      if (typeof err === 'string') {
        setErrors({ email: err });
      } else if (err instanceof Error) {
        setErrors({ email: err.message });
      } else {
        setErrors({ email: 'An unknown error occurred' });
      }
    }
  };

  const handleSwitchToSignIn = () => {
    navigate('/signin'); // Navigate to SignIn page
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
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
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Sign Up
        </Button>
        <Button variant="text" onClick={handleSwitchToSignIn} fullWidth>
          Already have an account? Sign In
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
