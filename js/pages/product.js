const container = document.querySelector("#container");
//const API_URL = "https://docs.noroff.dev/docs/v2/e-commerce/rainy-days#all-products"
const API_URL = "https://v2.api.noroff.dev/rainy-days";

async function fetchAPIProducts() {
	try {
		const params = new URLSearchParams(
			window.location.search,
		);
		const id = params.get("id");

		if (!id) {
			container.textContent =
				"No product ID provided in the URL.";
			return;
		}
		const response = await fetch(`${API_URL}/${id}`);
		const data = await response.json();
		const product = data.data;

		const productDiv = document.createElement("div");
		productDiv.className = "product-details";

		const image = document.createElement("img");
		image.className = "product-image";
		image.src = product.image.url;
		image.alt = product.image.alt;

		const infoDiv = document.createElement("div");
		infoDiv.className = "product-info";

		const title = document.createElement("h2");
		title.className = "product-title";
		title.textContent = product.title;

		const description = document.createElement("p");
		description.className = "product-description";
		description.textContent = product.description;

		const price = document.createElement("p");
		price.className = "product-price";
		price.textContent = `$ ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

		const buyButton = document.createElement("button");
		buyButton.textContent = "Add to Cart";
		buyButton.addEventListener("click", () => {
			if (!window.Cart)
				return console.error("Cart not available");
			window.Cart.addToCart({
				id: product.id,
				title: product.title,
				price: Number(product.price),
				image:
					product?.image?.url ?? product?.images?.[0]?.url ?? "",
			});
			buyButton.textContent = "Added to cart!";
			setTimeout(
				() => (buyButton.textContent = "Add to Cart"),
				3000,
			);
		});

		const backButton = document.createElement("button");
		backButton.className = "back-button";
		backButton.textContent = "← Back to products";
		backButton.addEventListener("click", () =>
			history.back(),
		);

		infoDiv.append(
			title,
			description,
			price,
			backButton,
			buyButton,
		);
		productDiv.append(image, infoDiv);
		container.appendChild(productDiv);
	} catch (error) {
		console.error("Error while fetching product:", error);
	}
}

fetchAPIProducts();

document.addEventListener("DOMContentLoaded", () => {
	window.Cart?.updateCartCount?.();
});
