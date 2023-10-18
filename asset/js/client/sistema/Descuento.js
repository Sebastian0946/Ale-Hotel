var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        agregarDescuento();
    }
    // Cerrar el modal
    $('#myModal').modal('hide');
}

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/descuento', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de descuentos: ${response.status}`);
        }

        const responseData = await response.json();
        const { message, data } = responseData;

        if (message) {
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
                title: message
            });
        }

        const registros = data.map(descuento => `
            <tr class="table-light fadeIn">
                <td class="table-cell-width">${descuento.id}</td>
                <td class="table-cell-width">${descuento.Codigo}</td>
                <td class="table-cell-width">${descuento.PorcentajeDescuento}</td>
                <td class="table-cell-width ${descuento.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${descuento.Estado}</td>
                <td class="table-cell-width">
                    <div class="row-actions">
                        <div class="row-action" onclick="showDetails(${descuento.id})">
                            <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                        </div>
                        <div class="row-action" onclick="findById(${descuento.id})">
                            <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                        </div>
                        <div class="row-action" onclick="deleteById(${descuento.id})">
                            <i class="fa-solid fa-trash btn btn-danger"></i>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        $("#dataResult").html(registros);

        if (!dataTableInitialized) {
            $('#table').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
                },
                paging: true,
                pageLength: 10, 
                lengthMenu: [10, 20, 100], 
                dom: 'Bfrtip',
                buttons: [
                    {
                        text: '<i class="fas fa-copy"></i> Copiar',
                        extend: 'copyHtml5'
                    },
                    {
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        extend: 'excelHtml5'
                    },
                    {
                        text: '<i class="fas fa-file-csv"></i> CSV', 
                        extend: 'csvHtml5'
                    },
                    {
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        extend: 'pdfHtml5',
                        download: 'open'
                    },
                    {
                        text: '<i class="fas fa-file-code"></i> JSON', 
                        action: function (e, dt, button, config) {
                            var data = dt.buttons.exportData();

                            $.fn.dataTable.fileSave(
                                new Blob([JSON.stringify(data)]),
                                'Producto.json'
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
    } catch (error) {
        const errorMessage = `Error al obtener la lista de descuentos: ${error.message}`;
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

async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/descuento/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el descuento: ${response.status}`);
        }

        const responseData = await response.json();
        const { message, data } = responseData;

        if (message) {
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
                title: message,
            });
        }

        $('#id').val(data.id);
        $('#codigo').val(data.Codigo);
        $('#porcentajeDescuento').val(data.PorcentajeDescuento);
        $("#estado").prop("checked", data.Estado === 'Activo');

        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
        const errorMessage = `Error al obtener el descuento: ${error.message}`;
        const errorDetails = error.message;

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
            text: errorDetails,
            icon: "error"
        });

        console.error(`Error al realizar la petición fetch: ${error.message}`);
    }
}

async function agregarDescuento() {
    try {
        const formData = {
            Codigo: $('#codigo').val(),
            ValorNeto: $('#valorNeto').val(),
            PorcentajeDescuento: $('#porcentajeDescuento').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/descuento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el descuento: ${response.status}`);
        }

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
            title: 'Registro exitoso',
        });

        Limpiar();
        loadTable();
    } catch (error) {
        const errorMessage = `Error al registrar el descuento: ${error.message}`;
        const errorDetails = error.message;

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
            text: errorDetails,
            icon: "error"
        });

        console.error(`Error al realizar la petición fetch: ${error.message}`);
    }
}

async function guardarCambios() {
    try {
        const id = $('#id').val();

        const formData = {
            Codigo: $('#codigo').val(),
            PorcentajeDescuento: $('#porcentajeDescuento').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/descuento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el descuento: ${response.status}`);
        }

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
            title: 'Modificación exitosa',
        });

        loadTable();
        Limpiar();
    } catch (error) {
        const errorMessage = `Error al actualizar el descuento: ${error.message}`;
        const errorDetails = error.message;

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
            text: errorDetails,
            icon: "error"
        });

        console.error(`Error al realizar la petición fetch: ${error.message}`);
    }
}

async function deleteById(id) {
    try {
        const confirmResult = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            showCancelButton: true,
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/descuento/eliminar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el descuento: ${response.status}`);
        }

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
            title: 'Registro eliminado con éxito'
        });

        loadTable();
    } catch (error) {
        const errorMessage = `Error al eliminar el descuento: ${error.message}`;
        const errorDetails = error.message;

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
            text: errorDetails,
            icon: "error"
        });

        console.error(`Error al realizar la petición fetch: ${error.message}`);
    }
}

function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#porcentajeDescuento').val('');
    $("#estado").prop('checked', false);
}