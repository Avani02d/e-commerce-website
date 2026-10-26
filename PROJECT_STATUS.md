# Shopwise+ Project Status

## Implemented

- React/Vite storefront with responsive styling
- Product catalog, search, filters, and detail pages
- Local wishlist and cart persistence
- MongoDB models for users, products, carts, and orders
- JWT authentication and session revalidation
- Checkout and order history
- AI shopping assistant with demo fallback
- Admin product creation, editing, and deletion routes/screens
- Admin order dashboard with search, status filtering, and status updates
- Admin order detail inspection with customer, shipping, and line-item information
- Customer order details, cancellation, and inventory restocking
- Stock-aware carts, checkout reservations, and authoritative server pricing
- Razorpay payment preparation layer with mock-payment development mode
- Docker, Render, and GitHub Actions configuration
- Production frontend serving, API smoke tests, dependency audits, and error handling

## Configuration still required

1. Copy `server/.env.example` to `server/.env`.
2. Configure `MONGO_URI` and run `npm run seed:products` from `server/`.
3. Add `OPENAI_API_KEY` for live AI responses.
4. Add Razorpay test keys before enabling live checkout payments.
5. Promote an account to admin before using the admin screens.

## Verification

Run `npm run check` from the project root. GitHub Actions runs the same build,
server syntax check, production API smoke test, and dependency audits on every
push and pull request.
