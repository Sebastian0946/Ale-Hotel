document.addEventListener("DOMContentLoaded", function () {
    const formularioRegistro = document.getElementById("formularioRegistro");
    const formularioTipoHabitacion = document.getElementById("formularioTipoHabitacion");
    const btnRegistro = document.getElementById("btnRegistro");
    const btnAtras = document.getElementById("btnAtras");
    const btnReserva = document.getElementById("btnReserva");

    btnRegistro.addEventListener("click", function () {
        formularioRegistro.style.display = "none";
        formularioTipoHabitacion.style.display = "block";
    });

    btnAtras.addEventListener("click", function () {
        formularioRegistro.style.display = "block";
        formularioTipoHabitacion.style.display = "none";
    });

    btnReserva.addEventListener("click", function () {
        alert("Formulario de Tipo de Habitación enviado correctamente.");
    });
});


const departamentoSelect = document.getElementById('departamento');
const municipioSelect = document.getElementById('municipio');

async function cargarDepartamentos() {
    try {
        const response = await fetch('https://www.datos.gov.co/resource/xdk5-pm3f.json');
        const data = await response.json();

        departamentoSelect.innerHTML = '<option value="">Selecciona un Departamento</option>';

        const departamentos = [...new Set(data.map(item => item.departamento))];
        departamentos.forEach(departamento => {
            const option = document.createElement('option');
            option.value = departamento;
            option.textContent = departamento;
            departamentoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los departamentos:', error);
    }
}

async function cargarMunicipios() {
    const selectedDepartamento = departamentoSelect.value;

    if (selectedDepartamento) {
        try {
            const response = await fetch(`https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${selectedDepartamento}`);
            const data = await response.json();

            municipioSelect.innerHTML = '<option value="">Selecciona un Municipio</option>';

            const municipios = [...new Set(data.map(item => item.municipio))];
            municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio;
                option.textContent = municipio;
                municipioSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar los municipios:', error);
        }
    } else {
        municipioSelect.innerHTML = '<option value="">Selecciona un Municipio</option>';
    }
}

cargarDepartamentos();

const btn = document.getElementById('btnReserva');

function enviarCOrreo() {

    event.preventDefault();

    btn.value = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_5qsvexb';
    var formulario = document.getElementById("formRegistro")

    emailjs.sendForm(serviceID, templateID, formulario).then(() => {
        btn.value = 'reserva';
        alert('Reserva enviada a su correo!');
    }, (err) => {
        btn.value = 'reserva';
        alert(JSON.stringify(err));
    });

}