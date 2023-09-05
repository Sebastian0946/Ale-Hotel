
const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
    const iconImage = expand_btn.querySelector('img');

    document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinks = document.querySelectorAll(".sidebar-links a")

allLinks.forEach((elem) => {
    elem.addEventListener('click', function () {
        const hrefLinkClick = elem.href;

        allLinks.forEach((link) => {
            if (link.href == hrefLinkClick) {
                link.classList.add("active");
            } else {
                link.classList.remove('active');
            }
        });
    })
});

$(document).ready(function () {
    // Capturar los clics en los enlaces del panel de control
    $('#sidemenu a').click(function (e) {
        e.preventDefault();

        // Obtener la URL del enlace clicado
        var url = $(this).attr('href');

        // Cargar la vista en el iframe
        $('#dashboard-iframe').attr('src', url);
    });

    $('#dashboard-iframe').attr('src', 'view/index.html');
});

