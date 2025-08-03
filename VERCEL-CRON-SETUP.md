# Vercel CRON Setup for Tweet Fetching

This document provides instructions for deploying and verifying the Vercel CRON job for fetching tweets with the hashtag `#0to100xengineer`.

## Deployment Steps

1. **Push your code to GitHub**
   - Make sure all changes, including the `vercel.json` file, are committed and pushed to your repository.

2. **Deploy to Vercel**
   - If you haven't already, connect your GitHub repository to Vercel.
   - Deploy your project through the Vercel dashboard or CLI.

3. **Set Environment Variables**
   - In the Vercel dashboard, go to your project settings.
   - Add the following environment variables:
     ```
     TWITTER_BEARER_TOKEN=your-twitter-bearer-token
     CRON_SECRET=your-cron-secret-key
     ```
   - These values should match what you use in your local development environment.

4. **Verify CRON Configuration**
   - After deployment, go to the Vercel dashboard.
   - Navigate to your project settings.
   - Look for the "Cron Jobs" section to verify that your CRON job is listed and active.
   - You should see a job configured to run at `0 18 * * *` (6:00 PM UTC) targeting the `/api/cron/fetch-tweets` endpoint.

## Monitoring and Troubleshooting

### Viewing CRON Job Logs

1. In the Vercel dashboard, go to your project.
2. Navigate to the "Logs" section.
3. Filter logs by "Cron" to see only CRON job executions.
4. Check for any errors or issues in the logs.

### Testing the Endpoint Manually

You can test the endpoint manually to ensure it's working correctly:

```bash
curl -X GET -H "Authorization: Bearer your-cron-secret-key" https://your-vercel-deployment-url.vercel.app/api/cron/fetch-tweets
```

Replace `your-cron-secret-key` with your actual CRON secret and `your-vercel-deployment-url` with your Vercel deployment URL.

### Common Issues

1. **CRON Job Not Running**
   - Verify that the `vercel.json` file is correctly formatted and deployed.
   - Check that the path in the CRON configuration matches your API route.

2. **Authentication Errors**
   - Ensure the `CRON_SECRET` environment variable is set correctly in Vercel.
   - The API route is configured to accept requests from Vercel CRON using the `x-vercel-cron` header.

3. **Twitter API Issues**
   - Check that your `TWITTER_BEARER_TOKEN` is valid and has the necessary permissions.
   - Verify that the Twitter API is not rate-limiting your requests.

## Adjusting the Schedule

If you need to change the schedule, update the `schedule` field in `vercel.json`:

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

The schedule uses standard crontab syntax:
- `0 18 * * *` = 6:00 PM UTC daily (12:00 AM IST)
- `0 */12 * * *` = Every 12 hours
- `0 0,12 * * *` = Twice daily at midnight and noon UTC

After changing the schedule, redeploy your application for the changes to take effect.