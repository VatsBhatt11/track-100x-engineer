import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trophy, Award, Star, Calendar, Flag, Crown } from "lucide-react";
import "@/styles/achievementGrid.css"
import { useState, useEffect } from "react";
import axios from "axios";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  color: string;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPosts: number;
  rank: number;
}

const AchievementGrid = () => {
  const [stats, setStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalPosts: 0,
    rank: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data } = await axios.get<UserStats>('/api/user/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to load user stats');
    } finally {
      setIsLoading(false);
    }
  };

  const achievements: Achievement[] = [
    {
      id: "a1",
      name: "First Post",
      description: "Submit your first post to begin your journey.",
      icon: Flag,
      unlocked: stats.totalPosts > 0,
      color: "icon-green"
    },
    {
      id: "a2",
      name: "Streak Starter",
      description: "Maintain a 3-day posting streak.",
      icon: Calendar,
      unlocked: stats.longestStreak >= 3,
      progress: Math.min(100, (stats.longestStreak / 3) * 100), 
      color: "icon-blue"
    },
    {
      id: "a3",
      name: "Week Warrior",
      description: "Maintain a 7-day posting streak.",
      icon: Star,
      unlocked: stats.longestStreak >= 7,
      progress: Math.min(100, (stats.longestStreak / 7) * 100), 
      color: "icon-yellow"
    },
    {
      id: "a4",
      name: "Consistent Creator",
      description: "Maintain a 14-day posting streak.",
      icon: Award,
      unlocked: stats.longestStreak >= 14,
      progress: Math.min(100, (stats.longestStreak / 14) * 100), 
      color: "icon-purple"
    },
    {
      id: "a5",
      name: "Content Master",
      description: "Maintain a 30-day posting streak.",
      icon: Trophy,
      unlocked: stats.longestStreak >= 30,
      progress: Math.min(100, (stats.longestStreak / 30) * 100),
      color: "icon-orange"
    },
    {
      id: "a6",
      name: "Consistent King",
      description: "Maintain a 100-day posting streak.",
      icon: Crown,
      progress: Math.min(100, (stats.longestStreak / 100) * 100),
      unlocked: stats.longestStreak >= 100,
      color: "icon-red"
    }
  ];

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card className="achievement-card">
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="loading-message">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="achievement-card">
      <CardContent>
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={cn(
                "achievement-item",
                achievement.unlocked 
                  ? "unlocked" 
                  : ""
              )}
            >
              <div className={cn(
                "achievement-icon",
                achievement.unlocked ? `${achievement.color} animate-pulse-opacity` : "icon-muted"
              )}>
                <achievement.icon className="h-6 w-6" />
              </div>
              <h3 className="achievement-name">{achievement.name}</h3>
              <p className="achievement-desc">{achievement.description}</p>
              
              {achievement.progress !== undefined && achievement.progress > 0 && !achievement.unlocked && (
                <div className="progress-bar">
                  <div className="progress-track">
                    <div 
                      className="progress-fill"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{Math.round(achievement.progress)}% complete</p>
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="status-text status-unlocked">
                  ✓ Unlocked
                </div>
              )}
              
              {!achievement.unlocked && !achievement.progress && (
                <div className="status-text status-locked">
                  Locked
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementGrid;