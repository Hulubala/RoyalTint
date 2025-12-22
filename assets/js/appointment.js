// ===================================================
// ROYAL TINT - APPOINTMENT MANAGEMENT SYSTEM
// COMPLETE VERSION - All Modals Fixed
// ===================================================

// ===== SAMPLE DATA =====
let appointments = [
  {
    id: 1,
    customerName: "Ahmad Ibrahim",
    phone: "012-3456789",
    carPlate: "WXY 1234",
    carModel: "Perodua Myvi",
    date: "2024-12-26",
    time: "10:00",
    branch: "melaka",
    package: "Premium Tint Package",
    status: "confirmed",
    type: "scheduled",  // scheduled or walk-in
    notes: "Customer prefers darker shade"
  },
  {
    id: 2,
    customerName: "Sarah Lim",
    phone: "013-9876543",
    carPlate: "ABC 5678",
    carModel: "Honda Civic",
    date: "2024-12-27",
    time: "14:00",
    branch: "seremban",
    package: "Ultimate Tint Package",
    status: "pending",
    type: "scheduled",
    notes: ""
  },
  {
    id: 3,
    customerName: "Kumar Raj",
    phone: "016-2345678",
    carPlate: "DEF 9012",
    carModel: "Toyota Vios",
    date: "2024-12-25",
    time: "11:30",
    branch: "melaka",
    package: "Basic Tint Package",
    status: "completed",
    type: "walk-in",
    notes: "JPJ compliant specs required"
  },
  {
    id: 4,
    customerName: "Siti Aminah",
    phone: "019-8765432",
    carPlate: "GHI 3456",
    carModel: "Proton X50",
    date: "2024-12-28",
    time: "09:00",
    branch: "melaka",
    package: "Premium Tint Package",
    status: "confirmed",
    type: "walk-in",
    notes: "First time customer"
  },
  {
    id: 5,
    customerName: "David Tan",
    phone: "017-2468135",
    carPlate: "JKL 7890",
    carModel: "Mazda 3",
    date: "2024-12-20",
    time: "15:30",
    branch: "seremban",
    package: "Custom Package",
    status: "cancelled",
    type: "scheduled",
    notes: "Customer cancelled due to personal reasons"
  }
];

// ===== GLOBAL VARIABLES =====
let currentFilter = {
  status: 'all',
  date: 'all',
  search: '',
  type: 'all'  // all, walk-in, or scheduled
};

let selectedAppointmentId = null;
let pendingStatusChange = null;

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  console.log('🟢 Appointment system initializing...');
  
  // CRITICAL: Force hide all modals on page load
  forceHideAllModals();
  
  renderAppointments();
  updateStatistics();
  updateTabBadges();
  setupEventListeners();
  setTodayDate();
  setupClickOutsideListener();
  
  console.log('✅ Appointment system initialized');
});

// ===== FORCE HIDE ALL MODALS ON PAGE LOAD =====
function forceHideAllModals() {
  console.log('🔒 Force hiding all modals...');
  
  // Hide all modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
  });
  
  // Remove any existing backdrops
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.remove();
  });
  
  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  
  console.log('✅ All modals hidden on page load');
}

// ===== MODAL CONFIGURATION =====
const FORCE_MANUAL_MODALS = ['viewAppointmentModal', 'editAppointmentModal'];

// ===== UNIVERSAL MODAL OPENER =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`❌ Modal ${modalId} not found`);
    return;
  }
  
  console.log(`📱 Opening modal: ${modalId}`);
  
  // Close any other open modals first
  document.querySelectorAll('.modal.show').forEach(m => {
    if (m.id !== modalId) {
      closeModal(m);
    }
  });
  
  // Force manual opening for View and Edit modals (more reliable)
  if (FORCE_MANUAL_MODALS.includes(modalId)) {
    console.log(`🔧 Using manual method for ${modalId} (forced)`);
    openModalManually(modal);
    return;
  }
  
  // First, ensure the modal is clean (no existing show classes)
  modal.classList.remove('show');
  modal.style.display = 'none';
  
  // Try Bootstrap first for other modals
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    try {
      // Dispose of any existing instance
      let existingInstance = bootstrap.Modal.getInstance(modal);
      if (existingInstance) {
        existingInstance.dispose();
      }
      
      // Create new instance and show
      const bsModal = new bootstrap.Modal(modal, {
        backdrop: true,
        keyboard: true,
        focus: true
      });
      bsModal.show();
      console.log(`✅ Modal ${modalId} opened via Bootstrap`);
    } catch (error) {
      console.log(`⚠️ Bootstrap failed for ${modalId}:`, error);
      console.log(`Using manual method instead`);
      openModalManually(modal);
    }
  } else {
    console.log(`📱 Bootstrap not available, using manual method`);
    openModalManually(modal);
  }
}

// ===== MANUAL MODAL OPEN =====
function openModalManually(modal) {
  console.log(`🔧 Opening modal manually: ${modal.id}`);
  
  // Clean slate - remove any existing classes/styles
  modal.classList.remove('show', 'fade');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  
  // Remove any existing backdrops
  document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
  
  // Small delay for clean slate
  setTimeout(() => {
    // Set up modal
    modal.classList.add('fade');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
    modal.removeAttribute('aria-hidden');
    
    // Add body classes
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade';
    document.body.appendChild(backdrop);
    
    // Trigger show animation
    setTimeout(() => {
      modal.classList.add('show');
      backdrop.classList.add('show');
      console.log(`✅ Modal ${modal.id} opened manually with backdrop`);
    }, 50);
  }, 50);
}

// ===== UNIVERSAL MODAL CLOSER =====
function closeModal(modal) {
  if (!modal) return;
  
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
      return;
    }
  }
  
  // Manual close
  modal.classList.remove('show');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.remove();
  });
}

// ===== CLOSE ALL MODALS =====
function closeAllModals() {
  document.querySelectorAll('.modal.show').forEach(modal => {
    closeModal(modal);
  });
}

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

// ===== RESET NEW APPOINTMENT FORM =====
function resetNewAppointmentForm() {
  // Reset the entire form
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.reset();
  }
  
  // Clear all input fields explicitly
  const fields = [
    'customerName',
    'customerPhone',
    'carPlate',
    'carModel',
    'appointmentDate',
    'appointmentTime',
    'notes'
  ];
  
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = '';
    }
  });
  
  // Reset dropdowns to default
  const branch = document.getElementById('branch');
  if (branch) branch.value = 'melaka';
  
  const servicePackage = document.getElementById('servicePackage');
  if (servicePackage) servicePackage.value = 'Basic Tint Package';
  
  // Reset appointment type to Walk-In (default)
  const walkInRadio = document.getElementById('typeWalkIn');
  if (walkInRadio) {
    walkInRadio.checked = true;
  }
  
  // Set minimum date to today
  setTodayDate();
  
  console.log('✅ New appointment form reset to defaults');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Appointment Type Tabs
  document.querySelectorAll(".type-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".type-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      currentFilter.type = this.dataset.type;
      // Sync with dropdown filter
      const typeFilterDropdown = document.getElementById('typeFilter');
      if (typeFilterDropdown) {
        typeFilterDropdown.value = this.dataset.type;
      }
      renderAppointments();
    });
  });

  // Filter Tabs (Status)
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      currentFilter.status = this.dataset.status;
      renderAppointments();
    });
  });

  // Modal reset handlers
  const newAppointmentModal = document.getElementById('newAppointmentModal');
  if (newAppointmentModal) {
    newAppointmentModal.addEventListener('show.bs.modal', () => {
      resetNewAppointmentForm();
    });
  }
  
  // Also reset when modal is closed/cancelled
  const cancelButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
  cancelButtons.forEach(btn => {
    if (btn.closest('#newAppointmentModal')) {
      btn.addEventListener('click', () => {
        setTimeout(() => resetNewAppointmentForm(), 300);
      });
    }
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

  // Type Filter (dropdown)
  const typeFilter = document.getElementById('typeFilter');
  if (typeFilter) {
    typeFilter.addEventListener('change', function(e) {
      currentFilter.type = e.target.value;
      // Update type tabs to match
      document.querySelectorAll('.type-tab').forEach(tab => tab.classList.remove('active'));
      const activeTab = document.querySelector(`.type-tab[data-type="${e.target.value}"]`);
      if (activeTab) {
        activeTab.classList.add('active');
      }
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

  // NEW APPOINTMENT BUTTON - Universal handler
  const newAppointmentBtn = document.querySelector('[data-bs-target="#newAppointmentModal"]');
  if (newAppointmentBtn) {
    newAppointmentBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openModal('newAppointmentModal');
    });
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
      closeModal(document.getElementById('viewAppointmentModal'));
      setTimeout(() => openEditModal(selectedAppointmentId), 300);
    });
  }

  // Confirm Status Change
  const confirmStatusBtn = document.getElementById('confirmStatusChange');
  if (confirmStatusBtn) {
    confirmStatusBtn.addEventListener('click', function() {
      if (pendingStatusChange) {
        executeStatusChange(pendingStatusChange.id, pendingStatusChange.newStatus);
        closeModal(document.getElementById('statusChangeModal'));
      }
    });
  }

  // Confirm Delete
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
      executeDelete(selectedAppointmentId);
      closeModal(document.getElementById('deleteModal'));
    });
  }

  // UNIVERSAL MODAL CLOSE HANDLERS
  // Close when clicking backdrop
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
      closeAllModals();
    }
  });

  // Close when clicking X or Cancel buttons
  document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Close with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
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
  
  window.addEventListener('scroll', function() {
    document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  }, true);
}

// ===== RESET FILTERS =====
function resetFilters() {
  console.log('🔄 Resetting all filters...');
  
  // Reset filter state
  currentFilter = {
    status: 'all',
    date: 'all',
    search: '',
    type: 'all'
  };

  // Reset all input fields
  const searchInput = document.getElementById('searchInput');
  const dateFilter = document.getElementById('dateFilter');
  const statusFilter = document.getElementById('statusFilter');
  const typeFilter = document.getElementById('typeFilter');
  const customDatePicker = document.getElementById('customDatePicker');
  
  if (searchInput) searchInput.value = '';
  if (dateFilter) dateFilter.value = 'all';
  if (statusFilter) statusFilter.value = 'all';
  if (typeFilter) typeFilter.value = 'all';
  if (customDatePicker) customDatePicker.style.display = 'none';

  // Reset status filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.status === 'all') {
      tab.classList.add('active');
    }
  });
  
  // Reset appointment type tabs
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.type === 'all') {
      tab.classList.add('active');
    }
  });

  // Force re-render
  console.log(`Total appointments: ${appointments.length}`);
  renderAppointments();
  console.log('✅ Filters reset successfully');
  
  showToast(`Filters reset - Showing all ${appointments.length} appointments`, 'success');
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
            <div class="badge-group">
              <span class="type-badge type-${apt.type}">
                <i class="bi ${apt.type === 'walk-in' ? 'bi-person-walking' : 'bi-calendar-check'}"></i>
                ${apt.type === 'walk-in' ? 'Walk-In' : 'Scheduled'}
              </span>
              <span class="status-badge status-${apt.status}">${apt.status}</span>
            </div>
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
            
            ${apt.status !== 'completed' && apt.status !== 'cancelled' ? `
              <button class="btn btn-action btn-edit" onclick="openEditModal(${apt.id})">
                <i class="bi bi-pencil"></i> Edit
              </button>
            ` : ''}
            
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

// ===== TOGGLE STATUS DROPDOWN =====
function toggleStatusDropdown(event, appointmentId) {
  event.stopPropagation();
  
  document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
    if (menu.id !== `status-dropdown-${appointmentId}`) {
      menu.classList.remove('show');
    }
  });

  const dropdown = document.getElementById(`status-dropdown-${appointmentId}`);
  if (!dropdown) return;
  dropdown.classList.toggle('show');
}

// ===== FILTER APPOINTMENTS =====
function filterAppointments() {
  let filtered = [...appointments];

  // Filter by type (walk-in, scheduled, or all)
  if (currentFilter.type !== 'all') {
    filtered = filtered.filter(a => a.type === currentFilter.type);
  }

  // Filter by status
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
  
  // Update type tab counts
  updateTypeCounts();
}

// ===== UPDATE APPOINTMENT TYPE COUNTS =====
function updateTypeCounts() {
  const all = appointments.length;
  const walkIn = appointments.filter(a => a.type === 'walk-in').length;
  const scheduled = appointments.filter(a => a.type === 'scheduled').length;
  
  const allCount = document.getElementById('allCount');
  const walkInCount = document.getElementById('walkInCount');
  const scheduledCount = document.getElementById('scheduledCount');
  
  if (allCount) allCount.textContent = all;
  if (walkInCount) walkInCount.textContent = walkIn;
  if (scheduledCount) scheduledCount.textContent = scheduled;
}

// ===== SAVE NEW APPOINTMENT =====
function saveNewAppointment() {
  const form = document.getElementById('appointmentForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Get selected appointment type
  const appointmentType = document.querySelector('input[name="appointmentType"]:checked').value;

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
    type: appointmentType,  // Add type field
    notes: document.getElementById('notes').value
  };

  appointments.push(newAppointment);
  
  renderAppointments();
  updateStatistics();
  updateTabBadges();
  
  closeModal(document.getElementById('newAppointmentModal'));
  
  // Reset form for next use
  setTimeout(() => resetNewAppointmentForm(), 300);
  
  showToast(`${appointmentType === 'walk-in' ? 'Walk-In' : 'Scheduled'} appointment created successfully!`, 'success');
}

// ===== VIEW APPOINTMENT =====
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
  
  // Hide/show Edit button based on status
  const editFromViewBtn = document.getElementById('editFromView');
  if (editFromViewBtn) {
    if (apt.status === 'completed' || apt.status === 'cancelled') {
      editFromViewBtn.style.display = 'none';
    } else {
      editFromViewBtn.style.display = 'inline-flex';
    }
  }
  
  // Small delay to ensure content is rendered
  setTimeout(() => {
    openModal('viewAppointmentModal');
  }, 50);
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
  
  // Set appointment type radio button
  if (apt.type === 'walk-in') {
    document.getElementById('editTypeWalkIn').checked = true;
  } else {
    document.getElementById('editTypeScheduled').checked = true;
  }

  // Small delay to ensure form is populated
  setTimeout(() => {
    openModal('editAppointmentModal');
  }, 50);
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

  // Get selected appointment type
  const appointmentType = document.querySelector('input[name="editAppointmentType"]:checked').value;

  apt.customerName = document.getElementById('editCustomerName').value;
  apt.phone = document.getElementById('editCustomerPhone').value;
  apt.carPlate = document.getElementById('editCarPlate').value.toUpperCase();
  apt.carModel = document.getElementById('editCarModel').value;
  apt.date = document.getElementById('editAppointmentDate').value;
  apt.time = document.getElementById('editAppointmentTime').value;
  apt.branch = document.getElementById('editBranch').value;
  apt.package = document.getElementById('editServicePackage').value;
  apt.type = appointmentType;  // Update type field
  apt.notes = document.getElementById('editNotes').value;

  renderAppointments();
  updateStatistics();
  updateTabBadges();
  
  closeModal(document.getElementById('editAppointmentModal'));
  
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

  openModal('statusChangeModal');
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

  openModal('deleteModal');
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

// ===== EXPOSE GLOBAL FUNCTIONS =====
window.viewAppointment = viewAppointment;
window.openEditModal = openEditModal;
window.changeStatus = changeStatus;
window.openDeleteModal = openDeleteModal;
window.toggleStatusDropdown = toggleStatusDropdown;

console.log('✅ Appointment JS loaded - All modals ready!');
