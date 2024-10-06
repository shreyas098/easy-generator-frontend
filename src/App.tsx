import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/welcome" replace /> : <SignUp />
        } />
        <Route path="/signin" element={
          isAuthenticated ? <Navigate to="/welcome" replace /> : <SignIn />
        } />
        <Route path="/welcome" element={<ProtectedRoute element={<Welcome />} />} />
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/welcome" : "/signup"} replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;