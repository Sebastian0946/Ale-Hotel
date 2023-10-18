// Realizar una solicitud a la API
fetch('https://hotel-api-hzf6.onrender.com/api/inventario/inventario')
    .then(response => response.json())
    .then(data => {
        // Datos obtenidos de la API
        const orders = data;

        // Seleccionar el elemento de la tabla en el HTML
        const tableBody = document.querySelector('table tbody');

        orders.data.forEach(inventario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${inventario.ProductoId.Nombre}</td>
                <td>${inventario.ProductoId.Codigo}</td>
                <td>${inventario.PrecioVenta}</td>
                <td class="primary">${inventario.Estado}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al obtener datos de la API:', error);
    });


document.addEventListener("DOMContentLoaded", function () {

    const sales = document.querySelector('.sales');
    const expenses = document.querySelector('.expenses');
    const income = document.querySelector('.income');

    anime.set([sales, expenses, income], {
        opacity: 0,
        translateY: '20px',
    });

    anime({
        targets: [sales, expenses, income],
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        delay: anime.stagger(500),
    });

    const circleChartVentas = document.getElementById('circleChartVentas');
    const circleChartGastos = document.getElementById('circleChartGastos');
    const circleChartIngresos = document.getElementById('circleChartIngresos');
    const recentOrders = document.querySelector('.recent-orders');

    anime.set(recentOrders, {
        opacity: 0,
        translateY: '20px',
    });

    anime({
        targets: recentOrders,
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 500,
    });

    const dataVentas = {
        datasets: [
            {
                data: [81, 19],
                backgroundColor: ['#00C896', '#E3E3E3'],
                borderWidth: 0,
            },
        ],
    };

    const dataGastos = {
        datasets: [
            {
                data: [90, 10],
                backgroundColor: ['#00C896', '#E3E3E3'],
                borderWidth: 0,
            },
        ],
    };

    const dataIngresos = {
        datasets: [
            {
                data: [99, 1],
                backgroundColor: ['#00C896', '#E3E3E3'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '50%',
        rotation: Math.PI / 2,
        animation: false,
        responsive: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const chartVentas = new Chart(circleChartVentas, {
        type: 'doughnut',
        data: dataVentas,
        options: options,
    });

    const chartGastos = new Chart(circleChartGastos, {
        type: 'doughnut',
        data: dataGastos,
        options: options,
    });

    const chartIngresos = new Chart(circleChartIngresos, {
        type: 'doughnut',
        data: dataIngresos,
        options: options,
    });

    const animateCircle = (chart, percentage) => {
        anime({
            targets: chart.data.datasets[0].data,
            duration: 1000,
            easing: 'easeInOutCubic',
            delay: 100,
            endDelay: 300,
            fill: [0, percentage],
            round: 1,
            update: () => chart.update(),
        });
    };

    animateCircle(chartVentas, 81);
    animateCircle(chartGastos, 90);
    animateCircle(chartIngresos, 99);
});

document.addEventListener("DOMContentLoaded", function () {
    const recentOrders = document.querySelector('.recent-orders');

    anime.set(recentOrders, {
        opacity: 0,
        translateY: '20px',
    });

    anime({
        targets: recentOrders,
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 500,
    });
});