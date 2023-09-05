var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        validarCamposFormulario();

        if ($('#usuarioId').valid() && $('#rolId').valid()) {
            agregarUsuarioRol();
            $('#myModal').modal('hide');
        } else {
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
                title: 'Campos incompletos o inválidos',
                text: 'Por favor, verifica todos los campos antes de continuar.',
                icon: "error"
            });
        }
    }
    $('#myModal').modal('hide');
}

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/usuarioRol', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de rol de usuario: ${response.status}`);
        }

        const items = await response.json();
        var registros = "";
        items.data.forEach(function (usuarioRol, index, array) {
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${usuarioRol.id}</td>
                    <td class="table-cell-width">${usuarioRol.UsuariosId.Usuario}</td>
                    <td class="table-cell-width">${usuarioRol.RolesId.Descripcion}</td>
                    <td class="table-cell-width ${usuarioRol.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${usuarioRol.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${usuarioRol.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${usuarioRol.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${usuarioRol.id})">
                                <i class="fa-solid fa-trash btn btn-danger"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        })
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
                                'Usuario.json'
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
            title: error.message,
            icon: "error"
        });
    }
}

async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/usuarioRol/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el rol de usuario: ${response.status}`);
        }

        const usuarioRol = await response.json();
        $('#id').val(usuarioRol.data.id);
        $('#usuarioId').val(usuarioRol.data.UsuariosId.id)
        $('#rolId').val(usuarioRol.data.RolesId.id)
        $("#estado").prop("checked", usuarioRol.data.Estado === 'Activo');

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
            title: 'Rol de usuario encontrado',
        });

        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
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
            title: error.message,
            icon: "error"
        });

        console.error(`Error al realizar la petición fetch: ${error.message}`);
    }
}

async function agregarUsuarioRol() {
    try {
        const formData = {
            UsuariosId: {
                id: $('#usuarioId').val()
            },
            RolesId: {
                id: $('#rolId').val()
            },
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/usuarioRol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el rol de usuario: ${response.status}`);
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
        const errorMessage = `Ha ocurrido un error al registrar el rol de usuario: ${error.message}`;

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

async function guardarCambios() {
    try {
        const id = $('#id').val();

        const formData = {
            UsuariosId: {
                id: $('#usuarioId').val()
            },
            RolesId: {
                id: $('#rolId').val()
            },
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/usuarioRol/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el rol del usuario: ${response.status}`);
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
        const errorMessage = `Ha ocurrido un error al actualizar el rol del usuario: ${error.message}`;

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

async function deleteById(id) {
    const confirmation = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmation.isConfirmed) {
        try {
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/usuarioRol/${id}`, {
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
        } catch (error) {
            const errorMessage = `Ha ocurrido un error al eliminar el registro: ${error.message}`;
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
}

function Limpiar() {
    $('#id').val('');
    $('#usuarioId').val('0');
    $('#rolId').val('0');
    $("#estado").prop('checked', false);
}

function validarCamposFormulario() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Por favor, ingresa solo letras.");

    $('#formulario').validate({
        rules: {
            usuarioId: {
                required: true
            },
            rolId: {
                required: true
            }
        },
        messages: {
            usuarioId: {
                required: 'Por favor, selecione un usuario',
            },
            rolId: {
                required: 'Por favor, selecione un rol',
            }
        },
        errorClass: 'is-invalid',
        errorElement: 'div',
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .removeClass(errorClass);
        },
    });
}