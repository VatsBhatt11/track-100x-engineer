import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";

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

    // Check if the URL has already been submitted
    const existingPost = await prisma.post.findUnique({
      where: { url },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "This post has already been submitted" },
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
export async function GET(request: Request) {
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
