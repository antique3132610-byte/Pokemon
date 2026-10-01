
/* ==========================================
   EVFORGE APP
   Shop + Wishlist + Cart + Checkout + Tracker
   ========================================== */

const products = [
  { id:"charizard", name:"Charizard ex", price:1499, category:"Rare", stock:true, image:"https://images.pokemontcg.io/sv3/125.png" },
  { id:"pikachu", name:"Pikachu", price:799, category:"Holo", stock:true, image:"https://images.pokemontcg.io/sv4/51.png" },
  { id:"mew", name:"Mew ex", price:1299, category:"Rare", stock:false, image:"https://images.pokemontcg.io/sv2/193.png" },
  { id:"gengar", name:"Gengar ex", price:999, category:"Holo", stock:true, image:"https://images.pokemontcg.io/sv3/104.png" },
  { id:"bulbasaur", name:"Bulbasaur", price:599, category:"Vintage", stock:false, image:"https://images.pokemontcg.io/base1/44.png" },
  { id:"blastoise", name:"Blastoise", price:1999, category:"Vintage", stock:true, image:"https://images.pokemontcg.io/base1/2.png" },
  { id:"eevee", name:"Eevee", price:499, category:"Modern", stock:true, image:"https://images.pokemontcg.io/sv6/135.png" },
  { id:"rayquaza", name:"Rayquaza ex", price:1799, category:"Rare", stock:false, image:"https://images.pokemontcg.io/sv7/157.png" }
];

const CART_KEY = "evforgeCart";
const ORDER_KEY = "evforgeDelivery";
const WISH_KEY = "evforgeWishlist";

const money = amount =>
  "₹" + Number(amount).toLocaleString("en-IN");

function readJSON(storage, key, fallback) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

let cart = readJSON(localStorage, CART_KEY, {});
let wishlist = readJSON(localStorage, WISH_KEY, []);

function hasOrder() {
  return Boolean(sessionStorage.getItem(ORDER_KEY));
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
}

function cartCount() {
  return Object.values(cart).reduce(
    (sum, quantity) => sum + Math.max(0, Number(quantity) || 0),
    0
  );
}

function subtotal() {
  return Object.entries(cart).reduce((sum, [id, quantity]) => {
    const product = products.find(p => p.id === id);
    return sum + (product ? product.price * Number(quantity) : 0);
  }, 0);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

/* ==========================================
   NAVIGATION AND TRACKER ACCESS
   ========================================== */

function setupNav() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const current = location.pathname.split("/").pop() || "index.html";

  const links = [
    ["Home", "index.html"],
    ["PokéMart", "shop.html"],
    ["Discounts", "discounts.html"]
  ];

  if (hasOrder()) {
    links.push(["Turbo Tracker 🏁", "tracker.html"]);
  }

  links.push(["Cart 🛒 " + cartCount(), "cart.html"]);

  nav.innerHTML = `
    <a class="brand" href="index.html">⚡ EV<span>FORGE</span></a>
    <div class="navlinks">
      ${links.map(([label, url]) => `
        <a class="${current === url ? "current" : ""}"
           href="${url}">${label}</a>
      `).join("")}
    </div>
  `;
}

function lockTrackerLinks() {
  const unlocked = hasOrder();

  document.querySelectorAll("a[href]").forEach(link => {
    let url;

    try {
      url = new URL(link.getAttribute("href"), location.href);
    } catch {
      return;
    }

    const isTracker = url.pathname.endsWith("/tracker.html");
    const isSpecialButton =
      link.id === "home-tracker-link" ||
      link.id === "discount-tracker-link";

    if (!isTracker && !isSpecialButton) return;

    if (unlocked) {
      link.href = "tracker.html";

      if (link.id === "discount-tracker-link") {
        link.textContent = "🏁 Open Turbo Tracker →";
      } else if (link.id === "home-tracker-link") {
        link.textContent = "Start tracker →";
      }

      return;
    }

    link.href = "shop.html";

    if (link.id === "home-tracker-link") {
      link.textContent = "Unlock after checkout →";
    } else if (link.id === "discount-tracker-link") {
      link.textContent = "🔒 Unlock Turbo Tracker after checkout →";
    } else if (!link.closest("#site-nav")) {
      link.textContent = "🔒 Unlock after checkout";
    }
  });
}

function updateCartBadge() {
  setupNav();
  lockTrackerLinks();
}

/* ==========================================
   SHOP
   ========================================== */

function productCard(product) {
  const wished = wishlist.includes(product.id);

  return `
    <article class="product">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/240x180/111827/ffd400?text=Pokemon+Card'"
      >

      <div class="product-info">
        <span class="badge">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="price">${money(product.price)}</div>

        <p>
          ${product.stock
            ? '<span style="color:#52f5a4">● In stock</span>'
            : '<span style="color:#ff8c9d">● Out of stock</span>'}
        </p>

        <div class="product-buttons">
          <button class="btn"
            ${product.stock ? "" : "disabled"}
            onclick="addToCart('${product.id}')">
            Add to cart
          </button>

          <button class="heart"
            onclick="toggleWish('${product.id}')"
            aria-label="Toggle wishlist">
            ${wished ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderShop() {
  const host = document.getElementById("shop-products");
  if (!host) return;

  const query = (
    document.getElementById("search")?.value || ""
  ).trim().toLowerCase();

  const filter = document.getElementById("filter")?.value || "all";

  let list = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  if (filter === "stock") {
    list = list.filter(p => p.stock);
  } else if (filter === "wishlist") {
    list = list.filter(p => wishlist.includes(p.id));
  } else if (filter !== "all") {
    list = list.filter(p => p.category === filter);
  }

  host.innerHTML = list.length
    ? list.map(productCard).join("")
    : '<div class="panel">No cards match your search.</div>';
}

function renderFeatured() {
  const host = document.getElementById("featured-products");
  if (!host) return;

  host.innerHTML = products
    .filter(p => p.stock)
    .slice(0, 4)
    .map(productCard)
    .join("");
}

/* ==========================================
   WISHLIST
   ========================================== */

function toggleWish(id) {
  wishlist = wishlist.includes(id)
    ? wishlist.filter(item => item !== id)
    : [...wishlist, id];

  saveWishlist();
  renderShop();
  renderFeatured();
}

/* ==========================================
   SHOPPING CART
   ========================================== */

function addToCart(id) {
  const product = products.find(p => p.id === id);

  if (!product || !product.stock) {
    notify("Sorry, this card is out of stock.");
    return;
  }

  cart[id] = Math.min(20, (Number(cart[id]) || 0) + 1);

  saveCart();
  renderCart();
  updateCartBadge();
  notify(product.name + " added to your cart!");
}

function changeQty(id, value) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const quantity = Math.max(
    1,
    Math.min(20, Math.floor(Number(value) || 1))
  );

  cart[id] = quantity;
  saveCart();
  renderCart();
  updateCartBadge();
}

function removeItem(id) {
  delete cart[id];

  saveCart();
  renderCart();
  updateCartBadge();
  notify("Card removed from cart.");
}

function renderCart() {
  const host = document.getElementById("cart-items");
  if (!host) return;

  const entries = Object.entries(cart).filter(([id, quantity]) =>
    products.some(p => p.id === id) && Number(quantity) > 0
  );

  if (!entries.length) {
    host.innerHTML = `
      <div class="empty">
        Your cart is empty. Head to PokéMart to find cards!
      </div>
    `;
  } else {
    host.innerHTML = entries.map(([id, quantity]) => {
      const p = products.find(item => item.id === id);

      return `
        <div class="cart-row">
          <img src="${p.image}" alt="${p.name}"
               onerror="this.style.display='none'">

          <div class="grow">
            <strong>${p.name}</strong>
            <p>${money(p.price)} each</p>
            <button class="btn secondary"
              onclick="removeItem('${id}')">Remove</button>
          </div>

          <label class="small">
            Qty
            <input type="number" min="1" max="20"
              value="${quantity}"
              onchange="changeQty('${id}', this.value)">
          </label>

          <strong>${money(p.price * quantity)}</strong>
        </div>
      `;
    }).join("");
  }

  const sub = subtotal();
  const shipping = sub === 0 || sub >= 1500 ? 0 : 99;
  const total = sub + shipping;

  setText("subtotal", money(sub));
  setText("shipping", money(shipping));
  setText("grand-total", money(total));
  setText("cart-total", money(total));
  setText("cart-count", cartCount());
}

/* ==========================================
   CHECKOUT
   ========================================== */

function checkout() {
  const message = document.getElementById("checkout-message");

  if (cartCount() === 0) {
    if (message) {
      message.textContent = "Your cart is empty!";
    } else {
      notify("Your cart is empty!");
    }
    return;
  }

  const sub = subtotal();
  const shipping = sub >= 1500 ? 0 : 99;

  const order = {
    orderId: "EVF-" + Date.now().toString().slice(-8),
    total: sub + shipping,
    items: cartCount(),
    createdAt: new Date().toISOString(),
    status: "Order confirmed"
  };

  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));

  cart = {};
  saveCart();

  window.location.href = "tracker.html?start=1";
}

/* ==========================================
   DISCOUNTS
   Note: coupons are demo-only.
   ========================================== */

function copyCoupon(code) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => notify("Coupon copied: " + code))
      .catch(() => notify("Coupon code: " + code));
  } else {
    notify("Coupon code: " + code);
  }
}

/* ==========================================
   NOTIFICATIONS
   ========================================== */

function notify(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#ffd400",
      color: "#111",
      padding: "13px 20px",
      borderRadius: "10px",
      fontWeight: "bold",
      zIndex: "9999",
      maxWidth: "90%",
      textAlign: "center"
    });

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(window.evforgeToastTimer);

  window.evforgeToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

/* ==========================================
   FIXED DELIVERY MAP
   ========================================== */

let raceTimer = null;
let raceProgress = 0;

const routePoints = [
  [60, 80],
  [190, 80],
  [190, 160],
  [330, 160],
  [330, 260],
  [470, 260],
  [470, 360],
  [740, 360]
];

function svgEl(tag, attrs) {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    tag
  );

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

function positionMarker(ids, x, y) {
  let marker = null;

  for (const id of ids) {
    marker = document.getElementById(id);
    if (marker) break;
  }

  if (!marker) return;

  if (marker.tagName.toLowerCase() === "text") {
    marker.setAttribute("x", x);
    marker.setAttribute("y", y);
  } else {
    marker.setAttribute("transform", `translate(${x} ${y})`);
  }
}

function buildFixedMap() {
  const roads = document.getElementById("map-roads");
  const parks = document.getElementById("map-parks");
  const buildings = document.getElementById("map-buildings");
  const route = document.getElementById("car-route");

  if (!roads || !parks || !buildings || !route) return false;

  roads.replaceChildren();
  parks.replaceChildren();
  buildings.replaceChildren();

  [
    [30, 190, 95, 45],
    [220, 35, 70, 35],
    [360, 185, 75, 45],
    [520, 65, 110, 45],
    [570, 290, 100, 35]
  ].forEach(([x, y, width, height]) => {
    parks.appendChild(svgEl("rect", {
      x, y, width, height, rx: 8, fill: "#1d4434"
    }));
  });

  [60, 190, 330, 470, 610, 740].forEach(x => {
    roads.appendChild(svgEl("path", {
      d: `M${x} 25 V415`,
      stroke: "#425364",
      "stroke-width": 19,
      fill: "none"
    }));
  });

  [80, 160, 260, 360].forEach(y => {
    roads.appendChild(svgEl("path", {
      d: `M25 ${y} H775`,
      stroke: "#425364",
      "stroke-width": 19,
      fill: "none"
    }));
  });

  [
    [100, 35], [235, 100], [235, 185],
    [370, 35], [370, 290], [520, 185],
    [520, 300], [650, 100], [650, 185],
    [100, 285], [235, 300], [370, 100]
  ].forEach(([x, y], i) => {
    buildings.appendChild(svgEl("rect", {
      x,
      y,
      width: 25 + (i % 3) * 7,
      height: 20 + (i % 2) * 9,
      rx: 3,
      fill: "#35465a"
    }));
  });

  route.setAttribute(
    "d",
    routePoints.map(([x, y], i) =>
      `${i === 0 ? "M" : "L"}${x} ${y}`
    ).join(" ")
  );

  const [sx, sy] = routePoints[0];
  const [ex, ey] = routePoints[routePoints.length - 1];

  positionMarker(["store-marker", "store-pin"], sx, sy - 24);
  positionMarker(["destination-marker", "house-pin"], ex - 5, ey - 24);

  const car = document.getElementById("delivery-car");

  if (car) {
    if (car.tagName.toLowerCase() === "text") {
      car.setAttribute("text-anchor", "middle");
      car.setAttribute("dominant-baseline", "central");
    }
    placeCarAt(raceProgress);
  }

  setText("city-name", "EVFORGE Delivery District");
  setText("speed", "0");
  setText("distance", "12.4");
  setText("delivery-status", "Ready");

  const progress = document.getElementById("delivery-progress");
  if (progress) progress.style.width = (raceProgress * 100) + "%";

  setText("delivery-message", "Route confirmed. Waiting for checkout.");

  return true;
}

function placeCarAt(progress) {
  const route = document.getElementById("car-route");
  const car = document.getElementById("delivery-car");

  if (!route || !car) return;

  const length = route.getTotalLength();
  if (!length) return;

  const distance = Math.max(0, Math.min(1, progress)) * length;
  const point = route.getPointAtLength(distance);
  const sampleDistance = Math.min(length, distance + 2);
  const next = route.getPointAtLength(sampleDistance);

  let angle = Math.atan2(
    next.y - point.y,
    next.x - point.x
  ) * 180 / Math.PI;

  if (distance >= length - 0.01) {
    const previous = route.getPointAtLength(Math.max(0, length - 2));

    angle = Math.atan2(
      point.y - previous.y,
      point.x - previous.x
    ) * 180 / Math.PI;
  }

  car.setAttribute(
    "transform",
    `translate(${point.x} ${point.y}) rotate(${angle})`
  );
}

function startRace() {
  if (!hasOrder()) {
    window.location.replace("shop.html");
    return;
  }

  const route = document.getElementById("car-route");
  if (!route || !route.getTotalLength()) return;
  if (raceTimer) return;

  if (raceProgress >= 1) {
    raceProgress = 0;
    placeCarAt(0);
  }

  const length = route.getTotalLength();

  setText("delivery-status", "On the way");
  setText("delivery-message", "Your EVFORGE delivery car is on the road!");

  const startButton = document.getElementById("start-btn");
  if (startButton) startButton.disabled = true;

  raceTimer = setInterval(() => {
    raceProgress = Math.min(1, raceProgress + 0.0025);

    placeCarAt(raceProgress);

    const remaining = length * (1 - raceProgress);

    setText("speed", raceProgress >= 1 ? "0" : "120");
    setText("distance", (remaining / length * 12.4).toFixed(1));

    const bar = document.getElementById("delivery-progress");
    if (bar) bar.style.width = (raceProgress * 100) + "%";

    if (raceProgress >= 1) {
      clearInterval(raceTimer);
      raceTimer = null;

      setText("speed", "0");
      setText("distance", "0.0");
      setText("delivery-status", "Delivered 🏁");
      setText(
        "delivery-message",
        "Your simulated delivery has reached its destination!"
      );

      if (startButton) startButton.disabled = false;

      notify("Delivery complete! 🏁");
    }
  }, 50);
}

function pauseRace() {
  if (raceTimer) {
    clearInterval(raceTimer);
    raceTimer = null;
  }

  const startButton = document.getElementById("start-btn");
  if (startButton) startButton.disabled = false;

  if (raceProgress > 0 && raceProgress < 1) {
    setText("delivery-status", "Paused");
    setText("delivery-message", "Delivery paused. Press Resume to continue.");
  }
}

function initTracker() {
  if (!document.getElementById("delivery-map")) return;

  if (!hasOrder()) {
    window.location.replace("shop.html");
    return;
  }

  if (!buildFixedMap()) return;

  const order = readJSON(sessionStorage, ORDER_KEY, null);

  if (order) {
    setText("delivery-status", "Order confirmed");
    setText(
      "delivery-message",
      `Order ${order.orderId} confirmed! Preparing your delivery.`
    );
  }

  const params = new URLSearchParams(location.search);

  if (params.get("start") === "1") {
    history.replaceState({}, "", location.pathname);
    setTimeout(startRace, 700);
  }
}

/* ==========================================
   INITIALISE ALL PAGE FEATURES
   ========================================== */

function init() {
  setupNav();
  lockTrackerLinks();
  renderShop();
  renderFeatured();
  renderCart();
  initTracker();
}

document.addEventListener("DOMContentLoaded", init);
