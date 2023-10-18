$.ajax({
    url: 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion',
    method: 'GET',
    success: function (data) {
        const searchInput = document.getElementById("search-input");
        const roomCardsContainer = document.getElementById("room-cards");
        const habitaciones = data.data;

        // Función para renderizar las tarjetas
        function renderizarTarjetas(habitaciones, filtroTexto = '') {
            roomCardsContainer.innerHTML = ''; // Limpia el contenedor

            habitaciones.forEach((tipoHabitacion, index) => {

                const precio = parseFloat(tipoHabitacion.Cantidad);

                const precioFormateado = formatearPrecio(precio);

                if (tipoHabitacion.Titulo.toLowerCase().includes(filtroTexto) && tipoHabitacion.Estado === "Activo") {
                    const cardDiv = document.createElement("div");
                    cardDiv.classList.add("col-12", "col-md-4");
                    cardDiv.innerHTML = `
                        <div class="card mb-4">
                            <h2 class="card-title" style="text-align: center;">${tipoHabitacion.Titulo}</h2>
                            <img src="../../asset/img/${tipoHabitacion.Imagen}" class="card-img-top" alt="${tipoHabitacion.Titulo}">
                            <div class="card-body">
                                <p class="card-text">Descripción: ${tipoHabitacion.Descripcion}</p>
                                <p class="card-text">Precio: <span class="price">${precioFormateado}</span></p>
                            </div>
                            <a class="btn btn-success" onclick="redirigirGestionReserva(${tipoHabitacion.id})">Reservar</a>
                        </div>
                    `;
                    roomCardsContainer.appendChild(cardDiv);
                }
            });
        }

        function formatearPrecio(precio) {
            return precio.toLocaleString('es-ES');
        }

        const filterSelect = document.getElementById("filter-select");
        filterSelect.addEventListener("change", function () {
            const filtroSeleccionado = filterSelect.value;

            if (filtroSeleccionado === "menorPrecio") {
                habitaciones.sort((a, b) => a.Cantidad - b.Cantidad);
            } else if (filtroSeleccionado === "mayorPrecio") {
                habitaciones.sort((a, b) => b.Cantidad - a.Cantidad);
            }

            renderizarTarjetas(habitaciones);
        });

        searchInput.addEventListener("input", function () {
            const textoBusqueda = searchInput.value.toLowerCase();
            renderizarTarjetas(habitaciones, textoBusqueda);
        });

        renderizarTarjetas(habitaciones);
    },
    error: function (error) {
        console.error('Error al obtener datos de habitaciones:', error);
    }
});

function redirigirGestionReserva(id, Titulo) {
    window.location.href = `GestionReserva.html?id=${id}`;
}


function Devolver() {
    window.location.href = "../../index.html";
}