// 🔷 Main type definitions for the project
interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
}

interface CartItem extends Product {
  count: number;
}

// 🌐 Define types for external libraries we're using

// 🔔 Type definition for iziToast notification library
interface IziToast {
  success(options: {
    title: string;
    message: string;
    position: string;
    backgroundColor: string;
    messageColor: string;
    iconColor: string;
    timeout: number;
  }): void;
}

// 🍭 Type definition for SweetAlert confirmation dialogs
interface SweetAlertConfig {
  showCancelButton: boolean;
  cancelButtonColor: string;
  cancelButtonText: string;
  confirmButtonColor: string;
  confirmButtonText: string;
  title?: string;
  text?: string;
  icon?: string;
}

interface SweetAlertResult {
  isConfirmed: boolean;
}

interface SweetAlert {
  fire(config: SweetAlertConfig): Promise<SweetAlertResult>;
}

// 📚 Global variable declarations for external libraries
declare const iziToast: IziToast;
declare const Swal: SweetAlert;

// 📦 Store product data with properties like id, name, image path, and price
const storeProducts: Product[] = [
    { id: 1, name: "IceCream", img: "assets/Images/products/item-1.webp", price: 5000000 },
    { id: 2, name: "Tea", img: "assets/Images/products/item-2.webp", price: 1000000 },
    { id: 3, name: "Coffee", img: "assets/Images/products/item-3.webp", price: 2550000 },
    { id: 4, name: "Mobile", img: "assets/Images/products/item-4.webp", price: 3000000 },
    { id: 5, name: "Tv", img: "assets/Images/products/item-5.webp", price: 55000000 },
    { id: 6, name: "AirCooker", img: "assets/Images/products/item-6.webp", price: 6500000 },
];

// 💾 Retrieve user's shopping cart data from LocalStorage
// If no data exists, use empty default values
let userCartItems: CartItem[] = JSON.parse(localStorage.getItem("Products") || "[]");
let cartTotalPrice: number = JSON.parse(localStorage.getItem("TotalPrice") || "0");

// 🎯 Select DOM elements needed for page interaction
const productsContainer: HTMLElement | null = document.querySelector(".store__products-container");
const removeAllBtn: HTMLButtonElement | null = document.querySelector(".cart__remove-all");
const cartItemsContainer: HTMLElement | null = document.querySelector(".cart__items");
let totalPrice: HTMLElement | null = document.querySelector(".cart__total-price");

// ⚙️ Default configuration for SweetAlert confirmation dialogs
const SwalConfig: SweetAlertConfig = {
  showCancelButton: true,        // Show cancel button
  cancelButtonColor: "#0d6efd",  // Cancel button color (blue)
  cancelButtonText: "Cancel",    // Cancel button text
  confirmButtonColor: "#fc0303", // Confirm button color (red)
  confirmButtonText: "OK",       // Confirm button text
};

// 🏪 Display products in the store page
const showStoreProducts = (): void => {
  if (!productsContainer) return;

  storeProducts.forEach(({ name, img, price }) => {
    // Create product card for each item with relevant information
    productsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="col">
        <div class="card h-100 product-card">
          <div class="product-image-container">
            <img src="${img}" loading="lazy" class="product-image" alt="${name}">
          </div>
          <div class="card-body text-center d-flex flex-column">
            <h5 class="product-title">${name}</h5>
            <p class="product-price mb-3">$${price.toLocaleString()}</p>
            <button class="btn btn-primary mt-auto" onClick="addToCart('${name}', '${img}', ${price})">Add to Cart</button>
          </div>
        </div>
      </div>`
    );
  });
  calculateTotalPrice();  // Calculate total price after displaying products
  createCartList();       // Display cart contents
};

// 💾 Save cart data to browser's local storage
const saveDataLocalStorage = (): void => {
  localStorage.setItem("Products", JSON.stringify(userCartItems));
  localStorage.setItem("TotalPrice", JSON.stringify(cartTotalPrice));
};

// 🔄 Convert product name to valid HTML ID by replacing spaces with hyphens
const formatNameToId = (name: string): string => name.replace(/ /g, "-"); // 🛠️ Fixed: Changed to global regex to replace all spaces

// 🔍 Filter cart products based on value and property type
const filterUserCart = (filterValue: string | number, propertyKey: string): void => {
  const filterBy: "name" | "count" = propertyKey === "name" ? "name" : "count";
  userCartItems = userCartItems.filter(
    (product) => product[filterBy] !== filterValue
  );
};

// 🛒 Add product to shopping cart
const addToCart = (name: string, img: string, price: number): void => {
  if (userCartItems.some((product) => product.name === name)) {
    updateUserCart(name, null);  // Update quantity if product already exists in cart
  } else {
    // Add new product to cart with initial quantity of 1
    const newProduct: CartItem = {
      id: userCartItems.length,
      name,
      img,
      price: +price,
      count: 1,
    };
    userCartItems.push(newProduct);
    createCartList();
  }
  saveDataLocalStorage();
  calculateTotalPrice();
  
  // ✅ Display success message
  iziToast.success({
    title: "Success",
    message: `The ${name} has been successfully added to your cart!`,
    position: "topRight",
    backgroundColor: "#03ff6c",
    messageColor: "#000",
    iconColor: "white",
    timeout: 1000,
  });
};

// 💰 Calculate total price of products in shopping cart
const calculateTotalPrice = (): void => {
  if (!totalPrice) return;

  cartTotalPrice = userCartItems.reduce(
    (sum, product) => sum + product.price * product.count,
    0
  );
  totalPrice.innerHTML = `$${cartTotalPrice.toLocaleString()}`;
};

// 🗑️ Remove specific product from cart with confirmation dialog
const removeProduct = (name: string): void => {
  Swal.fire({
    ...SwalConfig,
    title: "Remove Product?",
    text: `Are you sure you want to remove "${name}" from your cart? This product will no longer be in your shopping list.`,
    icon: "warning",
  }).then((result) => {
    if (result.isConfirmed) {
      filterUserCart(name, "name");
      createCartList();
      calculateTotalPrice();
      saveDataLocalStorage();

      // ✅ Display success message after removal
      Swal.fire({
        ...SwalConfig,
        showCancelButton: false,
        title: "Product Removed",
        text: `"${name}" has been successfully removed from your shopping cart.`,
        icon: "success",
        confirmButtonColor: "#0d6efd",
      });
    }
  });
};

// 🧹 Remove all products from cart with confirmation dialog
const removeAllProduct = (): void => {
  Swal.fire({
    ...SwalConfig,
    title: "Clear Entire Cart?",
    text: "Are you sure you want to clear your shopping cart? This action will remove all products and cannot be undone.",
    icon: "warning",
  }).then((result) => {
    if (result.isConfirmed) {
      if (!cartItemsContainer) return;
      
      cartItemsContainer.innerHTML = "";
      userCartItems = [];
      createCartList();
      calculateTotalPrice();
      saveDataLocalStorage();
      cartTotalPrice = 0;

      // ✅ Display success message after clearing cart
      Swal.fire({
        ...SwalConfig,
        showCancelButton: false,
        confirmButtonColor: "#0d6efd",
        confirmButtonText: "OK",
        icon: "success",
        title: "Cart Cleared",
        text: "Your shopping cart has been successfully cleared.",
      });
    }
  });
};

// 📋 Create and display list of products in shopping cart
const createCartList = (): void => {
  if (!removeAllBtn || !cartItemsContainer) return;

  // Enable/disable remove all button based on cart contents
  removeAllBtn.disabled = userCartItems.length === 0;
  filterUserCart("0", "count");  // Remove items with count 0
  cartItemsContainer.innerHTML = "";

  // Display cart products or empty cart message
  if (userCartItems.length) {
    userCartItems.forEach(({ name, img, price, count }) => {
      cartItemsContainer.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td class="product-cell" data-label="Product">
            <div class="d-flex align-items-center">
              <img src="${img}" loading="lazy" class="cart-item-image" alt="${name}">
              <span class="ms-3">${name}</span>
            </div>
          </td>
          <td class="text-center" data-label="Price">$${price.toLocaleString()}</td>
          <td class="text-center" data-label="Quantity">
            <input type="number" class="form-control cart-item-quantity mx-md-auto" style="max-width: 100px;" value="${count}" min="1" id="${formatNameToId(
          name
        )}" onChange="updateUserCart('${name}', event.target.value)">
          </td>
          <td class="text-center" data-label="Action">
            <button class="btn btn-link text-danger p-0 cart-item-remove" onClick="removeProduct('${name}')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#ff0000" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
              </svg>
            </button>
          </td>
        </tr>`
      );
    });
  } else {
    // Display empty cart message
    cartItemsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <tr class="text-center">
        <td colspan="4" class="empty-cart-message">
          <div class="alert alert-danger w-100" role="alert">
            Your cart is empty!
          </div>
        </td>
      </tr>
    `
    );
  }
};

// 🔄 Update product quantity in shopping cart
const updateUserCart = (name: string, count: string | null): void => {
  if (count === "0") {
    removeProduct(name);    // Remove product if quantity becomes zero
    return;
  }
  
  const quantityInputElement: HTMLInputElement | null = document.getElementById(formatNameToId(name)) as HTMLInputElement | null;
  const cartItem: CartItem | undefined = userCartItems.find((item) => item.name === name);

  if (!cartItem) return;

  cartItem.count = count ? parseInt(count) : cartItem.count + 1;    // Update product quantity
  
  if (quantityInputElement) {
    quantityInputElement.value = cartItem.count.toString();    // Update display value
  }

  calculateTotalPrice();    // Recalculate total price
  saveDataLocalStorage();   // Save changes
};

// 🎬 Add event listener if element exists
if (removeAllBtn) {
  removeAllBtn.addEventListener("click", removeAllProduct);
}

// 🚀 Set up page event listeners
window.addEventListener("load", showStoreProducts);    // Display products on page load