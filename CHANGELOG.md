# Changelog

All notable changes to the BlueFalcon WM project will be documented in this file.

## [v1.1] - Feature Expansion
- **Smart Authentication**: Unified login/signup flow with username or email auto-detection.
- **Admin Settings**: Added Profile Settings to the Admin Dashboard (can now update username & password).
- **User Profiles**: Added `/profile` page with account details, email verification status, and Order History.
- **Shop Enhancements**: Added Search bar and Category filtering to the main product catalog.
- **Image Uploads**: Admins can now directly upload image files from their computer for new products.
- **Analytics**: Added an interactive Revenue Analytics bar chart to the Admin Dashboard.
- **Stripe Checkout**: Added a simulated credit card payment form to the cart checkout flow.

## [v1.0] - Initial Release
- Initialized the repository structure.
- Developed the full-stack Next.js E-Commerce template (Premium Clothing Store) with NextAuth, Prisma, and local SQLite database.
- Designed custom responsive UI components using Vanilla CSS (Global Design System).
- Added `install.sh`: An interactive Bash menu for installing system dependencies (Node, PM2, Nginx), deploying the website, pulling updates, and viewing logs.
- Added IP Auto-Detection during the deployment setup to automatically configure `.env` variables.
- Added `init.sh`: A one-click initializer script to automate the full setup pipeline via `curl`.
