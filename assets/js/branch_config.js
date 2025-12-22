// ============================================
// ROYAL TINT - BRANCH CONFIGURATION
// Centralized branch data management
// ============================================

// Branch configuration data
const BRANCH_CONFIG = {
    melaka: {
      id: 'melaka',
      name: 'Royal Tint Melaka',
      phone: '+60 6-283 5678',
      address: '123 Jalan Bunga Raya, Taman Melaka Raya, 75000 Melaka',
      email: 'melaka@royaltint.com',
      hours: {
        open: '09:00',
        close: '18:00'
      },
      closedDays: ['sunday'], // Days when shop is closed
      logo: 'assets/images/logo.png',
      managers: ['manager1@royaltint.com', 'manager2@royaltint.com']
    },
    
    seremban: {
      id: 'seremban',
      name: 'Royal Tint Seremban',
      phone: '+60 6-762 3456',
      address: '456 Jalan S2, Taman Seremban Sentosa, 70200 Seremban, Negeri Sembilan',
      email: 'seremban@royaltint.com',
      hours: {
        open: '09:00',
        close: '19:00'
      },
      closedDays: [], // Open all days
      logo: 'assets/images/logo.png',
      managers: ['manager3@royaltint.com', 'manager4@royaltint.com']
    }
  };
  
  // ========================================
  // BRANCH DATA FUNCTIONS
  // ========================================
  
  function getBranchInfo(branchId) {
    // Get saved data from localStorage first
    const savedData = localStorage.getItem(`branch_${branchId}`);
    
    if (savedData) {
      // Merge saved data with default config
      const parsedData = JSON.parse(savedData);
      return {
        ...BRANCH_CONFIG[branchId],
        ...parsedData
      };
    }
    
    // Return default config if no saved data
    return BRANCH_CONFIG[branchId] || BRANCH_CONFIG.melaka;
  }
  
  function saveBranchInfo(branchId, data) {
    localStorage.setItem(`branch_${branchId}`, JSON.stringify(data));
    console.log(`💾 Saved data for ${branchId} branch`);
  }
  
  function getAllBranches() {
    return Object.values(BRANCH_CONFIG);
  }
  
  function getBranchByEmail(email) {
    for (const [branchId, config] of Object.entries(BRANCH_CONFIG)) {
      if (config.managers.includes(email)) {
        return config;
      }
    }
    return null;
  }
  
  // ========================================
  // USER BRANCH ASSIGNMENT
  // ========================================
  
  function setUserBranch(branchId) {
    if (BRANCH_CONFIG[branchId]) {
      localStorage.setItem('userBranch', branchId);
      console.log(`📍 User branch set to: ${branchId}`);
      return true;
    }
    console.error(`❌ Invalid branch ID: ${branchId}`);
    return false;
  }
  
  function getUserBranch() {
    return localStorage.getItem('userBranch') || 'melaka';
  }
  
  // ========================================
  // BRANCH-FILTERED DATA
  // ========================================
  
  /**
   * Filter appointments by current branch
   * @param {Array} appointments - All appointments
   * @returns {Array} - Filtered appointments for current branch
   */
  function filterAppointmentsByBranch(appointments) {
    const currentBranch = getUserBranch();
    return appointments.filter(apt => apt.branch === currentBranch);
  }
  
  /**
   * Filter any data by current branch
   * @param {Array} data - Array of data objects
   * @param {String} branchField - Field name that contains branch ID
   * @returns {Array} - Filtered data for current branch
   */
  function filterDataByBranch(data, branchField = 'branch') {
    const currentBranch = getUserBranch();
    return data.filter(item => item[branchField] === currentBranch);
  }
  
  // ========================================
  // BRANCH STATISTICS
  // ========================================
  
  function getBranchStats(branchId) {
    // This would typically fetch from backend
    // For now, return sample data from localStorage
    
    const stats = localStorage.getItem(`stats_${branchId}`);
    
    if (stats) {
      return JSON.parse(stats);
    }
    
    // Default stats
    return {
      branch: branchId,
      totalAppointments: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      averageRating: 0
    };
  }
  
  function saveBranchStats(branchId, stats) {
    localStorage.setItem(`stats_${branchId}`, JSON.stringify(stats));
  }
  
  // ========================================
  // INITIALIZATION
  // ========================================
  
  function initializeBranchSystem() {
    // Check if user has a branch assigned
    let userBranch = getUserBranch();
    
    if (!userBranch) {
      // Default to melaka if no branch assigned
      setUserBranch('melaka');
      userBranch = 'melaka';
    }
    
    console.log('🏪 Branch system initialized');
    console.log('📍 Current branch:', userBranch);
    console.log('📊 Branch config:', getBranchInfo(userBranch));
    
    return userBranch;
  }
  
  // ========================================
  // EXAMPLE: HOW TO USE IN YOUR PAGES
  // ========================================
  
  /*
  // Example 1: Load appointments for current branch
  function loadAppointments() {
    const currentBranch = getUserBranch();
    
    // Fetch from API/database with branch filter
    fetch(`/api/appointments?branch=${currentBranch}`)
      .then(response => response.json())
      .then(appointments => {
        displayAppointments(appointments);
      });
    
    // Or filter locally
    const allAppointments = getAllAppointments(); // your function
    const branchAppointments = filterAppointmentsByBranch(allAppointments);
    displayAppointments(branchAppointments);
  }
  
  // Example 2: Save appointment with branch
  function createAppointment(appointmentData) {
    const currentBranch = getUserBranch();
    
    const appointment = {
      ...appointmentData,
      branch: currentBranch, // Add branch ID
      branchName: getBranchInfo(currentBranch).name
    };
    
    // Save to API/database
    saveAppointment(appointment);
  }
  
  // Example 3: Display branch info in dashboard
  function updateDashboardHeader() {
    const branchInfo = getBranchInfo(getUserBranch());
    
    document.getElementById('branchName').textContent = branchInfo.name;
    document.getElementById('branchPhone').textContent = branchInfo.phone;
    document.getElementById('branchAddress').textContent = branchInfo.address;
  }
  
  // Example 4: Filter products by branch
  function loadProducts() {
    const allProducts = getProducts(); // your function
    const branchProducts = filterDataByBranch(allProducts, 'branchId');
    displayProducts(branchProducts);
  }
  
  // Example 5: Check if user can access a resource
  function canAccessResource(resourceBranch) {
    const userBranch = getUserBranch();
    return resourceBranch === userBranch;
  }
  */
  
  // ========================================
  // EXPOSE GLOBAL FUNCTIONS
  // ========================================
  
  window.BRANCH_CONFIG = BRANCH_CONFIG;
  window.getBranchInfo = getBranchInfo;
  window.saveBranchInfo = saveBranchInfo;
  window.getAllBranches = getAllBranches;
  window.getBranchByEmail = getBranchByEmail;
  window.setUserBranch = setUserBranch;
  window.getUserBranch = getUserBranch;
  window.filterAppointmentsByBranch = filterAppointmentsByBranch;
  window.filterDataByBranch = filterDataByBranch;
  window.getBranchStats = getBranchStats;
  window.saveBranchStats = saveBranchStats;
  window.initializeBranchSystem = initializeBranchSystem;
  
  // Auto-initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initializeBranchSystem();
  });
  