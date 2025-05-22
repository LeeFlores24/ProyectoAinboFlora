 // Script para mostrar el número de productos en el carrito
 document.addEventListener('DOMContentLoaded', function() {
  // Simular agregar al carrito
  const addButtons = document.querySelectorAll('.btn-primary');
  const cartBadge = document.querySelector('.badge');
  let cartCount = 0;
  
  addButtons.forEach(button => {
      button.addEventListener('click', function() {
          cartCount++;
          cartBadge.textContent = cartCount;
          
          // Feedback visual
          this.innerHTML = '<i class="bi bi-check-circle"></i> Añadido';
          this.classList.remove('btn-primary');
          this.classList.add('btn-success');
          
          setTimeout(() => {
              this.innerHTML = '<i class="bi bi-cart-plus"></i> Añadir al carrito';
              this.classList.remove('btn-success');
              this.classList.add('btn-primary');
          }, 1500);
      });
  });
  
  // Activar tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
  });
});



    // Objeto para almacenar los productos del carrito
    let carritoItems = {
      'delicia': { id: 'delicia', nombre: 'Delicia Carnívora', precio: 120.00, cantidad: 1 },
      'bonsai': { id: 'bonsai', nombre: 'Bonsái de 15 años', precio: 2250.00, cantidad: 1, detalle: '70cm - 80cm' },
      'kit': { id: 'kit', nombre: 'Kit de Herramientas', precio: 85.00, cantidad: 1 }
    };
    
    // Variables para descuentos
    let descuentoAplicado = false;
    let porcentajeDescuento = 0.20; 
    
    // Función para abrir el carrito
    function abrirCarrito() {
      document.getElementById('carrito').classList.add('abierto');
      document.getElementById('overlay').classList.add('activo');
      document.body.style.overflow = 'hidden'; // Evita el desplazamiento de la página
      actualizarCarrito();
    }
    
    // Función para cerrar el carrito
    function cerrarCarrito() {
      document.getElementById('carrito').classList.remove('abierto');
      document.getElementById('overlay').classList.remove('activo');
      document.body.style.overflow = 'auto'; // Restaura el desplazamiento
    }
    
    // Función para mostrar/ocultar el campo de cupón
    function toggleCupon() {
      const cuponInput = document.getElementById('cupon-input');
      cuponInput.style.display = cuponInput.style.display === 'flex' ? 'none' : 'flex';
    }
    
    // Función para aplicar el cupón de descuento
    function aplicarCupon() {
      const codigoCupon = document.getElementById('codigo-cupon').value.trim().toUpperCase();
      const cuponMensaje = document.getElementById('cupon-mensaje');
      
      // Lista de cupones válidos (normalmente esto se verificaría en el servidor)
      const cuponesValidos = ['AINBO20', 'FLORA2025', 'BIENVENIDO', 'KENNICHIPI', 'LEE'];
      
      if (cuponesValidos.includes(codigoCupon)) {
        descuentoAplicado = true;
        cuponMensaje.style.display = 'block';
        document.getElementById('cupon-input').style.display = 'none';
        actualizarCarrito();
      } else {
        alert('Cupón inválido o expirado');
      }
    }
    
    // Función para agregar un producto al carrito
    function agregarAlCarrito(id, nombre, precio, cantidad, detalle = '') {
      if (carritoItems[id]) {
        carritoItems[id].cantidad += cantidad;
      } else {
        carritoItems[id] = { id, nombre, precio, cantidad, detalle };
      }
      
      // Actualizar contador de productos
      actualizarContadorCarrito();
      
      // Mostrar animación o mensaje de confirmación
      const boton = event.currentTarget;
      const textoOriginal = boton.innerHTML;
      
      boton.innerHTML = '<i class="bi bi-check-circle"></i> ¡Añadido!';
      boton.classList.remove('btn-success');
      boton.classList.add('btn-outline-success');
      
      setTimeout(() => {
        boton.innerHTML = textoOriginal;
        boton.classList.remove('btn-outline-success');
        boton.classList.add('btn-success');
      }, 1500);
      
      // Abrir el carrito automáticamente
      abrirCarrito();
    }
    
    // Función para cambiar la cantidad de un producto
    function cambiarCantidad(id, cambio) {
      if (carritoItems[id]) {
        carritoItems[id].cantidad += cambio;
        
        // Si la cantidad llega a 0, eliminar el producto
        if (carritoItems[id].cantidad <= 0) {
          delete carritoItems[id];
        }
        
        actualizarCarrito();
        actualizarContadorCarrito();
      }
    }
    
    // Función para eliminar un producto del carrito
    function eliminarProducto(id) {
      if (carritoItems[id]) {
        delete carritoItems[id];
        actualizarCarrito();
        actualizarContadorCarrito();
      }
    }
    
    // Función para actualizar el contenido del carrito
    function actualizarCarrito() {
      const carritoItemsElement = document.getElementById('carrito-items');
      carritoItemsElement.innerHTML = '';
      
      let hayProductos = false;
      let subtotal = 0;
      
      // Agregar cada producto al carrito
      for (const id in carritoItems) {
        if (carritoItems[id].cantidad > 0) {
          hayProductos = true;
          const item = carritoItems[id];
          subtotal += item.precio * item.cantidad;
          
          const productoElement = document.createElement('div');
          productoElement.className = 'carrito-producto';
          productoElement.innerHTML = `
            <img src="https://cdn.webshopapp.com/shops/337304/files/452842566/1015x535x1/image.jpg" alt="${item.nombre}">
            <div class="producto-info">
              <h5>${item.nombre}</h5>
              <p class="producto-precio">S/. ${item.precio.toFixed(2)}</p>
              ${item.detalle ? `<p class="producto-detalle">${item.detalle}</p>` : ''}
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
          
          carritoItemsElement.appendChild(productoElement);
        }
      }
      
      // Mostrar mensaje si el carrito está vacío
      if (!hayProductos) {
        carritoItemsElement.innerHTML = `
          <div class="carrito-vacio">
            <i class="bi bi-cart-x"></i>
            <h5>Tu carrito está vacío</h5>
            <p>Añade algunos productos para comenzar</p>
            <a href="index.html" class="seguir-comprando" onclick="cerrarCarrito()">Seguir comprando</a>
          </div>
        `;
      }
      
      // Actualizar subtotal y total
      const subtotalElement = document.getElementById('subtotal-valor');
      const totalElement = document.getElementById('total-valor');
      
      subtotalElement.textContent = `S/. ${subtotal.toFixed(2)}`;
      
      let total = subtotal;
      if (descuentoAplicado) {
        total = subtotal * (1 - porcentajeDescuento);
      }
      
      totalElement.textContent = `S/. ${total.toFixed(2)}`;
    }
    
    // Función para actualizar el contador de productos en el icono del carrito
    function actualizarContadorCarrito() {
      const contador = document.querySelector('.contador-carrito');
      let totalItems = 0;
      
      for (const id in carritoItems) {
        totalItems += carritoItems[id].cantidad;
      }
      
      contador.textContent = totalItems;
      
      // Ocultar el contador si no hay productos
      if (totalItems === 0) {
        contador.style.display = 'none';
      } else {
        contador.style.display = 'flex';
      }
    }
    
    // Inicializar el carrito al cargar la página
    window.onload = function() {
      actualizarContadorCarrito();
    };


document.addEventListener('DOMContentLoaded', function () {
  const chatIcon = document.getElementById('chatIcon');
  const chatContainer = document.getElementById('chatContainer');
  const closeChat = document.getElementById('closeChat');
  const userMessage = document.getElementById('userMessage');
  const sendMessage = document.getElementById('sendMessage');
  const chatMessages = document.getElementById('chatMessages');
  const notificationBadge = document.querySelector('.notification-badge');

  chatIcon.addEventListener('click', function () {
    chatContainer.classList.add('visible');
    notificationBadge.style.display = 'none';
  });

  closeChat.addEventListener('click', function () {
    chatContainer.classList.remove('visible');
  });

  function sendMessageHandler() {
    const messageText = userMessage.value.trim();
    if (messageText !== '') {
      addMessage(messageText, 'sent');
      userMessage.value = '';

      setTimeout(() => {
        const responses = [
          "Gracias por tu mensaje. ¿Cómo puedo ayudarte?",
          "Interesante, ¿puedes darme más detalles?",
          "Estoy procesando tu solicitud...",
          "Perfecto, ¿Entonces te acompaño a la tienda?",
          "Oh, lamentamos decir que no tenemos eso en este momento.",
          "Oh, lamentamos lo sucedido, Nuestro equipo de soporte se pondrá en contacto contigo",
          "Puedes llamar a este número: 929716477",
          "Entiendo, ¿quieres saber más sobre nuestros productos?",
          "Eso suena interesante, ¿puedes contarme más?",
          "Gracias por tu consulta, ¿hay algo más que necesites?",
          "Eso suena genial, ¿tienes alguna pregunta específica? ",
          "Voy a verificar eso por ti."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'received');
      }, 1000 + Math.random() * 2000);
    }
  }

  sendMessage.addEventListener('click', sendMessageHandler);
  userMessage.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessageHandler();
  });

  function addMessage(text, type) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
        <span class="message-time">${timeString}</span>
      </div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (!chatContainer.classList.contains('visible') && type === 'received') {
      notificationBadge.style.display = 'flex';
    }
  }

  setTimeout(() => {
    if (!chatContainer.classList.contains('visible')) {
      notificationBadge.style.display = 'flex';
    }
  }, 5000);
});









// Función para cargar productos manteniendo tu estructura HTML
document.addEventListener('DOMContentLoaded', function() {
    // 1. Identificar automáticamente los contenedores de productos
    const productSections = document.querySelectorAll('.product-section .row');
    
    // Mostrar loader en cada sección
    productSections.forEach(section => {
        section.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `;
    });

    // 2. Consumir la API
    fetch('http://localhost:3306/api/productos')
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error('Error en los datos');
            
            // 3. Clasificar productos según tus secciones existentes
            const productosPorCategoria = {
                'Plantas': [],
                'Maceteros': [],
                'Semillas': [],
                'Herramientas': []
            };

            data.data.forEach(producto => {
                const categoria = producto.Categoria.toLowerCase();
                if (categoria.includes('planta')) {
                    productosPorCategoria.Plantas.push(producto);
                } else if (categoria.includes('macetero')) {
                    productosPorCategoria.Maceteros.push(producto);
                } else if (categoria.includes('semilla')) {
                    productosPorCategoria.Semillas.push(producto);
                } else if (categoria.includes('herramienta')) {
                    productosPorCategoria.Herramientas.push(producto);
                }
            });

            // 4. Insertar productos en las secciones correspondientes
            productSections.forEach(section => {
                const sectionTitle = section.closest('.product-section')
                    .querySelector('.section-title').textContent.toLowerCase();
                
                let productos = [];
                if (sectionTitle.includes('planta')) {
                    productos = productosPorCategoria.plantas;
                } else if (sectionTitle.includes('macetero')) {
                    productos = productosPorCategoria.maceteros;
                } else if (sectionTitle.includes('semilla')) {
                    productos = productosPorCategoria.semillas;
                } else if (sectionTitle.includes('herramienta')) {
                    productos = productosPorCategoria.herramientas;
                }

                // Limpiar sección
                section.innerHTML = '';

                // Agregar productos o mensaje si no hay
                if (productos.length === 0) {
                    section.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <i class="bi bi-emoji-frown fs-1 text-muted"></i>
                            <p class="mt-3">No hay productos disponibles</p>
                        </div>
                    `;
                } else {
                    productos.forEach(producto => {
                        section.appendChild(crearTarjetaProducto(producto));
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            productSections.forEach(section => {
                section.innerHTML = `
                    <div class="col-12 text-center py-5 text-danger">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <p>Error al cargar los productos</p>
                    </div>
                `;
            });
        });
});

// Función para crear tarjetas compatible con tu diseño actual
function crearTarjetaProducto(producto) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3 mb-4';

    col.innerHTML = `
        <div class="card h-100">
            ${producto.Stock <= 0 ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Agotado</span>' : ''}
            ${producto.Categoria === 'Nuevo' ? '<span class="badge bg-primary position-absolute top-0 start-0 m-2">Nuevo</span>' : ''}
            
            <img src="${producto.Imagen || 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible'}" 
                 class="card-img-top product-img" 
                 alt="${producto.Nombre}"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+No+Disponible'">
            
            <div class="card-body">
                <h5 class="card-title">${producto.Nombre}</h5>
                <p class="card-text text-muted small">${producto.Descripcion || 'Sin descripción disponible'}</p>
            </div>
            
            <div class="card-footer bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-success fw-bold">S/${producto.Precio.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-success add-to-cart" 
                            data-id="${producto.id}"
                            ${producto.Stock <= 0 ? 'disabled' : ''}>
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}