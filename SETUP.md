# Local setup checklist

## 1. Install dependencies

```bash
npm install
npm run install:all
```

## 2. Configure the API

Create `server/.env` from `server/.env.example` and set:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret>
CLIENT_URL=http://localhost:5173
```

Keep `server/.env` local. It is ignored by Git and must never be committed.

## 3. Configure the client

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_PAYMENTS=false
```

## 4. Seed the catalog

After MongoDB is configured:

```bash
npm --prefix server run seed:products
```

## 5. Grant admin access

Register a normal account first, then promote it from the project root:

```bash
npm --prefix server run make:admin -- user@example.com
```

## 6. Start and verify

```bash
npm run dev
npm run check
```

The storefront runs on `http://localhost:5173` and the API health endpoint is
`http://localhost:5000/api/health`.

## Optional integrations

- Set `OPENAI_API_KEY` to enable live assistant replies.
- Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `PAYMENT_MODE=razorpay` for Razorpay test payments.
- Use `PAYMENT_MODE=mock` with `VITE_ENABLE_PAYMENTS=true` to test the payment flow without an external transaction.

## Deployment

The repository includes `render.yaml`. Create a Render web service from the
GitHub repository and add the secret environment variables in Render before
deploying. The blueprint keeps client-side payments disabled by default; only
set `VITE_ENABLE_PAYMENTS=true` after configuring test payment credentials and
reviewing the payment flow. Run `npm run seed:products` once against the
production database.
