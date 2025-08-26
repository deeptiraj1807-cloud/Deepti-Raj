
const dropdown = document.getElementById("category");
const products = document.querySelectorAll(".product");


dropdown.addEventListener("change", () => {
  const selected = dropdown.value;

  products.forEach(product => {
  
    if (selected === "all" || product.dataset.category === selected) {
      product.classList.remove("hidden");
    } else {
      product.classList.add("hidden");
    }
  });
});
