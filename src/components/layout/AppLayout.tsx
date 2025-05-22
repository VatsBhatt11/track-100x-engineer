'use client'

import { ReactNode, useState, useEffect } from "react";
import MainNavigation from "@/components/MainNavigation";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import axios from "axios";
import '@/styles/appLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPosts: number;
  rank: number;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [stats, setStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalPosts: 0,
    rank: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data } = await axios.get<UserStats>('/api/user/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the next achievement to complete
  const getNextAchievement = () => {
    const achievements = [
      { name: "First Post", target: 1, current: stats.totalPosts },
      { name: "Streak Starter", target: 3, current: stats.currentStreak },
      { name: "Week Warrior", target: 7, current: stats.currentStreak },
      { name: "Consistent Creator", target: 14, current: stats.currentStreak },
      { name: "Content Master", target: 30, current: stats.currentStreak },
      { name: "Consistent King", target: 100, current: stats.currentStreak },
    ];

    // Filter out completed achievements and find the one with highest progress
    const nextAchievement = achievements
      .filter(a => a.current < a.target)
      .sort((a, b) => {
        const progressA = (a.current / a.target) * 100;
        const progressB = (b.current / b.target) * 100;
        return progressB - progressA;
      })[0];

    if (nextAchievement) {
      const progress = Math.min(100, (nextAchievement.current / nextAchievement.target) * 100);
      return {
        name: nextAchievement.name,
        progress,
        current: nextAchievement.current,
        target: nextAchievement.target,
      };
    }

    return null;
  };

  const nextAchievement = getNextAchievement();
  
  return (
    <div className="app-container">
      <MainNavigation />
      <div className="app-main">
        <main className="app-content">
          {isHomePage && !isLoading && nextAchievement && (
            <div className="progress-section">
              <div className="progress-header">
                <p className="progress-label">Next Achievement: {nextAchievement.name}</p>
                <span className="progress-value">{Math.round(nextAchievement.progress)}%</span>
              </div>
              <Progress value={nextAchievement.progress} className="h-1" />
              <p className="progress-description">
                {nextAchievement.current} of {nextAchievement.target} days completed
              </p>
            </div>
          )}
          {children}
        </main>
        <footer className="footer">
          © {new Date().getFullYear()} Track100xEngineers | Powered by 100xEngineers
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;