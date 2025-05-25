# AWS Amplify Deployment Guide

## Prerequisites

1. AWS Account with Amplify access
2. GitHub repository with your code
3. Node.js 18+ (for local development)

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for AWS Amplify deployment"
   git push origin main
   ```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Choose "GitHub" as your repository service
   - Authorize AWS Amplify to access your GitHub account
   - Select your repository and branch (usually `main`)

3. **Configure Build Settings**
   - AWS Amplify should automatically detect the `amplify.yml` file
   - If not, use these settings:
     - Build command: `npm run build`
     - Base directory: `/` (root)
     - Output directory: `build`

4. **Deploy**
   - Click "Save and deploy"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your app will be available at the provided Amplify URL

### Option 2: Manual Deployment

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload to Amplify**
   - Go to AWS Amplify Console
   - Click "New app" → "Deploy without Git provider"
   - Upload the `build` folder as a ZIP file

## Build Configuration

The project includes:
- `amplify.yml` - AWS Amplify build configuration
- Static adapter configuration in `svelte.config.js`
- Prerendering enabled for optimal performance

## Environment Variables

No environment variables are required for this project as it uses:
- Open-Meteo API (no API key needed)
- Client-side localStorage for data persistence

## Custom Domain (Optional)

1. In AWS Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Follow the instructions to configure your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Build Fails
- Check that Node.js version is 18+
- Ensure all dependencies are in `package.json`
- Verify `amplify.yml` configuration

### App Doesn't Load
- Check browser console for errors
- Verify that the build output contains `index.html`
- Ensure static adapter is properly configured

### Weather Data Not Loading
- Check browser network tab for API calls
- Verify Open-Meteo API is accessible
- Check for CORS issues (shouldn't occur with Open-Meteo)

## Performance Optimization

The app is optimized for AWS Amplify with:
- Static site generation (SSG)
- Client-side rendering for dynamic content
- Efficient caching strategies
- Compressed assets

## Monitoring

Monitor your app through:
- AWS Amplify Console (build logs, metrics)
- Browser DevTools (performance, network)
- AWS CloudWatch (if enabled)

## Cost Considerations

AWS Amplify pricing includes:
- Build minutes (free tier: 1000 minutes/month)
- Data transfer (free tier: 15GB/month)
- Storage (free tier: 5GB)

For a weather dashboard, you should stay well within free tier limits. 