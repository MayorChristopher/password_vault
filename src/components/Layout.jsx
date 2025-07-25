import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    Key,
    Settings,
    Activity,
    LogOut,
    Menu,
    X,
    Lock,
    Zap,
    User,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Shield },
    { name: 'Vault', href: '/vault', icon: Lock },
    { name: 'Generator', href: '/generator', icon: Zap },
    { name: 'Security', href: '/security', icon: Settings },
    { name: 'Activity', href: '/activity', icon: Activity },
];

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="relative h-screen bg-slate-50 dark:bg-slate-900">
            {/* Mobile sidebar overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-200 ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="lg:hidden">
                <motion.div
                    initial={false}
                    animate={{ x: sidebarOpen ? 0 : '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 shadow-xl flex flex-col"
                >
                    {/* Logo and Close */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Key className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">SecureVault</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    {/* User info and support */}
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <span className="text-lg font-medium text-white">
                                        {user?.name?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mb-2" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                        <a
                            href="mailto:support@securevault.com"
                            className="flex items-center justify-center text-xs text-blue-600 hover:underline mt-2"
                        >
                            <HelpCircle className="w-4 h-4 mr-1" /> Support
                        </a>
                    </div>
                    <div className="text-center text-xs text-slate-400 py-2 border-t border-slate-100 dark:border-slate-700">
                        &copy; {new Date().getFullYear()} SecureVault. All rights reserved.
                    </div>
                </motion.div>
            </div>
            {/* Desktop sidebar: fixed and always visible */}
            <div className="hidden lg:block">
                <div className="fixed inset-y-0 left-0 z-50 lg:z-10 w-72 bg-white dark:bg-slate-800 shadow-xl flex flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Key className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">SecureVault</span>
                        </div>
                    </div>
                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    {/* User info and support */}
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <span className="text-lg font-medium text-white">
                                        {user?.name?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mb-2" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                        <a
                            href="mailto:support@securevault.com"
                            className="flex items-center justify-center text-xs text-blue-600 hover:underline mt-2"
                        >
                            <HelpCircle className="w-4 h-4 mr-1" /> Support
                        </a>
                    </div>
                    <div className="text-center text-xs text-slate-400 py-2 border-t border-slate-100 dark:border-slate-700">
                        &copy; {new Date().getFullYear()} SecureVault. All rights reserved.
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="flex flex-col overflow-hidden h-full lg:ml-72">
                {/* Top bar */}
                <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center space-x-3">

                            <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block lg:hidden">SecureVault</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="encrypted-indicator w-2 h-2 rounded-full"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Encrypted</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <User className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                                <span className="text-sm text-slate-700 dark:text-slate-200">{user?.name}</span>
                            </div>
                        </div>
                    </div>
                </header>
                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
                <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-100 dark:border-slate-700">
                    SecureVault &mdash; Professional Password Management
                </footer>
            </div>
        </div>
    );
}

export default Layout; 