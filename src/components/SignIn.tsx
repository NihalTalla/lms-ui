import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Code2, Mail, Lock, ArrowRight, Sparkles, Zap, BookOpen, Trophy, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SignIn() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      toast.success('Successfully logged in!');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - 2/3 Orange Interactive Section */}
      <div 
        className="hidden lg:flex lg:w-2/3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%)',
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Circles */}
          <div 
            className="absolute w-96 h-96 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent)',
              top: '10%',
              left: '10%',
              transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          <div 
            className="absolute w-64 h-64 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)',
              bottom: '20%',
              right: '15%',
              transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          
          {/* Geometric Shapes */}
          <div 
            className="absolute w-48 h-48 opacity-10"
            style={{
              top: '15%',
              right: '20%',
              background: 'rgba(255,255,255,0.2)',
              transform: `rotate(${mousePosition.x * 45}deg)`,
              transition: 'transform 0.5s ease-out',
              borderRadius: '20px',
            }}
          />
          <div 
            className="absolute w-32 h-32 opacity-10"
            style={{
              bottom: '30%',
              left: '25%',
              background: 'rgba(255,255,255,0.2)',
              transform: `rotate(${mousePosition.y * -45}deg)`,
              transition: 'transform 0.5s ease-out',
              borderRadius: '16px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 text-white">
          {/* Logo and Title */}
          <div className="mb-12 text-center">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transform: `scale(${1 + mousePosition.y * 0.1})`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              <Code2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl mb-4" style={{ fontWeight: 800 }}>
              Codify LMS
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Master Coding Through Practice
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              An advanced learning management system designed for aspiring developers. 
              Learn, practice, and excel in data structures, algorithms, and software development.
            </p>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-12">
            <div 
              className="p-6 rounded-2xl backdrop-blur-sm cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transform: `translateY(${mousePosition.y * -10}px)`,
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">Interactive Courses</h3>
              <p className="text-white/80 text-sm">
                Hands-on coding courses with real-world projects
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl backdrop-blur-sm cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transform: `translateY(${mousePosition.y * -15}px)`,
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">Live Code Editor</h3>
              <p className="text-white/80 text-sm">
                VS Code-like editor with instant feedback
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl backdrop-blur-sm cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transform: `translateY(${mousePosition.y * -20}px)`,
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">Gamification</h3>
              <p className="text-white/80 text-sm">
                Earn points, badges, and climb the leaderboard
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-16">
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ fontWeight: 700 }}>500+</div>
              <div className="text-white/80">Coding Problems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ fontWeight: 700 }}>10K+</div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ fontWeight: 700 }}>95%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Sparkle Effects */}
        <Sparkles 
          className="absolute w-8 h-8 text-white/30 animate-pulse"
          style={{
            top: '20%',
            left: '15%',
            animationDelay: '0s',
          }}
        />
        <Sparkles 
          className="absolute w-6 h-6 text-white/30 animate-pulse"
          style={{
            top: '60%',
            right: '25%',
            animationDelay: '1s',
          }}
        />
        <Sparkles 
          className="absolute w-7 h-7 text-white/30 animate-pulse"
          style={{
            bottom: '25%',
            left: '30%',
            animationDelay: '0.5s',
          }}
        />
      </div>

      {/* Right Side - 1/3 Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo (shown only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)' }}>
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl" style={{ color: '#FF6B35' }}>Codify LMS</h2>
          </div>

          {/* Login Header */}
          <div className="mb-8">
            <h2 className="text-3xl text-neutral-900 mb-2">Welcome Back</h2>
            <p className="text-neutral-600">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin01@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 border-2 border-neutral-200 focus:border-orange-500 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 border-2 border-neutral-200 focus:border-orange-500 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="hover:underline transition-colors" style={{ color: '#FF6B35' }}>
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-white rounded-xl relative overflow-hidden group transition-all"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </span>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <p className="text-xs mb-3" style={{ color: '#FF6B35', fontWeight: 600 }}>
              DEMO CREDENTIALS
            </p>
            <div className="space-y-2 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
                <span><span className="font-medium">Admin:</span> admin01@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#14B8A6' }} />
                <span><span className="font-medium">Faculty:</span> faculty01@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#14B8A6' }} />
                <span><span className="font-medium">Trainer:</span> trainer01@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <span><span className="font-medium">Student:</span> student01@gmail.com</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2 italic">
                Password can be anything in demo mode
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Don't have an account?{' '}
            <a href="#" className="hover:underline transition-colors" style={{ color: '#FF6B35' }}>
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
