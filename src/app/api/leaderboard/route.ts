import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users with their post counts and streaks
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        posts: {
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Calculate stats for each user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const posts = user.posts;
        const totalPosts = posts.length;

        // Calculate current streak
        let currentStreak = 0;
        let currentDate = new Date();

        while (true) {
          const hasPost = posts.some((post) => {
            const postDate = startOfDay(post.createdAt);
            const checkDate = startOfDay(currentDate);
            return postDate.getTime() === checkDate.getTime();
          });

          if (hasPost) {
            currentStreak++;
            currentDate = subDays(currentDate, 1);
          } else {
            break;
          }
        }

        // Determine badge based on streak length
        let badge = null;
        if (currentStreak >= 20) badge = "diamond";
        else if (currentStreak >= 15) badge = "platinum";
        else if (currentStreak >= 10) badge = "gold";
        else if (currentStreak >= 5) badge = "silver";

        return {
          id: user.id,
          name: user.name || "Anonymous",
          avatar: user.image || user.name?.[0] || "A",
          currentStreak,
          totalPosts,
          badge,
        };
      })
    );

    // Sort by total posts and add ranks
    const sortedData = leaderboardData
      .sort((a, b) => b.totalPosts - a.totalPosts)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json(sortedData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
