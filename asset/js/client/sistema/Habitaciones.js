var dataTableInitialized = false;
function performAction() {
    var action = $("#myModal").data("action");
    validarCamposHabitacion();
    if ($('#tipohabitacionId').valid() && $('#codigo').valid() && $('#descripcion').valid() ) {
        if (action === "guardarCambios") {
            guardarCambios();
            $("#myModal").data("action", "");
            $('#myModal').modal('hide');
        } else {
            agregarHabitacion();
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

function loadTable() {
    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = "";
            items.data.forEach(function (habitacion, index, array) {
                registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${habitacion.id}</td>
                    <td class="table-cell-width">${habitacion.TipoHabitacionesId.Descripcion}</td>
                    <td class="table-cell-width">${habitacion.Codigo}</td>
                    <td class="table-cell-width">${habitacion.Descripcion}</td>
                    <td class="table-cell-width estado-table ${habitacion.Estado === 'Activo' ? 'activo' : 'inactivo'}">${habitacion.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${habitacion.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${habitacion.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${habitacion.id})">
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
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function findById(id) {
    $(document).ready(function () {
        $.ajax({
            url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion/' + id,
            type: 'GET',
            dataType: 'json',
            success: function (habitacion) {
                $('#id').val(habitacion.data.id);
                $('#tipohabitacionId').val(habitacion.data.TipoHabitacionesId.id);
                $('#codigo').val(habitacion.data.Codigo);
                $('#descripcion').val(habitacion.data.Descripcion);
                $("#estado").prop("checked", habitacion.data.Estado === 'Activo');
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
                    title: habitacion.message,
                });
                $("#myModal").data("action", "guardarCambios");
                $('#myModal').modal('show');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let errorMessage = "Error al obtener la habitacion";
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

                console.log(`Error al realizar la petición Ajax: ${textStatus}, ${errorThrown}`);
            }
        });
    });
}

function agregarHabitacion() {
    var formData = {
        TipoHabitacionesId: {
            id: $('#tipohabitacionId').val()
        },
        Codigo: $('#codigo').val(),
        Descripcion: $('#descripcion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    $.ajax({
        type: 'POST',
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion',
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

            let errorMessage = "Ha ocurrido un error al registrar la habitacion";

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

    $(document).ready(function () {

        var id = $('#id').val();

        var formData = {
            TipoHabitacionesId: {
                id: $('#tipohabitacionId').val()
            },
            Codigo: $('#codigo').val(),
            Descripcion: $('#descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };
    

        $.ajax({
            url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion/' + id,
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
                    title: result.message,
                })
                loadTable();
                Limpiar();
            },
            error: function (jqXHR, textStatus, errorThrown) {

                let errorMessage = "Ha ocurrido un error al actualizar la habitacion";

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
                url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion/' + id,
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
    $('#tipohabitacionId').val('0');
    $('#codigo').val('');
    $('#descripcion').val('');
    $("#estado").prop('checked', false);
}
function validarCamposHabitacion() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Por favor, ingresa solo letras.");

    $('#formulario').validate({
        rules: {
            tipohabitacionId: {
                required: true,
                maxlength: 15
            },
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
            categoriaId: {
                required: 'Por favor, seleccione un tipo de habitación'
            },
            codigo: {
                required: 'Por favor, ingresa un código',
                minlength: 'El código debe tener al menos {0} caracteres'
            },
            descripcion: {
                required: 'Por favor, ingresa una descripción',
                letras: 'Por favor, ingresa solo letras en la ruta'
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