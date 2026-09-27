const menuToggle = document.querySelector('.menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');
const roomFilters = document.querySelectorAll('.room-filter');
const roomCards = document.querySelectorAll('.room-card');
const emptyRoomState = document.querySelector('.empty-room-state');
const quickBookForm = document.querySelector('#quick-book-form');
const bookingForm = document.querySelector('#booking-form');

function toggleNavigation() {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNavigation.classList.toggle('is-open', !isOpen);
}

function closeNavigation(event) {
  if (!event.target.closest('a')) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  siteNavigation.classList.remove('is-open');
}

function filterRooms(event) {
  const selectedType = event.currentTarget.dataset.roomFilter;
  let visibleCount = 0;
  roomFilters.forEach((filter) => {
    const isActive = filter === event.currentTarget;
    filter.classList.toggle('is-active', isActive);
    filter.setAttribute('aria-pressed', String(isActive));
  });
  roomCards.forEach((card) => {
    const shouldShow = selectedType === 'all' || card.dataset.roomType === selectedType;
    card.hidden = !shouldShow;
    if (shouldShow) visibleCount += 1;
  });
  emptyRoomState.hidden = visibleCount > 0;
}

function setDateMinimums() {
  const today = new Date().toISOString().split('T')[0];
  const arrivalFields = document.querySelectorAll('input[type="date"]');
  arrivalFields.forEach((field) => { field.min = today; });
  document.querySelector('#quick-arrival').addEventListener('change', (event) => {
    document.querySelector('#quick-departure').min = event.target.value;
  });
}

function handleQuickBooking(event) {
  event.preventDefault();
  const arrival = document.querySelector('#quick-arrival').value;
  const departure = document.querySelector('#quick-departure').value;
  const status = document.querySelector('#quick-book-status');
  if (!arrival || !departure || departure <= arrival) {
    status.textContent = 'Choose a departure after your arrival date.';
    return;
  }
  status.textContent = 'Those dates look lovely. Complete the enquiry below to request your stay.';
  document.querySelector('#booking-arrival').value = arrival;
  document.querySelector('#book').scrollIntoView({ behavior: 'smooth' });
}

function setBookingError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${fieldId}-error`);
  field.closest('.form-field').classList.toggle('has-error', Boolean(message));
  error.textContent = message;
  return !message;
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const name = document.querySelector('#booking-name').value.trim();
  const email = document.querySelector('#booking-email').value.trim();
  const arrival = document.querySelector('#booking-arrival').value;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validName = setBookingError('booking-name', name ? '' : 'Please add your name.');
  const validEmailField = setBookingError('booking-email', validEmail ? '' : 'Please enter a valid email.');
  const validArrival = setBookingError('booking-arrival', arrival ? '' : 'Choose an arrival date.');
  const status = document.querySelector('#booking-status');
  if (!(validName && validEmailField && validArrival)) {
    status.textContent = 'Please check the highlighted fields.';
    return;
  }
  status.textContent = 'Thank you. We will be in touch with your room options shortly.';
  bookingForm.reset();
}

function setCurrentYear() { document.querySelector('#current-year').textContent = new Date().getFullYear(); }

menuToggle.addEventListener('click', toggleNavigation);
siteNavigation.addEventListener('click', closeNavigation);
roomFilters.forEach((filter) => filter.addEventListener('click', filterRooms));
quickBookForm.addEventListener('submit', handleQuickBooking);
bookingForm.addEventListener('submit', handleBookingSubmit);
setDateMinimums();
setCurrentYear();