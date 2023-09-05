var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
        $('#myModal').modal('hide');
    } else {
        validarCamposFormulario();

        if ($('#usuario').valid() && $('#contraseña').valid() && $('#personaId').valid()) {
            agregarUsuario();
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
}


$(document).ready(function () {
    var passwordRequirements = $('.password-requirements');

    passwordRequirements.hide();

    $('#contraseña').on('focus', function () {
        passwordRequirements.show();
    }).on('blur', function () {
        passwordRequirements.hide();
    });
});

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/usuario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar la tabla de usuarios: ${response.status}`);
        }

        const data = await response.json();

        var registros = "";
        data.data.forEach(function (usuario, index, array) {
            var password = usuario.Contraseña;
            var asterisks = '';
            for (var i = 0; i < password.length; i++) {
                asterisks += '*';
            }
            var passwordMasked = asterisks;
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${usuario.id}</td>
                    <td class="table-cell-width">${usuario.PersonaId.Nombres} ${usuario.PersonaId.Apellidos}</td>
                    <td class="table-cell-width">${usuario.Usuario}</td>
                    <td class="table-cell-width">${passwordMasked}</td>
                    <td class="table-cell-width ${usuario.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${usuario.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${usuario.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i>
                            </div>
                            <div class="row-action" onclick="findById(${usuario.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i>
                            </div>
                            <div class="row-action" onclick="deleteById(${usuario.id})">
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
        console.error(error);
    }
}

async function findById(id) {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/usuario/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al buscar el usuario: ${response.status}`);
        }

        const usuario = await response.json();

        $('#id').val(usuario.data.id);
        $('#usuario').val(usuario.data.Usuario);
        $('#contraseña').val(usuario.data.Contraseña);
        $('#personaId').val(usuario.data.PersonaId.id);
        $("#estado").prop("checked", usuario.data.Estado === 'Activo');

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
            title: 'Usuario encontrado',
        });

        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
        let errorMessage = "Error al obtener el usuario";
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

        console.error(`Error al realizar la petición Fetch: ${error.message}`);
    }
}

async function agregarUsuario() {
    try {
        var formData = {
            PersonaId: {
                id: $('#personaId').val()
            },
            Usuario: $('#usuario').val(),
            Contraseña: $('#contraseña').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el usuario: ${response.status}`);
        }

        const result = await response.json();

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
            title: 'Registro exitoso',
        });

        Limpiar();
        loadTable();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al registrar el usuario";

        if (error.responseJSON && error.responseJSON.message) {
            errorMessage += ": " + error.responseJSON.message;
        }

        const errorDetails = error.message;
        const errorDescription = errorDetails ? errorDetails : "Detalles del error desconocido";

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
            PersonaId: {
                id: $('#personaId').val()
            },
            Usuario: $('#usuario').val(),
            Contraseña: $('#contraseña').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el usuario: ${response.status}`);
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
        let errorMessage = "Ha ocurrido un error al actualizar el usuario";

        if (error.responseJSON && error.responseJSON.message) {
            errorMessage += ": " + error.responseJSON.message;
        }

        const errorDetails = error.message;
        const errorDescription = errorDetails ? errorDetails : "Detalles del error desconocido";

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
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/usuario/${id}`, {
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
            title: 'Error al realizar la petición: ' + error.message
        });
    }
}

function Limpiar() {
    $('#id').val('');
    $('#usuario').val('');
    $('#contraseña').val('');
    $('#personaId').val('0');
    $("#estado").prop('checked', false);
}


function validarCamposFormulario() {

    // $.validator.addMethod("letras", function (value, element) {
    //     return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    // }, "Por favor, ingresa solo letras.");

    $.validator.addMethod("strongPassword", function (value, element) {
        return this.optional(element) || (value.length >= 4 && /[A-Z]/.test(value) && /[!@#$%^&*]/.test(value));
    }, "La contraseña debe tener al menos 3 caracteres, una mayúscula y un carácter especial.");

    var passwordRequirements = $('.password-requirements');

    $('#contraseña').on('focus', function () {
        passwordRequirements.show();
    }).on('blur', function () {
        passwordRequirements.hide();
    });

    $('#formulario').validate({
        rules: {
            usuario: {
                required: true,
                minlength: 3
            },
            contraseña: {
                required: true,
                maxlength: 15,
                minlength: 3,
                strongPassword: true
            },
            personaId: {
                required: true,
            }
        },
        messages: {
            usuario: {
                required: 'Por favor, ingresa un Usuario',
                minlength: 'El usuario debe tener al menos {0} caracteres'
            },
            contraseña: {
                required: 'Por favor, ingresa una contraseña',
                maxlength: 'La contraseña no debe exceder los {0} caracteres'
            },
            personaId: {
                required: 'Por favor, selecione una persona',
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
        submitHandler: function (form) {
            if ($('#codigo').valid() && $('#ruta').valid() && $('#etiqueta').valid()) {
                agregarModulo();
            }
        }
    });
}