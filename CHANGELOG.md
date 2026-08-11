# Changelog

All notable changes to the BlueFalcon WM project will be documented in this file.

## [v2.2] - YouTube Music Aesthetic Redesign
- **Total Aesthetic Overhaul**: Redesigned the entire CSS framework to perfectly match the sleek, pitch-black aesthetic of YouTube Music / Google Music.
- **Album-Style Products**: Stripped clunky borders and backgrounds from product cards. Products now render edge-to-edge like beautiful album covers.
- **Google Account Dropdown**: Rebuilt the top-right user menu to be a pixel-accurate clone of the sleek Google Account dropdown.
- **Translucent UI**: The top navigation bar now features a subtle glass-like translucency, and the dark/light mode toggle was stripped down to a clean, minimalist naked icon.

## [v2.1] - Google Material Theme Upgrade
- **Theme Overhaul**: Replaced the raw CSS design system with a clean, modern Google Material Design 3 aesthetic.
- **Dark/Light Mode**: Added a manual Dark/Light mode toggle button to the navigation bar.
- **UI Polish**: Fixed navigation bar layout issues, redesigned the Cart notification badge, added soft shadows to product cards, and modernized the user dropdown menu.

## [v2.0] - The CMS Edition (Major Architectural Upgrade)
- **Dynamic Site Builder**: Added `SiteSettings` to the database. The Homepage (Hero & Featured sections), Footer, Site Title, and Logo are now completely customizable via the Admin Dashboard's new JSON layout editor.
- **Advanced Navigation**: The Navbar now intelligently hides the "Home" link when on the main page, includes a live-updating shopping cart badge, and features a unified modern User Dropdown menu.
- **Custom Payment Gateways**: Implemented a dynamic `PaymentMethod` system. Admins can create custom gateways (like "Card to Card") and force users to submit tracking/receipt IDs.
- **Coupon Code System**: Fully integrated a dynamic coupon engine (percentage or fixed discounts) natively into the checkout flow.
- **Digital Product Delivery**: Added a "Fulfillment Note" field. Admins can now securely send secret text, license keys, or download links directly into the customer's Order History.
- **Advanced Product Management**:
  - **Categories & Slugs**: Products now use clean, SEO-friendly URLs (`/shop/category/product-slug`) instead of database IDs.
  - **Photo Albums**: Replaced single-image support with multi-image product carousels (select main image vs gallery images).
  - **Sales & Discounts**: Added support for displaying crossed-out original prices next to dynamic `discountPrice` values.
- **Admin Layout**: Redesigned the monolithic Admin Dashboard into a scalable, tab-based layout (Orders, Products & Categories, Site Settings).

## [v1.2] - Installation Bug Fix
- **Deploy Script**: Fixed an infinite loop bug in `install.sh` that occurred when piping the script directly via curl. The script now correctly grabs keyboard input from the user's terminal (`/dev/tty`).

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
