function signIn(e) {
    e.preventDefault();

    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;

    $("#loader").show();

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/usuario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (response) {
            const usuarios = response.data;

            const user = usuarios.find(function (usuarioData) {
                return usuarioData.Usuario === usuario && usuarioData.Contraseña === contrasena;
            });

            if (user) {
                if (user.Estado === "Activo") {
                    // El usuario está activo, puedes permitir el inicio de sesión
                    sessionStorage.setItem("usuario", usuario);
                    sessionStorage.setItem("contrasena", contrasena);

                    $("#loader").hide();

                    Swal.fire({
                        icon: "success",
                        title: "¡Inicio de sesión exitoso!",
                        text: "Has iniciado sesión correctamente.",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(function () {
                        window.location.href = "client/DashBoard.html";
                    });
                } else {
                    // El usuario está inactivo, muestra un mensaje de error
                    $("#loader").hide();

                    Swal.fire({
                        icon: "error",
                        title: "Usuario inactivo",
                        text: "Tu usuario ha sido inactivado del sistema.",
                        showConfirmButton: false
                    });
                }
            } else {
                $("#loader").hide();

                Swal.fire({
                    icon: "error",
                    title: "Error al autenticar",
                    text: "El usuario o la contraseña son incorrectos.",
                    showConfirmButton: false
                });
            }
        },
        error: function (xhr, status, error) {
            // Oculta el loader en caso de error
            $("#loader").hide();

            console.log("Ha ocurrido un error: " + error);
        }
    });
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("contrasena");
    var toggleIcon = document.getElementById("passwordToggleIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}