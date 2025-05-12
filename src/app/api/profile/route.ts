import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Get last 10 posts
        },
        badgeAwards: {
          include: {
            badgeDefinition: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate current streak
    let currentStreak = 0;
    let currentDate = new Date();

    while (true) {
      const hasPost = user.posts.some((post) => {
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

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreakCount = 0;
    let lastDate: Date | null = null;

    user.posts.forEach((post) => {
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

    // Format recent posts
    const recentPosts = user.posts.map((post) => ({
      id: post.id,
      content: post.url, // You might want to fetch actual content from the URL
      platform: post.platform.toLowerCase(),
      date: post.createdAt.toISOString(),
      likes: 0, // You might want to implement likes functionality
    }));

    // Format achievements
    const achievements = user.badgeAwards.map((award) => ({
      name: award.badgeDefinition.title,
      description: award.badgeDefinition.description,
      achieved: true,
    }));

    return NextResponse.json({
      user: {
        name: user.name || "Anonymous",
        username: user.email?.split("@")[0] || "user",
        bio: user.bio || "",
        currentStreak,
        longestStreak,
        totalPosts: user.posts.length,
        avatar: user.image || "",
      },
      recentPosts,
      achievements,
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
