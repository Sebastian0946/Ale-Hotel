document.addEventListener("DOMContentLoaded", function () {
    const formularioRegistro = document.getElementById("formularioRegistroPersona");
    const formularioTipoHabitacion = document.getElementById("formularioTipoHabitacion");
    const btnRegistro = document.getElementById("btnRegistro");
    const btnAtras = document.getElementById("btnAtras");

    btnRegistro.addEventListener("click", function () {
        if (formularioRegistro.checkValidity()) {
            formularioRegistro.style.display = "none";
            formularioTipoHabitacion.style.display = "block";
        } else {
            formularioRegistro.reportValidity();
        }
    });

    btnAtras.addEventListener("click", function () {
        formularioRegistro.style.display = "block";
        formularioTipoHabitacion.style.display = "none";
    });
});

$(document).ready(function () {

    cargarDepartamento();

    $('#departamento').change(function () {
        var selectedDepartamento = $(this).val();
        cargarMunicipios(selectedDepartamento);
    });

    $('#documento').on('blur', function () {
        var documento = $(this).val();

        $.ajax({
            url: `https://hotel-api-hzf6.onrender.com/api/seguridad/persona/documento/${documento}`,
            method: 'GET',
            success: function (persona) {
                // Verifica si se encontró información de la persona
                if (persona && persona.data) {

                    const direccion = persona.data.Direccion;
                    const [departamento, municipio] = direccion.split('-');

                    console.log('id persona: '+persona.data.id)

                    $('#id').val(persona.data.id)
                    $('#tipoDocumento').val(persona.data.TipoDocumento);
                    $('#nombres').val(persona.data.Nombres);
                    $('#apellidos').val(persona.data.Apellidos);
                    $('#telefono').val(persona.data.Telefono);
                    $('#departamento').val(departamento);
                    $('#departamento').val(departamento);
                    cargarMunicipios(departamento);

                    setTimeout(function () {
                        $('#municipio').val(municipio);
                    }, 100);

                    $('#correo').val(persona.data.Email);
                }
            },
            error: function (error) {
                console.error('No se encontró información de la persona.');
            }
        });
    });
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
                    $('#departamento').append(option);
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

            var municipioSelect = $("#municipio");
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

function showLoader() {
    $("#loader").show();
}

function hideLoader() {
    $("#loader").hide();
}

function registrarPersona() {
    showLoader();

    var formData = {
        TipoDocumento: $('#tipoDocumento').val(),
        Documento: $('#documento').val(),
        Nombres: $('#nombres').val(),
        Apellidos: $('#apellidos').val(),
        Email: $('#correo').val(),
        Telefono: $('#telefono').val(),
        Direccion: $('#departamento').val() + "-" + $('#municipio').val(),
        Edad: null,
        Genero: null,
        Estado: 'Activo'
    };

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/persona',
        method: 'GET',
        data: { Documento: $('#documento').val() },
        success: function (response) {
            if (response.data.length > 0) {
                const personaId = $('#id').val();
                actualizarEstadoActivo(personaId, formData);
            } else {
                crearNuevaPersona(formData);
            }
        },
        error: function (error) {
            console.error("Error al verificar la existencia de la persona:", error);
            hideLoader();
        }
    });
}

function crearNuevaPersona(formData) {
    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/persona',
        method: "POST",
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (response) {
            const personaId = response.data.id;
            registrarHuesped(personaId);
        },
        error: function (error) {
            console.error("Error al registrar la persona:", error);
            hideLoader();
        }
    });
}

function actualizarEstadoActivo(personaId, formData) {

    formData.Estado = 'Activo';

    $.ajax({
        url: `https://hotel-api-hzf6.onrender.com/api/seguridad/persona/${personaId}`,
        method: "PUT",
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (response) {
            const personaId = response.data.id;
            registrarHuesped(personaId);
        },
        error: function (error) {
            console.error("Error al actualizar el estado de la persona:", error);
            hideLoader();
        }
    });
}

function registrarHuesped(personaId) {
    var formDataHuesped = {
        Codigo: generateRandomCode(),
        PersonaId: {
            id: personaId
        },
        DescuentoId: {
            id: ($('#DescuentoId').val() !== null) ? $('#DescuentoId').val() : null
        },
        Estado: 'Activo'
    };

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped',
        method: 'POST',
        data: JSON.stringify(formDataHuesped),
        contentType: 'application/json',
        success: function (response) {
            const huespedId = response.data.id;
            registrarHabitacion(huespedId);
        },
        error: function (error) {
            console.error('Error al registrar el huésped:', error);
            hideLoader();
        }
    });
}

function registrarHabitacion(huespedId) {

    var formDataHabitacion = {

        Codigo: generateRandomCode(),
        TipoHabitacionesId: {
            id: $('#tipohabitacionUsuario').val(),
        },
        HuespedId: {
            id: huespedId
        },
        Descripcion: $('#adultos').val() + " y " + $('#ninos').val(),
        Ocupado: false,
        Estado: 'Activo'

    };

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion',
        method: 'POST',
        data: JSON.stringify(formDataHabitacion),
        contentType: 'application/json',
        success: function (response) {
            const habitacionId = response.data.id;
            registroReservaHabitacion(habitacionId);
        },
        error: function (error) {
            console.error('Error al registrar la habitación:', error);
        }
    });
}

function registroReservaHabitacion(habitacionId) {
    const fechaEntrada = $('#fechaEntrada').val();
    const fechaSalida = $('#fechaSalida').val();

    $.get('https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion', {
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida,
    })
        .done(function (reservas) {
            if (reservas.length > 0) {
                const errorMessage = 'Las fechas de entrada y salida se superponen con otras reservas.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage
                });
            } else {
                const formDataReservaHabitacion = {
                    Codigo: generateRandomCode(),
                    HabitacionId: {
                        id: habitacionId,
                    },
                    DescuentoId: {
                        id: null
                    },
                    FechaEntrada: fechaEntrada,
                    FechaSalida: fechaSalida,
                    Estado: 'Activo'
                };

                $.ajax({
                    url: 'https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion',
                    method: 'POST',
                    data: JSON.stringify(formDataReservaHabitacion),
                    contentType: 'application/json',
                    success: function (resultado) {
                        hideLoader();
                        enviarCorreo();
                    },
                    error: function (error) {
                        console.error('Error al registrar la habitación:', error);
                    }
                });
            }
        })
        .fail(function (error) {
            console.error('Error al verificar las fechas:', error);
        });
}


function generateRandomCode() {
    var randomCode = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.random().toString(10).substring(2, 7);
    return randomCode.substring(0, 5);
}

$(document).ready(function () {
    $("#formRegistro").validate({
        rules: {
            tipoDocumento: "required",
            documento: "required",
            name: "required",
            lastName: "required",
            departamento: "required",
            municipio: "required",
            phone: {
                required: true,
                digits: true,
            },
            email: {
                required: true,
                email: true,
            },
        },
        messages: {
            tipoDocumento: "Por favor, seleccione un tipo de documento",
            documento: "Este campo es obligatorio",
            name: "Por favor, ingrese sus nombres",
            lastName: "Por favor, ingrese sus apellidos",
            departamento: "Por favor, seleccione un departamento",
            municipio: "Por favor, seleccione un municipio",
            phone: {
                required: "Por favor, ingrese su número de teléfono",
                digits: "Ingrese solo números en este campo",
            },
            email: {
                required: "Por favor, ingrese su dirección de correo electrónico",
                email: "Ingrese una dirección de correo electrónico válida",
            },
        },
        submitHandler: function (form) {
            $("#formularioRegistroPersona").hide();
            $("#formularioTipoHabitacion").show();
        },
    });
});

const btn = document.getElementById('btnReserva');

function enviarCorreo() {

    btn.innerText = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_5qsvexb';
    const formulario = document.getElementById('formRegistro');

    emailjs.sendForm(serviceID, templateID, formulario).then(
        () => {
            btn.innerText = 'Reserva';

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Reserva enviada a su correo!',
                customClass: {
                    container: 'sweet-alert-container',
                    title: 'sweet-alert-title',
                    content: 'sweet-alert-content',
                    icon: 'sweet-alert-icon'
                },
                showConfirmButton: false,
                timer: 5000,
            }).then(function () {
                window.location.href = '../../index.html';
            });

        },
        (err) => {
            btn.innerText = 'Reserva';

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(err)
            });
        }
    );
}