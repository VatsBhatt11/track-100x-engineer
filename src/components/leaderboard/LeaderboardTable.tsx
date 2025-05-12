'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star } from "lucide-react";
import '@/styles/leaderboardTable.css'

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  currentStreak: number;
  totalPosts: number;
  badge: string | null;
}

const LeaderboardTable = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<"rank" | "currentStreak" | "totalPosts">("rank");
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
    if (sortBy === "rank") return a.rank - b.rank;
    if (sortBy === "currentStreak") return b.currentStreak - a.currentStreak;
    return b.totalPosts - a.totalPosts;
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
      <CardHeader className="leaderboard-header">
        <CardTitle className="leaderboard-title">
          <span>Leaderboard</span>
          <div className="sort-buttons">
            <Button 
              onClick={() => setSortBy("rank")} 
              className={sortBy === "rank" ? "active" : ""}
              disabled={isLoading}
            >
              Rank
            </Button>
            <Button 
              onClick={() => setSortBy("currentStreak")} 
              className={sortBy === "currentStreak" ? "active" : ""}
              disabled={isLoading}
            >
              Streaks
            </Button>
            <Button 
              onClick={() => setSortBy("totalPosts")} 
              className={sortBy === "totalPosts" ? "active" : ""}
              disabled={isLoading}
            >
              Posts
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
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
                {sortedData.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      {entry.rank <= 3 ? (
                        <span className="top-rank">{entry.rank}</span>
                      ) : (
                        entry.rank
                      )}
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="avatar"><img src={entry.avatar}/></div>
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