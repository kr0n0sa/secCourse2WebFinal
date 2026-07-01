document.addEventListener("DOMContentLoaded", () => {
  // 1. Burger Menu Logic
  const burgerMenu = document.querySelector(".burger-menu");
  const navMenu = document.querySelector("nav");

  if (burgerMenu && navMenu) {
    burgerMenu.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      burgerMenu.classList.toggle("open");
    });
  }

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("active");
      if (burgerMenu) burgerMenu.classList.remove("open");
    });
  });

  loadMenu();
  initDragToScroll();
  checkCookieConsent();
  initScrollAnimations();
  initFeedbackSubmit();
  displayCart();
});

function initDragToScroll() {
  const sliders = document.querySelectorAll(".scroll");
  // !!!!!
  sliders.forEach((slider) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.style.cursor = "grab";
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.style.cursor = "grab";
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.style.cursor = "grab";
  });
}

async function loadMenu() {
  const response = await fetch("../menu-simulation.json");
  const menuData = await response.json();

  const containerMap = {
    shawarma: "shawarma-orders",
    additional: "additional-orders",
    sauce: "sauce-orders",
    drinks: "drinks-orders",
  };

  menuData.forEach((categoryObj) => {
    const categoryName = Object.keys(categoryObj)[0];
    const items = categoryObj[categoryName];

    const container = document.getElementById(containerMap[categoryName]);
    if (!container) return;

    Object.values(items).forEach((element) => {
      const menuItem = document.createElement("section");
      menuItem.classList.add("menu-item");

      const menuItemImage = document.createElement("img");
      menuItemImage.src = element.image;
      menuItem.append(menuItemImage);

      const flexer = document.createElement("section");
      flexer.classList.add("flexer");

      const orderSectionName = document.createElement("section");
      orderSectionName.classList.add("description");

      const menuItemName = document.createElement("h5");
      menuItemName.textContent = element.name;
      orderSectionName.appendChild(menuItemName);

      const menuItemDescription = document.createElement("p");
      menuItemDescription.textContent = element.description;
      orderSectionName.appendChild(menuItemDescription);

      const orderSectionAddToCart = document.createElement("section");
      orderSectionAddToCart.classList.add("order");

      const menuItemPrice = document.createElement("p");
      menuItemPrice.textContent = element.price;
      orderSectionAddToCart.appendChild(menuItemPrice);

      const menuItemOrder = document.createElement("button");
      menuItemOrder.textContent = "+შეკვეთა";
      menuItemOrder.classList.add("butoni");

      menuItemOrder.addEventListener("click", () => {
        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.name === element.name);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            name: element.name,
            price: element.price,
            image: element.image,
            quantity: 1,
          });
        }

        sessionStorage.setItem("cart", JSON.stringify(cart));
        console.log(`${element.name} added to cart!`, cart);
      });

      orderSectionAddToCart.appendChild(menuItemOrder);
      flexer.append(orderSectionName, orderSectionAddToCart);
      menuItem.append(flexer);
      container.append(menuItem);
    });
  });
}

function checkCookieConsent() {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const denyBtn = document.getElementById("deny-cookies");

  const permanentConsent = localStorage.getItem("cookieConsent");
  const sessionDenial = sessionStorage.getItem("cookieConsent");

  if (permanentConsent !== "true" && sessionDenial !== "false") {
    banner.style.display = "block";
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "true");
    banner.style.display = "none";
  });

  denyBtn.addEventListener("click", () => {
    sessionStorage.setItem("cookieConsent", "false");
    banner.style.display = "none";
  });
}

function initScrollAnimations() {
  const sectionsToReveal = document.querySelectorAll(".reveal");

  // !!!!!
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sectionsToReveal.forEach((section) => {
    observer.observe(section);
  });
}

function initFeedbackSubmit() {
  const submitBtn = document.getElementById("submit-feedback");

  submitBtn.addEventListener("click", () => {
    const name = document.getElementById("fb-name").value.trim();
    const surname = document.getElementById("fb-surname").value.trim();
    const email = document.getElementById("fb-email").value.trim();
    const phone = document.getElementById("fb-phone").value.trim();
    const message = document.getElementById("fb-message").value.trim();

    if (!name || !message) {
      alert("გთხოვთ შეავსოთ სახელი და წერილის ველი!");
      return;
    }

    const feedbackData = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      message: message,
      date: new Date().toLocaleString(),
    };

    console.log("ახალი შეტყობინება:", feedbackData);
    alert("მადლობა! თქვენი წერილი წარმატებით გაიგზავნა.");

    // 4. ფორმის გასუფთავება გაგზავნის შემდეგ
    document.getElementById("fb-name").value = "";
    document.getElementById("fb-surname").value = "";
    document.getElementById("fb-email").value = "";
    document.getElementById("fb-phone").value = "";
    document.getElementById("fb-message").value = "";
  });
}
