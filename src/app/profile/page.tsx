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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

import '@/styles/profile.css';
import { Tweet } from "react-tweet";

interface User {
  name: string;
  email: string;
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
}

interface ProfileData {
  user: User;
  recentPosts: Post[];
}


const Profile = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    bio: "",
    currentStreak: 0,
    longestStreak: 0,
    totalPosts: 0,
    avatar: "",
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (user) {
      setSettings({
        name: user.name,
        bio: user.bio,
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get<ProfileData>('/api/profile');
      setUser(data.user);
      setRecentPosts(data.recentPosts);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSettingsChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value, type } = e.target;
  //   setSettings(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
  //   }));
  // };

  const handleSaveSettings = async () => {
    try {
      const { data } = await axios.put('/api/profile/update', settings);
      
      if (user) {
        setUser({
          ...user,
          name: data.user.name,
          bio: data.user.bio,
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
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSettings();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="loading">Loading profile...</div>
      </AppLayout>
    );
  }

  if (error || !user) {
    return (
      <AppLayout>
        <div className="error">{error || 'Failed to load profile'}</div>
      </AppLayout>
    );
  }

  function extractTweetId(tweetUrlOrHtml: string): string | null {
    const match = tweetUrlOrHtml.match(/status\/(\d+)/);
    return match ? match[1] : null;
  }

  const CommunityPost = ({
    content,
    platform,
  }: Post) => {
    return (
      <div className="community-post">
        <div className="post-content">
          {platform === "twitter" ? (
            <Tweet id={extractTweetId(content)||""}/>
          ) : platform === "linkedin" ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-sm">{content}</p>
          )}
        </div>
      </div>
    )
  }

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
            <p className="profile-email">{user.email}</p>
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
        </div>
      </div>

      <Tabs defaultValue="posts" className="profile-tabs">
        <TabsList className="tab-list">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="post-list">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <CommunityPost
                key={post.id}
                id={post.id}
                content={post.content}
                platform={post.platform}
              />
                // <div key={post.id} className="post-card">
                //   <div className="post-header">
                //     <Badge variant="outline">{post.platform}</Badge>
                //     <span className="post-date">
                //       {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                //     </span>
                //   </div>
                //   <div className="post-content">
                //     <iframe
                //       src={post.content}
                //       width="100%"
                //       height="400"
                //       frameBorder="0"
                //       allowFullScreen
                //     />
                //   </div>
                // </div>
              ))
            ) : (
              <div className="no-posts">
                <p>No posts yet. Start your journey by submitting your first post!</p>
              </div>
            )}
          </div>
        </TabsContent>

          <TabsContent value="settings">
            <div className="settings-card">
              <h2 className="settings-title">Edit Profile</h2>
            <form className="settings-form" onSubmit={handleSettingsSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-input"
                  value={settings.bio}
                  onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                />
              </div>
              <Button type="submit" className="save-button">
                Save Changes
              </Button>
            </form>
            </div>
          </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Profile;
