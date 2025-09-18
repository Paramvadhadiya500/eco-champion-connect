import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Recycle } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerType, setRegisterType] = useState<'user' | 'admin'>('user');
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'admin') {
      setRegisterType('admin');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const success = await register(name, email, password, registerType);
      if (success) {
        toast({
          title: 'Account created!',
          description: 'Welcome to EcoWaste. You can now submit complaints.',
        });
        navigate(registerType === 'admin' ? '/admin' : '/');
      } else {
        toast({
          title: 'Registration failed',
          description: 'Email already exists.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Recycle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join EcoWaste</CardTitle>
          <CardDescription>
            Create your account to start making a difference
          </CardDescription>
          
          {/* Register Type Selection */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              type="button"
              variant={registerType === 'user' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRegisterType('user')}
              className="flex-1"
            >
              User Account
            </Button>
            <Button
              type="button"
              variant={registerType === 'admin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRegisterType('admin')}
              className="flex-1"
            >
              Admin Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to={`/login?type=${registerType}`} className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;