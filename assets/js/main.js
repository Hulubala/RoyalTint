// ===== ROYAL TINT DASHBOARD - MAIN JAVASCRIPT =====

// ===== INITIALIZE APP =====
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  initializeSidebar();
  initializeNavbar();
  restoreUserPreferences();
});

// ===== LOAD COMPONENTS =====
async function loadComponents() {
  const components = [
    { id: "navbar", file: "navbar.html" },
    { id: "sidebar", file: "sidebar.html" },
    { id: "footer", file: "footer.html" }
  ];
  
  for (const component of components) {
    const element = document.getElementById(component.id);
    if (!element) continue;
    
    try {
      const response = await fetch(`components/${component.file}`);
      if (!response.ok) throw new Error(`Failed to load ${component.file}`);
      element.innerHTML = await response.text();
      
      // Execute any scripts in the loaded component
      const scripts = element.getElementsByTagName('script');
      for (let script of scripts) {
        eval(script.innerHTML);
      }
    } catch (error) {
      console.error(`❌ Error loading ${component.file}:`, error);
    }
  }
}

// ===== SIDEBAR FUNCTIONALITY =====
function initializeSidebar() {
  // Wait for sidebar to load
  setTimeout(() => {
    console.log('🟢 Initializing sidebar...');
    
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");
    
    // ===== ACTIVE PAGE HIGHLIGHTING - MOVED HERE =====
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const currentPage = currentFile.replace('.html', '');
    
    // Remove all active classes first
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    
    let found = false;
    
    // Highlight main menu items
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
      if (item.getAttribute('data-page') === currentPage) {
        item.classList.add('active');
        found = true;

        if (item.classList.contains('has-submenu')) {
          item.classList.add('open');
        }
      }
    });

    // Highlight submenu items
    document.querySelectorAll('.submenu li[data-page]').forEach(item => {
      if (item.getAttribute('data-page') === currentPage) {
        item.classList.add('active');

        const parent = item.closest('.has-submenu');
        if (parent) parent.classList.add('open');

        found = true;
      }
    });
    
    if (!found) {
      console.log('⚠️ No matching menu item found for:', currentPage);
    }
    // ===== END ACTIVE PAGE HIGHLIGHTING =====
    
    // Toggle sidebar collapse
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sidebar.classList.toggle("collapsed");

        // Toggle body class
        document.body.classList.toggle("sidebar-collapsed");

        // Save preference
        const isCollapsed = sidebar.classList.contains("collapsed");
        localStorage.setItem("sidebar-collapsed", isCollapsed ? "1" : "0");
      });
    }

    // Handle submenu toggles
    const submenuTriggers = document.querySelectorAll(
      ".has-submenu > a, .has-submenu > .menu-link"
    );
    
    submenuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const parent = trigger.closest(".has-submenu");

        // Close all other submenus
        document.querySelectorAll(".has-submenu").forEach((item) => {
          if (item !== parent) {
            item.classList.remove("open");
          }
        });

        // Toggle current submenu
        parent.classList.toggle("open");
      });
    });
    
    console.log('✅ Sidebar initialized');
  }, 100);
}

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
  setTimeout(() => {
    console.log('🟢 Initializing navbar...');
    
    // Profile dropdown toggle
    const profileMenu = document.getElementById("profileMenu");
    const profileDropdown = document.getElementById("profileDropdown");
    const notificationIcon = document.getElementById("notificationIcon");
    const notificationDropdown = document.getElementById("notificationDropdown");
    
    if (profileMenu && profileDropdown) {
      profileMenu.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (notificationDropdown) notificationDropdown.classList.remove("show");

        const isShowing = profileDropdown.classList.contains('show');
        const arrow = profileMenu.querySelector('.dropdown-arrow');
        
        profileDropdown.classList.toggle("show", !isShowing);
        if (arrow) arrow.style.transform = isShowing ? "rotate(0deg)" : "rotate(180deg)";
      });
    }
        
    // === NOTIFICATION DROPDOWN ===
    if (notificationIcon && notificationDropdown) {
      notificationIcon.addEventListener("click", function (e) {
        e.stopPropagation();

        if (profileDropdown) {
          profileDropdown.classList.remove("show");
          const arrow = profileMenu.querySelector(".dropdown-arrow");
          if (arrow) arrow.style.transform = "rotate(0deg)";
        }

        notificationDropdown.classList.toggle("show");
      });
    }

    // === CLICK NOTIFICATION ITEM ===
    document.querySelectorAll(".notification-item").forEach(item => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        this.classList.remove("unread");
        updateNotificationCount();

        const id = this.getAttribute("data-appointment");
        if (id) window.location.href = `appointments.html?id=${id}`;
      });
    });

    // === MARK ALL READ ===
    const markAllRead = document.getElementById("markAllRead");
    if (markAllRead) {
      markAllRead.addEventListener("click", function (e) {
        e.stopPropagation();
        document.querySelectorAll(".notification-item.unread")
          .forEach(item => item.classList.remove("unread"));

        updateNotificationCount();
      });
    }

    // === UPDATE BADGE ===
    function updateNotificationCount() {
      const unread = document.querySelectorAll(".notification-item.unread").length;
      const badge = document.getElementById("notificationCount");

      if (!badge) return;

      if (unread > 0) {
        badge.textContent = unread;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }

    // === CLICK OUTSIDE TO CLOSE ===
    document.addEventListener("click", function (e) {
      const profileWrap = document.querySelector(".user-profile-wrapper");
      const notifWrap = document.querySelector(".notification-wrapper");

      if (profileWrap && !profileWrap.contains(e.target) && profileDropdown) {
        profileDropdown.classList.remove("show");
        const arrow = profileMenu.querySelector(".dropdown-arrow");
        if (arrow) arrow.style.transform = "rotate(0deg)";
      }

      if (notifWrap && !notifWrap.contains(e.target) && notificationDropdown) {
        notificationDropdown.classList.remove("show");
      }
    });

    console.log("✅ Navbar initialized");
  }, 100);
}

// ===== RESTORE USER PREFERENCES =====
function restoreUserPreferences() {
  setTimeout(() => {
    const sidebar = document.querySelector(".sidebar");
    if (localStorage.getItem("sidebar-collapsed") === "1") {
      sidebar.classList.add("collapsed");
      document.body.classList.add("sidebar-collapsed");
    }
  }, 150);
}

// ===== LOGOUT FUNCTIONALITY =====
function handleLogout(event) {
  event.preventDefault();

  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    sessionStorage.clear();
    showNotification("Logging out... Goodbye!", "success");
    setTimeout(() => (window.location.href = "login.html"), 1500);
  }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#FFD700'};
    color: ${type === 'info' ? '#000' : '#fff'};
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function getNotificationIcon(type) {
  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠"
  };
  return icons[type] || icons.info;
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
  return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== EXPOSE GLOBAL FUNCTIONS =====
window.handleLogout = handleLogout;
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatTime = formatTime;
