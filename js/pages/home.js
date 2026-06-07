const container = document.querySelector("#container");
const API_URL = "https://v2.api.noroff.dev/rainy-days";

const genderSelect = document.querySelector("#gender");
const categorySelect = document.querySelector("#category");

let allProducts = [];

async function fetchAPIProducts() {
	try {
		const response = await fetch(API_URL);
		const data = await response.json();
		allProducts = Array.isArray(data?.data)
			? data.data
			: data;

		render(allProducts);
		genderSelect.addEventListener("change", applyFilters);
		categorySelect.addEventListener("change", applyFilters);
	} catch (error) {
		container.textContent =
			"Could not load products at this time.";
		console.error(
			"Error while fetching products:",
			error.message,
		);
	}
}

function render(list) {
	container.innerHTML = "";
	list.forEach((product) => {
		const box = document.createElement("div");
		const image = document.createElement("img");
		const content = document.createElement("div");
		const title = document.createElement("h2");
		const price = document.createElement("p");
		const link = document.createElement("a");

		box.className = "box";
		image.className = "box-image";
		content.className = "box-content";
		title.className = "box-title";
		price.className = "box-price";

		image.src =
			product?.image?.url ?? product?.images?.[0]?.url ?? "";
		image.alt =
			product?.image?.alt ?? product?.title ?? "product";
		title.textContent = product.title;
		price.textContent = `$ ${Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
		link.href = `./views/product/index.html?id=${product.id}`;

		content.appendChild(title);
		content.appendChild(price);
		box.appendChild(image);
		box.appendChild(content);
		link.appendChild(box);
		container.appendChild(link);
	});
}

function applyFilters() {
	const g = genderSelect.value.toLowerCase();
	const c = categorySelect.value.toLowerCase();
	const norm = (v) => (v ?? "").toString().toLowerCase();

	const filtered = allProducts.filter((p) => {
		const gender = norm(p.gender);
		const category = norm(p.category);
		const tags = Array.isArray(p.tags)
			? p.tags.map(norm)
			: [];

		const genderMatch =
			g === "all" ||
			gender === g ||
			(g === "unisex" &&
				(gender === "" || gender === "unisex"));

		const categoryMatch =
			c === "all" || category === c || tags.includes(c);

		return genderMatch && categoryMatch;
	});

	render(filtered.length ? filtered : allProducts);
}

window.Cart?.updateCartCount?.();

fetchAPIProducts();
