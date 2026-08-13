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
    server_name $DOMAIN www.$DOMAIN;

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
    
    echo ""
    read -p "Do you want to install a free SSL certificate (HTTPS) using Certbot? (y/n): " INSTALL_SSL < /dev/tty
    if [[ "$INSTALL_SSL" == "y" || "$INSTALL_SSL" == "Y" ]]; then
        echo -e "${YELLOW}Installing Certbot...${NC}"
        apt-get install -y certbot python3-certbot-nginx
        echo -e "${YELLOW}Running Certbot (Follow the prompts)...${NC}"
        certbot --nginx -d $DOMAIN -d www.$DOMAIN
    fi
    
    echo -e "${GREEN}Domain setup complete! Your website should now be accessible at https://$DOMAIN${NC}"
}

while true; do
    echo ""
    echo -e "${CYAN}Please select an option:${NC}"
    echo "1) Install System Dependencies (Node.js, PM2, Nginx)"
    echo "2) Deploy Website (Fresh Install)"
    echo "3) Update Website (Git Pull & Rebuild)"
    echo "4) View Live Logs"
    echo "5) Setup Custom Domain & SSL"
    echo "6) Exit"
    read -p "Choice [1-6]: " choice < /dev/tty
    echo ""

    case $choice in
        1) install_dependencies ;;
        2) deploy_website ;;
        3) update_website ;;
        4) view_logs ;;
        5) setup_domain ;;
        6) echo "Exiting..."; exit 0 ;;
        *) echo -e "${RED}Invalid choice!${NC}" ;;
    esac
done
