import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trophy, Award, Star, Calendar, Flag, Heart } from "lucide-react";
import "@/styles/achievementGrid.css"

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  color: string;
}

const achievements: Achievement[] = [
  {
    id: "a1",
    name: "First Post",
    description: "Submit your first post to begin your journey.",
    icon: Flag,
    unlocked: true,
    color: "icon-green"
  },
  {
    id: "a2",
    name: "Streak Starter",
    description: "Maintain a 3-day posting streak.",
    icon: Calendar,
    unlocked: true,
    color: "icon-blue"
  },
  {
    id: "a3",
    name: "Week Warrior",
    description: "Maintain a 7-day posting streak.",
    icon: Star,
    unlocked: true,
    color: "icon-yellow"
  },
  {
    id: "a4",
    name: "Consistent Creator",
    description: "Maintain a 14-day posting streak.",
    icon: Award,
    unlocked: false,
    progress: 65,
    color: "icon-purple"
  },
  {
    id: "a5",
    name: "Content Master",
    description: "Maintain a 30-day posting streak.",
    icon: Trophy,
    unlocked: false,
    progress: 30,
    color: "icon-orange"
  },
  {
    id: "a6",
    name: "Community Favorite",
    description: "Have one of your posts featured by moderators.",
    icon: Heart,
    unlocked: false,
    color: "icon-red"
  }
];

const AchievementGrid = () => {
  return (
    <Card className="achievement-card">
      <CardHeader>
        <CardTitle>Your Achievements</CardTitle>
      </CardHeader>
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
              
              {achievement.progress !== undefined && (
                <div className="progress-bar">
                  <div className="progress-track">
                    <div 
                      className="progress-fill"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{achievement.progress}% complete</p>
                </div>
              )}
              
              {achievement.unlocked && !achievement.progress && (
                <div className="status-text status-unlocked">
                  ✓ Unlocked
                </div>
              )}
              
              {!achievement.unlocked && !achievement.progress && (
                <div className="status-text status-unlocked">
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