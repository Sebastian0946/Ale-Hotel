var dataTableInitialized = false;

function performAction() {
    var action = $("#myModal").data("action");

    if (action === "guardarCambios") {
        guardarCambios();
        $("#myModal").data("action", "");
        $('#myModal').modal('hide');
    } else {
        validarCamposFormulario();

        if ($('#codigo').valid() && $('#descripcion').valid()) {
            agregarRol();
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
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/rol', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar la tabla de roles: ${response.status}`);
        }

        const items = await response.json();
        var registros = "";
        items.data.forEach(function (rol, index, array) {
            registros += `
                <tr class="table-light fadeIn">
                    <td class="table-cell-width">${rol.id}</td>
                    <td class="table-cell-width">${rol.Codigo}</td>
                    <td class="table-cell-width">${rol.Descripcion}</td>
                    <td class="table-cell-width ${rol.Estado === 'Activo' ? 'text-success' : 'text-danger'}">${rol.Estado}</td>
                    <td class="table-cell-width">
                        <div class="row-actions">
                            <div class="row-action" onclick="showDetails(${rol.id})">
                                <i class="fa-solid fa-info-circle btn btn-primary"></i> 
                            </div>
                            <div class="row-action" onclick="findById(${rol.id})">
                                <i class="fa-solid fa-user-pen btn btn-warning"></i> 
                            </div>
                            <div class="row-action" onclick="deleteById(${rol.id})">
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
                                'Roles.json'
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
        console.error(`Error al cargar la tabla de roles: ${error}`);
    }
}

async function findById(id) {
    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/rol/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el rol: ${response.status}`);
        }

        const rol = await response.json();
        $('#id').val(rol.data.id);
        $('#codigo').val(rol.data.Codigo);
        $('#descripcion').val(rol.data.Descripcion);
        $("#estado").prop("checked", rol.data.Estado === 'Activo');
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
            title: 'Rol encontrado',
        });
        $("#myModal").data("action", "guardarCambios");
        $('#myModal').modal('show');
    } catch (error) {
        let errorMessage = "Error al obtener el rol: " + error.message;
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

async function agregarRol() {
    var formData = {
        Codigo: $('#codigo').val(),
        Descripcion: $('#descripcion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/seguridad/rol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el rol: ${response.status}`);
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
            title: 'Registro exitoso',
        });

        Limpiar();
        loadTable();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al registrar el rol: " + error.message;

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
        Descripcion: $('#descripcion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/rol/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el rol: ${response.status}`);
        }

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        })

        Toast.fire({
            icon: 'warning',
            title: 'Modificación exitosa',
        });

        loadTable();
        Limpiar();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al actualizar el rol: " + error.message;

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
        Descripcion: $('#descripcion').val(),
        Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
    };

    try {
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/rol/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el rol: ${response.status}`);
        }

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        })

        Toast.fire({
            icon: 'warning',
            title: 'Modificación exitosa',
        });

        loadTable();
        Limpiar();
    } catch (error) {
        let errorMessage = "Ha ocurrido un error al actualizar el rol: " + error.message;

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
    const confirmResult = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
        try {
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/seguridad/rol/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el rol: ${response.status}`);
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
                title: `Error al eliminar el rol: ${error.message}`
            });
        }
    }
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
            codigo: {
                required: true,
                minlength: 3
            },
            descripcion: {
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
            descripcion: {
                required: 'Por favor, ingresa una descripcion',
                letras: 'Por favor, ingresa solo letras en la descripcion'
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