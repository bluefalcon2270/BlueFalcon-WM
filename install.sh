#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=================================================${NC}"
echo -e "${CYAN}   BlueFalcon WM - Fast Website Deployment       ${NC}"
echo -e "${CYAN}=================================================${NC}"

# Detect Public IP safely
DETECTED_IP=$(curl -s https://api.ipify.org)
# Check if the result is actually a valid IP format, otherwise default to 127.0.0.1
if [[ ! "$DETECTED_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    DETECTED_IP="127.0.0.1"
fi

get_server_ip() {
    read -p "Enter the server IP (Default: ${DETECTED_IP}): " SERVER_IP < /dev/tty
    if [ -z "$SERVER_IP" ]; then
        SERVER_IP=$DETECTED_IP
    fi
    echo -e "${GREEN}Using IP: $SERVER_IP${NC}"
}

install_dependencies() {
    echo -e "${YELLOW}Installing System Dependencies...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs nginx git
    npm install -g pm2
    echo -e "${GREEN}Dependencies installed successfully!${NC}"
}

deploy_website() {
    get_server_ip
    echo -e "${YELLOW}Deploying Website...${NC}"
    
    cd store || { echo -e "${RED}Error: 'store' directory not found!${NC}"; return; }

    # Setup Environment Variables
    echo -e "${YELLOW}Configuring .env file...${NC}"
    echo "DATABASE_URL=\"file:./dev.db\"" > .env
    echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env
    echo "NEXTAUTH_URL=\"http://$SERVER_IP\"" >> .env

    # Install Packages & Build
    echo -e "${YELLOW}Installing NPM packages...${NC}"
    npm install

    echo -e "${YELLOW}Setting up Database...${NC}"
    npx prisma generate
    npx prisma db push
    node prisma/seed.js

    echo -e "${YELLOW}Building Next.js (This may take a few minutes)...${NC}"
    npm run build

    # Setup PM2
    echo -e "${YELLOW}Starting PM2 Server...${NC}"
    pm2 delete store 2>/dev/null || true
    pm2 start npm --name "store" -- start
    pm2 save
    
    # Try to setup pm2 startup script silently
    echo -e "${YELLOW}Configuring PM2 to start on boot...${NC}"
    pm2 startup | tail -n 1 | bash 2>/dev/null

    # Setup Nginx
    echo -e "${YELLOW}Configuring Nginx...${NC}"
    cat <<EOF > /etc/nginx/sites-available/default
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    systemctl restart nginx
    
    cd ..
    echo -e "${GREEN}Website deployed successfully! Visit http://$SERVER_IP${NC}"
}

update_website() {
    echo -e "${YELLOW}Updating Website...${NC}"
    git pull
    cd store || { echo -e "${RED}Error: 'store' directory not found!${NC}"; return; }
    npm install
    npx prisma generate
    npx prisma db push
    node prisma/seed.js
    npm run build
    pm2 reload store
    cd ..
    echo -e "${GREEN}Website updated successfully!${NC}"
}

view_logs() {
    pm2 logs store
}

setup_domain() {
    echo -e "${YELLOW}Setting up Custom Domain...${NC}"
    read -p "Enter your domain name (e.g. example.com): " DOMAIN < /dev/tty
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}Domain cannot be empty!${NC}"
        return
    fi
    
    echo -e "${YELLOW}Configuring Nginx for $DOMAIN...${NC}"
    cat <<EOF > /etc/nginx/sites-available/default
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    systemctl restart nginx
    
    # Automatically install and configure HTTPS/SSL
    echo -e "${YELLOW}Securing website with Free SSL (HTTPS)...${NC}"
    apt-get install -y -q certbot python3-certbot-nginx
    
    # Run Certbot completely automatically without human interaction
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email --redirect
    
    echo -e "${GREEN}Domain and HTTPS setup complete! Your website is now secure at https://$DOMAIN${NC}"
}

# Command Line Arguments
case "$1" in
    update)
        update_website
        ;;
    logs)
        view_logs
        ;;
    domain)
        setup_domain
        ;;
    help)
        echo -e "${CYAN}Usage:${NC}"
        echo -e "  bash install.sh         - Full fresh installation (Dependencies -> Deploy -> Domain)"
        echo -e "  bash install.sh update  - Git Pull & Rebuild website"
        echo -e "  bash install.sh domain  - Setup Custom Domain & SSL only"
        echo -e "  bash install.sh logs    - View live PM2 logs"
        ;;
    *)
        # Default behavior: Full Installation
        echo -e "${CYAN}Starting Full Installation Process...${NC}"
        install_dependencies
        deploy_website
        echo ""
        setup_domain
        echo -e "${GREEN}Full Installation Complete!${NC}"
        ;;
esac
