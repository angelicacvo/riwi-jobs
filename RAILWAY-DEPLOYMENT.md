# Riwi Jobs API - Deployment to Railway

## Prerequisites
- Railway account (https://railway.app)
- GitHub account
- Supabase PostgreSQL database configured

---

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

2. **Verify required files exist:**
- ✅ `Dockerfile` - Multi-stage build configuration
- ✅ `package.json` - Dependencies and scripts
- ✅ `.dockerignore` - Optimized build context
- ✅ `.env.example` - Environment variables template

---

## Step 2: Configure Railway Project

### 2.1 Create New Project in Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `riwi-jobs` repository
5. Railway will detect the Dockerfile automatically

### 2.2 Configure Environment Variables

In Railway dashboard, go to **Variables** and add:

```bash
# Node Environment
NODE_ENV=production
PORT=3000

# Supabase Database (PostgreSQL)
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.pgevbqljhwplnnvgkibj
DB_PASSWORD=your_supabase_password
DB_NAME=postgres

# JWT Configuration
JWT_SECRET=your_production_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# API Key Security
API_KEY=your_production_api_key_here
```

**Important:** 
- Use strong secrets for `JWT_SECRET` and `API_KEY` in production
- Get your Supabase credentials from your Supabase dashboard

---

## Step 3: Deploy

1. **Railway will automatically:**
   - Build your Docker image
   - Deploy the container
   - Expose a public URL
   - Monitor health checks

2. **Wait for deployment** (usually 3-5 minutes)

3. **Get your deployment URL:**
   - Example: `https://riwi-jobs-production.up.railway.app`

---

## Step 4: Run Database Seeders

After successful deployment, you need to seed the database with initial users (Admin, Manager).

### Option 1: Using Railway CLI

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Link to your project:**
```bash
railway link
```

4. **Run seeders:**
```bash
railway run npm run seed
```

### Option 2: Using Railway Dashboard Shell

1. Go to your service in Railway dashboard
2. Click on **"Shell"** tab
3. Run the command:
```bash
npm run seed
```

---

## Step 5: Verify Deployment

### Test API Endpoints

1. **Health Check:**
```bash
curl https://your-app.up.railway.app
```

2. **Swagger Documentation:**
```
https://your-app.up.railway.app/api/docs
```

3. **Login with seeded admin:**
```bash
curl -X POST https://your-app.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "email": "admin@riwi.io",
    "password": "Admin123!"
  }'
```

---

## Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** in Railway dashboard
2. Click **"Generate Domain"** for a better URL
3. Or add your **Custom Domain** if you have one

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Application port | `3000` |
| `DB_HOST` | Supabase host | `aws-1-us-east-2.pooler.supabase.com` |
| `DB_PORT` | Supabase port | `6543` |
| `DB_USER` | Database user | `postgres.xxxxx` |
| `DB_PASSWORD` | Database password | Your Supabase password |
| `DB_NAME` | Database name | `postgres` |
| `JWT_SECRET` | JWT secret key | Strong random string |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `API_KEY` | API key for requests | Strong random string |

---

## Monitoring and Logs

### View Application Logs
1. Go to Railway dashboard
2. Select your service
3. Click **"Logs"** tab
4. Monitor in real-time

### Common Logs to Watch:
- ✅ `Database connected successfully`
- ✅ `Nest application successfully started`
- ✅ `Application is running on: http://localhost:3000`
- ✅ `Swagger docs available at: http://localhost:3000/api/docs`

---

## Troubleshooting

### Issue: Build fails

**Solution:**
- Check Dockerfile syntax
- Verify package.json has all dependencies
- Check Railway build logs

### Issue: Database connection error

**Solution:**
- Verify Supabase credentials are correct
- Check if your IP is allowed in Supabase (allow 0.0.0.0/0 for Railway)
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD are correct

### Issue: Application crashes after deployment

**Solution:**
- Check logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure PORT is set to 3000
- Check that seeders have been run

### Issue: 401 Unauthorized on all endpoints

**Solution:**
- Verify API_KEY environment variable is set
- Use the correct API key in `x-api-key` header
- Check JWT_SECRET is configured

---

## Railway CLI Commands Reference

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs

# Run commands in Railway environment
railway run npm run seed
railway run npm test

# Open project in browser
railway open

# Deploy manually
railway up
```

---

## Continuous Deployment

Railway automatically redeploys your application when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```
3. Railway detects changes and redeploys automatically
4. Monitor deployment in Railway dashboard

---

## Production Best Practices

### Security
- ✅ Use strong secrets for JWT_SECRET and API_KEY
- ✅ Keep environment variables in Railway (never commit .env)
- ✅ Enable Supabase connection pooling
- ✅ Use HTTPS only (Railway provides automatically)

### Performance
- ✅ Docker multi-stage build reduces image size
- ✅ Non-root user in container (security)
- ✅ Health checks configured
- ✅ Database connection pooling

### Monitoring
- ✅ Check Railway metrics (CPU, Memory)
- ✅ Monitor application logs
- ✅ Set up alerts in Railway dashboard

---

## Cost Optimization

Railway offers:
- **Free tier**: $5 credit/month
- **Pro plan**: $20/month + usage

Tips to optimize costs:
- Use Hobby plan if available
- Monitor resource usage in dashboard
- Scale down during low traffic

---

## Support and Resources

- **Railway Documentation**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Supabase Documentation**: https://supabase.com/docs
- **NestJS Documentation**: https://docs.nestjs.com

---

## Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Create Railway project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Wait for deployment
- [ ] Run database seeders
- [ ] Test Swagger documentation
- [ ] Test login with admin credentials
- [ ] Verify all endpoints work
- [ ] Share public URL

---

**Congratulations!** Your Riwi Jobs API is now deployed on Railway 🚀
