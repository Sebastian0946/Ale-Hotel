function loadCart() {
    let acordeon = document.querySelectorAll('.faqs .row .content .box');

    acordeon.forEach(acco => {
        acco.onclick = () => {
            acordeon.forEach(subAcco => { subAcco.classList.remove('active') });
            acco.classList.add('active')
        }
    })


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

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            const swiperWrapper = document.getElementById("swiper-wrapper");
            items.data.forEach(function (TipoHabitacion) {
                const card = document.createElement("div");
                card.classList.add("swiper-slide", "popular-card");
                card.innerHTML = `
                    <img src="asset/img/${TipoHabitacion.Imagen}" alt="habitaciones populares" style="width: 600px; height: 250px;"> <!-- Establecer el ancho y alto deseados -->
                    <div class="popular-content">
                        <div class="cont">
                            <h4>${TipoHabitacion.Titulo}</h4>   
                            <div class="popular-info">
                                <p>${TipoHabitacion.Descripcion}</p>
                                <div class="thanks-icon" id="thanks-icon"> <!-- Icono oculto -->
                                    <img src="asset/img/thank.gif" alt="Persona agradeciendo">
                                </div>
                            </div> 
                        </div>
                        <div class="flex-container">
                            <div class="left-div">
                                <a class="btn btn-success reserve-button" href="views/user/GestionReserva.html?id=${TipoHabitacion.id}" id="reserve-button">Reservar</a>
                            </div>
                            <div class="right-div">
                                <h5>$ ${TipoHabitacion.Cantidad}</h5>
                            </div>
                        </div>
                    </div>
                `;
                swiperWrapper.appendChild(card);
            });
        }
    });

    const reserveButtons = document.querySelectorAll('.reserve-button');

    reserveButtons.forEach((button) => {
        button.addEventListener('click', () => {

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
}

function redirigirALogin(){
    location.href ="views/login.html";
}

loadCart();