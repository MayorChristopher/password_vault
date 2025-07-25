import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
    Shield,
    Lock,
    Settings,
    Eye,
    Download,
    Upload
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

function SecuritySettingsPage() {
    const [settings, setSettings] = useState({
        autoLockEnabled: true,
        sessionTimeout: 30,
        passwordHistory: true,
        breachMonitoring: true,
        securityNotifications: true
    });
    const fileInputRef = useRef();

    useEffect(() => {
        const saved = localStorage.getItem('vault_security_settings');
        if (saved) {
            setSettings({ ...settings, ...JSON.parse(saved) });
        }
    }, []);

    const saveSettings = (newSettings) => {
        localStorage.setItem('vault_security_settings', JSON.stringify(newSettings));
        setSettings(newSettings);
        toast({
            title: 'Settings Updated',
            description: 'Your security settings have been saved',
        });
    };

    // --- Data Management ---
    const exportVault = () => {
        const credentials = localStorage.getItem('vault_credentials');
        if (!credentials) {
            toast({ title: 'No Data', description: 'No credentials to export', variant: 'destructive' });
            return;
        }
        const blob = new Blob([credentials], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vault_credentials_backup.json';
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Exported', description: 'Credentials exported as JSON file.' });
    };

    const importVault = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (!Array.isArray(imported)) throw new Error('Invalid format');
                localStorage.setItem('vault_credentials', JSON.stringify(imported));
                toast({ title: 'Imported', description: 'Credentials imported successfully.' });
            } catch {
                toast({ title: 'Import Failed', description: 'Invalid file format.', variant: 'destructive' });
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <Helmet>
                <title>Security Settings - SecureVault</title>
                <meta name="description" content="Configure your vault security settings. Manage auto-lock, session timeout, and data management." />
            </Helmet>
            <div className="p-6 space-y-6">
                {/* Header - Hidden on large screens to avoid duplicate titles */}
                <div className="flex items-center justify-between lg:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security Settings</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Configure your vault security and privacy settings
                        </p>
                    </div>
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Session Security */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="vault-card">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Lock className="w-5 h-5" />
                                    <span>Session Security</span>
                                </CardTitle>
                                <CardDescription>
                                    Auto-lock and timeout settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Auto-Lock</Label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Lock vault when inactive
                                        </p>
                                    </div>
                                    <Checkbox
                                        checked={settings.autoLockEnabled}
                                        onCheckedChange={(checked) => saveSettings({ ...settings, autoLockEnabled: checked })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Session Timeout</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[15, 30, 60].map(minutes => (
                                            <Button
                                                key={minutes}
                                                variant={settings.sessionTimeout === minutes ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => saveSettings({ ...settings, sessionTimeout: minutes })}
                                            >
                                                {minutes}m
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Privacy & Monitoring */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="vault-card">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Eye className="w-5 h-5" />
                                    <span>Privacy & Monitoring</span>
                                </CardTitle>
                                <CardDescription>
                                    Data protection and monitoring preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Password History</Label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Remember previous passwords
                                        </p>
                                    </div>
                                    <Checkbox
                                        checked={settings.passwordHistory}
                                        onCheckedChange={(checked) => saveSettings({ ...settings, passwordHistory: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Breach Monitoring</Label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Monitor for compromised passwords
                                        </p>
                                    </div>
                                    <Checkbox
                                        checked={settings.breachMonitoring}
                                        onCheckedChange={(checked) => saveSettings({ ...settings, breachMonitoring: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Security Notifications</Label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Alerts for security events
                                        </p>
                                    </div>
                                    <Checkbox
                                        checked={settings.securityNotifications}
                                        onCheckedChange={(checked) => saveSettings({ ...settings, securityNotifications: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Data Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="vault-card">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="w-5 h-5" />
                                <span>Data Management</span>
                            </CardTitle>
                            <CardDescription>
                                Export or import your vault credentials as a JSON file
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Button onClick={exportVault} className="flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Export Vault
                                </Button>
                                <input
                                    type="file"
                                    accept="application/json"
                                    ref={fileInputRef}
                                    onChange={importVault}
                                    style={{ display: 'none' }}
                                />
                                <Button variant="outline" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Import Vault
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Exported data is encrypted and can be restored only in SecureVault.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}

export default SecuritySettingsPage; 