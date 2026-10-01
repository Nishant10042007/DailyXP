import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    if (success) navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Hero badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/20 glow-purple-sm">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>DailyXP</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Welcome back
          </h1>
          <p className="text-slate-500">Level up your life, one habit at a time.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            <Button type="submit" className="w-full py-3 mt-2 text-base" isLoading={isLoading}>
              <span>Sign in</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
