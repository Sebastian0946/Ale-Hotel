var dataTableInitialized = false;
var mensajeMostrado = false

async function loadTable() {
    try {

        const loader = $("#loader");
        loader.show();

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            const actives = items.data.filter((estadoFactura) => estadoFactura.Estado === 'Activo');

            actives.forEach((estadoFactura) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${estadoFactura.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${estadoFactura.id})"><i class="fa-solid fa-trash"></i></button>`;
                const payButton = `<button type="button" class="btn btn-primary mx-3 btn-pay" data-factura-id="${estadoFactura.id}"><i class="fa-solid fa-file-invoice"></i></button>`;

                const estadoClass = estadoFactura.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton} ${payButton}
                    </div>
                `;

                table.row.add([estadoFactura.id, estadoFactura.Codigo, estadoFactura.Descripcion, `<span class="${estadoClass}">${estadoFactura.Estado}</span>`, actions]);
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
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el estado de factura: ${response.status}`);
        }

        const responseData = await response.json();
        const { message, data } = responseData;

        if (data) {
            const estadoFactura = data;

            $('#id').val(estadoFactura.id);
            $('#codigo').val(estadoFactura.Codigo);
            $('#descripcion').val(estadoFactura.Descripcion);
            $("#estado").prop("checked", estadoFactura.Estado === 'Activo');

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
                title: 'Estado Factura encontrado',
            });

            $("#myModal").data("action", "guardarCambios");
            $('#myModal').modal('show');
        } else if (message) {
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
                title: message,
            });
        }
    } catch (error) {
        console.error(`Error al obtener el estado de factura: ${error.message}`);
    }
}

async function agregarEstadoFactura() {
    try {
        var formData = {
            Codigo: $('#codigo').val(),
            Descripcion: $('#descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al registrar el estado de factura: ${response.status}`);
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
        })

        Toast.fire({
            icon: 'success',
            title: 'Registro exitoso',
        })

        Limpiar();
        loadTable();
    } catch (error) {
        console.error(`Error al registrar el estado de factura: ${error.message}`);
    }
}

async function guardarCambios() {
    try {
        var id = $('#id').val();

        var formData = {
            Codigo: $('#codigo').val(),
            Descripcion: $('#descripcion').val(),
            Estado: $("#estado").is(':checked') ? 'Activo' : 'Inactivo'
        };

        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el estado de factura: ${response.status}`);
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
        })

        loadTable();
        Limpiar();
    } catch (error) {
        console.error(`Error al actualizar el estado de factura: ${error.message}`);
    }
}

async function deleteById(id) {
    try {
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
            const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/eliminar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el estado de factura: ${response.status}`);
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
        }
    } catch (error) {
        console.error(`Error al eliminar el estado de factura: ${error.message}`);
    }
}

function Limpiar() {
    $('#id').val('');
    $('#codigo').val('');
    $('#descripcion').val('0');
    $("#estado").prop('checked', false);
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
                title: 'Registro habitaciónes',
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
                    doc.content[1].text = 'registroHabitación.pdf';
                }
            }
        ],
        responsive: true,
        colReorder: true,
        select: true
    });

    loadTable();
});

$(document).on('click', '.btn-pay', function () {
    const facturaId = $(this).data('factura-id');
    cargarFactura(facturaId);
});

function cargarFactura(id) {
    // Hacer una solicitud AJAX a la API para obtener los detalles de la factura
    $.ajax({
        url: `https://hotel-api-hzf6.onrender.com/api/sistema/estadoFactura/${id}`, // Reemplaza esto con la URL real de tu API
        method: 'GET',
        dataType: 'json',
        success: function (factura) {
            // Crear dinámicamente la estructura de la modal y mostrar los datos de la factura
            const modalContent = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalles de la Factura</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Factura ID:</strong> ${factura.id}</p>
                            <p><strong>Cliente:</strong> ${factura.cliente}</p>
                            <p><strong>Total:</strong> ${factura.total}</p>
                            <!-- Agrega más campos de factura según tus necesidades -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary">Pagar</button>
                        </div>
                    </div>
                </div>
            `;

            // Agregar la estructura de la modal al elemento con ID 'facturaModal'
            $('#facturaModal').html(modalContent);

            // Mostrar la modal
            $('#facturaModal').modal('show');
        },
        error: function (error) {
            console.error('Error al cargar los detalles de la factura', error);
        }
    });
}