function signIn(e) {
    e.preventDefault();

    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;

    $.ajax({
        url: 'https://hotel-api-hzf6.onrender.com/api/seguridad/usuario',
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        success: function (response) {

            const usuarios = response.data;

            const userExists = usuarios.some(function (usuarioData) {
                return usuarioData.Usuario === usuario && usuarioData.Contraseña === contrasena;
            });

            if (userExists) {
                sessionStorage.setItem("usuario", usuario);
                sessionStorage.setItem("contrasena", contrasena);

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
                Swal.fire({
                    icon: "error",
                    title: "Error al autenticar",
                    text: "El usuario o la contraseña son incorrectos.",
                    showConfirmButton: false
                })
            }
        },
        error: function (xhr, status, error) {
            console.log("Ha ocurrido un error: " + error);
        }
    });
}