(function () {
	const STORAGE_KEY = "cart";

	function getCart() {
		try {
			return (
				JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
			);
		} catch {
			return [];
		}
	}
	function saveCart(c) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
	}

	function addToCart(item) {
		const cart = getCart();
		const i = cart.findIndex((x) => x.id === item.id);
		if (i >= 0) cart[i].qty += item.qty || 1;
		else
			cart.push({
				id: item.id,
				title: item.title,
				price: Number(item.price),
				image: item.image,
				qty: item.qty || 1,
			});
		saveCart(cart);
		updateCartCount();
	}

	function removeFromCart(id) {
		const cart = getCart().filter((x) => x.id !== id);
		saveCart(cart);
		updateCartCount();
	}

	function getTotals() {
		const cart = getCart();
		const items = cart.reduce((s, x) => s + x.qty, 0);
		const subtotal = cart.reduce(
			(s, x) => s + x.price * x.qty,
			0,
		);
		return { items, subtotal, currency: "USD" };
	}

	function placeOrder() {
		const orderId =
			"RD-" +
			Math.random().toString(36).slice(2, 8).toUpperCase();
		const order = {
			id: orderId,
			at: new Date().toISOString(),
			cart: getCart(),
			totals: getTotals(),
		};
		localStorage.setItem("lastOrder", JSON.stringify(order));
		saveCart([]);
		updateCartCount();
		location.href = `/views/confirmation/index.html?id=${encodeURIComponent(orderId)}`;
	}

	function updateCartCount() {
		const el = document.querySelector("#cart-count");
		if (!el) return;
		el.textContent = getCart().reduce((s, x) => s + x.qty, 0);
	}

	window.Cart = {
		getCart,
		saveCart,
		addToCart,
		removeFromCart,
		getTotals,
		placeOrder,
		updateCartCount,
	};
	console.log("Cart ready:", !!window.Cart);

	function initCheckoutUI() {
		const list = document.querySelector("#cart-list");
		const summary = document.querySelector("#cart-summary");
		const placeBtn = document.querySelector("#place-order");

		if (!list || !summary) return;

		function render() {
			const cart = getCart();
			list.innerHTML = cart.length
				? ""
				: "<p>Your cart is empty.</p>";

			cart.forEach((item) => {
				const row = document.createElement("div");
				row.className = "cart-row";
				row.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="cart-thumb">
          <div class="cart-title">${item.title}</div>
          <div class="cart-price">$ ${Number(item.price).toFixed(2)}</div>
          <button class="cart-remove" data-id="${item.id}">Remove</button>
        `;
				list.appendChild(row);
			});

			const subtotal = cart.reduce(
				(s, x) => s + Number(x.price) * Number(x.qty),
				0,
			);
			summary.innerHTML = `<p><strong>Subtotal:</strong> $ ${subtotal.toFixed(2)}</p>`;
		}

		list.addEventListener("click", (e) => {
			const btn = e.target.closest(".cart-remove");
			if (!btn) return;
			removeFromCart(btn.dataset.id);
			render();
			updateCartCount();
		});

		placeBtn?.addEventListener("click", () => {
			if (getCart().length === 0) return;
			placeOrder();
		});

		updateCartCount();
		render();
	}

	initCheckoutUI();
})();
