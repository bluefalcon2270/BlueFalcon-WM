# Changelog

All notable changes to the BlueFalcon Website Maker project will be documented in this file.

## [v3.8] - 2026-08-23
### Added
- Added the `init.sh` quick-run `curl` command directly into the README.md so users can seamlessly deploy the website from a single command.

## [v3.7] - 2026-08-23
### Fixed
- Replaced all legacy instances of `BlueFalcon-WM` (and `BlueFalcon WM`) across the `init.sh`, `install.sh`, and Next.js frontend code (such as the default footer, layout titles, and Prisma schema defaults) to fully align with the standard `BlueFalcon Website Maker` name.

## [v3.6] - 2026-08-23
### Changed
- Standardized project name, README, and common files structure.

## [v3.5] - WAF Video Visual Overhaul & Next.js 16 Fixes
### UI & Architecture
- **Visual Overhaul**: Introduced a new `banner` layout block system to the homepage rendering engine for massive promotional graphics.
- **Data Initialization**: Completely rewrote `prisma/seed.js` to inject 16 high-quality, realistic placeholder products across 4 categories (using Unsplash imagery) and a dense, visually rich homepage layout.
- **Bug Fix**: Fixed a critical `500 Server Error` on product detail pages by resolving a Next.js 16 dynamic route Promise constraint on URL parameters.
- **Bug Fix**: Fixed `404` errors on the homepage by correcting the URL linking strategy for categories to properly utilize the `?cat=` query architecture.
- **DevOps**: Modified the `update_website` function in `install.sh` to automatically re-seed the database upon every update pull to ensure layout consistency.


## [v3.4] - SSL NXDOMAIN Fix
### DevOps & Infrastructure
- Removed the strict `www.` prefix requirement from the automated Certbot SSL request. This prevents deployment crashes (NXDOMAIN DNS errors) when users bind subdomains (e.g. `test.domain.com`) instead of root domains.


## [v3.3] - Automatic Silent HTTPS/SSL 
### DevOps & Infrastructure
- Removed manual prompts for HTTPS setup in `install.sh`. 
- The script now silently and automatically runs Certbot, accepts the Let's Encrypt Terms of Service, and forces a secure HTTPS redirect (`--redirect`) without pausing for user input.


## [v3.2] - Fully Automated Installer
### DevOps & Infrastructure
- Removed the interactive menu from `install.sh` in favor of a true "one-click" automated installation flow.
- Running `install.sh` by default now installs system dependencies, deploys the website, and optionally configures the custom domain sequentially.
- Added command-line arguments for secondary tasks: `bash install.sh update`, `bash install.sh logs`, and `bash install.sh domain`.


## [v3.1] - VPS Domain & SSL Setup Automation
### DevOps & Infrastructure
- Added **Option 5: Setup Custom Domain & SSL** to the interactive `install.sh` script.
- Automates Nginx reverse proxy configuration for custom domains.
- Integrated automatic SSL certificate generation and installation via Certbot (Let's Encrypt).


## [v3.0] - Complete Professional Rebuild
### Design System
- **Ground-up CSS rewrite** with a coherent professional design system — Inter font, blue accent (`#3b82f6`), real box shadows, and smooth transitions.
- **Dark mode by default** — properly persisted in localStorage with zero flash on load.
- All components (buttons, inputs, cards, badges, tables, spinners, tabs) are now defined consistently.

### Pages
- **Homepage**: Hero section with stats row, featured products grid, category strip, trust badges. Works even with empty database.
- **Shop**: Working server-side search + category filtering with pill tabs, proper empty state.
- **Product Detail**: Image gallery with thumbnails, breadcrumb, stock indicator, discount badge, quantity stepper, related products.
- **Cart**: Full-featured — quantity steppers, live coupon validation, payment method display with instructions, price breakdown, order notes.
- **Login**: Beautiful 2-step card flow (identifier → password/register), loading spinners, proper error messages.
- **Profile**: Sidebar with tabs — Order History (status badges, thumbnails, fulfillment notes) and Account Settings (username/email/password change).
- **404**: Beautiful typographic 404 page.

### Admin Dashboard
- **Stats Overview** row at the top (total orders, revenue, products, pending orders).
- **Orders Tab**: Expandable rows with status update and fulfillment note — fully searchable.
- **Products Tab**: Full CRUD with image URL support, category assignment, price/discount, stock management.
- **Coupons Tab**: Create/toggle/delete coupons (percentage or fixed amount).
- **Payment Methods Tab**: Create/toggle/delete methods with receipt requirement toggle.
- **Site Settings Tab**: Title, logo, homepage JSON layout editor, footer JSON editor.

### API Routes (New)
- `GET /api/coupons/validate` — live coupon validation with discount calculation.
- `PUT /api/profile/update` — secure username/email/password change with bcrypt.
- `POST/PUT/DELETE /api/admin/products` — full product CRUD.
- `POST/PUT/DELETE /api/admin/coupons` — full coupon CRUD.
- `POST/PUT/DELETE /api/admin/payments` — full payment method CRUD.
- `PUT /api/admin/orders/[id]` — status + fulfillment note update.
- `PUT /api/admin/settings` — site settings upsert.
- `POST /api/admin/categories` — category creation.

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
