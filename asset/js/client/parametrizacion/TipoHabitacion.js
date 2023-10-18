var dataTableInitialized = false;
var mensajeMostrado = false;

async function loadTable() {
    try {

        const loader = $("#loader");
        loader.show();

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            
            const items = await response.json();
            
            const table = $('#table').DataTable();

            table.clear();

            const actives = items.data.filter((TipoHabitacion) => TipoHabitacion.Estado === 'Activo');

            actives.forEach((TipoHabitacion) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${TipoHabitacion.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${TipoHabitacion.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = TipoHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const image = `<img src="../../../asset/img/${TipoHabitacion.Imagen}" alt="Imagen" width="150" height="65" style="border-radius: 15%; display: block; margin: 0 auto;">`;

                const valorHabitacion = `<div style="text-align: center;"><p>${TipoHabitacion.Cantidad}</p></div>`;

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([TipoHabitacion.id, TipoHabitacion.Codigo, TipoHabitacion.Titulo, TipoHabitacion.Descripcion, image, valorHabitacion, `<div style="text-align: center;"><span class="${estadoClass}">${TipoHabitacion.Estado}</span></div>`, actions]);
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
            url: `https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (TipoHabitacion) {

                $('#id').val(TipoHabitacion.data.id);
                $('#codigo').val(TipoHabitacion.data.Codigo);
                $('#titulo').val(TipoHabitacion.data.Titulo);
                $('#descripcion').val(TipoHabitacion.data.Descripcion);
                $('#cantidad').val(TipoHabitacion.data.Cantidad);
                $("#estado").prop("checked", TipoHabitacion.data.Estado === 'Activo');

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
                    title: TipoHabitacion.message
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

function previewImage() {
    const imagenInput = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagenPreview');

    if (imagenInput.files && imagenInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
            imagenPreview.style.display = 'block';
        };

        reader.readAsDataURL(imagenInput.files[0]);
    } else {
        imagenPreview.src = '';
        imagenPreview.style.display = 'none';
    }
}

function performAction() {

    const id = $('#id').val();

    var formData = {
        Codigo: id && id !== '0' ? $('#codigo').val() : generateRandomCode(),
        Titulo: $('#titulo').val(),
        Descripcion: $('#descripcion').val(),
        Cantidad: $('#cantidad').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    var imagenInput = $('#imagen')[0].files[0];

    if (imagenInput) {
        formData.Imagen = imagenInput.name;
    }

    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/' + id : 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion';

    var type = id && id !== '0' ? 'PUT' : 'POST';

    validarCamposFormulario();

    if ($('#codigo').valid() && $('#cantidad').valid() && $('#descripcion').valid()) {
        $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(formData),
            contentType: false,
            processData: false,
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
                    errorMessage += "actualizar el tipo de habitación";
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

async function deleteById(id) {

    const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/eliminar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const jsonResponse = await response.json();
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
                    title: jsonResponse.message || 'Registro eliminado con éxito'
                });
                loadTable();
            } else {
                const errorResponse = await response.json();
                const errorDescription = errorResponse.message || 'Error al eliminar el registro';

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
                    title: errorDescription
                });
            }
        } catch (error) {
            console.error("Error al realizar la petición Fetch:", error);
        }
    }
}

function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#titulo').val('');
    $('#descripcion').val('');
    $('#cantidad').val('');
    $('#imagen').val('');
    $("#estado").prop('checked', false);
}

function validarCamposFormulario() {

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\s.,]*$/.test(value);
    }, "Por favor, ingresa solo letras, números, espacios, puntos y comas.");


    $('#formulario').validate({
        rules: {
            codigo: {
                required: true,
                minlength: 3
            },
            descripcion: {
                required: true,
                maxlength: 220,
                minlength: 15
            },
            cantidad: {
                required: true
            }
        },
        messages: {
            codigo: {
                required: 'Por favor, ingresa un código',
                minlength: 'El código debe tener al menos {0} caracteres'
            },
            descripcion: {
                required: 'Por favor, ingresa una descripción para la habitación',
                maxlength: 'La descripción es muy larga',
                minlength: 'La descripción es muy corta'
            },
            cantidad: {
                required: 'Por favor, ingrese una cantidad'
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
                title: 'Configuración Sistema',
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