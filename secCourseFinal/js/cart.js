document.addEventListener("DOMContentLoaded", () => {
  displayCart();
});

function displayCart() {
  const container = document.getElementById("cart-items-container");
  const totalPriceElement = document.getElementById("total-price");

  // 1. Fetch cart from local storage
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Clear out container before rerendering
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>თქვენი კალათა ცარიელია.</p>";
    totalPriceElement.textContent = "0";
    return;
  }

  let grandTotal = 0;

  // 2. Loop through cart items and build DOM elements
  cart.forEach((item, index) => {
    // Parse numeric value out of price string (assuming format like "12.50 ₾" or just "12.5")
    const numericPrice = parseFloat(item.price) || 0;
    const itemTotal = numericPrice * item.quantity;
    grandTotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-details">
        <h5>${item.name}</h5>
        <p>ფასი: ${item.price}</p>
      </div>
      <div class="quantity-controls">
        <button class="minus-btn" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="plus-btn" data-index="${index}">+</button>
      </div>
      <button class="remove-btn" data-index="${index}">წაშლა</button>
    `;

    container.appendChild(cartItem);
  });

  totalPriceElement.textContent = grandTotal.toFixed(2);


  attachCartEventListeners(cart);
}

function attachCartEventListeners(cart) {
  // Plus Buttons
  document.querySelectorAll(".plus-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      cart[index].quantity += 1;
      updateStorageAndRerender(cart);
    });
  });

  // Minus Buttons
  document.querySelectorAll(".minus-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        // Remove item entirely if quantity drops below 1
        cart.splice(index, 1);
      }
      updateStorageAndRerender(cart);
    });
  });

  // Remove Buttons
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      cart.splice(index, 1); // Remove item from array
      updateStorageAndRerender(cart);
    });
  });
}

function updateStorageAndRerender(updatedCart) {
  sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  displayCart(); // Rerender updated cart list view
}
