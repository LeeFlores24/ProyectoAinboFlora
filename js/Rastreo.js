const trackingForm = document.getElementById('trackingForm');
const trackingResult = document.getElementById('trackingResult');

// Simulación de datos de pedidos
const mockData = {
    '956081': { code: 'C7P', status: 'En camino' },
    '123456': { code: 'A1B', status: 'Procesando' },
    '789012': { code: 'Z9X', status: 'Entregado' }
};

trackingForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const orderNumber = document.getElementById('orderNumber').value.trim();
    const orderCode = document.getElementById('orderCode').value.trim().toUpperCase();

    const orderInfo = mockData[orderNumber];

    if (orderInfo && orderInfo.code === orderCode) {
        trackingResult.textContent = `Estado del pedido: ${orderInfo.status}`;
        updateProgress(orderInfo.status);
    } else {
        trackingResult.textContent = 'Orden no encontrada. Verifique el N° de Orden y el Código.';
        resetProgress();
    }
});

// Actualizar barra de progreso según estado
function updateProgress(status) {
    resetProgress();

    if (status === "Procesando") {
        step1.classList.add('active');
    } else if (status === "En camino") {
        step1.classList.add('active');
        step2.classList.add('active');
    } else if (status === "Entregado") {
        step1.classList.add('active');
        step2.classList.add('active');
        step3.classList.add('active');
    }
}

// Resetear progreso
function resetProgress() {
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
}