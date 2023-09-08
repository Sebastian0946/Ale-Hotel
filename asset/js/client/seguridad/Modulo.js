var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
        
    } else {
        validarCamposFormulario();

        if ($('#codigo').valid() && $('#ruta').valid() && $('#etiqueta').valid()) {
            agregarModulo();
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
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/modulo', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de módulos: ${response.status}`);
        }

        const items = await response.json();
        var registros = "";

        items.data.forEach(function (modulo, index, array) {
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${modulo.id}</td>
                    <td class="table-cell-width">${modulo.Codigo}</td>
                    <td class="table-cell-width">${modulo.Ruta}</td>
                    <td class="table-cell-width">${modulo.Etiqueta}</td>
                    <td class="table-cell-width ${modulo.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${modulo.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${modulo.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${modulo.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${modulo.id})">
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
                pageLength: 5,
                dom: 'Bfrtip',
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    {
                        extend: 'pdfHtml5',
                        download: 'open'
                    },
                    {
                        text: 'JSON',
                        action: function (e, dt, button, config) {
                            var data = dt.buttons.exportData();

                            $.fn.dataTable.fileSave(
                                new Blob([JSON.stringify(data)]),
                                'Modulo.json'
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

    } catch (error) {
        console.error(`Error al realizar la solicitud fetch: ${error}`);
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

async function agregarModulo() {
    var formData = {
        Codigo: $('#codigo').val(),
        Ruta: $('#ruta').val(),
        Etiqueta: $('#etiqueta').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/modulo', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el módulo: ${response.status}`);
        }

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
            title: 'Registro exitoso',
        });

        Limpiar();
        loadTable();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al registrar el módulo: " + (error.message || "Detalles del error desconocido");

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
    }
}

async function guardarCambios() {
    var id = $('#id').val();

    var formData = {
        Codigo: $('#codigo').val(),
        Ruta: $('#ruta').val(),
        Etiqueta: $('#etiqueta').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/modulo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el módulo: ${response.status}`);
        }

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
            title: 'Modificación exitosa',
        });

        loadTable();
        Limpiar();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al actualizar el módulo: " + (error.message || "Detalles del error desconocido");

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
    }
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
                title: 'Registro eliminado con éxito'
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