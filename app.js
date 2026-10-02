/* ==========================================
   EVFORGE APP
   Shop + Wishlist + Cart + Coupons
   + Demo Checkout + Order History
   + Turbo Tracker
   ========================================== */


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
      sum + Math.max(
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

      return sum +
        (
          product
            ? product.price *
              Number(quantity)
            : 0
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
      .pop() || "index.html";

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
            class="${current === url
              ? "current"
              : ""}"
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
    wishlist.includes(product.id);

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
            ${product.stock ? "" : "disabled"}
            onclick="
              addToCart('${product.id}')
            "
          >
            Add to cart
          </button>

          <button
            class="heart"
            onclick="
              toggleWish('${product.id}')
            "
            aria-label="Toggle wishlist"
          >
            ${wished ? "♥" : "♡"}
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
      )?.value || ""
    )
      .trim()
      .toLowerCase();

  const filter =
    document.getElementById(
      "filter"
    )?.value || "all";

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
          p.category === filter
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
      .filter(p => p.stock)
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
          item => item !== id
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
      (Number(cart[id]) || 0) + 1
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
              p => p.id === id
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
                        removeItem('${id}')
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


function removeSavedCoupon(code) {

  const saved =
    getSavedCoupons()
      .filter(
        item => item !== code
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
    encodeURIComponent(code);
}


function getActiveCoupon() {

  const code =
    localStorage.getItem(
      ACTIVE_COUPON_KEY
    );

  if (!code) return null;

  return coupons[code] || null;
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
    coupon.type === "percent"
  ) {

    discount =
      subtotalAmount *
      (
        coupon.discount /
        100
      );
  }

  if (
    coupon.type === "fixed"
  ) {

    discount =
      coupon.discount;
  }

  return Math.min(
    subtotalAmount,
    discount
  );
}
    /* ==========================================
       CHECKOUT CONTINUATION
       ========================================== */

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    /*
      Reset delivery progress.
    */
    localStorage.setItem(
      RACE_KEY,
      "0"
    );

    /*
      Require demo SMS verification
      for this new order.
    */
    sessionStorage.removeItem(
      VERIFIED_KEY
    );

    /*
      Clear shopping cart.
    */
    cart = {};

    saveCart();

    /*
      Coupon is one-use for this
      checkout session.
    */
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

  /*
    Go through the existing
    demo SMS verification gate.
  */
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
                  ${order.customer?.name || "Demo customer"}
                </strong>

                <span>
                  ${order.customer?.city || "No city"}
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
                      order.coupon
                        ? order.coupon
                        : "None"
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

  /*
    Previous orders need demo
    verification before tracker.
  */
  sessionStorage.removeItem(
    VERIFIED_KEY
  );

  notify(
    "Order loaded into Turbo Tracker 🚗"
  );

  setTimeout(() => {

    window.location.href =
      "sms.html";

  }, 700);
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

    toast.id = "toast";

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

    if (marker) break;
  }

  if (!marker) return;

  if (
    marker.tagName ===
    "circle"
  ) {

    marker.setAttribute(
      "cx",
      x
    );

    marker.setAttribute(
      "cy",
      y
    );

    return;
  }

  marker.setAttribute(
    "x",
    x
  );

  marker.setAttribute(
    "y",
    y
  );
}
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
  ] = routePoints[0];

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

  /*
    Keep the car completely upright.
    No rotate() is applied.
  */

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
        ) + " min"
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


  /*
    Turbo Tracker requires
    demo SMS verification.
  */

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


        /*
          Speed controls the
          animation movement.
        */

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

          playDeliveryCelebration();
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


  /*
    There is intentionally
    no pause button in the UI.
  */

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


  /*
    Require demo SMS
    verification.
  */

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


  /*
    Continue from saved
    progress if needed.
  */

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


  /*
    Automatic delivery.
    No Start button.
    No Stop button.
    No Pause button.
  */

  setTimeout(
    startRace,
    700
  );
}


/* ==========================================
   EVFORGE ANIMATION SYSTEM
   ========================================== */

function injectEVForgeAnimations() {

  if (
    document.getElementById(
      "evforge-animation-style"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );

  style.id =
    "evforge-animation-style";


  style.textContent = `

    /* PAGE ENTRY */

    body {
      animation:
        evforgePageIn
        .55s
        ease-out
        both;
    }

    @keyframes evforgePageIn {

      from {
        opacity: 0;
        transform:
          translateY(8px);
      }

      to {
        opacity: 1;
        transform:
          translateY(0);
      }
    }


    /* NAV */

    nav {
      animation:
        evforgeNavIn
        .7s
        cubic-bezier(
          .2,
          .8,
          .2,
          1
        )
        both;
    }

    @keyframes evforgeNavIn {

      from {
        opacity: 0;
        transform:
          translateY(-18px);
      }

      to {
        opacity: 1;
        transform:
          translateY(0);
      }
    }


    /* PRODUCT CARDS */

    .product-card,
    .card,
    .shop-card {

      transition:
        transform
          .28s
          cubic-bezier(
            .2,
            .8,
            .2,
            1
          ),
        box-shadow
          .28s
          ease,
        filter
          .28s
          ease;
    }


    .product-card:hover,
    .card:hover,
    .shop-card:hover {

      transform:
        translateY(-8px)
        scale(1.025);

      filter:
        brightness(1.08);

      box-shadow:
        0 18px 45px
        rgba(
          255,
          212,
          0,
          .18
        );
    }


    /* CARD IMAGES */

    .product-card img,
    .card img,
    .shop-card img {

      transition:
        transform
          .4s
          cubic-bezier(
            .2,
            .8,
            .2,
            1
          ),
        filter
          .35s
          ease;
    }


    .product-card:hover img,
    .card:hover img,
    .shop-card:hover img {

      transform:
        scale(1.075);

      filter:
        drop-shadow(
          0 8px 14px
          rgba(
            255,
            212,
            0,
            .28
          )
        );
    }


    /* BUTTON PRESS */

    button,
    .btn,
    a.btn {

      transition:
        transform
          .16s
          ease,
        box-shadow
          .2s
          ease,
        filter
          .2s
          ease;
    }


    button:hover,
    .btn:hover,
    a.btn:hover {

      filter:
        brightness(1.08);
    }


    button:active,
    .btn:active,
    a.btn:active {

      transform:
        scale(.96);
    }


    /* WISHLIST */

    .wishlist-btn {

      transition:
        transform
          .2s
          ease;
    }


    .wishlist-btn:hover {

      transform:
        scale(1.12);
    }


    .wishlist-pop {

      animation:
        evforgeHeartPop
        .45s
        cubic-bezier(
          .2,
          1.5,
          .4,
          1
        );
    }


    @keyframes evforgeHeartPop {

      0% {
        transform:
          scale(.6);
      }

      60% {
        transform:
          scale(1.3);
      }

      100% {
        transform:
          scale(1);
      }
    }


    /* CART PANEL */

    #cart-panel {

      transition:
        transform
          .35s
          cubic-bezier(
            .2,
            .8,
            .2,
            1
          ),
        opacity
          .25s
          ease;
    }


    /* RARE / HOLO GLOW */

    .rare,
    .holo {

      position:
        relative;
    }


    .rare::after,
    .holo::after {

      content: "";

      position:
        absolute;

      inset: 0;

      pointer-events:
        none;

      border-radius:
        inherit;

      background:
        linear-gradient(
          115deg,
          transparent 20%,
          rgba(
            255,
            255,
            255,
            .18
          ) 45%,
          transparent 70%
        );

      transform:
        translateX(-130%);

      transition:
        transform
        .65s
        ease;
    }


    .rare:hover::after,
    .holo:hover::after {

      transform:
        translateX(130%);
    }


    /* SEARCH */

    #search {

      transition:
        box-shadow
          .25s
          ease,
        transform
          .2s
          ease;
    }


    #search:focus {

      transform:
        scale(1.01);

      box-shadow:
        0 0 0 3px
        rgba(
          255,
          212,
          0,
          .14
        );
    }


    /* TRACKER CAR */

    #delivery-car {

      transition:
        filter
          .2s
          ease;
    }


    .evforge-speed-glow {

      filter:
        drop-shadow(
          0 0 8px
          rgba(
            255,
            212,
            0,
            .75
          )
        )
        drop-shadow(
          0 0 18px
          rgba(
            255,
            100,
            0,
            .35
          )
        );
    }


    /* TRACKER STATUS */

    #delivery-status {

      transition:
        transform
          .25s
          ease,
        filter
          .25s
          ease;
    }


    .evforge-status-pulse {

      animation:
        evforgeStatusPulse
        1.1s
        ease-in-out
        infinite;
    }


    @keyframes evforgeStatusPulse {

      0%,
      100% {
        filter:
          brightness(1);
      }

      50% {
        filter:
          brightness(1.35);
      }
    }


    /* DELIVERY CELEBRATION */

    .evforge-confetti {

      position:
        fixed;

      width:
        8px;

      height:
        14px;

      pointer-events:
        none;

      z-index:
        10000;

      animation:
        evforgeConfetti
        1.7s
        cubic-bezier(
          .15,
          .8,
          .3,
          1
        )
        forwards;
    }


    @keyframes evforgeConfetti {

      0% {

        opacity: 1;

        transform:
          translate(
            0,
            0
          )
          rotate(0deg);
      }

      100% {

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


    /* REDUCED MOTION */

    @media (
      prefers-reduced-motion:
      reduce
    ) {

      *,
      *::before,
      *::after {

        animation-duration:
          .01ms !important;

        animation-iteration-count:
          1 !important;

        transition-duration:
          .01ms !important;
      }
    }
  `;


  document.head.appendChild(
    style
  );
}


/* ==========================================
   CARD ENTRANCE ANIMATION
   ========================================== */

function animateProductCards() {

  const cards =
    document.querySelectorAll(
      ".product-card, .card, .shop-card"
    );

  if (!cards.length) {
    return;
  }


  cards.forEach(
    (card, index) => {

      card.style.opacity =
        "0";

      card.style.transform =
        "translateY(18px)";


      setTimeout(
        () => {

          card.style.transition =
            "opacity .45s ease, transform .45s cubic-bezier(.2,.8,.2,1)";

          card.style.opacity =
            "1";

          card.style.transform =
            "translateY(0)";

        },
        Math.min(
          index * 55,
          600
        )
      );
    }
  );
}


/* ==========================================
   SPEED VISUAL EFFECT
   ========================================== */

function updateSpeedVisuals(
  speed
) {

  const car =
    document.getElementById(
      "delivery-car"
    );

  if (!car) {
    return;
  }


  if (
    Number(speed) >= 70
  ) {

    car.classList.add(
      "evforge-speed-glow"
    );

  } else {

    car.classList.remove(
      "evforge-speed-glow"
    );
  }
}


/* ==========================================
   DELIVERY CELEBRATION
   ========================================== */

function playDeliveryCelebration() {

  if (
    document.body.dataset
      .evforgeCelebrated ===
    "yes"
  ) {
    return;
  }


  document.body.dataset
    .evforgeCelebrated =
    "yes";


  const total =
    42;


  for (
    let i = 0;
    i < total;
    i++
  ) {

    const piece =
      document.createElement(
        "span"
      );


    piece.className =
      "evforge-confetti";


    piece.style.left =
      "50%";

    piece.style.top =
      "45%";


    piece.style.setProperty(
      "--x",
      (
        Math.random() *
        520 -
        260
      ) + "px"
    );


    piece.style.setProperty(
      "--y",
      (
        Math.random() *
        430 -
        210
      ) + "px"
    );


    piece.style.setProperty(
      "--r",
      (
        Math.random() *
        720 -
        360
      ) + "deg"
    );


    piece.style.animationDelay =
      (
        Math.random() *
        .25
      ) + "s";


    /*
      Use a varied set of
      EVFORGE-style colors.
    */

    const colors = [
      "#ffd400",
      "#52f5a4",
      "#ff5c5c",
      "#ffffff",
      "#6ea8ff"
    ];


    piece.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    document.body.appendChild(
      piece
    );


    setTimeout(
      () => {
        piece.remove();
      },
      2100
    );
  }
}


/* ==========================================
   BUTTON RIPPLE
   ========================================== */

function addButtonRipple() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "button, .btn"
        );

      if (!button) {
        return;
      }


      const ripple =
        document.createElement(
          "span"
        );


      ripple.style.position =
        "absolute";

      ripple.style.pointerEvents =
        "none";

      ripple.style.width =
        "8px";

      ripple.style.height =
        "8px";

      ripple.style.borderRadius =
        "50%";

      ripple.style.background =
        "rgba(255,255,255,.45)";

      ripple.style.transform =
        "translate(-50%,-50%) scale(0)";

      ripple.style.transition =
        "transform .45s ease, opacity .45s ease";


      const rect =
        button.getBoundingClientRect();


      ripple.style.left =
        (
          event.clientX -
          rect.left
        ) + "px";


      ripple.style.top =
        (
          event.clientY -
          rect.top
        ) + "px";


      if (
        getComputedStyle(
          button
        ).position ===
        "static"
      ) {

        button.style.position =
          "relative";
      }


      button.style.overflow =
        "hidden";


      button.appendChild(
        ripple
      );


      requestAnimationFrame(
        () => {

          ripple.style.transform =
            "translate(-50%,-50%) scale(18)";

          ripple.style.opacity =
            "0";
        }
      );


      setTimeout(
        () => {
          ripple.remove();
        },
        500
      );
    }
  );
}


/* ==========================================
   CART COUNT POP
   ========================================== */

function watchCartCount() {

  const count =
    document.getElementById(
      "cart-count"
    );

  if (!count) {
    return;
  }


  let previous =
    count.textContent;


  const observer =
    new MutationObserver(
      () => {

        const current =
          count.textContent;


        if (
          current !==
          previous
        ) {

          count.animate(
            [
              {
                transform:
                  "scale(1)"
              },
              {
                transform:
                  "scale(1.35)"
              },
              {
                transform:
                  "scale(1)"
              }
            ],
            {
              duration:
                360,
              easing:
                "cubic-bezier(.2,1.5,.4,1)"
            }
          );


          previous =
            current;
        }
      }
    );


  observer.observe(
    count,
    {
      childList:
        true,
      characterData:
        true,
      subtree:
        true
    }
  );
}


/* ==========================================
   TRACKER SPEED WATCHER
   ========================================== */

function watchTrackerSpeed() {

  const speedElement =
    document.getElementById(
      "speed"
    );

  if (!speedElement) {
    return;
  }


  const observer =
    new MutationObserver(
      () => {

        const value =
          parseInt(
            speedElement
              .textContent,
            10
          ) || 0;


        updateSpeedVisuals(
          value
        );
      }
    );


  observer.observe(
    speedElement,
    {
      childList:
        true,
      characterData:
        true,
      subtree:
        true
    }
  );
}


/* ==========================================
   GLOBAL ANIMATION INITIALISATION
   ========================================== */

function initAnimations() {

  injectEVForgeAnimations();

  addButtonRipple();

  watchCartCount();

  watchTrackerSpeed();

  /*
    Give rendered product cards
    a staggered entrance.
  */

  setTimeout(
    animateProductCards,
    120
  );
}


/* ==========================================
   INITIALISE
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

  initAnimations();

  initTracker();
}


document.addEventListener(
  "DOMContentLoaded",
  init
);
