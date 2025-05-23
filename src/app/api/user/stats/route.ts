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

    // Get total posts count
    const totalPosts = await prisma.post.count({
      where: {
        userId: session.user.id,
      },
    });

    // Get current streak
    let currentStreak = 0;
    let currentDate = new Date();

    while (true) {
      const posts = await prisma.post.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: startOfDay(currentDate),
            lt: startOfDay(subDays(currentDate, -1)),
          },
        },
      });

      if (posts > 0) {
        currentStreak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    // Get longest streak
    const posts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
      },
    });

    let longestStreak = 0;
    let currentStreakCount = 0;
    let lastDate: Date | null = null;

    posts.forEach((post) => {
      const postDate = startOfDay(post.createdAt);

      if (lastDate) {
        const dayDiff = Math.floor(
          (postDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          currentStreakCount++;
          longestStreak = Math.max(longestStreak, currentStreakCount);
        } else if (dayDiff > 1) {
          currentStreakCount = 1;
        }
      } else {
        currentStreakCount = 1;
      }

      lastDate = postDate;
    });

    // Get user's rank - Fixed query
    const usersWithMorePosts = await prisma.user.findMany({
      where: {
        id: {
          not: session.user.id,
        },
        posts: {
          some: {
            createdAt: {
              gte: startOfDay(subDays(new Date(), 30)), // Last 30 days
            },
          },
        },
      },
      select: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    // Calculate rank based on users with more posts
    const userRank =
      usersWithMorePosts.filter((user) => user._count.posts > totalPosts)
        .length + 1;

    return NextResponse.json({
      currentStreak,
      longestStreak,
      totalPosts,
      rank: userRank,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
