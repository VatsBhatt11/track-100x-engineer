import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TwitterApi, TweetV2 } from "twitter-api-v2";

// Define interface for Twitter user
interface TwitterUser {
  id: string;
  username: string;
}

// Twitter API client setup
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");
const readOnlyClient = twitterClient.readOnly;

// Helper function to extract tweet ID from URL
function extractTweetId(tweetUrl: string): string | null {
  // Match patterns like https://twitter.com/username/status/1234567890123456789
  // or https://x.com/username/status/1234567890123456789
  const match = tweetUrl.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/);
  return match ? match[1] : null;
}

// Interfaces for Twitter API types
interface TwitterHashtagEntity {
  start: number;
  end: number;
  tag: string;
}

// Helper function to check if a tweet contains the target hashtag
function containsTargetHashtag(tweet: TweetV2): boolean {
  // First check the tweet text directly
  if (tweet.text) {
    const text = tweet.text.toLowerCase();
    if (
      text.includes("#0to100xengineer") ||
      text.includes("#0to100x") ||
      text.includes("#0to100xengineers")
    ) {
      return true;
    }
  }

  // Then check the entities if available
  const hashtags = tweet.entities?.hashtags || [];
  if (hashtags.length > 0) {
    return hashtags.some((tag: TwitterHashtagEntity) => {
      const tagLower = tag.tag.toLowerCase();
      return (
        tagLower === "0to100xengineer" ||
        tagLower === "0to100x" ||
        tagLower === "0to100xengineers"
      );
    });
  }

  return false;
}

// Function to fetch tweets for a user
async function fetchUserTweets(username: string): Promise<string[]> {
  try {
    // Get user ID from username
    const user = await readOnlyClient.v2.userByUsername(username);
    if (!user.data) {
      console.error(`User not found: ${username}`);
      return [];
    }

    // We'll use the username directly for the search query
    // const userId = user.data.id;

    // Get tweets from the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Format date for Twitter API: YYYY-MM-DDTHH:mm:ssZ
    const startTime = sevenDaysAgo.toISOString();

    // Fetch tweets with hashtag
    const tweets = await readOnlyClient.v2.search(
      `${username} #0to100xengineer`,
      {
        "tweet.fields": ["created_at", "entities"],
        "user.fields": ["username"],
        expansions: ["author_id"],
        max_results: 100,
        start_time: startTime,
      }
    );

    console.log(`Fetched tweets for ${username}:`, tweets.data.data);
    console.log(`Meta data for ${username}:`, tweets.meta);

    // Extract tweet URLs
    const tweetUrls: string[] = [];
    // Ensure tweets.data is an array before iterating
    // Convert to a proper array to avoid TypeScript iterator issues
    const tweetsArray = Array.isArray(tweets.data.data) ? tweets.data.data : [];
    for (const tweet of tweetsArray) {
      // Ensure users is an array before using find
      const usersArray = Array.isArray(tweets.includes?.users)
        ? tweets.includes.users
        : [];
      const author = usersArray.find(
        (user: TwitterUser) => user.id === tweet.author_id
      );

      // Skip tweets that don't have an author or don't match the target username
      if (!author || author.username.toLowerCase() !== username.toLowerCase()) {
        if (author) {
          console.warn(
            `Tweet ${tweet.id} by ${author.username} does not match target username ${username}. Skipping.`
          );
        }
        continue;
      }

      // Only process tweets that contain the target hashtag and are from the target user
      if (containsTargetHashtag(tweet)) {
        const tweetUrl = `https://twitter.com/${author.username}/status/${tweet.id}`;
        tweetUrls.push(tweetUrl);
      }
    }

    return tweetUrls;
  } catch (error) {
    console.error(`Error fetching tweets for ${username}:`, error);
    return [];
  }
}

// Main function to process all users with Twitter usernames
async function processTweetFetching() {
  try {
    // Get all users with Twitter usernames
    const users = await prisma.user.findMany({
      where: {
        twitterUsername: {
          not: null,
        },
      },
      select: {
        id: true,
        twitterUsername: true,
      },
    });

    console.log(`Found ${users.length} users with Twitter usernames`);

    // Process each user
    for (const user of users) {
      if (!user.twitterUsername) continue;

      console.log(
        `Processing user with Twitter username: ${user.twitterUsername}`
      );

      // Fetch tweets
      const tweetUrls = await fetchUserTweets(user.twitterUsername);
      console.log(
        `Found ${tweetUrls.length} tweets with hashtag for ${user.twitterUsername}`
      );

      // Store each tweet URL
      for (const tweetUrl of tweetUrls) {
        // Check if post already exists
        const tweetId = extractTweetId(tweetUrl);
        if (!tweetId) continue;

        const existingPost = await prisma.post.findFirst({
          where: {
            url: tweetUrl,
          },
        });

        if (!existingPost) {
          // Create new post
          await prisma.post.create({
            data: {
              url: tweetUrl,
              platform: "TWITTER",
              userId: user.id,
              createdAt: new Date(),
            },
          });
          console.log(`Created new post for tweet: ${tweetUrl}`);
        } else {
          console.log(`Post already exists for tweet: ${tweetUrl}`);
        }
      }
    }

    return { success: true, message: `Processed ${users.length} users` };
  } catch (error) {
    console.error("Error in tweet fetching process:", error);
    return { success: false, error: String(error) };
  }
}

// API route handler - protected by secret key
// This endpoint is configured to be called by Vercel CRON in vercel.json
// Schedule: Daily at 6:00 PM UTC (12:00 AM IST)
export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // For Vercel CRON jobs, the authorization is handled automatically
    // But we still check for the secret for manual API calls and other environments
    if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && !request.headers.get("x-vercel-cron"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process tweet fetching
    const result = await processTweetFetching();

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in CRON job:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
