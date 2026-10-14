// ==============================
// MEDLOGE TITLE SYSTEM
// ==============================
const welcomeTitle = document.getElementById("welcome-title");
// Fix: Only run this if the element actually exists on the page
if (welcomeTitle) {
    welcomeTitle.innerText = "Find a place you'll love in Enugu.";
}

// ==========================================
// MEDLOGE SYNCHRONIZED PROPERTY SAVED ENGINE
// ==========================================

const saveButtons = document.querySelectorAll(".save-button");
const toast = document.getElementById("toast-notification");
const STORAGE_SAVED_KEY = "medloge_saved_properties"; // Keep this key unified across files

function getSavedHouses() {
    const rawSaved = localStorage.getItem(STORAGE_SAVED_KEY);
    return rawSaved ? JSON.parse(rawSaved) : [];
}

if (saveButtons.length > 0) {
    const currentSavedList = getSavedHouses();

    // Check memory on load and style already-saved hearts
    saveButtons.forEach(button => {
        const houseId = button.getAttribute("data-house-id");
        if (currentSavedList.includes(houseId)) {
            button.classList.add("is-saved");
            button.textContent = "❤️";
        }
    });

    // Listen for safe, bubble-protected clicks
    saveButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // CRITICAL: Blocks accidental card navigation!
            
            const houseId = this.getAttribute("data-house-id");
            let savedList = getSavedHouses();

            if (this.classList.contains("is-saved")) {
                this.classList.remove("is-saved");
                this.textContent = "♡";
                savedList = savedList.filter(id => id !== houseId);
                showToastNotification("Removed from your collection 💔");
            } else {
                this.classList.add("is-saved");
                this.textContent = "❤️";
                savedList.push(houseId);
                showToastNotification("Saved to your collection! ❤️");
            }

            localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedList));
        });
    });
}

function showToastNotification(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show-toast");
    setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2500);
}

    // RENDER SYSTEM ON SAVED COLLECTION VIEW PAGE
if (window.location.pathname.includes("Saved.html")) {
    const savedHouses = getSavedHouses();
    const allCollectionCards = document.querySelectorAll(".house-card");

    allCollectionCards.forEach(card => {
        const id = card.getAttribute("data-house-id");
        if (!savedHouses.includes(id)) {
            card.style.display = "none";
        } else {
            card.style.display = "";
        }
    });

    const visibleCards = Array.from(allCollectionCards).filter(c => c.style.display !== "none");
    if (visibleCards.length === 0) {
        const container = document.querySelector(".house-listings") || document.body;
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "You haven't saved any apartments around UNTH yet.";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.padding = "40px 20px";
        container.appendChild(emptyMsg);
    }
}


const menuToggleBtn = document.getElementById("menu-toggle-btn");
const headerDropdown = document.getElementById("header-dropdown");

if (menuToggleBtn && headerDropdown){
    menuToggleBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        headerDropdown.classList.toggle("show-menu");
    });

    window.addEventListener("click", function () {
        if (headerDropdown.classList.contains("show-menu")) {
            headerDropdown.classList.remove("show-menu");
        }
    });
}

// =======================================================
// MEDLOGE HOUSE DATA (Temporary local database simulation)
// =======================================================
const ALL_MEDLOGE_HOUSES = [
    {
        id: "house-1",
        title: "Modern Student Apartment",
        type: "STUDENT APARTMENT",
        location: "📍 Near UNTH, Enugu",
        image: "images/house-main.jpg",
        details: ["🛏 2 Rooms", "💧 Water", "⚡ Electricity"],
        price: "Contact for Price"
    },
    {
        id: "house-2",
        title: "Student Self-Contain",
        type: "SELF CONTAIN",
        location: "📍 Enugu, near UNTH",
        image: "images/house-room.jpg",
        details: ["🛏 1 Room", "💧 Water", "🔌 Power"],
        price: "Contact for Price"
    }
];

// =======================================================
// SAVED HOUSES RENDERER SYSTEM
// =======================================================
document.addEventListener("DOMContentLoaded", function () {
    // Only run this logic if we are currently on the Saved.html page
    if (document.getElementById("saved-empty-state")) {
        renderSavedHouses();
    }
});

function renderSavedHouses() {
    // 1. Grab DOM elements
    const emptyState = document.getElementById("saved-empty-state");
    const listContainer = document.getElementById("saved-list-container");
    const cardsTarget = document.getElementById("dynamic-cards-target");
    const countBadge = document.getElementById("saved-count-num");
    const subCountBadge = document.getElementById("total-properties-count");

    // 2. Fetch saved list string from localStorage
    let savedIds = JSON.parse(localStorage.getItem("medlogeSavedHouses")) || [];

    // 3. Filter our main data array down to only matching items
    const savedHousesData = ALL_MEDLOGE_HOUSES.filter(house => savedIds.includes(house.id));
    const finalCount = savedHousesData.length;

    // 4. Update numerical counts across the UI
    countBadge.innerText = finalCount;
    subCountBadge.innerText = `${finalCount} ${finalCount === 1 ? 'property' : 'properties'}`;

    // 5. Toggle Empty State vs List View
    if (finalCount === 0) {
        emptyState.style.display = "block";
        listContainer.style.display = "none";
        cardsTarget.innerHTML = "";
        return;
    } else {
        emptyState.style.display = "none";
        listContainer.style.display = "block";
    }

    // 6. Build out HTML cards string dynamically
    let cardsHTML = "";
    
    savedHousesData.forEach(house => {
        // Map details array to safe HTML bullet tags
        const detailsHTML = house.details.map(detail => `<span>${detail}</span>`).join("");

        cardsHTML += `
            <article class="saved-house-card" data-id="${house.id}">
                <div class="saved-house-image">
                    <img src="${house.image}" alt="${house.title}">
                    <button 
                        type="button" 
                        class="saved-heart" 
                        onclick="removeHouseDirectly('${house.id}')"
                        aria-label="Remove house from saved houses"
                    >
                        ♥
                    </button>
                </div>
                <div class="saved-house-content">
                    <span class="listing-type">${house.type}</span>
                    <h3>${house.title}</h3>
                    <p class="saved-location">${house.location}</p>
                    <div class="saved-details">
                        ${detailsHTML}
                    </div>
                    <div class="saved-house-bottom">
                        <div>
                            <p>Rental Price</p>
                            <strong>${house.price}</strong>
                        </div>
                        <a href="House-Details.html" class="button">View House</a>
                    </div>
                </div>
            </article>
        `;
    });

    cardsTarget.innerHTML = cardsHTML;
}

// 7. Global function execution allowing users to click '♥' to remove cards instantly
window.removeHouseDirectly = function(houseId) {
    let savedIds = JSON.parse(localStorage.getItem("medlogeSavedHouses")) || [];
    
    // Remove selected item out of the storage list arrays
    savedIds = savedIds.filter(id => id !== houseId);
    
    // Save state update & re-render view seamlessly
    localStorage.setItem("medlogeSavedHouses", JSON.stringify(savedIds));
    renderSavedHouses();
};


// =====================================
// MEDLOGE LIVE SEARCH AND HOUSE FILTERS
// =====================================

const searchInput = document.getElementById("house-search");
const searchButton = document.getElementById("search-button");

const houseTypeFilter = document.getElementById("house-type");
const priceFilter = document.getElementById("price-range");
const distanceFilter = document.getElementById("distance");
const applyFiltersButton = document.getElementById("apply-filters");

const houseCards = document.querySelectorAll(".house-card");

function filterHouses() {
    if (!searchInput) return;

    const searchText = searchInput.value.trim().toLowerCase();

    const selectedType = houseTypeFilter?.value || "all";
    const selectedPrice = priceFilter?.value || "all";
    const selectedDistance = distanceFilter?.value || "all";

    houseCards.forEach(function (card) {


        // Count the properties that remain visible
    const visibleCount = Array.from(houseCards).filter(function (card) {
        return card.style.display !== "none";
    }).length;

         // Update the result count
    const resultCount = document.getElementById("house-result-count");

    if (resultCount) {
        resultCount.innerText =
            visibleCount === 1
                ? "1 property found"
                : `${visibleCount} properties found`;
    }

// Show the empty state when no properties match
    const noHousesFound = document.getElementById("no-houses-found");

    if (noHousesFound) {
        noHousesFound.hidden = visibleCount !== 0;
    }





        const houseInformation = card.innerText.toLowerCase();

        const houseType = card.dataset.houseType || "";
        const price = Number(card.dataset.price);
        const distance = Number(card.dataset.distanceKm);

        // Search by property name, location, or visible details
        const matchesSearch =
            houseInformation.includes(searchText);

        // Filter by property type
        const matchesType =
            selectedType === "all" ||
            houseType === selectedType;

        // Filter by price
        let matchesPrice = selectedPrice === "all";

        if (selectedPrice !== "all" && card.dataset.price !== "") {
            if (selectedPrice === "under-100k") {
                matchesPrice = price < 100000;
            } else if (selectedPrice === "100k-200k") {
                matchesPrice = price >= 100000 && price <= 200000;
            } else if (selectedPrice === "200k-300k") {
                matchesPrice = price > 200000 && price <= 300000;
            } else if (selectedPrice === "over-300k") {
                matchesPrice = price > 300000;
            }
        }

        // Filter by distance
        const matchesDistance =
            selectedDistance === "all" ||
            (
                card.dataset.distanceKm !== "" &&
                Number.isFinite(distance) &&
                distance <= Number(selectedDistance)
            );

        // A property must match every selected condition
        const shouldShow =
            matchesSearch &&
            matchesType &&
            matchesPrice &&
            matchesDistance;

        card.style.display = shouldShow ? "" : "none";
    });
}

// LIVE SEARCH: update results while typing
if (searchInput) {
    searchInput.addEventListener("input", filterHouses);
}

// Search button still works
if (searchButton) {
    searchButton.addEventListener("click", filterHouses);
}

// Enter key works too
if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            filterHouses();
        }
    });
}

// Apply selected filters
if (applyFiltersButton) {
    applyFiltersButton.addEventListener("click", filterHouses);
}

// Update immediately when a dropdown changes
[houseTypeFilter, priceFilter, distanceFilter].forEach(function (filter) {
    if (filter) {
        filter.addEventListener("change", filterHouses);
    }
});

// Reset search and all filters

const resetSearchButton = document.getElementById("reset-house-search");

if (resetSearchButton) {
    resetSearchButton.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        if (houseTypeFilter) houseTypeFilter.value = "all";
        if (priceFilter) priceFilter.value = "all";
        if (distanceFilter) distanceFilter.value = "all";

        filterHouses();
    });
}

const inspectionForm = document.getElementById("inspection-form");

if (inspectionForm) {

    const dateInput = document.getElementById("inspection-date");

    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        dateInput.min = `${year}-${month}-${day}`;
    }

    inspectionForm.addEventListener("submit", function (event) {
        // Stop page reload immediately
        event.preventDefault();

        // 1. Get elements safely (Defensive Coding)
        const nameEl = document.getElementById("full-name");
        const phoneEl = document.getElementById("phone");
        const dateEl = document.getElementById("inspection-date");
        const timeEl = document.getElementById("inspection-time");
        const messageEl = document.getElementById("message");

        // 2. Extract values cleanly if they exist
        const fullName = nameEl ? nameEl.value.trim() : "";
        const phone = phoneEl ? phoneEl.value.trim() : "";
        const inspectionDate = dateEl ? dateEl.value : "";
        const inspectionTime = timeEl ? timeEl.value : "";

        // 3. Custom Validations
        if (fullName.length < 2) {
            alert("Please enter your full name.");
            return; 
        }

        // FIXED: Cleaned regular expression pattern anchor (\$)
        const phonePattern = /^\+?[0-9\s()-]{7,20}\$/;

        if (!phonePattern.test(phone) || phone.replace(/\D/g, "").length < 7) {
            alert("Please enter a valid phone number.");
            return; 
        }

        if (dateInput && inspectionDate < dateInput.min) {
            alert("Please choose today or a future date.");
            return; 
        }

        const inspectionMethod = document.querySelector('input[name="inspectionMethod"]:checked');

        // 4. Package Data Structure
        const inspectionDetails = {
            fullName: fullName,
            phone: phone,
            date: inspectionDate,
            time: inspectionTime,
            method: inspectionMethod ? inspectionMethod.value : "Not selected",
            message: messageEl ? messageEl.value.trim() : "",
            bookingId: "MED-" + Date.now()
        };

        // 5. Save securely to browser locker
        localStorage.setItem("medlogeLatestInspection", JSON.stringify(inspectionDetails));

        console.log("Saved successfully!");

        // 6. REDIRECT: Double check if your file is "Success.html" or "Inspection-Success.html"!
        window.location.href = "Inspection-Success.html";
    }); 
}

// ==========================================
// MEDLOGE SUCCESS SCREEN RENDER LAYER
// ==========================================

if (window.location.pathname.includes("Inspection-Success.html")) {
    
    // 1. Open the browser memory drawer
    const savedDataRaw = localStorage.getItem("medlogeLatestInspection");

    if (savedDataRaw) {
        // 2. Unpack the text string back into a real JavaScript data object
        const bookingDetails = JSON.parse(savedDataRaw);

        // --- DISPLAY THE NAME ---
        const nameDisplayElement = document.getElementById("student-name");
        if (nameDisplayElement && bookingDetails.fullName) {
            nameDisplayElement.textContent = bookingDetails.fullName;
        }

        // --- DISPLAY THE DATE ---
        const dateElement = document.getElementById("display-date");
        if (dateElement && bookingDetails.date) {
            // Convert standard computer dates (YYYY-MM-DD) into a nice readable string
            const rawDate = new Date(bookingDetails.date);
            const formattingOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            
            // Displays cleanly like: "Friday, October 16, 2026"
            dateElement.textContent = rawDate.toLocaleDateString('en-NG', formattingOptions);
        }

        // --- DISPLAY THE TIME ---
        const timeElement = document.getElementById("display-time");
        if (timeElement && bookingDetails.time) {
            // Capitalize the first letter smoothly (e.g., 'morning' becomes 'Morning')
            const cleanTimeText = bookingDetails.time.charAt(0).toUpperCase() + bookingDetails.time.slice(1);
            timeElement.textContent = cleanTimeText;
        }

        // --- DISPLAY THE METHOD ---
        const methodElement = document.getElementById("display-method");
        if (methodElement && bookingDetails.method) {
            methodElement.textContent = bookingDetails.method;
        }

        // --- DISPLAY THE OPTIONAL MESSAGE ---
        const messageElement = document.getElementById("display-message");
        if (messageElement) {
            // If the student didn't type a message, default cleanly to "None provided"
            messageElement.textContent = bookingDetails.message || "None provided";
        }

        console.log("Summary details loaded fully!");

    } else {
        console.log("No storage data located for this interface rendering sequence.");
    }
}





    