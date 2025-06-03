document.addEventListener('DOMContentLoaded', function() {
    // ========== VARIABLES GLOBALES ==========
    let cart = [];
    const { jsPDF } = window.jspdf;
    
    // ========== EVENTOS PRINCIPALES ==========
    // 1. Botones "Ordenar"
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.menu-item');
            const itemName = item.querySelector('h4').textContent;
            const itemPrice = item.querySelector('.price').textContent;
            const itemImage = item.querySelector('img').src;
            
            showOptionsModal(itemName, itemPrice, itemImage);
        });
    });

    // ========== FUNCIONES PRINCIPALES ==========
    // 1. Mostrar modal de opciones
    function showOptionsModal(name, price, image) {
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <img src="${image}" alt="${name}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:15px;">
                <h3>${name}</h3>
                <p class="price">${price}</p>
                <div class="form-group">
                    <label>Cantidad:</label>
                    <input type="number" min="1" value="1" class="quantity">
                </div>
                <div class="modal-buttons">
                    <button class="btn cancel-btn">Cancelar</button>
                    <button class="btn add-to-cart">Añadir al carrito</button>
                </div>
            </div>`;
        
        document.body.appendChild(modal);
        
        // Eventos del modal
        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.add-to-cart').addEventListener('click', () => {
            const quantity = modal.querySelector('.quantity').value;
            if(quantity < 1) {
                alert('Por favor ingresa una cantidad válida');
                return;
            }
            addToCart(name, price, quantity, image);
            modal.remove();
            showCartModal();
        });
    }

    // 2. Añadir al carrito
    function addToCart(name, price, quantity, image) {
        const itemPrice = parseFloat(price.replace(/[^\d.]/g, ''));
        const existingItem = cart.find(item => item.name === name);
        
        if(existingItem) {
            existingItem.quantity += parseInt(quantity);
            existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
            cart.push({
                name,
                price: itemPrice,
                quantity: parseInt(quantity),
                image,
                totalPrice: itemPrice * parseInt(quantity)
            });
        }
        updateCartCounter();
    }

    // 3. Mostrar carrito
    function showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'order-modal cart-modal';
        const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Tu Pedido</h3>
                <div class="cart-items">
                    ${cart.map((item, index) => `
                        <div class="cart-item">
                            <div class="item-info">
                                <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                                <div>
                                    <h4>${item.name}</h4>
                                    <p>${item.quantity} x $${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div class="item-actions">
                                <span>$${item.totalPrice.toFixed(2)}</span>
                                <button class="remove-item" data-index="${index}">✕</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                </div>
                <div class="payment-section">
                    <h4>Método de pago:</h4>
                    <div class="payment-methods">
                        <label class="payment-option">
                            <input type="radio" name="payment" value="efectivo" checked>
                            <div class="payment-card">
                                <span>💵 Efectivo</span>
                                <small>Prepare su dinero exacto</small>
                            </div>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="tarjeta">
                            <div class="payment-card">
                                <span>💳 Tarjeta</span>
                                <small>Pago con terminal</small>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn cancel-btn">Seguir comprando</button>
                    <button class="btn checkout-btn">Continuar con el pago</button>
                </div>
            </div>`;
        
        document.body.appendChild(modal);
        
        // Eventos del modal
        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
        
        modal.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                showCartModal();
            });
        });
        
        modal.querySelector('.checkout-btn').addEventListener('click', () => {
            const paymentMethod = modal.querySelector('input[name="payment"]:checked').value;
            if(paymentMethod === 'tarjeta') {
                showCardPaymentForm(modal);
            } else {
                showCashConfirmation(modal);
            }
        });
    }

    // 4. Mostrar formulario de tarjeta
    function showCardPaymentForm(modal) {
        modal.querySelector('.modal-content').innerHTML = `
            <h3>Pago con Tarjeta</h3>
            <div class="payment-form">
                <div class="form-group">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="Como aparece en la tarjeta" required>
                </div>
                <div class="form-group">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de expiración</label>
                        <input type="text" placeholder="MM/AA" required>
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" placeholder="123" required>
                    </div>
                </div>
                <div class="card-message">
                    <p>Su pago será procesado de forma segura.</p>
                </div>
                <div class="modal-buttons">
                    <button class="btn back-btn">← Regresar</button>
                    <button class="btn confirm-payment">Confirmar Pago</button>
                </div>
            </div>`;
        
        modal.querySelector('.back-btn').addEventListener('click', () => showCartModal());
        modal.querySelector('.confirm-payment').addEventListener('click', () => {
            showReceiptOption(modal, 'tarjeta');
        });
    }

    // 5. Mostrar confirmación de efectivo
    function showCashConfirmation(modal) {
        modal.querySelector('.modal-content').innerHTML = `
            <div class="order-confirmation">
                <h3>Pedido Confirmado</h3>
                <div class="cash-message">
                    <p>Prepare su dinero exacto, nuestro repartidor pasará por él.</p>
                </div>
                <div id="delivery-time">⌛ Calculando tiempo de entrega...</div>
                ${updateDeliveryTime()}
                <div class="receipt-option">
                    <label>
                        <input type="checkbox" id="need-receipt"> 
                        ¿Necesita ticket de compra?
                    </label>
                </div>
                <div class="modal-buttons">
                    <button class="btn finish-btn">Finalizar</button>
                </div>
            </div>`;
        
        modal.querySelector('.finish-btn').addEventListener('click', () => {
            const needReceipt = modal.querySelector('#need-receipt').checked;
            if(needReceipt) {
                generateReceipt('efectivo');
            }
            launchConfetti();
            modal.remove();
            cart = [];
            updateCartCounter();
        });
    }

    // 6. Mostrar opción de ticket para tarjeta
    function showReceiptOption(modal, paymentMethod) {
        modal.querySelector('.modal-content').innerHTML = `
            <div class="order-confirmation">
                <h3>¡Pago Exitoso! ✅</h3>
                <div class="card-message">
                    <p>Su pago ha sido procesado correctamente.</p>
                </div>
                <div id="delivery-time">⌛ Calculando tiempo de entrega...</div>
                ${updateDeliveryTime()}
                <div class="receipt-option">
                    <label>
                        <input type="checkbox" id="need-receipt" checked> 
                        ¿Desea descargar el ticket de compra?
                    </label>
                </div>
                <div class="modal-buttons">
                    <button class="btn finish-btn">Finalizar</button>
                </div>
            </div>`;
        
        launchConfetti();
        
        modal.querySelector('.finish-btn').addEventListener('click', () => {
            const needReceipt = modal.querySelector('#need-receipt').checked;
            if(needReceipt) {
                generateReceipt(paymentMethod);
            }
            modal.remove();
            cart = [];
            updateCartCounter();
        });
    }

    // 7. Generar ticket PDF
    function generateReceipt(paymentMethod) {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // Encabezado
        doc.setFontSize(18);
        doc.text('BurgerMaster', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Calle Rubí, Geo Villas 123, Tizayuca', 105, 28, { align: 'center' });
        doc.text(Fecha: ${date}, 105, 35, { align: 'center' });
        
        // Línea divisoria
        doc.line(20, 40, 190, 40);
        
        // Detalles del pedido
        doc.setFontSize(14);
        doc.text('Detalle del Pedido', 20, 50);
        
        let y = 60;
        cart.forEach(item => {
            doc.setFontSize(10);
            doc.text(${item.quantity}x ${item.name}, 20, y);
            doc.text($${item.totalPrice.toFixed(2)}, 180, y, { align: 'right' });
            y += 7;
        });
        
        // Total
        doc.setFontSize(12);
        doc.line(20, y+5, 190, y+5);
        doc.text('Total:', 20, y+15);
        doc.text($${total.toFixed(2)}, 180, y+15, { align: 'right' });
        
        // Método de pago
        doc.text(Método de pago: ${paymentMethod === 'tarjeta' ? 'Tarjeta' : 'Efectivo'}, 20, y+25);
        
        // Pie de página
        doc.setFontSize(10);
        doc.text('¡Gracias por su compra!', 105, y+35, { align: 'center' });
        doc.text('Vuelva pronto', 105, y+40, { align: 'center' });
        
        // Guardar PDF
        doc.save(Ticket_BurgerMaster_${date.replace(/[/,:]/g, '-')}.pdf);
    }

    // ========== FUNCIONES AUXILIARES ==========
    function launchConfetti() {
        confetti({ 
            particleCount: 150, 
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function updateDeliveryTime() {
        const times = ['20-30 min', '25-35 min', '30-40 min'];
        const element = document.getElementById('delivery-time');
        if (element) {
            element.textContent = ⏱ Entrega estimada: ${times[Math.floor(Math.random() * times.length)]};
        }
    }

    function updateCartCounter() {
        let cartCounter = document.querySelector('.cart-counter');
        if (!cartCounter) {
            const nav = document.querySelector('.navbar .container');
            if (nav) {
                cartCounter = document.createElement('div');
                cartCounter.className = 'cart-counter';
                nav.appendChild(cartCounter);
            }
        }
        if (cartCounter) {
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.innerHTML = 🛒 ${itemCount} | $${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)};
            cartCounter.onclick = showCartModal;
        }
    }
});
Aquí tienes el código JavaScript completo para manejar la interacción del modal de pago, junto con algunos ajustes finales al CSS:

javascript
// Selección de elementos del DOM
const orderButtons = document.querySelectorAll('.order-btn');
const paymentModal = document.querySelector('.payment-options');
const closeButton = document.querySelector('.close-btn');
const continueShoppingBtn = document.querySelector('.continue-shopping');
const proceedPaymentBtn = document.querySelector('.proceed-payment');
const paymentMethods = document.querySelectorAll('.payment-method');

// Variable para almacenar el método de pago seleccionado
let selectedPaymentMethod = null;

// Mostrar modal al hacer clic en cualquier botón de ordenar
orderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
    });
});

// Cerrar modal
closeButton.addEventListener('click', () => {
    closeModal();
});

continueShoppingBtn.addEventListener('click', () => {
    closeModal();
});

// Función para cerrar el modal
function closeModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentMethods();
}

// Selección de método de pago
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        // Remover selección previa
        paymentMethods.forEach(m => {
            m.classList.remove('selected', 'active');
        });
        
        // Añadir selección actual
        method.classList.add('selected', 'active');
        selectedPaymentMethod = method.dataset.method;
        
        // Activar botón de proceder al pago
        proceedPaymentBtn.disabled = false;
        proceedPaymentBtn.style.opacity = '1';
        proceedPaymentBtn.style.cursor = 'pointer';
    });
});

// Procesar pago
proceedPaymentBtn.addEventListener('click', () => {
    if (!selectedPaymentMethod) return;
    
    // Animación de carga
    proceedPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    proceedPaymentBtn.style.background = '#ccc';
    
    // Simular procesamiento de pago
    setTimeout(() => {
        if (selectedPaymentMethod === 'card') {
            alert('¡Pago con tarjeta procesado con éxito! Redirigiendo...');
        } else {
            alert('¡Pedido registrado para pago en efectivo! Mostrando detalles...');
        }
        closeModal();
        resetProceedButton();
    }, 2000);
});

// Resetear botón de proceder
function resetProceedButton() {
    proceedPaymentBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Continuar con el pago';
    proceedPaymentBtn.style.background = 'var(--primary-color)';
}

// Resetear métodos de pago
function resetPaymentMethods() {
    paymentMethods.forEach(m => {
        m.classList.remove('selected', 'active');
    });
    selectedPaymentMethod = null;
    proceedPaymentBtn.disabled = true;
    proceedPaymentBtn.style.opacity = '0.7';
    proceedPaymentBtn.style.cursor = 'not-allowed';
}

// Cerrar modal al hacer clic fuera del contenido
paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        closeModal();
    }
});

// Inicializar botón de proceder desactivado
resetPaymentMethods();


## CSS Adicional para los efectos JavaScript:

css
/* Añadir al final de tu CSS existente */

/* Efecto de carga */
.fa-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Estado inicial del botón de proceder */
.proceed-payment:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: #ccc;
    border-color: #ccc;
}

/* Efecto de pulso para llamar la atención */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.payment-method.selected {
    animation: pulse 0.5s ease;
}

/* Íconos de métodos de pago */
.method-icon .fa-credit-card {
    color: #4a6bff;
}

.method-icon .fa-money-bill-wave {
    color: #4ab866;
}

.credit-card .method-icon .fa-credit-card,
.cash-payment .method-icon .fa-money-bill-wave {
    color: white;
}


## HTML de ejemplo para la estructura del modal:

html
<div class="payment-options">
    <div class="payment-container">
        <button class="close-btn">&times;</button>
        
        <div class="payment-header">
            <h3>Método de Pago</h3>
            <p>Selecciona cómo deseas pagar tu pedido</p>
        </div>
        
        <div class="payment-methods">
            <div class="payment-method credit-card" data-method="card">
                <div class="method-icon">
                    <i class="fas fa-credit-card"></i>
                </div>
                <div class="method-details">
                    <h4>Tarjeta de Crédito/Débito</h4>
                    <p>Pago seguro con tarjeta</p>
                </div>
            </div>
            
            <div class="payment-method cash-payment" data-method="cash">
                <div class="method-icon">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="method-details">
                    <h4>Pago en Efectivo</h4>
                    <p>Paga al recibir tu pedido</p>
                </div>
            </div>
        </div>
        
        <div class="payment-actions">
            <button class="action-btn continue-shopping">
                <i class="fas fa-arrow-left"></i> Seguir comprando
            </button>
            <button class="action-btn proceed-payment" disabled>
                <i class="fas fa-arrow-right"></i> Continuar con el pago
            </button>
        </div>
    </div>
</div>
