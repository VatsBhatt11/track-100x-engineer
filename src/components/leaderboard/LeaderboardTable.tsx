'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star } from "lucide-react";
import '@/styles/leaderboardTable.css'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  currentStreak: number;
  totalPosts: number;
  badge: string | null;
  longestStreak: number;
}

const LeaderboardTable = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const { data } = await axios.get<LeaderboardEntry[]>('/api/leaderboard');
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBadgeIcon = (badge: string | null) => {
    if (!badge) return null;
    
    switch (badge) {
      case "diamond":
        return <Trophy className="icon blue" />;
      case "platinum":
        return <Trophy className="icon purple" />;
      case "gold":
        return <Award className="icon yellow" />;
      case "silver":
        return <Star className="icon gray" />;
      default:
        return null;
    }
  };
  
  const getBadgeClass = (badge: string | null) => {
    if (!badge) return "";
    return `badge-${badge}`;
  };
  
  const sortedData = [...leaderboardData].sort((a, b) => {
    // First sort by total posts
    if (b.totalPosts !== a.totalPosts) {
      return b.totalPosts - a.totalPosts;
    }
    // Then by current streak
    if (b.currentStreak !== a.currentStreak) {
      return b.currentStreak - a.currentStreak;
    }
    // Finally by longest streak
    return b.longestStreak - a.longestStreak;
  });
  
  if (error) {
    return (
      <Card className="leaderboard-card">
        <CardContent>
          <div className="error-message">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return(
    <Card className="leaderboard-card">
      <CardContent>
        {isLoading ? (
          <div className="loading-message">Loading leaderboard data...</div>
        ) : (
          <div className="table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Current Streak</th>
                  <th>Total Posts</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>
                      {index + 1 <= 3 ? (
                        <span className="top-rank">{index + 1}</span>
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td>
                      <div className="user-info">
                      <Avatar className="avatar">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name[0]}</AvatarFallback>
                      </Avatar>
                        <span>{entry.name}</span>
                      </div>
                    </td>
                    <td className="mono">{entry.currentStreak} days</td>
                    <td className="mono">{entry.totalPosts}</td>
                    <td>
                      {entry.badge ? (
                        <Badge className={`badge ${getBadgeClass(entry.badge)}`}>
                          {getBadgeIcon(entry.badge)}
                          <span className="label">{entry.badge}</span>
                        </Badge>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;