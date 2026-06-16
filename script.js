// Базов масив с продукти
const products = [
    { id: 1, name: "M4A4 Assault", price: 300 },
    { id: 2, name: "AWP Sniper", price: 700 },
    { id: 3, name: "Tactical Knife", price: 500 },
    { id: 4, name: "Glock Pistol", price: 100 }
];

// Налични пари и празен инвентар
let coins = 1000;
let inventory = [];

// Свързване с HTML елементите
const productsGrid = document.getElementById("productsGrid");
const coinCountEl = document.getElementById("coinCount");
const inventoryList = document.getElementById("inventoryList");
const inventoryCountEl = document.getElementById("inventoryCount");
const emptyMsg = document.getElementById("emptyMsg");

// Функция за автоматично визуализиране на продуктите
function displayProducts() {
    productsGrid.innerHTML = "";
    
    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>Цена: ${product.price} монети</p>
            <button onclick="buyProduct(${product.id})">BUY</button>
        `;
        productsGrid.appendChild(card);
    });
}

// Функция за покупка (Проверка на пари -> Вадене на пари -> Добавяне в инвентар)
function buyProduct(id) {
    const product = products.find(p => p.id === id);

    if (coins >= product.price) {
        coins -= product.price; // Вадим парите
        inventory.push(product.name); // Добавяме в инвентара
        updateUI(); // Обновяваме екрана
        alert(`Успешно закупихте: ${product.name}!`);
    } else {
        alert("Нямате достатъчно монети за този предмет!");
    }
}

// Функция за преначертаване на инвентара и баланса
function updateUI() {
    coinCountEl.textContent = coins;
    inventoryCountEl.textContent = inventory.length;
    
    if (inventory.length > 0) {
        emptyMsg.style.display = "none";
        inventoryList.innerHTML = ""; // Изчистваме стария текст
        
        inventory.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("inventory-item");
            itemDiv.textContent = `⚔️ ${item}`;
            inventoryList.appendChild(itemDiv);
        });
    }
}

// Стартиране на магазина при зареждане на страницата
displayProducts();
