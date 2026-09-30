
const products = [
  {id:"charizard",name:"Charizard ex",price:1499,category:"Rare",stock:true,image:"https://images.pokemontcg.io/sv3/125.png"},
  {id:"pikachu",name:"Pikachu",price:799,category:"Holo",stock:true,image:"https://images.pokemontcg.io/sv4/51.png"},
  {id:"mew",name:"Mew ex",price:1299,category:"Rare",stock:false,image:"https://images.pokemontcg.io/sv2/193.png"},
  {id:"gengar",name:"Gengar ex",price:999,category:"Holo",stock:true,image:"https://images.pokemontcg.io/sv3/104.png"},
  {id:"bulbasaur",name:"Bulbasaur",price:599,category:"Vintage",stock:false,image:"https://images.pokemontcg.io/base1/44.png"},
  {id:"blastoise",name:"Blastoise",price:1999,category:"Vintage",stock:true,image:"https://images.pokemontcg.io/base1/2.png"},
  {id:"eevee",name:"Eevee",price:499,category:"Modern",stock:true,image:"https://images.pokemontcg.io/sv6/135.png"},
  {id:"rayquaza",name:"Rayquaza ex",price:1799,category:"Rare",stock:false,image:"https://images.pokemontcg.io/sv7/157.png"}
];

const money = n => "₹" + Number(n).toLocaleString("en-IN");
const read = (key,fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
let cart = read("evforgeCart",{});
let wishlist = read("evforgeWishlist",[]);
function saveCart(){localStorage.setItem("evforgeCart",JSON.stringify(cart));}
function saveWishlist(){localStorage.setItem("evforgeWishlist",JSON.stringify(wishlist));}

const navItems = [
  ["Home","index.html","index.html"],
  ["PokéMart","shop.html","shop.html"],
  ["Discounts","discounts.html","discounts.html"],
  ["Turbo Tracker","tracker.html","tracker.html"],
  ["Cart","cart.html","cart.html"]
];

function setupNav(){
  const nav=document.getElementById("site-nav");
  if(!nav)return;
  const current=location.pathname.split("/").pop()||"index.html";
  nav.innerHTML=`
    <a class="brand" href="index.html">⚡ EV<span>FORGE</span></a>
    <div class="navlinks">${navItems.map(([label,url,file])=>
      `<a class="${current===file?"current":""}" href="${url}">${label}${file==="cart.html"?" 🛒 "+cartCount():""}</a>`
    ).join("")}</div>`;
}
function cartCount(){return Object.values(cart).reduce((a,b)=>a+b,0);}
function updateCartBadge(){setupNav();}

function productCard(p){
  const inWish=wishlist.includes(p.id);
  return `<article class="product">
    <img src="${p.image}" alt="${p.name}" loading="lazy"
      onerror="this.onerror=null;this.src='https://placehold.co/240x180/111827/ffd400?text=Pokemon+Card'">
    <div class="product-info">
      <span class="badge">${p.category}</span>
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <p>${p.stock?'<span style="color:#52f5a4">● In stock</span>':'<span style="color:#ff8c9d">● Out of stock</span>'}</p>
      <div class="product-buttons">
        <button class="btn" ${p.stock?"":"disabled"} onclick="addToCart('${p.id}')">Add to cart</button>
        <button class="heart" title="Wishlist" onclick="toggleWish('${p.id}')">${inWish?"♥":"♡"}</button>
      </div>
    </div>
  </article>`;
}
function renderShop(){
  const host=document.getElementById("shop-products");
  if(!host)return;
  const q=(document.getElementById("search")?.value||"").toLowerCase();
  const filter=document.getElementById("filter")?.value||"all";
  let list=products.filter(p=>p.name.toLowerCase().includes(q));
  if(filter==="stock")list=list.filter(p=>p.stock);
  else if(filter==="wishlist")list=list.filter(p=>wishlist.includes(p.id));
  else if(filter!=="all")list=list.filter(p=>p.category===filter);
  host.innerHTML=list.length?list.map(productCard).join(""):'<div class="panel empty">No cards match this filter.</div>';
}
function renderFeatured(){
  const host=document.getElementById("featured-products");
  if(host)host.innerHTML=products.filter(p=>p.stock).slice(0,4).map(productCard).join("");
}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p||!p.stock)return;
  cart[id]=(cart[id]||0)+1;saveCart();updateCartBadge();
  renderCart();notify(p.name+" added to your cart!");
}
function toggleWish(id){
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  saveWishlist();renderShop();renderFeatured();
}
function renderCart(){
  const host=document.getElementById("cart-items");
  if(!host)return;
  const entries=Object.entries(cart).filter(([id,qty])=>qty>0&&products.some(p=>p.id===id));
  if(!entries.length){
    host.innerHTML='<div class="empty">Your cart is empty. Time to find some cards!</div>';
  }else{
    host.innerHTML=entries.map(([id,qty])=>{
      const p=products.find(x=>x.id===id);
      return `<div class="cart-row">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
        <div class="grow"><strong>${p.name}</strong><p>${money(p.price)} each</p>
        <button class="btn secondary" onclick="removeItem('${id}')">Remove</button></div>
        <label class="small">Qty <input type="number" min="1" max="20" value="${qty}" onchange="changeQty('${id}',this.value)"></label>
      </div>`;
    }).join("");
  }
  const subtotal=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);
  const shipping=subtotal===0||subtotal>=1500?0:99;
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set("subtotal",money(subtotal));set("shipping",money(shipping));set("grand-total",money(subtotal+shipping));
  set("cartCount",cartCount());
}
function changeQty(id,value){
  const qty=Math.max(1,Math.min(20,Math.floor(Number(value)||1)));
  cart[id]=qty;saveCart();renderCart();updateCartBadge();
}
function removeItem(id){delete cart[id];saveCart();renderCart();updateCartBadge();}
function checkout(){
  const message=document.getElementById("checkout-message");
  if(!cartCount()){if(message)message.textContent="Your cart is empty.";else notify("Your cart is empty.");return;}
  const subtotal=Object.entries(cart).reduce((sum,[id,qty])=>{
    const p=products.find(x=>x.id===id);return sum+(p?p.price*qty:0);
  },0);
  const shipping=subtotal>=1500?0:99;
  if(message)message.textContent="Demo checkout complete! Sample total: "+money(subtotal+shipping)+". No payment was taken and no real order was placed.";
  else notify("Demo checkout only. No payment was taken.");
  if(message)message.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function copyCoupon(code){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(()=>notify("Copied "+code+"!")).catch(()=>notify("Coupon: "+code));
  }else notify("Coupon: "+code);
}
function notify(message){
  let toast=document.getElementById("toast");
  if(!toast){
    toast=document.createElement("div");toast.id="toast";
    Object.assign(toast.style,{position:"fixed",bottom:"20px",left:"50%",transform:"translateX(-50%)",background:"#ffd400",color:"#111",padding:"13px 20px",borderRadius:"10px",fontWeight:"bold",zIndex:"100"});
    document.body.appendChild(toast);
  }
  toast.textContent=message;toast.style.display="block";
  clearTimeout(window.evToastTimer);
  window.evToastTimer=setTimeout(()=>toast.style.display="none",2400);
}

/* RANDOM DELIVERY MAP */
let raceTimer=null,raceProgress=0,routePoints=[];
const cities=["Neon City","Turbo Bay","Volt Valley","Midnight Metro","Apex District","Thunderport"];
function svgEl(tag,attrs){
  const e=document.createElementNS("http://www.w3.org/2000/svg",tag);
  Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;
}
function newMap(){
  pauseRace();
  raceProgress=0;
  const city=document.getElementById("city-name");
  if(!city)return;
  city.textContent=cities[Math.floor(Math.random()*cities.length)];
  const parks=document.getElementById("map-parks");
  const roads=document.getElementById("map-roads");
  const buildings=document.getElementById("map-buildings");
  parks.replaceChildren();roads.replaceChildren();buildings.replaceChildren();
  for(let i=0;i<7;i++){
    const x=Math.random()*680+20,y=Math.random()*330+35;
    parks.appendChild(svgEl("rect",{x,y,width:50+Math.random()*45,height:30+Math.random()*35,rx:8,fill:"#1d4434"}));
  }
  // Grid roads, then a connected route along intersections.
  const xs=[50,190,330,470,610,750],ys=[60,160,260,360];
  xs.forEach(x=>roads.appendChild(svgEl("path",{d:`M${x} 25 V415`,stroke:"#425364","stroke-width":17,fill:"none"})));
  ys.forEach(y=>roads.appendChild(svgEl("path",{d:`M25 ${y} H775`,stroke:"#425364","stroke-width":17,fill:"none"})));
  for(let i=0;i<30;i++){
    const x=35+Math.random()*690,y=35+Math.random()*350;
    buildings.appendChild(svgEl("rect",{x,y,width:15+Math.random()*25,height:12+Math.random()*25,rx:2,fill:["#35465a","#455064","#283d52"][i%3],opacity:.85}));
  }
  const startX=xs[0],startY=ys[Math.floor(Math.random()*ys.length)];
  const endX=xs[xs.length-1],endY=ys[Math.floor(Math.random()*ys.length)];
  routePoints=[[startX,startY]];
  let xIndex=0,yIndex=ys.indexOf(startY);
  while(xIndex<xs.length-1||yIndex!==ys.indexOf(endY)){
    if(xIndex<xs.length-1&&(yIndex===ys.indexOf(endY)||Math.random()<.6)){
      xIndex++;routePoints.push([xs[xIndex],ys[yIndex]]);
    }else if(yIndex<ys.indexOf(endY)){
      yIndex++;routePoints.push([xs[xIndex],ys[yIndex]]);
    }else if(yIndex>ys.indexOf(endY)){
      yIndex--;routePoints.push([xs[xIndex],ys[yIndex]]);
    }
  }
  const pathData=routePoints.map((p,i)=>(i?"L":"M")+p[0]+" "+p[1]).join(" ");
  const route=document.getElementById("car-route");
  route.setAttribute("d",pathData);
  document.getElementById("store-pin").setAttribute("x",startX-17);
  document.getElementById("store-pin").setAttribute("y",startY-15);
  document.getElementById("house-pin").setAttribute("x",endX-12);
  document.getElementById("house-pin").setAttribute("y",endY-15);
  const car=document.getElementById("delivery-car");
  car.setAttribute("x",startX-12);car.setAttribute("y",startY+11);
  document.getElementById("speed").textContent="0";
  document.getElementById("distance").textContent=(routePoints.length*2.1).toFixed(1);
  document.getElementById("delivery-progress").style.width="0%";
  document.getElementById("delivery-status").textContent="Ready";
  document.getElementById("delivery-message").textContent="New route generated. Ready to race!";
  document.getElementById("start-btn").disabled=false;
}
function startRace(){
  const path=document.getElementById("car-route");
  if(!path||!path.getTotalLength())return;
  if(raceTimer)return;
  if(raceProgress>=1)newMap();
  document.getElementById("delivery-status").textContent="On the way";
  document.getElementById("delivery-message").textContent="Turbo mode activated. Delivery in progress!";
  document.getElementById("start-btn").disabled=true;
  const length=path.getTotalLength();
  raceTimer=setInterval(()=>{
    raceProgress=Math.min(1,raceProgress+.008);
    const point=path.getPointAtLength(length*raceProgress);
    const car=document.getElementById("delivery-car");
    car.setAttribute("x",point.x-13);car.setAttribute("y",point.y+11);
    document.getElementById("speed").textContent=String(Math.round(280+Math.random()*140));
    document.getElementById("distance").textContent=(12.4*(1-raceProgress)).toFixed(1);
    document.getElementById("delivery-progress").style.width=(raceProgress*100)+"%";
    if(raceProgress>=1){
      pauseRace();
      document.getElementById("speed").textContent="0";
      document.getElementById("distance").textContent="0.0";
      document.getElementById("delivery-status").textContent="Delivered!";
      document.getElementById("delivery-message").textContent="Mission complete! Your fictional package has arrived. 🏁";
      document.getElementById("start-btn").disabled=false;
      notify("Delivery completed!");
    }
  },100);
}
function pauseRace(){
  if(raceTimer){clearInterval(raceTimer);raceTimer=null;}
  const btn=document.getElementById("start-btn");
  if(btn)btn.disabled=false;
  const status=document.getElementById("delivery-status");
  if(status&&raceProgress>0&&raceProgress<1)status.textContent="Paused";
}
function initTracker(){
  if(document.getElementById("delivery-map"))newMap();
}
function init(){
  setupNav();renderShop();renderFeatured();renderCart();initTracker();
}
document.addEventListener("DOMContentLoaded",init);
