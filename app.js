const state = { products: [], category: 'All', cart: [], activeProduct: null, photoUrl: null };
const $ = (id) => document.getElementById(id);
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const iconFor = p => p.category === 'Footwear' ? '⌁' : p.name.toLowerCase().includes('sunglasses') ? '◉' : p.name.toLowerCase().includes('bag') ? '▱' : '✦';

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Could not load products');
    state.products = await res.json();
    renderProducts();
    renderStyleLook('casual');
  } catch (err) {
    $('productGrid').innerHTML = '<p>Could not load products. Please refresh the page.</p>';
  }
}
function renderProducts() {
  const products = state.category === 'All' ? state.products : state.products.filter(p => p.category === state.category);
  $('productGrid').innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-image">
        <span class="product-tag">${p.tag}</span>
        <img src="${p.image || ''}" alt="${p.name}" loading="lazy" onerror="this.classList.add('image-failed');this.nextElementSibling.hidden=false">
        <div class="product-fallback" hidden style="--product-color:${p.color}">${iconFor(p)}<small> ZILLY EDIT </small></div>
        <button class="quick-view" data-try="${p.id}" aria-label="Preview ${p.name}">Quick preview ↗</button>
      </div>
      <div class="product-info"><div><div class="product-brand">${p.brand || 'ZILLY EDIT'}</div><h3>${p.name}</h3><div class="product-category">${p.category}</div></div><span class="price">${money(p.price)}</span></div>
      <p class="product-description">${p.description}</p>
      <div class="product-actions"><button class="try-btn" data-try="${p.id}">✧ Try Before Buy</button><button class="add-btn" data-add="${p.id}">Add to bag +</button></div>
    </article>`).join('');
}
const styleLooks = {
  casual: { title: 'The off-duty classic', note: 'Denim keeps it relaxed, a crossbody keeps your hands free, and clean sneakers make it comfortable for a full day.', ids: [1, 8, 3], label: 'Casual day' },
  'smart-casual': { title: 'Coffee to class', note: 'A crisp shirt and tailored trousers feel polished; a structured tote pulls the look together.', ids: [9, 7, 5], label: 'Smart casual' },
  soft: { title: 'Soft layers, easy mood', note: 'Pair a soft knit cardigan with denim and finish with clean sneakers for an easy, comfortable look.', ids: [4, 1, 3], label: 'Soft & comfy' },
  dressy: { title: 'Dinner, but make it effortless', note: 'A satin top, gold hoops and a structured shoulder bag add a little polish without overdoing it.', ids: [11, 6, 2], label: 'Dinner plans' }
};
function renderStyleLook(style = 'casual') {
  const look = styleLooks[style]; if (!look) return;
  const items = look.ids.map(id => state.products.find(p => p.id === id)).filter(Boolean);
  if (!items.length) return;
  $('styleResult').innerHTML = `<div class="look-copy"><span class="look-kicker">THE ${look.label.toUpperCase()} EDIT</span><h3>${look.title}</h3><p>${look.note}</p><div class="look-picks">${items.map(p => `<div class="look-pick"><img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"><div><small>${p.brand}</small><b>${p.name}</b><span>${money(p.price)}</span></div></div>`).join('')}</div><button class="primary-button" id="addLook" data-look="${style}">Add the whole look · ${money(items.reduce((sum,p)=>sum+p.price,0))}</button></div><div class="look-visual"><img src="${items[0].image}" alt="${look.label} style inspiration" onerror="this.style.display='none'"><div class="look-bubble"><span>✦</span><b>Styled by ZILLY</b><small>3-piece outfit idea</small></div></div>`;
}
function toast(message) {
  const el = $('toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2300);
}
function addToCart(product) {
  const found = state.cart.find(x => x.id === product.id);
  if (found) found.quantity++; else state.cart.push({ ...product, quantity: 1 });
  renderCart(); toast(`${product.name} added to your bag`);
}
function renderCart() {
  const count = state.cart.reduce((n, x) => n + x.quantity, 0);
  $('cartCount').textContent = count;
  $('cartTotal').textContent = money(state.cart.reduce((n, x) => n + x.price * x.quantity, 0));
  $('cartItems').innerHTML = state.cart.length ? state.cart.map(p => `<div class="cart-line">
    <div class="cart-thumb">${iconFor(p)}</div><div class="cart-line-info"><b>${p.name}</b><small>${money(p.price)} each</small>
    <div class="quantity-controls"><button data-qty="-1" data-id="${p.id}">−</button><span>${p.quantity}</span><button data-qty="1" data-id="${p.id}">+</button></div></div>
  </div>`).join('') : '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
}
function openCart() { $('cartDrawer').classList.add('open'); $('scrim').classList.remove('hidden'); }
function closeCart() { $('cartDrawer').classList.remove('open'); $('scrim').classList.add('hidden'); }
function openTry(product) {
  state.activeProduct = product;
  $('tryProductName').textContent = `${product.name} · ${money(product.price)}`;
  $('photoInput').value = '';
  if (state.photoUrl) { URL.revokeObjectURL(state.photoUrl); state.photoUrl = null; }
  $('tryCanvas').innerHTML = `<div class="preview-placeholder"><span>✧</span><b>${product.name}</b><small>Upload a photo to see the demo overlay</small></div><div class="product-overlay" style="--overlay-color:${product.color}">${iconFor(product)}</div>`;
  $('tryModal').classList.remove('hidden');
}
function closeTry() { $('tryModal').classList.add('hidden'); }
$('productGrid').addEventListener('click', e => {
  const tryButton = e.target.closest('[data-try]');
  const addButton = e.target.closest('[data-add]');
  if (tryButton) openTry(state.products.find(p => p.id === Number(tryButton.dataset.try)));
  if (addButton) addToCart(state.products.find(p => p.id === Number(addButton.dataset.add)));
});
$('filters').addEventListener('click', e => {
  const button = e.target.closest('[data-category]'); if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button));
  renderProducts();
});
$('photoInput').addEventListener('change', e => {
  const file = e.target.files && e.target.files[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { toast('Please choose an image file'); return; }
  if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
  state.photoUrl = URL.createObjectURL(file);
  $('tryCanvas').innerHTML = `<img src="${state.photoUrl}" alt="Your selected photo preview"><div class="product-overlay" style="--overlay-color:${state.activeProduct.color}">${iconFor(state.activeProduct)}</div>`;
});
$('addFromTry').addEventListener('click', () => { if (state.activeProduct) addToCart(state.activeProduct); closeTry(); });
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeTry));
$('cartOpen').addEventListener('click', openCart);
$('cartClose').addEventListener('click', closeCart);
$('scrim').addEventListener('click', closeCart);
$('cartItems').addEventListener('click', e => {
  const b = e.target.closest('[data-qty]'); if (!b) return;
  const item = state.cart.find(p => p.id === Number(b.dataset.id)); if (!item) return;
  item.quantity += Number(b.dataset.qty);
  if (item.quantity <= 0) state.cart = state.cart.filter(p => p.id !== item.id);
  renderCart();
});
$('checkoutBtn').addEventListener('click', async () => {
  if (!state.cart.length) { toast('Your bag is empty'); return; }
  const customerName = prompt('Enter a name for this demo order:');
  if (!customerName || !customerName.trim()) return;
  try {
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: customerName.trim(), items: state.cart.map(p => ({ id: p.id, quantity: p.quantity })) }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order failed');
    state.cart = []; renderCart(); closeCart();
    toast(`Demo order ${data.id} placed successfully`);
  } catch (err) { toast(err.message || 'Could not place order'); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeTry(); closeCart(); } });
$('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true; submit.textContent = 'Sending…';
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Message could not be saved');
    $('contactStatus').textContent = `Thanks! Your message was saved in this demo (reference ${data.id}).`;
    form.reset(); toast('Message sent to the local demo');
  } catch (err) { $('contactStatus').textContent = err.message || 'Please try again.'; }
  finally { submit.disabled = false; submit.textContent = 'Send message ↗'; }
});
$('styleTabs').addEventListener('click', e => {
  const button = e.target.closest('[data-style]'); if (!button) return;
  document.querySelectorAll('.style-tab').forEach(b => b.classList.toggle('active', b === button));
  renderStyleLook(button.dataset.style);
});
$('styleResult').addEventListener('click', e => {
  const button = e.target.closest('[data-look]'); if (!button) return;
  const look = styleLooks[button.dataset.look];
  look.ids.forEach(id => { const product = state.products.find(p => p.id === id); if (product) addToCart(product); });
  toast('Your complete style look was added to the bag');
});
loadProducts(); renderCart();
