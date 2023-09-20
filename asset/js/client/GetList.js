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
                registros += `<option value='` + persona.id + `'>` + persona.TipoDocumento + " - " + persona.Documento + ': ' + persona.Nombres + ' ' + persona.Apellidos + `</option>`;
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
                registros += `<option value='` + modulo.id + `'>` + modulo.Codigo + ": " + modulo.Ruta + ' - ' + modulo.Etiqueta + `</option>`;
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
                registros += `<option value='` + rol.id + `'>` + rol.Codigo + ": " + rol.Descripcion + `</option>`;
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
                registros += `<option value='` + formulario.id + `'>` + formulario.Codigo + ": " + formulario.Ruta + ' - ' + formulario.Etiqueta + `</option>`;
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
                registros += `<option value='` + rol.id + `'>` + rol.Codigo + ": " + rol.Descripcion + `</option>`;
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
                registros += `<option value='` + usuario.id + `'>` + usuario.Usuario + `</option>`;
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
                registros += `<option value='` + categoria.id + `'>` + categoria.Codigo + ": " + categoria.Descripcion + `</option>`;
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
                registros += `<option value='` + producto.id + `'>` + producto.Codigo + ": " + producto.Nombre + `</option>`;
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
                registros += `<option value='` + inventario.id + `'>` + inventario.Codigo + ": " + inventario.ProductoId.Nombre+ ": "+ inventario.Cantidad + `</option>`;
            })
            $("#inventarioId").html(registros);
        }
    });
}

function loadParametrizacion() {
    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/usuario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (items) {
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione usuario --</option>`;
            items.data.forEach(function (usuario, index, array) {
                registros += `<option value='` + usuario.id + `'>` + usuario.Usuario + `</option>`;
            })
            $("#usuarioId").html(registros);
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
            items.data.forEach(function (tipo, index, array) {
                registros += `<option value='` + tipo.id + `'>` + tipo.Descripcion + `</option>`;
            })
            $("#tipohabitacionId").html(registros);
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
            var registros = `<option selected='' selected disabled hidden value='0'>-- Seleccione habitacion --</option>`;
            items.data.forEach(function (habitacion, index, array) {
                registros += `<option value='` + habitacion.id + `'>` + habitacion.Codigo +": "+habitacion.Descripcion+ `</option>`;
            })
            $("#habitacionId").html(registros);
        }
    });
}