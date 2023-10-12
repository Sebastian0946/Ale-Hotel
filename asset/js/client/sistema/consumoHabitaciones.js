var dataTableInitialized = false;
var mensajeMostrado = false;

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

        const response = await fetch('https://hotel-api-hzf6.onrender.com/api/sistema/consumoHabitacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const items = await response.json();
            const table = $('#table').DataTable();

            table.clear();

            items.data.forEach((consumoHabitacion) => {
                const editButton = `<button type="button" class="btn btn-warning mx-3" onclick="findById(${consumoHabitacion.id})"><i class="fa-solid fa-user-pen"></i></button>`;
                const deleteButton = `<button type="button" class="btn btn-danger mx-3" onclick="deleteById(${consumoHabitacion.id})"><i class="fa-solid fa-trash"></i></button>`;

                const estadoClass = consumoHabitacion.Estado === 'Activo' ? 'text-success' : 'text-danger';

                const actions = `
                    <div class="actions-container">
                        ${editButton} ${deleteButton}
                    </div>
                `;

                table.row.add([consumoHabitacion.id, consumoHabitacion.Codigo, ConfiguracionSistema.UsuarioId.Usuario, ConfiguracionSistema.Nombre, ConfiguracionSistema.Descripcion, `<span class="${estadoClass}">${ConfiguracionSistema.Estado}</span>`, actions]);
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
        const response = await fetch(`https://hotel-api-hzf6.onrender.com/api/sistema/huesped/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const huesped = await response.json();

            $('#id').val(huesped.data.id);
            $('#codigo').val(huesped.data.Codigo);
            $('#personaId').val(huesped.data.PersonaId.id);
            $('#descuentoId').val(huesped.data.DescuentoId.id);
            $("#estado").prop("checked", huesped.data.Estado === 'Activo');

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
                title: huesped.message
            });

            $("#myModal").data("action", "guardarCambios");
            $('#myModal').modal('show');
        } else {
            const errorResponse = await response.json();
            let errorMessage = "Error al obtener el módulo";
            const errorDescription = errorResponse.message || "Detalles del error desconocido";

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
    } catch (error) {
        console.error("Error al realizar la petición Fetch:", error);
    }
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
                title: 'Huespedes',
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
                    doc.content[1].text = 'Registro huespedes.pdf';
                }
            },
            {
                text: '<i class="fas fa-file-code"></i> JSON',
                action: function (e, dt, button, config) {
                    var data = dt.buttons.exportData();

                    $.fn.dataTable.fileSave(
                        new Blob([JSON.stringify(data)]),
                        'Huespedes.json'
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