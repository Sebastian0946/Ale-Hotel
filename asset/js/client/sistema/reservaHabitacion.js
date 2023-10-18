var dataTableInitialized = false;
var mensajeMostrado = false;

async function loadTable() {

    const loader = $("#loader");
    loader.show();

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion',
        method: 'GET',
        contentType: 'application/json',
        success: function (items) {

            const table = $('#table').DataTable();

            table.clear();

            const actives = items.data.filter((reserva) => reserva.Estado === 'Activo');

            actives.forEach((reservaHabitacion) => {

                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${reservaHabitacion.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${reservaHabitacion.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = reservaHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger';

                // Formatea la fecha de entrada
                const fechaEntradaFormateada = moment(reservaHabitacion.FechaEntrada).format('YYYY-MM-DD HH:mm');
                // Formatea la fecha de salida
                const fechaSalidaFormateada = moment(reservaHabitacion.FechaSalida).format('YYYY-MM-DD HH:mm');

                const porcentajeDescuento = reservaHabitacion.DescuentoId ? reservaHabitacion.DescuentoId.PorcentajeDescuento : 0 + "%";

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([
                    reservaHabitacion.id,
                    reservaHabitacion.Codigo,
                    reservaHabitacion.HabitacionId.HuespedId.PersonaId.Nombres + " " + reservaHabitacion.HabitacionId.HuespedId.PersonaId.Apellidos,
                    reservaHabitacion.HabitacionId.TipoHabitacionesId.Titulo,
                    porcentajeDescuento,
                    fechaEntradaFormateada,
                    fechaSalidaFormateada,
                    `<span class="${estadoClass}">${reservaHabitacion.Estado}</span>`,
                    actions
                ]);
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
        },
        error: function (xhr, textStatus, errorThrown) {
            const errorMessage = `Error al realizar la petición AJAX. Estado: ${xhr.status}, Mensaje: ${errorThrown}`;
            console.error(errorMessage);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al cargar los datos',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000
            });

            loader.hide();
        },
        complete: function () {
            loader.hide();
        }
    });
}

function findById(id) {
    $(document).ready(function () {
        $.ajax({
            url: `https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (reservaHabitacion) {

                if (reservaHabitacion.data.DescuentoId == null) {
                    $('#id').val(reservaHabitacion.data.id);
                    $('#habitacionSistemaId').val(reservaHabitacion.data.HabitacionId.id);
                    $('#codigo').val(reservaHabitacion.data.Codigo);
                    $('#fechaEntrada').val(reservaHabitacion.data.FechaEntrada);
                    $('#fechaSalida').val(reservaHabitacion.data.FechaSalida);
                    $("#estado").prop("checked", reservaHabitacion.data.Estado === 'Activo');
                } else {
                    $('#id').val(reservaHabitacion.data.id);
                    $('#habitacionSistemaId').val(reservaHabitacion.data.HabitacionId.id);
                    $('#descuentoId').val(reservaHabitacion.data.DescuentoId.id),
                    $('#codigo').val(reservaHabitacion.data.Codigo);
                    $('#fechaEntrada').val(reservaHabitacion.data.FechaEntrada);
                    $('#fechaSalida').val(reservaHabitacion.data.FechaSalida);
                    $("#estado").prop("checked", reservaHabitacion.data.Estado === 'Activo');
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
                    title: reservaHabitacion.message
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

function performAction() {
    var id = $('#id').val();

    var formData = {
        Codigo: id && id !== '0' ? $('#codigo').val() : generateRandomCode(),
        HabitacionId: {
            id: $('#habitacionSistemaId').val()
        },
        DescuentoId: {
            id: $('#descuentoId').val() || null
        },
        FechaEntrada: $('#fechaEntrada').val(),
        FechaSalida: $('#fechaSalida').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion/' + id : 'https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion';
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
                    errorMessage += "actualizar el formulario";
                } else {
                    errorMessage += "registrar el rol";
                }

                let errorDescription = "Detalles del error desconocido";

                if (jqXHR.responseJSON) {
                    if (jqXHR.responseJSON.message) {
                        errorMessage += ": " + jqXHR.responseJSON.message;
                    }

                    if (jqXHR.responseJSON.details) {
                        errorDescription = jqXHR.responseJSON.details;
                    }
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
                    title: errorMessage,
                    text: errorDescription,
                    icon: "error"
                });
            }
        });
    }

    if ($('#codigo').valid() && $('#habitacionSistemaId').valid() && $('#fechaEntrada').valid() && $('#fechaSalida').valid()) {
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
                url: `https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion/eliminar/${id}`,
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
    $('#codigo').val('');
    $('#habitacionId').val(0);
    $('#descuentoId').val(0);
    $('#fechaEntrada').val('');
    $('#fechaSalida').val('');
    $('#estado').prop('checked', false);
}

function validarCamposFormulario() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s.]+$/.test(value);
    }, "Por favor, ingresa solo letras y puntos.");

    $('#formulario').validate({
        rules: {
            codigo: {
                required: true,
                minlength: 3
            },
            habitacionSistemaId: {
                required: true,
            },
            fechaEntrada: {
                required: true,
            },
            fechaSalida: {
                required: true
            }
        },
        messages: {
            codigo: {
                required: 'Por favor, ingresa un código',
                minlength: 'El código debe tener al menos {0} caracteres'
            },
            habitacionSistemaId: {
                required: 'Por favor, seleccione un habitacion',
            },
            fechaEntrada: {
                required: 'Por favor, ingresa una fecha de entrada',
            },
            fechaSalida: {
                required: 'Por favor, ingresa una fecha de salida',
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

    $('.fecha-input').each(function () {
        $(this).daterangepicker({
            singleDatePicker: true,
            autoApply: true,
            timePicker: false,
            locale: {
                format: 'YYYY-MM-DD',
            }
        });

        $(this).on('apply.daterangepicker', function (ev, picker) {
            const fecha = picker.startDate.format('YYYY-MM-DD');
            console.log(fecha);
        });
    });



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