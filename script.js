// Обновен масив с добавени картинки (Level 1) и рядкост (Level 2)
const products = [
    { id: 1, name: "Neon M4A4", price: 400, rarity: "epic", image: "https://placehold.co" },
    { id: 2, name: "Dragon AWP", price: 900, rarity: "legendary", image: "https://placehold.co" },
    { id: 3, name: "Classic Knife", price: 600, rarity: "rare", image: "https://placehold.co" },
    { id: 4, name: "Pistol Glock", price: 100, rarity: "common", image: "https://placehold.co" }
];

let coins = 1000;
let inventory = [];

const productsGrid = document.getElementById("productsGrid");
const coinCountEl = document.getElementById("coinCount");
const inventoryList = document.getElementById("inventoryList");
const inventoryCountEl = document.getElementById("inventoryCount");
const emptyMsg = document.getElementById("emptyMsg");

function displayProducts() {
    productsGrid.innerHTML = "";
    
    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        
        // Вкарваме картинката и значката за рядкост в HTML-а на картата
        card.innerHTML = `
            <span class="rarity ${product.rarity}">${product.rarity}</span>
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p>Цена: ${product.price} 🪙</p>
            <button onclick="buyProduct(${product.id})">BUY</button>
        `;
        productsGrid.appendChild(card);
    });
}

function buyProduct(id) {
    const product = products.find(p => p.id === id);

    if (coins >= product.price) {
        coins -= product.price;
        // Запазваме името И рядкостта в инвентара
        inventory.push({ name: product.name, rarity: product.rarity });
        updateUI();
        alert(`Успешно закупихте: ${product.name}!`);
    } else {
        alert("Нямате достатъчно монети!");
    }
}

function updateUI() {
    coinCountEl.textContent = coins;
    inventoryCountEl.textContent = inventory.length;
    
    if (inventory.length > 0) {
        emptyMsg.style.display = "none";
        inventoryList.innerHTML = "";
        
        inventory.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("inventory-item");
            
            // Оцветяваме границата на предмета в инвентара според неговата рядкост
            let borderColors = { common: "#808080", rare: "#0070dd", epic: "#a335ee", legendary: "#ff8000" };
            itemDiv.style.borderLeft = `4px solid ${borderColors[item.rarity]}`;
            
            itemDiv.innerHTML = `⚔️ ${item.name} (${item.rarity})`;
            inventoryList.appendChild(itemDiv);
        });
    }
}

displayProducts();
