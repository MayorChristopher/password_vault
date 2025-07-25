import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2, 
  Lock,
  Globe,
  Tag,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

function VaultPage() {
  const [credentials, setCredentials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPasswords, setShowPasswords] = useState({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [formData, setFormData] = useState({
    siteName: '',
    username: '',
    password: '',
    category: 'Personal',
    notes: ''
  });

  const categories = ['Personal', 'Work', 'Banking', 'Social', 'Shopping', 'Other'];

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    const saved = localStorage.getItem('vault_credentials');
    if (saved) {
      setCredentials(JSON.parse(saved));
    }
  };

  const saveCredentials = (newCredentials) => {
    localStorage.setItem('vault_credentials', JSON.stringify(newCredentials));
    setCredentials(newCredentials);
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem('vault_activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      action: editingCredential ? 'Update Credential' : 'Add Credential',
      details: `${editingCredential ? 'Updated' : 'Added'} credential for ${formData.siteName}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });
    localStorage.setItem('vault_activities', JSON.stringify(activities.slice(0, 100)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCredential) {
      const updated = credentials.map(cred => 
        cred.id === editingCredential.id 
          ? { ...formData, id: editingCredential.id, updatedAt: new Date().toISOString() }
          : cred
      );
      saveCredentials(updated);
      toast({
        title: "Credential Updated",
        description: "Your credential has been updated successfully.",
      });
    } else {
      const newCredential = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveCredentials([...credentials, newCredential]);
      toast({
        title: "Credential Added",
        description: "Your credential has been added to the vault.",
      });
    }

    setFormData({ siteName: '', username: '', password: '', category: 'Personal', notes: '' });
    setIsAddDialogOpen(false);
    setEditingCredential(null);
  };

  const handleEdit = (credential) => {
    setFormData(credential);
    setEditingCredential(credential);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updated = credentials.filter(cred => cred.id !== id);
    saveCredentials(updated);
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem('vault_activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      action: 'Delete Credential',
      details: 'Deleted a credential from vault',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });
    localStorage.setItem('vault_activities', JSON.stringify(activities.slice(0, 100)));

    toast({
      title: "Credential Deleted",
      description: "The credential has been removed from your vault.",
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cred.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'Unknown', color: 'text-slate-400' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score >= 4) return { strength: 'Strong', color: 'text-green-600' };
    if (score >= 3) return { strength: 'Medium', color: 'text-yellow-600' };
    return { strength: 'Weak', color: 'text-red-600' };
  };

  return (
    <>
      <Helmet>
        <title>Vault - SecureVault</title>
        <meta name="description" content="Manage your encrypted password vault. Securely store, organize, and access your credentials." />
      </Helmet>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Password Vault</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your encrypted credentials
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="security-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCredential ? 'Edit Credential' : 'Add New Credential'}
                </DialogTitle>
                <DialogDescription>
                  {editingCredential ? 'Update your credential information' : 'Store a new credential in your vault'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    placeholder="e.g., Google, GitHub, Bank"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username/Email</Label>
                  <Input
                    id="username"
                    placeholder="Your username or email"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Additional notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="security-gradient">
                    {editingCredential ? 'Update' : 'Add'} Credential
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="vault-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search credentials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials List */}
        <div className="space-y-4">
          {filteredCredentials.length === 0 ? (
            <Card className="vault-card">
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {credentials.length === 0 ? 'No credentials stored' : 'No matching credentials'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {credentials.length === 0 
                    ? 'Start building your secure password vault by adding your first credential.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {credentials.length === 0 && (
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="security-gradient"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Credential
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredCredentials.map((credential, index) => {
              const passwordStrength = getPasswordStrength(credential.password);
              return (
                <motion.div
                  key={credential.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="vault-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {credential.siteName}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Tag className="w-3 h-3 text-slate-400" />
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {credential.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Username:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono">{credential.username}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(credential.username, 'Username')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Password:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono">
                                  {showPasswords[credential.id] 
                                    ? credential.password 
                                    : '••••••••'
                                  }
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => togglePasswordVisibility(credential.id)}
                                >
                                  {showPasswords[credential.id] ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(credential.password, 'Password')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Strength:</span>
                              <span className={`text-sm font-medium ${passwordStrength.color}`}>
                                {passwordStrength.strength}
                              </span>
                            </div>
                            
                            {credential.notes && (
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Notes:</span>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                                  {credential.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(credential)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(credential.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default VaultPage;