const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'orders.json');
const CONTACT_FILE = path.join(__dirname, 'data', 'messages.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const products = [
  { id: 1, name: 'Relaxed Denim Jacket', brand: 'Zara', category: 'Clothing', price: 2490, color: '#8aa6c1', description: 'An easy denim layer for everyday styling.', tag: 'Popular', image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85', style: 'casual' },
  { id: 2, name: 'Classic Shoulder Bag', brand: 'Charles & Keith', category: 'Accessories', price: 3990, color: '#c58e68', description: 'A polished bag for brunch, college and evenings.', tag: 'Style pick', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', style: 'smart-casual' },
  { id: 3, name: 'Retro Everyday Sneakers', brand: 'Adidas', category: 'Footwear', price: 5499, color: '#d9d9d9', description: 'Comfortable sneakers for laid-back looks.', tag: 'Trending', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', style: 'casual' },
  { id: 4, name: 'Soft Knit Cardigan', brand: 'H&M', category: 'Clothing', price: 1799, color: '#b5a0bd', description: 'A soft layer that works with denim or skirts.', tag: 'Cozy pick', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', style: 'soft' },
  { id: 5, name: 'Structured Tote Bag', brand: 'Mango', category: 'Accessories', price: 3299, color: '#c58e68', description: 'Roomy, structured and ready for everyday plans.', tag: 'Best seller', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85', style: 'smart-casual' },
  { id: 6, name: 'Minimal Gold Hoops', brand: 'Accessorize', category: 'Accessories', price: 899, color: '#d5b16d', description: 'A small finishing detail for day or night.', tag: 'Under ₹1k', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85', style: 'dressy' },
  { id: 7, name: 'Tailored Wide-Leg Trousers', brand: 'Mango', category: 'Clothing', price: 2990, color: '#b9b2a5', description: 'Clean tailoring for smart-casual outfits.', tag: 'New', image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=85', style: 'smart-casual' },
  { id: 8, name: 'Everyday Crossbody', brand: 'ALDO', category: 'Accessories', price: 2899, color: '#8c735e', description: 'Hands-free styling for days on the move.', tag: 'Everyday', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85', style: 'casual' },
  { id: 9, name: 'Classic White Shirt', brand: 'Uniqlo', category: 'Clothing', price: 1990, color: '#e7e5df', description: 'A wardrobe staple that pairs with almost anything.', tag: 'Essential', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85', style: 'smart-casual' },
  { id: 10, name: 'Everyday Sunglasses', brand: 'Ray-Ban', category: 'Accessories', price: 5990, color: '#4b4b43', description: 'A timeless frame for sunny-day looks.', tag: 'Iconic', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85', style: 'casual' },
  { id: 11, name: 'Satin Evening Top', brand: 'Zara', category: 'Clothing', price: 2290, color: '#8c9e7c', description: 'A dressier piece for dinners and special plans.', tag: 'Going out', image: 'https://images.unsplash.com/photo-1564257577-1a7e5a1f8b5d?auto=format&fit=crop&w=900&q=85', style: 'dressy' },
  { id: 12, name: 'Clean Court Sneakers', brand: 'Puma', category: 'Footwear', price: 3999, color: '#d9d9d9', description: 'Simple trainers that pair with denim and dresses.', tag: 'Easy match', image: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85', style: 'casual' }
];

function readOrders() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function saveOrders(orders) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
}
function readMessages() {
  try { return JSON.parse(fs.readFileSync(CONTACT_FILE, 'utf8')); } catch { return []; }
}
function saveMessages(messages) {
  fs.mkdirSync(path.dirname(CONTACT_FILE), { recursive: true });
  fs.writeFileSync(CONTACT_FILE, JSON.stringify(messages, null, 2));
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'ZILLY Try Before Buy' }));
app.get('/api/products', (_req, res) => res.json(products));
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) return res.status(400).json({ error: 'Please fill in all fields.' });
  const messages = readMessages();
  const entry = { id: 'MSG-' + Date.now().toString().slice(-7), name: String(name).trim().slice(0, 80), email: String(email).trim().slice(0, 120), message: String(message).trim().slice(0, 1500), createdAt: new Date().toISOString() };
  messages.unshift(entry); saveMessages(messages); res.status(201).json({ ok: true, id: entry.id });
});
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});
app.get('/api/orders', (_req, res) => res.json(readOrders()));
app.post('/api/orders', (req, res) => {
  const { customerName, items } = req.body || {};
  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Please provide a customer name and at least one cart item.' });
  }
  const normalizedItems = items.map(item => {
    const product = products.find(p => p.id === Number(item.id));
    const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
    return product ? { id: product.id, name: product.name, price: product.price, quantity } : null;
  }).filter(Boolean);
  if (!normalizedItems.length) return res.status(400).json({ error: 'No valid products in order.' });
  const order = {
    id: 'ZLY-' + Date.now().toString().slice(-8),
    customerName: String(customerName).slice(0, 80),
    items: normalizedItems,
    total: normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'Demo order placed',
    createdAt: new Date().toISOString()
  };
  const orders = readOrders();
  orders.unshift(order);
  saveOrders(orders);
  res.status(201).json(order);
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`ZILLY is running at http://localhost:${PORT}`));
