var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
        $('#myModal').modal('hide');
    } else {
        validarCamposFormulario();

        if ($('#codigo').valid() && $('#ruta').valid() && $('#etiqueta').valid() && $('#icono').valid() && $('#moduloId').valid()) {

            agregarFormulario();
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

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/formulario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            let registros = "";

            items.data.forEach(function (formulario) {

                const moduloInfo = `${formulario.ModuloId.Ruta} - ${formulario.ModuloId.Etiqueta}`;

                registros += `
                    <tr class="table-light fadeIn">
                        <td class="table-cell-width">${formulario.id}</td>
                        <td class="table-cell-width">${formulario.Codigo}</td>
                        <td class="table-cell-width" style="width: 20%;">${moduloInfo}</td>
                        <td class="table-cell-width">${formulario.Ruta}</td>
                        <td class="table-cell-width" style="text-align: center;"><i class="${formulario.Icono}"></i></td>
                        <td class="table-cell-width">${formulario.Etiqueta}</td>
                        <td class="table-cell-width ${formulario.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${formulario.Estado}</td>
                        <td class="table-cell-width">
                            <div class="row-actions">
                                <div class="row-action" onclick="showDetails(${formulario.id})">
                                    <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                                </div>
                                <div class="row-action" onclick="findById(${formulario.id})">
                                    <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                                </div>
                                <div class="row-action" onclick="deleteById(${formulario.id})">
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
                                    'Formulario.json'
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
            const errorResponse = await response.json();
            let errorMessage = "Error al obtener la lista de formulario";
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

async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/formulario/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {

            const formulario = await response.json();

            $('#id').val(formulario.data.id);
            $('#codigo').val(formulario.data.Codigo);
            $('#ruta').val(formulario.data.Ruta);
            $('#icono').val(formulario.data.Icono);
            $('#etiqueta').val(formulario.data.Etiqueta);
            $('#moduloId').val(formulario.data.ModuloId.id);
            $("#estado").prop("checked", formulario.data.Estado === 'Activo');

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
                title: formulario.message
            });

            $("#myModal").data("action", "guardarCambios");
            $('#myModal').modal('show');

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


async function agregarFormulario() {

    var formData = {
        ModuloId: {
            id: $('#moduloId').val()
        },
        Codigo: $('#codigo').val(),
        Ruta: $('#ruta').val(),
        Etiqueta: $('#etiqueta').val(),
        Icono: $('#icono').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/formulario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {

            const item = await response.json();

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
                title: item.message,
            });

            Limpiar();
            loadTable();
        } else {

            const errorResponse = await response.json();
            let errorMessage = "Ha ocurrido un error al registrar el formulario";
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
    var id = $('#id').val();

    var formData = {
        ModuloId: {
            id: $('#moduloId').val()
        },
        Codigo: $('#codigo').val(),
        Ruta: $('#ruta').val(),
        Etiqueta: $('#etiqueta').val(),
        Icono: $('#icono').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/formulario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const item = await response.json();

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
                title: item.message,
            });

            loadTable();
            Limpiar();
        } else {
            const errorResponse = await response.json();
            let errorMessage = "Ha ocurrido un error al actualizar el formulario";
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

function deleteById(id) {
    Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/formulario/' + id,
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
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
                        title: result.message
                    });
                    loadTable();
                },
                error: function (jqXHR, textStatus, errorThrown) {
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
                        title: 'Error al realizar la petición Ajax: ' + textStatus + ', ' + errorThrown
                    });
                }
            });
        }
    });
}

function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#ruta').val('');
    $('#etiqueta').val('');
    $('#icono').val('');
    $('#moduloId').val('0');
    $("#estado").prop('checked', false);
}


function validarCamposFormulario() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Por favor, ingresa solo letras.");

    $('#formulario').validate({
        rules: {
            codigo: {
                required: true,
                minlength: 3
            },
            ruta: {
                required: true,
                maxlength: 15,
                letras: true
            },
            etiqueta: {
                required: true,
                maxlength: 15,
                letras: true
            },
            icono: {
                required: true,
            },
            moduloId: {
                required: true
            }
        },
        messages: {
            codigo: {
                required: 'Por favor, ingresa un código',
                minlength: 'El código debe tener al menos {0} caracteres'
            },
            ruta: {
                required: 'Por favor, ingresa una ruta',
                letras: 'Por favor, ingresa solo letras en la ruta'
            },
            etiqueta: {
                required: 'Por favor, ingresa una etiqueta',
                letras: 'Por favor, ingresa solo letras en la etiqueta'
            },
            icono: {
                required: 'Por favor, ingresa una clase de icono',
            },
            moduloId: {
                required: 'Por favor, selecciona un módulo'
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

