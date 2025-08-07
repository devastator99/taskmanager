import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiCalendar, FiTrendingUp } from 'react-icons/fi';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar: string;
  task_count: number;
  completed_tasks: number;
  pending_tasks: number;
}

const AVATAR_OPTIONS = [
  { emoji: '👤', label: 'Default' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤓', label: 'Nerd' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '💼', label: 'Business' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '🔥', label: 'Fire' },
];

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    avatar: '👤',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar: data.avatar || '👤',
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error loading profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error updating profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      avatar: profile?.avatar || '👤',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Failed to load profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionRate = profile.task_count > 0 ? Math.round((profile.completed_tasks / profile.task_count) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and view your statistics</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-4xl">{profile.avatar}</span>
                    <div>
                      <h2 className="text-xl">{profile.first_name} {profile.last_name}</h2>
                      <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    </div>
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <FiEdit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        <FiSave className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Avatar Selection */}
                    <div className="space-y-2">
                      <Label>Choose Avatar</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {AVATAR_OPTIONS.map((option) => (
                          <button
                            key={option.emoji}
                            onClick={() => setEditForm({ ...editForm, avatar: option.emoji })}
                            className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                              editForm.avatar === option.emoji
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                            title={option.label}
                          >
                            {option.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <FiUser className="w-4 h-4" />
                      <span>{profile.username}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <FiMail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiTrendingUp className="w-5 h-5" />
                  Task Statistics
                </CardTitle>
                <CardDescription>Your productivity overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Tasks</span>
                    <span className="text-2xl font-bold text-blue-600">{profile.task_count}</span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-lg font-semibold text-green-600">{profile.completed_tasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="text-lg font-semibold text-orange-600">{profile.pending_tasks}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-lg font-semibold">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FiTrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
