const STORAGE_KEYS = {
  users: "utp_users",
  vehicles: "utp_vehicles",
  spaces: "utp_spaces",
  notices: "utp_notices",
  history: "utp_history",
  session: "utp_session"
};

const initialUser = {
  codigo: "u22210840",
  password: "123456",
  nombre: "Brayan Meza",
  rol: "admin"
};

const initialNotices = [
  "El estacionamiento cierra a las 10:00 p.m.",
  "Usar casco obligatorio para motociclistas.",
  "No estacionarse en zonas verdes.",
  "Respetar las flechas de circulacion."
];

let currentUser = null;
let selectedSpace = "";
let deferredInstallPrompt = null;

const viewTitles = {
  inicio: "Inicio",
  mapa: "Mapa",
  registro: "Registro",
  vehiculos: "Vehiculos",
  perfil: "Perfil"
};

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  try {
    seedDatabase();
    bindEvents();
    registerServiceWorker();
    restoreSession();
    toggleInstallButtons(false);
  } catch (error) {
    console.error("Error al iniciar la app:", error);
    $("#loginScreen").classList.remove("hidden");
    $("#appScreen").classList.add("hidden");
  } finally {
    hideSplash();
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  toggleInstallButtons(true);
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  toggleInstallButtons(false);
});

function bindEvents() {
  $("#loginForm").addEventListener("submit", login);
  $("#logoutBtn").addEventListener("click", logout);
  $("#logoutBtnMobile").addEventListener("click", logout);
  $("#vehicleForm").addEventListener("submit", registerVehicle);
  $("#noticeForm").addEventListener("submit", addNotice);
  $("#userForm").addEventListener("submit", addUser);
  $("#installBtn").addEventListener("click", installApp);
  $("#installBtnTop").addEventListener("click", installApp);

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewTarget));
  });
}

function hideSplash(immediate = false) {
  const splash = $("#splashScreen");
  if (!splash || splash.classList.contains("hidden")) return;

  if (immediate) {
    splash.classList.add("fade-out", "hidden");
    return;
  }

  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.classList.add("hidden"), 500);
  }, 850);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

async function installApp() {
  if (isStandaloneApp()) {
    alert("La app ya esta instalada y se esta ejecutando como aplicacion.");
    return;
  }

  if (!deferredInstallPrompt) {
    alert("Si Chrome no muestra el instalador automatico, abre el menu de Chrome (tres puntos) y elige 'Instalar app' o 'Agregar a pantalla principal'. Asegurate de abrir el proyecto con Live Server.");
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  toggleInstallButtons(false);
}

function toggleInstallButtons(canInstall) {
  $("#installBtnTop").classList.toggle("hidden", !canInstall);
  $("#installBtn").disabled = false;

  if (isStandaloneApp()) {
    $("#installBtn").textContent = "App instalada";
    return;
  }

  $("#installBtn").textContent = canInstall ? "Instalar app" : "Ver como instalar";
}

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

// Crea la "base de datos" inicial en localStorage si todavia no existe.
function seedDatabase() {
  const storedUsers = getData(STORAGE_KEYS.users);
  if (!storedUsers) {
    saveData(STORAGE_KEYS.users, [initialUser]);
  } else if (!storedUsers.some((user) => user.codigo === initialUser.codigo)) {
    storedUsers.unshift(initialUser);
    saveData(STORAGE_KEYS.users, storedUsers);
  }

  if (!getData(STORAGE_KEYS.spaces)) {
    const spaces = [];
    ["A", "B", "C"].forEach((zone) => {
      for (let number = 1; number <= 8; number++) {
        spaces.push({
          id: `${zone}${number}`,
          zone,
          status: number === 8 ? "reserved" : "available"
        });
      }
    });
    saveData(STORAGE_KEYS.spaces, spaces);
  }

  if (!getData(STORAGE_KEYS.vehicles)) saveData(STORAGE_KEYS.vehicles, []);
  if (!getData(STORAGE_KEYS.history)) saveData(STORAGE_KEYS.history, []);
  if (!getData(STORAGE_KEYS.notices)) saveData(STORAGE_KEYS.notices, initialNotices);
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function login(event) {
  event.preventDefault();
  const codigo = $("#loginCodigo").value.trim().toLowerCase();
  const password = $("#loginPassword").value.trim();
  const users = getData(STORAGE_KEYS.users);
  const user = users.find((item) => item.codigo.toLowerCase() === codigo && item.password === password);

  if (!user) {
    showMessage("#loginMessage", "Codigo o contrasena incorrectos.", "error");
    return;
  }

  currentUser = user;
  saveData(STORAGE_KEYS.session, user.codigo);
  $("#loginForm").reset();
  showApp();
  hideSplash(true);
}

function restoreSession() {
  const sessionCode = getData(STORAGE_KEYS.session);
  const users = getData(STORAGE_KEYS.users);
  currentUser = users.find((user) => user.codigo === sessionCode) || null;

  if (currentUser) {
    showApp();
  } else {
    $("#loginScreen").classList.remove("hidden");
    $("#appScreen").classList.add("hidden");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEYS.session);
  $("#loginScreen").classList.remove("hidden");
  $("#appScreen").classList.add("hidden");
  showView("inicio");
}

function showApp() {
  $("#loginScreen").classList.add("hidden");
  $("#appScreen").classList.remove("hidden");
  $("#welcomeTitle").textContent = `Bienvenido, ${currentUser.nombre}`;
  $("#userRoleBadge").textContent = currentUser.rol;
  $("#profileName").textContent = currentUser.nombre;
  $("#profileCode").textContent = `${currentUser.codigo} - ${currentUser.rol}`;
  applyRolePermissions();
  showView("inicio");
  renderAll();
}

function showView(viewId) {
  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewTarget === viewId);
  });

  $("#mobileTitle").textContent = viewTitles[viewId] || "UTP Parking";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyRolePermissions() {
  const isAdmin = currentUser.rol === "admin";
  $("#noticeAdminPanel").classList.toggle("hidden", !isAdmin);
  $("#usuarios").classList.toggle("hidden", !isAdmin);
}

function renderAll() {
  renderDashboard();
  renderSpaceSelect();
  renderMap();
  renderVehiclesTable();
  renderNotices();
  renderReports();
  renderUsers();
}

function todayText() {
  return new Date().toLocaleDateString("es-PE");
}

function timeText() {
  return new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function dateTimeText() {
  return `${todayText()} ${timeText()}`;
}

function renderDashboard() {
  const spaces = getData(STORAGE_KEYS.spaces);
  const vehicles = getActiveVehicles();
  const history = getData(STORAGE_KEYS.history);
  const todayEntries = history.filter((item) => item.type === "ingreso" && item.date === todayText()).length;

  $("#totalSpaces").textContent = spaces.length;
  $("#availableSpaces").textContent = spaces.filter((space) => space.status === "available").length;
  $("#occupiedSpaces").textContent = spaces.filter((space) => space.status === "occupied").length;
  $("#todayVehicles").textContent = todayEntries;
}

function getActiveVehicles() {
  return getData(STORAGE_KEYS.vehicles).filter((vehicle) => vehicle.estado === "Dentro");
}

function renderSpaceSelect() {
  const spaces = getData(STORAGE_KEYS.spaces);
  const available = spaces.filter((space) => space.status === "available");
  const options = [`<option value="">Automatico</option>`]
    .concat(available.map((space) => `<option value="${space.id}">${space.id}</option>`));

  $("#espacio").innerHTML = options.join("");

  if (selectedSpace && available.some((space) => space.id === selectedSpace)) {
    $("#espacio").value = selectedSpace;
  }
}

function renderMap() {
  const spaces = getData(STORAGE_KEYS.spaces);
  const zones = ["A", "B", "C"].map((zone) => {
    const buttons = spaces
      .filter((space) => space.zone === zone)
      .map((space) => `
        <button class="parking-slot ${space.status}" onclick="selectSpace('${space.id}')">
          ${space.id}
        </button>
      `)
      .join("");

    return `
      <div class="zone">
        <div class="zone-title">Zona ${zone}</div>
        <div class="slots">${buttons}</div>
      </div>
    `;
  });

  $("#parkingMap").innerHTML = `
    ${zones[0]}
    <div class="road">
      <span class="arrow one">&uarr;</span>
      <span class="arrow two">&uarr;</span>
      <span class="arrow three">&uarr;</span>
    </div>
    <div class="zone-group">
      ${zones[1]}
      ${zones[2]}
    </div>
  `;
}

// Maneja el clic en cada espacio del mapa visual.
function selectSpace(spaceId) {
  const spaces = getData(STORAGE_KEYS.spaces);
  const space = spaces.find((item) => item.id === spaceId);
  const vehicle = getActiveVehicles().find((item) => item.espacio === spaceId);
  selectedSpace = space.status === "available" ? spaceId : "";
  renderSpaceSelect();

  if (space.status === "available") {
    $("#spaceDetails").innerHTML = `
      <p class="eyebrow">Disponible</p>
      <h3>Espacio ${spaceId}</h3>
      <p class="muted">Este espacio fue seleccionado para el proximo ingreso.</p>
      <a class="btn primary" href="#registro">Asignar vehiculo</a>
    `;
    return;
  }

  if (space.status === "reserved") {
    $("#spaceDetails").innerHTML = `
      <p class="eyebrow">Reservado</p>
      <h3>Espacio ${spaceId}</h3>
      <p class="muted">Este espacio esta reservado y no se puede asignar.</p>
    `;
    return;
  }

  $("#spaceDetails").innerHTML = `
    <p class="eyebrow">Ocupado</p>
    <h3>Espacio ${spaceId}</h3>
    <div class="space-info">
      <p>Placa: <strong>${vehicle.placa}</strong></p>
      <p>Tipo: <strong>${vehicle.tipo}</strong></p>
      <p>Usuario: <strong>${vehicle.dueno}</strong></p>
      <p>Hora de ingreso: <strong>${vehicle.horaIngreso}</strong></p>
      <button class="btn primary" onclick="registerExit('${vehicle.placa}')">Registrar salida</button>
    </div>
  `;
}

function registerVehicle(event) {
  event.preventDefault();
  const placa = $("#placa").value.trim().toUpperCase();
  const tipo = $("#tipo").value;
  const dueno = $("#dueno").value.trim().toLowerCase();
  const selected = $("#espacio").value;
  const vehicles = getData(STORAGE_KEYS.vehicles);
  const spaces = getData(STORAGE_KEYS.spaces);
  const users = getData(STORAGE_KEYS.users);

  if (!placa || !tipo || !dueno) {
    showMessage("#vehicleMessage", "Completa todos los campos.", "error");
    return;
  }

  if (vehicles.some((vehicle) => vehicle.placa === placa && vehicle.estado === "Dentro")) {
    showMessage("#vehicleMessage", "Esta placa ya tiene un ingreso activo.", "error");
    return;
  }

  if (!users.some((user) => user.codigo.toLowerCase() === dueno)) {
    showMessage("#vehicleMessage", "El codigo UTP del dueno no existe.", "error");
    return;
  }

  const availableSpace = selected || spaces.find((space) => space.status === "available")?.id;

  if (!availableSpace) {
    showMessage("#vehicleMessage", "No hay espacios disponibles.", "error");
    return;
  }

  const newVehicle = {
    placa,
    tipo,
    dueno,
    espacio: availableSpace,
    estado: "Dentro",
    fechaIngreso: todayText(),
    horaIngreso: timeText()
  };

  vehicles.push(newVehicle);
  updateSpaceStatus(availableSpace, "occupied");
  addHistory("ingreso", placa, availableSpace);
  saveData(STORAGE_KEYS.vehicles, vehicles);

  selectedSpace = "";
  $("#vehicleForm").reset();
  showMessage("#vehicleMessage", "Ingreso registrado correctamente.", "ok");
  renderAll();
}

function registerExit(placa) {
  const vehicles = getData(STORAGE_KEYS.vehicles);
  const vehicle = vehicles.find((item) => item.placa === placa && item.estado === "Dentro");

  if (!vehicle) return;

  vehicle.estado = "Fuera";
  vehicle.horaSalida = timeText();
  vehicle.fechaSalida = todayText();
  updateSpaceStatus(vehicle.espacio, "available");
  addHistory("salida", placa, vehicle.espacio);
  saveData(STORAGE_KEYS.vehicles, vehicles);

  $("#spaceDetails").innerHTML = `
    <p class="eyebrow">Salida registrada</p>
    <h3>${placa}</h3>
    <p class="muted">El espacio ${vehicle.espacio} vuelve a estar disponible.</p>
  `;
  renderAll();
}

function updateSpaceStatus(spaceId, status) {
  const spaces = getData(STORAGE_KEYS.spaces);
  const space = spaces.find((item) => item.id === spaceId);
  if (space && space.status !== "reserved") {
    space.status = status;
    saveData(STORAGE_KEYS.spaces, spaces);
  }
}

function addHistory(type, placa, espacio) {
  const history = getData(STORAGE_KEYS.history);
  history.unshift({
    type,
    placa,
    espacio,
    date: todayText(),
    time: timeText(),
    dateTime: dateTimeText()
  });
  saveData(STORAGE_KEYS.history, history);
}

function renderVehiclesTable() {
  const activeVehicles = getActiveVehicles();

  $("#vehiclesTable").innerHTML = activeVehicles.length
    ? activeVehicles.map((vehicle) => `
        <tr>
          <td>${vehicle.placa}</td>
          <td>${vehicle.tipo}</td>
          <td>${vehicle.espacio}</td>
          <td><span class="status-pill active">${vehicle.estado}</span></td>
          <td>${vehicle.horaIngreso}</td>
          <td><button class="btn small primary" onclick="registerExit('${vehicle.placa}')">Registrar salida</button></td>
        </tr>
      `).join("")
    : `<tr><td colspan="6">No hay vehiculos dentro del estacionamiento.</td></tr>`;
}

function renderNotices() {
  const notices = getData(STORAGE_KEYS.notices);
  $("#noticeList").innerHTML = notices
    .map((notice) => `<div class="notice-item">${notice}</div>`)
    .join("");
}

function addNotice(event) {
  event.preventDefault();
  if (currentUser.rol !== "admin") return;

  const text = $("#noticeText").value.trim();
  if (!text) return;

  const notices = getData(STORAGE_KEYS.notices);
  notices.unshift(text);
  saveData(STORAGE_KEYS.notices, notices);
  $("#noticeForm").reset();
  renderNotices();
}

function renderReports() {
  const history = getData(STORAGE_KEYS.history);
  const today = todayText();
  const todayEntries = history.filter((item) => item.type === "ingreso" && item.date === today);
  const todayExits = history.filter((item) => item.type === "salida" && item.date === today);
  const activeVehicles = getActiveVehicles();

  $("#reportEntries").textContent = todayEntries.length;
  $("#reportExits").textContent = todayExits.length;
  $("#reportInside").textContent = activeVehicles.length;
  $("#reportTopSpace").textContent = getMostUsedSpace(history);

  $("#historyTable").innerHTML = history.length
    ? history.slice(0, 20).map((item) => `
        <tr>
          <td>${item.type}</td>
          <td>${item.placa}</td>
          <td>${item.espacio}</td>
          <td>${item.dateTime}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4">Todavia no hay movimientos registrados.</td></tr>`;
}

function getMostUsedSpace(history) {
  if (!history.length) return "-";

  const counts = history
    .filter((item) => item.type === "ingreso")
    .reduce((acc, item) => {
      acc[item.espacio] = (acc[item.espacio] || 0) + 1;
      return acc;
    }, {});

  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "-";
}

function addUser(event) {
  event.preventDefault();
  if (currentUser.rol !== "admin") return;

  const codigo = $("#newCodigo").value.trim().toLowerCase();
  const nombre = $("#newNombre").value.trim();
  const password = $("#newPassword").value.trim();
  const rol = $("#newRol").value;
  const users = getData(STORAGE_KEYS.users);

  if (!codigo || !nombre || !password) {
    showMessage("#userMessage", "Completa todos los datos.", "error");
    return;
  }

  if (users.some((user) => user.codigo.toLowerCase() === codigo)) {
    showMessage("#userMessage", "Ese codigo UTP ya esta registrado.", "error");
    return;
  }

  users.push({ codigo, nombre, password, rol });
  saveData(STORAGE_KEYS.users, users);
  $("#userForm").reset();
  showMessage("#userMessage", "Usuario agregado correctamente.", "ok");
  renderUsers();
}

function renderUsers() {
  const users = getData(STORAGE_KEYS.users);

  $("#usersTable").innerHTML = users
    .map((user) => `
      <tr>
        <td>${user.codigo}</td>
        <td>${user.nombre}</td>
        <td>${user.rol}</td>
      </tr>
    `)
    .join("");
}

function showMessage(selector, text, type) {
  const element = $(selector);
  element.textContent = text;
  element.className = `message ${type}`;
}
