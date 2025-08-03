# Twitter Integration for #0to100xengineer

This document explains how to set up and use the Twitter integration feature for tracking posts with the hashtag `#0to100xengineer`.

## Overview

The Twitter integration allows the platform to automatically fetch tweets from users who have provided their Twitter username during signup. The system looks for tweets containing the hashtag `#0to100xengineer` (or variations like `#0to100x` and `#0to100XEngineer`) and stores them in the database.

## Features

1. **Twitter Username Collection**: Users can provide their Twitter username during signup.
2. **Automated Tweet Fetching**: A CRON job runs daily at 12 AM IST to fetch tweets from the past 7 days.
3. **Hashtag Tracking**: The system specifically looks for tweets containing the hashtag `#0to100xengineer`.
4. **Post Storage**: Valid tweets are stored in the database and associated with the user's account.

## Setup Instructions

### 1. Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```
# Twitter API
TWITTER_BEARER_TOKEN="your-twitter-bearer-token"

# CRON Job Authentication
CRON_SECRET="your-cron-secret-key"
```

### 2. Twitter API Access

1. Create a Twitter Developer account at [developer.twitter.com](https://developer.twitter.com/)
2. Create a new project and app
3. Generate a Bearer Token for your app
4. Add the Bearer Token to your `.env` file

### 3. Setting Up the CRON Job

#### Option 1: Using a server's crontab (Linux/Unix)

1. Open the crontab editor:
   ```
   crontab -e
   ```

2. Add the following line to run the job at 12 AM IST (adjust the time according to your server's timezone):
   ```
   0 18 * * * /bin/bash /path/to/your/project/scripts/fetch-tweets-cron.sh >> /path/to/your/logs/twitter-cron.log 2>&1
   ```
   Note: 6:30 PM UTC = 12:00 AM IST

#### Option 2: Using a scheduled task on Windows

1. Open Task Scheduler
2. Create a new task that runs the `fetch-tweets-cron.sh` script daily at the equivalent of 12 AM IST

#### Option 3: Using Vercel CRON (Recommended for this project)

This project is configured to use Vercel CRON Jobs through the `vercel.json` file:

1. The configuration is already set up in the `vercel.json` file:
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-tweets",
      "schedule": "0 18 * * *"
    }
  ]
}
```

2. This configures a CRON job to run at 6:00 PM UTC (12:00 AM IST) daily.

3. The CRON job will automatically call the `/api/cron/fetch-tweets` endpoint with the proper authentication.

4. Make sure to set the `CRON_SECRET` environment variable in your Vercel project settings.

5. No additional setup is required - Vercel will handle the scheduling and execution.

#### Other Cloud Options

You can also use other services like:
- AWS Lambda with EventBridge
- Google Cloud Scheduler
- Heroku Scheduler

Configure these services to make an HTTP request to your API endpoint:
```
GET /api/cron/fetch-tweets
```
with the header:
```
Authorization: Bearer your-cron-secret-key
```

## Testing

To test the Twitter integration manually:

1. Make sure your environment variables are set up correctly
2. Run the following command:

```bash
curl -X GET -H "Authorization: Bearer your-cron-secret-key" http://localhost:3000/api/cron/fetch-tweets
```

## Troubleshooting

### Common Issues

1. **Twitter API Rate Limits**: The Twitter API has rate limits. If you have many users, consider implementing a queue system.

2. **Missing Tweets**: Tweets might be missed if:
   - They're older than 7 days (Twitter API limitation)
   - The hashtag is misspelled
   - The user's account is private

3. **Authentication Errors**: Ensure your `TWITTER_BEARER_TOKEN` is valid and has not expired.

## Security Considerations

1. Keep your `TWITTER_BEARER_TOKEN` and `CRON_SECRET` secure
2. The CRON job API endpoint is protected by the `CRON_SECRET` to prevent unauthorized access
3. User data is handled according to privacy best practices