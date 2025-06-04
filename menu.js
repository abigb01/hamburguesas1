
// Actualizar al inicio del archivo menu.js

// Manejo de métodos de pago
document.querySelectorAll('.payment-method').forEach(method => {
  method.addEventListener('click', function() {
    // Remover selección anterior
    document.querySelectorAll('.payment-method').forEach(m => {
      m.classList.remove('selected');
    });
    
    // Agregar selección actual
    this.classList.add('selected');
    const methodValue = this.dataset.method;
    document.getElementById('payment-method').value = methodValue;
    
    // Mostrar el formulario correspondiente
    if (methodValue === 'tarjeta') {
      document.getElementById('card-form').style.display = 'block';
      document.getElementById('cash-info').style.display = 'none';
    } else {
      document.getElementById('card-form').style.display = 'none';
      document.getElementById('cash-info').style.display = 'block';
    }
  });
});

// Modificar la función confirm-payment
document.getElementById('confirm-payment').addEventListener('click', () => {
  const method = document.getElementById('payment-method').value;
  
  if (method === 'tarjeta' && !validarTarjeta()) {
    return;
  }

  // Simular procesamiento...
  orderModal.style.display = 'none';
  cart = [];
  saveCart();

  // Mostrar modal éxito con confeti real
  showSuccessModal();
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
});

// Eliminar la función launchConfetti anterior y reemplazar con:
function showSuccessModal() {
  successModal.style.display = 'flex';
}// Variables globales
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

// Añadir producto al carrito
function addToCart(id, nombre, precio, img) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.cantidad++;
  } else {
    cart.push({ id, nombre, precio, img, cantidad: 1 });
  }
  saveCart();
  renderCart();
  alert(`Agregaste ${nombre} al carrito.`);
}

// Eliminar producto del carrito
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

// Vaciar carrito
function emptyCart() {
  if (confirm('¿Seguro que quieres vaciar el carrito?')) {
    cart = [];
    saveCart();
    renderCart();
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
document.getElementById('proceed-payment').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  cartModal.style.display = 'none';
  orderModal.style.display = 'flex';
  // Reset formulario
  document.querySelector('input[name="payment-method"][value="efectivo"]').checked = true;
  document.getElementById('card-form').style.display = 'none';
  document.getElementById('cash-info').style.display = 'block';
  clearCardForm();
});

// Cerrar modal pago
document.getElementById('close-order').addEventListener('click', () => {
  orderModal.style.display = 'none';
});

// Cambiar método de pago visual
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
  radio.addEventListener('change', e => {
    if (e.target.value === 'tarjeta') {
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

// Validar datos tarjeta (simple)
function validarTarjeta() {
  const name = document.getElementById('card-name').value.trim();
  const number = document.getElementById('card-number').value.trim();
  const expiry = document.getElementById('card-expiry').value.trim();
  const cvv = document.getElementById('card-cvv').value.trim();

  if (!name || !number || !expiry || !cvv) {
    alert('Por favor, completa todos los campos de la tarjeta.');
    return false;
  }

  if (!/^\d{16}$/.test(number)) {
    alert('El número de tarjeta debe tener 16 dígitos.');
    return false;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    alert('La fecha de expiración debe tener el formato MM/AA.');
    return false;
  }

  if (!/^\d{3}$/.test(cvv)) {
    alert('El CVV debe tener 3 dígitos.');
    return false;
  }

  return true;
}

// Confirmar pago
document.getElementById('confirm-payment').addEventListener('click', () => {
  const method = document.querySelector('input[name="payment-method"]:checked').value;
  if (method === 'tarjeta' && !validarTarjeta()) {
    return;
  }

  // Simular procesamiento...
  orderModal.style.display = 'none';
  cart = [];
  saveCart();

  // Mostrar modal éxito
  showSuccessModal();
});

// Cancelar pago
document.getElementById('cancel-payment').addEventListener('click', () => {
  orderModal.style.display = 'none';
});

// Mostrar modal éxito con animación confeti
function showSuccessModal() {
  successModal.style.display = 'flex';
  launchConfetti();
}

// Cerrar modal éxito
document.getElementById('close-success').addEventListener('click', () => {
  successModal.style.display = 'none';
  clearConfetti();
  updateCartCounter();
});

// Manejo eliminar producto en carrito
document.getElementById('cart-items').addEventListener('click', e => {
  if (e.target.classList.contains('remove-item')) {
    const id = Number(e.target.dataset.id);
    removeFromCart(id);
  }
});

// Confeti básico con canvas
let confettiInterval;
function launchConfetti() {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const colors = ['#bb0000', '#ffffff', '#ff5252', '#f90'];

  (function frame() {
    if (Date.now() > animationEnd) return clearConfetti();
    // Aquí podrías integrar alguna librería de confeti, pero por simplicidad mostramos emoji 🎉
    const confettiCanvas = document.getElementById('confetti-canvas');
    confettiCanvas.textContent = '🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉';
    confettiInterval = setTimeout(frame, 500);
  })();
}

function clearConfetti() {
  clearTimeout(confettiInterval);
  const confettiCanvas = document.getElementById('confetti-canvas');
  confettiCanvas.textContent = '';
}

// Inicializar
updateCartCounter();
