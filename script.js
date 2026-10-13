const products = [
  { name: "Oud Royale", price: 2499 },
  { name: "Velvet Bloom", price: 1999 },
  { name: "Noir Intense", price: 2799 },
  { name: "Rose Essence", price: 1799 }
];

const cart = {};

function addToCart(index) {
  cart[index] = (cart[index] || 0) + 1;
  renderCart();
}

function removeFromCart(index) {
  if (!cart[index]) return;
  cart[index]--;
  if (cart[index] <= 0) delete cart[index];
  renderCart();
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