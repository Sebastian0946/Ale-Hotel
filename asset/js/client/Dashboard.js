const usuario = sessionStorage.getItem("usuario");
const contrasena = sessionStorage.getItem("contrasena");

const userNombreElement = document.querySelector(".user-name");

if (usuario) {
    userNombreElement.textContent = usuario;
} else {
    userNombreElement.textContent = "Invitado";
}

if (usuario && contrasena) {
    // Las credenciales existen, muestra una alerta de bienvenida
    Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Bienvenido, ${usuario}!`,
    });
} else {
    // Las credenciales no existen en el almacenamiento de sesión, muestra una alerta de error
    Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, inicie sesión.',
    }).then(() => {
        window.location.href = '../login.html'; // Cambia 'login.html' por la URL de tu página de inicio de sesión
    });
}

function outSin() {
    Swal.fire({
        icon: 'info',
        title: '¡Hasta la próxima!',
        text: 'Sesión cerrada exitosamente.',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
    }).then(() => {
        sessionStorage.clear();
        window.location.href = '../login.html';
    });
}

const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
    const iconImage = expand_btn.querySelector('img');

    document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinks = document.querySelectorAll(".sidebar-links a")

allLinks.forEach((elem) => {
    elem.addEventListener('click', function () {
        const hrefLinkClick = elem.href;

        allLinks.forEach((link) => {
            if (link.href == hrefLinkClick) {
                link.classList.add("active");
            } else {
                link.classList.remove('active');
            }
        });
    })
});

document.addEventListener('DOMContentLoaded', function () {
    const dashboardIframe = document.getElementById('dashboard-iframe');
    const defaultUrl = 'view/index.html';

    dashboardIframe.src = defaultUrl;

    const menuLinks = document.querySelectorAll('#sidemenu a');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            dashboardIframe.src = url;
        });
    });
});

$(document).ready(function () {
    $("#sidemenu li a").on("click", function () {
        $("body").removeClass("collapsed");
    });
});

let notificationsVisible = false;

function toggleNotifications() {
    const notificationList = document.getElementById("notification-list");
    notificationsVisible = !notificationsVisible;

    if (notificationsVisible) {
        notificationList.style.display = "block";
    } else {
        notificationList.style.display = "none";
        const notificationCount = document.getElementById("notification-count");
        notificationCount.innerText = "0";
    }
}

const notificationIcon = document.getElementById("notification-icon");
notificationIcon.addEventListener("click", toggleNotifications);

// Función para cargar los datos de reserva desde la API
async function cargarReservasDesdeAPI() {
    try {
        const response = await fetch("https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion");
        if (!response.ok) {
            throw new Error("Error al cargar los datos de reserva desde la API.");
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para agregar notificaciones
function addNotification(message, iconClass) {
    const notificationList = document.getElementById("notification-list");

    // Crea un elemento de notificación
    const notification = document.createElement("div");
    notification.classList.add("notification-item");

    // Agrega el ícono
    const icon = document.createElement("i");
    icon.classList.add("fa", iconClass);

    // Agrega el mensaje
    const text = document.createElement("span");
    text.textContent = message;

    // Agrega el ícono y el mensaje a la notificación
    notification.appendChild(icon);
    notification.appendChild(text);

    // Agrega la notificación a la lista
    notificationList.appendChild(notification);

    // Actualiza el contador de notificaciones
    const notificationCount = document.getElementById("notification-count");
    notificationCount.innerText = (parseInt(notificationCount.innerText) + 1).toString();
}

async function procesarReservas() {
    const data = await cargarReservasDesdeAPI();

    if (data && data.length > 0) {
        const ahora = new Date();

        data.forEach((reserva) => {
            const fechaSalida = new Date(reserva.FechaSalida);

            // Calcula el tiempo restante en milisegundos
            const tiempoRestante = fechaSalida - ahora;

            // Define un umbral de tiempo (30 minutos antes del checkout)
            const umbralTiempo = 30 * 60 * 1000;

            if (tiempoRestante <= umbralTiempo && tiempoRestante >= 0) {
                const minutosRestantes = Math.floor(tiempoRestante / (1000 * 60));
                const mensaje = `Tu reserva de habitación vence en ${minutosRestantes} minuto(s). ¡No olvides hacer los arreglos necesarios!`;
                addNotification(mensaje, "fa-message");
            }
        });
    }
}

addNotification("¡Bienvenido a nuestro servicio de notificaciones de reserva de habitaciones!", "fa-star");
procesarReservas();