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

async function loadTable() {
    try {
        const response = await fetch('https://api-hotel-yd7i.onrender.com/api/sistema/consumoHabitacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de consumo habitaciones: ${response.status}`);
        }

        const data = await response.json();
        const registros = data.data.map(consumoHabitacion => {
            const Nombres = consumoHabitacion.ReservaHabitacionesId.HuespedId.UsuarioId.PersonaId.Nombres;
            const Apellidos = consumoHabitacion.ReservaHabitacionesId.HuespedId.UsuarioId.PersonaId.Apellidos;
            return `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${consumoHabitacion.id}</td>
                    <td class="table-cell-width">${Nombres} ${Apellidos}</td>
                    <td class="table-cell-width">${consumoHabitacion.ReservaHabitacionesId.FechaEntrada}</td>
                    <td class="table-cell-width">${consumoHabitacion.DescuentoId.PorcentajeDescuento}%</td>
                    <td class="table-cell-width">${consumoHabitacion.ProductoId.Nombre}</td>
                    <td class="table-cell-width">${consumoHabitacion.Cantidad}</td>
                    <td class="table-cell-width ${consumoHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${consumoHabitacion.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${consumoHabitacion.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${consumoHabitacion.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${consumoHabitacion.id})">
                                <i class="fa-solid fa-trash btn btn-danger"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        dataResult.innerHTML = registros;

        $('#table').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
            },
            paging: true,
            pageLength: 5,
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ],
            responsive: true,
        });
    } catch (error) {
        const errorMessage = `Error al obtener la lista de consumo habitaciones: ${error.message}`;
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
            title: errorMessage,
            icon: "error"
        });

        console.error(`Error al realizar la petición fetch: ${error.message}`);
    }
}