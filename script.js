const products = [
  { name: "Oud Royale", price: 2499 },
  { name: "Velvet Bloom", price: 1999 },
  { name: "Noir Intense", price: 2799 },
  { name: "Rose Essence", price: 1799 }
];

const cart = {};
const purchaseModal = document.createElement("div");

purchaseModal.id = "purchase-modal";
purchaseModal.style.cssText = `
  display:none;
  position:fixed;
  inset:0;
  z-index:99999;
  background:rgba(0,0,0,.75);
  padding:20px;
  overflow-y:auto;
`;

purchaseModal.innerHTML = `
  <div style="
    max-width:520px;
    margin:30px auto;
    padding:24px;
    border-radius:16px;
    background:#fff;
    color:#222;
    font-family:Arial,sans-serif;
  ">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h2 style="margin:0">Your Shopping Bag</h2>
      <button type="button" id="close-purchase"
        style="font-size:24px;border:0;background:none;cursor:pointer">×</button>
    </div>

    <div id="purchase-items" style="margin:20px 0"></div>

    <div style="border-top:1px solid #ddd;padding-top:16px">
      <h3 id="purchase-total">Total: Rs. 0</h3>
      <button type="button" id="continue-purchase"
        style="width:100%;padding:14px;background:#171717;color:white;
        border:0;border-radius:8px;cursor:pointer">
        Continue to Order
      </button>
    </div>
  </div>
`;

document.body.appendChild(purchaseModal);

function openPurchasePanel() {
  renderPurchasePanel();
  purchaseModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closePurchasePanel() {
  purchaseModal.style.display = "none";
  document.body.style.overflow = "";
}

function renderPurchasePanel() {
  const box = document.getElementById("purchase-items");

  box.replaceChildren();

  let total = 0;

  products.forEach((p, i) => {
    const qty = cart[i] || 0;
    if (!qty) return;

    total += p.price * qty;

    const row = document.createElement("div");
    row.style.cssText =
      "padding:14px 0;border-bottom:1px solid #ddd";

    const name = document.createElement("strong");
    name.textContent = p.name;

    const price = document.createElement("p");
    price.textContent =
      "Rs. " + p.price.toLocaleString("en-PK") + " each";

    const quantity = document.createElement("div");
    quantity.style.cssText =
      "display:flex;align-items:center;gap:14px";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.style.cssText = "padding:8px 16px;cursor:pointer";
    minus.onclick = () => {
      removeFromCart(i);
      renderPurchasePanel();
    };

    const number = document.createElement("strong");
    number.textContent = qty;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.style.cssText = "padding:8px 16px;cursor:pointer";
    plus.onclick = () => {
      cart[i] = (cart[i] || 0) + 1;
      renderCart();
      renderPurchasePanel();
    };

    const subtotal = document.createElement("p");
    subtotal.textContent =
      "Subtotal: Rs. " +
      (p.price * qty).toLocaleString("en-PK");

    quantity.append(minus, number, plus);
    row.append(name, price, quantity, subtotal);
    box.appendChild(row);
  });

  if (total === 0) {
    box.textContent = "Your bag is empty.";
  }

  document.getElementById("purchase-total").textContent =
    "Total: Rs. " + total.toLocaleString("en-PK");
}

document.getElementById("close-purchase").onclick =
  closePurchasePanel;

purchaseModal.addEventListener("click", event => {
  if (event.target === purchaseModal) {
    closePurchasePanel();
  }
});

document.getElementById("continue-purchase").onclick = () => {
  if (!Object.values(cart).some(qty => qty > 0)) {
    alert("Please add a perfume to your bag first.");
    return;
  }

  closePurchasePanel();

  document.getElementById("checkout-form").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
};
function addToCart(index) {
  cart[index] = (cart[index] || 0) + 1;
  renderCart();
  openPurchasePanel();
}

function removeFromCart(index) {
  if (!cart[index]) return;
  cart[index]--;
  if (cart[index] <= 0) delete cart[index];
  renderCart();
  renderPurchasePanel();
}

function renderCart() {
  const items = document.getElementById("cart-items");
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce(
    (sum, p, i) => sum + p.price * (cart[i] || 0), 0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent =
    "Rs. " + total.toLocaleString("en-PK");

  items.replaceChildren();

  if (count === 0) {
    items.textContent = "Your bag is empty.";
    return;
  }

  products.forEach((p, i) => {
    if (!cart[i]) return;

    const line = document.createElement("div");
    line.className = "cart-line";

    const name = document.createElement("span");
    name.textContent = `${p.name} × ${cart[i]}`;

    const right = document.createElement("span");
    right.textContent =
      "Rs. " + (p.price * cart[i]).toLocaleString("en-PK") + " ";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.onclick = () => removeFromCart(i);

    right.appendChild(remove);
    line.append(name, right);
    items.appendChild(line);
  });
}

document.getElementById("checkout-form").addEventListener("submit", function (event) {
  event.preventDefault();

  if (Object.values(cart).reduce((a, b) => a + b, 0) === 0) {
    alert("Please add a perfume to your bag first.");
    return;
  }

  const form = new FormData(this);
  const name = form.get("name").trim();
  const email = form.get("email").trim();
  const phone = form.get("phone").trim();
  const address = form.get("address").trim();

  if (!name || !phone || !address) {
    alert("Please complete all required fields.");
    return;
  }

  const orderLines = products
    .filter((p, i) => cart[i])
    .map((p, i) => {
      const index = products.indexOf(p);
      return `${p.name} x ${cart[index]} = Rs. ${(
        p.price * cart[index]
      ).toLocaleString("en-PK")}`;
    });

  const total = products.reduce(
    (sum, p, i) => sum + p.price * (cart[i] || 0), 0
  );

  const message = [
    "NEW PERFUME ORDER",
    "",
    ...orderLines,
    "",
    `Total: Rs. ${total.toLocaleString("en-PK")}`,
    "Payment: Cash on Delivery",
    "",
    `Customer: ${name}`,
    `Email: ${email || "Not provided"}`,
    `Phone: ${phone}`,
    `Address: ${address}`
  ].join("\n");

  // Replace this example with your shop's WhatsApp number.
  const shopWhatsApp = "923133026213";

  if (shopWhatsApp === "") {
    alert("Before taking real orders, replace the example WhatsApp number in script.js with your shop's number.");
    return;
  }

  window.open(
    "https://wa.me/" + shopWhatsApp + "?text=" + encodeURIComponent(message),
    "_blank",
    "noopener,noreferrer"
  );
});
