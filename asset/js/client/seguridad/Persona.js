var dataTableInitialized = false;

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

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/persona', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            items.data.forEach((persona) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${persona.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${persona.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = persona.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([persona.id, persona.Nombres+" "+persona.Apellidos, persona.TipoDocumento, persona.Documento, persona.Direccion, persona.Telefono, persona.Email, `<span class="${estadoClass} text-center">${persona.Estado}</span>`, actions]);
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
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/persona/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la persona: ${response.status}`);
        }

        const persona = await response.json();
        const direccion = persona.data.Direccion;
        const [departamento, municipio] = direccion.split('-');

        $('#id').val(persona.data.id);
        $('#TipoDocumento').val(persona.data.TipoDocumento);
        $('#Documento').val(persona.data.Documento);
        $('#DepartamentoSelect').val(departamento);
        $('#MunicipioSelect').val(municipio);
        $('#Nombres').val(persona.data.Nombres);
        $('#Apellidos').val(persona.data.Apellidos);
        $('#Edad').val(persona.data.Edad);
        $('#Genero').val(persona.data.Genero);
        $('#Email').val(persona.data.Email);
        $('#Telefono').val(persona.data.Telefono);
        $("#estado").prop("checked", persona.data.Estado === 'Activo');
        cargarMunicipios(departamento);
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
            title: persona.message
        });
        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
        const errorMessage = "Error al obtener la persona";
        const errorDescription = error.message || "Detalles del error desconocido";

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
        console.error(`Error al realizar la solicitud fetch: ${error}`);
    }
}

function performAction() {

    var id = $('#id').val();

    var formData = {
        TipoDocumento: $('#TipoDocumento').val(),
        Documento: $('#Documento').val(),
        Nombres: $('#Nombres').val(),
        Apellidos: $('#Apellidos').val(),
        Edad: $('#Edad').val(),
        Genero: $('#Genero').val(),
        Email: $('#Email').val(),
        Telefono: $('#Telefono').val(),
        Direccion: $('#DepartamentoSelect').val() + "-" + $('#MunicipioSelect').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };


    var url = id && id !== '0' ? 'https://hotel-api-hzf6.onrender.com/api/seguridad/persona/' + id : 'https://hotel-api-hzf6.onrender.com/api/seguridad/persona';
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

    if ($('#TipoDocumento').valid() && $('#Documento').valid() && $('#Nombres').valid() && $('#Apellidos').valid() && $('#Edad').valid() && $('#DepartamentoSelect').valid() && $('#MunicipioSelect').valid() && $('#Telefono').valid() && $('#Genero').valid() && $('#Email').valid()) {
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
    const confirmation = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmation.isConfirmed) {
        try {
            const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/persona/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar la persona: ${response.status}`);
            }

            const result = await response.json();

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
        } catch (error) {
            const errorMessage = "Error al realizar la petición para eliminar la persona";
            const errorDescription = error.message || "Detalles del error desconocido";

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
            console.error(`Error al realizar la solicitud fetch: ${error}`);
        }
    }
}

function Limpiar() {
    $('#id').val('');
    $('#TipoDocumento').val('0');
    $('#DepartamentoSelect').val('0');
    $('#MunicipioSelect').empty();
    $('#Documento').val('');
    $('#Nombres').val('');
    $('#Apellidos').val('');
    $('#Edad').val('');
    $('#Genero').val('0');
    $('#Email').val('');
    $('#Telefono').val('');
    $('#Direccion').val('');
    $("#estado").prop('checked', false);
}

$(document).ready(function () {
    $('#DepartamentoSelect').change(function () {
        var selectedDepartamento = $(this).val();
        cargarMunicipios(selectedDepartamento);
    });

    cargarDepartamento();
});

function cargarDepartamento() {
    try {
        var apiUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';

        var departamentosAgregados = {};

        $.get(apiUrl, function (data) {
            data.forEach(function (departamento) {
                var nombreDepartamento = departamento.departamento;
                if (!departamentosAgregados[nombreDepartamento]) {
                    departamentosAgregados[nombreDepartamento] = true;
                    var option = $('<option>', {
                        value: nombreDepartamento,
                        text: nombreDepartamento
                    });
                    $('#DepartamentoSelect').append(option);
                }
            });
        });
    } catch (error) {
        console.error("Error al cargar los departamentos:", error);
    }
}

function cargarMunicipios(departamento) {
    $.ajax({
        url: "https://www.datos.gov.co/resource/xdk5-pm3f.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var municipios = {};

            data.forEach(function (item) {
                var dep = item.departamento;
                var municipio = item.municipio;

                if (dep === departamento) {
                    if (!municipios[municipio]) {
                        municipios[municipio] = true;
                    }
                }
            });

            var municipioSelect = $("#MunicipioSelect");

            municipioSelect.empty();

            for (var municipio in municipios) {
                var option = new Option(municipio, municipio);
                municipioSelect.append(option);
            }
        },
        error: function (error) {
            console.error("Error al obtener los datos:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al obtener los datos',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}


function validarCamposFormulario() {

    $.validator.addMethod("valueSelected", function (value, element) {
        return value !== "0";
    }, "Por favor, selecciona una opción.");

    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Por favor, ingresa solo letras.");

    $.validator.addMethod("soloNumeros", function (value, element) {
        return this.optional(element) || /^[0-9]+$/.test(value);
    }, "Por favor, ingresa solo números.");

    $('#formulario').validate({
        rules: {
            TipoDocumento: {
                valueSelected: true
            },
            Documento: {
                required: true,
                soloNumeros: true
            },
            Nombres: {
                required: true,
                letras: true
            },
            Apellidos: {
                required: true,
                letras: true
            },
            Edad: {
                required: true
            },
            DepartamentoSelect: {
                required: true,
                valueSelected: true
            },
            MunicipioSelect: {
                required: true,
                valueSelected: true
            },
            Telefono: {
                required: true,
                digits: true
            },
            Genero: {
                valueSelected: true
            },
            Email: {
                required: true,
                email: true
            }
        },
        messages: {
            TipoDocumento: {
                valueSelected: 'Por favor, selecciona un tipo de documento'
            },
            Documento: {
                required: 'Por favor, ingresa un número de documento',
                soloNumeros: 'Por favor, ingresa solo números en el documento'
            },
            Nombres: {
                required: 'Por favor, ingresa nombres',
                letras: 'Por favor, ingresa solo letras en el nombre'
            },
            Apellidos: {
                required: 'Por favor, ingresa apellidos',
                letras: 'Por favor, ingresa solo letras en el apellido'
            },
            Edad: {
                required: 'Por favor, ingresa su edad'
            },
            DepartamentoSelect: {
                required: 'Por favor, selecciona un departamento',
                valueSelected: 'Por favor, selecciona un departamento'
            },
            MunicipioSelect: {
                required: 'Por favor, selecciona un municipio',
                valueSelected: 'Por favor, selecciona un municipio'
            },
            Telefono: {
                required: 'Por favor, ingresa un número de teléfono',
                digits: 'Por favor, ingresa solo dígitos'
            },
            Genero: {
                valueSelected: 'Por favor, selecciona un género'
            },
            Email: {
                required: 'Por favor, ingresa un correo electrónico',
                email: 'Por favor, ingresa un correo electrónico válido'
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
                    doc.content[1].text = 'Personas.pdf';
                }
            },
            {
                text: '<i class="fas fa-file-code"></i> JSON',
                action: function (e, dt, button, config) {
                    var data = dt.buttons.exportData();

                    $.fn.dataTable.fileSave(
                        new Blob([JSON.stringify(data)]),
                        'Personas.json'
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