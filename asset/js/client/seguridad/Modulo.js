let mensajeMostrado = false;

function mostrarMensaje(icon, message) {
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
        icon: icon,
        title: message
    });
}

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

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/modulo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            items.data.forEach((modulo) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${modulo.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${modulo.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = modulo.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const actions = `
                    <div class="actions-container" style="display: flex;">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([modulo.id, modulo.Codigo, modulo.Ruta, modulo.Etiqueta, `<span class="${estadoClass} text-center">${modulo.Estado}</span>`, actions]);
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
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/modulo/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el módulo: ${response.status}`);
        }

        const modulo = await response.json();

        $('#id').val(modulo.data.id);
        $('#codigo').val(modulo.data.Codigo);
        $('#ruta').val(modulo.data.Ruta);
        $('#etiqueta').val(modulo.data.Etiqueta);
        $("#estado").prop("checked", modulo.data.Estado === 'Activo');

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
            title: 'Módulo encontrado',
        });

        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
        let errorMessage = "Error al obtener el módulo: " + (error.message || "Detalles del error desconocido");

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
            icon: "error"
        });

        console.error(`Error al realizar la solicitud fetch: ${error}`);
    }
}

function performAction() {
    const id = $('#id').val();
    const formData = {
        Codigo: $('#codigo').val(),
        Ruta: $('#ruta').val(),
        Etiqueta: $('#etiqueta').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/seguridad/modulo/' + id : 'https://hotel-api-hzf6.onrender.com/api/seguridad/modulo';
    var type = id && id !== '0' ? 'PUT' : 'POST';

    validarCamposFormulario();

    // Función para enviar la solicitud PUT o POST
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
                    errorMessage += "actualizar la categoria";
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
    if ($('#codigo').valid() && $('#ruta').valid() && $('#etiqueta').valid()) {
        // Solo muestra la confirmación para solicitudes PUT
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
    const confirmed = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
        try {
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/modulo/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el registro: ${response.status}`);
            }

            const responseData = await response.json();

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
                title: responseData.message || 'Registro eliminado con éxito'
            });

            loadTable();
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
                title: `Error al eliminar el registro: ${error.message || "Detalles del error desconocido"}`
            });
        }
    }
}

function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#ruta').val('');
    $('#etiqueta').val('');
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
        submitHandler: function (form) {
            if ($('#codigo').valid() && $('#ruta').valid() && $('#etiqueta').valid()) {
                agregarModulo();
                $('#myModal').modal('hide');
            }
        }
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
                title: 'Formulario',
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
                    doc.content[1].text = 'Formulario.pdf';
                }
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
    loadTable();
});