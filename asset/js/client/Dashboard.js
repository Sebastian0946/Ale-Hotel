
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

document.addEventListener('DOMContentLoaded', function () {
    const dashboardIframe = document.getElementById('dashboard-iframe');
    const defaultUrl = 'view/index.html';

    dashboardIframe.src = defaultUrl;

    const menuLinks = document.querySelectorAll('#sidemenu a');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            dashboardIframe.src = url;
        });
    });
});