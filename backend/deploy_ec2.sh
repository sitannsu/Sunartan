#!/bin/bash

# ==============================================================================
# Sunartn AWS EC2 Deployment Script (Ubuntu Server)
# This script automates the installation of:
# 1. PostgreSQL 16
# 2. Node.js v20 & npm
# 3. PM2 Process Manager
# 4. Nginx Reverse Proxy
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Starting Sunartn System Installation ==="

# 1. Update system packages
echo "Updating package lists..."
sudo apt update && sudo apt upgrade -y

# 2. Install PostgreSQL
echo "Installing PostgreSQL 16..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create Database and User
DB_NAME="sunartn"
DB_USER="sunartn_user"
DB_PASS="secure_password_123" # CHANGE THIS IN PRODUCTION

echo "Provisioning PostgreSQL Database: $DB_NAME..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 3. Install Node.js v20
echo "Installing Node.js v20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 4. Install PM2 globally
echo "Installing PM2 Process Manager..."
sudo npm install -g pm2

# 5. Install Nginx
echo "Installing Nginx Web Server..."
sudo apt install -y nginx

# Configure Nginx Reverse Proxy
NGINX_CONF="/etc/nginx/sites-available/sunartn"

echo "Configuring Nginx Reverse Proxy..."
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name _; # Responds to all requests (replace with domain if available)

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx config and disable default site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl restart nginx

echo "=== System Installation Completed Successfully ==="
echo ""
echo "Next Steps to Deploy Backend:"
echo "1. Run database migrations and seeds:"
echo "   export DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public\""
echo "   npx prisma migrate deploy"
echo "   npx prisma db seed"
echo "2. Build & run NestJS backend:"
echo "   npm run build"
echo "   pm2 start dist/src/main.js --name \"sunartn-backend\""
echo "3. Save PM2 state for system reboot restarts:"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "Your API is now accessible on port 80: http://<your-ec2-public-ip>/api"
