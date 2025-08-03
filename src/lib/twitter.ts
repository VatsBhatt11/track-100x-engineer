/**
 * Twitter API Integration Module
 * 
 * This module provides functionality for interacting with the Twitter API
 * to fetch tweets with the hashtag #0to100xengineer.
 */

import { TwitterApi, TweetV2, TweetEntityHashtagV2 } from 'twitter-api-v2';

/**
 * Initialize the Twitter API client with the bearer token from environment variables.
 * This client is read-only and can only perform GET requests.
 */
export const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '');
export const readOnlyClient = twitterClient.readOnly;

/**
 * Extract a tweet ID from a Twitter URL.
 * 
 * @param tweetUrl - The full URL of a tweet
 * @returns The tweet ID as a string, or null if the URL is invalid
 */
export function extractTweetId(tweetUrl: string): string | null {
  // Match patterns like https://twitter.com/username/status/1234567890123456789
  // or https://x.com/username/status/1234567890123456789
  const match = tweetUrl.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/);
  return match ? match[1] : null;
}



/**
 * Check if a tweet contains the target hashtag (#0to100xengineer or variations).
 * 
 * @param tweet - The tweet object from the Twitter API
 * @returns True if the tweet contains the target hashtag, false otherwise
 */
export function containsTargetHashtag(tweet: TweetV2): boolean {
  const hashtags = tweet.entities?.hashtags || [];
  return hashtags.some((tag: TweetEntityHashtagV2) => 
    tag.tag.toLowerCase() === '0to100xengineer' || 
    tag.tag.toLowerCase() === '0to100x' || 
    tag.tag.toLowerCase() === '0to100xengineers'
  );
}

/**
 * Fetch tweets from a specific user that contain the target hashtag.
 * 
 * @param username - The Twitter username (without @ symbol)
 * @returns An array of tweet URLs that contain the target hashtag
 */
export async function fetchUserTweets(username: string): Promise<string[]> {
  try {
    // Get user ID from username
    const user = await readOnlyClient.v2.userByUsername(username);
    if (!user.data) {
      console.error(`User not found: ${username}`);
      return [];
    }
    
    // We have the user ID but we'll use the username for constructing tweet URLs
    // const userId = user.data.id;
    
    // Get tweets from the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Format date for Twitter API: YYYY-MM-DDTHH:mm:ssZ
    const startTime = sevenDaysAgo.toISOString();
    
    // Fetch tweets with hashtag
    const tweets = await readOnlyClient.v2.search(
      `from:${username} #0to100xengineer OR #0to100x OR #0to100XEngineer`, 
      {
        'tweet.fields': ['created_at', 'entities'],
        'user.fields': ['username'],
        'expansions': ['author_id'],
        'max_results': 100,
        'start_time': startTime
      }
    );
    
    // Extract tweet URLs
    const tweetUrls: string[] = [];
    for await (const tweet of tweets) {
      if (containsTargetHashtag(tweet)) {
        const tweetUrl = `https://twitter.com/${username}/status/${tweet.id}`;
        tweetUrls.push(tweetUrl);
      }
    }
    
    return tweetUrls;
  } catch (error) {
    console.error(`Error fetching tweets for ${username}:`, error);
    return [];
  }
}