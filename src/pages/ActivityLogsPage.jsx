import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Monitor,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ActivityLogsPage() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, filterType, filterTime]);

  const loadActivities = () => {
    const saved = localStorage.getItem('vault_activities');
    if (saved) {
      setActivities(JSON.parse(saved));
    } else {
      // Add some sample activities if none exist
      const sampleActivities = [
        {
          id: '1',
          action: 'Login',
          details: 'User logged in successfully',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...'
        }
      ];
      localStorage.setItem('vault_activities', JSON.stringify(sampleActivities));
      setActivities(sampleActivities);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    // Time filter
    if (filterTime !== 'all') {
      const now = new Date();
      let timeThreshold;
      
      switch (filterTime) {
        case 'hour':
          timeThreshold = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case 'day':
          timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeThreshold = null;
      }

      if (timeThreshold) {
        filtered = filtered.filter(activity =>
          new Date(activity.timestamp) > timeThreshold
        );
      }
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (action) => {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login')) return { icon: CheckCircle, color: 'text-green-600' };
    if (actionLower.includes('logout')) return { icon: Shield, color: 'text-blue-600' };
    if (actionLower.includes('add') || actionLower.includes('create')) return { icon: CheckCircle, color: 'text-green-600' };
    if (actionLower.includes('update') || actionLower.includes('edit')) return { icon: Activity, color: 'text-blue-600' };
    if (actionLower.includes('delete')) return { icon: AlertTriangle, color: 'text-red-600' };
    if (actionLower.includes('generate')) return { icon: Shield, color: 'text-purple-600' };
    if (actionLower.includes('security')) return { icon: Shield, color: 'text-orange-600' };
    
    return { icon: Activity, color: 'text-slate-600' };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityStats = () => {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayActivities = activities.filter(a => new Date(a.timestamp) > dayAgo);
    const weekActivities = activities.filter(a => new Date(a.timestamp) > weekAgo);
    const loginActivities = activities.filter(a => a.action.toLowerCase().includes('login'));

    return {
      today: todayActivities.length,
      week: weekActivities.length,
      total: activities.length,
      logins: loginActivities.length
    };
  };

  const stats = getActivityStats();

  return (
    <>
      <Helmet>
        <title>Activity Logs - SecureVault</title>
        <meta name="description" content="Monitor your vault activity and security events. Track logins, changes, and access patterns." />
      </Helmet>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activity Logs</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Monitor your vault activity and security events
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Real-time Monitoring</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="vault-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Today
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.today}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="vault-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      This Week
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.week}
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
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total Logins
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.logins}
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
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="vault-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="credential">Credentials</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="generate">Generate</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterTime} onValueChange={setFilterTime}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="hour">Last Hour</SelectItem>
                      <SelectItem value="day">Last Day</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="vault-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Chronological list of vault events and security actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No activities found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {activities.length === 0 
                      ? 'Your activity log is empty. Start using your vault to see events here.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity, index) => {
                    const { icon: Icon, color } = getActivityIcon(activity.action);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <div className={`w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center ${color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {activity.action}
                            </h4>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {activity.details}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{activity.ipAddress}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Monitor className="w-3 h-3" />
                              <span className="truncate max-w-xs">
                                {activity.userAgent}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default ActivityLogsPage;