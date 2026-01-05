# Docker Deployment Guide for Riwi Jobs API

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- Supabase account with database created
- `.env` file configured with Supabase credentials

## Configuration

### 1. Environment Variables

Create a `.env` file in the project root with your Supabase connection details:

```bash
# Node Environment
NODE_ENV=production
PORT=3000

# Supabase Database Connection
DB_HOST=db.your-supabase-project.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

# API Key
API_KEY=riwi-2024-secret-key-pro
```

### 2. Build the Docker Image

```bash
docker-compose build
```

Or build manually:

```bash
docker build -t riwi-jobs-api .
```

### 3. Run the Application

Start the application with Docker Compose:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`

### 4. Check Application Status

View logs:
```bash
docker-compose logs -f api
```

Check container status:
```bash
docker-compose ps
```

Check health status:
```bash
docker inspect riwi-jobs-api | grep -A 10 "Health"
```

### 5. Run Database Seeders

Once the container is running, execute seeders:

```bash
docker-compose exec api npm run seed
```

### 6. Stop the Application

```bash
docker-compose down
```

## Docker Commands

### Development

Run in development mode (not recommended for production):
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production

Run in production mode:
```bash
docker-compose up -d
```

### Rebuild after code changes

```bash
docker-compose up -d --build
```

### View logs

```bash
# All logs
docker-compose logs -f

# Only API logs
docker-compose logs -f api
```

### Execute commands inside container

```bash
# Open shell
docker-compose exec api sh

# Run specific command
docker-compose exec api npm run seed
```

## Troubleshooting

### Container won't start

1. Check logs:
   ```bash
   docker-compose logs api
   ```

2. Verify environment variables:
   ```bash
   docker-compose config
   ```

3. Check Supabase connection:
   ```bash
   docker-compose exec api node -e "console.log(process.env.DB_HOST)"
   ```

### Database connection issues

1. Verify Supabase credentials in `.env`
2. Check if your IP is allowed in Supabase dashboard
3. Ensure Supabase database is running
4. Test connection from container:
   ```bash
   docker-compose exec api npm run typeorm -- query "SELECT NOW()"
   ```

### Port already in use

Change the port in `.env` or `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Host:Container
```

## Health Check

The container includes a health check that runs every 30 seconds:

```bash
curl http://localhost:3000/health
```

## Multi-Stage Build Benefits

The Dockerfile uses multi-stage builds for:
- **Smaller image size**: Only production dependencies included
- **Better security**: No build tools in final image
- **Faster builds**: Leverages Docker layer caching
- **Non-root user**: Application runs as `nestjs` user

## Production Recommendations

1. **Use secrets management**: Don't commit `.env` file
2. **SSL/TLS**: Use reverse proxy (nginx) for HTTPS
3. **Resource limits**: Add memory/CPU limits in docker-compose.yml
4. **Monitoring**: Integrate with monitoring tools
5. **Backup**: Ensure Supabase backups are configured
6. **Updates**: Regularly update base Node.js image

## Example: Production docker-compose.yml with limits

```yaml
services:
  api:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Deployment to Cloud

### Deploy to AWS ECS

```bash
# Build for ARM64 (if using AWS Graviton)
docker buildx build --platform linux/arm64 -t riwi-jobs-api .
```

### Deploy to Google Cloud Run

```bash
gcloud run deploy riwi-jobs-api \
  --source . \
  --platform managed \
  --region us-central1
```

### Deploy to Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name riwi-jobs-api \
  --image riwi-jobs-api \
  --dns-name-label riwi-jobs
```

## Support

For issues related to:
- **Docker**: Check Docker documentation
- **Supabase**: Verify database configuration
- **Application**: Check application logs and README.md
