var dataTableInitialized = false;
var mensajeMostrado = false;


async function loadTable() {
    try {

        const loader = $("#loader");
        loader.show();

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            const actives = items.data.filter((consumoHabitacion) => consumoHabitacion.Estado === 'Activo');

            actives.forEach((consumoHabitacion) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${consumoHabitacion.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const payButton = `<button type="button" class="btn btn-primary mx-3" onclick="payById(${consumoHabitacion.id})"><i class="fa-solid fa-money-bill"></i></button>`;


                const estadoClass = consumoHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger';

                let porcentajeDescuento = '0%';

                if (consumoHabitacion.ReservaHabitacionesId.DescuentoId) {
                    // Verifica si DescuentoId es diferente de null antes de acceder a PorcentajeDescuento
                    porcentajeDescuento = consumoHabitacion.ReservaHabitacionesId.DescuentoId.PorcentajeDescuento + "%";
                }

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${payButton}
                    </div>
                `;

                table.row.add([consumoHabitacion.id, consumoHabitacion.Codigo, consumoHabitacion.ReservaHabitacionesId.HabitacionId.HuespedId.PersonaId.Nombres + " " + consumoHabitacion.ReservaHabitacionesId.HabitacionId.HuespedId.PersonaId.Apellidos, consumoHabitacion.ReservaHabitacionesId.FechaEntrada, consumoHabitacion.ReservaHabitacionesId.FechaSalida, porcentajeDescuento, `<span class="${estadoClass}">${consumoHabitacion.Estado}</span>`, actions]);
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

async function findById(id) {
    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/huesped/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const huesped = await response.json();

            $('#id').val(huesped.data.id);
            $('#codigo').val(huesped.data.Codigo);
            $('#personaId').val(huesped.data.PersonaId.id);
            $('#descuentoId').val(huesped.data.DescuentoId.id);
            $("#estado").prop("checked", huesped.data.Estado === 'Activo');

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
                title: huesped.message
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

function performAction() {

    var id = $('#id').val();

    var selectedValue = $('#reservaHabitacionId').val();

    var [reservaHabitacionId, habitacionId] = selectedValue.split('-');

    var formData = {
        Codigo: id && id !== '0' ? $('#codigo').val() : generateRandomCode(),
        ReservaHabitacionesId: {
            id: reservaHabitacionId,
        }
    };

    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion/' + id : 'https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion';
    var type = id && id !== '0' ? 'PUT' : 'POST';

    validarCamposFormulario();

    if ($('#reservaHabitacionId').valid()) {
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
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });

                $.ajax({
                    url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion/' + habitacionId,
                    method: 'PUT',
                    data: JSON.stringify({ Ocupado: true }),
                    contentType: 'application/json',
                    success: function () {
                        console.log('La habitación se actualizó correctamente.');
                    },
                    error: function (habXhr, habStatus, habError) {
                        console.error('Error al actualizar la habitación:', habError);
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

function payById(id) {
    const url = `https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion/checkOut/${id}`;

    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        success: function (result) {

            const modalContent = generateInvoice(result);

            $('body').append(modalContent);
            $('#checkoutModal').modal('show');
        },
        error: function (error) {
            console.error("Error en la solicitud:", error);
        }
    });
}

function generateInvoice(result) {

    const cantidadPorProducto = {};
    let totalAPagar = 0;  // Inicializamos en 0

    for (let i = 0; i < result.data.inventariosHabitacionId.length; i++) {
        const producto = result.data.inventariosHabitacionId[i];
        const codigoProducto = producto.Codigo;
        const cantidad = parseInt(producto.Cantidad, 10);
        const precioVenta = parseFloat(producto.InventarioId.PrecioVenta);

        if (cantidadPorProducto[codigoProducto]) {
            cantidadPorProducto[codigoProducto].cantidad += cantidad;
        } else {
            cantidadPorProducto[codigoProducto] = {
                cantidad,
                precioVenta,
                nombre: producto.InventarioId.ProductoId.Nombre,
            };
        }
        totalAPagar += cantidadPorProducto[codigoProducto].cantidad * precioVenta;
    }

    totalAPagar += parseFloat(result.data.ReservaHabitacionesId.HabitacionId.TipoHabitacionesId.Cantidad);

    const invoiceContent = `
        <div class="modal fade" id="checkoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Factura de CheckOut</h5>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4">
                            <p><strong>Codigo reserva:</strong> ${result.data.Codigo}</p>
                            <p><strong>Habitación:</strong> ${result.data.ReservaHabitacionesId.HabitacionId.TipoHabitacionesId.Titulo}</p>
                            <p><strong>Precio por habitación:</strong> $${result.data.ReservaHabitacionesId.HabitacionId.TipoHabitacionesId.Cantidad}</p>
                        </div>
                        <div class="mb-4">
                            <p><strong>Productos:</strong></p>
                            ${Object.keys(cantidadPorProducto).map(codigoProducto => `
                                <p>${codigoProducto} - (${cantidadPorProducto[codigoProducto].nombre}): $${(cantidadPorProducto[codigoProducto].cantidad * cantidadPorProducto[codigoProducto].precioVenta).toFixed(2)}</p>
                            `).join('')}
                        </div>
                        <p class="h4"><strong>Total a pagar:</strong> $${totalAPagar.toFixed(2)}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="realizarPago(${result.data.id})">Pagar</button>
                        </div>
                </div>
            </div>
        </div>
    `;
    return invoiceContent;
}

function realizarPago(id) {
    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion/eliminar/' + id,
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
                title: 'Se ha realizado el pago'
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

function validarCamposFormulario() {

    $('#formulario').validate({
        rules: {
            reservaHabitacionId: {
                required: true,
            }
        },
        messages: {
            reservaHabitacionId: {
                required: 'Por favor, seleccione una reserva para consumir.',
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

function Limpiar() {
    $('#reservaHabitacionId').val('0');
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
                title: 'Huespedes',
                download: 'open',
                customize: function (doc) {
                    var table = doc.content[1].table;

                    table.widths = ['10%', '15%', '30%', '10%', '1%'];
                    table.padding = [0, 10, 0, 0];
                    table.fontSize = 12;
                    table.alignment = 'center';

                    doc.content[1].table.headerRows = 1;
                    doc.content[1].table.widths = ['20%', '20%', '20%', '20%', '35%'];
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
                            cell.alignment = (j === 3) ? 'center' : 'left';
                            cell.margin = [0, 5, 0, 5];
                            if (j === 3) {
                                if (cell.text === 'Activo') {
                                    cell.color = 'green';
                                } else if (cell.text === 'Inactivo') {
                                    cell.color = 'red';
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
                    doc.content[1].text = 'Registro huespedes.pdf';
                }
            }
        ],
        responsive: true,
        colReorder: true,
        select: true
    });

    loadTable();
});