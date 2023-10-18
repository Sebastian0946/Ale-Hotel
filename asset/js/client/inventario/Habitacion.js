var dataTableInitialized = false;
let mensajeMostrado = false;

async function loadTable() {
    try {

        const loader = $("#loader");
        loader.show();

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            const actives = items.data.filter((habitacion) => habitacion.Estado === 'Activo');

            actives.forEach((inventarioHabitacion) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${inventarioHabitacion.id})"><i class="fa-solid fa-user-pen"></i></button>`;

                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${inventarioHabitacion.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = inventarioHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const resultado = (inventarioHabitacion.InventarioId.PrecioVenta * inventarioHabitacion.Cantidad).toLocaleString('es-CO');

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([inventarioHabitacion.id, inventarioHabitacion.AdministracionHabitacionId.Codigo, inventarioHabitacion.AdministracionHabitacionId.Descripcion, inventarioHabitacion.InventarioId.Codigo, inventarioHabitacion.InventarioId.ProductoId.Nombre, inventarioHabitacion.Cantidad, resultado,`<span class="${estadoClass}">${inventarioHabitacion.Estado}</span>`, actions]);
            });

            table.draw();

            loader.hide();

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
        loader.hide();
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
        loader.hide();
    }
}

function findById(id) {
    $(document).ready(function () {
        $.ajax({
            url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion/' + id,
            type: 'GET',
            dataType: 'json',
            success: function (habitacion) {
                $('#id').val(habitacion.data.id);
                $('#codigo').val(habitacion.data.Codigo);
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

                console.log(`Error al realizar la petición: ${textStatus}, ${errorThrown}`);
            }
        });
    });
}

function performAction() {

    var id = $('#id').val();

    var inventarioId = $('#inventarioId').val();

    var cantidadHabitacion = $('#cantidad').val();

    var formData = {
        Codigo: id && id !== '0' ? $('#codigo').val() : generateRandomCode(),
        AdministracionHabitacionId: {
            id: $('#habitacionId').val()
        },
        InventarioId: {
            id: inventarioId
        },
        Cantidad: cantidadHabitacion,
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo',
    };

    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion/' + id : 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion';
    var type = id && id !== '0' ? 'PUT' : 'POST';

    validarCamposHabitacion();

    if ($('#habitacionId').valid() && $('#inventarioId').valid() && $('#cantidad').valid()) {
        $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (result) {
                $.ajax({
                    url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario',
                    method: 'GET',
                    dataType: 'json',
                    success: function (inventario) {
                        if (inventario && inventario.data.Cantidad) {
                            var cantidadInventario = parseFloat(inventario.data.Cantidad);
                            var nuevaCantidadInventario = cantidadInventario - parseFloat(cantidadHabitacion);

                            var datosActualizados = {
                                Cantidad: nuevaCantidadInventario
                            };

                            $.ajax({
                                url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario/' + inventarioId,
                                method: 'PUT',
                                data: JSON.stringify(datosActualizados),
                                contentType: 'application/json',
                                success: function (respuesta) {
                                    if (respuesta && respuesta.message) {
                                        console.log('La cantidad de inventario se actualizó correctamente.');
                                    }
                                },
                                error: function (xhr, estado, error) {
                                    console.error('Error al actualizar la cantidad de inventario:', error);
                                }
                            });
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
                            icon: id && id !== '0' ? 'warning' : 'success',
                            title: result.message || 'Cambios guardados con éxito'
                        });

                        loadTable();
                        Limpiar();
                        $("#myModal").data("action", "");
                        $('#myModal').modal('hide');
                    },
                    error: function (habXhr, habStatus, habError) {
                        console.error('Error al obtener los datos de inventario:', habError);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let errorMessage = "Ha ocurrido un error al ";

                if (id && id !== '0') {
                    errorMessage += "actualizar el inventario de habitación";
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
        $('.is-invalid').removeClass('is-invalid');
    });

    function generateRandomCode() {
        var randomCode = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.random().toString(10).substring(2, 7);
        return randomCode.substring(0, 5);
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
                url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventarioHabitacion/eliminar/' + id,
                method: "PUT",
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
    $('#codigo').val('');
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
                title: 'Inventario Habitacion',
                download: 'open',
                customize: function (doc) {
                    var table = doc.content[1].table;

                    table.widths = ['5%', '20%', '20%', '20%', '25', '10%'];
                    table.padding = [0, 10, 0, 0];
                    table.fontSize = 12;
                    table.alignment = 'center';

                    doc.content[1].table.headerRows = 1;
                    doc.content[1].table.widths = ['10%', '20%', '20%', '20%', '15%', '10%'];
                    doc.content[1].table.body[0].forEach(function (headerCell) {
                        headerCell.fillColor = '#f2f2f2';
                        headerCell.color = 'black';
                        headerCell.fontSize = 14;
                        headerCell.bold = true;
                        headerCell.alignment = 'center';
                        headerCell.margin = [0, 8, 0, 8];
                    });

                    for (var i = 1; i < doc.content[1].table.body.length; i++) {
                        var row = doc.content[1].table.body[i];
                        row.forEach(function (cell, j) {
                            cell.fontSize = 12;
                            cell.alignment = (j === 4) ? 'center' : 'left';
                            cell.margin = [0, 5, 0, 5];
                            if (j === 4) {
                                if (cell.text === 'Activo') {
                                    cell.color = 'green'; // Texto verde para "Activo"
                                } else if (cell.text === 'Inactivo') {
                                    cell.color = 'red'; // Texto rojo para "Inactivo"
                                }
                            }
                        });
                    }

                    doc.styles.tableHeader = {
                        fontSize: 12,
                        bold: true,
                        fillColor: '#f2f2f2',
                        alignment: 'center'
                    };
                    doc.content[1].text = 'categoria.pdf';
                }
            }
        ],
        responsive: true,
        colReorder: true,
        select: true
    });

    loadTable();
});