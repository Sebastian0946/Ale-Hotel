document.addEventListener("DOMContentLoaded", function () {
    const formularioRegistro = document.getElementById("formularioRegistro");
    const formularioTipoHabitacion = document.getElementById("formularioTipoHabitacion");
    const btnSiguiente1 = document.getElementById("btnSiguiente1");
    const btnAtras = document.getElementById("btnAtras");
    const btnSiguiente2 = document.getElementById("btnSiguiente2");

    btnSiguiente1.addEventListener("click", function () {
        formularioRegistro.style.display = "none";
        formularioTipoHabitacion.style.display = "block";
    });

    btnAtras.addEventListener("click", function () {
        formularioRegistro.style.display = "block";
        formularioTipoHabitacion.style.display = "none";
    });

    btnSiguiente2.addEventListener("click", function () {
        // Aquí puedes procesar los datos del formulario de Tipo de Habitación.
        alert("Formulario de Tipo de Habitación enviado correctamente.");
    });
});