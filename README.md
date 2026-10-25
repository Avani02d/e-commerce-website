# AI E-commerce Website

Full-stack e-commerce starter based on the project roadmap.

## Structure

- `client/` — React + Vite storefront
- `server/` — Express API foundation

## Run locally

```bash
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the API on `http://localhost:5000`.

Copy `server/.env.example` to `server/.env` before enabling MongoDB or AI features.
Copy `client/.env.example` to `client/.env` if the API is running on a different host or port.

Run `npm run check` from the project root to build the frontend and validate the backend entry point together.

For a single-service deployment, build the client first, then run the server with `NODE_ENV=production`; Express will serve `client/dist` alongside the API.

Build and run the production container with:

```bash
docker build -t shopwise .
docker run --env-file server/.env -p 5000:5000 shopwise
```

GitHub Actions CI is configured in `.github/workflows/ci.yml` to run the same validation on pushes and pull requests.

`render.yaml` provides a single-service Render deployment blueprint. Add the secret environment variables in Render before deploying.

With MongoDB configured, seed the starter catalog using `npm run seed:products` from `server/`.

Without an OpenAI key, the chatbot runs in a helpful demo mode; add `OPENAI_API_KEY` to enable full AI responses.

Razorpay payment preparation is available at `POST /api/payments/create-order` and `POST /api/payments/verify`. Add Razorpay credentials to `server/.env` before connecting the checkout UI.

The client payment service and Razorpay checkout-loader are prepared in `client/src/services/`; they stay inactive until the payment flow is explicitly enabled with test credentials.

For local payment-flow development without external transactions, set `PAYMENT_MODE=mock`.
Set `VITE_ENABLE_PAYMENTS=true` in `client/.env` to run the checkout through that mock payment layer.

## Optional local MongoDB

If Docker is installed, start MongoDB from the project root with:

```bash
docker compose up -d mongo
```

Then set `MONGO_URI=mongodb://127.0.0.1:27017/ai-ecommerce` in `server/.env` and run the product seed command.

## API routes

- `GET /api/health` — service health
- `GET /api/products` — catalog, using MongoDB when configured or demo data otherwise
- `GET /api/products/:id` — product details
- `POST /api/products` — create a product (admin)
- `PUT /api/products/:id` — update a product (admin)
- `DELETE /api/products/:id` — delete a product (admin)
- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — receive a JWT
- `GET /api/auth/me` — current authenticated user
- `GET /api/cart` — current user's cart
- `POST /api/cart/items` — add `{ productId, quantity }`
- `DELETE /api/cart/items/:productId` — remove an item
- `DELETE /api/cart` — clear the cart
- `POST /api/orders` — create an order from cart items
- `GET /api/orders` — list the signed-in user’s orders
- `GET /api/orders/:id` — view one order
