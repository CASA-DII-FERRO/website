// ========================================
// CASA DI FERRO STORE - Professional JS
// ========================================

// DOM Elements
const shop = document.getElementById("shop");
const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const loader = document.getElementById("loader");
const music = document.getElementById("bgMusic");
const musicPlayer = document.getElementById("musicPlayer");
const playPauseBtn = document.getElementById("playPause");
const volumeSlider = document.getElementById("volume");
const closePlayerBtn = document.getElementById("closePlayer");
const pdfBtn = document.getElementById("pdfBtn");
const pdfForm = document.getElementById("pdfForm");
const confirmPDF = document.getElementById("confirmPDF");
const cancelPDF = document.getElementById("cancelPDF");
const cartBtn = document.getElementById("cartBtn");
const invoiceSection = document.getElementById("invoiceSection");
const clearCartBtn = document.getElementById("clearCart");
const itemModal = document.getElementById("itemModal");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// State
let invoice = [];
let total = 0;
let currentCategory = 'all';

// ========================================
// DISCORD WEBHOOK SYSTEM
// ========================================
const WEBHOOK_URL = "https://discord.com/api/webhooks/1479333917856235647/uddkochfrToMOGvOOPGF_bAmsPr1_ZxqRbqFMKVSTU70QKbOJpRUdU9iXmoUmhKBSjrZ";

async function sendDiscordWebhook(invoiceData) {
    const { invoiceNumber, buyer, gang, radio, items, total, date, time } = invoiceData;
    
    // Format items list
    const itemsList = items.map(item => `• ${item.name} x${item.qty} - ${item.price.toLocaleString()}$`).join('\n');
    
    const embed = {
        embeds: [{
            title: "🛒 New Order - Casa Di Ferro",
            color: 0xc9a24d,
            fields: [
                { name: "📋 Invoice", value: invoiceNumber, inline: true },
                { name: "💰 Total", value: `${total.toLocaleString()}$`, inline: true },
                { name: "👤 Buyer", value: buyer, inline: true },
                { name: "🏴 Gang", value: gang, inline: true },
                { name: "📻 Radio", value: radio, inline: true },
                { name: "📅 Date", value: `${date} at ${time}`, inline: true },
                { name: "🛍️ Items Purchased", value: itemsList || "No items" }
            ],
            footer: { text: "Casa Di Ferro Store" },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });
        
        if (!response.ok) {
            console.error('Webhook error:', response.status);
        }
    } catch (error) {
        console.error('Failed to send webhook:', error);
    }
}

// Set initial volume
music.volume = 0.3;

// ========================================
// LOADER & VIDEO
// ========================================
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 1500);
    
    // Try to play background video
    const video = document.getElementById("bgVideo");
    if (video) {
        video.play().catch(e => {
            console.log("Video autoplay blocked:", e);
        });
        
        // Handle video errors
        video.addEventListener('error', () => {
            console.log("Video failed to load");
            video.style.display = 'none';
        });
    }
    
    // Preload audio
    if (music) {
        music.load();
        music.addEventListener('error', () => {
            console.log("Music failed to load");
        });
    }
});

// Handle video play on user interaction (fallback)
document.addEventListener("click", () => {
    const video = document.getElementById("bgVideo");
    if (video && video.paused) {
        video.play().catch(e => console.log("Video play error:", e));
    }
}, { once: true });

// ========================================
// INTRO & MUSIC
// ========================================
startBtn.addEventListener("click", () => {
    // Play music
    music.volume = 0.4;
    music.play().catch(e => console.log("Audio autoplay blocked:", e));

    // Hide intro with animation
    intro.style.opacity = "0";
    intro.style.visibility = "hidden";
    
    // Show music player
    setTimeout(() => {
        renderShop('all');
        musicPlayer.classList.add("show");
    }, 800);
});

// ========================================
// MUSIC CONTROLS - Professional
// ========================================
playPauseBtn.addEventListener("click", () => {
    const icon = playPauseBtn.querySelector('i');
    if (music.paused) {
        music.play().catch(e => console.log("Playback error:", e));
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playPauseBtn.title = "Pause";
    } else {
        music.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playPauseBtn.title = "Play";
    }
});

volumeSlider.addEventListener("input", () => {
    music.volume = volumeSlider.value;
});

closePlayerBtn.addEventListener("click", () => {
    musicPlayer.classList.remove("show");
    music.pause();
    music.currentTime = 0;
    // Stop music when player is closed
    setTimeout(() => {
        music.pause();
        const icon = playPauseBtn.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }, 500);
});

// ========================================
// CART/INVOICE TOGGLE
// ========================================
cartBtn.addEventListener("click", () => {
    invoiceSection.classList.toggle("show");
    if (invoiceSection.classList.contains("show")) {
        cartBtn.textContent = "Close";
    } else {
        cartBtn.textContent = "Cart";
    }
});

function toggleInvoice() {
    invoiceSection.classList.remove("show");
    cartBtn.textContent = "Cart";
}

    // Clear Cart
function clearCart() {
    if (invoice.length === 0) {
        alert("Cart is already empty!");
        return;
    }
    
    if (confirm("Are you sure you want to clear the cart?")) {
        invoice = [];
        total = 0;
        renderInvoice();
        alert("Cart cleared!");
    }
}

// ========================================
// ITEMS DATA
// ========================================
const items = [
    // Heist Items
    { name: "PACK FLEECA", price: 51500, img: "images/pack_fleeca.png", cat: "heist", status: "green" },
    { name: "Bag", price: 5750, img: "images/bag.png", cat: "heist", status: "green" },
    { name: "Electric Cutter", price: 3450, img: "images/electric_cutter.png", cat: "heist", status: "green" },
    { name: "X Circuit Tester", price: 3450, img: "images/circuit.png", cat: "heist", status: "green" },
    { name: "Device", price: 3450, img: "images/device.png", cat: "heist", status: "green" },
    { name: "MXC Key", price: 3450, img: "images/mxc_key.png", cat: "heist", status: "green" },
    { name: "Fingerprint Tape", price: 5175, img: "images/fingerprint Tape.png", cat: "heist", status: "green" },
    { name: "BCCD", price: 70000, img: "images/bccd.png", cat: "heist", status: "green" },
    { name: "Humane Labs Keycard", price: 55000, img: "images/labo.png", cat: "heist", status: "green" },
    { name: "Fleeca Card Device", price: 20000, img: "images/fcd.png", cat: "heist", status: "green" },
    { name: "Laptop", price: 5750, img: "images/laptop.png", cat: "heist", status: "green" },
    { name: "X Laptop", price: 4600, img: "images/xlaptop.png", cat: "heist", status: "green" },
    { name: "Thermit", price: 5750, img: "images/thermite.png", cat: "heist", status: "green" },
    { name: "EXPLOSIVE C4", price: 13000, img: "images/c4.png", cat: "heist", status: "green" },
    { name: "PACK PALITO", price: 75750, img: "images/pack_palito.png", cat: "heist", status: "green" },
    { name: "PACK BIJOX", price: 37375, img: "images/pack_bijox.png", cat: "heist", status: "green" },
    { name: "PACK HUMANLABS", price: 165000, img: "images/pack_humanlab.png", cat: "heist", status: "green" },


    // Weapons
    { name: "Pistol MK2", price: 95000, img: "images/pistol_mk2.png", cat: "weapon", status: "orange" },
    { name: "Combat Pistol", price: 100000, img: "images/combat_pistol.png", cat: "weapon", status: "green" },
    { name: "DP9 Pistol", price: 95000, img: "images/dp9.png", cat: "weapon", status: "green" },
    { name: "Browning", price: 95000, img: "images/browning.png", cat: "weapon", status: "green" },
    { name: "Glock-18C", price: 95000, img: "images/glock_18c.png", cat: "weapon", status: "green" },
    { name: "Micro SMG", price: 110000, img: "images/Micro_SMG.png", cat: "weapon", status: "green" },
    { name: "Mini SMG", price: 90000, img: "images/Mini_SMG.png", cat: "weapon", status: "green" },
    { name: "Combat PDW", price: 126000, img: "images/Combat PDW.png", cat: "weapon", status: "green" },
    { name: "Groza", price: 210000, img: "images/groza.png", cat: "weapon", status: "green" },
    { name: "M70 (AK-47)", price: 189000, img: "images/m70.png", cat: "weapon", status: "green" },
    { name: "Sawed-Off Shotgun", price: 105000, img: "images/sawed_off_shotgun.png", cat: "weapon", status: "green" },
    { name: "SMG Ammo", price: 4000, img: "images/smg_ammo.png", cat: "weapon", status: "green" },
    { name: "Pistol Ammo", price: 6500, img: "images/pistol_ammo.png", cat: "weapon", status: "green" },
    { name: "Shotgun Ammo", price: 4000, img: "images/shotgun_ammo.png", cat: "weapon", status: "green" },
    { name: "Rifle Ammo", price: 5500, img: "images/rifle_ammo.png", cat: "weapon", status: "green" },
    { name: "Handcuffs", price: 6500, img: "images/handcuffs.png", cat: "weapon", status: "green" },
    { name: "Kevlar Vest", price: 5400, img: "images/kevlar_vest.png", cat: "weapon", status: "green" },
    { name: "Molotov", price: 12600, img: "images/molotov.png", cat: "weapon", status: "green" },
    { name: "Suppressor (SMG)", price: 5500, img: "images/suppressor_sm.png", cat: "weapon", status: "green" },
    { name: "Scope (SMG)", price: 4000, img: "images/scope_sm.png", cat: "weapon", status: "green" },
    { name: "Extended Clip (SMG)", price: 5000, img: "images/extended_clip_sm.png", cat: "weapon", status: "green" },
    { name: "Suppressor (Pistol)", price: 4000, img: "images/suppressor_pistol.png", cat: "weapon", status: "green" },

    // Gold/Jewellery
    { name: "Chemical", price: 400000, img: "images/chemical.png", cat: "gold", status: "green" },
    { name: "Marked Gold Bar", price: 5300, img: "images/Marked_Gold_BAR.png", cat: "gold", status: "green" },
    { name: "Marked Silver Bar", price: 4800, img: "images/marked_silver_bar.png", cat: "gold", status: "green" },
    { name: "Gold Bar", price: 12000, img: "images/gold_bar.png", cat: "gold", status: "green" },
    { name: "Silver Bar", price: 6000, img: "images/silver_bar.png", cat: "gold", status: "green" },
    { name: "Diamond", price: 750, img: "images/diamond.png", cat: "gold", status: "green" },
    { name: "X Panther Gem", price: 16500, img: "images/x_panther_gem.png", cat: "gold", status: "green" },
    { name: "Giant Gem", price: 16500, img: "images/giant_gem.png", cat: "gold", status: "green" },
    { name: "Gem Necklace", price: 16500, img: "images/Gem_Necklace.png", cat: "gold", status: "green" },
    { name: "Giant Gem Green", price: 16500, img: "images/Giant_Gem_Green.png", cat: "gold", status: "green" },
    { name: "Box Of Jewlery", price: 4000, img: "images/Box_of_Jewlery.png", cat: "gold", status: "green" },
    { name: "Diamond Ring", price: 750, img: "images/Diamond_Ring.png", cat: "gold", status: "green" },
    { name: "Ruby Ring", price: 750, img: "images/Ruby_Ring.png", cat: "gold", status: "green" },
    { name: "Sapphire Ring", price: 750, img: "images/Sapphire_Ring.png", cat: "gold", status: "green" },
    { name: "Emerald Ring", price: 750, img: "images/Emerald_Ring.png", cat: "gold", status: "green" },
    { name: "Diamond Earring", price: 750, img: "images/Diamond_Earring.png", cat: "gold", status: "green" },
    { name: "Ruby Earring", price: 750, img: "images/Ruby_Earring.png", cat: "gold", status: "green" },
    { name: "Sapphire Earring", price: 750, img: "images/Sapphire_Earring.png", cat: "gold", status: "green" },
    { name: "Emerald Earring", price: 750, img: "images/Emerald_Earring.png", cat: "gold", status: "green" },
    { name: "Diamond Necklace", price: 750, img: "images/Diamond_Necklace.png", cat: "gold", status: "green" },
    { name: "Ruby Necklace", price: 750, img: "images/Ruby_Necklace.png", cat: "gold", status: "green" },
    { name: "Sapphire Necklace", price: 750, img: "images/Sapphire_Necklace.png", cat: "gold", status: "green" },
    { name: "Emerald Necklace", price: 750, img: "images/Emerald_Necklace.png", cat: "gold", status: "green" },

    // Drugs
    { name: "BOX Lyrika", price: 590000, img: "images/lyrika.png", cat: "drugs", status: "green" },
    { name: "BOX Heroin", price: 570000, img: "images/heroin.png", cat: "drugs", status: "green" },
    { name: "Marijuana", price: 310, img: "images/marijuana.png", cat: "drugs", status: "green" },
    { name: "Weed AK47", price: 500, img: "images/weed_ak47.png", cat: "drugs", status: "green" }
];

// ========================================
// RENDER SHOP
// ========================================
function renderShop(category) {
    shop.innerHTML = "";
    currentCategory = category;
    let delay = 0;
    
    // Update active category
    document.querySelectorAll('.cat').forEach(cat => {
        cat.classList.remove('active');
        if (cat.onclick.toString().includes(category)) {
            cat.classList.add('active');
        }
    });
    
    const filteredItems = category === 'all' 
        ? items 
        : items.filter(i => i.cat === category);
    
    filteredItems.forEach(i => {
        const card = document.createElement("div");
        card.className = "card";
        
        // Get category display name
        let catName = "";
        switch(i.cat) {
            case 'weapon': catName = "weapon"; break;
            case 'heist': catName = "Hacker"; break;
            case 'gold': catName = "Jewellery"; break;
            case 'drugs': catName = "Drugs"; break;
        }
        
        let qtyHTML = '';
        if (i.status !== "red") {
            qtyHTML = `
            <div class="qty-box" style="display:none">
                <input type="number" min="1" value="1" class="qtyInput">
                <button onclick="addItemFromInput(this,'${i.name}',${i.price})">Confirm</button>
            </div>`;
        }
        
        // Bulk hints for drugs
        let bulkHint = '';
        if (i.cat === "drugs") {
            if (i.name === "BOX Lyrika") {
                bulkHint = `<p class="bulk-hint">1 = 590,000$ | 2 = 585,000$ | 3+ = 575,000$</p>`;
            } else if (i.name === "BOX Heroin") {
                bulkHint = `<p class="bulk-hint">1 = 570,000$ | 2 = 565,000$ | 3+ = 555,000$</p>`;
            }
        }
        

        card.innerHTML = `
            <img src="${i.img}" alt="${i.name}">
            <h3>${i.name}</h3>
            <p class="price-text">${i.price.toLocaleString()}$</p>
            ${bulkHint}
            <div class="status ${i.status}">
                ${i.status === "green" ? '<i class="fas fa-circle" style="color:#2ecc71"></i> Available' : i.status === "orange" ? '<i class="fas fa-circle" style="color:#f39c12"></i> Low Stock' : '<i class="fas fa-circle" style="color:#e74c3c"></i> Out of Stock'}
            </div>
            ${i.status !== "red" ? `<button onclick="showQty(this)"><i class="fas fa-plus"></i> Add</button>` : ""}
            ${qtyHTML}
        `;
        
        // Add click event for quick view
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('qty-box') && !e.target.classList.contains('qtyInput') && !e.target.tagName === 'BUTTON') {
                openItemModal(i);
            }
        });
        
        shop.appendChild(card);
        setTimeout(() => card.classList.add("show"), delay);
        delay += 50;
    });
}

// ========================================
// FILTER ITEMS
// ========================================
function filterItems(category) {
    renderShop(category);
}

// ========================================
// QUANTITY BOX
// ========================================
function showQty(btn) {
    const box = btn.nextElementSibling;
    if (box.style.display === "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }
}

// ========================================
// ADD ITEM TO INVOICE
// ========================================
function addItemFromInput(btn, name, price) {
    const qty = parseInt(btn.previousElementSibling.value);
    if (!qty || qty <= 0) return;
    
    let finalPrice = price;
    
    // Apply bulk discounts
    if (name === "BOX Lyrika") {
        finalPrice = qty >= 3 ? 575000 : qty >= 2 ? 585000 : 590000;
    } else if (name === "BOX Heroin") {
        finalPrice = qty >= 3 ? 555000 : qty >= 2 ? 565000 : 570000;
    }
    
    const totalPrice = finalPrice * qty;
    
    invoice.push({
        name: name,
        qty: qty,
        price: totalPrice
    });
    
    renderInvoice();
    btn.parentElement.style.display = "none";
    
    // Show success message
    showNotification(`Added ${qty}x ${name} to cart`);
}

// ========================================
// RENDER INVOICE
// ========================================
function renderInvoice() {
    const tbody = document.querySelector("#invoice tbody");
    tbody.innerHTML = "";
    total = 0;
    
    invoice.forEach((item, index) => {
        total += item.price;
        
        const tr = document.createElement("tr");
        tr.classList.add("invoice-add");
        
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.price.toLocaleString()}$</td>
            <td><button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-times"></i></button></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    document.getElementById("total").innerText = total.toLocaleString() + " $";
    
    // Update cart count
    const cartCount = invoice.length;
    document.getElementById("cartCount").innerText = cartCount;
}

// ========================================
// REMOVE ITEM
// ========================================
function removeItem(index) {
    const rows = document.querySelectorAll("#invoice tbody tr");
    const row = rows[index];
    
    if (row) {
        row.classList.add("invoice-remove");
        
        setTimeout(() => {
            invoice.splice(index, 1);
            renderInvoice();
        }, 420);
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
function searchItems(query) {
    searchResults.innerHTML = "";
    
    if (query.length < 2) {
        searchResults.classList.remove("show");
        return;
    }
    
    const searchTerm = query.toLowerCase();
    const matches = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    
    if (matches.length > 0) {
        matches.slice(0, 8).forEach(item => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name}</span>
            `;
            div.addEventListener('click', () => {
                openItemModal(item);
                searchResults.classList.remove("show");
                searchInput.value = "";
            });
            searchResults.appendChild(div);
        });
        searchResults.classList.add("show");
    } else {
        searchResults.classList.remove("show");
    }
}

// Close search when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        searchResults.classList.remove("show");
    }
});

// ========================================
// ITEM MODAL (QUICK VIEW)
// ========================================
function openItemModal(item) {
    document.getElementById('modalImg').src = item.img;
    document.getElementById('modalName').textContent = item.name;
    document.getElementById('modalPrice').textContent = item.price.toLocaleString() + "$";
    
    // Category description - English
    let desc = "";
    switch(item.cat) {
        case 'weapon': desc = "High quality weapon"; break;
        case 'heist': desc = "Professional heist equipment"; break;
        case 'gold': desc = "Valuable jewellery"; break;
        case 'drugs': desc = "High quality drugs"; break;
    }
    document.getElementById('modalDesc').textContent = desc;
    
    // Status - English
    const statusEl = document.getElementById('modalStatus');
    statusEl.className = `modal-status status ${item.status}`;
    statusEl.innerHTML = item.status === "green" ? '<i class="fas fa-circle" style="color:#2ecc71"></i> Available' : item.status === "orange" ? '<i class="fas fa-circle" style="color:#f39c12"></i> Low Stock' : '<i class="fas fa-circle" style="color:#e74c3c"></i> Out of Stock';
    
    // Store item data for modal
    itemModal.dataset.name = item.name;
    itemModal.dataset.price = item.price;
    itemModal.dataset.status = item.status;
    
    // Reset quantity
    document.getElementById('modalQty').value = 1;
    
    itemModal.classList.add("show");
}

function closeModal() {
    itemModal.classList.remove("show");
}

function addFromModal() {
    const name = itemModal.dataset.name;
    const price = parseInt(itemModal.dataset.price);
    const status = itemModal.dataset.status;
    const qty = parseInt(document.getElementById('modalQty').value);
    
    if (status === "red") {
        alert("This item is out of stock!");
        return;
    }
    
    if (!qty || qty <= 0) {
        alert("Please enter a valid quantity");
        return;
    }
    
    let finalPrice = price;
    
    // Apply bulk discounts
    if (name === "BOX Lyrika") {
        finalPrice = qty >= 3 ? 575000 : qty >= 2 ? 585000 : 590000;
    } else if (name === "BOX Heroin") {
        finalPrice = qty >= 3 ? 555000 : qty >= 2 ? 565000 : 570000;
    }
    
    invoice.push({
        name: name,
        qty: qty,
        price: finalPrice * qty
    });
    
    renderInvoice();
    closeModal();
    showNotification(`Added ${qty}x ${name} to cart`);
}

// Close modal when clicking outside
itemModal.addEventListener('click', (e) => {
    if (e.target === itemModal) {
        closeModal();
    }
});

// Add click effects to all buttons
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const btn = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }
});

// ========================================
// NOTIFICATION
// ========================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) scale(0.8);
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 5000;
        animation: popIn 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
        box-shadow: 0 5px 20px rgba(46, 204, 113, 0.5);
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification animations and click effects
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        from { transform: translateX(-50%) scale(0.8); opacity: 0; }
        to { transform: translateX(-50%) scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    button:active {
        transform: scale(0.95) !important;
    }
`;
document.head.appendChild(style);

// ========================================
// PDF GENERATION
// ========================================
pdfBtn.addEventListener("click", () => {
    if (invoice.length === 0) {
        alert("Cart is empty! Add items first.");
        return;
    }
    pdfForm.classList.add("show");
});

cancelPDF.addEventListener("click", () => {
    pdfForm.classList.remove("show");
});

confirmPDF.addEventListener("click", () => {
    const buyer = document.getElementById("buyerName").value.trim();
    const gang = document.getElementById("gangName").value.trim();
    const radio = document.getElementById("radioName").value.trim();
    
    if (!buyer || !gang || !radio) {
        alert("Please fill in all fields");
        return;
    }
    
    pdfForm.classList.remove("clear");
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const invoiceNumber = "CDF-" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const date = now.toLocaleDateString('en-US');
    const time = now.toLocaleTimeString('en-US');
    
    // Add logo
    const logo = new Image();
    logo.src = "images/logo.png";
    logo.onload = () => {
        doc.addImage(logo, "PNG", 15, 10, 25, 25);
        renderPDFContent();
    };
    logo.onerror = () => renderPDFContent();
    
    function renderPDFContent() {
        // Header - Left
        doc.setFontSize(10);
        doc.text("Welcome to", 15, 40);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("CASA DI FERRO", 15, 47);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Buyer: ${buyer}`, 15, 56);
        doc.text(`Gang: ${gang}`, 15, 62);
        doc.text(`Radio: ${radio}`, 15, 68);
        
        // Invoice Details - Right
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 195, 25, { align: "right" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice #: ${invoiceNumber}`, 195, 33, { align: "right" });
        doc.text(`Date: ${date}`, 195, 39, { align: "right" });
        doc.text(`Time: ${time}`, 195, 45, { align: "right" });
        
        // Divider
        doc.setDrawColor(201, 162, 77);
        doc.setLineWidth(0.5);
        doc.line(15, 75, 195, 75);
        
        // Table Header
        doc.setFillColor(201, 162, 77);
        doc.rect(15, 80, 180, 8, "F");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Item", 20, 85);
        doc.text("Qty", 100, 85);
        doc.text("Price", 145, 85);
        doc.text("Total", 185, 85);
        
        // Table Rows
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        
        let y = 95;
        invoice.forEach(item => {
            doc.text(item.name, 20, y);
            doc.text(String(item.qty), 100, y);
            doc.text((item.price / item.qty).toLocaleString() + "$", 145, y);
            doc.text(item.price.toLocaleString() + "$", 185, y);
            y += 8;
        });
        
        // Total
        y += 5;
        doc.setDrawColor(201, 162, 77);
        doc.line(15, y, 195, y);
        y += 10;
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(201, 162, 77);
        doc.text("TOTAL:", 140, y);
        doc.text(total.toLocaleString() + "$", 185, y);
        
        // Footer Logo
        doc.setDrawColor(201, 162, 77);
        doc.setLineWidth(1);
        doc.circle(160, y + 25, 15);
        doc.setLineWidth(0.5);
        doc.circle(160, y + 25, 12);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(201, 162, 77);
        doc.text("CASA DI", 160, y + 22, { align: "center" });
        doc.text("FERRO", 160, y + 27, { align: "center" });
        
        // Final message
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for shopping with us - Casa Di Ferro", 105, 280, { align: "center" });
        
        // Save
        doc.save(`invoice_${invoiceNumber}.pdf`);
        
        // Send Discord Webhook notification
        sendDiscordWebhook({
            invoiceNumber: invoiceNumber,
            buyer: buyer,
            gang: gang,
            radio: radio,
            items: [...invoice],
            total: total,
            date: date,
            time: time
        });
        
        // Clear form
        document.getElementById("buyerName").value = "";
        document.getElementById("gangName").value = "";
        document.getElementById("radioName").value = "";
        
        showNotification("Invoice downloaded successfully!");
    }
});

// ========================================
// PACKS (Bonus Feature)
// ========================================
const packs = [
    { name: "Pack N°1 – SMG Pack", price: 1375000 },
    { name: "Pack N°2 – Drugs Pack", price: 2500000 },
    { name: "Pack N°3 – Pistols Pack", price: 1225000 }
];

function addPackToInvoice(packNumber) {
    const pack = packs[packNumber - 1];
    if (!pack) return;
    
    invoice.push({
        name: pack.name,
        qty: 1,
        price: pack.price
    });
    
    renderInvoice();
showNotification(`Added ${pack.name} to cart`);
}

