var dataTableInitialized = false;
let mensajeMostrado = false;

async function loadTable() {
    try {

        const loader = $("#loader");
        loader.show();

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/huesped', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            const actives = items.data.filter((huesped) => huesped.Estado === 'Activo');

            actives.forEach((huesped) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${huesped.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${huesped.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = huesped.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([
                    huesped.id,
                    huesped.Codigo,
                    huesped.PersonaId.Nombres + " " + huesped.PersonaId.Apellidos,
                    `<span class="${estadoClass} text-center">${huesped.Estado}</span>`,
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

    var personaId = $('#personaId').val();
    var codigo = id && id !== '0' ? $('#codigo').val() : generateRandomCode();
    var estado = $("#estado").is(':checked') ? 'Activo' : 'Inactivo';

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var personaExists = items.data.some(function (huesped) {
                return huesped.PersonaId.id === personaId;
            });

            if (personaExists) {
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
                    title: 'Persona ya registrada',
                    text: 'La persona seleccionada ya existe como huésped.',
                    icon: "error"
                });
            } else {
                var formData = {
                    Codigo: codigo,
                    PersonaId: {
                        id: personaId
                    },
                    Estado: estado
                };

                var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped/' + id : 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped';
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
                                errorMessage += "actualizar el registro del huésped";
                            } else {
                                errorMessage += "registrar el huésped";
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

                if ($('#personaId').valid()) {
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
                title: 'Error al obtener registros de huéspedes',
                text: 'Ha ocurrido un error al obtener los registros de huéspedes.',
                icon: "error"
            });
        }
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
                url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped/eliminar/' + id,
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
    $('#id').val('');
    $('#codigo').val('');
    $('#descripcion').val('');
    $("#estado").prop('checked', false);
}

function validarCamposFormulario() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Por favor, ingresa solo letras.");

    $('#formulario').validate({
        rules: {
            PersonaId: {
                required: true
            }
        },
        messages: {
            PersonaId: {
                required: 'Por favor, seleccione una persona',
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