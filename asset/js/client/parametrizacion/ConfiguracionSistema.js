var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        agregarConfiguracionSistema();
    }
    $('#myModal').modal('hide');
}

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/ConfiguracionSistema', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de configuraciones del sistema: ${response.status}`);
        }

        const items = await response.json();
        var registros = "";

        items.data.forEach(function (ConfiguracionSistema, index, array) {
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${ConfiguracionSistema.id}</td>
                    <td class="table-cell-width">${ConfiguracionSistema.Codigo}</td>
                    <td class="table-cell-width">${ConfiguracionSistema.UsuarioId.Usuario}</td>
                    <td class="table-cell-width">${ConfiguracionSistema.Nombre}</td>
                    <td class="table-cell-width">${ConfiguracionSistema.Descripcion}</td>
                    <td class="table-cell-width ${ConfiguracionSistema.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${ConfiguracionSistema.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${ConfiguracionSistema.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${ConfiguracionSistema.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${ConfiguracionSistema.id})">
                                <i class="fa-solid fa-trash btn btn-danger"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

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
                                'ConfiguracionSistema.json'
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
        console.error(`Error al obtener la lista de configuraciones del sistema: ${error.message}`);
    }
}

async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/parametrizacion/ConfiguracionSistema/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la configuración del sistema: ${response.status}`);
        }

        const data = await response.json();
        const ConfiguracionSistema = data.data;

        $('#id').val(ConfiguracionSistema.id);
        $('#Codigo').val(ConfiguracionSistema.Codigo);
        $('#usuarioId').val(ConfiguracionSistema.UsuarioId.id);
        $('#Nombre').val(ConfiguracionSistema.Nombre);
        $('#Descripcion').val(ConfiguracionSistema.Descripcion);
        $("#estado").prop("checked", ConfiguracionSistema.Estado === 'Activo');

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
            title: data.message
        });

        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
        console.error(`Error al obtener la configuración del sistema: ${error.message}`);

        const errorMessage = "Error al obtener la configuración del sistema";
        const errorDescription = error.message;

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
}

async function agregarConfiguracionSistema() {

    try {
        var formData = {
            Codigo: $('#Codigo').val(),
            UsuarioId: {
                id: $('#usuarioId').val()
            },
            Nombre: $('#Nombre').val(),
            Descripcion: $('#Descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/ConfiguracionSistema', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar la configuración del sistema: ${response.status}`);
        }

        const data = await response.json();

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
        console.error(`Error al registrar la configuración del sistema: ${error.message}`);

        let errorMessage = "Ha ocurrido un error al registrar la configuración del sistema";

        if (error.responseJSON && error.responseJSON.message) {
            errorMessage += ": " + error.responseJSON.message;
        }

        const errorDescription = error.message;

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
}

async function guardarCambios() {

    try {

        var id = $('#id').val();

        var formData = {
            Codigo: $('#Codigo').val(),
            UsuarioId: {
                id: $('#usuarioId').val()
            },
            Nombre: $('#Nombre').val(),
            Descripcion: $('#Descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/ConfiguracionSistema/'+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la configuración del sistema: ${response.status}`);
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
        console.error(`Error al actualizar la configuración del sistema: ${error.message}`);

        let errorMessage = "Ha ocurrido un error al actualizar la configuración del sistema";

        if (error.responseJSON && error.responseJSON.message) {
            errorMessage += ": " + error.responseJSON.message;
        }

        const errorDescription = error.message;

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
            const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/ConfiguracionSistema/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el registro: ${response.status}`);
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
        console.error(`Error al eliminar el registro: ${error.message}`);

        const errorMessage = "Ha ocurrido un error al eliminar el registro";
        const errorDescription = error.message;

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
            title: errorMessage,
            text: errorDescription
        });
    }
}

function Limpiar() {
    $('#Codigo').val('');
    $('#usuarioId').val('');
    $('#Nombre').val('');
    $('#Descripcion').val('');
    $("#estado").prop('checked', false);
}