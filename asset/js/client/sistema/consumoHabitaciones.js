function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        agregarConsumoHabitacion();
    }
    // Cerrar el modal
    $('#myModal').modal('hide');
}

function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
}

async function loadTable() {
    try {
        showLoader();

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            items.data.forEach((consumoHabitacion) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${consumoHabitacion.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${consumoHabitacion.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = consumoHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([consumoHabitacion.id, consumoHabitacion.Codigo, ConfiguracionSistema.UsuarioId.Usuario, ConfiguracionSistema.Nombre, ConfiguracionSistema.Descripcion, `<span class="${estadoClass}">${ConfiguracionSistema.Estado}</span>`, actions]);
            });

            table.draw();

            hideLoader();

            if (items.message && !mensajeMostrado) {
                mensajeMostrado = true;
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });

                Toast.fire({
                    icon: 'success',
                    title: items.message
                });
            }
        }
        hideLoader();
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
        hideLoader();
    }
}