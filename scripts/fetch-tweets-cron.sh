#!/bin/bash

# This script is designed to be run as a CRON job at 12 AM IST daily
# It calls the API endpoint to fetch tweets with the hashtag #0to100xengineer

# Load environment variables if needed
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set the API URL - replace with your actual domain in production
API_URL="http://localhost:3000/api/cron/fetch-tweets"

# Make the API call with the secret token for authentication
curl -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  $API_URL

# Log the result
echo "Tweet fetching CRON job completed at $(date)"