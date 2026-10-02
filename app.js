/* =========================================================
   EVFORGE APP.JS
   FULL VERSION
   ========================================================= */

/* ==========================================
   PRODUCTS
   ========================================== */

const products = [
  {
    id: "charizard",
    name: "Charizard ex",
    price: 1499,
    category: "Rare",
    stock: true,
    image: "https://images.pokemontcg.io/sv3/125.png"
  },

  {
    id: "pikachu",
    name: "Pikachu",
    price: 799,
    category: "Holo",
    stock: true,
    image: "https://images.pokemontcg.io/sv4/51.png"
  },

  {
    id: "mew",
    name: "Mew ex",
    price: 1299,
    category: "Rare",
    stock: false,
    image: "https://images.pokemontcg.io/sv2/193.png"
  },

  {
    id: "gengar",
    name: "Gengar ex",
    price: 999,
    category: "Holo",
    stock: true,
    image: "https://images.pokemontcg.io/sv3/104.png"
  },

  {
    id: "bulbasaur",
    name: "Bulbasaur",
    price: 599,
    category: "Vintage",
    stock: false,
    image: "https://images.pokemontcg.io/base1/44.png"
  },

  {
    id: "blastoise",
    name: "Blastoise",
    price: 1999,
    category: "Vintage",
    stock: true,
    image: "https://images.pokemontcg.io/base1/2.png"
  },

  {
    id: "eevee",
    name: "Eevee",
    price: 499,
    category: "Modern",
    stock: true,
    image: "https://images.pokemontcg.io/sv6/135.png"
  },

  {
    id: "rayquaza",
    name: "Rayquaza ex",
    price: 1799,
    category: "Rare",
    stock: false,
    image: "https://images.pokemontcg.io/sv7/157.png"
  }
];


/* ==========================================
   STORAGE
   ========================================== */

const CART_KEY = "evforgeCart";
const ORDER_KEY = "evforgeDelivery";
const WISH_KEY = "evforgeWishlist";
const HISTORY_KEY = "evforgeOrderHistory";
const RACE_KEY = "evforgeRaceProgress";
const VERIFIED_KEY = "evforgeSmsVerified";
const COUPON_KEY = "evforgeSavedCoupons";
const ACTIVE_COUPON_KEY = "evforgeActiveCoupon";


/* ==========================================
   HELPERS
   ========================================== */

const money = amount =>
  "₹" + Number(amount || 0).toLocaleString("en-IN");


function readJSON(storage, key, fallback) {
  try {
    const value = JSON.parse(
      storage.getItem(key)
    );

    return value ?? fallback;
  } catch {
    return fallback;
  }
}


function setText(id, value) {
  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


/* ==========================================
   CART + WISHLIST
   ========================================== */

let cart =
  readJSON(localStorage, CART_KEY, {});

let wishlist =
  readJSON(localStorage, WISH_KEY, []);


function saveCart() {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
}


function saveWishlist() {
  localStorage.setItem(
    WISH_KEY,
    JSON.stringify(wishlist)
  );
}


function cartCount() {
  return Object.values(cart).reduce(
    (sum, quantity) =>
      sum +
      Math.max(
        0,
        Number(quantity) || 0
      ),
    0
  );
}


function subtotal() {
  return Object.entries(cart).reduce(
    (sum, [id, quantity]) => {

      const product =
        products.find(
          p => p.id === id
        );

      return (
        sum +
        (
          product
            ? product.price *
              Number(quantity)
            : 0
        )
      );

    },
    0
  );
}


/* ==========================================
   ORDER STORAGE
   ========================================== */

function hasOrder() {
  return Boolean(
    localStorage.getItem(ORDER_KEY) ||
    sessionStorage.getItem(ORDER_KEY)
  );
}


function getOrder() {
  return (
    readJSON(
      localStorage,
      ORDER_KEY,
      null
    ) ||
    readJSON(
      sessionStorage,
      ORDER_KEY,
      null
    )
  );
}


/* ==========================================
   NAVIGATION
   ========================================== */

function setupNav() {

  const nav =
    document.getElementById(
      "site-nav"
    );

  if (!nav) return;

  const current =
    location.pathname
      .split("/")
      .pop() ||
    "index.html";

  const links = [
    ["Home", "index.html"],
    ["PokéMart", "shop.html"],
    ["Discounts", "discounts.html"],
    ["Order History", "history.html"],
    [
      "Cart 🛒 " + cartCount(),
      "cart.html"
    ]
  ];

  nav.innerHTML = `
    <a
      class="brand"
      href="index.html"
    >
      ⚡ EV<span>FORGE</span>
    </a>

    <div class="navlinks">

      ${links.map(
        ([label, url]) => `
          <a
            class="${
              current === url
                ? "current"
                : ""
            }"
            href="${url}"
          >
            ${label}
          </a>
        `
      ).join("")}

    </div>
  `;
}


function lockTrackerLinks() {

  document
    .querySelectorAll("a[href]")
    .forEach(link => {

      let url;

      try {
        url = new URL(
          link.getAttribute("href"),
          location.href
        );
      } catch {
        return;
      }

      if (
        !url.pathname.endsWith(
          "/tracker.html"
        )
      ) {
        return;
      }

      if (
        location.pathname.endsWith(
          "/index.html"
        ) ||
        location.pathname.endsWith(
          "/Pokemon/"
        )
      ) {

        const card =
          link.closest("article");

        if (card) {
          card.remove();
        } else {
          link.remove();
        }

        return;
      }

      if (!hasOrder()) {
        link.href = "shop.html";
        link.textContent =
          "🔒 Continue to shop";
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

  const wished =
    wishlist.includes(
      product.id
    );

  return `
    <article class="product">

      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="
          this.onerror=null;
          this.src='https://placehold.co/240x180/111827/ffd400?text=Pokemon+Card'
        "
      >

      <div class="product-info">

        <span class="badge">
          ${product.category}
        </span>

        <h3>
          ${product.name}
        </h3>

        <div class="price">
          ${money(product.price)}
        </div>

        <p>
          ${
            product.stock
              ? '<span style="color:#52f5a4">● In stock</span>'
              : '<span style="color:#ff8c9d">● Out of stock</span>'
          }
        </p>

        <div class="product-buttons">

          <button
            class="btn"
            ${
              product.stock
                ? ""
                : "disabled"
            }
            onclick="
              addToCart(
                '${product.id}'
              )
            "
          >
            Add to cart
          </button>

          <button
            class="heart"
            onclick="
              toggleWish(
                '${product.id}'
              )
            "
            aria-label="Toggle wishlist"
          >
            ${
              wished
                ? "♥"
                : "♡"
            }
          </button>

        </div>

      </div>

    </article>
  `;
}


function renderShop() {

  const host =
    document.getElementById(
      "shop-products"
    );

  if (!host) return;

  const query =
    (
      document.getElementById(
        "search"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();

  const filter =
    document.getElementById(
      "filter"
    )?.value ||
    "all";

  let list =
    products.filter(
      p =>
        p.name
          .toLowerCase()
          .includes(query)
    );

  if (filter === "stock") {

    list =
      list.filter(
        p => p.stock
      );

  } else if (
    filter === "wishlist"
  ) {

    list =
      list.filter(
        p =>
          wishlist.includes(
            p.id
          )
      );

  } else if (
    filter !== "all"
  ) {

    list =
      list.filter(
        p =>
          p.category ===
          filter
      );
  }

  host.innerHTML =
    list.length
      ? list
          .map(productCard)
          .join("")
      : `
        <div class="panel">
          No cards match your search.
        </div>
      `;
}


function renderFeatured() {

  const host =
    document.getElementById(
      "featured-products"
    );

  if (!host) return;

  host.innerHTML =
    products
      .filter(
        p => p.stock
      )
      .slice(0, 4)
      .map(productCard)
      .join("");
}


/* ==========================================
   WISHLIST
   ========================================== */

function toggleWish(id) {

  wishlist =
    wishlist.includes(id)
      ? wishlist.filter(
          item =>
            item !== id
        )
      : [
          ...wishlist,
          id
        ];

  saveWishlist();

  renderShop();
  renderFeatured();
}


/* ==========================================
   CART
   ========================================== */

function addToCart(id) {

  const product =
    products.find(
      p => p.id === id
    );

  if (
    !product ||
    !product.stock
  ) {

    notify(
      "Sorry, this card is out of stock."
    );

    return;
  }

  cart[id] =
    Math.min(
      20,
      (
        Number(
          cart[id]
        ) || 0
      ) + 1
    );

  saveCart();
  renderCart();
  updateCartBadge();

  notify(
    product.name +
    " added to your cart!"
  );
}


function changeQty(
  id,
  value
) {

  const product =
    products.find(
      p => p.id === id
    );

  if (!product) return;

  const quantity =
    Math.max(
      1,
      Math.min(
        20,
        Math.floor(
          Number(value) || 1
        )
      )
    );

  cart[id] =
    quantity;

  saveCart();
  renderCart();
  updateCartBadge();
}


function removeItem(id) {

  delete cart[id];

  saveCart();
  renderCart();
  updateCartBadge();

  notify(
    "Card removed from cart."
  );
}


function renderCart() {

  const host =
    document.getElementById(
      "cart-items"
    );

  if (host) {

    const entries =
      Object.entries(cart)
        .filter(
          ([id, quantity]) =>
            products.some(
              p =>
                p.id === id
            ) &&
            Number(quantity) > 0
        );

    if (!entries.length) {

      host.innerHTML = `
        <div class="empty">
          Your cart is empty.
          Head to PokéMart to
          find cards!
        </div>
      `;

    } else {

      host.innerHTML =
        entries
          .map(
            ([id, quantity]) => {

              const p =
                products.find(
                  item =>
                    item.id === id
                );

              return `
                <div class="cart-row">

                  <img
                    src="${p.image}"
                    alt="${p.name}"
                    onerror="
                      this.style.display='none'
                    "
                  >

                  <div class="grow">

                    <strong>
                      ${p.name}
                    </strong>

                    <p>
                      ${money(p.price)}
                      each
                    </p>

                    <button
                      class="btn secondary"
                      onclick="
                        removeItem(
                          '${id}'
                        )
                      "
                    >
                      Remove
                    </button>

                  </div>

                  <label class="small">

                    Qty

                    <input
                      type="number"
                      min="1"
                      max="20"
                      value="${quantity}"
                      onchange="
                        changeQty(
                          '${id}',
                          this.value
                        )
                      "
                    >

                  </label>

                  <strong>
                    ${money(
                      p.price *
                      quantity
                    )}
                  </strong>

                </div>
              `;
            }
          )
          .join("");
    }
  }

  updateCheckoutTotals();
}


/* ==========================================
   COUPONS
   ========================================== */

const coupons = {

  EVFORGE10: {
    code: "EVFORGE10",
    discount: 10,
    type: "percent",
    description:
      "10% off your order"
  },

  POKEMON20: {
    code: "POKEMON20",
    discount: 20,
    type: "percent",
    description:
      "20% off your order"
  },

  CARD500: {
    code: "CARD500",
    discount: 500,
    type: "fixed",
    description:
      "₹500 off your order"
  }
};


function getSavedCoupons() {

  return readJSON(
    localStorage,
    COUPON_KEY,
    []
  );
}


function saveCoupon(code) {

  code =
    String(code || "")
      .trim()
      .toUpperCase();

  if (!coupons[code]) {

    notify(
      "That coupon does not exist."
    );

    return;
  }

  const saved =
    getSavedCoupons();

  if (
    !saved.includes(code)
  ) {

    saved.push(code);

    localStorage.setItem(
      COUPON_KEY,
      JSON.stringify(saved)
    );

    notify(
      "Coupon saved: " +
      code +
      " 🎟️"
    );

  } else {

    notify(
      "You already saved " +
      code +
      "."
    );
  }

  renderSavedCoupons();
}


function removeSavedCoupon(
  code
) {

  const saved =
    getSavedCoupons()
      .filter(
        item =>
          item !== code
      );

  localStorage.setItem(
    COUPON_KEY,
    JSON.stringify(saved)
  );

  renderSavedCoupons();

  notify(
    "Coupon removed."
  );
}


function renderSavedCoupons() {

  const host =
    document.getElementById(
      "saved-coupons"
    );

  if (!host) return;

  const saved =
    getSavedCoupons();

  if (!saved.length) {

    host.innerHTML = `
      <div class="empty">
        You haven't saved
        any coupons yet.
      </div>
    `;

    return;
  }

  host.innerHTML =
    saved
      .map(code => {

        const coupon =
          coupons[code];

        if (!coupon) {
          return "";
        }

        return `
          <div
            class="coupon-saved-card"
          >

            <strong>
              ${coupon.code}
            </strong>

            <span>
              ${coupon.description}
            </span>

            <button
              class="btn"
              onclick="
                useSavedCoupon(
                  '${coupon.code}'
                )
              "
            >
              Use
            </button>

            <button
              class="btn secondary"
              onclick="
                removeSavedCoupon(
                  '${coupon.code}'
                )
              "
            >
              Remove
            </button>

          </div>
        `;
      })
      .join("");
}


function copyCoupon(code) {

  code =
    String(code || "")
      .trim()
      .toUpperCase();

  if (
    navigator.clipboard?.writeText
  ) {

    navigator.clipboard
      .writeText(code)
      .then(() => {

        notify(
          "Copied " +
          code +
          " 📋"
        );

        saveCoupon(code);

      })
      .catch(() => {

        notify(
          "Coupon code: " +
          code
        );

      });

  } else {

    notify(
      "Coupon code: " +
      code
    );
  }
}


function useSavedCoupon(code) {

  localStorage.setItem(
    ACTIVE_COUPON_KEY,
    code
  );

  window.location.href =
    "checkout.html?coupon=" +
    encodeURIComponent(
      code
    );
}


function getActiveCoupon() {

  const code =
    localStorage.getItem(
      ACTIVE_COUPON_KEY
    );

  if (!code) {
    return null;
  }

  return (
    coupons[code] ||
    null
  );
}


function calculateDiscount(
  subtotalAmount
) {

  const coupon =
    getActiveCoupon();

  if (
    !coupon ||
    subtotalAmount <= 0
  ) {
    return 0;
  }

  let discount = 0;

  if (
    coupon.type ===
    "percent"
  ) {

    discount =
      subtotalAmount *
      (
        coupon.discount /
        100
      );
  }

  if (
    coupon.type ===
    "fixed"
  ) {

    discount =
      coupon.discount;
  }

  return Math.min(
    subtotalAmount,
    Math.max(
      0,
      discount
    )
  );
}


function getCheckoutTotals() {

  const sub =
    subtotal();

  const discount =
    calculateDiscount(
      sub
    );

  const afterDiscount =
    Math.max(
      0,
      sub - discount
    );

  const shipping =
    afterDiscount === 0 ||
    afterDiscount >= 1500
      ? 0
      : 99;

  return {
    subtotal: sub,
    discount,
    shipping,
    total:
      afterDiscount +
      shipping
  };
}


function updateCheckoutTotals() {

  const totals =
    getCheckoutTotals();

  setText(
    "subtotal",
    money(
      totals.subtotal
    )
  );

  setText(
    "discount",
    "-" +
    money(
      totals.discount
    )
  );

  setText(
    "shipping",
    money(
      totals.shipping
    )
  );

  setText(
    "grand-total",
    money(
      totals.total
    )
  );

  setText(
    "cart-total",
    money(
      totals.total
    )
  );

  const coupon =
    getActiveCoupon();

  const message =
    document.getElementById(
      "coupon-message"
    );

  if (
    coupon &&
    message
  ) {

    message.textContent =
      `${coupon.code} applied: ${coupon.description}`;
  }
}


function applyCoupon() {

  const input =
    document.getElementById(
      "coupon-code"
    );

  const message =
    document.getElementById(
      "coupon-message"
    );

  if (!input) return;

  const code =
    input.value
      .trim()
      .toUpperCase();

  if (!code) {

    if (message) {

      message.textContent =
        "Enter a coupon code first.";
    }

    return;
  }

  if (!coupons[code]) {

    localStorage.removeItem(
      ACTIVE_COUPON_KEY
    );

    if (message) {

      message.textContent =
        "Invalid coupon code.";
    }

    notify(
      "Invalid coupon code ❌"
    );

    updateCheckoutTotals();

    return;
  }

  localStorage.setItem(
    ACTIVE_COUPON_KEY,
    code
  );

  saveCoupon(code);

  if (message) {

    message.textContent =
      `${code} applied! ${coupons[code].description}`;
  }

  notify(
    code +
    " applied! 🎟️"
  );

  updateCheckoutTotals();
}


function clearCoupon() {

  localStorage.removeItem(
    ACTIVE_COUPON_KEY
  );

  const input =
    document.getElementById(
      "coupon-code"
    );

  const message =
    document.getElementById(
      "coupon-message"
    );

  if (input) {
    input.value = "";
  }

  if (message) {

    message.textContent =
      "Coupon removed.";
  }

  updateCheckoutTotals();
}


function initCheckoutCoupon() {

  const input =
    document.getElementById(
      "coupon-code"
    );

  if (!input) return;

  const params =
    new URLSearchParams(
      location.search
    );

  const urlCoupon =
    params.get("coupon");

  const savedCoupon =
    localStorage.getItem(
      ACTIVE_COUPON_KEY
    );

  const code =
    urlCoupon ||
    savedCoupon;

  if (
    code &&
    coupons[
      code.toUpperCase()
    ]
  ) {

    input.value =
      code.toUpperCase();

    localStorage.setItem(
      ACTIVE_COUPON_KEY,
      code.toUpperCase()
    );

    updateCheckoutTotals();
  }
}


/* ==========================================
   CHECKOUT
   ========================================== */

function checkout() {

  if (
    cartCount() === 0
  ) {

    notify(
      "Your cart is empty!"
    );

    return;
  }

  window.location.href =
    "checkout.html";
}


function submitDemoCheckout(
  event
) {

  event.preventDefault();

  const form =
    document.getElementById(
      "demo-checkout-form"
    );

  const message =
    document.getElementById(
      "checkout-message"
    );

  if (
    !form ||
    !form.reportValidity()
  ) {
    return;
  }

  if (
    cartCount() === 0
  ) {

    if (message) {

      message.textContent =
        "Your cart is empty.";
    }

    notify(
      "Your cart is empty!"
    );

    window.location.href =
      "shop.html";

    return;
  }

  const getValue =
    id =>
      document
        .getElementById(id)
        ?.value
        .trim() ||
      "";

  const customer = {

    name:
      getValue(
        "customer-name"
      ),

    email:
      getValue(
        "customer-email"
      ),

    phone:
      getValue(
        "customer-phone"
      ),

    alternatePhone:
      getValue(
        "customer-alt-phone"
      ),

    address:
      getValue(
        "customer-address"
      ),

    apartment:
      getValue(
        "customer-address2"
      ),

    landmark:
      getValue(
        "customer-landmark"
      ),

    city:
      getValue(
        "customer-city"
      ),

    state:
      getValue(
        "customer-state"
      ),

    postalCode:
      getValue(
        "customer-postal"
      ),

    country:
      getValue(
        "customer-country"
      ),

    preferredDeliveryTime:
      getValue(
        "delivery-time"
      ),

    deliveryInstructions:
      getValue(
        "delivery-instructions"
      ),

    safePlaceAllowed:
      document.getElementById(
        "safe-place"
      )?.checked ||
      false
  };

  const totals =
    getCheckoutTotals();

  const items =
    Object.entries(cart)
      .map(
        ([id, quantity]) => {

          const p =
            products.find(
              product =>
                product.id ===
                id
            );

          return {
            id,
            name:
              p?.name ||
              id,
            price:
              p?.price ||
              0,
            quantity:
              Number(quantity) ||
              0
          };
        }
      );

  const activeCoupon =
    getActiveCoupon();

  const order = {

    orderId:
      "EVF-" +
      Date.now()
        .toString()
        .slice(-8),

    subtotal:
      totals.subtotal,

    discount:
      totals.discount,

    shipping:
      totals.shipping,

    total:
      totals.total,

    coupon:
      activeCoupon
        ? activeCoupon.code
        : null,

    items,

    itemCount:
      cartCount(),

    createdAt:
      new Date().toISOString(),

    status:
      "Order confirmed",

    customer
  };

  try {

    localStorage.setItem(
      ORDER_KEY,
      JSON.stringify(order)
    );

    const history =
      readJSON(
        localStorage,
        HISTORY_KEY,
        []
      );

    history.unshift(order);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    localStorage.setItem(
      RACE_KEY,
      "0"
    );

    sessionStorage.removeItem(
      VERIFIED_KEY
    );

    cart = {};

    saveCart();

    localStorage.removeItem(
      ACTIVE_COUPON_KEY
    );

  } catch (error) {

    if (message) {

      message.textContent =
        "Could not save your demo order.";
    }

    return;
  }

  window.location.href =
    "sms.html";
}


/* ==========================================
   ORDER HISTORY
   ========================================== */

function getOrderHistory() {

  return readJSON(
    localStorage,
    HISTORY_KEY,
    []
  );
}


function renderOrderHistory() {

  const host =
    document.getElementById(
      "history-list"
    );

  if (!host) return;

  const history =
    getOrderHistory();

  if (!history.length) {

    host.innerHTML = `
      <div class="empty">

        <h2>
          No orders yet
        </h2>

        <p>
          Complete a demo checkout
          and your order will appear here.
        </p>

      </div>
    `;

    return;
  }

  host.innerHTML =
    history
      .map(
        order => {

          const date =
            order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleString()
              : "Date unavailable";

          const items =
            Array.isArray(
              order.items
            )
              ? order.items
              : [];

          const itemHTML =
            items
              .map(
                item => `
                  <li>
                    ${item.name}
                    × ${item.quantity}

                    <span>
                      ${money(
                        item.price *
                        item.quantity
                      )}
                    </span>
                  </li>
                `
              )
              .join("");

          return `
            <article
              class="order-card"
            >

              <div
                class="order-card-top"
              >

                <div>

                  <h3>
                    ${order.orderId}
                  </h3>

                  <p>
                    ${date}
                  </p>

                </div>

                <span
                  class="order-status"
                >
                  ${order.status}
                </span>

              </div>


              <div
                class="order-customer"
              >

                <strong>
                  ${
                    order.customer?.name ||
                    "Demo customer"
                  }
                </strong>

                <span>
                  ${
                    order.customer?.city ||
                    "No city"
                  }
                </span>

              </div>


              <ul
                class="order-items"
              >
                ${itemHTML}
              </ul>


              <div
                class="order-total-lines"
              >

                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ${money(
                      order.subtotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Coupon
                  </span>

                  <strong
                    style="color:#52f5a4"
                  >
                    ${
                      order.coupon ||
                      "None"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Discount
                  </span>

                  <strong
                    style="color:#52f5a4"
                  >
                    -${money(
                      order.discount
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Shipping
                  </span>

                  <strong>
                    ${money(
                      order.shipping
                    )}
                  </strong>
                </div>

                <div
                  class="order-grand-total"
                >

                  <span>
                    Total
                  </span>

                  <strong>
                    ${money(
                      order.total
                    )}
                  </strong>

                </div>

              </div>


              <button
                class="btn"
                onclick="
                  loadPreviousOrder(
                    '${order.orderId}'
                  )
                "
              >
                🚗 Track This Demo Order
              </button>

            </article>
          `;
        }
      )
      .join("");
}


function loadPreviousOrder(
  orderId
) {

  const history =
    getOrderHistory();

  const order =
    history.find(
      item =>
        item.orderId ===
        orderId
    );

  if (!order) {

    notify(
      "Order not found."
    );

    return;
  }

  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify(order)
  );

  localStorage.setItem(
    RACE_KEY,
    "0"
  );

  sessionStorage.removeItem(
    VERIFIED_KEY
  );

  notify(
    "Order loaded into Turbo Tracker 🚗"
  );

  setTimeout(
    () => {

      window.location.href =
        "sms.html";

    },
    700
  );
}


function clearOrderHistory() {

  if (
    !confirm(
      "Delete all saved demo order history from this browser?"
    )
  ) {
    return;
  }

  localStorage.removeItem(
    HISTORY_KEY
  );

  renderOrderHistory();

  notify(
    "Order history cleared."
  );
}


/* ==========================================
   NOTIFICATIONS
   ========================================== */

function notify(message) {

  let toast =
    document.getElementById(
      "toast"
    );

  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "toast";

    Object.assign(
      toast.style,
      {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform:
          "translateX(-50%)",
        background: "#ffd400",
        color: "#111",
        padding:
          "13px 20px",
        borderRadius:
          "10px",
        fontWeight:
          "bold",
        zIndex:
          "9999",
        maxWidth:
          "90%",
        textAlign:
          "center"
      }
    );

    document.body.appendChild(
      toast
    );
  }

  toast.textContent =
    message;

  toast.style.display =
    "block";

  clearTimeout(
    window.evforgeToastTimer
  );

  window.evforgeToastTimer =
    setTimeout(
      () => {

        toast.style.display =
          "none";

      },
      2500
    );
}


/* ==========================================
   TURBO TRACKER
   ========================================== */

let raceTimer = null;

let raceProgress =
  Number(
    localStorage.getItem(
      RACE_KEY
    )
  ) || 0;


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


function svgEl(
  tag,
  attrs
) {

  const element =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      tag
    );

  Object.entries(attrs)
    .forEach(
      ([key, value]) => {

        element.setAttribute(
          key,
          value
        );

      }
    );

  return element;
}


function positionMarker(
  ids,
  x,
  y
) {

  let marker = null;

  for (
    const id of ids
  ) {

    marker =
      document.getElementById(
        id
      );

    if (marker) {
      break;
    }
  }

  if (!marker) return;

  if (
    marker.tagName
      .toLowerCase() ===
    "text"
  ) {

    marker.setAttribute(
      "x",
      x
    );

    marker.setAttribute(
      "y",
      y
    );

  } else {

    marker.setAttribute(
      "transform",
      `translate(${x} ${y})`
    );
  }
}


function buildFixedMap() {

  const roads =
    document.getElementById(
      "map-roads"
    );

  const parks =
    document.getElementById(
      "map-parks"
    );

  const buildings =
    document.getElementById(
      "map-buildings"
    );

  const route =
    document.getElementById(
      "car-route"
    );

  if (
    !roads ||
    !parks ||
    !buildings ||
    !route
  ) {
    return false;
  }

  roads.replaceChildren();
  parks.replaceChildren();
  buildings.replaceChildren();


  [
    [30, 190, 95, 45],
    [220, 35, 70, 35],
    [360, 185, 75, 45],
    [520, 65, 110, 45],
    [570, 290, 100, 35]
  ]
    .forEach(
      ([
        x,
        y,
        width,
        height
      ]) => {

        parks.appendChild(
          svgEl(
            "rect",
            {
              x,
              y,
              width,
              height,
              rx: 8,
              fill: "#1d4434"
            }
          )
        );

      }
    );


  [
    60,
    190,
    330,
    470,
    610,
    740
  ]
    .forEach(
      x => {

        roads.appendChild(
          svgEl(
            "path",
            {
              d:
                `M${x} 25 V415`,
              stroke:
                "#425364",
              "stroke-width":
                19,
              fill:
                "none"
            }
          )
        );

      }
    );


  [
    80,
    160,
    260,
    360
  ]
    .forEach(
      y => {

        roads.appendChild(
          svgEl(
            "path",
            {
              d:
                `M25 ${y} H775`,
              stroke:
                "#425364",
              "stroke-width":
                19,
              fill:
                "none"
            }
          )
        );

      }
    );


  [
    [100, 35],
    [235, 100],
    [235, 185],
    [370, 35],
    [370, 290],
    [520, 185],
    [520, 300],
    [650, 100],
    [650, 185],
    [100, 285],
    [235, 300],
    [370, 100]
  ]
    .forEach(
      ([x, y], i) => {

        buildings.appendChild(
          svgEl(
            "rect",
            {
              x,
              y,
              width:
                25 +
                (i % 3) * 7,
              height:
                20 +
                (i % 2) * 9,
              rx: 3,
              fill:
                "#35465a"
            }
          )
        );

      }
    );


  route.setAttribute(
    "d",
    routePoints
      .map(
        ([x, y], i) =>
          `${
            i === 0
              ? "M"
              : "L"
          }${x} ${y}`
      )
      .join(" ")
  );


  const [
    sx,
    sy
  ] =
    routePoints[0];

  const [
    ex,
    ey
  ] =
    routePoints[
      routePoints.length - 1
    ];


  positionMarker(
    [
      "store-marker",
      "store-pin"
    ],
    sx,
    sy - 24
  );


  positionMarker(
    [
      "destination-marker",
      "house-pin"
    ],
    ex - 5,
    ey - 24
  );


  placeCarAt(
    raceProgress
  );


  setText(
    "city-name",
    "EVFORGE Delivery District"
  );

  setText(
    "speed",
    "0"
  );

  setText(
    "distance",
    "12.4"
  );

  setText(
    "delivery-status",
    "Ready"
  );


  const bar =
    document.getElementById(
      "delivery-progress"
    );

  if (bar) {

    bar.style.width =
      (
        raceProgress *
        100
      ) + "%";
  }


  updateTrackerDashboard(
    0,
    12.4
  );


  setText(
    "delivery-message",
    "Your demo order is being prepared."
  );

  return true;
}


/* ==========================================
   CAR POSITION
   ========================================== */

function placeCarAt(
  progress
) {

  const route =
    document.getElementById(
      "car-route"
    );

  const car =
    document.getElementById(
      "delivery-car"
    );

  if (
    !route ||
    !car
  ) {
    return;
  }

  const length =
    route.getTotalLength();

  if (!length) return;

  const distance =
    Math.max(
      0,
      Math.min(
        1,
        progress
      )
    ) * length;

  const point =
    route.getPointAtLength(
      distance
    );


  /* Car stays upright */
  car.setAttribute(
    "transform",
    `translate(
      ${point.x}
      ${point.y}
    )`
  );
}


/* ==========================================
   REALISTIC SPEED MODEL
   ========================================== */

function getTargetSpeed(
  elapsed,
  progress
) {

  const remaining =
    1 - progress;


  if (
    elapsed < 2
  ) {

    return Math.min(
      25,
      5 +
      elapsed * 10
    );
  }


  const wave1 =
    Math.sin(
      elapsed * 0.55
    );

  const wave2 =
    Math.sin(
      elapsed * 1.31
    );


  let speed =
    64 +
    wave1 * 18 +
    wave2 * 10;


  if (
    Math.sin(
      elapsed * 0.23
    ) > 0.72
  ) {

    speed -= 25;
  }


  speed =
    Math.max(
      20,
      Math.min(
        99,
        speed
      )
    );


  if (
    remaining < 0.12
  ) {

    const factor =
      remaining /
      0.12;

    speed *=
      Math.max(
        0.1,
        factor
      );
  }


  return Math.max(
    1,
    Math.min(
      99,
      speed
    )
  );
}


/* ==========================================
   TRACKER DASHBOARD
   ========================================== */

function updateTrackerDashboard(
  speed,
  distance
) {

  setText(
    "tracker-speed",
    Math.round(speed) +
    " km/h"
  );

  setText(
    "tracker-distance",
    distance.toFixed(1) +
    " km"
  );


  const progress =
    raceProgress *
    100;


  setText(
    "tracker-progress",
    Math.round(
      progress
    ) + "%"
  );


  if (
    speed > 1 &&
    distance > 0
  ) {

    const minutes =
      (
        distance /
        speed
      ) * 60;

    if (
      Number.isFinite(
        minutes
      )
    ) {

      setText(
        "tracker-eta",
        Math.max(
          1,
          Math.ceil(
            minutes
          )
        ) +
        " min"
      );
    }

  } else if (
    raceProgress >= 1
  ) {

    setText(
      "tracker-eta",
      "Arrived"
    );

  } else {

    setText(
      "tracker-eta",
      "Calculating..."
    );
  }
}


/* ==========================================
   AUTOMATIC DELIVERY
   ========================================== */

function startRace() {

  if (!hasOrder()) {

    window.location.replace(
      "shop.html"
    );

    return;
  }


  /* SMS verification required */
  if (
    sessionStorage.getItem(
      VERIFIED_KEY
    ) !== "yes"
  ) {

    window.location.replace(
      "sms.html"
    );

    return;
  }


  const route =
    document.getElementById(
      "car-route"
    );

  if (
    !route ||
    !route.getTotalLength()
  ) {
    return;
  }


  if (raceTimer) {
    return;
  }


  if (
    raceProgress >= 1
  ) {

    raceProgress = 0;

    localStorage.setItem(
      RACE_KEY,
      "0"
    );

    placeCarAt(0);
  }


  setText(
    "delivery-status",
    "On the way"
  );


  setText(
    "delivery-message",
    "Your EVFORGE delivery car is on the road! 🏎️"
  );


  let speed = 0;
  let elapsed = 0;


  raceTimer =
    setInterval(
      () => {

        elapsed +=
          0.05;


        const targetSpeed =
          getTargetSpeed(
            elapsed,
            raceProgress
          );


        const acceleration =
          targetSpeed > speed
            ? 1.8
            : 3.2;


        if (
          speed <
          targetSpeed
        ) {

          speed =
            Math.min(
              targetSpeed,
              speed +
              acceleration
            );

        } else {

          speed =
            Math.max(
              targetSpeed,
              speed -
              acceleration
            );
        }


        speed =
          Math.max(
            1,
            Math.min(
              99,
              speed
            )
          );


        const baseMovement =
          0.0027;


        const progressStep =
          (
            speed /
            99
          ) *
          baseMovement;


        raceProgress =
          Math.min(
            1,
            raceProgress +
            progressStep
          );


        localStorage.setItem(
          RACE_KEY,
          String(
            raceProgress
          )
        );


        placeCarAt(
          raceProgress
        );


        const distance =
          Math.max(
            0,
            12.4 *
            (
              1 -
              raceProgress
            )
          );


        const shownSpeed =
          raceProgress >= 1
            ? 0
            : Math.max(
                1,
                Math.min(
                  99,
                  Math.round(
                    speed
                  )
                )
              );


        setText(
          "speed",
          shownSpeed
        );


        setText(
          "distance",
          distance.toFixed(1)
        );


        updateTrackerDashboard(
          shownSpeed,
          distance
        );


        const bar =
          document.getElementById(
            "delivery-progress"
          );

        if (bar) {

          bar.style.width =
            (
              raceProgress *
              100
            ) + "%";
        }


        if (
          raceProgress >= 1
        ) {

          clearInterval(
            raceTimer
          );

          raceTimer = null;

          speed = 0;


          setText(
            "speed",
            "0"
          );

          setText(
            "distance",
            "0.0"
          );


          setText(
            "delivery-status",
            "Delivered 🏁"
          );


          setText(
            "delivery-message",
            "Your simulated delivery has arrived!"
          );


          updateTrackerDashboard(
            0,
            0
          );


          if (bar) {
            bar.style.width =
              "100%";
          }


          notify(
            "Demo delivery complete! 🏁"
          );
        }

      },
      50
    );
}


/* ==========================================
   PAUSE DELIVERY
   ========================================== */

function pauseRace() {

  if (raceTimer) {

    clearInterval(
      raceTimer
    );

    raceTimer = null;
  }


  if (
    raceProgress > 0 &&
    raceProgress < 1
  ) {

    setText(
      "delivery-status",
      "Paused"
    );

    setText(
      "delivery-message",
      "Delivery paused."
    );
  }
}


/* ==========================================
   TRACKER INITIALISATION
   ========================================== */

function initTracker() {

  const map =
    document.getElementById(
      "delivery-map"
    );

  if (!map) {
    return;
  }


  if (!hasOrder()) {

    window.location.replace(
      "shop.html"
    );

    return;
  }


  if (
    sessionStorage.getItem(
      VERIFIED_KEY
    ) !== "yes"
  ) {

    window.location.replace(
      "sms.html"
    );

    return;
  }


  buildFixedMap();


  const order =
    getOrder();


  if (order) {

    setText(
      "delivery-status",
      order.status ||
      "Order confirmed"
    );


    setText(
      "delivery-message",
      `Order ${order.orderId} confirmed! Preparing your delivery.`
    );


    setText(
      "tracker-order-id",
      order.orderId
    );


    setText(
      "tracker-customer-name",
      order.customer?.name ||
      "Demo customer"
    );


    setText(
      "tracker-customer-city",
      order.customer?.city ||
      "Not provided"
    );
  }


  placeCarAt(
    raceProgress
  );


  const bar =
    document.getElementById(
      "delivery-progress"
    );

  if (bar) {

    bar.style.width =
      (
        raceProgress *
        100
      ) + "%";
  }


  setTimeout(
    startRace,
    700
  );
}


/* ==========================================
   APP INITIALISE
   ========================================== */

function init() {

  setupNav();

  lockTrackerLinks();

  renderShop();

  renderFeatured();

  renderCart();

  renderSavedCoupons();

  renderOrderHistory();

  initCheckoutCoupon();

  initTracker();
}


document.addEventListener(
  "DOMContentLoaded",
  init
);


/* =========================================================
   EVFORGE ANIMATION SYSTEM
   ========================================================= */

(function initAnimations() {

  function injectStyles() {

    if (
      document.getElementById(
        "evforge-animation-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "evforge-animation-styles";

    style.textContent = `

      main {
        animation:
          evforgePageIn
          .6s
          cubic-bezier(.16,1,.3,1)
          both;
      }

      @keyframes evforgePageIn {
        from {
          opacity: 0;
          transform:
            translateY(12px);
        }

        to {
          opacity: 1;
          transform:
            translateY(0);
        }
      }


      nav {
        animation:
          evforgeNavIn
          .55s
          cubic-bezier(.16,1,.3,1)
          both;
      }

      @keyframes evforgeNavIn {
        from {
          opacity: 0;
          transform:
            translateY(-15px);
        }

        to {
          opacity: 1;
          transform:
            translateY(0);
        }
      }


      .product {
        animation:
          evforgeProductIn
          .5s
          cubic-bezier(.16,1,.3,1)
          both;

        transition:
          transform .25s ease,
          box-shadow .25s ease;
      }

      .product:hover {
        transform:
          translateY(-7px)
          scale(1.015);

        box-shadow:
          0 15px 35px
          rgba(0,0,0,.35),
          0 0 20px
          rgba(255,212,0,.12);
      }

      .product img {
        transition:
          transform .35s ease,
          filter .35s ease;
      }

      .product:hover img {
        transform:
          scale(1.05);

        filter:
          drop-shadow(
            0 8px 14px
            rgba(0,0,0,.35)
          );
      }

      @keyframes evforgeProductIn {
        from {
          opacity: 0;
          transform:
            translateY(22px)
            scale(.97);
        }

        to {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
        }
      }


      .btn,
      button {
        transition:
          transform .18s ease,
          box-shadow .18s ease;
      }

      .btn:hover,
      button:hover {
        transform:
          translateY(-2px);
      }

      .btn:active,
      button:active {
        transform:
          scale(.96);
      }


      .heart {
        transition:
          transform .2s ease,
          color .2s ease;
      }


      .cart-row {
        animation:
          evforgeCartIn
          .4s
          ease
          both;
      }

      @keyframes evforgeCartIn {
        from {
          opacity: 0;
          transform:
            translateX(20px);
        }

        to {
          opacity: 1;
          transform:
            translateX(0);
        }
      }


      .evforge-ripple {
        position: fixed;

        width: 8px;
        height: 8px;

        border-radius: 50%;

        background:
          rgba(255,212,0,.55);

        pointer-events: none;

        z-index: 99999;

        animation:
          evforgeRipple
          .5s
          ease-out
          forwards;
      }

      @keyframes evforgeRipple {
        from {
          opacity: .8;
          transform:
            translate(-50%,-50%)
            scale(1);
        }

        to {
          opacity: 0;
          transform:
            translate(-50%,-50%)
            scale(10);
        }
      }


      #delivery-car {
        transition:
          filter .2s ease;
      }

      .evforge-fast-car {
        filter:
          drop-shadow(
            0 0 9px
            rgba(255,212,0,.8)
          );
      }


      .evforge-delivered {
        animation:
          evforgeDelivered
          .8s
          ease;
      }

      @keyframes evforgeDelivered {
        0% {
          transform:
            scale(1);
        }

        35% {
          transform:
            scale(1.08);
        }

        65% {
          transform:
            scale(.97);
        }

        100% {
          transform:
            scale(1);
        }
      }


      .evforge-confetti {
        position: fixed;

        width: 8px;
        height: 12px;

        pointer-events: none;

        z-index: 100000;

        animation:
          evforgeConfetti
          1.5s
          ease-out
          forwards;
      }

      @keyframes evforgeConfetti {
        from {
          opacity: 1;
          transform:
            translate(0,0)
            rotate(0);
        }

        to {
          opacity: 0;
          transform:
            translate(
              var(--x),
              var(--y)
            )
            rotate(
              var(--r)
            );
        }
      }

    `;

    document.head.appendChild(
      style
    );
  }


  function animateProducts() {

    document
      .querySelectorAll(
        ".product"
      )
      .forEach(
        (card, index) => {

          card.style.animationDelay =
            Math.min(
              index * .05,
              .4
            ) + "s";

        }
      );
  }


  function createRipple(
    event
  ) {

    if (
      event.target.closest(
        "input, textarea, select"
      )
    ) {
      return;
    }

    const ripple =
      document.createElement(
        "div"
      );

    ripple.className =
      "evforge-ripple";

    ripple.style.left =
      event.clientX +
      "px";

    ripple.style.top =
      event.clientY +
      "px";

    document.body.appendChild(
      ripple
    );

    setTimeout(
      () => ripple.remove(),
      550
    );
  }


  function animateWishlist(
    event
  ) {

    const heart =
      event.target.closest(
        ".heart"
      );

    if (!heart) {
      return;
    }

    heart.animate(
      [
        {
          transform:
            "scale(1)"
        },
        {
          transform:
            "scale(1.4)"
        },
        {
          transform:
            "scale(.85)"
        },
        {
          transform:
            "scale(1)"
        }
      ],
      {
        duration: 450,
        easing:
          "cubic-bezier(.16,1,.3,1)"
      }
    );
  }


  function createConfetti() {

    for (
      let i = 0;
      i < 45;
      i++
    ) {

      const piece =
        document.createElement(
          "div"
        );

      piece.className =
        "evforge-confetti";

      piece.style.left =
        "50vw";

      piece.style.top =
        "35vh";

      piece.style.background =
        [
          "#ffd400",
          "#52f5a4",
          "#ff5f7e",
          "#62a8ff",
          "#ffffff"
        ][
          Math.floor(
            Math.random() * 5
          )
        ];

      piece.style.setProperty(
        "--x",
        (
          Math.random() *
          500 -
          250
        ) + "px"
      );

      piece.style.setProperty(
        "--y",
        (
          Math.random() *
          400 +
          100
        ) + "px"
      );

      piece.style.setProperty(
        "--r",
        (
          Math.random() *
          900 -
          450
        ) + "deg"
      );

      document.body.appendChild(
        piece
      );

      setTimeout(
        () => piece.remove(),
        1600
      );
    }
  }


  let deliveredShown =
    false;

  function watchTracker() {

    const speed =
      document.getElementById(
        "speed"
      );

    const status =
      document.getElementById(
        "delivery-status"
      );

    if (speed) {

      const observer =
        new MutationObserver(
          () => {

            const value =
              Number(
                speed.textContent
                  .replace(
                    /[^0-9.]/g,
                    ""
                  )
              ) || 0;

            const car =
              document.getElementById(
                "delivery-car"
              );

            if (car) {

              car.classList.toggle(
                "evforge-fast-car",
                value >= 70
              );
            }
          }
        );

      observer.observe(
        speed,
        {
          childList: true,
          characterData: true,
          subtree: true
        }
      );
    }


    if (status) {

      const observer =
        new MutationObserver(
          () => {

            const text =
              status.textContent
                .toLowerCase();

            if (
              text.includes(
                "delivered"
              ) &&
              !deliveredShown
            ) {

              deliveredShown =
                true;

              status.classList.add(
                "evforge-delivered"
              );

              createConfetti();

            }

            if (
              !text.includes(
                "delivered"
              )
            ) {

              deliveredShown =
                false;
            }

          }
        );

      observer.observe(
        status,
        {
          childList: true,
          characterData: true,
          subtree: true
        }
      );
    }
  }


  function start() {

    injectStyles();

    animateProducts();

    watchTracker();

    document.addEventListener(
      "click",
      event => {

        createRipple(event);

        animateWishlist(
          event
        );

      }
    );


    const observer =
      new MutationObserver(
        () => {

          setTimeout(
            animateProducts,
            20
          );

        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  } else {

    start();

  }

})(); 
