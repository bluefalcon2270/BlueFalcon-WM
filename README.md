# BlueFalcon WM

A fast, interactive deployment system for the Premium Clothing Store e-commerce application.

## Quick Install on VPS

To deploy this website onto a fresh Ubuntu/Debian VPS, simply run the following commands:

```bash
git clone https://github.com/bluefalcon2270/BlueFalcon-WM.git
cd BlueFalcon-WM
chmod +x install.sh
./install.sh
```

## Menu Options

Once you run `./install.sh`, you will be presented with a menu:
1. **Install System Dependencies**: Installs Node.js, PM2, and Nginx. (Run this first on a fresh VPS)
2. **Deploy Website**: Runs a fresh installation of the Next.js app, sets up the database, and configures the web server.
3. **Update Website**: Pulls the latest commits from GitHub and cleanly rebuilds the application.
4. **View Live Logs**: Tails the PM2 logs to view live traffic and errors.
