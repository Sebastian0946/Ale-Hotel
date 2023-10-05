const usuario = sessionStorage.getItem("usuario");
const contrasena = sessionStorage.getItem("contrasena");

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
        // Redirige al usuario a la página de inicio de sesión (puedes ajustar la URL)
        window.location.href = '../login.html'; // Cambia 'login.html' por la URL de tu página de inicio de sesión
    });
}

function outSin() {
    // Muestra una alerta de despedida que se cierra automáticamente después de 3 segundos (3000 ms)
    Swal.fire({
        icon: 'info',
        title: '¡Hasta la próxima!',
        text: 'Sesión cerrada exitosamente.',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
    }).then(() => {
        sessionStorage.clear();
        window.location.href = '../login.html'; // Cambia 'login.html' por la URL de tu página de inicio de sesión
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