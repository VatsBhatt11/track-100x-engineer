import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";
import axios from "axios";

async function getTwitterContent(url: string): Promise<string | null> {
  try {
    const response = await axios.get("https://publish.twitter.com/oembed", {
      params: {
        url,
        omit_script: false,
      },
    });
    return response.data.html;
  } catch (error) {
    console.error("Error fetching Twitter content:", error);
    return null;
  }
}

async function getLinkedInContent(url: string): Promise<string | null> {
  try {
    // Extract post ID from URL
    let postId: string | null = null;

    // Handle both direct LinkedIn URLs and embed URLs
    if (url.includes("linkedin.com/embed/feed/update/")) {
      // Extract from embed URL - handle both urn:li:share and urn:li:ugcPost formats
      const match = url.match(/urn:li:(?:share|ugcPost):(\d+)/);
      postId = match ? match[1] : null;
    } else {
      // Extract from regular LinkedIn URL
      postId = url.split("/").pop()?.split("?")[0] || null;
    }

    if (!postId) return null;

    // Construct the embed URL - use the same format as the input URL
    const isUgcPost = url.includes("urn:li:ugcPost");
    const embedUrl = `https://www.linkedin.com/embed/feed/update/urn:li:${
      isUgcPost ? "ugcPost" : "share"
    }:${postId}?collapsed=1`;

    // Fetch the embed HTML
    const response = await axios.get(embedUrl);

    // Extract the content from the embed HTML
    const content = response.data;
    if (typeof content === "string") {
      // If the response is HTML, try to extract the text content
      const textContent = content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return textContent;
    }

    return content;
  } catch (error) {
    console.error("Error fetching LinkedIn content:", error);
    return null;
  }
}

function extractPostId(url: string, platform: Platform): string | null {
  if (platform === Platform.TWITTER) {
    // Extract tweet ID from Twitter URL
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  } else if (platform === Platform.LINKEDIN) {
    // Extract post ID from LinkedIn URL
    if (url.includes("linkedin.com/embed/feed/update/")) {
      // Handle both urn:li:share and urn:li:ugcPost formats
      const match = url.match(/urn:li:(?:share|ugcPost):(\d+)/);
      return match ? match[1] : null;
    } else {
      return url.split("/").pop()?.split("?")[0] || null;
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Detect platform from URL
    let platform: Platform;
    if (url.includes("twitter.com") || url.includes("x.com")) {
      platform = Platform.TWITTER;
    } else if (url.includes("linkedin.com")) {
      platform = Platform.LINKEDIN;
    } else {
      return NextResponse.json(
        { error: "Invalid platform. Only Twitter and LinkedIn are supported" },
        { status: 400 }
      );
    }

    // Extract post ID
    const postId = extractPostId(url, platform);
    if (!postId) {
      return NextResponse.json(
        { error: "Could not extract post ID from URL" },
        { status: 400 }
      );
    }

    // Check if the post has already been submitted by this user
    const existingPost = await prisma.post.findFirst({
      where: {
        userId: session.user.id,
        url: {
          contains: postId,
        },
      },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "You have already submitted this post" },
        { status: 400 }
      );
    }

    // Fetch and validate post content
    let postContent: string | null = null;
    if (platform === Platform.TWITTER) {
      postContent = await getTwitterContent(url);
    } else if (platform === Platform.LINKEDIN) {
      postContent = await getLinkedInContent(url);
    }

    if (!postContent) {
      return NextResponse.json(
        {
          error:
            "Could not fetch post content. Please ensure the post is public.",
        },
        { status: 400 }
      );
    }

    // Check for required hashtag
    const hasRequiredHashtag = postContent
      .toLowerCase()
      .includes("#0to100xengineer");
    if (!hasRequiredHashtag) {
      return NextResponse.json(
        { error: "Post must contain the hashtag #0to100xEngineer" },
        { status: 400 }
      );
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        url,
        platform,
        userId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all posts for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
