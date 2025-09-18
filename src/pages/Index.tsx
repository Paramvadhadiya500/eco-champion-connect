import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
    // If user exists and is not admin, Dashboard component will render
  }, [user, navigate]);

  // This will be handled by the routing in App.tsx
  return null;
};

export default Index;
