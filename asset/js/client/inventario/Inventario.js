var dataTableInitialized = false;

function performAction() {

    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        validarCamposFormulario();

        if ($('#codigo').valid() && $('#precioVenta').valid() && $('#productoId').valid() && $('#precioProveedor').valid() && $('#cantidad').valid()) {
            agregarInventario();
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

function loadTable() {
    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = "";
            items.data.forEach(function (inventario, index, array) {
                registros += `
                    <tr class="table-light fadeIn">
                        <td class="table-cell-width">${inventario.Codigo}</td>
                        <td class="table-cell-width">${inventario.ProductoId.Codigo}</td>
                        <td class="table-cell-width">${inventario.ProductoId.Nombre}</td>
                        <td class="table-cell-width">${inventario.PrecioVenta}</td>
                        <td class="table-cell-width">${inventario.PrecioProveedor}</td>
                        <td class="table-cell-width">${inventario.Cantidad}</td>
                        <td class="table-cell-width estado-table ${inventario.Estado === 'Activo' ? 'activo' : 'inactivo'}">${inventario.Estado}</td>
                        <td class="table-cell-width">
                            <div class="row-actions">
                                <div class="row-action" onclick="showDetails(${inventario.id})">
                                    <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                                </div>
                                <div class="row-action" onclick="findById(${inventario.id})">
                                    <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                                </div>
                                <div class="row-action" onclick="deleteById(${inventario.id})">
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
                                    'Inventario.json'
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
            let errorMessage = "Error al obtener la lista de inventario4";
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
            url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario/' + id,
            type: 'GET',
            dataType: 'json',
            success: function (inventario) {
                $('#id').val(inventario.data.id);
                $('#codigo').val(inventario.data.Codigo);
                $('#precioProveedor').val(inventario.data.PrecioProveedor);
                $('#precioVenta').val(inventario.data.PrecioVenta);
                $('#cantidad').val(inventario.data.Cantidad);
                $('#productoId').val(inventario.data.ProductoId.id);


                $("#estado").prop("checked", inventario.data.Estado === 'Activo');
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
                    title: inventario.message
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

function agregarInventario() {

    var formData = {
        Codigo: $('#codigo').val(),
        ProductoId: {
            id: $('#productoId').val()
        },
        PrecioVenta: $('#precioVenta').val(),
        PrecioProveedor: $('#precioProveedor').val(),
        Cantidad: $('#cantidad').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    $.ajax({
        type: 'POST',
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (item) {
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
                title: item.message
            })
            Limpiar();
            loadTable();
        },
        error: function (jqXHR, textStatus, errorThrown) {

            let errorMessage = "Ha ocurrido un error al registrar el producto";

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
        ProductoId: {
            id: $('#productoId').val()
        },
        PrecioVenta: $('#precioVenta').val(),
        PrecioProveedor: $('#precioProveedor').val(),
        Cantidad: $('#cantidad').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    $.ajax({
        type: 'PUT',
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario/' + id,
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

            let errorMessage = "Ha ocurrido un error al registrar el producto";

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
                url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario/' + id,
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
    $('#productoId').val('0');
    $('#precioVenta').val('');
    $('#precioProveedor').val('');
    $('#cantidad').val('');
    $("#estado").prop('checked', false);
}

function validarCamposFormulario() {

    $('#formulario').validate({
        rules: {
            codigo: {
                required: true,
                minlength: 3
            },
            ProductoId: {
                required: true,
                maxlength: 15,
            },
            precioVenta: {
                required: true
            },
            precioProveedor: {
                required: true
            }
        },
        messages: {
            codigo: {
                required: 'Por favor, ingresa un código',
                minlength: 'El código debe tener al menos {0} caracteres'
            },
            nombre: {
                required: 'Por favor, ingresa un nombre',
                letras: 'Por favor, ingresa solo letras en la ruta'
            },
            ProductoId: {
                required: 'Por favor, ingresa una producto',
                letras: 'Por favor, ingresa solo letras en la etiqueta'
            },
            precioVenta: {
                required: 'Por favor, ingresa un precio de venta'
            },
            precioProveedor: {
                required: 'Por favor, ingrese el precio para proveedor'
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