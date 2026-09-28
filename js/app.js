// --- LLAVES DE LOCALSTORAGE (BASE DE DATOS CLOUD SIMULADA) ---
const DB_DEVICES = 'formas_db_devices_sim';
const DB_BOOKINGS = 'formas_db_bookings_sim';
const MY_PROFILE = 'formas_my_profile_sim';
const SUGGESTIONS = 'formas_user_suggestions_v1';

// --- ESTADO GLOBAL ---
let activeView = 'day'; // Siempre vista por día por defecto
let selectedDayView = new Date().getDay() === 0 ? 1 : new Date().getDay();
let categoryFilter = 'Aeróbicos'; // Filtro inicial
let currentBookingData = null; // Guarda temporalmente la clase seleccionada para el modal

// --- DYNAMIC BACKGROUND MAPPINGS & CHANGERS ---
const CATEGORY_IMAGES = {
  "Control": "assets/images/control.jpg",
  "Spinning": "assets/images/spinning.jpg",
  "Funcional": "assets/images/funcional.jpg",
  "Aeróbicos": "assets/images/aerobicos.jpg",
  "Musculación": "assets/images/musculacion.jpg",
  "Otros": "assets/images/cardio.jpg"
};

let activeGlobalBgLayer = 1;
window.changeGlobalBackground = function(imagePath) {
  const bgContainer = document.getElementById('global-bg-container');
  const bg1 = document.getElementById('global-bg-1');
  const bg2 = document.getElementById('global-bg-2');
  if (!bgContainer || !bg1 || !bg2) return;

  bgContainer.style.opacity = '1';

  if (activeGlobalBgLayer === 1) {
    bg2.style.backgroundImage = `url('${imagePath}')`;
    bg2.style.opacity = '1';
    bg1.style.opacity = '0';
    activeGlobalBgLayer = 2;
  } else {
    bg1.style.backgroundImage = `url('${imagePath}')`;
    bg1.style.opacity = '1';
    bg2.style.opacity = '0';
    activeGlobalBgLayer = 1;
  }
};

window.hideGlobalBackground = function() {
  const bgContainer = document.getElementById('global-bg-container');
  if (bgContainer) {
    bgContainer.style.opacity = '0';
  }
};


// --- INICIALIZACIÓN ---
window.onload = function() {
  initSimulatedCloudDatabase();
  
  const staffSession = sessionStorage.getItem('formas_staff_logged');
  const clientMode = localStorage.getItem('formas_client_mode');
  const roleOverlay = document.getElementById('role-selector-overlay');

  if (staffSession) {
    if (roleOverlay) roleOverlay.classList.add('hidden');
    enterStaffMode(staffSession);
  } else if (clientMode === 'true') {
    if (roleOverlay) roleOverlay.classList.add('hidden');
    enterClientMode();
  } else {
    if (roleOverlay) roleOverlay.classList.remove('hidden');
  }

  updateClock();
  renderSchedule();
  renderReservations();
  renderDisciplines();
  updateReservationBadge();
  
  setInterval(updateClock, 10000);
  setInterval(checkUserStatus, 3000);
};

// --- BASE DE DATOS CLOUD SIMULADA (Para pruebas sin backend real) ---
function initSimulatedCloudDatabase() {
  if (!localStorage.getItem(DB_DEVICES)) {
    // Datos de demo iniciales para simular recepción
    const initialDevices = [
      { id: "FORMAS-4281", name: "Sofía Martínez", phone: "78091823", status: "Activo", createdAt: new Date().toISOString() },
      { id: "FORMAS-9012", name: "Carlos Mendoza", phone: "70019283", status: "Inactivo", createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(DB_DEVICES, JSON.stringify(initialDevices));
  }
  if (!localStorage.getItem(DB_BOOKINGS)) {
    // Reservas de demo iniciales
    const initialBookings = [
      { id: "lun_p1_0930_FORMAS-4281", classId: "lun_p1_0930", className: "Body Pump", time: "09:30", roomCode: "p1", instructor: "TEO", dayName: "LUNES", date: getTodayDateString(), deviceId: "FORMAS-4281", userName: "Sofía Martínez", userPhone: "78091823" }
    ];
    localStorage.setItem(DB_BOOKINGS, JSON.stringify(initialBookings));
  }
}

function db_getDevices() {
  return JSON.parse(localStorage.getItem(DB_DEVICES)) || [];
}

function db_saveDevice(device) {
  const devices = db_getDevices();
  const index = devices.findIndex(d => d.id === device.id);
  if (index >= 0) {
    devices[index] = device;
  } else {
    devices.push(device);
  }
  localStorage.setItem(DB_DEVICES, JSON.stringify(devices));
}

function db_updateDeviceStatus(deviceId, newStatus) {
  const devices = db_getDevices();
  const index = devices.findIndex(d => d.id === deviceId);
  if (index >= 0) {
    devices[index].status = newStatus;
    localStorage.setItem(DB_DEVICES, JSON.stringify(devices));
    return true;
  }
  return false;
}

function db_getBookings() {
  let bookings = JSON.parse(localStorage.getItem(DB_BOOKINGS)) || [];
  const now = getSimulatedDate();
  const beforeCount = bookings.length;

  // Filtrar y eliminar reservas expiradas (más de 60 minutos del inicio de la clase)
  bookings = bookings.filter(b => {
    try {
      const bookingTime = new Date(`${b.date}T${b.time}:00`);
      const expiredTime = bookingTime.getTime() + 60 * 60 * 1000;
      return now.getTime() < expiredTime;
    } catch (e) {
      return true; // Conservar en caso de fallo de formato
    }
  });

  if (bookings.length !== beforeCount) {
    localStorage.setItem(DB_BOOKINGS, JSON.stringify(bookings));
  }
  return bookings;
}

function db_saveBooking(booking) {
  const bookings = db_getBookings();
  bookings.push(booking);
  localStorage.setItem(DB_BOOKINGS, JSON.stringify(bookings));
}

function db_deleteBooking(classId, deviceId) {
  let bookings = db_getBookings();
  bookings = bookings.filter(b => !(b.classId === classId && b.deviceId === deviceId));
  localStorage.setItem(DB_BOOKINGS, JSON.stringify(bookings));
}

function getTodayDateString() {
  const now = getSimulatedDate();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// --- DISCRIMINACIÓN DE ROLES EN LA ENTRADA ---
window.selectAppRole = function(role) {
  const selectView = document.getElementById('role-view-select');
  const loginView = document.getElementById('role-view-login');
  
  if (role === 'cliente') {
    enterClientMode();
  } else if (role === 'staff') {
    if (selectView && loginView) {
      selectView.classList.add('hidden');
      loginView.classList.remove('hidden');
    }
  }
};

window.cancelStaffLogin = function() {
  const selectView = document.getElementById('role-view-select');
  const loginView = document.getElementById('role-view-login');
  if (selectView && loginView) {
    selectView.classList.remove('hidden');
    loginView.classList.add('hidden');
  }
};

window.handleStaffAuth = function(event) {
  event.preventDefault();
  const user = document.getElementById('auth-username').value.trim();
  const pass = document.getElementById('auth-password').value.trim();

  if (user.toLowerCase() === 'teo' && pass === 'Prometeo2003') {
    enterStaffMode('TEO');
    showToast('Ingreso autorizado: Instructor TEO', 'success');
  } else if (user.toLowerCase() === 'recepcion' && pass === '123') {
    enterStaffMode('RECEPCION');
    showToast('Ingreso autorizado: Panel Recepción', 'success');
  } else {
    showToast('Credenciales incorrectas.', 'error');
  }
};

function enterStaffMode(role) {
  sessionStorage.setItem('formas_staff_logged', role);
  localStorage.removeItem('formas_client_mode'); // Quitar modo cliente para evitar conflictos

  // Ocultar overlay selector
  const roleOverlay = document.getElementById('role-selector-overlay');
  if (roleOverlay) roleOverlay.classList.add('hidden');

  // Ajustar barra de navegación inferior (Mostrar solo Staff, ocultar el resto)
  const staffNavs = ['nav-horarios', 'nav-gimnasio', 'nav-ofertas', 'nav-staff'];
  staffNavs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === 'nav-staff' ? 'flex' : 'none';
  });
  
  // Limpiar campos del login
  document.getElementById('auth-username').value = '';
  document.getElementById('auth-password').value = '';

  switchTab('staff');
}

function enterClientMode() {
  localStorage.setItem('formas_client_mode', 'true');
  sessionStorage.removeItem('formas_staff_logged');

  // Ocultar overlay selector
  const roleOverlay = document.getElementById('role-selector-overlay');
  if (roleOverlay) roleOverlay.classList.add('hidden');

  // Mostrar pestañas del cliente en barra inferior y ocultar staff
  const clientNavs = ['nav-horarios', 'nav-gimnasio', 'nav-ofertas', 'nav-staff'];
  clientNavs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === 'nav-staff' ? 'none' : 'flex';
  });

  switchTab('horarios');
  checkUserStatus();
}

// --- VERIFICACIÓN DE ESTADO DEL USUARIO (REGISTRO & GUARD) ---
function checkUserStatus() {
  // Si no está en modo cliente, ignoramos este bloqueo
  if (localStorage.getItem('formas_client_mode') !== 'true') return;

  const overlay = document.getElementById('registration-overlay');
  if (!overlay) return;

  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  
  if (!profile) {
    overlay.classList.remove('hidden');
    document.getElementById('reg-step-form').classList.remove('hidden');
    document.getElementById('reg-step-pending').classList.add('hidden');
    document.getElementById('reg-step-inactive').classList.add('hidden');
    return;
  }

  const devices = db_getDevices();
  const dbDevice = devices.find(d => d.id === profile.id);

  if (!dbDevice) {
    db_saveDevice(profile);
    return;
  }

  // Actualizar estado local si cambió en la base de datos central
  if (profile.status !== dbDevice.status) {
    profile.status = dbDevice.status;
    localStorage.setItem(MY_PROFILE, JSON.stringify(profile));
  }

  if (dbDevice.status === 'Pendiente') {
    overlay.classList.remove('hidden');
    document.getElementById('reg-step-form').classList.add('hidden');
    document.getElementById('reg-step-pending').classList.remove('hidden');
    document.getElementById('pending-device-code').innerText = dbDevice.id;
    document.getElementById('reg-step-inactive').classList.add('hidden');
  } else if (dbDevice.status === 'Inactivo') {
    overlay.classList.remove('hidden');
    document.getElementById('reg-step-form').classList.add('hidden');
    document.getElementById('reg-step-pending').classList.add('hidden');
    document.getElementById('reg-step-inactive').classList.remove('hidden');
  } else {
    // Activo: Ocultar bloqueo y permitir ingreso
    overlay.classList.add('hidden');
  }
}

// --- LOGICA DE REGISTRO INICIAL ---
window.handleRegistration = function(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  
  if (!name || !phone) return;

  // Generar código único aleatorio FORMAS-XXXX
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const deviceId = `FORMAS-${randNum}`;

  const newProfile = {
    id: deviceId,
    name: name,
    phone: phone,
    status: 'Pendiente',
    createdAt: new Date().toISOString()
  };

  // Guardar local y en la "central"
  localStorage.setItem(MY_PROFILE, JSON.stringify(newProfile));
  db_saveDevice(newProfile);

  showToast('Dispositivo registrado. Pendiente de activación', 'info');
  checkUserStatus();
};

window.requestWhatsAppActivation = function() {
  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  if (!profile) return;

  let msg = `*SOLICITUD DE ACTIVACIÓN - GIMNASIO FORMAS*\n`;
  msg += `*Nombre:* ${profile.name}\n`;
  msg += `*Teléfono:* ${profile.phone}\n`;
  msg += `*Código de Dispositivo:* ${profile.id}\n`;
  msg += `Por favor, activen mi dispositivo para poder reservar clases.`;

  const url = `https://wa.me/59170000000?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

// Botón de simulación rápido para el usuario
window.simulateMockApproval = function() {
  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  if (!profile) return;

  db_updateDeviceStatus(profile.id, 'Activo');
  showToast('¡Simulación exitosa! Cuenta activada.', 'success');
  checkUserStatus();
  renderSchedule();
};

// --- NAVEGACIÓN EN PESTAÑAS (BOTTOM NAV BAR) ---
window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.header-icon-btn').forEach(btn => btn.classList.remove('active'));
  
  const targetSec = document.getElementById(`tab-section-${tabName}`);
  if (targetSec) {
    targetSec.classList.remove('hidden');
  }
  
  const targetNav = document.getElementById(`nav-${tabName}`);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  // Si es la sección contacto, marcar el botón correspondiente de la cabecera
  if (tabName === 'contacto') {
    const contactBtn = document.querySelector('.header-icon-btn.wa-btn');
    if (contactBtn) contactBtn.classList.add('active');
  }

  // Controlar fondo dinámico global según pestaña activa
  if (tabName === 'horarios' || tabName === 'gimnasio') {
    const bgContainer = document.getElementById('global-bg-container');
    if (bgContainer) bgContainer.style.opacity = '1';
  } else {
    hideGlobalBackground();
  }

  if (tabName === 'horarios') renderSchedule();
  if (tabName === 'gimnasio') renderDisciplines();
  if (tabName === 'staff') renderStaffPortal();
};

// --- OBTENER FECHA SIMULADA (MOCK DOMINGO -> LUNES) ---
function getSimulatedDate() {
  const now = new Date();
  if (now.getDay() === 0) {
    // Si es domingo, simulamos que es lunes sumando 24 horas (un día completo)
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  return now;
}

function getMins(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatInstructor(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}


// --- RELOJ Y FECHA TÁCTICA ---
function updateClock() {
  const now = getSimulatedDate();
  const day = now.getDay();



  const daysShort = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const monthsShort = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  
  const dateStr = `${daysShort[day]} ${now.getDate()} ${monthsShort[now.getMonth()]}`;
  const clockStr = now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false });

  const dateEl = document.getElementById('full-date-line');
  const clockEl = document.getElementById('clock');
  
  if (dateEl) dateEl.innerText = dateStr;
  if (clockEl) clockEl.innerText = clockStr;

  if (activeView === 'live') {
    renderSchedule();
  }
}

// --- COMPONENTES COMPARATIVOS DE SELECTOR DE CATEGORÍAS ---
const CATEGORY_ICONS = {
  "Aeróbicos": `<svg class="w-full h-full max-w-[52px] max-h-[52px] p-0.5 shrink-0" fill="currentColor" viewBox="0 0 283.46 283.46">
    <g>
      <polygon points="120.94 111.47 116.99 48.21 143.2 5.46 153.4 5.46 134.14 48.77 135.69 77.04 140.95 88.72 120.94 111.47"/>
      <path d="M202.1,155.06l-39.82-6.75-1.95-12.73,24.5,3.41-.99-9.01c-1.79-5.93-7.58-4.5-7.58-4.5l-15.56,4.31,20.54-27.72,1.46.16c7.91.59,14.42,7.56,15.24,15.45l4.16,37.39Z"/>
      <polygon points="102.84 231.52 84.52 179.51 106.6 139.79 128.6 156.63 109.12 182.52 118.96 230.98 102.84 231.52"/>
      <polygon points="201.41 263.64 169.16 197.77 138.59 155.78 162.28 148.31 190.88 188.96 217.4 263.64 201.41 263.64"/>
      <path d="M165.17,69.49c5.64-.13,10.29,4.4,10.29,10.05v11.79l-23.51.33,3.29-5.77h-.04v-16.17l9.98-.24Z"/>
    </g>
    <path d="M163.72,263.09h-84.25c-6.67,0-12.1-5.43-12.1-12.1v-1.06c0-6.67,5.43-12.1,12.1-12.1h84.25c6.67,0,12.1,5.43,12.1,12.1v1.06c0,6.67-5.43,12.1-12.1,12.1ZM79.47,245.38c-2.51,0-4.55,2.04-4.55,4.55v1.06c0,2.51,2.04,4.55,4.55,4.55h84.25c2.51,0,4.55-2.04,4.55-4.55v-1.06c0-2.51-2.04-4.55-4.55-4.55h-84.25Z"/>
    <rect x="69.68" y="268.92" width="45.85" height="7.55"/>
    <rect x="126.45" y="268.92" width="45.85" height="7.55"/>
  </svg>`,
  "Control": `<svg class="w-full h-full max-w-[52px] max-h-[52px] p-0.5 shrink-0" fill="currentColor" viewBox="0 0 283.46 283.46">
    <path d="M55.34,249.43l-16.26-.52,42.01-61.3,28.75-54.58c7.34-13.94,26.84-15.64,36.2-2.97.07.1,1.12,4.88,1.19,4.97l-53.88,66.03-38.01,48.37Z"/>
    <polygon points="95.75 141.74 53 88.93 48.39 18.87 63.06 25.09 71.67 81.07 110.74 115.94 95.75 141.74"/>
    <path d="M232.99,253.07l-36.12-28.77-18.55-24.93c-1.94-3.43-3.65-8.16-7.25-9.34-5.92-1.95-20.9-2.02-20.9-2.02l24.05-29.87c8.47,6.52,15.78,14.03,20.11,23.22l17.02,36.06,29.11,28.18-7.47,7.48Z"/>
    <path d="M205.36,180.37h19.73s-4.04-10.1-4.04-10.1c-3.23-7.56-9.73-12.14-17.32-12.14h-10.03s11.67,22.24,11.67,22.24Z"/>
    <rect x="15.97" y="260.61" width="250.05" height="4"/>
  </svg>`,
  "Spinning": `<svg class="w-full h-full max-w-[52px] max-h-[52px] p-0.5 shrink-0" fill="currentColor" viewBox="0 0 283.46 283.46">
    <path d="M131.64,60.01l-41.96,50.18c-.06.11-19.51,66.45-19.79,66.83l-34.73,49.68-17.09.69,35.54-63.02,13.1-79.82,2-5.12c4.59-11.72,15.91-19.42,28.5-19.42h34.43Z"/>
    <polygon points="109.76 197.69 95.93 197.63 131.4 147.53 100.68 119.41 117.52 97.94 160.37 150.37 109.76 197.69"/>
    <path d="M191.02,153.96l-36.98-41.21,7.96-32.79c.62-2.43,1.53-4.94-.72-6.31l-4.63-2.81c-2.46-1.5-2.93-4.88-.95-6.98h0c.86-.91,2.05-1.42,3.3-1.42h32.71c4.81,0,7.37,5.69,4.17,9.28l-19.81,40.81,24.83,33.69-9.88,7.73h0Z"/>
    <path d="M210.22,55.39h-24.88l12.07-20.93h6.1c8.35,0,13.56,9.03,9.39,16.26l-2.69,4.67h0Z"/>
    <path d="M205.64,254.87c-35.39,0-64.18-28.79-64.18-64.18s28.79-64.18,64.18-64.18,64.18,28.79,64.18,64.18-28.79,64.18-64.18,64.18h0ZM205.64,130.51c-33.18,0-60.18,27-60.18,60.18s27,60.18,60.18,60.18,60.18-27,60.18-60.18-27-60.18-60.18-60.18h0Z"/>
    <path d="M219.02,176.77c-6.31-1.36-85.66-18.52-131.33-27.93-.35,1.11-.76,2.41-1.21,3.85,46.96,9.67,130.77,27.79,131.89,28.04l.42.04c4.16,0,7.55,3.39,7.55,7.55s-3.39,7.55-7.55,7.55h-.08l-159.68,13.34c-.99,1.46-1.95,2.89-2.87,4.25l162.72-13.59c6.33-.05,11.46-5.25,11.46-11.55s-5.06-11.43-11.32-11.55Z"/>
    <path d="M53.01,252.59l-1.64-1.09-1.84.93c-.56-1.11-.33-1.43,1.48-3.9.84-1.15,2.04-2.78,3.48-4.73,2.88-3.9,6.73-9.09,10.58-14.28,7.7-10.38,15.41-20.74,15.41-20.74l3.21,2.39c-11.93,16.04-29.94,40.3-30.68,41.42Z"/>
    <polygon points="107.88 253.53 107.88 249.53 107.88 253.53 15.62 253.53 15.62 249.53 107.88 249.53 107.88 253.53"/>
  </svg>`,
  "Funcional": `<svg class="w-full h-full max-w-[52px] max-h-[52px] p-0.5 shrink-0" fill="currentColor" viewBox="0 0 283.46 283.46">
    <polygon points="151.14 29.54 130.86 29.54 129.56 6.06 152.44 6.06 151.14 29.54"/>
    <polygon points="134.58 264.01 114.76 255.98 117.34 200.4 110.58 127.37 136.04 130.89 136.04 201.82 134.58 264.01"/>
    <polygon points="144.56 263.95 143.73 201.68 144.29 130.75 171.35 126 163.9 200.45 162.81 257.36 144.56 263.95"/>
    <path d="M141,277.14c-32.08,0-54.48-17.31-67.62-31.83-15.97-17.65-27.52-41.37-31.68-65.06-8.79-50.01-7.79-93.17-7.78-93.6l4,.1c-.01.43-.99,43.21,7.72,92.81,7.97,45.37,44.1,93.58,95.36,93.58v4Z"/>
    <path d="M141,277.14v-4c51.26,0,87.39-48.22,95.36-93.58,8.71-49.6,7.73-92.38,7.72-92.81l4-.1c.01.43,1.01,43.59-7.78,93.6-4.16,23.7-15.71,47.41-31.68,65.06-13.14,14.52-35.54,31.83-67.62,31.83Z"/>
    <path d="M106.2,66.92l-12.31,21.34c-1.58,3.59-4.82,6.16-8.68,6.88l-35.99,7.32v-10.61l25.88-8.83c3.68-1.12,6.58-3.95,7.8-7.6l11.52-34.56h16.45s3.88,28.1,3.88,28.1l-8.55-2.05Z"/>
    <path d="M176.2,66.92l12.31,21.34c1.58,3.59,4.82,6.16,8.68,6.88l35.99,7.32v-10.61s-25.88-8.83-25.88-8.83c-3.68-1.12-6.58-3.95-7.8-7.6l-11.52-34.56h-16.45s-3.88,28.1-3.88,28.1l8.55-2.05Z"/>
  </svg>`,
  "Musculación": `<svg class="w-full h-full max-w-[52px] max-h-[52px] p-0.5 shrink-0" fill="currentColor" viewBox="0 0 283.46 283.46">
    <g>
      <path d="M112.11,124.49l-16.38-13.29-36.54-2.18c-8.5-.51-13.55-9.7-9.43-17.15l23.84-39.28,13.18-.09-12.58,35.78h41.18l-3.28,36.22Z"/>
      <path d="M168.23,124.49l-3.28-36.22h41.18l-10.63-35.78,11.23.09,23.84,39.28c4.12,7.45-.94,16.64-9.43,17.15l-36.54,2.18-16.38,13.29Z"/>
    </g>
    <polygon points="150.56 86.59 129.79 86.59 128.51 65.82 151.84 65.82 150.56 86.59"/>
    <path d="M110.81,274.49l-17.01-54.22,18.47-59.05,25.02,13.2s-19.85,50.26-19.8,50.29l9.13,49.92-15.81-.15Z"/>
    <path d="M159.46,274.65l9.13-49.92s-19.64-50.38-19.64-50.38l24.86-13.12,18.47,59.05-17.01,54.22-15.81.15Z"/>
    <g>
      <rect x="48" y="42.24" width="185.84" height="4"/>
      <path d="M50.65,76.94h-16.06V7.89h16.06v69.05ZM38.59,72.94h8.06V11.89h-8.06v61.05Z"/>
      <path d="M38.59,68.17h-15.61V21.05h15.61v47.12ZM26.98,64.17h7.61V25.05h-7.61v39.12Z"/>
      <path d="M246.84,76.94h-16.06V7.89h16.06v69.05ZM234.78,72.94h8.06V11.89h-8.06v61.05Z"/>
      <path d="M259.02,68.17h-16.18V21.05h16.18v47.12ZM246.84,64.17h8.18V25.05h-8.18v39.12Z"/>
    </g>
  </svg>`
};

const CATEGORY_ICONS_CONFIG = {
  "Aeróbicos": "assets/icons/aerobics.svg",
  "Control": "assets/icons/control.svg",
  "Spinning": "assets/icons/spinning.svg",
  "Funcional": "assets/icons/funcional.svg",
  "Musculación": "assets/icons/musculacion.svg"
};

let RAW_CATEGORY_SVGS = { ...CATEGORY_ICONS };

function getCatalogCategoryIconSvg(category) {
  let text = RAW_CATEGORY_SVGS[category] || CATEGORY_ICONS[category] || '';
  if (!text) return '';
  // Limpiar cualquier clase y aplicar dimensiones para la imagen principal del catálogo
  return text.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    attrs = attrs.replace(/\b(width|height|class|fill)\s*=\s*"[^"]*"/gi, '');
    return `<svg class="w-24 h-24 sm:w-28 sm:h-28 max-w-[120px] max-h-[120px] object-contain drop-shadow-[0_0_18px_rgba(14,255,199,0.35)]" fill="currentColor"${attrs}>`;
  });
}

// Carga automática directa desde assets/icons/ con cache-busting dinámico
async function loadDynamicCategoryIcons() {
  let updatedAny = false;
  for (const [cat, path] of Object.entries(CATEGORY_ICONS_CONFIG)) {
    try {
      const res = await fetch(`${path}?t=${Date.now()}`);
      if (res.ok) {
        let text = await res.text();
        text = text.replace(/<\?xml[\s\S]*?\?>/i, '').replace(/<!--[\s\S]*?-->/g, '');
        // Adaptar fill/stroke por defecto de Illustrator a currentColor
        text = text.replace(/#231f20/gi, 'currentColor');
        RAW_CATEGORY_SVGS[cat] = text;
        // Asegurar clases responsive y herencia de color para botones de selector
        CATEGORY_ICONS[cat] = text.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
          attrs = attrs.replace(/\b(width|height|class|fill)\s*=\s*"[^"]*"/gi, '');
          return `<svg class="w-full h-full max-w-[52px] max-h-[52px] p-0.5 shrink-0" fill="currentColor"${attrs}>`;
        });
        updatedAny = true;
      }
    } catch (e) {
      console.warn(`Could not auto-load icon for ${cat}:`, e);
    }
  }
  if (updatedAny) {
    if (typeof renderCategorySelectors === 'function') renderCategorySelectors();
    if (typeof renderDisciplines === 'function') renderDisciplines();
  }
}
// Ejecutar carga dinámica al iniciar
loadDynamicCategoryIcons();

function isCategoryMatched(classCategory, filter) {
  if (filter === 'ALL') return true;
  return classCategory === filter;
}

const CATEGORY_HEAD_ZOOM_TRANSFORMS = {
  "Aeróbicos": "scale(2.5) translate(-8%, 17%)",
  "Control": "scale(2.5) translate(26%, 33%)",
  "Spinning": "scale(2.5) translate(-20%, 28%)",
  "Funcional": "scale(2.5) translate(0%, 35%)",
  "Musculación": "scale(2.5) translate(0%, 18%)"
};

window.renderCategorySelectors = function() {
  const container = document.getElementById('schedule-category-chips-list');
  const titleDisplay = document.getElementById('active-category-title-display');
  if (!container) return;

  const categories = ['Aeróbicos', 'Control', 'Spinning', 'Funcional', 'Musculación'];

  let html = '';
  categories.forEach(cat => {
    const isActive = (categoryFilter === cat);
    const icon = CATEGORY_ICONS[cat] || '';
    const zoomTransform = isActive ? (CATEGORY_HEAD_ZOOM_TRANSFORMS[cat] || 'scale(2.5)') : 'scale(1) translate(0, 0)';
    
    html += `
      <button onclick="onCategoryChipChange('${cat}')" aria-pressed="${isActive}" title="${cat}" class="flex-1 focus:outline-none transition-all duration-200 active:scale-95 cursor-pointer">
        <div class="aspect-square w-full rounded-2xl border-2 overflow-hidden flex items-center justify-center p-1.5 sm:p-2.5 transition-all duration-300 ${isActive ? 'border-[#0effc7] bg-[#0d2a23] text-[#0effc7] shadow-[0_0_14px_rgba(14,255,199,0.4)] scale-105' : 'border-white/15 bg-[#161616] text-white/65 hover:border-white/35 hover:bg-[#202020]'}" style="transform: translateZ(0);">
          <div class="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center" style="transform: ${zoomTransform};">
            ${icon}
          </div>
        </div>
      </button>
    `;
  });
  container.innerHTML = html;

  if (titleDisplay) {
    titleDisplay.innerText = (categoryFilter === 'ALL' ? 'Todas las disciplinas' : categoryFilter);
  }
};

// --- FILTROS DE HORARIO (OPCIÓN A) ---
window.changeDay = function(dayIndex) {
  selectedDayView = dayIndex;
  renderSchedule();
};

window.onCategoryChipChange = function(cat) {
  if (categoryFilter === cat) {
    // Si ya está activo, funciona como interruptor apagándolo y mostrando todas las disciplinas
    categoryFilter = 'ALL';
  } else {
    // Si estaba inactivo o en ALL, se enciende la categoría seleccionada
    categoryFilter = cat;
  }
  renderCategorySelectors();
  renderSchedule();
};

// --- LOGICA DE RESERVAS EN CLOUD SIMULADO ---
function getMyReservations() {
  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  if (!profile) return [];

  const bookings = db_getBookings();
  // Filtrar solo las mías
  return bookings.filter(b => b.deviceId === profile.id);
}

function isClassBooked(classId) {
  const myReservations = getMyReservations();
  return myReservations.some(r => r.classId === classId);
}

function getAvailableSeats(classId, maxCap) {
  // Demo del usuario: forzar que la clase de Spinning del Lunes a las 19:30 esté llena
  if (classId === "lun_p2_1930" || classId === "mar_p2_1930") {
    return 0;
  }
  const bookings = db_getBookings();
  const bookedCount = bookings.filter(b => b.classId === classId).length;
  // Simulación: reducimos algunos asientos ficticios
  const simulatedTaken = (classId.charCodeAt(classId.length - 1) * 3) % 6; 
  return Math.max(0, maxCap - simulatedTaken - bookedCount);
}

function updateReservationBadge() {
  const reservations = getMyReservations();
  const badge = document.getElementById('reserva-badge');
  if (badge) {
    if (reservations.length > 0) {
      badge.innerText = reservations.length;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

// --- RENDERIZADO DE CRONOGRAMA ---
function renderSchedule() {
  const now = getSimulatedDate();
  const day = now.getDay();
  const curMins = now.getHours() * 60 + now.getMinutes();
  const todayData = SCHEDULE_DATA[day] || {};
  const scheduleArea = document.getElementById('dynamic-schedule-area');

  if (!scheduleArea) return;

  // Sincronizar el selector de días interactivo del título
  const selectDayEl = document.getElementById('day-title-select');
  if (selectDayEl) {
    const todayDayIndex = getSimulatedDate().getDay();
    const dayNames = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado'
    };
    
    let optionsHtml = '';
    for (let i = 1; i <= 6; i++) {
      const isToday = (i === todayDayIndex);
      const label = isToday ? `HOY (${dayNames[i]})` : dayNames[i];
      optionsHtml += `<option value="${i}" class="bg-[#121212] text-white">${label}</option>`;
    }
    selectDayEl.innerHTML = optionsHtml;
    selectDayEl.value = String(selectedDayView);
  }

  // Actualizar los selectores de categorías comparativos
  renderCategorySelectors();

  // Actualizar fondo de Horarios según filtro activo
  const defaultImg = categoryFilter === 'ALL' ? 'assets/images/cardio.jpg' : (CATEGORY_IMAGES[categoryFilter] || 'assets/images/cardio.jpg');
  setTimeout(() => {
    changeGlobalBackground(defaultImg);
  }, 30);

  if (activeView === 'live') {
    let activeList = [];
    let soonList = [];
    let laterList = [];

    Object.keys(todayData).forEach(room => {
      (todayData[room] || []).forEach(cls => {
        if (!isCategoryMatched(CATEGORY_MAP[cls.n] || 'Otros', categoryFilter)) return;

        const tm = getMins(cls.t);
        const item = { ...cls, roomCode: room, mins: tm };

        if (curMins >= tm && curMins < tm + 60) { 
          activeList.push(item); 
        } else if (curMins < tm) {
          if (tm - curMins <= 90) soonList.push(item);
          else laterList.push(item);
        }
      });
    });

    const sorter = (a, b) => a.mins - b.mins;
    activeList.sort(sorter);
    soonList.sort(sorter);
    laterList.sort(sorter);

    // Si no hay clases activas "Ahora mismo", unificar todo en la sección "Y después"
    if (activeList.length === 0) {
      laterList = [...soonList, ...laterList];
      laterList.sort(sorter);
      soonList = [];
    }

    let html = '';

    if (activeList.length > 0) {
      html += `
        <section>
          <div class="status-header">AHORA MISMO</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
            ${activeList.map(c => renderCardHtml(c, (curMins - c.mins <= 15 ? 'just-started' : 'active'))).join('')}
          </div>
        </section>
      `;
    }

    if (soonList.length > 0) {
      html += `
        <section class="mt-8">
          <div class="status-header">SIGUIENTES</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
            ${soonList.map(c => renderCardHtml(c, 'soon')).join('')}
          </div>
        </section>
      `;
    }

    if (laterList.length > 0) {
      html += `
        <section class="mt-8">
          <div class="status-header">Y DESPUÉS</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
            ${laterList.map(c => renderCardHtml(c, 'later')).join('')}
          </div>
        </section>
      `;
    }

    if (activeList.length === 0 && soonList.length === 0 && laterList.length === 0) {
      html += `
        <div class="text-center text-white/40 font-bold py-16 uppercase tracking-widest text-xs font-michroma">
          Sin actividades pendientes para esta categoría hoy
        </div>
      `;
    }

    scheduleArea.innerHTML = html;

  } else if (activeView === 'day') {
    const viewDayData = SCHEDULE_DATA[selectedDayView] || {};
    let allDayList = [];

    Object.keys(viewDayData).forEach(room => {
      (viewDayData[room] || []).forEach(cls => {
        if (!isCategoryMatched(CATEGORY_MAP[cls.n] || 'Otros', categoryFilter)) return;
        if (cls.isMuscOpenHours) return; // Se muestra como encabezado, no como tarjeta
        allDayList.push({ ...cls, roomCode: room, mins: getMins(cls.t) });
      });
    });
    allDayList.sort((a, b) => a.mins - b.mins);

    let muscHeaderHtml = '';
    if (categoryFilter === 'Musculación') {
      let muscHours = GYM_INFO.musculacionHours.weekdays;
      if (selectedDayView === 6) muscHours = GYM_INFO.musculacionHours.saturdays;
      if (selectedDayView === 0) muscHours = GYM_INFO.musculacionHours.sundays;
      muscHeaderHtml = `
        <div class="space-y-4 max-w-xl mx-auto mb-6">
          <div class="bg-[#0a0a0a] border border-[#0effc7]/20 p-4 rounded-xl text-center">
            <span class="text-[10px] font-michroma text-[#0effc7]/70 uppercase tracking-widest block mb-1">Horario de Atención de la Sala</span>
            <div class="text-base md:text-lg font-michroma text-white font-bold">${muscHours}</div>
          </div>
          <div class="bg-[#0b0b0b]/60 border border-white/10 p-5 rounded-2xl text-center">
            <span class="text-[10px] font-michroma text-[#0effc7] uppercase tracking-widest block mb-1">Guía de Entrenamiento</span>
            <p class="text-xs text-white/80 font-sans leading-relaxed">
              La sala de Musculación está disponible para libre entrenamiento durante todo el día. Revisa los turnos de los instructores en cada tarjeta a continuación para contar con asistencia presencial y guía de rutina.
            </p>
          </div>
        </div>
      `;
    }

    let html = `
      <section class="space-y-6">
        ${muscHeaderHtml}

        ${allDayList.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 px-2 sm:px-0">
            ${allDayList.map(c => renderCardHtml(c, 'soon', true)).join('')}
          </div>
        ` : `
          <div class="text-center text-white/40 font-bold py-16 uppercase tracking-widest text-xs font-michroma">
            No hay clases programadas para este día o filtro
          </div>
        `}
      </section>
    `;

    scheduleArea.innerHTML = html;
  }
}

// --- RENDER CARD INDIVIDUAL ---
function renderCardHtml(item, statusType, forceWhiteBorder = false) {
  let label = '';
  let cardClass = '';
  let color = '';

  if (forceWhiteBorder) {
    cardClass = 'status-white';
    color = '#ffffff';
  } else if (statusType === 'just-started') { 
    label = 'Acaba de comenzar'; 
    cardClass = 'status-just-started'; 
    color = 'var(--color-just-started)'; 
  } else if (statusType === 'active') { 
    label = 'Ahora mismo'; 
    cardClass = 'status-active'; 
    color = 'var(--color-active)'; 
  } else if (statusType === 'later') { 
    label = 'Espera'; 
    cardClass = 'status-later'; 
    color = 'var(--color-later)'; 
  } else { 
    label = 'Siguiente'; 
    cardClass = 'status-upcoming'; 
    color = 'var(--color-upcoming)'; 
  }

  const cat = CATEGORY_MAP[item.n] || "Grupales";
  const roomName = ROOM_MAP[item.roomCode] || item.roomCode;
  const isBooked = isClassBooked(item.id);
  const seatsAvailable = getAvailableSeats(item.id, item.cap || 20);

  let seatsBadgeClass = 'seats-badge';
  if (seatsAvailable <= 3) seatsBadgeClass += ' low';
  if (seatsAvailable === 0) seatsBadgeClass += ' full';

  const statusLabel = (activeView === 'live' && label) ? `
    <div class="status-label tactic-bold" style="color: ${color}">
      <span class="pulse-dot" style="background: ${color}"></span> ${label}
    </div>
  ` : '';

  const now = getSimulatedDate();
  const todayDayIndex = now.getDay();
  const isToday = (activeView === 'live' || selectedDayView === todayDayIndex);
  const curMins = now.getHours() * 60 + now.getMinutes();
  const classStartMins = getMins(item.t);
  const hasStarted = isToday && (curMins >= classStartMins);
  let isExpired = false;
  if (isToday) {
    let endMins = classStartMins + 60; // por defecto 60 min
    if (item.range) {
      const parts = item.range.split(' - ');
      if (parts.length === 2) {
        endMins = getMins(parts[1].trim());
      }
    }
    if (curMins >= endMins) {
      isExpired = true;
    }
  }

  let btnHtml = '';
  if (cat === 'Musculación') {
    // Musculación no tiene reservas individuales por turno de instructor
    btnHtml = '';
  } else if (hasStarted) {
    if (isBooked) {
      btnHtml = `<button onclick="openUserProfileModal()" class="btn-reserve btn-started-inactive" style="border: none;">✓ EN CURSO</button>`;
    } else {
      btnHtml = `<button onclick="handleStartedClassClick('${item.n}')" class="btn-reserve btn-started-inactive" style="border: none;">INICIADA</button>`;
    }
  } else if (isBooked) {
    btnHtml = `<button onclick="openUserProfileModal()" class="btn-reserve reserved" style="border: none;">✓ RESERVADO</button>`;
  } else if (seatsAvailable === 0) {
    btnHtml = `<button class="btn-reserve full" disabled style="border: none; background: #e11d48 !important; color: #ffffff !important; opacity: 1 !important;">CLASE LLENA</button>`;
  } else {
    btnHtml = `<button onclick="openReserveModal('${item.id}', '${item.n}', '${item.t}', '${item.roomCode}', '${item.i}')" class="btn-reserve" style="border: none;">RESERVAR</button>`;
  }

  const displayTime = item.range || `${item.t} hs`;
  const imgPath = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES["Otros"];

  // Clase CSS de vigencia por expiración
  let expiredCardClass = '';
  if (isExpired) {
    expiredCardClass = 'opacity-65 border-white/5 bg-[#121212]/50 grayscale-[40%] pointer-events-none';
  }

  if (cat === 'Musculación') {
    return `
      <div class="class-card ${cardClass} ${expiredCardClass}" onmouseenter="changeGlobalBackground('${imgPath}')">
        <div class="card-header-gray">
          <span>${roomName}</span>
          <span class="text-xs uppercase font-michroma opacity-75">${cat}</span>
        </div>
        <div class="card-body">
          ${statusLabel}
          <div class="text-lg md:text-xl font-michroma font-bold text-[#ffdd00] tracking-tight mb-1.5">${displayTime}</div>
          <div class="class-name tactic-bold">${formatInstructor(item.i)}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="class-card ${cardClass} ${expiredCardClass}" onmouseenter="changeGlobalBackground('${imgPath}')">
      <div class="card-header-gray">
        <span>${roomName}</span>
        <span class="text-xs uppercase font-michroma opacity-75">${cat}</span>
      </div>
      <div class="card-body">
        ${statusLabel}
        <div class="text-lg md:text-xl font-michroma font-bold text-[#ffdd00] tracking-tight mb-1.5">${displayTime}</div>
        <div class="class-name tactic-bold">${item.n}</div>
        <div class="instructor-name">Con ${formatInstructor(item.i)}</div>
        
        ${btnHtml ? `
        <div class="pt-1 flex flex-col gap-3">
          ${btnHtml}
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

// --- PANTALLAS DE RESERVA Y PROCESOS ---
window.openReserveModal = function(classId, className, time, roomCode, instructor) {
  currentBookingData = { classId, className, time, roomCode, instructor };
  
  const titleEl = document.getElementById('modal-class-title');
  const detailsEl = document.getElementById('modal-class-details');
  const modal = document.getElementById('modal-reserve');

  if (titleEl) titleEl.innerText = className;
  if (detailsEl) {
    const roomName = ROOM_MAP[roomCode] || roomCode;
    detailsEl.innerHTML = `
      <div><strong>Hora:</strong> ${time} hs</div>
      <div><strong>Ubicación:</strong> ${roomName}</div>
      <div><strong>Instructor:</strong> ${formatInstructor(instructor)}</div>
      <div><strong>Día:</strong> ${DAY_NAMES[selectedDayView || new Date().getDay()]}</div>
    `;
  }

  const confirmBtn = document.getElementById('btn-confirm-booking');
  if (confirmBtn) {
    confirmBtn.onclick = function() {
      confirmBooking();
    };
  }

  if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  if (modalId === 'modal-notifications') {
    const btn = document.querySelector('.header-icon-btn.bell-btn');
    if (btn) btn.classList.remove('active');
  }
  if (modalId === 'modal-user-profile') {
    const btn = document.querySelector('.header-icon-btn.user-btn');
    if (btn) btn.classList.remove('active');
  }
};

window.handleStartedClassClick = function(className) {
  showToast(`La clase de ${className} ya ha comenzado y no acepta más reservas.`, 'info');
};


function confirmBooking() {
  if (!currentBookingData) return;

  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  if (!profile) {
    closeModal('modal-reserve');
    const regOverlay = document.getElementById('registration-overlay');
    if (regOverlay) regOverlay.classList.remove('hidden');
    showToast("Por favor, completa tus datos para poder reservar.", "error");
    return;
  }

  // 1. Evitar reservas duplicadas de la misma clase
  if (isClassBooked(currentBookingData.classId)) {
    closeModal('modal-reserve');
    showToast("Ya tienes una reserva activa para esta clase.", "error");
    return;
  }

  // 2. Evitar reservas empalmadas en el mismo horario y fecha
  const todayDateStr = getTodayDateString();
  const hasOverlap = getMyReservations().some(r => r.date === todayDateStr && r.time === currentBookingData.time);
  if (hasOverlap) {
    closeModal('modal-reserve');
    showToast("Ya tienes otra clase reservada para este horario.", "error");
    return;
  }

  // 3. Validar aforo máximo al momento de confirmar
  const capacity = ROOM_CAPACITIES[currentBookingData.roomCode] || 20;
  const seatsAvailable = getAvailableSeats(currentBookingData.classId, capacity);
  if (seatsAvailable <= 0) {
    closeModal('modal-reserve');
    showToast("Lo sentimos, esta clase se acaba de llenar.", "error");
    return;
  }

  const newBooking = {
    id: `${currentBookingData.classId}_${profile.id}`,
    classId: currentBookingData.classId,
    className: currentBookingData.className,
    time: currentBookingData.time,
    roomCode: currentBookingData.roomCode,
    instructor: currentBookingData.instructor,
    dayName: DAY_NAMES[selectedDayView || new Date().getDay()],
    date: todayDateStr,
    deviceId: profile.id,
    userName: profile.name,
    userPhone: profile.phone
  };

  db_saveBooking(newBooking);

  closeModal('modal-reserve');
  showToast(`¡Reserva confirmada para ${currentBookingData.className}!`, 'success');
  
  renderSchedule();
  renderReservations();
  updateReservationBadge();
}

window.cancelBooking = function(classId) {
  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  if (!profile) return;

  // 4. Impedir cancelar reservas de clases que ya iniciaron o pasaron
  const booking = db_getBookings().find(b => b.classId === classId && b.deviceId === profile.id);
  if (booking) {
    const now = getSimulatedDate();
    const curDateStr = getTodayDateString();
    if (booking.date === curDateStr) {
      const curMins = now.getHours() * 60 + now.getMinutes();
      const classStartMins = getMins(booking.time);
      if (curMins >= classStartMins) {
        showToast("No se puede cancelar una clase que ya está en curso o finalizada.", "error");
        return;
      }
    } else if (booking.date < curDateStr) {
      showToast("No se pueden cancelar clases de días pasados.", "error");
      return;
    }
  }

  db_deleteBooking(classId, profile.id);
  
  showToast('Reserva cancelada correctamente', 'info');
  renderReservations();
  renderSchedule();
  updateReservationBadge();
};

// --- LISTAR RESERVAS PERSONALES ---
function renderReservations() {
  const container = document.getElementById('reservas-list-container');
  if (!container) return;

  const reservations = getMyReservations();

  if (reservations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 space-y-4">
        <div class="text-white/30 font-michroma text-xs uppercase tracking-widest font-michroma">No tienes reservas activas</div>
        <button onclick="switchTab('horarios')" class="bg-white text-black font-michroma font-bold text-xs px-6 py-3 rounded-lg hover:bg-[#0effc7] font-michroma">
          EXPLORAR CLASES
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = reservations.map(r => `
    <div class="bg-[#202020] border-2 border-[#0effc7] p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="space-y-1 font-sans">
        <span class="text-xs font-michroma text-[#0effc7] uppercase tracking-wider block">RESERVADO</span>
        <h4 class="text-xl font-michroma text-white">${r.className}</h4>
        <div class="text-xs text-white/70">
          ${r.dayName} • ${r.time} hs • ${ROOM_MAP[r.roomCode] || r.roomCode} • Instructora: ${formatInstructor(r.instructor)}
        </div>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <button onclick="cancelBooking('${r.classId}')" class="flex-1 md:flex-none border border-red-500/50 text-red-400 font-michroma text-[10px] px-4 py-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
          CANCELAR
        </button>
      </div>
    </div>
  `).join('');
}

// --- PORTAL STAFF (LOGIN Y ACCESO) ---
function renderStaffPortal() {
  const staff = sessionStorage.getItem('formas_staff_logged');
  
  const loginCard = document.getElementById('staff-login-card');
  const panelAdmin = document.getElementById('panel-admin');
  const panelInstructor = document.getElementById('panel-instructor');

  if (!loginCard || !panelAdmin || !panelInstructor) return;

  if (!staff) {
    // Mostrar login
    loginCard.classList.remove('hidden');
    panelAdmin.classList.add('hidden');
    panelInstructor.classList.add('hidden');
  } else if (staff === 'RECEPCION') {
    // Mostrar admin
    loginCard.classList.add('hidden');
    panelAdmin.classList.remove('hidden');
    panelInstructor.classList.add('hidden');
    renderAdminPanel();
  } else {
    // Mostrar instructor (staff guarda el nombre del instructor)
    loginCard.classList.add('hidden');
    panelAdmin.classList.add('hidden');
    panelInstructor.classList.remove('hidden');
    renderInstructorPanel(staff);
  }
}

window.handleStaffLogin = function() {
  const passcode = document.getElementById('staff-passcode').value.trim().toUpperCase();
  
  if (!passcode) return;

  if (passcode === 'RECEPCION-STAFF') {
    sessionStorage.setItem('formas_staff_logged', 'RECEPCION');
    showToast('Ingreso autorizado: Panel Recepción', 'success');
  } else if (passcode.endsWith('-STAFF')) {
    const instructorName = passcode.replace('-STAFF', '');
    sessionStorage.setItem('formas_staff_logged', instructorName);
    showToast(`Ingreso autorizado: Instructor/a ${instructorName}`, 'success');
  } else {
    showToast('Clave incorrecta. Intente con RICKY-staff o RECEPCION-staff', 'error');
    return;
  }

  document.getElementById('staff-passcode').value = '';
  renderStaffPortal();
};

window.logoutStaff = function() {
  sessionStorage.removeItem('formas_staff_logged');
  localStorage.removeItem('formas_client_mode');
  showToast('Sesión cerrada', 'info');
  
  const roleOverlay = document.getElementById('role-selector-overlay');
  if (roleOverlay) {
    roleOverlay.classList.remove('hidden');
    cancelStaffLogin();
  }

  // Ocultar toda la navegación del menú inferior
  const allNavs = ['nav-horarios', 'nav-gimnasio', 'nav-ofertas', 'nav-staff'];
  allNavs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
};

// --- PANEL DE ADMINISTRACIÓN (Lógica) ---
function renderAdminPanel() {
  const sociosList = document.getElementById('admin-socios-list');
  const statsContainer = document.getElementById('admin-reservas-stats');
  
  if (!sociosList || !statsContainer) return;

  const devices = db_getDevices();
  const bookings = db_getBookings();

  // 1. Listar Socios con Interruptor Activo/Inactivo
  if (devices.length === 0) {
    sociosList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-white/40">No hay dispositivos registrados</td></tr>`;
  } else {
    sociosList.innerHTML = devices.map(d => {
      const isActive = d.status === 'Activo';
      const statusColor = d.status === 'Activo' ? 'text-[#0effc7]' : (d.status === 'Pendiente' ? 'text-[#fddb00]' : 'text-red-500');
      
      return `
        <tr class="border-b border-[#111]">
          <td class="py-3 font-mono font-bold">${d.id}</td>
          <td class="py-3 font-michroma text-[10px] text-white">${d.name}</td>
          <td class="py-3">${d.phone}</td>
          <td class="py-3 text-center">
            <div class="flex items-center justify-center gap-3">
              <span class="text-[9px] uppercase font-michroma ${statusColor}">${d.status}</span>
              <button 
                onclick="toggleSocioStatus('${d.id}', '${d.status}')"
                class="px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-[#0effc7]/20 text-[#0effc7] hover:bg-[#0effc7] hover:text-black'}"
              >
                ${isActive ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. Mostrar Estadísticas de Reservas del Día
  const day = getSimulatedDate().getDay();
  const todayClassesData = SCHEDULE_DATA[day] || {};
  let classesArray = [];
  
  Object.keys(todayClassesData).forEach(room => {
    todayClassesData[room].forEach(cls => {
      const bookedUsers = bookings.filter(b => b.classId === cls.id && b.date === getTodayDateString());
      classesArray.push({
        ...cls,
        roomName: ROOM_MAP[room],
        bookedCount: bookedUsers.length,
        users: bookedUsers
      });
    });
  });

  if (classesArray.length === 0) {
    statsContainer.innerHTML = `<div class="text-center text-white/40 text-xs py-4">No hay clases hoy</div>`;
  } else {
    statsContainer.innerHTML = classesArray.map(c => `
      <div class="bg-[#141414] border border-[#222] p-3 rounded-lg flex justify-between items-center text-xs">
        <div>
          <div class="font-bold text-white font-michroma text-[10px]">${c.n}</div>
          <div class="text-white/50">${c.t} • ${c.roomName} • ${formatInstructor(c.i)}</div>
        </div>
        <div class="text-right">
          <span class="font-bold font-michroma text-[#0effc7]">${c.bookedCount} / ${c.cap || 20}</span>
          <div class="text-[9px] text-white/30">Cupos Reservados</div>
        </div>
      </div>
    `).join('');
  }
}

window.toggleSocioStatus = function(deviceId, currentStatus) {
  const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
  db_updateDeviceStatus(deviceId, newStatus);
  showToast(`Socio ${deviceId} marcado como ${newStatus}`, 'success');
  renderAdminPanel();
  checkUserStatus(); // Actualiza por si es el mismo usuario probando
};

// --- PANEL DE INSTRUCTORES (Lógica) ---
function renderInstructorPanel(instructorName) {
  const container = document.getElementById('instructor-classes-container');
  const nameBadge = document.getElementById('instructor-name-badge');
  const welcomeTitle = document.getElementById('instructor-welcome-title');
  
  if (!container) return;

  if (nameBadge) nameBadge.innerText = `INSTRUCTOR/A: ${instructorName}`;
  if (welcomeTitle) welcomeTitle.innerText = `CLASES DE ${instructorName}`;

  const day = getSimulatedDate().getDay();
  const todayClassesData = SCHEDULE_DATA[day] || {};
  let myClasses = [];
  const bookings = db_getBookings();

  // Buscar clases hoy asignadas a este instructor
  Object.keys(todayClassesData).forEach(room => {
    todayClassesData[room].forEach(cls => {
      if (cls.i.toUpperCase() === instructorName.toUpperCase()) {
        const bookedUsers = bookings.filter(b => b.classId === cls.id && b.date === getTodayDateString());
        myClasses.push({
          ...cls,
          roomName: ROOM_MAP[room],
          users: bookedUsers
        });
      }
    });
  });

  if (myClasses.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-white/40 text-xs font-michroma uppercase">
        No tienes clases programadas para el día de hoy
      </div>
    `;
    return;
  }

  container.innerHTML = myClasses.map(c => {
    const listHtml = c.users.length === 0 
      ? `<div class="text-white/30 italic py-2">No hay alumnos registrados en esta clase aún.</div>`
      : c.users.map((u, index) => `
          <div class="flex justify-between items-center py-2 border-b border-[#222] last:border-b-0 text-white/80">
            <span>${index + 1}. <strong class="font-michroma text-[9px] text-white">${u.userName}</strong></span>
            <span class="opacity-70">${u.userPhone}</span>
          </div>
        `).join('');

    return `
      <div class="bg-[#0a0a0a] border-2 border-[#222] p-5 rounded-xl space-y-4">
        <div class="flex justify-between items-center border-b border-[#222] pb-3">
          <div>
            <h4 class="font-michroma text-base text-[#0effc7]">${c.n}</h4>
            <div class="text-xs text-white/50">${c.t} • ${c.roomName}</div>
          </div>
          <div class="text-right">
            <span class="font-michroma font-bold text-white">${c.users.length} alumnos</span>
            <div class="text-[9px] text-white/40">Cupo total: ${c.cap || 20}</div>
          </div>
        </div>

        <div class="space-y-2 text-xs font-sans">
          <div class="text-[10px] uppercase font-michroma text-white/40 mb-1">Listado de Reservas</div>
          ${listHtml}
        </div>
      </div>
    `;
  }).join('');
}

// --- FORMULARIO DE SUGERENCIAS ---
window.sendSuggestionViaWhatsApp = function(event) {
  if (event) event.preventDefault();

  const type = document.getElementById('sug-type').value;
  const className = document.getElementById('sug-class').value.trim();
  const time = document.getElementById('sug-time').value.trim();
  const days = document.getElementById('sug-days').value.trim();
  const details = document.getElementById('sug-details').value.trim();

  let msg = `*SUGERENCIA PARA GIMNASIO FORMAS*\n`;
  msg += `*Tipo:* ${type}\n`;
  if (className) msg += `*Clase/Disciplina:* ${className}\n`;
  if (time) msg += `*Horario Deseado:* ${time}\n`;
  if (days) msg += `*Días:* ${days}\n`;
  if (details) msg += `*Detalles:* ${details}\n`;

  const url = `https://wa.me/59170000000?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  document.getElementById('suggestion-form').reset();
  showToast('Abriendo WhatsApp para enviar propuesta...', 'success');
};

// --- RENDERIZADO DEL CATÁLOGO DE DISCIPLINAS ---
const CATALOG_IMAGES = {
  "Musculación": "assets/images/musculacion.jpg",
  "Body Pump": "assets/images/aerobicos.jpg",
  "Spinning": "assets/images/spinning.jpg",
  "Funcional": "assets/images/funcional.jpg",
  "Pilates": "assets/images/control.jpg",
  "Power Jump": "assets/images/aerobicos.jpg",
  "Zumba": "assets/images/aerobicos.jpg",
  "Body Combat": "assets/images/aerobicos.jpg",
  "Stretching": "assets/images/control.jpg"
};

const CATALOG_CATEGORIES = ['Aeróbicos', 'Control', 'Spinning', 'Funcional', 'Musculación'];
let currentCatalogCategoryIndex = 0;

window.selectCatalogCategory = function(idx) {
  currentCatalogCategoryIndex = idx;
  renderCatalogCategoryControls();
  const cat = CATALOG_CATEGORIES[idx];
  const imgPath = CATEGORY_IMAGES[cat] || 'assets/images/musculacion.jpg';
  changeGlobalBackground(imgPath);

  const grid = document.getElementById('disciplines-grid');
  if (grid && grid.children[idx]) {
    grid.scrollTo({
      left: grid.children[idx].offsetLeft,
      behavior: 'smooth'
    });
  }
};

function renderCatalogCategoryControls() {
  const container = document.getElementById('catalog-category-chips-list');
  const titleEl = document.getElementById('catalog-active-category-title');
  const dotsContainer = document.getElementById('catalog-dots');

  if (container) {
    container.innerHTML = CATALOG_CATEGORIES.map((cat, idx) => {
      const isActive = (currentCatalogCategoryIndex === idx);
      const icon = CATEGORY_ICONS[cat] || '';
      const zoomTransform = isActive ? (CATEGORY_HEAD_ZOOM_TRANSFORMS[cat] || 'scale(2.5)') : 'scale(1) translate(0, 0)';
      return `
        <button onclick="selectCatalogCategory(${idx})" aria-label="${cat}" class="flex-1 focus:outline-none transition-all duration-200 active:scale-95 cursor-pointer">
          <div class="aspect-square w-full rounded-2xl border-2 overflow-hidden flex items-center justify-center p-1.5 sm:p-2.5 transition-all duration-300 ${isActive ? 'border-[#0effc7] bg-[#0d2a23] text-[#0effc7] shadow-[0_0_14px_rgba(14,255,199,0.4)] scale-105' : 'border-white/15 bg-[#161616] text-white/65 hover:border-white/35 hover:bg-[#202020]'}" style="transform: translateZ(0);">
            <div class="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center" style="transform: ${zoomTransform};">
              ${icon}
            </div>
          </div>
        </button>
      `;
    }).join('');
  }

  if (titleEl) {
    const cat = CATALOG_CATEGORIES[currentCatalogCategoryIndex] || 'Aeróbicos';
    const count = DISCIPLINES_CATALOG.filter(d => d.category === cat).length;
    titleEl.innerHTML = `
      <span>${cat}</span>
      <span class="text-white/40">•</span>
      <span class="text-white/70">${count} ${count === 1 ? 'disciplina' : 'disciplinas'}</span>
    `;
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = CATALOG_CATEGORIES.map((cat, idx) => `
      <button onclick="selectCatalogCategory(${idx})" class="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentCatalogCategoryIndex ? 'bg-[#0effc7] scale-125' : 'bg-white/20 hover:bg-white/40'}" aria-label="Ir a ${cat}"></button>
    `).join('');
  }
}

function renderDisciplines() {
  const grid = document.getElementById('disciplines-grid');
  if (!grid) return;

  renderCatalogCategoryControls();

  const activeCat = CATALOG_CATEGORIES[currentCatalogCategoryIndex] || 'Aeróbicos';
  const initialBg = CATEGORY_IMAGES[activeCat] || 'assets/images/aerobicos.jpg';
  setTimeout(() => {
    changeGlobalBackground(initialBg);
  }, 50);

  function getBenefitSvg(benefit) {
    const b = benefit.toLowerCase();
    let path = '';
    // Dumbbell / Barbell para fuerza
    if (b.includes("fuerza") || b.includes("hipertrofia") || b.includes("tonificación") || b.includes("muscular")) {
      path = '<path d="M6 5h2v14H6zm10 0h2v14h-2zM9 11h6v2H9z"/>';
    }
    // Flame para calorías / grasa
    else if (b.includes("caloría") || b.includes("quema") || b.includes("grasa") || b.includes("peso")) {
      path = '<path d="M12 2.69C12 2.69 8 8 8 11.5c0 2.21 1.79 4 4 4s4-1.79 4-4c0-3.5-4-8.81-4-8.81z"/>';
    }
    // Heart para cardio / resistencia
    else if (b.includes("resistencia") || b.includes("cardio") || b.includes("aeróbic") || b.includes("corazón") || b.includes("física")) {
      path = '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>';
    }
    // Yoga / Lotus pose para flexibilidad / relajación
    else if (b.includes("flexibilidad") || b.includes("prevención") || b.includes("relajación") || b.includes("postura") || b.includes("estrés") || b.includes("articular") || b.includes("relax")) {
      path = '<path d="M12 3a2 2 0 100 4 2 2 0 000-4zm4.5 10.5L12 10.75l-4.5 2.75V19h2v-3.5h5V19h2v-5.5z"/>';
    }
    // Target para coordinación / agilidad
    else {
      path = '<path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>';
    }
    return `<svg class="w-4 h-4 text-white/60 fill-current" viewBox="0 0 24 24">${path}</svg>`;
  }

  grid.innerHTML = CATALOG_CATEGORIES.map((cat, catIdx) => {
    const disciplines = DISCIPLINES_CATALOG.filter(d => d.category === cat);
    const iconSvg = getCatalogCategoryIconSvg(cat);
    const imgPath = CATEGORY_IMAGES[cat] || 'assets/images/musculacion.jpg';

    const cardsHtml = disciplines.map(d => {
      // Generar badges de cualidades con escala de 5 puntos en tonos grises (cuadrados)
      const benefitsHtml = d.benefits.map(b => {
        const activeDots = '<span class="text-white/80 font-sans">■</span>'.repeat(b.points);
        const inactiveDots = '<span class="text-white/20 font-sans">■</span>'.repeat(5 - b.points);
        return `
          <span class="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded text-white/80 font-sans font-semibold flex items-center gap-2">
            ${getBenefitSvg(b.text)}
            <span>${b.text}</span>
            <span class="flex gap-0.5 ml-1 tracking-tighter">${activeDots}${inactiveDots}</span>
          </span>
        `;
      }).join('');

      let roomText = d.room;
      if (roomText.toLowerCase().startsWith("sala")) {
        roomText = roomText;
      } else if (roomText.toLowerCase().includes("piso")) {
        roomText = `Aeróbicos ${roomText}`;
      } else {
        roomText = `Sala de ${roomText}`;
      }

      return `
        <div class="glass-card rounded-2xl flex flex-col justify-between overflow-hidden w-full group border border-white/20 shadow-xl shrink-0" onmouseenter="changeGlobalBackground('${imgPath}')">
          <!-- IMAGEN PRINCIPAL DE LA TARJETA (ICONO VECTORIAL HERO) -->
          <div class="w-full h-40 sm:h-48 bg-gradient-to-b from-white/[0.08] via-black/40 to-transparent flex items-center justify-center relative overflow-hidden border-b border-white/10">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,255,199,0.14)_0%,transparent_70%)] pointer-events-none"></div>

            <!-- Chip de Categoría flotante -->
            <div class="absolute top-3.5 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
              <span class="w-1.5 h-1.5 rounded-full bg-[#0effc7]"></span>
              <span class="text-[10px] font-michroma font-bold text-white/90 uppercase tracking-wider">${d.category}</span>
            </div>

            <!-- Chip de Sala flotante -->
            <div class="absolute top-3.5 right-4 z-10 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
              <span class="text-[10px] font-michroma text-white/70 tracking-wider">${roomText}</span>
            </div>

            <!-- Icono SVG Principal -->
            <div class="relative z-10 text-[#0effc7] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center p-2">
              ${iconSvg}
            </div>
          </div>

          <!-- Encabezado con Nombre y Duración -->
          <div class="flex justify-between items-center bg-white/5 px-5 py-3.5 border-b border-white/5">
            <h4 class="font-michroma text-base md:text-lg text-[#ffdd00] font-bold tracking-tight">${d.name}</h4>
            <span class="text-xs font-sans text-white/60 font-semibold">Duración: ${d.duration}</span>
          </div>

          <!-- Cuerpo de la tarjeta con padding -->
          <div class="p-5 flex-1 flex flex-col justify-between gap-4">
            <div class="space-y-3">
              <p class="text-sm text-white/80 font-sans leading-relaxed font-semibold">${d.description}</p>
              
              <!-- Recomendación concisa -->
              <div class="bg-black/30 border border-white/5 p-3 rounded-lg text-xs font-sans text-white/70 leading-relaxed font-semibold">
                <span class="text-[#ffdd00] uppercase font-bold tracking-wider text-[10px] block mb-1">Recomendado para:</span>
                ${d.recommended}
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex flex-wrap gap-2 pt-1">
                ${benefitsHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="w-full shrink-0 snap-center snap-always px-2 sm:px-4 flex flex-col items-center" data-category="${cat}" data-index="${catIdx}">
        <div class="w-full max-w-xl flex flex-col gap-6 max-h-[66vh] md:max-h-[72vh] overflow-y-auto no-scrollbar pb-16 touch-pan-y" style="-webkit-overflow-scrolling: touch;">
          ${cardsHtml}
        </div>
      </div>
    `;
  }).join('');

  // Setup Intersection Observer para sincronizar swipe horizontal con controles y fondos
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(idx) && idx !== currentCatalogCategoryIndex) {
            currentCatalogCategoryIndex = idx;
            renderCatalogCategoryControls();
            const cat = CATALOG_CATEGORIES[idx];
            changeGlobalBackground(CATEGORY_IMAGES[cat] || 'assets/images/musculacion.jpg');
          }
        }
      });
    }, {
      root: grid,
      threshold: 0.55
    });

    Array.from(grid.children).forEach(slide => {
      observer.observe(slide);
    });

    // Restaurar posición si ya había una categoría seleccionada
    if (currentCatalogCategoryIndex > 0 && grid.children[currentCatalogCategoryIndex]) {
      grid.scrollTo({
        left: grid.children[currentCatalogCategoryIndex].offsetLeft,
        behavior: 'auto'
      });
    }
  }, 100);
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="w-4 h-4 fill-current text-[#0effc7]" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- CLICKS EN LOGO (EASTER EGG DE ACTIVACIÓN DEL NAV STAFF) ---
let logoClicks = 0;
window.handleLogoClick = function() {
  switchTab('horarios');
  
  logoClicks++;
  if (logoClicks >= 5) {
    const navStaff = document.getElementById('nav-staff');
    if (navStaff) {
      const isHidden = navStaff.style.display === 'none';
      navStaff.style.display = isHidden ? 'flex' : 'none';
      showToast(isHidden ? 'Acceso Staff habilitado' : 'Acceso Staff ocultado', 'info');
    }
    logoClicks = 0;
  }
};

// --- ENLACES DE CABECERA Y MODALES RELACIONADOS ---
window.openWhatsAppChat = function() {
  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  const code = profile ? profile.id : 'NUEVO';
  const url = `https://wa.me/59177012345?text=Hola%20Gym%20Formas,%20necesito%20asistencia.%20Código%20de%20dispositivo:%20${code}`;
  window.open(url, '_blank');
};

window.openNotificationsModal = function() {
  const modal = document.getElementById('modal-notifications');
  if (modal) modal.classList.add('active');
  const btn = document.querySelector('.header-icon-btn.bell-btn');
  if (btn) btn.classList.add('active');
};

window.openUserProfileModal = function() {
  const staff = sessionStorage.getItem('formas_staff_logged');
  const profile = JSON.parse(localStorage.getItem(MY_PROFILE));
  const modal = document.getElementById('modal-user-profile');

  const nameEl = document.getElementById('profile-modal-name');
  const roleEl = document.getElementById('profile-modal-role');
  const codeEl = document.getElementById('profile-modal-code');
  const statusEl = document.getElementById('profile-modal-status');
  const phoneEl = document.getElementById('profile-modal-phone');

  if (staff) {
    if (nameEl) nameEl.innerText = staff === 'RECEPCION' ? 'Administrador Recepción' : `Instructor ${staff}`;
    if (roleEl) roleEl.innerText = 'Personal / Staff';
    if (codeEl) codeEl.innerText = `${staff}-staff`;
    if (statusEl) statusEl.innerText = 'Sesión Activa';
    if (phoneEl) phoneEl.innerText = '--';
  } else if (profile) {
    // Buscar su estado actual en la BD de la app
    const devices = db_getDevices();
    const dbDevice = devices.find(d => d.id === profile.id);
    const currentStatus = dbDevice ? dbDevice.status : profile.status;

    if (nameEl) nameEl.innerText = profile.name;
    if (roleEl) roleEl.innerText = 'Socio / Cliente';
    if (codeEl) codeEl.innerText = profile.id;
    if (statusEl) {
      statusEl.innerText = currentStatus;
      statusEl.className = currentStatus === 'Activo' ? 'font-bold text-[#0effc7]' : 'font-bold text-[#fddb00]';
    }
    if (phoneEl) phoneEl.innerText = profile.phone;
  } else {
    if (nameEl) nameEl.innerText = 'Socio Invitado';
    if (roleEl) roleEl.innerText = 'No Registrado';
    if (codeEl) codeEl.innerText = '--';
    if (statusEl) statusEl.innerText = 'Inactivo';
    if (phoneEl) phoneEl.innerText = '--';
  }

  // Renderizar la lista de reservas del usuario en su perfil
  renderReservations();

  if (modal) modal.classList.add('active');
  const btn = document.querySelector('.header-icon-btn.user-btn');
  if (btn) btn.classList.add('active');
};

window.copyDeviceCode = function() {
  const codeEl = document.getElementById('profile-modal-code');
  if (codeEl && codeEl.innerText !== '--') {
    navigator.clipboard.writeText(codeEl.innerText)
      .then(() => showToast('Código copiado al portapapeles', 'success'))
      .catch(() => showToast('No se pudo copiar el código', 'error'));
  } else {
    showToast('No hay código disponible para copiar', 'error');
  }
};

window.exitProfileSession = function() {
  const staff = sessionStorage.getItem('formas_staff_logged');
  if (staff) {
    logoutStaff();
    closeModal('modal-user-profile');
  } else {
    localStorage.removeItem(MY_PROFILE);
    localStorage.removeItem('formas_client_mode');
    sessionStorage.removeItem('formas_staff_logged');
    showToast('Sesión reiniciada', 'info');
    closeModal('modal-user-profile');
    location.reload();
  }
};

// --- BOTTOM SHEET FILTROS DE HORARIOS (OPCIÓN B) ---
let tempActiveView = 'live';
let tempSelectedDayView = 1;
let tempCategoryFilter = 'ALL';

window.openFilterSheet = function() {
  tempActiveView = activeView;
  tempSelectedDayView = selectedDayView;
  tempCategoryFilter = categoryFilter;

  // Actualizar UI del panel
  updateTempFilterUI();

  // Mostrar el panel con animación
  const overlay = document.getElementById('filter-sheet-overlay');
  const sheet = document.getElementById('filter-bottom-sheet');
  if (overlay && sheet) {
    overlay.classList.remove('hidden');
    // Forzar reflow para animación
    overlay.offsetHeight;
    overlay.style.opacity = '1';
    sheet.style.transform = 'translateY(0)';
    document.body.classList.add('bottom-sheet-active');
  }
};

window.closeFilterSheet = function() {
  const overlay = document.getElementById('filter-sheet-overlay');
  const sheet = document.getElementById('filter-bottom-sheet');
  if (overlay && sheet) {
    overlay.style.opacity = '0';
    sheet.style.transform = 'translateY(100%)';
    document.body.classList.remove('bottom-sheet-active');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  }
};

window.setTempView = function(view) {
  tempActiveView = view;
  updateTempFilterUI();
};

window.setTempDay = function(day) {
  tempSelectedDayView = day;
  updateTempFilterUI();
};

window.setTempCategory = function(cat) {
  tempCategoryFilter = cat;
  updateTempFilterUI();
};

function updateTempFilterUI() {
  // Vista
  const tabLive = document.getElementById('temp-tab-live');
  const tabDay = document.getElementById('temp-tab-day');
  if (tabLive && tabDay) {
    if (tempActiveView === 'live') {
      tabLive.className = 'py-2.5 rounded-lg text-xs font-bold text-center temp-view-btn-active';
      tabDay.className = 'py-2.5 rounded-lg text-xs font-bold text-center temp-view-btn-inactive';
      // Ocultar selector de día en vivo ya que es "Hoy"
      document.getElementById('temp-day-selector-group').style.display = 'none';
    } else {
      tabLive.className = 'py-2.5 rounded-lg text-xs font-bold text-center temp-view-btn-inactive';
      tabDay.className = 'py-2.5 rounded-lg text-xs font-bold text-center temp-view-btn-active';
      document.getElementById('temp-day-selector-group').style.display = 'block';
    }
  }

  // Días
  for (let d = 1; d <= 6; d++) {
    const btn = document.getElementById(`temp-day-${d}`);
    if (btn) {
      if (tempSelectedDayView === d) {
        btn.className = 'border border-[#0effc7] bg-white/5 text-[#0effc7] py-2.5 rounded-xl text-xs font-bold filter-btn-active';
      } else {
        btn.className = 'border border-white/10 bg-white/5 hover:border-white/30 text-white py-2.5 rounded-xl text-xs font-bold transition-all';
      }
    }
  }

  // Categorías
  const categories = ['ALL', 'Control', 'Spinning', 'Funcional', 'Aeróbicos', 'Musculación'];
  categories.forEach(cat => {
    const btn = document.getElementById(`temp-cat-${cat}`);
    if (btn) {
      if (tempCategoryFilter === cat) {
        btn.className = 'border border-[#0effc7] bg-white/5 text-[#0effc7] py-2.5 rounded-xl text-xs font-bold filter-btn-active';
      } else {
        btn.className = 'border border-white/10 bg-white/5 hover:border-white/30 text-white py-2.5 rounded-xl text-xs font-bold transition-all';
      }
    }
  });
}

window.applyFilters = function() {
  activeView = tempActiveView;
  selectedDayView = tempSelectedDayView;
  categoryFilter = tempCategoryFilter;

  closeFilterSheet();
  renderSchedule();
};


