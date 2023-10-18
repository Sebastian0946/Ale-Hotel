function loadSeguridad() {

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/persona',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione persona --</option>`;
            items.data.forEach(function (persona, index, array) {
                if (persona.Estado === "Activo") {
                    registros += `<option value='` + persona.id + `'>` + persona.TipoDocumento + " - " + persona.Documento + ': ' + persona.Nombres + ' ' + persona.Apellidos + `</option>`;
                }
            })
            $("#personaId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/modulo',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione modulo --</option>`;
            items.data.forEach(function (modulo, index, array) {
                if (modulo.Estado === "Activo") {
                    registros += `<option value='` + modulo.id + `'>` + modulo.Codigo + ": " + modulo.Ruta + ' - ' + modulo.Etiqueta + `</option>`;
                }
            })
            $("#moduloId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/rol',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione rol --</option>`;
            items.data.forEach(function (rol, index, array) {
                if (rol.Estado === "Activo") {
                    registros += `<option value='` + rol.id + `'>` + rol.Codigo + ": " + rol.Descripcion + `</option>`;
                }
            })
            $("#rolId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/formulario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione formulario --</option>`;
            items.data.forEach(function (formulario, index, array) {
                if (formulario.Estado === "Activo") {
                    registros += `<option value='` + formulario.id + `'>` + formulario.Codigo + ": " + formulario.Ruta + ' - ' + formulario.Etiqueta + `</option>`;
                }
            })
            $("#formularioId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/rol',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione rol --</option>`;
            items.data.forEach(function (rol, index, array) {
                if (rol.Estado === "Activo") {
                    registros += `<option value='` + rol.id + `'>` + rol.Codigo + ": " + rol.Descripcion + `</option>`;
                }
            })
            $("#rolId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/usuario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione usuario --</option>`;
            items.data.forEach(function (usuario, index, array) {
                if (usuario.Estado === "Activo") {
                    registros += `<option value='` + usuario.id + `'>` + usuario.Usuario + `</option>`;
                }
            })
            $("#usuarioId").html(registros);
        }
    });
}

function loadInventario() {

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/categoria',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione categoria --</option>`;
            items.data.forEach(function (categoria, index, array) {
                if (categoria.Estado === "Activo") {
                    registros += `<option value='` + categoria.id + `'>` + categoria.Codigo + ": " + categoria.Descripcion + `</option>`;
                }
            })
            $("#categoriaId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/producto',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione producto --</option>`;
            items.data.forEach(function (producto, index, array) {
                if (producto.Estado === "Activo") {
                    registros += `<option value='` + producto.id + `'>` + producto.Codigo + ": " + producto.Nombre + `</option>`;
                }
            })
            $("#productoId").html(registros);
        }
    });
    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/inventario/inventario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione inventario --</option>`;
            items.data.forEach(function (inventario, index, array) {
                if (inventario.Estado === "Activo") {
                    registros += `<option value='` + inventario.id + `'>` + inventario.Codigo + ": " + inventario.ProductoId.Nombre + " - " +"Cantidad: "+inventario.Cantidad + `</option>`;
                }
            })
            $("#inventarioId").html(registros);
        }
    });
}

function loadParametrizacion() {

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/huesped',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione huesped --</option>`;
            items.data.forEach(function (huesped, index, array) {
                if (huesped.Estado === "Activo") {
                    registros += `<option value='` + huesped.id + `'>` + huesped.PersonaId.Nombres + " " + huesped.PersonaId.Apellidos + `</option>`;
                }
            })
            $("#huespedId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione tipo de habitacion --</option>`;
            items.data.forEach(function (tipoHabitacion, index, array) {
                if (tipoHabitacion.Estado === "Activo") {
                    registros += `<option value='` + tipoHabitacion.id + `'>` + tipoHabitacion.Titulo + `</option>`;
                }
            })
            $("#tipohabitacionId").html(registros);
        }
    });

    $(document).ready(function () {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const habitacionId = urlParams.has('id') ? urlParams.get('id') : '0';

        $.ajax({
            url: 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            success: function (items) {
                $('#tipohabitacionUsuario').append($('<option>', {
                    value: '0',
                    text: '-- Seleccione habitación --'
                }));

                items.data.forEach(function (TipoHabitacion) {
                    const option = `<option value="${TipoHabitacion.id}">${TipoHabitacion.Titulo}</option>`;
                    $('#tipohabitacionUsuario').append(option);
                });

                $('#tipohabitacionUsuario').val(habitacionId).change();

                cargarInformacionHabitacion(habitacionId);
            },
        });

        $("#tipohabitacionUsuario").on("change", function () {
            var habitacionOption = $(this).val();
            if (habitacionOption !== "0") {
                var habitacionId = habitacionOption;
                var habitacionTitulo = $(this).find('option:selected').text();
                $("#tipoHabitacionTitulo").val(habitacionTitulo);
                cargarInformacionHabitacion(habitacionId);
            } else {
                $("#tipoHabitacionTitulo").val("Título no seleccionado");
                $("#habitacionCard").hide();
            }
        });

        function cargarInformacionHabitacion(habitacionId) {
            if (habitacionId !== '0') {
                $.ajax({
                    url: 'https://hotel-api-hzf6.onrender.com/api/parametrizacion/TipoHabitacion/' + habitacionId,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    success: function (habitacion) {

                        var cantidad = habitacion.data.Cantidad;
                        var cantidadFormateada = cantidad.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                        var tarjetaHTML = `
                            <div class="cardRoom">
                                <img src="../../asset/img/${habitacion.data.Imagen}" class="card-img-top" alt="Foto de la habitación">
                                <div class="card-body">
                                    <h5 class="card-title">${habitacion.data.Titulo}</h5>
                                    <p class="card-text">${habitacion.data.Descripcion}</p>
                                    <p class="card-text">Precio: $${cantidadFormateada}</p>
                                </div>
                            </div>
                        `;
                        $("#habitacionCard").html(tarjetaHTML).show();
                    },
                    error: function (error) {
                        console.error("Error al obtener los detalles de la habitación:", error);
                    }
                });
            } else {
                $("#habitacionCard").hide();
            }
        }
    });
}

function loadSistema() {

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione habitación --</option>`;
            items.data.forEach(function (habitacion, index, array) {
                if (habitacion.Ocupado === true) {
                    registros += `<option value='` + habitacion.id + `'>` + habitacion.Codigo + ": " + habitacion.TipoHabitacionesId.Titulo + " - " + habitacion.HuespedId.PersonaId.TipoDocumento + ": " + habitacion.HuespedId.PersonaId.Documento + " - " + habitacion.HuespedId.PersonaId.Nombres + " " + habitacion.HuespedId.PersonaId.Apellidos + `</option>`;
                }
            })
            $("#habitacionId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/habitacion',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione habitación registrada --</option>`;
            items.data.forEach(function (habitacion, index, array) {
                registros += `<option value='` + habitacion.id + `'>` + habitacion.Codigo + ": " + habitacion.TipoHabitacionesId.Titulo + " - " + habitacion.HuespedId.PersonaId.TipoDocumento + ": " + habitacion.HuespedId.PersonaId.Documento + " - " + habitacion.HuespedId.PersonaId.Nombres + " " + habitacion.HuespedId.PersonaId.Apellidos + `</option>`;
            })
            $("#habitacionSistemaId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/descuento',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione descuento --</option>`;
            items.data.forEach(function (descuento, index, array) {
                if (descuento.Estado === "Activo") {
                    registros += `<option value='` + descuento.id + `'>` + descuento.PorcentajeDescuento + "%" + `</option>`;
                }
            })
            $("#descuentoId").html(registros);
        }
    });

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/sistema/reservaHabitacion',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione reserva de la habitación --</option>`;
            items.data.forEach(function (reservaHabitacion, index, array) {
                if (reservaHabitacion.Estado === "Activo") {
                    registros += `<option value='` + reservaHabitacion.id + "-" + reservaHabitacion.HabitacionId.id + `'>` + reservaHabitacion.Codigo + ": " + reservaHabitacion.HabitacionId.TipoHabitacionesId.Titulo + " - " + reservaHabitacion.HabitacionId.HuespedId.PersonaId.TipoDocumento + ": " + reservaHabitacion.HabitacionId.HuespedId.PersonaId.Documento + " - " + reservaHabitacion.HabitacionId.HuespedId.PersonaId.Nombres + " " + reservaHabitacion.HabitacionId.HuespedId.PersonaId.Apellidos + `</option>`;
                }
            })
            $("#reservaHabitacionId").html(registros);
        }
    });

}