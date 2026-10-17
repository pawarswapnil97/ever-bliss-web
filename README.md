# Ever Bliss — Handmade Flowers & Home Décor

A responsive single-page React + TypeScript storefront demo for Ever Bliss.

## Run locally

1. Install Node.js 18+.
2. In this project folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the local URL printed by Vite.

To create a production build:

```bash
npm run build
npm run preview
```

## Where to edit products

Edit `src/data/products.ts`. Product cards are rendered from the `products` array, so adding another object adds a new product automatically. Replace each `image` URL with your own product image URL or local asset path.

## Demo features

- Product category filtering, search and sorting
- Product details modal, Add to Cart and Buy Now
- Cart quantities, removal, totals and localStorage persistence
- Responsive layout and subtle Framer Motion animations
- Customer review form stored in this browser
- Checkout form with validation and sample order ID
- Demo order tracking timeline
- Demo newsletter signup

## Important before going live

This is a frontend-only demo. Checkout creates a demo order only; no payment is processed and no order is sent to a server. Reviews, cart, and demo state are local to the browser. Connect a backend for real inventory, order management, review moderation, email notifications, and tracking. Integrate Razorpay (or another provider) through a secure server-side flow before accepting payments. Never collect or store raw card details in this frontend.

Some sample product photos use remote Unsplash URLs and Google Fonts are loaded online. Replace these with your own licensed product images before launch.
