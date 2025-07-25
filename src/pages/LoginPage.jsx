import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Key, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login - SecureVault</title>
        <meta name="description" content="Secure login to your password vault. Access your encrypted credentials with enterprise-grade security." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SecureVault</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Professional Password Management
            </p>
          </div>

          <Card className="vault-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Secure Login</span>
              </CardTitle>
              <CardDescription>
                Access your encrypted password vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="password">Master Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your master password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full security-gradient"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
                
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="encrypted-indicator w-2 h-2 rounded-full"></div>
              <span>256-bit AES Encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LoginPage;