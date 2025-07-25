import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  Shield,
  Key,
  Activity,
  Plus,
  Eye,
  AlertTriangle,
  TrendingUp,
  Lock,
  User,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCredentials: 0,
    weakPasswords: 0,
    recentActivity: 0,
    securityScore: 85,
    lastLogin: null,
    lastPasswordChange: null
  });

  useEffect(() => {
    // Load stats from localStorage
    const credentials = JSON.parse(localStorage.getItem('vault_credentials') || '[]');
    const activities = JSON.parse(localStorage.getItem('vault_activities') || '[]');

    const weakPasswords = credentials.filter(cred =>
      cred.password && cred.password.length < 8
    ).length;

    const recentActivity = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return activityDate > dayAgo;
    }).length;

    // Find last login and last password change
    const lastLogin = activities.find(a => a.action.toLowerCase().includes('login'));
    const lastPasswordChange = activities.find(a => a.action.toLowerCase().includes('update credential'));

    setStats({
      totalCredentials: credentials.length,
      weakPasswords,
      recentActivity,
      securityScore: Math.max(50, 100 - (weakPasswords * 10)),
      lastLogin: lastLogin ? lastLogin.timestamp : null,
      lastPasswordChange: lastPasswordChange ? lastPasswordChange.timestamp : null
    });
  }, []);

  const quickActions = [
    {
      title: 'Add Credential',
      description: 'Store a new password',
      icon: Plus,
      action: () => window.location.href = '/vault'
    },
    {
      title: 'Generate Password',
      description: 'Create a secure password',
      icon: Key,
      action: () => window.location.href = '/generator'
    },
    {
      title: 'Security Audit',
      description: 'Check password strength',
      icon: Shield,
      action: () => window.location.href = '/security'
    },
    {
      title: 'View Activity',
      description: 'Recent account activity',
      icon: Activity,
      action: () => window.location.href = '/activity'
    }
  ];

  function formatDate(dateStr) {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - SecureVault</title>
        <meta name="description" content="SecureVault dashboard - Monitor your password security, manage credentials, and track account activity." />
      </Helmet>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Your security overview and quick actions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="encrypted-indicator w-2 h-2 rounded-full"></div>
            <span>Vault Encrypted</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="vault-card">
            <CardContent className="p-6 flex items-center gap-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">Last Login</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(stats.lastLogin)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="vault-card">
            <CardContent className="p-6 flex items-center gap-4">
              <Key className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-slate-500">Last Password Change</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(stats.lastPasswordChange)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Security Score</span>
              </CardTitle>
              <CardDescription>
                Overall security health of your vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Security Rating</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.securityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.securityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {stats.securityScore >= 80 ? 'Excellent security posture' :
                      stats.securityScore >= 60 ? 'Good security, room for improvement' :
                        'Security needs attention'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="vault-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total Credentials
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.totalCredentials}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="vault-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Weak Passwords
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.weakPasswords}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="vault-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Recent Activity
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.recentActivity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>


        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="vault-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and security operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={action.action}
                  >
                    <action.icon className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Get Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="vault-card border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <HelpCircle className="w-5 h-5" />
                <span>Need Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    Our support team is here to help you with any questions or issues.
                  </p>
                  <a
                    href="mailto:support@securevault.com"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    <HelpCircle className="w-4 h-4" /> support@securevault.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">Customer Success</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Recommendations */}
        {stats.weakPasswords > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="vault-card border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Security Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-slate-600 dark:text-slate-400">
                    You have {stats.weakPasswords} weak password{stats.weakPasswords !== 1 ? 's' : ''} that should be updated.
                  </p>
                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    onClick={() => window.location.href = '/vault'}
                  >
                    Review Passwords
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default DashboardPage;