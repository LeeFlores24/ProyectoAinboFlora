
let metodoSeleccionado = "";

function cambiarPago(event, metodo, boton) {
    event.preventDefault();
    metodoSeleccionado = metodo;

    const botones = document.querySelectorAll('.pay-option');
    botones.forEach(btn => btn.classList.remove('activo'));

    boton.classList.add('activo');

    const contenedor = document.getElementById('detallesPago');
    switch (metodo) {
        case 'visa':
            contenedor.innerHTML = '<input type="text" placeholder="Número de tarjeta Visa">';
            break;
        case 'paypal':
            contenedor.innerHTML = '<p>Serás redirigido a PayPal para completar el pago.</p>';
            break;
        case 'yape':
            contenedor.innerHTML = '<p>Escanea el código QR en tu app de Yape.</p>';
            break;
        default:
            contenedor.innerHTML = '';
    }

    const finalizarBtn = document.getElementById('finalizarBtn');
    finalizarBtn.innerHTML = `🛒 Finalizar compra con ${metodo.charAt(0).toUpperCase() + metodo.slice(1)}`;
}

function irAPago() {
    if (!metodoSeleccionado) {
        alert("Selecciona un método de pago antes de continuar.");
        return;
    }
    const envio = localStorage.getItem("reglaEnvio") || "Envío estándar: S/0.00";
    alert(`Método seleccionado: ${metodoSeleccionado.toUpperCase()}
${envio}
¡Redirigiendo a pasarela de pago...!`);
}

function abrirCotizador() {
    window.location.href = "../seguimiento_final/seguimiento/seguimiento.html";
}
