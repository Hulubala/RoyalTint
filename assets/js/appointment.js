// ===== APPOINTMENT MANAGEMENT SYSTEM - COMPACT & STABLE VERSION =====

// Sample Data
let appointments = [
  {
    id: 1,
    customerName: "Ahmad Ibrahim",
    phone: "012-3456789",
    carPlate: "WXY 1234",
    carModel: "Perodua Myvi",
    date: "2025-11-26",
    time: "10:00",
    branch: "melaka",
    package: "Premium Tint Package",
    status: "confirmed",
    notes: "Customer prefers darker shade"
  },
  {
    id: 2,
    customerName: "Sarah Lim",
    phone: "013-9876543",
    carPlate: "ABC 5678",
    carModel: "Honda Civic",
    date: "2025-11-27",
    time: "14:00",
    branch: "seremban",
    package: "Ultimate Tint Package",
    status: "pending",
    notes: ""
  },
  {
    id: 3,
    customerName: "Kumar Raj",
    phone: "016-2345678",
    carPlate: "DEF 9012",
    carModel: "Toyota Vios",
    date: "2025-11-25",
    time: "11:30",
    branch: "melaka",
    package: "Basic Tint Package",
    status: "completed",
    notes: "JPJ compliant specs required"
  },
  {
    id: 4,
    customerName: "Siti Aminah",
    phone: "019-8765432",
    carPlate: "GHI 3456",
    carModel: "Proton X50",
    date: "2025-11-28",
    time: "09:00",
    branch: "melaka",
    package: "Premium Tint Package",
    status: "confirmed",
    notes: "First time customer"
  },
  {
    id: 5,
    customerName: "David Tan",
    phone: "017-2468135",
    carPlate: "JKL 7890",
    carModel: "Mazda 3",
    date: "2025-11-20",
    time: "15:30",
    branch: "seremban",
    package: "Custom Package",
    status: "cancelled",
    notes: "Customer cancelled due to personal reasons"
  }
];

// Global Variables
let currentFilter = {
  status: 'all',
  date: 'all',
  branch: 'all',
  search: ''
};

let selectedAppointmentId = null;
let pendingStatusChange = null;

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  renderAppointments();
  updateStatistics();
  updateTabBadges();
  setupEventListeners();
  setTodayDate();
  setupClickOutsideListener();
});

// ===== SET TODAY'S DATE =====
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    dateInput.min = today;
  }
  const editDateInput = document.getElementById('editAppointmentDate');
  if (editDateInput) {
    editDateInput.min = today;
  }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Filter Tabs
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      currentFilter.status = this.dataset.status;
      renderAppointments();
    });
  });

  // Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      currentFilter.search = e.target.value.toLowerCase();
      renderAppointments();
    });
  }

  // Date Filter
  const dateFilter = document.getElementById('dateFilter');
  if (dateFilter) {
    dateFilter.addEventListener('change', function(e) {
      const value = e.target.value;
      if (value === 'custom') {
        document.getElementById('customDatePicker').style.display = 'block';
      } else {
        document.getElementById('customDatePicker').style.display = 'none';
        currentFilter.date = value;
        renderAppointments();
      }
    });
  }

  // Custom Date
  const customDate = document.getElementById('customDate');
  if (customDate) {
    customDate.addEventListener('change', function(e) {
      currentFilter.date = e.target.value;
      renderAppointments();
    });
  }

  // Status Filter
  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', function(e) {
      currentFilter.status = e.target.value;
      document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
      const activeTab = document.querySelector(`.filter-tab[data-status="${e.target.value}"]`);
      if (activeTab) {
        activeTab.classList.add('active');
      }
      renderAppointments();
    });
  }

  // Branch Filter
  const branchFilter = document.getElementById('branchFilter');
  if (branchFilter) {
    branchFilter.addEventListener('change', function(e) {
      currentFilter.branch = e.target.value;
      renderAppointments();
    });
  }

  // Reset Filter
  const resetFilter = document.getElementById('resetFilter');
  if (resetFilter) {
    resetFilter.addEventListener('click', resetFilters);
  }

  // Save New Appointment
  const saveBtn = document.getElementById('saveAppointment');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNewAppointment);
  }

  // Update Appointment
  const updateBtn = document.getElementById('updateAppointment');
  if (updateBtn) {
    updateBtn.addEventListener('click', updateAppointment);
  }

  // Edit from View Modal
  const editFromViewBtn = document.getElementById('editFromView');
  if (editFromViewBtn) {
    editFromViewBtn.addEventListener('click', function() {
      const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewAppointmentModal'));
      if (viewModal) {
        viewModal.hide();
      }
      openEditModal(selectedAppointmentId);
    });
  }

  // Confirm Status Change
  const confirmStatusBtn = document.getElementById('confirmStatusChange');
  if (confirmStatusBtn) {
    confirmStatusBtn.addEventListener('click', function() {
      if (pendingStatusChange) {
        executeStatusChange(pendingStatusChange.id, pendingStatusChange.newStatus);
        const modal = bootstrap.Modal.getInstance(document.getElementById('statusChangeModal'));
        if (modal) {
          modal.hide();
        }
      }
    });
  }

  // Confirm Delete
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
      executeDelete(selectedAppointmentId);
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      if (modal) {
        modal.hide();
      }
    });
  }

  // View Toggle
  const viewToggle = document.getElementById("viewToggle");
  if (viewToggle) {
    viewToggle.addEventListener("click", toggleView);
  }
}

// ===== CLICK OUTSIDE TO CLOSE DROPDOWNS =====
function setupClickOutsideListener() {
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.status-dropdown-wrapper')) {
      document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
  
  // Also close dropdown when scrolling
  window.addEventListener('scroll', function() {
    document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  }, true);
}

// ===== RESET FILTERS =====
function resetFilters() {
  currentFilter = {
    status: 'all',
    date: 'all',
    branch: 'all',
    search: ''
  };

  document.getElementById('searchInput').value = '';
  document.getElementById('dateFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';
  document.getElementById('branchFilter').value = 'all';
  document.getElementById('customDatePicker').style.display = 'none';

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.status === 'all') {
      tab.classList.add('active');
    }
  });

  renderAppointments();
  showToast('Filters reset', 'info');
}

// ===== RENDER APPOINTMENTS =====
function renderAppointments() {
  const container = document.getElementById("appointmentsList");
  if (!container) return;

  let filtered = filterAppointments();

  filtered.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateB - dateA;
  });

  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = 
      `Showing ${filtered.length} appointment${filtered.length !== 1 ? 's' : ''}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-calendar-x"></i>
        <h4>No appointments found</h4>
        <p>Try adjusting your filters or search terms</p>
      </div>`;
    return;
  }

  let output = '<div class="appointments-grid">';
  
  filtered.forEach(apt => {
    const dateLabel = getDateLabel(apt.date);
    const availableStatuses = getAvailableStatuses(apt.status);

    output += `
      <div class="appointment-card">
        <div class="card-body">
          <div class="appointment-header">
            <div class="customer-info">
              <h5>${apt.customerName}</h5>
              <div class="info-row">
                <i class="bi bi-telephone-fill"></i>
                <a href="tel:${apt.phone}" class="phone-link">${apt.phone}</a>
              </div>
            </div>
            <span class="status-badge status-${apt.status}">${apt.status}</span>
          </div>

          <div class="appointment-details">
            <div class="detail-item">
              <span class="detail-label">
                <i class="bi bi-calendar3"></i> Date
              </span>
              <span class="detail-value">
                ${formatDate(apt.date)}
                ${dateLabel ? `<span class="date-label">${dateLabel}</span>` : ''}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                <i class="bi bi-clock"></i> Time
              </span>
              <span class="detail-value">${formatTime(apt.time)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                <i class="bi bi-car-front-fill"></i> Vehicle
              </span>
              <span class="detail-value">${apt.carPlate} • ${apt.carModel}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                <i class="bi bi-geo-alt-fill"></i> Branch
              </span>
              <span class="detail-value">${formatBranch(apt.branch)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                <i class="bi bi-box-seam"></i> Package
              </span>
              <span class="detail-value">${apt.package}</span>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-action btn-view" onclick="viewAppointment(${apt.id})">
              <i class="bi bi-eye"></i> View
            </button>
            <button class="btn btn-action btn-edit" onclick="openEditModal(${apt.id})">
              <i class="bi bi-pencil"></i> Edit
            </button>
            
            ${apt.status !== 'completed' && apt.status !== 'cancelled' ? `
              <div class="status-dropdown-wrapper">
                <button class="btn btn-action btn-status" onclick="toggleStatusDropdown(event, ${apt.id})">
                  <i class="bi bi-arrow-repeat"></i> Status
                </button>
                <div class="status-dropdown-menu" id="status-dropdown-${apt.id}">
                  ${availableStatuses.map(s => `
                    <div class="status-option" onclick="changeStatus(${apt.id}, '${s.value}')">
                      <i class="bi ${s.icon}" style="color: ${s.color};"></i>
                      <span>${s.label}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <button class="btn btn-action btn-delete" onclick="openDeleteModal(${apt.id})" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>

        </div>
      </div>
    `;
  });

  output += '</div>';
  container.innerHTML = output;
}

// ===== GET AVAILABLE STATUSES =====
function getAvailableStatuses(currentStatus) {
  const allStatuses = [
    { value: 'pending', label: 'Set Pending', icon: 'bi-clock', color: '#ffc107' },
    { value: 'confirmed', label: 'Confirm', icon: 'bi-check-circle', color: '#4caf50' },
    { value: 'completed', label: 'Mark Completed', icon: 'bi-check-all', color: '#9e9e9e' },
    { value: 'cancelled', label: 'Cancel', icon: 'bi-x-circle', color: '#f44336' }
  ];

  return allStatuses.filter(s => s.value !== currentStatus);
}

// ===== TOGGLE STATUS DROPDOWN - STABLE POSITIONING =====
function toggleStatusDropdown(event, appointmentId) {
  event.stopPropagation();
  
  // Close all other dropdowns
  document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
    if (menu.id !== `status-dropdown-${appointmentId}`) {
      menu.classList.remove('show');
    }
  });

  // Toggle current dropdown
  const dropdown = document.getElementById(`status-dropdown-${appointmentId}`);
  
  if (!dropdown) return;

  // Simple toggle with CSS positioning (absolute, bottom: 100%)
  dropdown.classList.toggle('show');
}

// ===== FILTER APPOINTMENTS =====
function filterAppointments() {
  let filtered = [...appointments];

  if (currentFilter.status !== 'all') {
    filtered = filtered.filter(a => a.status === currentFilter.status);
  }

  if (currentFilter.date !== 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (currentFilter.date === 'today') {
      const todayStr = formatDateToISO(today);
      filtered = filtered.filter(a => a.date === todayStr);
    } else if (currentFilter.date === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = formatDateToISO(tomorrow);
      filtered = filtered.filter(a => a.date === tomorrowStr);
    } else if (currentFilter.date === 'week') {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      filtered = filtered.filter(a => {
        const aptDate = new Date(a.date);
        return aptDate >= today && aptDate <= weekEnd;
      });
    } else if (currentFilter.date === 'month') {
      const monthEnd = new Date(today);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      filtered = filtered.filter(a => {
        const aptDate = new Date(a.date);
        return aptDate >= today && aptDate <= monthEnd;
      });
    } else {
      filtered = filtered.filter(a => a.date === currentFilter.date);
    }
  }

  if (currentFilter.branch !== 'all') {
    filtered = filtered.filter(a => a.branch === currentFilter.branch);
  }

  if (currentFilter.search) {
    filtered = filtered.filter(a => 
      a.customerName.toLowerCase().includes(currentFilter.search) ||
      a.phone.toLowerCase().includes(currentFilter.search) ||
      a.carPlate.toLowerCase().includes(currentFilter.search) ||
      a.carModel.toLowerCase().includes(currentFilter.search)
    );
  }

  return filtered;
}

// ===== UPDATE STATISTICS =====
function updateStatistics() {
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const completed = appointments.filter(a => a.status === 'completed').length;

  const totalEl = document.getElementById("totalAppointments");
  const pendingEl = document.getElementById("pendingCount");
  const confirmedEl = document.getElementById("confirmedCount");
  const completedEl = document.getElementById("completedCount");

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (confirmedEl) confirmedEl.textContent = confirmed;
  if (completedEl) completedEl.textContent = completed;
}

// ===== UPDATE TAB BADGES =====
function updateTabBadges() {
  const all = appointments.length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  const badgeAll = document.getElementById('badge-all');
  const badgePending = document.getElementById('badge-pending');
  const badgeConfirmed = document.getElementById('badge-confirmed');
  const badgeCompleted = document.getElementById('badge-completed');
  const badgeCancelled = document.getElementById('badge-cancelled');

  if (badgeAll) badgeAll.textContent = all;
  if (badgePending) badgePending.textContent = pending;
  if (badgeConfirmed) badgeConfirmed.textContent = confirmed;
  if (badgeCompleted) badgeCompleted.textContent = completed;
  if (badgeCancelled) badgeCancelled.textContent = cancelled;
}

// ===== SAVE NEW APPOINTMENT =====
function saveNewAppointment() {
  const form = document.getElementById('appointmentForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const newAppointment = {
    id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
    customerName: document.getElementById('customerName').value,
    phone: document.getElementById('customerPhone').value,
    carPlate: document.getElementById('carPlate').value.toUpperCase(),
    carModel: document.getElementById('carModel').value,
    date: document.getElementById('appointmentDate').value,
    time: document.getElementById('appointmentTime').value,
    branch: document.getElementById('branch').value,
    package: document.getElementById('servicePackage').value,
    status: 'pending',
    notes: document.getElementById('notes').value
  };

  appointments.push(newAppointment);
  
  renderAppointments();
  updateStatistics();
  updateTabBadges();
  
  const modal = bootstrap.Modal.getInstance(document.getElementById('newAppointmentModal'));
  if (modal) {
    modal.hide();
  }
  form.reset();
  
  showToast('Appointment created successfully!', 'success');
}

// ===== VIEW APPOINTMENT (MODAL) =====
function viewAppointment(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  selectedAppointmentId = id;

  const content = `
    <div class="detail-section">
      <h6><i class="bi bi-person-circle"></i> Customer Information</h6>
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${apt.customerName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">
          <a href="tel:${apt.phone}" class="text-decoration-none" style="color: #FFD700;">${apt.phone}</a>
        </span>
      </div>
    </div>

    <div class="detail-section">
      <h6><i class="bi bi-car-front-fill"></i> Vehicle Information</h6>
      <div class="detail-row">
        <span class="detail-label">Car Model:</span>
        <span class="detail-value">${apt.carModel}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Car Plate:</span>
        <span class="detail-value"><strong>${apt.carPlate}</strong></span>
      </div>
    </div>

    <div class="detail-section">
      <h6><i class="bi bi-calendar-check"></i> Appointment Details</h6>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${formatDate(apt.date)} ${getDateLabel(apt.date) ? '(' + getDateLabel(apt.date) + ')' : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${formatTime(apt.time)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Branch:</span>
        <span class="detail-value">${formatBranch(apt.branch)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Service Package:</span>
        <span class="detail-value">${apt.package}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">
          <span class="status-badge status-${apt.status}">${apt.status}</span>
        </span>
      </div>
    </div>

    ${apt.notes ? `
    <div class="detail-section">
      <h6><i class="bi bi-sticky"></i> Special Notes</h6>
      <div class="alert alert-info mb-0">
        ${apt.notes}
      </div>
    </div>
    ` : ''}
  `;

  const contentEl = document.getElementById('viewAppointmentContent');
  if (contentEl) {
    contentEl.innerHTML = content;
  }
  
  const modal = new bootstrap.Modal(document.getElementById('viewAppointmentModal'));
  modal.show();
}

// ===== OPEN EDIT MODAL =====
function openEditModal(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  selectedAppointmentId = id;

  document.getElementById('editId').value = apt.id;
  document.getElementById('editCustomerName').value = apt.customerName;
  document.getElementById('editCustomerPhone').value = apt.phone;
  document.getElementById('editCarPlate').value = apt.carPlate;
  document.getElementById('editCarModel').value = apt.carModel;
  document.getElementById('editAppointmentDate').value = apt.date;
  document.getElementById('editAppointmentTime').value = apt.time;
  document.getElementById('editBranch').value = apt.branch;
  document.getElementById('editServicePackage').value = apt.package;
  document.getElementById('editNotes').value = apt.notes;

  const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
  modal.show();
}

// ===== UPDATE APPOINTMENT =====
function updateAppointment() {
  const form = document.getElementById('editAppointmentForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const id = parseInt(document.getElementById('editId').value);
  const apt = appointments.find(a => a.id === id);
  
  if (!apt) return;

  apt.customerName = document.getElementById('editCustomerName').value;
  apt.phone = document.getElementById('editCustomerPhone').value;
  apt.carPlate = document.getElementById('editCarPlate').value.toUpperCase();
  apt.carModel = document.getElementById('editCarModel').value;
  apt.date = document.getElementById('editAppointmentDate').value;
  apt.time = document.getElementById('editAppointmentTime').value;
  apt.branch = document.getElementById('editBranch').value;
  apt.package = document.getElementById('editServicePackage').value;
  apt.notes = document.getElementById('editNotes').value;

  renderAppointments();
  updateStatistics();
  
  const modal = bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal'));
  if (modal) {
    modal.hide();
  }
  
  showToast('Appointment updated successfully!', 'success');
}

// ===== CHANGE STATUS =====
function changeStatus(id, newStatus) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  const dropdown = document.getElementById(`status-dropdown-${id}`);
  if (dropdown) {
    dropdown.classList.remove('show');
  }

  selectedAppointmentId = id;
  pendingStatusChange = { id, newStatus };

  const currentStatusEl = document.getElementById('currentStatus');
  const newStatusEl = document.getElementById('newStatus');
  
  if (currentStatusEl) currentStatusEl.textContent = apt.status.toUpperCase();
  if (newStatusEl) newStatusEl.textContent = newStatus.toUpperCase();

  const modal = new bootstrap.Modal(document.getElementById('statusChangeModal'));
  modal.show();
}

function executeStatusChange(id, newStatus) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  const oldStatus = apt.status;
  apt.status = newStatus;

  renderAppointments();
  updateStatistics();
  updateTabBadges();

  showToast(`Status changed from ${oldStatus} to ${newStatus}`, 'success');
  pendingStatusChange = null;
}

// ===== OPEN DELETE MODAL =====
function openDeleteModal(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  selectedAppointmentId = id;

  const nameEl = document.getElementById('deleteCustomerName');
  const dateEl = document.getElementById('deleteAppointmentDate');
  
  if (nameEl) nameEl.textContent = apt.customerName;
  if (dateEl) {
    dateEl.textContent = `${formatDate(apt.date)} at ${formatTime(apt.time)}`;
  }

  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

// ===== DELETE APPOINTMENT =====
function executeDelete(id) {
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) return;

  appointments.splice(index, 1);

  renderAppointments();
  updateStatistics();
  updateTabBadges();

  showToast('Appointment deleted successfully', 'error');
  selectedAppointmentId = null;
}

// ===== TOGGLE VIEW =====
function toggleView() {
  const listView = document.getElementById("listView");
  const calendarView = document.getElementById("calendarView");
  const toggleBtn = document.getElementById("viewToggle");

  if (!listView || !calendarView || !toggleBtn) return;

  if (listView.style.display === "none") {
    listView.style.display = "block";
    calendarView.style.display = "none";
    toggleBtn.innerHTML = '<i class="bi bi-calendar3"></i><span>Calendar View</span>';
  } else {
    listView.style.display = "none";
    calendarView.style.display = "block";
    toggleBtn.innerHTML = '<i class="bi bi-list-ul"></i><span>List View</span>';
  }
}

// ===== UTILITY FUNCTIONS =====

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function formatBranch(branch) {
  return branch === 'melaka' ? 'Melaka' : 'Seremban 2';
}

function formatDateToISO(date) {
  return date.toISOString().split('T')[0];
}

function getDateLabel(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const aptDate = new Date(dateString);
  aptDate.setHours(0, 0, 0, 0);

  const diff = Math.floor((aptDate - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  if (diff < -1 && diff >= -7) return `${Math.abs(diff)} days ago`;
  return '';
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill'
  };

  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <i class="bi ${icons[type]} toast-icon"></i>
    <div class="toast-content">
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make functions globally available
window.viewAppointment = viewAppointment;
window.openEditModal = openEditModal;
window.changeStatus = changeStatus;
window.openDeleteModal = openDeleteModal;
window.toggleStatusDropdown = toggleStatusDropdown;
