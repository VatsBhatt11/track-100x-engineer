import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession({ request, ...authOptions });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the date range from query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Fetch posts within the date range
    const posts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfDay(new Date(startDate)),
          lte: endOfDay(new Date(endDate)),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group posts by date and count them
    const activityMap = new Map<string, number>();
    posts.forEach((post) => {
      const dateKey = post.createdAt.toISOString().split("T")[0];
      const currentCount = activityMap.get(dateKey) || 0;
      activityMap.set(dateKey, currentCount + 1);
    });

    // Convert Map to object for JSON response
    const activityData = Object.fromEntries(activityMap);

    return NextResponse.json(activityData);
  } catch (error) {
    console.error("Error fetching post activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
