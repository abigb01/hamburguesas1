// Variables globales
const cartCounter = document.getElementById('cart-counter');
const cartModal = document.getElementById('cart-modal');
const orderModal = document.getElementById('order-modal');
const successModal = document.getElementById('success-modal');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar contador carrito
function updateCartCounter() {
  cartCounter.textContent = `🛒 ${cart.reduce((acc, item) => acc + item.cantidad, 0)}`;
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
}

// Renderizar carrito en modal
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>El carrito está vacío.</p>';
    document.getElementById('cart-total').textContent = 'Total: $0';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}" />
      <div>
        <strong>${item.nombre}</strong><br/>
        Cantidad: ${item.cantidad}<br/>
        Precio: $${item.precio * item.cantidad}
      </div>
      <button class="remove-item" data-id="${item.id}" style="margin-left:auto; background:#ff5252; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;">Eliminar</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  document.getElementById('cart-total').textContent = `Total: $${total}`;
}

// Mostrar diálogo personalizado
function showDialog(message, options = {}) {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    
    let buttonsHTML = '';
    if (options.confirm) {
      buttonsHTML = `
        <div class="dialog-buttons">
          <button class="dialog-btn dialog-btn-secondary" id="dialog-cancel">Cancelar</button>
          <button class="dialog-btn dialog-btn-primary" id="dialog-confirm">Aceptar</button>
        </div>
      `;
    } else {
      buttonsHTML = `
        <div class="dialog-buttons">
          <button class="dialog-btn dialog-btn-primary" id="dialog-ok">OK</button>
        </div>
      `;
    }
    
    dialog.innerHTML = `
      <div class="dialog-box">
        <p>${message}</p>
        ${options.input ? `<input type="number" min="1" value="1" class="quantity-input" id="dialog-input">` : ''}
        ${buttonsHTML}
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    if (options.input) {
      const input = document.getElementById('dialog-input');
      input.focus();
      input.select();
    }
    
    const handleResponse = (value) => {
      document.body.removeChild(dialog);
      resolve(value);
    };
    
    if (options.confirm) {
      document.getElementById('dialog-cancel').addEventListener('click', () => handleResponse(false));
      document.getElementById('dialog-confirm').addEventListener('click', () => {
        if (options.input) {
          const value = parseInt(document.getElementById('dialog-input').value);
          handleResponse(isNaN(value) || value < 1 ? 1 : value);
        } else {
          handleResponse(true);
        }
      });
    } else {
      document.getElementById('dialog-ok').addEventListener('click', () => handleResponse(true));
    }
  });
}

// Añadir producto al carrito con diálogo de cantidad
async function addToCart(id, nombre, precio, img) {
  try {
    const cantidad = await showDialog(`¿Cuántas unidades de <strong>${nombre}</strong> deseas ordenar?`, {
      input: true,
      confirm: true
    });
    
    if (!cantidad) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      cart.push({ id, nombre, precio, img, cantidad });
    }
    
    saveCart();
    renderCart();
    
    await showDialog(`Has agregado ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de <strong>${nombre}</strong> al carrito.`);
  } catch (error) {
    console.error('Error en addToCart:', error);
  }
}

// Vaciar carrito con confirmación
async function emptyCart() {
  if (cart.length === 0) {
    await showDialog('El carrito ya está vacío.');
    return;
  }
  
  const confirmar = await showDialog('¿Estás seguro de que quieres vaciar el carrito?', {
    confirm: true
  });
  
  if (confirmar) {
    cart = [];
    saveCart();
    renderCart();
    await showDialog('El carrito ha sido vaciado.');
  }
}

// Mostrar/ocultar carrito
cartCounter.addEventListener('click', () => {
  if (cartModal.style.display === 'flex') {
    cartModal.style.display = 'none';
  } else {
    renderCart();
    cartModal.style.display = 'flex';
  }
});

// Cerrar modal carrito
document.getElementById('close-cart').addEventListener('click', () => {
  cartModal.style.display = 'none';
});

// Botones ordenar productos
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const item = e.target.closest('.menu-item');
    const id = Number(item.dataset.id);
    const nombre = item.dataset.nombre;
    const precio = Number(item.dataset.precio);
    const img = item.dataset.img;
    addToCart(id, nombre, precio, img);
  });
});

// Botón vaciar carrito
document.getElementById('empty-cart').addEventListener('click', emptyCart);

// Botón continuar pago
document.getElementById('proceed-payment').addEventListener('click', async () => {
  if (cart.length === 0) {
    await showDialog('Tu carrito está vacío. Agrega productos antes de pagar.');
    return;
  }
  
  cartModal.style.display = 'none';
  orderModal.style.display = 'flex';
  document.getElementById('payment-method').value = 'efectivo';
  document.getElementById('card-form').style.display = 'none';
  document.getElementById('cash-info').style.display = 'block';
  clearCardForm();
});

// Cerrar modal pago
document.getElementById('close-order').addEventListener('click', () => {
  orderModal.style.display = 'none';
});

// Manejo de métodos de pago
document.querySelectorAll('.payment-method').forEach(method => {
  method.addEventListener('click', function() {
    document.querySelectorAll('.payment-method').forEach(m => {
      m.classList.remove('selected');
    });
    
    this.classList.add('selected');
    const methodValue = this.dataset.method;
    document.getElementById('payment-method').value = methodValue;
    
    if (methodValue === 'tarjeta') {
      document.getElementById('card-form').style.display = 'block';
      document.getElementById('cash-info').style.display = 'none';
    } else {
      document.getElementById('card-form').style.display = 'none';
      document.getElementById('cash-info').style.display = 'block';
    }
  });
});

// Limpiar formulario tarjeta
function clearCardForm() {
  document.getElementById('card-name').value = '';
  document.getElementById('card-number').value = '';
  document.getElementById('card-expiry').value = '';
  document.getElementById('card-cvv').value = '';
}

// Validar datos tarjeta
function validarTarjeta() {
  const name = document.getElementById('card-name').value.trim();
  const number = document.getElementById('card-number').value.trim();
  const expiry = document.getElementById('card-expiry').value.trim();
  const cvv = document.getElementById('card-cvv').value.trim();

  if (!name || !number || !expiry || !cvv) {
    showDialog('Por favor, completa todos los campos de la tarjeta.');
    return false;
  }

  if (!/^\d{16}$/.test(number)) {
    showDialog('El número de tarjeta debe tener 16 dígitos.');
    return false;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    showDialog('La fecha de expiración debe tener el formato MM/AA.');
    return false;
  }

  if (!/^\d{3}$/.test(cvv)) {
    showDialog('El CVV debe tener 3 dígitos.');
    return false;
  }

  return true;
}

// Generar ticket PDF
function generarTicket() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Configuración inicial
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('BurgerMaster - Ticket de Compra', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 30);
  
  // Detalles de los productos
  let y = 50;
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 14, y);
  doc.text('Cantidad', 100, y);
  doc.text('Precio', 150, y);
  doc.text('Total', 180, y);
  
  doc.setFont('helvetica', 'normal');
  y += 10;
  
  cart.forEach(item => {
    doc.text(item.nombre, 14, y);
    doc.text(item.cantidad.toString(), 100, y);
    doc.text(`$${item.precio}`, 150, y);
    doc.text(`$${item.precio * item.cantidad}`, 180, y);
    y += 10;
  });
  
  // Total
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${total}`, 180, y);
  
  // Método de pago
  y += 20;
  const metodoPago = document.getElementById('payment-method').value === 'tarjeta' ? 'Tarjeta' : 'Efectivo';
  doc.text(`Método de pago: ${metodoPago}`, 14, y);
  
  // Guardar el PDF
  doc.save(`Ticket_BurgerMaster_${new Date().getTime()}.pdf`);
}

// Confirmar pago
document.getElementById('confirm-payment').addEventListener('click', async () => {
  const method = document.getElementById('payment-method').value;
  
  if (method === 'tarjeta' && !validarTarjeta()) {
    return;
  }

  // Preguntar si desea ticket
  const quiereTicket = await showDialog('¿Deseas un ticket PDF de tu compra?', {
    confirm: true
  });
  
  if (quiereTicket) {
    generarTicket();
  }

  // Procesar pago
  orderModal.style.display = 'none';
  cart = [];
  saveCart();

  // Mostrar modal éxito
  showSuccessModal();
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
});

// Cancelar pago
document.getElementById('cancel-payment').addEventListener('click', () => {
  orderModal.style.display = 'none';
});

// Mostrar modal éxito
function showSuccessModal() {
  successModal.style.display = 'flex';
}

// Cerrar modal éxito
document.getElementById('close-success').addEventListener('click', () => {
  successModal.style.display = 'none';
  updateCartCounter();
});

// Manejo eliminar producto en carrito
document.getElementById('cart-items').addEventListener('click', e => {
  if (e.target.classList.contains('remove-item')) {
    const id = Number(e.target.dataset.id);
    removeFromCart(id);
  }
});

// Eliminar producto del carrito
async function removeFromCart(id) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  
  const confirmar = await showDialog(`¿Eliminar ${item.cantidad} ${item.cantidad === 1 ? 'unidad' : 'unidades'} de ${item.nombre} del carrito?`, {
    confirm: true
  });
  
  if (confirmar) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  }
}

// Inicializar
updateCartCounter();