var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
    } else {
        validarCamposFormulario();

        if ($('#TipoDocumento').valid() && $('#Documento').valid() && $('#Nombres').valid() && $('#Apellidos').valid() && $('#Edad').valid() && $('#DepartamentoSelect').valid() && $('#MunicipioSelect').valid() && $('#Telefono').valid() && $('#Genero').valid() && $('#Email').valid()) {
            agregarPersona();
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

async function loadTable() {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/persona', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de personas: ${response.status}`);
        }

        cargarDepartamento();

        const items = await response.json();

        var registros = "";
        items.data.forEach(function (persona, index, array) {
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${persona.id}</td>
                    <td class="table-cell-width">
                        <div class="person-name">
                            <span>${persona.Nombres} ${persona.Apellidos}</span>
                        </div>
                    </td>
                    <td class="table-cell-width">${persona.TipoDocumento}</td>
                    <td class="table-cell-width">${persona.Documento}</td>
                    <td class="table-cell-width">${persona.Direccion}</td>
                    <td class="table-cell-width">${persona.Telefono}</td>
                    <td class="table-cell-width">${persona.Email}</td>
                    <td class="table-cell-width ${persona.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${persona.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${persona.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${persona.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${persona.id})">
                                <i class="fa-solid fa-trash btn btn-danger"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

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

        if (!toastShown) {
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

            toastShown = true;
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud fetch: ${error}`);
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

        var direccionParts = persona.data.Direccion.split('-');

        $('#id').val(persona.data.id);
        $('#TipoDocumento').val(persona.data.TipoDocumento);
        $('#Documento').val(persona.data.Documento);
        $('#Nombres').val(persona.data.Nombres);
        $('#Apellidos').val(persona.data.Apellidos);
        $('#Edad').val(persona.data.Edad);
        $('#Genero').val(persona.data.Genero);
        $('#Email').val(persona.data.Email);
        $('#Telefono').val(persona.data.Telefono);
        cargarDepartamentosMunicipios();
        $("#estado").prop("checked", persona.data.Estado === 'Activo');
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

async function agregarPersona() {
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

    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar la persona: ${response.status}`);
        }

        const result = await response.json();

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
        });

        Toast.fire({
            icon: 'success',
            title: result.message
        });
        Limpiar();
        loadTable();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al registrar la persona";
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

async function guardarCambios() {
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
        Direccion: $('#Direccion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/persona/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la persona: ${response.status}`);
        }

        const result = await response.json();

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
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al actualizar la persona";
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