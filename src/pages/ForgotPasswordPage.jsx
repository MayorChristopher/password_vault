import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Key, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - SecureVault</title>
        <meta name="description" content="Reset your SecureVault master password. Secure password recovery for your encrypted vault." />
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
                <span>Reset Password</span>
              </CardTitle>
              <CardDescription>
                {sent
                  ? 'Check your email for reset instructions'
                  : 'Enter your email to receive reset instructions'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      We've sent password reset instructions to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Please check your email and follow the instructions to reset your password.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full security-gradient"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
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

export default ForgotPasswordPage;