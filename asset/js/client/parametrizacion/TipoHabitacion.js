var dataTableInitialized = false;

function performAction() {
    const action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        agregarTipoHabitacion();
    }
    $('#myModal').modal('hide');
}

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const { data: items } = await response.json();
            const registros = items.map(TipoHabitacion => `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${TipoHabitacion.id}</td>
                    <td class="table-cell-width">${TipoHabitacion.Codigo}</td>
                    <td class="table-cell-width">${TipoHabitacion.Descripcion}</td>
                    <td class="table-cell-width">${TipoHabitacion.Cantidad}</td>
                    <td class="table-cell-width estado-table ${TipoHabitacion.Estado === 'Activo' ? 'activo' : 'inactivo'}">${TipoHabitacion.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${TipoHabitacion.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${TipoHabitacion.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${TipoHabitacion.id})">
                                <i class="fa-solid fa-trash btn btn-danger"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join("");

            $("#dataResult").html(registros);

            if (!dataTableInitialized) {
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
                        {
                            extend: 'pdfHtml5',
                            download: 'open'
                        },
                        {
                            text: 'JSON',
                            action: function (e, dt, button, config) {
                                var data = dt.buttons.exportData();

                                $.fn.dataTable.fileSave(
                                    new Blob([JSON.stringify(data)]),
                                    'TipoHabitación.json'
                                );
                            }
                        }
                    ],
                    responsive: true,
                    colReorder: true,
                    select: true
                });

                dataTableInitialized = true;
            }

        } else {
            console.log("Error en la respuesta del servidor:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error al cargar la tabla:", error);
    }
}


async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/${id}`);

        if (response.ok) {

            const jsonResult = await response.json();

            if (jsonResult.data) {

                const TipoHabitacion = jsonResult.data;

                $('#id').val(TipoHabitacion.id);
                $('#codigo').val(TipoHabitacion.Codigo);
                $('#descripcion').val(TipoHabitacion.Descripcion);
                $('#cantidad').val(TipoHabitacion.Cantidad);
                $("#estado").prop("checked", TipoHabitacion.Estado === 'Activo');

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
                    title: jsonResult.message || 'Estado Factura encontrado',
                });

                $("#myModal").data("action", "guardarCambios");
                $('#myModal').modal('show');
            } else {
                console.log("Respuesta del servidor sin propiedad 'data':", jsonResult);
            }
        } else {
            const errorResponse = await response.json();
            let errorMessage = "Error al obtener el módulo";
            const errorDescription = errorResponse.message || "Detalles del error desconocido";

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
                text: errorDescription,
                icon: "error"
            });

            console.log(`Error al realizar la petición Fetch: ${response.status}, ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
    }
}

async function agregarTipoHabitacion() {

    const formData = {
        Codigo: $('#codigo').val(),
        Descripcion: $('#descripcion').val(),
        Cantidad: $('#cantidad').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'success',
                title: jsonResponse.message || 'Registro exitoso',
            });
            Limpiar();
            loadTable();
        } else {
            const errorResponse = await response.json();
            let errorMessage = "Ha ocurrido un error al registrar el Estado Factura";
            const errorDescription = errorResponse.message || "Detalles del error desconocido";

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
                text: errorDescription,
                icon: "error"
            });
        }
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
    }
}


async function guardarCambios() {
    const id = $('#id').val();

    const formData = {
        Codigo: $('#codigo').val(),
        Descripcion: $('#descripcion').val(),
        Cantidad: $('#cantidad').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'warning',
                title: jsonResponse.message || 'Modificación exitosa',
            });
            loadTable();
            Limpiar();
        } else {
            const errorResponse = await response.json();
            let errorMessage = "Ha ocurrido un error al actualizar el estado factura";
            const errorDescription = errorResponse.message || "Detalles del error desconocido";

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
                text: errorDescription,
                icon: "error"
            });
        }
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
    }
}

async function deleteById(id) {

    const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const jsonResponse = await response.json();
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
                    title: jsonResponse.message || 'Registro eliminado con éxito'
                });
                loadTable();
            } else {
                const errorResponse = await response.json();
                const errorDescription = errorResponse.message || 'Error al eliminar el registro';

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
                    icon: 'error',
                    title: errorDescription
                });
            }
        } catch (error) {
            console.error("Error al realizar la petición Fetch:", error);
        }
    }
}


function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#descripcion').val('');
    $("#estado").prop('checked', false);
}