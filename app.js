/* =========================================================
   EVFORGE ANIMATION SYSTEM
   App.js only
   No extra CSS or JS files required
   ========================================================= */

(function () {

  /* ---------------------------------------------------------
     INJECT ANIMATION STYLES
     --------------------------------------------------------- */

  const animationStyle =
    document.createElement("style");

  animationStyle.textContent = `
    /* PAGE */
    body.evforge-animations-ready {
      overflow-x: hidden;
    }

    main {
      animation:
        evforgePageIn
        .65s
        cubic-bezier(.16,1,.3,1)
        both;
    }

    @keyframes evforgePageIn {
      from {
        opacity: 0;
        transform: translateY(12px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }


    /* NAVIGATION */

    nav {
      animation:
        evforgeNavIn
        .65s
        cubic-bezier(.16,1,.3,1)
        both;
    }

    @keyframes evforgeNavIn {
      from {
        opacity: 0;
        transform: translateY(-18px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    nav a {
      transition:
        color .2s ease,
        transform .2s ease,
        text-shadow .2s ease;
    }

    nav a:hover {
      transform: translateY(-2px);
    }

    .brand {
      transition:
        transform .25s ease,
        text-shadow .25s ease;
    }

    .brand:hover {
      transform: scale(1.04);
      text-shadow:
        0 0 8px rgba(255,212,0,.6),
        0 0 22px rgba(255,212,0,.3);
    }


    /* HERO */

    .evforge-hero-animated {
      animation:
        evforgeHeroIn
        .9s
        cubic-bezier(.16,1,.3,1)
        both;
    }

    .evforge-hero-animated h1 {
      animation:
        evforgeTitleIn
        .85s
        cubic-bezier(.16,1,.3,1)
        .08s
        both;
    }

    .evforge-hero-animated p {
      animation:
        evforgeFadeUp
        .7s
        ease
        .2s
        both;
    }

    .evforge-hero-animated button,
    .evforge-hero-animated .btn,
    .evforge-hero-animated a {
      animation:
        evforgeFadeUp
        .7s
        ease
        .3s
        both;
    }

    @keyframes evforgeHeroIn {
      from {
        opacity: 0;
        transform: scale(.985);
      }

      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes evforgeTitleIn {
      from {
        opacity: 0;
        transform:
          translateY(25px)
          scale(.97);
      }

      to {
        opacity: 1;
        transform:
          translateY(0)
          scale(1);
      }
    }

    @keyframes evforgeFadeUp {
      from {
        opacity: 0;
        transform: translateY(18px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }


    /* PRODUCT CARDS */

    .evforge-product-animation {
      animation:
        evforgeProductIn
        .55s
        cubic-bezier(.16,1,.3,1)
        both;

      transition:
        transform .25s ease,
        box-shadow .25s ease,
        border-color .25s ease,
        filter .25s ease;
    }

    .evforge-product-animation:hover {
      transform:
        translateY(-8px)
        scale(1.015);

      box-shadow:
        0 15px 35px rgba(0,0,0,.35),
        0 0 22px rgba(255,212,0,.14);
    }

    .evforge-product-animation img {
      transition:
        transform .35s
        cubic-bezier(.16,1,.3,1),
        filter .35s ease;
    }

    .evforge-product-animation:hover img {
      transform:
        scale(1.06)
        translateY(-3px);

      filter:
        drop-shadow(
          0 8px 15px
          rgba(0,0,0,.35)
        );
    }

    @keyframes evforgeProductIn {
      from {
        opacity: 0;
        transform:
          translateY(25px)
          scale(.96);
      }

      to {
        opacity: 1;
        transform:
          translateY(0)
          scale(1);
      }
    }


    /* RARE / HOLO SHINE */

    .evforge-holo {
      position: relative;
      overflow: hidden;
    }

    .evforge-holo::after {
      content: "";
      position: absolute;
      top: -40%;
      left: -80%;
      width: 45%;
      height: 180%;

      background:
        linear-gradient(
          105deg,
          transparent 0%,
          rgba(255,255,255,.04) 35%,
          rgba(255,255,255,.65) 50%,
          rgba(255,255,255,.04) 65%,
          transparent 100%
        );

      transform:
        skewX(-20deg);

      pointer-events: none;

      opacity: 0;
    }

    .evforge-holo:hover::after {
      opacity: 1;

      animation:
        evforgeCardShine
        .8s
        ease
        both;
    }

    @keyframes evforgeCardShine {
      from {
        left: -80%;
      }

      to {
        left: 140%;
      }
    }


    /* BADGES */

    .evforge-rare-badge {
      animation:
        evforgeBadgePulse
        2.2s
        ease-in-out
        infinite;
    }

    @keyframes evforgeBadgePulse {
      0%,
      100% {
        filter:
          drop-shadow(
            0 0 0
            rgba(255,212,0,0)
          );
      }

      50% {
        filter:
          drop-shadow(
            0 0 7px
            rgba(255,212,0,.45)
          );
      }
    }


    /* BUTTONS */

    .evforge-button-animated {
      position: relative;
      overflow: hidden;

      transition:
        transform .18s ease,
        box-shadow .18s ease;
    }

    .evforge-button-animated:hover {
      transform:
        translateY(-2px)
        scale(1.015);
    }

    .evforge-button-animated:active {
      transform:
        translateY(1px)
        scale(.97);
    }


    /* RIPPLE */

    .evforge-ripple {
      position: fixed;

      width: 10px;
      height: 10px;

      border-radius: 50%;

      pointer-events: none;

      background:
        rgba(255,212,0,.65);

      transform:
        translate(-50%,-50%)
        scale(1);

      animation:
        evforgeRipple
        .55s
        ease-out
        forwards;

      z-index: 100000;
    }

    @keyframes evforgeRipple {
      from {
        opacity: .7;
        transform:
          translate(-50%,-50%)
          scale(1);
      }

      to {
        opacity: 0;
        transform:
          translate(-50%,-50%)
          scale(12);
      }
    }


    /* ADD TO CART PARTICLES */

    .evforge-particle {
      position: fixed;

      width: 7px;
      height: 7px;

      border-radius: 50%;

      pointer-events: none;

      background:
        #ffd400;

      z-index: 100001;

      animation:
        evforgeParticle
        .65s
        cubic-bezier(.16,1,.3,1)
        forwards;
    }

    @keyframes evforgeParticle {
      from {
        opacity: 1;
        transform:
          translate(0,0)
          scale(1);
      }

      to {
        opacity: 0;
        transform:
          translate(
            var(--dx),
            var(--dy)
          )
          scale(.15);
      }
    }


    /* WISHLIST */

    .evforge-wishlist-pop {
      animation:
        evforgeWishlistPop
        .45s
        cubic-bezier(.16,1,.3,1);
    }

    @keyframes evforgeWishlistPop {
      0% {
        transform: scale(1);
      }

      35% {
        transform: scale(1.45);
      }

      65% {
        transform: scale(.85);
      }

      100% {
        transform: scale(1);
      }
    }


    /* CART */

    .evforge-cart-animation {
      animation:
        evforgeCartIn
        .5s
        cubic-bezier(.16,1,.3,1)
        both;
    }

    @keyframes evforgeCartIn {
      from {
        opacity: 0;
        transform:
          translateX(35px)
          scale(.97);
      }

      to {
        opacity: 1;
        transform:
          translateX(0)
          scale(1);
      }
    }


    /* CART BADGE */

    .evforge-cart-bounce {
      animation:
        evforgeCartBounce
        .5s
        cubic-bezier(.16,1,.3,1);
    }

    @keyframes evforgeCartBounce {
      0% {
        transform: scale(1);
      }

      35% {
        transform: scale(1.25);
      }

      65% {
        transform: scale(.9);
      }

      100% {
        transform: scale(1);
      }
    }


    /* SEARCH / FILTER */

    .evforge-filter-animation {
      animation:
        evforgeFilter
        .35s
        cubic-bezier(.16,1,.3,1)
        both;
    }

    @keyframes evforgeFilter {
      from {
        opacity: .35;
        transform:
          translateY(8px)
          scale(.985);
      }

      to {
        opacity: 1;
        transform:
          translateY(0)
          scale(1);
      }
    }


    /* PRICE */

    .evforge-price-flash {
      animation:
        evforgePriceFlash
        .55s
        ease;
    }

    @keyframes evforgePriceFlash {
      0% {
        transform: scale(1);
      }

      35% {
        transform: scale(1.12);
      }

      100% {
        transform: scale(1);
      }
    }


    /* TRACKER */

    .evforge-tracker-active {
      animation:
        evforgeTrackerGlow
        1.8s
        ease-in-out
        infinite;
    }

    @keyframes evforgeTrackerGlow {
      0%,
      100% {
        filter:
          drop-shadow(
            0 0 0
            rgba(255,212,0,0)
          );
      }

      50% {
        filter:
          drop-shadow(
            0 0 10px
            rgba(255,212,0,.25)
          );
      }
    }


    /* TRACKER CAR */

    #delivery-car {
      transition:
        filter .2s ease;
    }

    .evforge-car-fast {
      filter:
        drop-shadow(
          0 0 8px
          rgba(255,212,0,.8)
        );
    }


    /* SPEED LINES */

    .evforge-speed-line {
      position: fixed;

      width: 45px;
      height: 2px;

      background:
        linear-gradient(
          90deg,
          transparent,
          rgba(255,212,0,.8)
        );

      pointer-events: none;

      z-index: 9998;

      animation:
        evforgeSpeedLine
        .45s
        linear
        forwards;
    }

    @keyframes evforgeSpeedLine {
      from {
        opacity: .8;
        transform:
          translateX(0)
          scaleX(.5);
      }

      to {
        opacity: 0;
        transform:
          translateX(-70px)
          scaleX(1);
      }
    }


    /* DELIVERY COMPLETE */

    .evforge-delivered {
      animation:
        evforgeDelivered
        .8s
        cubic-bezier(.16,1,.3,1);
    }

    @keyframes evforgeDelivered {
      0% {
        transform: scale(1);
      }

      35% {
        transform: scale(1.08);
      }

      65% {
        transform: scale(.97);
      }

      100% {
        transform: scale(1);
      }
    }


    /* CONFETTI */

    .evforge-confetti {
      position: fixed;

      width: 8px;
      height: 12px;

      pointer-events: none;

      z-index: 100002;

      animation:
        evforgeConfetti
        1.6s
        cubic-bezier(.15,.8,.25,1)
        forwards;
    }

    @keyframes evforgeConfetti {
      from {
        opacity: 1;

        transform:
          translate(0,0)
          rotate(0deg);
      }

      to {
        opacity: 0;

        transform:
          translate(
            var(--cx),
            var(--cy)
          )
          rotate(
            var(--rotation)
          );
      }
    }


    /* REDUCED MOTION */

    @media (
      prefers-reduced-motion: reduce
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
    animationStyle
  );


  /* ---------------------------------------------------------
     UTILITY
     --------------------------------------------------------- */

  function addClassOnce(
    element,
    className
  ) {

    if (!element) {
      return;
    }

    element.classList.add(
      className
    );
  }


  function removeAndReplay(
    element,
    className
  ) {

    if (!element) {
      return;
    }

    element.classList.remove(
      className
    );

    void element.offsetWidth;

    element.classList.add(
      className
    );
  }


  /* ---------------------------------------------------------
     HERO ANIMATION
     --------------------------------------------------------- */

  function animateHeroes() {

    document
      .querySelectorAll(
        ".hero, .hero-section, .home-hero, .hero-content"
      )
      .forEach(hero => {

        addClassOnce(
          hero,
          "evforge-hero-animated"
        );

      });
  }


  /* ---------------------------------------------------------
     PRODUCT ANIMATION
     --------------------------------------------------------- */

  function animateProducts() {

    const productsOnPage =
      document.querySelectorAll(
        ".product"
      );

    productsOnPage
      .forEach(
        (card, index) => {

          addClassOnce(
            card,
            "evforge-product-animation"
          );

          card.style.animationDelay =
            Math.min(
              index * 0.055,
              0.45
            ) + "s";


          const badge =
            card.querySelector(
              ".badge"
            );

          if (badge) {

            const text =
              badge.textContent
                .trim()
                .toLowerCase();

            if (
              text.includes("rare") ||
              text.includes("holo")
            ) {

              addClassOnce(
                badge,
                "evforge-rare-badge"
              );

              addClassOnce(
                card,
                "evforge-holo"
              );
            }
          }
        }
      );
  }


  /* ---------------------------------------------------------
     CART ANIMATION
     --------------------------------------------------------- */

  function animateCart() {

    document
      .querySelectorAll(
        ".cart-row"
      )
      .forEach(
        (row, index) => {

          addClassOnce(
            row,
            "evforge-cart-animation"
          );

          row.style.animationDelay =
            Math.min(
              index * 0.07,
              0.35
            ) + "s";
        }
      );
  }


  /* ---------------------------------------------------------
     BUTTON ANIMATION
     --------------------------------------------------------- */

  function animateButtons() {

    document
      .querySelectorAll(
        "button, .btn, .primary, .secondary"
      )
      .forEach(
        button => {

          addClassOnce(
            button,
            "evforge-button-animated"
          );

        }
      );
  }


  /* ---------------------------------------------------------
     RIPPLE EFFECT
     --------------------------------------------------------- */

  function createRipple(
    x,
    y
  ) {

    const ripple =
      document.createElement(
        "div"
      );

    ripple.className =
      "evforge-ripple";

    ripple.style.left =
      x + "px";

    ripple.style.top =
      y + "px";

    document.body.appendChild(
      ripple
    );

    setTimeout(
      () => ripple.remove(),
      600
    );
  }


  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "button, .btn, a"
        );

      if (!button) {
        return;
      }

      createRipple(
        event.clientX,
        event.clientY
      );

    }
  );


  /* ---------------------------------------------------------
     ADD TO CART PARTICLES
     --------------------------------------------------------- */

  function createCartParticles(
    source
  ) {

    if (!source) {
      return;
    }

    const rect =
      source.getBoundingClientRect();

    const startX =
      rect.left +
      rect.width / 2;

    const startY =
      rect.top +
      rect.height / 2;


    for (
      let i = 0;
      i < 9;
      i++
    ) {

      const particle =
        document.createElement(
          "div"
        );

      particle.className =
        "evforge-particle";

      particle.style.left =
        startX + "px";

      particle.style.top =
        startY + "px";

      const angle =
        Math.random() *
        Math.PI *
        2;

      const distance =
        35 +
        Math.random() * 70;

      particle.style.setProperty(
        "--dx",
        Math.cos(angle) *
        distance +
        "px"
      );

      particle.style.setProperty(
        "--dy",
        Math.sin(angle) *
        distance +
        "px"
      );

      document.body.appendChild(
        particle
      );

      setTimeout(
        () => particle.remove(),
        700
      );
    }
  }


  /* ---------------------------------------------------------
     WISHLIST EFFECT
     --------------------------------------------------------- */

  function animateWishlist() {

    document
      .querySelectorAll(
        ".heart"
      )
      .forEach(
        heart => {

          heart.addEventListener(
            "click",
            () => {

              removeAndReplay(
                heart,
                "evforge-wishlist-pop"
              );

            }
          );

        }
      );
  }


  /* ---------------------------------------------------------
     CART BADGE EFFECT
     --------------------------------------------------------- */

  function animateCartBadge() {

    const links =
      document.querySelectorAll(
        "nav a"
      );

    links.forEach(
      link => {

        if (
          link.textContent
            .includes("Cart")
        ) {

          removeAndReplay(
            link,
            "evforge-cart-bounce"
          );

        }

      }
    );
  }


  /* ---------------------------------------------------------
     FILTER / SEARCH EFFECT
     --------------------------------------------------------- */

  function animateFilterResults() {

    const hosts =
      document.querySelectorAll(
        "#shop-products, #products, #featured-products"
      );

    hosts.forEach(
      host => {

        removeAndReplay(
          host,
          "evforge-filter-animation"
        );

      }
    );
  }


  /* ---------------------------------------------------------
     PRICE ANIMATION
     --------------------------------------------------------- */

  function animatePrices() {

    document
      .querySelectorAll(
        ".price, #subtotal, #discount, #shipping, #grand-total, #cart-total"
      )
      .forEach(
        price => {

          removeAndReplay(
            price,
            "evforge-price-flash"
          );

        }
      );
  }


  /* ---------------------------------------------------------
     TRACKER SPEED EFFECTS
     --------------------------------------------------------- */

  let lastSpeed =
    -1;

  let lastTrailTime =
    0;


  function trackerSpeedEffect() {

    const speedElement =
      document.getElementById(
        "speed"
      );

    const car =
      document.getElementById(
        "delivery-car"
      );

    if (
      !speedElement ||
      !car
    ) {
      return;
    }

    const speed =
      Number(
        speedElement.textContent
          .replace(
            /[^0-9.]/g,
            ""
          )
      ) || 0;


    if (
      speed ===
      lastSpeed
    ) {
      return;
    }

    lastSpeed =
      speed;


    car.classList.toggle(
      "evforge-car-fast",
      speed >= 70
    );


    if (
      speed >= 70 &&
      Date.now() -
      lastTrailTime >
      180
    ) {

      createSpeedLine();

      lastTrailTime =
        Date.now();
    }
  }


  function createSpeedLine() {

    const car =
      document.getElementById(
        "delivery-car"
      );

    if (!car) {
      return;
    }

    const svg =
      document.getElementById(
        "delivery-map"
      );

    if (!svg) {
      return;
    }

    const rect =
      svg.getBoundingClientRect();

    const line =
      document.createElement(
        "div"
      );

    line.className =
      "evforge-speed-line";

    const x =
      rect.left +
      rect.width *
      (0.2 +
        Math.random() *
        0.6);

    const y =
      rect.top +
      rect.height *
      (0.3 +
        Math.random() *
        0.4);

    line.style.left =
      x + "px";

    line.style.top =
      y + "px";

    document.body.appendChild(
      line
    );

    setTimeout(
      () => line.remove(),
      500
    );
  }


  /* ---------------------------------------------------------
     TRACKER COMPLETE EFFECT
     --------------------------------------------------------- */

  let deliveryCelebrated =
    false;


  function checkDeliveryStatus() {

    const status =
      document.getElementById(
        "delivery-status"
      );

    if (!status) {
      return;
    }

    const text =
      status.textContent
        .trim()
        .toLowerCase();


    if (
      text.includes("delivered") &&
      !deliveryCelebrated
    ) {

      deliveryCelebrated =
        true;

      removeAndReplay(
        status,
        "evforge-delivered"
      );

      createConfetti();

    }


    if (
      !text.includes("delivered")
    ) {

      deliveryCelebrated =
        false;
    }
  }


  /* ---------------------------------------------------------
     DELIVERY CONFETTI
     --------------------------------------------------------- */

  function createConfetti() {

    const pieces =
      45;

    for (
      let i = 0;
      i < pieces;
      i++
    ) {

      const confetti =
        document.createElement(
          "div"
        );

      confetti.className =
        "evforge-confetti";

      confetti.style.left =
        "50vw";

      confetti.style.top =
        "35vh";

      confetti.style.background =
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

      const angle =
        Math.random() *
        Math.PI *
        2;

      const distance =
        100 +
        Math.random() * 300;

      confetti.style.setProperty(
        "--cx",
        Math.cos(angle) *
        distance +
        "px"
      );

      confetti.style.setProperty(
        "--cy",
        (
          Math.sin(angle) *
          distance +
          180
        ) + "px"
      );

      confetti.style.setProperty(
        "--rotation",
        (
          Math.random() *
          900 -
          450
        ) + "deg"
      );

      document.body.appendChild(
        confetti
      );

      setTimeout(
        () => confetti.remove(),
        1700
      );
    }
  }


  /* ---------------------------------------------------------
     TRACKER OBSERVER
     --------------------------------------------------------- */

  function setupTrackerObserver() {

    const speed =
      document.getElementById(
        "speed"
      );

    const status =
      document.getElementById(
        "delivery-status"
      );

    if (!speed && !status) {
      return;
    }


    if (speed) {

      const observer =
        new MutationObserver(
          () => {

            trackerSpeedEffect();

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

            checkDeliveryStatus();

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


    const tracker =
      document.querySelector(
        ".tracker-wrap, .tracker, #delivery-map"
      );

    if (tracker) {

      addClassOnce(
        tracker,
        "evforge-tracker-active"
      );

    }
  }


  /* ---------------------------------------------------------
     WRAP EXISTING FUNCTIONS
     --------------------------------------------------------- */

  if (
    typeof window.addToCart ===
    "function"
  ) {

    const originalAddToCart =
      window.addToCart;

    window.addToCart =
      function (id) {

        const button =
          document.querySelector(
            `.product button[onclick*="${id}"]`
          );

        createCartParticles(
          button
        );

        originalAddToCart(
          id
        );

        setTimeout(
          () => {

            animateCartBadge();
            animateCart();

          },
          30
        );
      };
  }


  if (
    typeof window.toggleWish ===
    "function"
  ) {

    const originalToggleWish =
      window.toggleWish;

    window.toggleWish =
      function (id) {

        originalToggleWish(
          id
        );

        setTimeout(
          () => {

            animateProducts();
            animateWishlist();

          },
          30
        );
      };
  }


  if (
    typeof window.renderShop ===
    "function"
  ) {

    const originalRenderShop =
      window.renderShop;

    window.renderShop =
      function () {

        originalRenderShop();

        setTimeout(
          () => {

            animateProducts();
            animateButtons();
            animateWishlist();

          },
          20
        );
      };
  }


  if (
    typeof window.renderFeatured ===
    "function"
  ) {

    const originalRenderFeatured =
      window.renderFeatured;

    window.renderFeatured =
      function () {

        originalRenderFeatured();

        setTimeout(
          () => {

            animateProducts();
            animateButtons();
            animateWishlist();

          },
          20
        );
      };
  }


  if (
    typeof window.renderCart ===
    "function"
  ) {

    const originalRenderCart =
      window.renderCart;

    window.renderCart =
      function () {

        originalRenderCart();

        setTimeout(
          () => {

            animateCart();
            animatePrices();

          },
          20
        );
      };
  }


  if (
    typeof window.applyCoupon ===
    "function"
  ) {

    const originalApplyCoupon =
      window.applyCoupon;

    window.applyCoupon =
      function () {

        originalApplyCoupon();

        setTimeout(
          () => {
            animatePrices();
          },
          40
        );
      };
  }


  if (
    typeof window.clearCoupon ===
    "function"
  ) {

    const originalClearCoupon =
      window.clearCoupon;

    window.clearCoupon =
      function () {

        originalClearCoupon();

        setTimeout(
          () => {
            animatePrices();
          },
          40
        );
      };
  }


  /* ---------------------------------------------------------
     AUTOMATIC DOM OBSERVER
     --------------------------------------------------------- */

  function setupDOMObserver() {

    const observer =
      new MutationObserver(
        mutations => {

          let changed = false;

          mutations.forEach(
            mutation => {

              if (
                mutation.addedNodes &&
                mutation.addedNodes.length
              ) {

                changed = true;
              }

            }
          );


          if (!changed) {
            return;
          }


          setTimeout(
            () => {

              animateProducts();
              animateCart();
              animateButtons();
              animateWishlist();

            },
            30
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


  /* ---------------------------------------------------------
     INITIAL ANIMATION START
     --------------------------------------------------------- */

  function startEVFORGEAnimations() {

    document.body.classList.add(
      "evforge-animations-ready"
    );

    animateHeroes();
    animateProducts();
    animateCart();
    animateButtons();
    animateWishlist();

    setupTrackerObserver();
    setupDOMObserver();

  }


  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startEVFORGEAnimations
    );

  } else {

    startEVFORGEAnimations();

  }

})();
