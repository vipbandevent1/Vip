// ========== VIP BAND - COMPLETE JAVASCRIPT ==========
// ===== WITH AUTO-SAVE DATE/TIME (NO UPDATE BUTTON) =====

// Global variables for date & time
let selectedDate = '';
let selectedTime = '';

// ===== MENU FUNCTIONS =====
function openMenu() {
  document.getElementById("menu").style.display = "flex";
}

function closeMenu() {
  document.getElementById("menu").style.display = "none";
}

// ===== SERVICE PAGE FUNCTIONS =====
function openServicePage(serviceId) {
  closeBookingPage();
  
  const servicePages = document.querySelectorAll('.service-page');
  servicePages.forEach(page => {
    page.classList.remove('active');
  });
  
  const selectedPage = document.getElementById(`${serviceId}-page`);
  selectedPage.classList.add('active');
  
  document.getElementById('service-pages').style.display = 'block';
  window.scrollTo(0, 0);
  closeMenu();

  setTimeout(() => {
    initCarousels();
    const carousel = selectedPage.querySelector('.carousel-images');
    if (carousel) carousel.scrollLeft = 0;
    
    // Special handling for Rath page
    if (serviceId === 'rath') {
      initRathCarousel();
    }
  }, 100);
}

function closeServicePage() {
  const servicePages = document.querySelectorAll('.service-page');
  servicePages.forEach(page => {
    page.classList.remove('active');
  });
  
  document.getElementById('service-pages').style.display = 'none';
  resetQuantities();
}

// ===== RATH SPECIAL FUNCTIONS =====
function initRathCarousel() {
  const carousel = document.querySelector('#rath-carousel .carousel-images');
  if (!carousel) return;
  
  const dots = document.querySelectorAll('#rath-carousel .dot');
  const images = carousel.querySelectorAll('img');
  
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const imageWidth = carousel.clientWidth;
    const activeIndex = Math.round(scrollLeft / imageWidth);
    
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    if (images[activeIndex]) {
      const price = images[activeIndex].getAttribute('data-price');
      const name = images[activeIndex].getAttribute('data-name');
      
      document.getElementById('rath-price').textContent = `Price: ₹${parseInt(price).toLocaleString()} per day`;
      document.getElementById('rath-name').textContent = name;
      document.getElementById('rath-selected-price').value = price;
      document.getElementById('rath-selected-name').value = name;
      
      if (name === 'Flower Rath') {
        document.getElementById('rath-desc').textContent = 'Beautifully decorated flower rath for weddings and processions.';
      } else {
        document.getElementById('rath-desc').textContent = 'Grand Bahubali-style rath for a royal entry.';
      }
    }
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const imageWidth = carousel.clientWidth;
      carousel.scrollTo({
        left: index * imageWidth,
        behavior: 'smooth'
      });
    });
  });
}

function addRathToCart() {
  const price = document.getElementById('rath-selected-price').value;
  const name = document.getElementById('rath-selected-name').value;
  addToCart('rath', name, parseInt(price), 1);
}

// ===== FORMAT TIME FUNCTION (12-hour format with AM/PM) =====
function formatTime(timeString) {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// ===== FORMAT DATE FUNCTION for Display (DD/MM/YYYY) =====
function formatDisplayDate(dateString) {
  if (!dateString) return '';
  
  // Input is YYYY-MM-DD from date picker
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// ===== GET CURRENT TIME FUNCTION =====
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// ===== GET CURRENT DATE FUNCTION =====
function getCurrentDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return now.toLocaleDateString('en-IN', options);
}

// ===== AUTO-SAVE DATE/TIME FUNCTIONS =====
function onDateChange() {
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    selectedDate = dateInput.value;
    updateDateTimeDisplay();
  }
}

function onTimeChange() {
  const timeInput = document.getElementById('booking-time');
  if (timeInput) {
    selectedTime = timeInput.value;
    updateDateTimeDisplay();
  }
}

// ===== BOOKING PAGE FUNCTIONS =====
function openBookingPage() {
  closeServicePage();
  document.getElementById('booking-page').classList.add('active');
  
  // Set default date to today if not set
  if (!selectedDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    selectedDate = `${yyyy}-${mm}-${dd}`;
    selectedTime = '18:00';
  }
  
  updateBookingDisplay();
  window.scrollTo(0, 0);
  closeMenu();
}

function closeBookingPage() {
  document.getElementById('booking-page').classList.remove('active');
}

function updateDateTimeDisplay() {
  const displayEl = document.getElementById('selected-datetime');
  if (!displayEl) return;
  
  if (selectedDate && selectedTime) {
    // Show in DD/MM/YYYY format
    const displayDate = formatDisplayDate(selectedDate);
    const formattedTime = formatTime(selectedTime);
    
    displayEl.innerHTML = `<i class="fa-regular fa-calendar-check"></i> ${displayDate} at ${formattedTime}`;
  } else {
    displayEl.innerHTML = '<i class="fa-regular fa-calendar"></i> Set date & time for your booking';
  }
}

// ===== QUANTITY FUNCTIONS =====
function updateQuantity(serviceId, change) {
  const input = document.getElementById(`${serviceId}-qty`);
  if (input) {
    let currentValue = parseInt(input.value);
    let newValue = currentValue + change;
    let max = parseInt(input.getAttribute('max')) || 15;
    
    if (newValue < 1) newValue = 1;
    if (newValue > max) newValue = max;
    
    input.value = newValue;
  }
}

function resetQuantities() {
  const quantityInputs = document.querySelectorAll('.quantity-control input[type="number"]');
  quantityInputs.forEach(input => {
    input.value = 1;
  });
}

// ===== BOOKING CART =====
let bookingCart = [];

function addToCart(serviceId, serviceName, price, quantity) {
  const qty = parseInt(quantity);
  const existingItemIndex = bookingCart.findIndex(item => item.id === serviceId);
  
  if (existingItemIndex > -1) {
    bookingCart[existingItemIndex].quantity = qty;
  } else {
    bookingCart.push({
      id: serviceId,
      name: serviceName,
      price: parseInt(price),
      quantity: qty
    });
  }
  
  closeServicePage();
  updateBookingDisplay();
  showNotification(`${serviceName} added to booking!`);
  openBookingPage();
}

function removeFromCart(serviceId) {
  bookingCart = bookingCart.filter(item => item.id !== serviceId);
  updateBookingDisplay();
  showNotification('Item removed from booking!');
}

function updateBookingDisplay() {
  const bookingItemsContainer = document.getElementById('booking-items');
  const totalItemsElement = document.getElementById('total-items');
  const totalAmountElement = document.getElementById('total-amount');
  
  if (bookingCart.length === 0) {
    bookingItemsContainer.innerHTML = '<p class="empty-booking">No items in your booking yet.</p>';
    
    // Add date/time selector
    addDateTimeToContainer(bookingItemsContainer);
    updateDateTimeDisplay();
    
    totalItemsElement.textContent = '0';
    totalAmountElement.textContent = '0';
    return;
  }
  
  let totalItems = 0;
  let totalAmount = 0;
  
  let itemsHTML = '';
  
  bookingCart.forEach(item => {
    totalItems += item.quantity;
    totalAmount += item.price * item.quantity;
    
    itemsHTML += `
      <div class="booking-item">
        <div class="item-name">${item.name}</div>
        <div class="item-details">
          <span class="item-quantity">Qty: ${item.quantity}</span>
          <span class="item-price">₹${(item.price * item.quantity).toLocaleString()}</span>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
        </div>
      </div>
    `;
  });
  
  bookingItemsContainer.innerHTML = itemsHTML;
  
  // Add date/time selector after items
  addDateTimeToContainer(bookingItemsContainer);
  updateDateTimeDisplay();
  
  totalItemsElement.textContent = totalItems;
  totalAmountElement.textContent = totalAmount.toLocaleString();
}

function addDateTimeToContainer(container) {
  const oldCompact = container.querySelector('.compact-datetime');
  if (oldCompact) oldCompact.remove();
  const oldDisplay = container.querySelector('.compact-display');
  if (oldDisplay) oldDisplay.remove();
  
  const datetimeHTML = `
    <div class="compact-datetime">
      <div class="compact-date">
        <i class="fa-regular fa-calendar"></i>
        <input type="date" id="booking-date" class="compact-input" value="${selectedDate || ''}" onchange="onDateChange()">
      </div>
      <div class="compact-time">
        <i class="fa-regular fa-clock"></i>
        <input type="time" id="booking-time" class="compact-input" value="${selectedTime || '18:00'}" onchange="onTimeChange()">
      </div>
      <!-- NO UPDATE BUTTON - AUTO SAVE -->
    </div>
    <div class="compact-display" id="selected-datetime"></div>
  `;
  
  container.insertAdjacentHTML('beforeend', datetimeHTML);
}

function clearBooking() {
  if (bookingCart.length === 0) {
    showNotification('Booking is already empty!');
    return;
  }
  
  if (confirm('Are you sure you want to clear all items from your booking?')) {
    bookingCart = [];
    updateBookingDisplay();
    showNotification('Booking cleared successfully!');
  }
}

function confirmBooking() {
  if (bookingCart.length === 0) {
    showNotification('Please add items to your booking first!');
    return;
  }
  
  if (!selectedDate || !selectedTime) {
    showNotification('Please select date and time for your booking!');
    return;
  }
  
  // Calculate total amount
  let totalAmount = 0;
  bookingCart.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  
  // Get current date and time (when booking is made)
  const currentDate = getCurrentDate();
  const currentTime = getCurrentTime();
  
  // FORMAT SCHEDULED DATE AND TIME - जो यूजर ने सेट किया है
  const scheduledDateRaw = selectedDate; // YYYY-MM-DD
  const scheduledTimeRaw = selectedTime; // HH:MM
  
  // Format for display
  const [year, month, day] = scheduledDateRaw.split('-');
  const scheduledDisplayDate = `${day}/${month}/${year}`; // DD/MM/YYYY
  
  // Format time with AM/PM
  const [hours, minutes] = scheduledTimeRaw.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const scheduledDisplayTime = `${hour12}:${minutes} ${ampm}`;
  
  // Create booking summary for alert
  let summary = "BOOKING SUMMARY\n\n";
  bookingCart.forEach(item => {
    summary += `• ${item.name} (${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}\n`;
  });
  summary += `\n📅 Booked on: ${currentDate} at ${currentTime}`;
  summary += `\n📅 Scheduled for: ${scheduledDisplayDate} at ${scheduledDisplayTime}`;
  summary += `\n💰 Total: ₹${totalAmount.toLocaleString()}`;
  
  alert(summary);
  
  // WhatsApp message with CORRECT scheduled time
  let itemsList = '';
  bookingCart.forEach(item => {
    itemsList += `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}\n`;
  });
  
  const whatsappMessage = encodeURIComponent(
    `Hello VIP BAND,\n\n` +
    `🕐 *Booking Time:* ${currentDate} at ${currentTime}\n` +
    `📅 *Scheduled for:* ${scheduledDisplayDate} at ${scheduledDisplayTime}\n\n` +
    `*Services:*\n${itemsList}\n` +
    `💰 *Total Amount:* ₹${totalAmount.toLocaleString()}\n\n` +
    `Please contact me to confirm.`
  );
  
  const whatsappUrl = `https://wa.me/919005557713?text=${whatsappMessage}`;
  
  if (confirm('Send this booking via WhatsApp?')) {
    window.open(whatsappUrl, '_blank');
  }
}

// ===== NOTIFICATION =====
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #c9a227; color: white;
    padding: 15px 25px; border-radius: 10px; z-index: 100000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  setTimeout(() => { notification.remove(); style.remove(); }, 2300);
}

// ===== CAROUSEL FUNCTIONS =====
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const imagesContainer = carousel.querySelector('.carousel-images');
    const dots = carousel.querySelectorAll('.dot');
    
    if (!imagesContainer || dots.length === 0) return;

    imagesContainer.addEventListener('scroll', () => {
      const scrollLeft = imagesContainer.scrollLeft;
      const imageWidth = imagesContainer.clientWidth;
      const activeIndex = Math.round(scrollLeft / imageWidth);
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const imageWidth = imagesContainer.clientWidth;
        imagesContainer.scrollTo({
          left: index * imageWidth,
          behavior: 'smooth'
        });
      });
    });
  });
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  selectedDate = `${yyyy}-${mm}-${dd}`;
  selectedTime = '18:00';
  
  updateBookingDisplay();
  initCarousels();
  
  document.addEventListener('click', function(event) {
    const servicePages = document.getElementById('service-pages');
    if (servicePages.style.display === 'block' && 
        !event.target.closest('.service-page') && 
        !event.target.closest('.card')) {
      closeServicePage();
    }
  });
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeServicePage();
      closeBookingPage();
    }
  });
});