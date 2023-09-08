var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");
    validarCamposHabitacion();
    if ($('#habitacionId').valid() && $('#inventarioId').valid() && $('#cantidad').valid()) {
        if (action === "guardarCambios") {
            guardarCambios();
            $("#myModal").data("action", "");
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
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion',
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
                    <td class="table-cell-width">${habitacion.AdministracionHabitacionId.Codigo}</td>
                    <td class="table-cell-width">${habitacion.InventarioId.Codigo}</td>
                    <td class="table-cell-width">${habitacion.Cantidad}</td>
                    <td class="table-cell-width estado-table ${producto.Estado === 'Activo' ? 'activo' : 'inactivo'}">${producto.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${producto.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${producto.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${producto.id})">
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
        error: function (jqXHR, textStatus, errorThrown) {
            let errorMessage = "Error al obtener la lista de habitacion";
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
}

function findById(id) {
    $(document).ready(function () {
        $.ajax({
            url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion/' + id,
            type: 'GET',
            dataType: 'json',
            success: function (habitacion) {
                $('#id').val(habitacion.data.id);
                $('#habitacionId').val(habitacion.data.AdministracionHabitacionId.id);
                $('#inventarioId').val(habitacion.data.InventarioId.id);
                $('#cantidad').val(habitacion.data.Cantidad);
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
                let errorMessage = "Error al obtener el modulo";
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
        AdministracionHabitacionId: {
            id: $('#habitacionId').val()
        },
        InventarioId: {
            id: $('#inventarioId').val()
        },
        Cantidad: $('#cantidad').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    $.ajax({
        type: 'POST',
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion',
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
                title: result.message,
            })
            Limpiar();
            loadTable();
            
        },
        error: function (jqXHR, textStatus, errorThrown) {

            let errorMessage = "Ha ocurrido un error al registrar el habitacion";

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
            AdministracionHabitacionId: {
                id: $('#habitacionId').val()
            },
            InventarioId: {
                id: $('#inventarioId').val()
            },
            Cantidad: $('#cantidad').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        $.ajax({
            url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion/' + id,
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

//Accion para eliminar un registro seleccionado 
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
                url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion/' + id,
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
    $('#habitacionId').val('0');
    $('#inventarioId').val('0');
    $('#cantidad').val('');
    $("#estado").prop('checked', false);
}
function validarCamposHabitacion() {
    $.validator.addMethod("entero", function (value, element) {
        return /^\d+$/.test(value); // Verifica si el valor consiste solo en dígitos
    }, "Por favor, ingresa un número entero válido.");

    $('#formulario').validate({
        rules: {
            cantidad: {
                required: true,
                entero: true
            },
            habitacionId: {
                required: true
            },
            inventarioId: {
                required: true
            },

        },
        messages: {
            cantidad: {
                required: 'por favor, ingrese cantidad',
                entero: 'solo se pueden ingresar numeros enteros'
            },

            habitacionId: {
                required: 'Por favor, seleccione una habitacion '

            },
            inventarioId: {
                required: 'Por favor, seleccione un inventario',

            },

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