import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
    import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDOskGbmFVPlHml61_SeUxNSHPDby5wUGc",
      authDomain: "amarkalyan-admin.firebaseapp.com",
      databaseURL: "https://amarkalyan-admin-default-rtdb.firebaseio.com",
      projectId: "amarkalyan-admin",
      storageBucket: "amarkalyan-admin.appspot.com",
      messagingSenderId: "1040534177674",
      appId: "1:1040534177674:web:51b1f85fd85e33a53daa73"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const imagesRef = ref(db, "gallery");

    let allImages = [];
    let currentPage = 1;
    const imagesPerPage = 12;
    let currentImageIndex = -1;

    function displayImages() {
      get(imagesRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        
        allImages = Object.values(snapshot.val()).sort((a, b) => b.Timestamp - a.Timestamp);
        renderPage();
      });
    }

    function renderPage() {
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = "";

      const start = (currentPage - 1) * imagesPerPage;
      const paginatedImages = allImages.slice(start, start + imagesPerPage);

      paginatedImages.forEach((image, index) => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        const img = document.createElement("img");
        img.src = image.ImageUrl;
        img.onclick = () => openModal(start + index); // Open modal with correct global index

        const desc = document.createElement("div");
        desc.classList.add("description");
        desc.textContent = image.Description;

        item.appendChild(img);
        item.appendChild(desc);
        gallery.appendChild(item);
      });

      document.getElementById("pageNumber").textContent = currentPage;

      document.getElementById("prevPage").disabled = (currentPage === 1);
      document.getElementById("nextPage").disabled = (currentPage * imagesPerPage >= allImages.length);
    }

    // Open modal and display image
    function openModal(index) {
      currentImageIndex = index;
      const modal = document.getElementById("imageModal");
      const modalImage = document.getElementById("modalImage");
      modal.style.display = "flex";
      modal.style.opacity = 1;
      modalImage.src = allImages[currentImageIndex].ImageUrl;
    }

    // Close the modal
    document.getElementById("closeModal").addEventListener("click", () => {
      const modal = document.getElementById("imageModal");
      modal.style.opacity = 0;
      setTimeout(() => modal.style.display = "none", 300); // Wait for transition before hiding
    });

    // Close modal if user clicks outside the modal content
    document.getElementById("imageModal").addEventListener("click", (event) => {
      if (event.target === document.getElementById("imageModal")) {
        const modal = document.getElementById("imageModal");
        modal.style.opacity = 0;
        setTimeout(() => modal.style.display = "none", 300);
      }
    });

    // Navigate to the previous image
    document.getElementById("prevImage").addEventListener("click", () => {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        document.getElementById("modalImage").src = allImages[currentImageIndex].ImageUrl;
      }
    });

    // Navigate to the next image
    document.getElementById("nextImage").addEventListener("click", () => {
      if (currentImageIndex < allImages.length - 1) {
        currentImageIndex++;
        document.getElementById("modalImage").src = allImages[currentImageIndex].ImageUrl;
      }
    });

    // Pagination Buttons
    document.getElementById("prevPage").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
      if (currentPage * imagesPerPage < allImages.length) {
        currentPage++;
        renderPage();
      }
    });

    displayImages();
