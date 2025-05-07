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
  const noticesRef = ref(db, 'notice');
  
  let noticesArray = [];
  const noticesPerPage = 5;
  let currentPage = 1;
  
  // Display Notices
  function fetchNotices() {
    get(noticesRef).then((snapshot) => {
      const noticesList = document.getElementById("notices-list");
      noticesList.innerHTML = '';
  
      if (snapshot.exists()) {
        const notices = snapshot.val();
        noticesArray = Object.entries(notices).sort((a, b) => new Date(b[1].Timestamp) - new Date(a[1].Timestamp));
        renderPage(currentPage);
        renderPagination();
      } else {
        noticesList.innerHTML = "<p>No notices available.</p>";
      }
    }).catch((error) => {
      console.error("Error fetching notices:", error);
    });
  }
  
  function renderPage(page) {
    const noticesList = document.getElementById("notices-list");
    noticesList.innerHTML = '';
  
    const start = (page - 1) * noticesPerPage;
    const end = start + noticesPerPage;
    const pageNotices = noticesArray.slice(start, end);
  
    pageNotices.forEach(([key, notice]) => {
      const container = document.createElement("div");
      container.className = "notice-container animate-notice";
      container.innerHTML = `
        <div class="notice-title">${notice.Title}</div>
        <div class="notice-desc">${notice.Description}</div>
        <div class="notice-time">Posted on: ${new Date(notice.Timestamp).toLocaleString()}</div>
        ${notice.PDFUrl ? `<a href="${notice.PDFUrl}" target="_blank" class="pdf-button">Download PDF</a>` : ''}
      `;
      noticesList.appendChild(container);
    });
  }
  
  function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = '';
    const totalPages = Math.ceil(noticesArray.length / noticesPerPage);
  
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage(currentPage);
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      pagination.appendChild(btn);
    }
  }
  
  // Run on page load
  fetchNotices();
