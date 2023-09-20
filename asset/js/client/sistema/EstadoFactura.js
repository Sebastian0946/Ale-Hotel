var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        agregarEstadoFactura();
    }
    // Cerrar el modal
    $('#myModal').modal('hide');
}

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de estados de factura: ${response.status}`);
        }

        const responseData = await response.json();
        const { message, data } = responseData;

        let registros = "";
        data.forEach(function (estadoFactura, index, array) {
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${estadoFactura.id}</td>
                    <td class="table-cell-width">${estadoFactura.Codigo}</td>
                    <td class="table-cell-width">${estadoFactura.Descripcion}</td>
                    <td class="table-cell-width ${estadoFactura.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${estadoFactura.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${estadoFactura.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i>
                            </div>
                            <div class="row-action" onclick="findById(${estadoFactura.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i>
                            </div>
                            <div class="row-action" onclick="deleteById(${estadoFactura.id})">
                                <i class="fa-solid fa-trash btn btn-danger"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        document.getElementById('dataResult').innerHTML = registros;

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

    } catch (error) {
        console.error(`Error al cargar la tabla: ${error.message}`);
    }
}

async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el estado de factura: ${response.status}`);
        }

        const responseData = await response.json();
        const { message, data } = responseData;

        if (data) {
            const estadoFactura = data;

            $('#id').val(estadoFactura.id);
            $('#codigo').val(estadoFactura.Codigo);
            $('#descripcion').val(estadoFactura.Descripcion);
            $("#estado").prop("checked", estadoFactura.Estado === 'Activo');

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
                title: 'Estado Factura encontrado',
            });

            $("#myModal").data("action", "guardarCambios");
            $('#myModal').modal('show');
        } else if (message) {
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
    } catch (error) {
        console.error(`Error al obtener el estado de factura: ${error.message}`);
    }
}

async function agregarEstadoFactura() {
    try {
        var formData = {
            Codigo: $('#codigo').val(),
            Descripcion: $('#descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el estado de factura: ${response.status}`);
        }

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
        })

        Toast.fire({
            icon: 'success',
            title: 'Registro exitoso',
        })

        Limpiar();
        loadTable();
    } catch (error) {
        console.error(`Error al registrar el estado de factura: ${error.message}`);
    }
}

async function guardarCambios() {
    try {
        var id = $('#id').val();

        var formData = {
            Codigo: $('#codigo').val(),
            Descripcion: $('#descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el estado de factura: ${response.status}`);
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
        })

        Toast.fire({
            icon: 'warning',
            title: 'Modificación exitosa',
        })

        loadTable();
        Limpiar();
    } catch (error) {
        console.error(`Error al actualizar el estado de factura: ${error.message}`);
    }
}

async function deleteById(id) {
    try {
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
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el estado de factura: ${response.status}`);
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
        }
    } catch (error) {
        console.error(`Error al eliminar el estado de factura: ${error.message}`);
    }
}

function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#descripcion').val('0');
    $("#estado").prop('checked', false);
}