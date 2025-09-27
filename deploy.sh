#!/bin/bash

# Set project
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME="mealsync"

echo "🚀 Deploying SchoolMeals A2A to Cloud Run..."

# Build and submit
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY" \
  --memory 512Mi \
  --max-instances 100

echo "✅ Deployment complete!"
echo "Service URL: https://$SERVICE_NAME-xxxxx.a.run.app"

