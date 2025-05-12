// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AppLayout from "@/components/layout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";

import '@/styles/profile.css';

interface User {
  name: string;
  username: string;
  bio: string;
  currentStreak: number;
  longestStreak: number;
  totalPosts: number;
  avatar: string;
}

interface Post {
  id: string;
  content: string;
  platform: string;
  date: string;
  likes: number;
}

interface Achievement {
  name: string;
  description: string;
  achieved: boolean;
}

interface ProfileData {
  user: User;
  recentPosts: Post[];
  achievements: Achievement[];
}

interface SettingsForm {
  name: string;
  username: string;
  bio: string;
  emailNotifications: boolean;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsForm>({
    name: "",
    username: "",
    bio: "",
    emailNotifications: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setSettings({
        name: profileData.user.name,
        username: profileData.user.username,
        bio: profileData.user.bio,
        emailNotifications: true,
      });
    }
  }, [profileData]);

  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get<ProfileData>('/api/profile');
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { data } = await axios.put('/api/profile/update', settings);
      
      if (profileData) {
        setProfileData({
          ...profileData,
          user: {
            ...profileData.user,
            name: data.user.name,
            username: data.user.username,
            bio: data.user.bio,
          },
        });
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="loading-message">Loading profile data...</div>
      </AppLayout>
    );
  }

  if (error || !profileData) {
    return (
      <AppLayout>
        <div className="error-message">{error || 'Failed to load profile data'}</div>
      </AppLayout>
    );
  }

  const { user, recentPosts, achievements } = profileData;

  return (
    <AppLayout>
      <Breadcrumb className="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="breadcrumb-icon" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Profile</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="profile-header">
        <div className="profile-info">
          <Avatar className="profile-avatar">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="avatar-fallback">{user.name[0]}</AvatarFallback>
          </Avatar>

          <div className="profile-meta">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-bio">{user.bio}</p>

            <div className="profile-stats">
              <div>
                <span className="stat-number">{user.currentStreak}</span>
                <span className="stat-label">day streak</span>
              </div>
              <div>
                <span className="stat-number">{user.longestStreak}</span>
                <span className="stat-label">longest</span>
              </div>
              <div>
                <span className="stat-number">{user.totalPosts}</span>
                <span className="stat-label">total posts</span>
              </div>
            </div>
          </div>

          <Button>Edit Profile</Button>
        </div>
      </div>

      <Tabs defaultValue="posts" className="profile-tabs">
        <TabsList className="tab-list">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="post-list">
            {recentPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <Badge variant="outline">{post.platform}</Badge>
                  <span className="post-date">
                    {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                  </span>
                </div>
                <p className="post-content">{post.content}</p>
                <div className="post-likes">{post.likes} likes</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="achievement-grid">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`achievement-card ${
                  achievement.achieved ? "unlocked" : "locked"
                }`}
              >
                <div className="achievement-header">
                  <h3 className="achievement-title">{achievement.name}</h3>
                  {achievement.achieved ? (
                    <Badge className="achievement-badge">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
                <p className="achievement-desc">{achievement.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="settings-card">
            <h2 className="settings-title">Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={settings.name}
                  onChange={handleSettingsChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  value={settings.username}
                  onChange={handleSettingsChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-input"
                  rows={3}
                  value={settings.bio}
                  onChange={handleSettingsChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Notifications</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleSettingsChange}
                  />
                  <label htmlFor="notifications">Receive daily streak reminders</label>
                </div>
              </div>
              <Button 
                className="save-button"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Profile;
