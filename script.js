let items = [];
let nextItemId = 1;

async function loadItems() {
    const response = await fetch("http://localhost:5000/items");
    items = await response.json();
    nextItemId = items[items.length - 1].id + 1;
    displayItems();
}

loadItems();

// Add this function to save items to the server
async function saveItemsToServer() {
    await fetch("http://localhost:5000/items", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
    });
}

function displayItems() {
    const itemBody = document.getElementById("itemBody");
    itemBody.innerHTML = "";

    items.forEach((item) => {
        const row = document.createElement("tr");

        const itemName = document.createElement("td");
        itemName.textContent = item.name;
        row.appendChild(itemName);

        const itemsForEnteredCost = document.createElement("td");
        row.appendChild(itemsForEnteredCost);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => openEditModal(item.id);
        const editCell = document.createElement("td");
        editCell.appendChild(editBtn);
        row.appendChild(editCell);

        itemBody.appendChild(row);
    });
}

function calculate() {
    const inputCost = document.getElementById("cost").value;
    items.forEach((item, index) => {
        const itemsForCost = inputCost / item.cost;
        const tableRow = document.getElementById("itemBody").rows[index];
        const itemsForEnteredCostCell = tableRow.cells[1];

        if (item.format === "fraction") {
            itemsForEnteredCostCell.textContent = floatToFraction(itemsForCost);
        } else {
            itemsForEnteredCostCell.textContent = itemsForCost.toFixed(1);
        }
    });
}

function floatToFraction(number) {
    const tolerance = 1.0e-6;
    const maxNumerator = 8;
    let h1 = 1;
    let h2 = 0;
    let k1 = 0;
    let k2 = 1;
    let b = 1 / number;

    do {
        b = 1 / b;
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = b - a;
    } while (Math.abs(number - h1 / k1) > number * tolerance && k1 <= maxNumerator);

    return h1 === 1 && k1 === 1 ? number.toFixed(0) : `${h1}/${k1}`;
}

function openAddModal() {
    document.getElementById("itemId").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemCost").value = "";
    document.getElementById("itemFormat").value = "fraction";
    document.getElementById("itemModal").style.display = "block";
}

function openEditModal(id) {
    const item = items.find((i) => i.id === id);
    document.getElementById("itemId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCost").value = item.cost;
    document.getElementById("itemFormat").value = item.format;
    document.getElementById("itemModal").style.display = "block";
}

function saveItem() {
    const id = parseInt(document.getElementById("itemId").value);
    const name = document.getElementById("itemName").value;
    const cost = parseFloat(document.getElementById("itemCost").value);
    const format = document.getElementById("itemFormat").value;

    if (!name || !cost) {
        alert("Please fill out all fields");
        return;
    }

    if (id) {
        const itemIndex = items.findIndex((item) => item.id === id);
        items[itemIndex] = { ...items[itemIndex], name, cost, format };
    } else {
        items.push({ id: nextItemId, name, cost, format });
        nextItemId++;
    }

    displayItems();
    closeItemModal();
    saveItemsToServer();
}

function closeItemModal() {
    document.getElementById("itemModal").style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.onclick = (event) => {
    if (event.target === document.getElementById("itemModal")) {
        closeItemModal();
    }
};

// Set up the close button in the modal
document.querySelector(".close").onclick = closeItemModal;

// Initialize the item display
displayItems();


