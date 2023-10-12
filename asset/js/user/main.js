let acordeon = document.querySelectorAll('.faqs .row .content .box');

acordeon.forEach(acco => {
    acco.onclick = () => {
        acordeon.forEach(subAcco => { subAcco.classList.remove('active') });
        acco.classList.add('active')
    }
})

function redirigirALogin() {
    window.location.href = 'views/login.html';
}

$(document).ready(function () {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        loopedSlides: 3,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        speed: 800,
        effect: 'slide',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});

const tarjetas = [
    {
        imagen: "asset/img/Habitacion sencilla.jpg",
        titulo: "Habitación sencilla",
        precio: "$145.000",
    },
    {
        imagen: "asset/img/Habitacion doble.jpg",
        titulo: "Habitación doble",
        precio: "$200.000",
    },
    {
        imagen: "asset/img/Habitacion matrimonial.jpg",
        titulo: "Habitación matrimonial",
        precio: "$250.000",
    },
    {
        imagen: "asset/img/Habitacion VIP.jpg",
        titulo: "Habitación VIP",
        precio: "$350.000",
    },
    {
        imagen: "asset/img/habitacion 5.jpg",
        titulo: "Habitación decorativa",
        precio: "$125.000",
    },
];

const swiperWrapper = document.getElementById("swiper-wrapper");

tarjetas.forEach((tarjeta) => {
    const card = document.createElement("div");
    card.classList.add("swiper-slide", "popular-card");

    card.innerHTML = `
        <img src="${tarjeta.imagen}" alt="habitaciones populares">
        <div class="popular-content">
            <div class="popular-card-header">
                <h4>${tarjeta.titulo}</h4>
                <h4>${tarjeta.precio}</h4>
            </div>
            <div class="popular-info">
                <p>CampoAlegre</p>
                <div class="thanks-icon" id="thanks-icon"> <!-- Icono oculto -->
                    <img src="asset/img/thank.gif" alt="Persona agradeciendo">
                </div>
                <a class="btn btn-success reserve-button" href="views/user/GestionReserva.html" id="reserve-button">Reservar</a>
            </div>
        </div>
    `;

    swiperWrapper.appendChild(card);
});

const reserveButtons = document.querySelectorAll('.reserve-button');

reserveButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Obtener el contenedor padre de la tarjeta
        const cardContent = button.closest('.popular-content');
        button.style.display = 'none';

        const thanksIconContainer = button.previousElementSibling;

        thanksIconContainer.style.display = 'block';

        cardContent.classList.add('reserve-active');

        setTimeout(() => {
            thanksIconContainer.style.display = 'none';
            button.style.display = 'block';
        }, 3000); // Cambia el tiempo según tus preferencias (3 segundos en este caso)
    });
});

