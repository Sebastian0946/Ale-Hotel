var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");
    validarCampos();
    if ($('#codigo').valid() && $('#descripcion').valid()) {
        if (action === "guardarCambios") {
            guardarCambios();
            $("#myModal").data("action", "");
            $('#myModal').modal('hide');
        } else {
            agregarHuesped();
            $('#myModal').modal('hide');
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
        // Obtén una referencia al formulario
        var form = $("#formulario");
        // Resetea el formulario para quitar los mensajes de error
        form.validate().resetForm();
        // Desactiva las alertas aquí
        // Puedes ocultar las alertas o realizar cualquier acción que desees
        $('.is-invalid').removeClass('is-invalid');
    });
}


async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/huesped', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            let registros = "";

            items.data.forEach(function (huesped) {
                registros += `
                    <tr class="table-light fadeIn">
                        <td class="table-cell-width">${huesped.id}</td>
                        <td class="table-cell-width">${huesped.Codigo}</td>
                        <td class="table-cell-width">${categoria.Descripcion}</td>
                        <td class="table-cell-width estado-table ${categoria.Estado === 'Activo' ? 'activo' : 'inactivo'}">${categoria.Estado}</td>
                        <td class="table-cell-width">
                            <div class="row-actions">
                                <div class="row-action" onclick="showDetails(${categoria.id})">
                                    <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                                </div>
                                <div class="row-action" onclick="findById(${categoria.id})">
                                    <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                                </div>
                                <div class="row-action" onclick="deleteById(${categoria.id})">
                                    <i class="fa-solid fa-trash btn btn-danger"></i>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            });

            dataResult.innerHTML = registros;

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
                                    'Categoria.json'
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

            if (items.message) {
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
        } else {
            const errorResponse = await response.json();
            let errorMessage = "Error al obtener la lista de categoría";
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
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/huesped/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const categoria = await response.json();

            $('#id').val(categoria.data.id);
            $('#codigo').val(categoria.data.Codigo);
            $('#descripcion').val(categoria.data.Descripcion);
            $("#estado").prop("checked", categoria.data.Estado === 'Activo');

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
                title: categoria.message
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
        }
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
    }
}

function agregarHuesped() {

    var formData = {
        Codigo: $('#codigo').val(),
        Descripcion: $('#descripcion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    $.ajax({
        type: 'POST',
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (result) {
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
                title: result.message
            })
            Limpiar();
            loadTable();
        },
        error: function (jqXHR, textStatus, errorThrown) {

            let errorMessage = "Ha ocurrido un error al registrar el rol";

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

function guardarCambios() {


    var id = $('#id').val();

    var formData = {
        Codigo: $('#codigo').val(),
        Descripcion: $('#descripcion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped/' + id,
        type: 'PUT',
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
            })

            Toast.fire({
                icon: 'warning',
                title: result.message
            })
            loadTable();
            Limpiar();
        },
        error: function (jqXHR, textStatus, errorThrown) {

            let errorMessage = "Ha ocurrido un error al actualizar la categoria";

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
                url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped/' + id,
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
    $('#descripcion').val('');
    $("#estado").prop('checked', false);
}

function validarCampos() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Por favor, ingresa solo letras.");

    $('#formulario').validate({
        rules: {
            codigo: {
                required: true,
                minlength: 3
            },
            descripcion: {
                required: true,
                maxlength: 15,
                letras: true
            }
        },
        messages: {
            codigo: {
                required: 'Por favor, ingresa un código',
                minlength: 'El código debe tener al menos {0} caracteres'
            },
            descripcion: {
                required: 'Por favor, ingresa la descripcion',
                letras: 'Por favor, ingresa solo letras en la etiqueta'
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