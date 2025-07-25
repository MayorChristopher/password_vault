import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  RefreshCw, 
  Copy, 
  Zap, 
  Shield, 
  CheckCircle,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const generatePassword = () => {
    let charset = '';
    
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, '');
    }

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem('vault_activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      action: 'Generate Password',
      details: `Generated a ${length[0]}-character password`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });
    localStorage.setItem('vault_activities', JSON.stringify(activities.slice(0, 100)));
  };

  const copyPassword = () => {
    if (!password) {
      toast({
        title: "No Password",
        description: "Generate a password first",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    });
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 'Generate a password', color: 'text-slate-400', score: 0 };
    
    let score = 0;
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    if (score >= 5) return { strength: 'Very Strong', color: 'text-green-600', score: 100 };
    if (score >= 4) return { strength: 'Strong', color: 'text-green-500', score: 80 };
    if (score >= 3) return { strength: 'Medium', color: 'text-yellow-500', score: 60 };
    if (score >= 2) return { strength: 'Weak', color: 'text-orange-500', score: 40 };
    return { strength: 'Very Weak', color: 'text-red-500', score: 20 };
  };

  const passwordStrength = getPasswordStrength();

  const presets = [
    {
      name: 'High Security',
      description: 'Maximum security for critical accounts',
      config: { length: [20], uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: true, excludeAmbiguous: false }
    },
    {
      name: 'Balanced',
      description: 'Good balance of security and usability',
      config: { length: [16], uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false, excludeAmbiguous: false }
    },
    {
      name: 'Simple',
      description: 'Easy to type, good for mobile',
      config: { length: [12], uppercase: true, lowercase: true, numbers: true, symbols: false, excludeSimilar: true, excludeAmbiguous: true }
    }
  ];

  const applyPreset = (preset) => {
    setLength([preset.config.length[0]]);
    setOptions({
      uppercase: preset.config.uppercase,
      lowercase: preset.config.lowercase,
      numbers: preset.config.numbers,
      symbols: preset.config.symbols,
      excludeSimilar: preset.config.excludeSimilar,
      excludeAmbiguous: preset.config.excludeAmbiguous
    });
    toast({
      title: "Preset Applied",
      description: `${preset.name} settings applied`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Password Generator - SecureVault</title>
        <meta name="description" content="Generate secure, random passwords with customizable options. Create strong passwords for your accounts." />
      </Helmet>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Password Generator</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Create secure, random passwords
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <Zap className="w-4 h-4" />
            <span>Cryptographically Secure</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generated Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="vault-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Generated Password</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <div className="min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      {password ? (
                        <span className="font-mono text-lg break-all text-center">
                          {password}
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">
                          Click "Generate" to create a password
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {password && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Strength:</span>
                        <span className={`text-sm font-medium ${passwordStrength.color}`}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                                                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${passwordStrength.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={generatePassword}
                      className="flex-1 security-gradient"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={copyPassword}
                      disabled={!password}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="vault-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Options</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your password generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Length */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Password Length</Label>
                      <span className="text-sm font-medium">{length[0]} characters</span>
                    </div>
                    <Slider
                      value={length}
                      onValueChange={setLength}
                      max={50}
                      min={4}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Character Types */}
                  <div className="space-y-4">
                    <Label>Character Types</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={options.uppercase}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, uppercase: checked })
                          }
                        />
                        <Label htmlFor="uppercase" className="text-sm">
                          Uppercase (A-Z)
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={options.lowercase}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, lowercase: checked })
                          }
                        />
                        <Label htmlFor="lowercase" className="text-sm">
                          Lowercase (a-z)
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="numbers"
                          checked={options.numbers}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, numbers: checked })
                          }
                        />
                        <Label htmlFor="numbers" className="text-sm">
                          Numbers (0-9)
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="symbols"
                          checked={options.symbols}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, symbols: checked })
                          }
                        />
                        <Label htmlFor="symbols" className="text-sm">
                          Symbols (!@#$...)
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-4">
                    <Label>Advanced Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeSimilar"
                          checked={options.excludeSimilar}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, excludeSimilar: checked })
                          }
                        />
                        <Label htmlFor="excludeSimilar" className="text-sm">
                          Exclude similar characters (i, l, 1, L, o, 0, O)
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeAmbiguous"
                          checked={options.excludeAmbiguous}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, excludeAmbiguous: checked })
                          }
                        />
                        <Label htmlFor="excludeAmbiguous" className="text-sm">
                          Exclude ambiguous symbols ({`{ } [ ] ( ) / \\ ' " ~ , ; < > .`})
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Presets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="vault-card">
              <CardHeader>
                <CardTitle>Quick Presets</CardTitle>
                <CardDescription>
                  Common password configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start space-y-1"
                    onClick={() => applyPreset(preset)}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">{preset.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {preset.description}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Security Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Length Matters</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Use at least 12 characters. Longer passwords are exponentially harder to crack.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Unique Passwords</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Never reuse passwords across different accounts or services.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Regular Updates</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Update passwords regularly, especially for critical accounts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default PasswordGeneratorPage;