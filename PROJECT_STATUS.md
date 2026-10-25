# Shopwise+ Project Status

## Implemented

- React/Vite storefront with responsive styling
- Product catalog, search, filters, and detail pages
- Local wishlist and cart persistence
- MongoDB models for users, products, carts, and orders
- JWT authentication and session revalidation
- Checkout and order history
- AI shopping assistant with demo fallback
- Admin product creation and deletion routes/screens
- Razorpay payment preparation layer
- Docker and GitHub Actions configuration
- API rate limiting, security headers, health checks, and error handling

## Configuration still required

1. Copy `server/.env.example` to `server/.env`.
2. Configure `MONGO_URI` and run `npm run seed:products` from `server/`.
3. Add `OPENAI_API_KEY` for live AI responses.
4. Add Razorpay test keys before enabling live checkout payments.

## Verification

Run `npm run check` from the project root.
