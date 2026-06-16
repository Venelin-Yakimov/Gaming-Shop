// Списък с продукти (Level 1 & Level 2)
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

// Level 5: Звукови ефекти през браузъра (без външни аудио файлове)
function playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }
}

// Инициализация при стартиране
function init() {
    applyRandomDiscounts(); // Challenge 3
    displayProducts(products);
}

// Challenge 3: КОРИГИРАНА логика за намаления с добавени стойности
function applyRandomDiscounts() {
    const discountOptions = [10, 20, 30]; // Поправено: Вече има числа вътре!
    products.forEach(product => {
        const randomIndex = Math.floor(Math.random() * discountOptions.length);
        product.discount = discountOptions[randomIndex];
    });
}

function getFinalPrice(product) {
    if (product.discount > 0) {
        return product.price * (1 - product.discount / 100);
    }
    return product.price;
}

function displayProducts(productsToRender = products) {
    productsGrid.innerHTML = "";
    
    productsToRender.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        
        const finalPrice = getFinalPrice(product);
        let priceHTML = `<p>Цена: ${finalPrice} 🪙</p>`;
        let discountBadgeHTML = "";
        
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

function buyProduct(id) {
    const product = products.find(p => p.id === id);
    const finalPrice = getFinalPrice(product);

    if (coins >= finalPrice) {
        coins -= finalPrice;
        inventory.push({ name: product.name, rarity: product.rarity });
        updateUI();
        playSound("success");
        alert(`Успешно закупихте: ${product.name}!`);
    } else {
        playSound("error");
        alert("Нямате достатъчно монети!");
    }
}

// LEVEL 3: Loot Box логика
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
        playSound("success");
    } else {
        playSound("error");
        alert("Нямате достатъчно монети за Loot Box!");
    }
});

// Challenge 2: Търсачка логика
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

// Challenge 1: Смяна на аватар
document.getElementById("changeAvatarBtn").addEventListener("click", () => {
    const randomSeed = Math.random().toString(36).substring(7);
    document.getElementById("playerAvatar").src = `https://dicebear.com{randomSeed}`;
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

init();
