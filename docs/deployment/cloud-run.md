# Cloud Run Deployment Guide

This guide describes how to deploy the CarbonCoach application to Google Cloud Run using the multi-stage Dockerfile.

## Prerequisites

- Docker installed locally (or via Cloud Build).
- Google Cloud SDK (`gcloud`) installed and authenticated.
- A Google Cloud Project with the Cloud Run API and Artifact Registry enabled.

## Environment Variables

Cloud Run requires the following environment variables to be set securely (e.g. via Secret Manager or Cloud Run Environment Variables):

- `NODE_ENV`: Should be set to `production`.
- `PORT`: Handled automatically by Cloud Run (defaults to `8080`).
- `GEMINI_API_KEY`: Your valid Google Gemini API Key.
- `GEMINI_MODEL`: (Optional) Defaults to `gemini-2.5-flash-lite`.
- `ALLOWED_ORIGINS`: (Optional) Comma-separated list of allowed CORS origins. If unset, requests missing `Origin` or unmatched origins may be blocked if cross-origin.

## Deployment Steps

1. **Build the Docker Image**
   You can test the build locally before submitting to Cloud Build:

```bash
npm run docker:build
```

2. **Submit to Cloud Build**
   Assuming you are using Artifact Registry in `us-central1` and a project named `my-gcp-project`:

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/my-gcp-project/my-repo/carboncoach .
```

3. **Deploy to Cloud Run**
   Deploy the newly built image:

```bash
gcloud run deploy carboncoach-service \
  --image us-central1-docker.pkg.dev/my-gcp-project/my-repo/carboncoach \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 2 \
  --memory 512Mi \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=my-gemini-key-secret:latest"
```

## Verification

1. Access the deployed URL output by the `gcloud run deploy` command.
2. Ensure the UI loads.
3. Check the health endpoint at `GET /health` to confirm the service is alive:

```json
{
  "status": "ok",
  "service": "carboncoach-api",
  "providerConfigured": true,
  "coachMode": "gemini"
}
```

4. Test the Coach API functionality within the app to ensure LLM interactions succeed.

## Rollback Guidance

If the deployment fails or causes regressions, Cloud Run makes it easy to rollback to the previous revision:

```bash
gcloud run services update-traffic carboncoach-service --to-latest=false
```

Then use the Google Cloud Console to allocate 100% of traffic to the last known good revision.
