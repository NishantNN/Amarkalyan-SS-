// Firebase and Cloudinary configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOskGbmFVPlHml61_SeUxNSHPDby5wUGc",
    authDomain: "amarkalyan-admin.firebaseapp.com",
    databaseURL: "https://amarkalyan-admin-default-rtdb.firebaseio.com",
    projectId: "amarkalyan-admin",
    storageBucket: "amarkalyan-admin.firebasestorage.app",
    messagingSenderId: "1040534177674",
    appId: "1:1040534177674:web:51b1f85fd85e33a53daa73",
    measurementId: "G-2Z1KZ13HGR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const staffRef = ref(db, "staff");

let staffData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Function to fetch staff data from Firebase
async function fetchStaff() {
    const snapshot = await get(staffRef);
    const staff = snapshot.val();

    if (staff) {
        staffData = Object.keys(staff).map(key => {
            return { id: key, ...staff[key] };
        });

        // Sort staff by rank in ascending order (lowest rank first)
        staffData.sort((a, b) => a.rank - b.rank);

        displayStaff(currentPage);
        displayPagination();
    }
}

// Function to display staff data on the current page
function displayStaff(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const staffToDisplay = staffData.slice(startIndex, endIndex);

    const staffList = document.getElementById("staffList");
    staffList.innerHTML = ""; // Clear current list

    staffToDisplay.forEach(staff => {
        const staffItem = document.createElement("div");
        staffItem.classList.add("staff-item");

        staffItem.innerHTML = `
            <img src="${staff.imageUrl}" alt="Staff Image">
            <div class="staff-info">
                <h3>${staff.name}</h3>
                <p><strong>Post:</strong> ${staff.post}</p>
                <p><strong>Phone:</strong> ${staff.phone}</p>
            </div>
        `;
        staffList.appendChild(staffItem);
    });
}

// Function to display pagination controls
function displayPagination() {
    const totalPages = Math.ceil(staffData.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Clear pagination controls

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.onclick = () => {
            currentPage--;
            displayStaff(currentPage);
            displayPagination();
        };
        pagination.appendChild(prevButton);
    }

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pageButton.onclick = () => {
            currentPage = i;
            displayStaff(currentPage);
            displayPagination();
        };
        pagination.appendChild(pageButton);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.onclick = () => {
            currentPage++;
            displayStaff(currentPage);
            displayPagination();
        };
        pagination.appendChild(nextButton);
    }
}

// Fetch and display staff when page loads
fetchStaff();