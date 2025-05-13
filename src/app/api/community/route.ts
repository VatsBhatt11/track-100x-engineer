import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";
import axios from "axios";

async function getTwitterEmbedHtml(tweetUrl: string): Promise<string | null> {
  try {
    const response = await axios.get("https://publish.twitter.com/oembed", {
      params: {
        url: tweetUrl,
        omit_script: false,
      },
    });

    return response.data.html;
  } catch (error) {
    console.error("Error fetching Twitter embed HTML:", error);
    return null;
  }
}

function extractTwitterEmbedUrl(url: string): string | null {
  try {
    // Extract tweet ID from URL
    const tweetId = url.split("/").pop()?.split("?")[0];
    if (!tweetId) return null;

    // Construct the embed URL
    return `https://x.com/i/status/${tweetId}`;
  } catch (error) {
    console.error("Error extracting Twitter embed URL:", error);
    return null;
  }
}

function extractLinkedInEmbedUrl(url: string): string | null {
  try {
    // Extract post ID from URL
    const postId = url.split("/").pop()?.split("?")[0];
    if (!postId) return null;

    // Construct the embed URL
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${postId}?collapsed=1`;
  } catch (error) {
    console.error("Error extracting LinkedIn embed URL:", error);
    return null;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all posts with user information
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Get last 10 posts
    });

    // Get top contributors based on streak and total posts
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
    const contributors = await Promise.all(
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

        return {
          id: user.id,
          name: user.name || "Anonymous",
          avatar: user.image || user.name?.[0] || "A",
          currentStreak,
          totalPosts,
        };
      })
    );

    // Sort contributors by streak and total posts
    const sortedContributors = contributors
      .sort((a, b) => {
        if (b.currentStreak !== a.currentStreak) {
          return b.currentStreak - a.currentStreak;
        }
        return b.totalPosts - a.totalPosts;
      })
      .slice(0, 4); // Get top 4 contributors

    // Format posts for response
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        let platform = "unknown";

        if (post.url.includes("twitter.com") || post.url.includes("x.com")) {
          platform = "twitter";
        } else if (post.url.includes("linkedin.com")) {
          platform = "linkedin";
        }

        return {
          id: post.id,
          username: post.user.name || "Anonymous",
          time: formatTimeAgo(post.createdAt),
          content: post.url,
          platform,
          likes: 0, // You might want to implement likes functionality
          comments: 0, // You might want to implement comments functionality
          avatarSrc: post.user.image,
        };
      })
    );

    return NextResponse.json({
      posts: formattedPosts,
      topContributors: sortedContributors,
    });
  } catch (error) {
    console.error("Error fetching community data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "Yesterday";
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
