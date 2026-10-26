const PRODUCTS = [
  { id: 1, name: "Camisa Social Slim Fit", category: "camisas", price: 119.90, tag: "Clássico", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=85", alt: "Camisa social clara", sizes: ["P", "M", "G", "GG"] },
  { id: 2, name: "Camiseta Essential", category: "camisas", price: 59.90, tag: "Essencial", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85", alt: "Camiseta básica", sizes: ["P", "M", "G", "GG"] },
  { id: 3, name: "Camiseta Urban Oversized", category: "camisas", price: 79.90, tag: "Tendência", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85", alt: "Camiseta casual", sizes: ["P", "M", "G", "GG"] },
  { id: 4, name: "Calça Jeans Masculina", category: "calcas", price: 159.90, tag: "Mais vendido", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85", alt: "Calça jeans", sizes: ["38", "40", "42", "44"] },
  { id: 5, name: "Calça Chino Casual", category: "calcas", price: 139.90, tag: "Versátil", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=85", alt: "Calça casual", sizes: ["38", "40", "42", "44"] },
  { id: 6, name: "Tênis Red Runner", category: "calcados", price: 249.90, tag: "Destaque", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85", alt: "Tênis esportivo vermelho", sizes: ["39", "40", "41", "42", "43"] },
  { id: 7, name: "Tênis Street Casual", category: "calcados", price: 199.90, tag: "Novo", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85", alt: "Tênis casual", sizes: ["38", "39", "40", "41", "42"] },
  { id: 8, name: "Boné Minimal", category: "acessorios", price: 49.90, tag: "Detalhe que muda", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85", alt: "Boné casual", sizes: ["Único"] },
  { id: 9, name: "Mochila Urbana", category: "acessorios", price: 129.90, tag: "Para todo dia", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85", alt: "Mochila urbana", sizes: ["Único"] }
];

const CART_STORAGE_KEY = "urban-style-cart-v2";
const FAVORITES_STORAGE_KEY = "urban-style-favorites-v2";
let cart = readStorage(CART_STORAGE_KEY, []);
let favorites = readStorage(FAVORITES_STORAGE_KEY, []);
let activeCategory = "todos";
let searchTerm = "";
let sortMode = "featured";
let toastTimer;

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    showToast("Não foi possível salvar suas escolhas neste navegador.");
  }
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function getVisibleProducts() {
  let result = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === "todos" ||
      (activeCategory === "favoritos" ? favorites.includes(product.id) : product.category === activeCategory);
    const matchesSearch = product.name.toLocaleLowerCase("pt-BR").includes(searchTerm.toLocaleLowerCase("pt-BR"));
    return matchesCategory && matchesSearch;
  });

  if (sortMode === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sortMode === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sortMode === "name") result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return result;
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  const products = getVisibleProducts();
  document.getElementById("catalog-count").textContent = products.length + (products.length === 1 ? " produto" : " produtos");
  document.getElementById("no-results").hidden = products.length > 0;

  grid.innerHTML = products.map(product => {
    const isFavorite = favorites.includes(product.id);
    const sizes = product.sizes.map((size, index) =>
      '<option value="' + size + '"' + (index === 0 ? " selected" : "") + ">" + size + "</option>"
    ).join("");
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.alt}" loading="lazy">
          <span class="product-tag">${product.tag}</span>
          <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${isFavorite ? "Remover dos" : "Adicionar aos"} favoritos" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        </div>
        <div class="product-info">
          <p class="product-category">${categoryName(product.category)}</p>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">R$ ${formatPrice(product.price)}</p>
          <label class="size-label" for="size-${product.id}">Tamanho</label>
          <select class="size-select" id="size-${product.id}" aria-label="Tamanho de ${product.name}">${sizes}</select>
          <button class="button button-dark add-button" type="button" data-add="${product.id}">Adicionar ao carrinho <span aria-hidden="true">＋</span></button>
        </div>
      </article>`;
  }).join("");
}

function categoryName(category) {
  return ({ camisas: "Camisas", calcas: "Calças", calcados: "Calçados", acessorios: "Acessórios" })[category] || category;
}

function addToCart(productId) {
  const product = PRODUCTS.find(item => item.id === productId);
  const sizeSelect = document.getElementById("size-" + productId);
  if (!product || !sizeSelect) return;
  const size = sizeSelect.value;
  const existing = cart.find(item => item.productId === productId && item.size === size);
  if (existing) existing.quantity += 1;
  else cart.push({ cartId: Date.now() + Math.floor(Math.random() * 10000), productId, name: product.name, price: product.price, size, quantity: 1 });
  saveStorage();
  renderCart();
  showToast(product.name + " adicionado ao carrinho!");
}

function changeQuantity(cartId, delta) {
  const item = cart.find(entry => entry.cartId === cartId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.cartId !== cartId);
  saveStorage();
  renderCart();
}

function removeFromCart(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  saveStorage();
  renderCart();
  showToast("Item removido do carrinho.");
}

function toggleFavorite(productId) {
  favorites = favorites.includes(productId) ? favorites.filter(id => id !== productId) : [...favorites, productId];
  saveStorage();
  renderProducts();
  showToast(favorites.includes(productId) ? "Produto salvo nos favoritos." : "Produto removido dos favoritos.");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-items-label").textContent = count + (count === 1 ? " item" : " itens");
  document.getElementById("cart-total-price").textContent = formatPrice(total);

  const container = document.getElementById("cart-items");
  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio. Explore os produtos e adicione seus favoritos!</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <article class="cart-item">
      <div class="cart-item-details"><strong>${item.name}</strong><span>Tamanho: ${item.size}</span><span>R$ ${formatPrice(item.price)} cada</span></div>
      <div class="quantity-controls" aria-label="Quantidade de ${item.name}">
        <button type="button" data-quantity="${item.cartId}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-quantity="${item.cartId}" data-delta="1" aria-label="Aumentar quantidade">+</button>
      </div>
      <strong class="line-total">R$ ${formatPrice(item.price * item.quantity)}</strong>
      <button class="remove-button" type="button" data-remove="${item.cartId}" aria-label="Remover ${item.name}">Remover</button>
    </article>`).join("");
}

function prepareOrder(event) {
  event.preventDefault();
  if (!cart.length) {
    showToast("Adicione pelo menos um produto antes de preparar o pedido.");
    document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const lines = cart.map(item => `• ${item.quantity}x ${item.name} (tam. ${item.size}) — R$ ${formatPrice(item.price * item.quantity)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = [
    "RESUMO DEMONSTRATIVO — URBAN STYLE",
    "Cliente: " + name,
    "Telefone: " + phone,
    email ? "E-mail: " + email : "",
    "",
    ...lines,
    "",
    "Subtotal: R$ " + formatPrice(total),
    "Frete e pagamento: a confirmar com a loja.",
    "",
    "Este resumo não é uma confirmação de compra."
  ].filter(Boolean).join("\n");

  const result = document.getElementById("order-result");
  result.hidden = false;
  result.innerHTML = "";
  const heading = document.createElement("h4");
  heading.textContent = "Resumo preparado!";
  const description = document.createElement("p");
  description.textContent = "Confira os itens abaixo. Nenhum pedido foi enviado e nenhum pagamento foi realizado.";
  const pre = document.createElement("pre");
  pre.textContent = summary;
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "button button-dark";
  copyButton.textContent = "Copiar resumo";
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summary);
      showToast("Resumo copiado para a área de transferência.");
    } catch {
      showToast("Não foi possível copiar automaticamente. Selecione e copie o resumo.");
    }
  });
  result.append(heading, description, pre, copyButton);
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  const categoryButton = event.target.closest("[data-category]");

  if (addButton) addToCart(Number(addButton.dataset.add));
  if (favoriteButton) toggleFavorite(Number(favoriteButton.dataset.favorite));
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.delta));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
  if (categoryButton) {
    activeCategory = categoryButton.dataset.category;
    document.querySelectorAll("[data-category]").forEach(button => {
      const active = button === categoryButton;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderProducts();
  }
});

document.getElementById("search-input").addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

document.getElementById("sort-select").addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

document.getElementById("order-form").addEventListener("submit", prepareOrder);
document.getElementById("go-cart").addEventListener("click", () => {
  document.getElementById("carrinho").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("current-year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
