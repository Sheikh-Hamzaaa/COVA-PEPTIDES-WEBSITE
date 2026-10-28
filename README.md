# COVA website

The static website is organized into dedicated pages:

- `index.html`: Home and brand story.
- `collection.html`: Product catalog, search, category filters and one-sheet.
- `product.html`: Product detail page, populated from `products.json` using the selected product name in the URL.
- `cart.html`: Persistent quote cart and destination details for written quote requests.
- `standards.html`: Product documentation and quality approach.
- `packages.html`: Curated collection options.
- `shipping.html`: Delivery and import information.
- `contact.html`: Private enquiries and social profile.

## Run locally

Open a terminal in this folder and start the included Node.js server:

    node serve.js

Then open http://localhost:8000. A local server is required for the Collection page to load `products.json`.
On larger screens, the hero video is scroll-scrubbed; on phones, tablets and short landscape screens it plays as a muted loop. Reduced-motion preferences disable video motion and the floral image remains as a static fallback. The included server supports byte-range requests used by the hero video.
On every page except Home, the primary content section uses the same video as a subtle animated background. It pauses when outside the viewport or when the browser tab is hidden, and respects reduced-motion preferences.

## Site assets and data

- `style.css`: Shared typography, colors, layout and responsive styles.
- `app.js`: Collection search, category filters and product rendering.
- `product-detail.js`: Selected product details, pricing, references and quote-cart actions.
- `cart.js` and `cart-page.js`: Browser-persisted selections and quote-request email preparation.
- `products.json`: 24 product records, descriptions, references and image paths. Product detail pages currently display the requested `$0.00 USD` price for every selection.
- `assets/`: Logos, floral photograph, product graphics and collection PDF.
- `assets/products-enhanced/`: 2× upscaled, lightly sharpened product images used by the catalog.

No dependency installation or build step is needed. Publish this folder as the static web root and preserve relative paths and letter casing. Enquiry links use email.

## Acceptance checks

Verify that all pages and navigation links load, all 24 products render and open individual detail pages, each detail page shows its description, specifications, references and `$0.00 USD` price, search and category filters work, cart additions and quantities persist, a destination quote request can be prepared, product graphics and the PDF load, and the mobile layout is readable.
