# ZILLY — Multi-brand shopping + Style Match demo

A beginner-friendly full-stack student project built with HTML, CSS, JavaScript, Node.js and Express.

## Features
- Responsive premium/minimal shopping interface
- Sample multi-brand catalogue across clothing, bags/accessories and footwear
- Product photos loaded from Unsplash URLs (internet required for remote images)
- Category filters, product preview and add-to-bag quantity controls
- **ZILLY Style Match**: choose Casual Day, Smart Casual, Soft & Comfy, or Dinner Plans to get a suggested 3-piece look and add the complete look to the bag
- Try Before Buy photo-upload overlay demo (not AI fitting or size-accurate)
- Demo checkout with orders stored in `data/orders.json`
- Contact form with messages stored in `data/messages.json` (does not send email)

## Run locally
1. Install Node.js (LTS).
2. Open a terminal in the `zilly_try_before_buy` folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000.

## Important demo notes
- Products, prices and brand labels are sample catalogue entries for demonstration, not a claim of brand partnership or product authenticity.
- Product photos are remote image URLs and require an internet connection; an image host can occasionally block or change a photo.
- Checkout is a demo and does not collect payment.
- Try Before Buy is a decorative overlay preview, not a real AI virtual try-on.
- Contact messages are saved locally; no email is sent.
