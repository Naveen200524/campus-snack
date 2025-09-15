# Vercel Deployment Instructions

## Steps to Deploy to Vercel

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain  
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID

### 3. Firebase Configuration
Make sure your Firebase project has:
- **Authentication enabled** with Google provider
- **Authorized domains** including your Vercel domain (e.g., `your-app.vercel.app`)

### 4. Deploy
You can deploy in two ways:

#### Option A: Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project" 
3. Import your GitHub repository
4. Add environment variables
5. Deploy

#### Option B: Deploy via CLI
```bash
vercel --prod
```

## Important Notes

### Database
- The SQLite database will be recreated on each deployment
- Data will be seeded automatically with sample canteens and menu items
- For production, consider using a persistent database like PostgreSQL

### API Routes
- All API routes are now serverless functions in the `/api` directory
- Routes available:
  - `GET /api/canteens` - Get all canteens
  - `GET /api/canteens/[slug]` - Get specific canteen with menu
  - `POST /api/orders` - Create new order

### Troubleshooting
1. **Canteens not loading**: Check browser console for API errors
2. **Google Auth not working**: Verify Firebase environment variables
3. **Build errors**: Check that all dependencies are in package.json