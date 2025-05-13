import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

function extractTwitterEmbedUrl(url: string): string | null {
  try {
    // Extract tweet ID from URL
    const tweetId = url.split("/").pop()?.split("?")[0];
    if (!tweetId) return null;

    // Construct the embed URL
    return `https://twitter.com/i/status/${tweetId}`;
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
    const formattedPosts = posts.map((post) => {
      let platform = "unknown";
      let content = post.url;
      let embedUrl = null;

      if (post.url.includes("twitter.com") || post.url.includes("x.com")) {
        platform = "twitter";
        embedUrl = extractTwitterEmbedUrl(post.url);
        if (embedUrl) {
          content = `<blockquote class="twitter-tweet">
            <a href="${embedUrl}"></a>
          </blockquote>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
        }
      } else if (post.url.includes("linkedin.com")) {
        platform = "linkedin";
        embedUrl = extractLinkedInEmbedUrl(post.url);
        if (embedUrl) {
          content = `<iframe 
            src="${embedUrl}" 
            height="669" 
            width="100%" 
            frameborder="0" 
            allowfullscreen="" 
            title="Embedded post"
            style="max-width: 504px;"
          ></iframe>`;
        }
      }

      return {
        id: post.id,
        username: post.user.name || "Anonymous",
        time: formatTimeAgo(post.createdAt),
        content,
        platform,
        embedUrl,
        likes: 0, // You might want to implement likes functionality
        comments: 0, // You might want to implement comments functionality
        avatarSrc: post.user.image,
      };
    });

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
