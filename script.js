// Наш основен масив с продукти
const products = [
    { id: 1, name: "Neon M4A4", price: 400, rarity: "epic", image: "https://placehold.co", discount: 0 },
    { id: 2, name: "Dragon AWP", price: 900, rarity: "legendary", image: "https://placehold.co", discount: 0 },
    { id: 3, name: "Classic Knife", price: 600, rarity: "rare", image: "https://placehold.co", discount: 0 },
    { id: 4, name: "Pistol Glock", price: 100, rarity: "common", image: "https://placehold.co", discount: 0 }
];

let coins = 1000;
let inventory = [];

const productsGrid = document.getElementById("productsGrid");
const coinCountEl = document.getElementById("coinCount");
const inventoryList = document.getElementById("inventoryList");
const inventoryCountEl = document.getElementById("inventoryCount");
const emptyMsg = document.getElementById("emptyMsg");
const searchBar = document.getElementById("searchBar");

// Инициализация при стартиране на играта
function init() {
    applyRandomDiscounts(); // Генерираме намаленията
    displayProducts(products); // Показваме продуктите
}

// Challenge 3: Логика за раздаване на случайни намаления
function applyRandomDiscounts() {
    // Ето тук добавихме процентите: 0 (без намаление), 10%, 25% или 50%
    const discountOptions = [0, 10, 25, 50];
    
    products.forEach(product => {
        const randomIndex = Math.floor(Math.random() * discountOptions.length);
        product.discount = discountOptions[randomIndex];
    });
}

// Помощна функция за изчисляване на крайна цена
function getFinalPrice(product) {
    if (product.discount > 0) {
        return product.price * (1 - product.discount / 100);
    }
    return product.price;
}

// Обновена визуализация, поддържаща намаления
function displayProducts(productsToRender = products) {
    productsGrid.innerHTML = "";
    
    productsToRender.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        
        const finalPrice = getFinalPrice(product);
        let priceHTML = `<p>Цена: ${finalPrice} 🪙</p>`;
        let discountBadgeHTML = "";
        
        // Ако има намаление, зачеркваме старата цена и слагаме червен бадж
        if (product.discount > 0) {
            discountBadgeHTML = `<span class="discount-badge">-${product.discount}%</span>`;
            priceHTML = `<p><span class="old-price">${product.price}</span> <span style="color: #ff3333; font-weight: bold;">${finalPrice} 🪙</span></p>`;
        }
        
        card.innerHTML = `
            ${discountBadgeHTML}
            <span class="rarity ${product.rarity}">${product.rarity}</span>
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            ${priceHTML}
            <button onclick="buyProduct(${product.id})">BUY</button>
        `;
        productsGrid.appendChild(card);
    });
}

// Функция за купуване (съобразена с новата цена от намалението)
function buyProduct(id) {
    const product = products.find(p => p.id === id);
    const finalPrice = getFinalPrice(product);

    if (coins >= finalPrice) {
        coins -= finalPrice;
        inventory.push({ name: product.name, rarity: product.rarity });
        updateUI();
        alert(`Успешно закупихте: ${product.name}!`);
    } else {
        alert("Нямате достатъчно монети!");
    }
}

// Логика за Loot Box
const openBoxBtn = document.getElementById("openBoxBtn");
const lootboxResult = document.getElementById("lootboxResult");

openBoxBtn.addEventListener("click", () => {
    const boxPrice = 200;
    if (coins >= boxPrice) {
        coins -= boxPrice;
        const randomIndex = Math.floor(Math.random() * products.length);
        const reward = products[randomIndex];
        inventory.push({ name: reward.name, rarity: reward.rarity });
        lootboxResult.innerHTML = `🎉 Спечели: <span class="rarity ${reward.rarity}">${reward.name}</span>`;
        updateUI();
    } else {
        alert("Нямате достатъчно монети за Loot Box!");
    }
});

// Логика за Търсачката
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

function updateUI() {
    coinCountEl.textContent = coins;
    inventoryCountEl.textContent = inventory.length;
    
    if (inventory.length > 0) {
        emptyMsg.style.display = "none";
        inventoryList.innerHTML = "";
        
        inventory.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("inventory-item");
            let borderColors = { common: "#808080", rare: "#0070dd", epic: "#a335ee", legendary: "#ff8000" };
            itemDiv.style.borderLeft = `4px solid ${borderColors[item.rarity]}`;
            itemDiv.innerHTML = `⚔️ ${item.name} (${item.rarity})`;
            inventoryList.appendChild(itemDiv);
        });
    }
}

// Стартираме всичко чрез init
init();
