document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3306/api/productos") 
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        mostrarProductosDinamicos(data.data);
      } else {
        console.error("Error al cargar productos:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
});

function mostrarProductosDinamicos(productos) {
  const seccionPlantas = document.querySelector("#carrusel-Plantas");
  const seccionSemillas = document.querySelector("#carrusel-Semillas");
  const seccionMaceteros = document.querySelector("#grid-Maceteros");
  const seccionHerramientas = document.querySelector(
    "#grid-Artículos\\ de\\ jardinería"
  );

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "product";
    card.onclick = () =>
      mostrarDetalles(
        producto.Nombre,
        producto.Descripcion,
        `S/. ${producto.Precio.toFixed(2)}`
      );

    card.innerHTML = `
      <img src="${producto.Imagen}" alt="${producto.Nombre}">
      <h3>${producto.Nombre}</h3>
<p>S/. ${Number(producto.Precio).toFixed(2)}</p>
      <button class="boton-comprar btn btn-success mt-2" onclick="event.stopPropagation(); agregarAlCarrito('${
        producto.Nombre
      }', ${producto.Precio}, 1)">🛒 Comprar</button>
    `;

    switch (producto.Categoria) {
      case "Plantas":
        seccionPlantas?.appendChild(card);
        break;
      case "Semillas":
        seccionSemillas?.appendChild(card);
        break;
      case "Maceteros":
        seccionMaceteros?.appendChild(card);
        break;
      case "Artículos de jardinería":
        seccionHerramientas?.appendChild(card);
        break;
    }
  });
}

// Carrito
let carritoItems = {};
let descuentoAplicado = false;
let porcentajeDescuento = 0.2;

function abrirCarrito() {
  document.getElementById("carrito").classList.add("abierto");
  document.getElementById("overlay").classList.add("activo");
  document.body.style.overflow = "hidden";
  actualizarCarrito();
}

function cerrarCarrito() {
  document.getElementById("carrito").classList.remove("abierto");
  document.getElementById("overlay").classList.remove("activo");
  document.body.style.overflow = "auto";
}

function toggleCupon() {
  const cuponInput = document.getElementById("cupon-input");
  cuponInput.style.display =
    cuponInput.style.display === "flex" ? "none" : "flex";
}

function aplicarCupon() {
  const codigo = document
    .getElementById("codigo-cupon")
    .value.trim()
    .toUpperCase();
  const cuponMensaje = document.getElementById("cupon-mensaje");
  const cuponesValidos = [
    "AINBO20",
    "FLORA2025",
    "BIENVENIDO",
    "KENNICHIPI",
    "LEE",
  ];

  if (cuponesValidos.includes(codigo)) {
    descuentoAplicado = true;
    cuponMensaje.style.display = "block";
    document.getElementById("cupon-input").style.display = "none";
    actualizarCarrito();
  } else {
    alert("Cupón inválido o expirado");
  }
}

function agregarAlCarrito(id, precio, cantidad = 1, detalle = "") {
  if (carritoItems[id]) {
    carritoItems[id].cantidad += cantidad;
  } else {
    carritoItems[id] = { id, nombre: id, precio, cantidad, detalle };
  }

  actualizarContadorCarrito();
  abrirCarrito();
}

function cambiarCantidad(id, cambio) {
  if (carritoItems[id]) {
    carritoItems[id].cantidad += cambio;
    if (carritoItems[id].cantidad <= 0) delete carritoItems[id];
    actualizarCarrito();
    actualizarContadorCarrito();
  }
}

function eliminarProducto(id) {
  if (carritoItems[id]) {
    delete carritoItems[id];
    actualizarCarrito();
    actualizarContadorCarrito();
  }
}

function actualizarCarrito() {
  const contenedor = document.getElementById("carrito-items");
  contenedor.innerHTML = "";

  let subtotal = 0;
  let hayProductos = false;

  for (const id in carritoItems) {
    const item = carritoItems[id];
    if (item.cantidad > 0) {
      hayProductos = true;
      subtotal += item.precio * item.cantidad;

      const div = document.createElement("div");
      div.className = "carrito-producto";
      div.innerHTML = `
        <img src="https://cdn.webshopapp.com/shops/337304/files/452842566/1015x535x1/image.jpg" alt="${
          item.nombre
        }">
        <div class="producto-info">
          <h5>${item.nombre}</h5>
          <p class="producto-precio">S/. ${item.precio.toFixed(2)}</p>
          ${
            item.detalle
              ? `<p class="producto-detalle">${item.detalle}</p>`
              : ""
          }
          <div class="producto-cantidad">
            <button class="cantidad-btn" onclick="cambiarCantidad('${id}', -1)">-</button>
            <span class="cantidad-valor">${item.cantidad}</span>
            <button class="cantidad-btn" onclick="cambiarCantidad('${id}', 1)">+</button>
          </div>
        </div>
        <button class="eliminar-producto" onclick="eliminarProducto('${id}')">
          <i class="bi bi-trash"></i>
        </button>
      `;
      contenedor.appendChild(div);
    }
  }

  if (!hayProductos) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <i class="bi bi-cart-x"></i>
        <h5>Tu carrito está vacío</h5>
        <p>Añade algunos productos para comenzar</p>
        <a href="index.html" class="seguir-comprando" onclick="cerrarCarrito()">Seguir comprando</a>
      </div>
    `;
  }

  const subtotalEl = document.getElementById("subtotal-valor");
  const totalEl = document.getElementById("total-valor");
  subtotalEl.textContent = `S/. ${subtotal.toFixed(2)}`;
  let total = descuentoAplicado
    ? subtotal * (1 - porcentajeDescuento)
    : subtotal;
  totalEl.textContent = `S/. ${total.toFixed(2)}`;
}

function actualizarContadorCarrito() {
  const contador = document.querySelector(".contador-carrito");
  if (!contador) return;

  let total = 0;
  for (const id in carritoItems) {
    total += carritoItems[id].cantidad;
  }

  contador.textContent = total;
  contador.style.display = total === 0 ? "none" : "flex";
}

// Inicializar al cargar
window.onload = () => actualizarContadorCarrito();
