// Test script for Twitter API integration
import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';

// Check if bearer token is available
if (!process.env.TWITTER_BEARER_TOKEN) {
  console.error('Error: TWITTER_BEARER_TOKEN is not set in environment variables');
  process.exit(1);
}

// Initialize Twitter client
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
const readOnlyClient = twitterClient.readOnly;

// Test username to search for
const testUsername = process.argv[2] || '100xEngineers'; // Default to 100xEngineers if no username provided

async function testTwitterApi() {
  try {
    console.log(`Testing Twitter API with username: ${testUsername}`);
    
    // Test 1: Get user by username
    console.log('\nTest 1: Fetching user by username...');
    const user = await readOnlyClient.v2.userByUsername(testUsername);
    
    if (!user.data) {
      console.error(`User not found: ${testUsername}`);
      process.exit(1);
    }
    
    console.log('User found:', JSON.stringify(user.data, null, 2));
    // Store user ID for reference but we'll use username for the search
    const _userId = user.data.id;
    
    // Test 2: Search for tweets with hashtag
    console.log('\nTest 2: Searching for tweets with hashtag...');
    
    // Get tweets from the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startTime = sevenDaysAgo.toISOString();
    
    console.log(`Searching for tweets from ${testUsername} with hashtag #0to100xengineer since ${startTime}`);
    
    const tweets = await readOnlyClient.v2.search(
      `from:${testUsername} #0to100xengineer OR #0to100x OR #0to100XEngineer`, 
      {
        'tweet.fields': ['created_at', 'entities'],
        'user.fields': ['username'],
        'expansions': ['author_id'],
        'max_results': 10,
        'start_time': startTime
      }
    );
    
    // Process results
    let tweetCount = 0;
    for await (const tweet of tweets) {
      tweetCount++;
      console.log('\nFound tweet:', JSON.stringify(tweet, null, 2));
      
      // Check for hashtags
      const hashtags = tweet.entities?.hashtags || [];
      console.log('Hashtags:', hashtags.map(tag => tag.tag).join(', '));
      
      // Create tweet URL
      const tweetUrl = `https://twitter.com/${testUsername}/status/${tweet.id}`;
      console.log('Tweet URL:', tweetUrl);
    }
    
    if (tweetCount === 0) {
      console.log('No tweets found with the hashtag in the last 7 days.');
      console.log('This is normal if the user hasn\'t tweeted with the hashtag recently.');
    } else {
      console.log(`\nFound ${tweetCount} tweets with the hashtag.`);
    }
    
    console.log('\nTwitter API test completed successfully!');
  } catch (error) {
    console.error('Error testing Twitter API:', error);
    process.exit(1);
  }
}

testTwitterApi();