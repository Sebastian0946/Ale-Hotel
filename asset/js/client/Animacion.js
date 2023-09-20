document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar el botón
    var button = document.querySelector('.btn-floating');

    // Establecer las propiedades iniciales
    button.style.opacity = '0';
    button.style.transform = 'scale(0)';

    // Crear la animación con anime.js
    var animation = anime({
        targets: button,
        opacity: [0, 1],
        scale: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
    });
});


const body = document.querySelector('body');

// Aplicar la animación de entrada
anime({
    targets: body,
    opacity: [0, 1],
    duration: 8000,
    easing: 'easeOutExpo'
});

const animatedButton = document.querySelector('.animated-button');

const initialPosition = { translateX: '-100%' };
const finalPosition = { translateX: '0%' };

anime.set(animatedButton, initialPosition);

anime({
    targets: animatedButton,
    translateX: [initialPosition.translateX, finalPosition.translateX],
    duration: 800,
    easing: 'easeOutQuart'
});

const rows = document.querySelectorAll('.fadeIn');

rows.forEach((row, index) => {
    anime({
        targets: row,
        opacity: [0, 1],
        duration: 1000,
        delay: index * 200,
        easing: 'easeInOutQuad'
    });
});

const table = document.getElementById('table');

// Aplicar la animación de transición
anime({
    targets: table,
    translateX: ['-100%', 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo'
});

document.addEventListener("DOMContentLoaded", function (event) {
    var loader = document.getElementById("loader");
    var loaderInner = document.createElement("div");
    loaderInner.id = "loader-inner";
    loader.appendChild(loaderInner);

    // Configura la animación con anime.js
    anime({
        targets: "#loader-inner",
        rotate: "1turn",
        easing: "linear",
        duration: 2000, // Ajusta la duración de la animación aquí (en milisegundos)
        loop: true
    });

    // Oculta la pantalla de carga cuando el contenido está listo
    setTimeout(function () {
        loader.style.display = "none";
    }, 2000); // Ajusta el tiempo de espera antes de ocultar la pantalla de carga aquí (en milisegundos)
});

const buttons = document.querySelectorAll('.flip');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.remove('flip');
    });
});