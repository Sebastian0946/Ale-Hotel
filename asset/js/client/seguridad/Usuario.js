var dataTableInitialized = false;

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

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/usuario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            items.data.forEach((usuario) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${usuario.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${usuario.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = usuario.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const passwordField = '***';

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([
                    usuario.id,
                    usuario.PersonaId.Nombres + " " + usuario.PersonaId.Apellidos,
                    `<div class="col-3">${usuario.Usuario}</div>`,
                    passwordField,
                    `<span class="${estadoClass} text-center">${usuario.Estado}</span>`,
                    actions
                ]);
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

function performAction() {

    var id = $('#id').val();

    var formData = {
        PersonaId: {
            id: $('#personaId').val()
        },
        Usuario: $('#usuario').val(),
        Contraseña: $('#contraseña').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/seguridad/usuario/' + id : 'https://hotel-api-hzf6.onrender.com/api/seguridad/usuario';
    var type = id && id !== '0' ? 'PUT' : 'POST';

    validarCamposFormulario();

    function sendRequest() {
        $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (result) {
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
                    icon: id && id !== '0' ? 'warning' : 'success',
                    title: result.message
                });

                loadTable();

                Limpiar();
                $("#myModal").data("action", "");
                $('#myModal').modal('hide');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let errorMessage = "Ha ocurrido un error al ";

                if (id && id !== '0') {
                    errorMessage += "actualizar el usuario";
                } else {
                    errorMessage += "registrar el rol";
                }

                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    errorMessage += ": " + jqXHR.responseJSON.message;
                }

                const errorDetails = jqXHR.responseText.match(/Error: (.+?)<br>/);
                const errorDescription = errorDetails ? errorDetails[1] : "Detalles del error desconocido";

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
        });
    }

    if ($('#usuario').valid() && $('#contraseña').valid() && $('#personaId').valid()) {
        if (type === 'PUT') {
            Swal.fire({
                title: '¿Está seguro de guardar los cambios?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    sendRequest();
                }
            });
        } else {
            sendRequest();
        }
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

    $('#myModal').on('hidden.bs.modal', function () {
        var form = $("#formulario");
        form.validate().resetForm();
        $('. is-invalid').removeClass(' is-invalid');
    });
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

    });
}

$(document).ready(function () {
    $('#table').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
        },
        paging: true,
        pageLength: 5,
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
                title: 'Usuario',
                download: 'open',
                customize: function (doc) {
                    var table = doc.content[1].table;

                    // Calcula el ancho de cada columna de manera uniforme
                    var columnWidth = 100 / 6 + '%';
                    var columnWidths = Array(6).fill(columnWidth);

                    // Configuración de estilo de la tabla
                    table.widths = columnWidths;
                    table.fontSize = 12;
                    table.alignment = 'center';
                    table.margin = [0, 10, 0, 10];

                    // Configuración de los bordes
                    table.headerRows = 1; // Número de filas que son parte de la cabecera
                    table.body[0].forEach(function (headerCell) {
                        headerCell.fillColor = '#f2f2f2';
                        headerCell.color = 'black';
                        headerCell.fontSize = 14;
                        headerCell.bold = true;
                        headerCell.alignment = 'left';
                        headerCell.margin = [0, 8, 0, 8];
                        headerCell.vLineWidth = 1; // Grosor de las líneas verticales
                        headerCell.hLineWidth = 1; // Grosor de las líneas horizontales
                    });

                    for (var i = 1; i < table.body.length; i++) {
                        var row = table.body[i];
                        row.forEach(function (cell, j) {
                            cell.fontSize = 12;
                            cell.fillColor = i % 2 === 0 ? '#f2f2f2' : 'white'; // Alterna colores de fondo para resaltar filas
                            cell.color = 'black';
                            cell.alignment = 'left'; // Cambia la alineación a la izquierda
                            cell.margin = [5, 5, 5, 5];
                            cell.vLineWidth = 1; // Grosor de las líneas verticales
                            cell.hLineWidth = 1; // Grosor de las líneas horizontales

                            if (j === 3) {
                                cell.alignment = 'center';
                                if (cell.text === 'Activo') {
                                    cell.color = 'green';
                                } else if (cell.text === 'Inactivo') {
                                    cell.color = 'red';
                                }
                            }
                        });
                    }

                    doc.content[1].text = 'Usuario.pdf';
                }
            },
            {
                text: '<i class="fas fa-file-code"></i> JSON',
                action: function (e, dt, button, config) {
                    var pageInfo = dt.page.info();
                    var data = {
                        recordsTotal: pageInfo.recordsTotal,
                        recordsFiltered: pageInfo.recordsDisplay,
                        draw: pageInfo.draw,
                        data: dt.buttons.exportData()
                    };

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

    loadTable();
});