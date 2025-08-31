/* main.js
   - Contains sample product data
   - Renders product grid on products.html
   - Implements search (header), load-more pagination, sort filter
   - Handles product-details page rendering using query param ?id=xxx
*/

/* =========================
   SAMPLE PRODUCT DATA
   ========================= */
const PRODUCTS = [
  { id: 'p1', title: 'Classic Sneakers', price: 2499, image: 'https://via.placeholder.com/480x480?text=Sneakers', category: 'Apparel', rating:4.5, description: 'Comfortable and stylish sneakers for daily wear.' },
  { id: 'p2', title: 'Noise-Cancel Headphones', price: 8999, image: 'https://via.placeholder.com/480x480?text=Headphones', category: 'Electronics', rating:4.7, description: 'Immersive sound with active noise cancellation.' },
  { id: 'p3', title: 'Leather Wallet', price: 1199, image: 'https://via.placeholder.com/480x480?text=Wallet', category: 'Accessories', rating:4.2, description: 'Handcrafted genuine leather wallet.' },
  { id: 'p4', title: 'Smart Watch', price: 5999, image: 'https://via.placeholder.com/480x480?text=Smart+Watch', category: 'Electronics', rating:4.3, description: 'Track activity, notifications and more.' },
  { id: 'p5', title: 'Denim Jacket', price: 3499, image: 'https://via.placeholder.com/480x480?text=Jacket', category: 'Apparel', rating:4.6, description: 'Classic denim jacket with durable fabric.' },
  { id: 'p6', title: 'Espresso Maker', price: 7599, image: 'https://via.placeholder.com/480x480?text=Espresso+Maker', category: 'Home & Living', rating:4.1, description: 'Compact espresso maker for home baristas.' },
  { id: 'p7', title: 'Backpack', price: 1999, image: 'https://via.placeholder.com/480x480?text=Backpack', category: 'Accessories', rating:4.4, description: 'Durable backpack with laptop compartment.' },
  { id: 'p8', title: 'Sunglasses', price: 899, image: 'https://via.placeholder.com/480x480?text=Sunglasses', category: 'Accessories', rating:4.0, description: 'UV-protection polarized sunglasses.' },
  { id: 'p9', title: 'Wireless Mouse', price: 799, image: 'https://via.placeholder.com/480x480?text=Mouse', category: 'Electronics', rating:3.9, description: 'Ergonomic wireless mouse with long battery life.' },
  { id: 'p10', title: 'Cotton T-Shirt', price: 599, image: 'https://via.placeholder.com/480x480?text=T-Shirt', category: 'Apparel', rating:4.0, description: 'Soft cotton tee for everyday comfort.' }
];

/* =========================
   HELPERS
   ========================= */
function q(selector, root = document) { return root.querySelector(selector); }
function qa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }
function formatPrice(n) { return `₹${n.toLocaleString('en-IN')}`; }
function findProductById(id) { return PRODUCTS.find(p => p.id === id); }

/* =========================
   PRODUCTS PAGE: RENDERING & INTERACTIVITY
   ========================= */
(function productsPageModule() {
  const grid = q('#products-grid');
  if (!grid) return; // not on products page

  // pagination state
  const PAGE_SIZE = 8;
  let currentPage = 1;
  let currentList = PRODUCTS.slice(); // filtered/sorted list

  function renderProducts(list, page=1) {
    grid.innerHTML = '';
    const start = 0;
    const end = page * PAGE_SIZE;
    const toShow = list.slice(start, end);

    toShow.forEach(prod => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <a class="product-media" href="product-details.html?id=${prod.id}">
          <img loading="lazy" src="${prod.image}" alt="${prod.title}">
        </a>
        <div class="product-body">
          <a class="product-title" href="product-details.html?id=${prod.id}">${prod.title}</a>
          <div>
            <span class="product-price">${formatPrice(prod.price)}</span>
            <span style="margin-left:8px;color:#777;font-size:13px;">(${prod.category})</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-outline view-btn" data-id="${prod.id}">View</button>
            <button class="btn btn-primary buy-btn" data-id="${prod.id}">Buy Now</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });

    // show/hide load more
    const loadMoreBtn = q('#load-more');
    if (end >= list.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
    }
  }

  // initial render
  renderProducts(currentList, currentPage);

  // load more
  q('#load-more').addEventListener('click', ()=>{
    currentPage++;
    renderProducts(currentList, currentPage);
  });

  // search and sort
  q('#search-btn-products').addEventListener('click', ()=>{
    const term = q('#global-search-products').value.trim().toLowerCase();
    applyFilters({ search: term, sort: q('#sort-select').value });
  });
  q('#global-search-products').addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') q('#search-btn-products').click();
  });
  q('#sort-select').addEventListener('change', ()=>{
    applyFilters({ search: q('#global-search-products').value.trim().toLowerCase(), sort: q('#sort-select').value });
  });

  function applyFilters({ search = '', sort = 'popular' } = {}) {
    // search filter
    currentList = PRODUCTS.filter(p => {
      if (!search) return true;
      const hay = `${p.title} ${p.category} ${p.description}`.toLowerCase();
      return hay.includes(search);
    });

    // sort
    if (sort === 'price-asc') currentList.sort((a,b)=>a.price-b.price);
    else if (sort === 'price-desc') currentList.sort((a,b)=>b.price-a.price);
    else currentList.sort((a,b)=> (b.rating - a.rating)); // popular fallback

    // reset pagination
    currentPage = 1;
    renderProducts(currentList, currentPage);
  }

  // quick delegate for view/buy buttons
  grid.addEventListener('click', (ev)=>{
    const view = ev.target.closest('.view-btn');
    const buy = ev.target.closest('.buy-btn');
    if (view) {
      const id = view.dataset.id;
      location.href = `product-details.html?id=${id}`;
    } else if (buy) {
      const id = buy.dataset.id;
      // small visual feedback
      buy.textContent = 'Added ✓';
      buy.disabled = true;
      setTimeout(()=>{ buy.textContent = 'Buy Now'; buy.disabled=false; }, 1200);
    }
  });

})();
/* =========================
   HEADER SEARCH REDIRECT
   - When user uses header search on pages, redirect to products.html with query param
   ========================= */
(function headerSearchRedirect() {
  const headerSearch = q('#global-search') || q('#global-search-products') || q('#global-search-details');
  const searchBtn = q('#search-btn') || q('#search-btn-products') || q('#search-btn-details');
  if (!headerSearch || !searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const qv = headerSearch.value.trim();
    if (!qv) {
      // No query -> go to products page
      location.href = 'products.html';
    } else {
      // pass via hash for simplicity: products.html#q=term
      location.href = `products.html?q=${encodeURIComponent(qv)}`;
    }
  });
})();

/* =========================
   PRODUCT DETAILS PAGE RENDER
   - Reads ?id=xxx from location.search
   - Renders product info + related products
   ========================= */
(function productDetailsModule() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (!id) return; // not on product details page

  const product = findProductById(id);
  if (!product) {
    // show basic fallback
    q('#product-title').textContent = 'Product not found';
    q('#product-desc').textContent = 'We could not find the product you requested.';
    return;
  }

  // populate fields
  q('#product-img').src = product.image;
  q('#product-img').alt = product.title;
  q('#product-title').textContent = product.title;
  q('#product-price').textContent = formatPrice(product.price);
  q('#product-desc').textContent = product.description;

  // related products (simple: same category, excluding itself)
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,3);
  const relatedWrap = q('#related-products');
  relatedWrap.innerHTML = related.map(r => `
    <article class="product-card" style="height:160px;">
      <a class="product-media" href="product-details.html?id=${r.id}">
        <img src="${r.image}" alt="${r.title}">
      </a>
      <div class="product-body">
        <a class="product-title" href="product-details.html?id=${r.id}">${r.title}</a>
        <div style="margin-top:auto;"><span class="product-price">${formatPrice(r.price)}</span></div>
      </div>
    </article>
  `).join('');

  // Add to cart behavior
  q('#add-to-cart').addEventListener('click', ()=>{
    const size = q('#size-select').value;
    if (!size) {
      alert('Please select a size before adding to cart.');
      q('#size-select').focus();
      return;
    }
    // simple visual feedback — in real app you'd update cart state
    q('#add-to-cart').textContent = 'Added ✓';
    q('#add-to-cart').disabled = true;
    setTimeout(()=>{
      q('#add-to-cart').textContent = 'Add to Cart';
      q('#add-to-cart').disabled = false;
    }, 1200);
  });

})();
