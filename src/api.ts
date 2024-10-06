import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

interface SignUpData {
  email: string;
  name: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

function isAxiosError(error: unknown): error is { response: { data: { message: string } } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    'data' in (error as any).response &&
    typeof (error as any).response.data.message === 'string'
  );
}

export const signUp = async (data: SignUpData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response.data.message;
    }
    throw new Error('An unknown error occurred during sign-up');
  }
};

export const signIn = async (data: SignInData) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response.data.message;
    }
    throw new Error('An unknown error occurred during sign-in');
  }
};
