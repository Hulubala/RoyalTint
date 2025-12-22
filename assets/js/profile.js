// ============================================
// ROYAL TINT - PROFILE PAGE JAVASCRIPT
// Simplified Version - No Branch Switching
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 Profile page initializing...');
  
  loadAccountData();
  loadShopInfo();
  
  console.log('✅ Profile page initialized');
});

// ========================================
// SECTION TOGGLE
// ========================================

function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const header = section.previousElementSibling;
  
  if (section.classList.contains('show')) {
    section.classList.remove('show');
    header.classList.remove('active');
  } else {
    section.classList.add('show');
    header.classList.add('active');
  }
}

// ========================================
// ACCOUNT SETTINGS
// ========================================

function loadAccountData() {
  // Load account data from localStorage
  const accountData = JSON.parse(localStorage.getItem('accountData')) || {
    name: 'Manager Name',
    email: 'manager@royaltint.com',
    phone: '+60 12-345 6789',
    photo: null
  };
  
  document.getElementById('accountName').value = accountData.name;
  document.getElementById('accountEmail').value = accountData.email;
  document.getElementById('accountPhone').value = accountData.phone;
  
  if (accountData.photo) {
    document.getElementById('profileImage').src = accountData.photo;
  }
  
  console.log('📋 Account data loaded');
}

function handleAccountSave(event) {
  event.preventDefault();
  
  const accountData = {
    name: document.getElementById('accountName').value,
    email: document.getElementById('accountEmail').value,
    phone: document.getElementById('accountPhone').value,
    photo: document.getElementById('profileImage').src
  };
  
  // Save to localStorage
  localStorage.setItem('accountData', JSON.stringify(accountData));
  
  showNotification('Account settings saved successfully!', 'success');
  console.log('💾 Account data saved');
  
  // Update navbar if exists
  updateNavbarProfile(accountData);
}

function updateNavbarProfile(accountData) {
  // Update profile name in navbar if element exists
  const profileName = document.querySelector('.user-name');
  if (profileName) {
    profileName.textContent = accountData.name;
  }
}

// ========================================
// PROFILE PHOTO UPLOAD
// ========================================

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.match('image.*')) {
    showNotification('Please select a valid image file', 'error');
    return;
  }
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showNotification('Image size must be less than 2MB', 'error');
    return;
  }
  
  // Read and display image
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('profileImage').src = e.target.result;
    showNotification('Photo uploaded! Click Save to apply changes.', 'info');
  };
  reader.readAsDataURL(file);
  
  console.log('📸 Photo uploaded:', file.name);
}

function removePhoto() {
  if (confirm('Are you sure you want to remove your profile photo?')) {
    document.getElementById('profileImage').src = 'https://via.placeholder.com/150/FFD700/000000?text=Photo';
    document.getElementById('photoUpload').value = '';
    showNotification('Photo removed! Click Save to apply changes.', 'info');
    console.log('🗑️ Photo removed');
  }
}

// ========================================
// SECURITY SETTINGS
// ========================================

function handleSecuritySave(event) {
  event.preventDefault();
  
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    showNotification('Please fill in all password fields', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showNotification('New passwords do not match', 'error');
    return;
  }
  
  if (newPassword.length < 8) {
    showNotification('Password must be at least 8 characters', 'error');
    return;
  }
  
  // Check all requirements
  const requirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^a-zA-Z0-9]/.test(newPassword)
  };
  
  const allMet = Object.values(requirements).every(req => req);
  
  if (!allMet) {
    showNotification('Password does not meet all requirements', 'error');
    return;
  }
  
  if (oldPassword === newPassword) {
    showNotification('New password must be different from current password', 'error');
    return;
  }
  
  // Simulate password change (in production, send to server)
  showNotification('Verifying current password...', 'info');
  
  setTimeout(() => {
    // In production, validate with backend
    // For now, simulate success
    showNotification('Password changed successfully!', 'success');
    
    // Reset form
    document.getElementById('securityForm').reset();
    
    const strengthMeter = document.getElementById('strengthMeter');
    const matchIndicator = document.getElementById('matchIndicator');
    
    if (strengthMeter) {
      strengthMeter.classList.remove('show');
    }
    
    if (matchIndicator) {
      matchIndicator.classList.remove('show', 'match', 'no-match');
    }
    
    // Reset requirements
    const requirementIds = ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'];
    requirementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.remove('met');
        const icon = element.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-x-circle';
        }
      }
    });
    
    console.log('🔒 Password changed successfully');
  }, 1000);
}

// ========================================
// PASSWORD STRENGTH & VALIDATION
// ========================================

function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const button = field.nextElementSibling;
  if (!button) return;
  
  const icon = button.querySelector('i');
  if (!icon) return;
  
  if (field.type === 'password') {
    field.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    field.type = 'password';
    icon.className = 'bi bi-eye';
  }
}

function checkPasswordStrength(password) {
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthBar = document.getElementById('strengthBar');
  
  if (!strengthMeter || !strengthBar) return;
  
  if (!password) {
    strengthMeter.classList.remove('show');
    return;
  }
  
  strengthMeter.classList.add('show');
  
  // Calculate strength score
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  // Update strength bar
  strengthBar.classList.remove('weak', 'medium', 'strong');
  
  if (score <= 2) {
    strengthBar.classList.add('weak');
  } else if (score <= 4) {
    strengthBar.classList.add('medium');
  } else {
    strengthBar.classList.add('strong');
  }
}

function checkPasswordRequirements(password) {
  const requirements = {
    'req-length': password.length >= 8,
    'req-uppercase': /[A-Z]/.test(password),
    'req-lowercase': /[a-z]/.test(password),
    'req-number': /[0-9]/.test(password),
    'req-special': /[^a-zA-Z0-9]/.test(password)
  };
  
  Object.entries(requirements).forEach(([id, met]) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    const icon = element.querySelector('i');
    if (!icon) return;
    
    if (met) {
      element.classList.add('met');
      icon.className = 'bi bi-check-circle';
    } else {
      element.classList.remove('met');
      icon.className = 'bi bi-x-circle';
    }
  });
}

function checkPasswordMatch() {
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const indicator = document.getElementById('matchIndicator');
  
  if (!newPassword || !confirmPassword || !indicator) return;
  
  const icon = indicator.querySelector('i');
  const text = indicator.querySelector('span');
  
  if (!icon || !text) return;
  
  if (!confirmPassword.value) {
    indicator.classList.remove('show');
    return;
  }
  
  indicator.classList.add('show');
  
  if (newPassword.value === confirmPassword.value) {
    indicator.classList.remove('no-match');
    indicator.classList.add('match');
    icon.className = 'bi bi-check-circle';
    text.textContent = 'Passwords match';
  } else {
    indicator.classList.remove('match');
    indicator.classList.add('no-match');
    icon.className = 'bi bi-x-circle';
    text.textContent = 'Passwords do not match';
  }
}

// ========================================
// SHOP INFO (FIXED ADDRESS)
// ========================================

function loadShopInfo() {
  // Get display elements
  const displayShopName = document.getElementById('displayShopName');
  const displayShopPhone = document.getElementById('displayShopPhone');
  const displayShopAddress = document.getElementById('displayShopAddress');
  
  // Read current values from HTML (don't override unless specifically saved)
  const shopInfo = {
    name: displayShopName ? displayShopName.textContent : 'Royal Tint',
    phone: displayShopPhone ? displayShopPhone.textContent : '+60 12-345 6789',
    address: displayShopAddress ? displayShopAddress.textContent : 'No. 649, Jalan Melaka Raya 8, Taman Melaka Raya, 75000 Melaka',
    hours: {
      open: '09:00',
      close: '19:00'
    },
    closedDays: []
  };
  
  // Load saved operation hours from localStorage (if exists)
  const savedHours = JSON.parse(localStorage.getItem('shopOperationHours'));
  if (savedHours) {
    shopInfo.hours = savedHours.hours;
    shopInfo.closedDays = savedHours.closedDays || [];
  }
  
  // Update operation hours form (but NOT the shop name/phone/address)
  const openingTime = document.getElementById('openingTime');
  const closingTime = document.getElementById('closingTime');
  
  if (openingTime) openingTime.value = shopInfo.hours.open;
  if (closingTime) closingTime.value = shopInfo.hours.close;
  if (closingTime) closingTime.value = shopInfo.hours.close;
  
  // Update closed days checkboxes
  const checkboxes = document.querySelectorAll('input[name="closedDay"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = shopInfo.closedDays.includes(checkbox.value);
  });
  
  // Update preview
  updateOperationHours();
  
  console.log('🏪 Shop info loaded');
}

function handleShopInfoSave(event) {
  event.preventDefault();
  
  const openingTime = document.getElementById('openingTime');
  const closingTime = document.getElementById('closingTime');
  
  if (!openingTime || !closingTime) {
    showNotification('Error loading form fields', 'error');
    return;
  }
  
  const shopHours = {
    hours: {
      open: openingTime.value,
      close: closingTime.value
    },
    closedDays: Array.from(document.querySelectorAll('input[name="closedDay"]:checked'))
      .map(cb => cb.value)
  };
  
  // Save operation hours to localStorage
  localStorage.setItem('shopOperationHours', JSON.stringify(shopHours));
  
  // Reload display
  loadShopInfo();
  
  showNotification('Shop operation hours saved successfully!', 'success');
  console.log('💾 Shop operation hours saved');
}

// ========================================
// OPERATION HOURS
// ========================================

function updateOperationHours() {
  const openingTimeEl = document.getElementById('openingTime');
  const closingTimeEl = document.getElementById('closingTime');
  const preview = document.getElementById('operationPreview');
  
  if (!openingTimeEl || !closingTimeEl || !preview) return;
  
  const openTime = openingTimeEl.value;
  const closeTime = closingTimeEl.value;
  const closedDays = Array.from(document.querySelectorAll('input[name="closedDay"]:checked'))
    .map(cb => cb.value);
  
  // Format times
  const formattedOpen = formatTime(openTime);
  const formattedClose = formatTime(closeTime);
  
  // All days
  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const openDays = allDays.filter(day => !closedDays.includes(day));
  
  if (openDays.length === 0) {
    preview.innerHTML = '<p style="color: #f44336;">⚠️ No operating days selected</p>';
    return;
  }
  
  // Group consecutive days
  const dayGroups = groupConsecutiveDays(openDays);
  
  let html = '';
  dayGroups.forEach(group => {
    const dayText = group.length === 1 
      ? capitalize(group[0])
      : `${capitalize(group[0])} - ${capitalize(group[group.length - 1])}`;
    html += `<p>${dayText}: ${formattedOpen} - ${formattedClose}</p>`;
  });
  
  if (closedDays.length > 0) {
    const closedText = closedDays.map(d => capitalize(d)).join(', ');
    html += `<p style="color: #f44336;">Closed: ${closedText}</p>`;
  }
  
  preview.innerHTML = html;
}

function groupConsecutiveDays(days) {
  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const indices = days.map(day => allDays.indexOf(day)).sort((a, b) => a - b);
  
  const groups = [];
  let currentGroup = [allDays[indices[0]]];
  
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i-1] + 1) {
      currentGroup.push(allDays[indices[i]]);
    } else {
      groups.push(currentGroup);
      currentGroup = [allDays[indices[i]]];
    }
  }
  groups.push(currentGroup);
  
  return groups;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTime(time24) {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
  // Use the global notification function if available
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else if (typeof showToast === 'function') {
    showToast(message, type);
  } else {
    // Fallback to console
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Try to show alert only for errors
    if (type === 'error') {
      alert(message);
    }
  }
}

// ========================================
// EXPOSE GLOBAL FUNCTIONS
// ========================================

window.toggleSection = toggleSection;
window.handleAccountSave = handleAccountSave;
window.handlePhotoUpload = handlePhotoUpload;
window.removePhoto = removePhoto;
window.handleSecuritySave = handleSecuritySave;
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.checkPasswordRequirements = checkPasswordRequirements;
window.checkPasswordMatch = checkPasswordMatch;
window.handleShopInfoSave = handleShopInfoSave;
window.updateOperationHours = updateOperationHours;