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
(function () {
  // Active page highlighting
  const currentPath = window.location.pathname;
  const currentPage =
    currentPath.substring(currentPath.lastIndexOf("/") + 1).replace(".html", "") ||
    "index";

  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });

  document.querySelectorAll(".menu-item[data-page]").forEach((item) => {
    if (item.getAttribute("data-page") === currentPage) {
      item.classList.add("active");
    }
  });

  // Submenu toggle - SIMPLE VERSION
  const productMenu = document.getElementById("productManagementMenu");

  if (productMenu) {
    const menuLink = productMenu.querySelector(".menu-link");

    menuLink.addEventListener("click", function (e) {
      e.preventDefault();
      productMenu.classList.toggle("open");
    });
  }
})();

function initializeSidebar() {
  // Wait for sidebar to load
  setTimeout(() => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");
    const submenuTriggers = document.querySelectorAll(
      ".has-submenu > a, .has-submenu > .menu-link"
    );

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
  }, 100);
}

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
  // Profile dropdown (can be extended)
  setTimeout(() => {
    const profileMenu = document.getElementById("profileMenu");
    if (profileMenu) {
      profileMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        // Add dropdown functionality here if needed
        console.log("Profile clicked");
      });
    }
  }, 100);
}

// ===== RESTORE USER PREFERENCES =====
function restoreUserPreferences() {
  setTimeout(() => {
    const sidebar = document.querySelector(".sidebar");
    const collapsed = localStorage.getItem("sidebar-collapsed");
    
    if (collapsed === "1" && sidebar) {
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
    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
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