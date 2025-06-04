document.addEventListener('DOMContentLoaded', function() {
    // ========== VARIABLES GLOBALES ==========
    let cart = JSON.parse(localStorage.getItem('burgerMasterCart')) || [];
    const { jsPDF } = window.jspdf;
    
    // Inicializar el contador del carrito
    updateCartCounter();

    // ========== EVENTOS PRINCIPALES ==========
    // Botones "Ordenar"
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.menu-item');
            const itemName = item.querySelector('h4').textContent;
            const itemPrice = parsePrice(item.querySelector('.price').textContent);
            const itemImage = item.querySelector('img').src;
            
            showOptionsModal(itemName, itemPrice, itemImage);
        });
    });

    // Mostrar carrito al hacer clic en el ícono
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.addEventListener('click', showCartModal);
    }

    // ========== FUNCIONES PRINCIPALES ==========
    function parsePrice(priceStr) {
        return parseFloat(priceStr.replace(/[^\d.]/g, ''));
    }

    function showOptionsModal(name, price, image) {
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${image}" alt="${name}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
                <h3>${name}</h3>
                <p class="price">$${price.toFixed(2)} mx</p>
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
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.add-to-cart').addEventListener('click', () => {
            const quantity = parseInt(modal.querySelector('.quantity').value);
            if(quantity < 1 || isNaN(quantity)) {
                alert('Por favor ingresa una cantidad válida');
                return;
            }
            addToCart(name, price, quantity, image);
            modal.remove();
            showCartModal();
        });
    }

    function addToCart(name, price, quantity, image) {
        // Buscar si el artículo ya está en el carrito
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                name,
                price,
                quantity,
                image
            });
        }
        
        // Actualizar localStorage y contador
        localStorage.setItem('burgerMasterCart', JSON.stringify(cart));
        updateCartCounter();
    }

    function updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartCounter.textContent = `🛒 ${totalItems} | $${totalPrice.toFixed(2)}`;
        }
    }

    function showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        
        // Generar HTML del carrito
        let cartHTML = '<div class="modal-content" style="max-width: 600px;">';
        cartHTML += '<h2>Tu Carrito</h2>';
        
        if (cart.length === 0) {
            cartHTML += '<p>Tu carrito está vacío</p>';
        } else {
            cartHTML += '<div class="cart-items">';
            
            cart.forEach((item, index) => {
                cartHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">
                        <div style="flex-grow:1; margin-left:15px;">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button class="btn remove-item" data-index="${index}" style="background:#ff6b6b;">Eliminar</button>
                    </div>`;
            });
            
            cartHTML += '</div>';
            
            // Total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartHTML += `<div class="cart-total" style="margin-top:20px; padding-top:20px; border-top:1px solid #eee;">
                            <h3>Total: $${total.toFixed(2)}</h3>
                          </div>`;
            
            // Botones
            cartHTML += `<div class="modal-buttons" style="margin-top:20px;">
                            <button class="btn cancel-btn">Seguir Comprando</button>
                            <button class="btn checkout-btn" style="background:var(--primary-color);">Pagar</button>
                        </div>`;
        }
        
        cartHTML += '</div>';
        modal.innerHTML = cartHTML;
        
        document.body.appendChild(modal);
        
        // Eventos del modal del carrito
        modal.querySelector('.cancel-btn')?.addEventListener('click', () => modal.remove());
        
        // Eliminar items
        modal.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('burgerMasterCart', JSON.stringify(cart));
                updateCartCounter();
                modal.remove();
                showCartModal();
            });
        });
        
        // Pagar
        modal.querySelector('.checkout-btn')?.addEventListener('click', () => {
            modal.remove();
            showPaymentOptions();
        });
    }

    function showPaymentOptions() {
        const modal = document.createElement('div');
        modal.className = 'payment-options';
        
        modal.innerHTML = `
            <div class="payment-container">
                <div class="payment-header">
                    <h3>Método de Pago</h3>
                    <p>Selecciona cómo deseas pagar</p>
                </div>
                
                <div class="payment-methods">
                    <div class="payment-method credit-card">
                        <div class="method-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="method-details">
                            <h4>Tarjeta de Crédito/Débito</h4>
                            <p>Pago seguro con tarjeta</p>
                        </div>
                    </div>
                    
                    <div class="payment-method cash-payment">
                        <div class="method-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="method-details">
                            <h4>Efectivo</h4>
                            <p>Paga al recibir tu pedido</p>
                        </div>
                    </div>
                </div>
                
                <div class="payment-actions">
                    <button class="action-btn continue-shopping">
                        <i class="fas fa-arrow-left"></i> Seguir Comprando
                    </button>
                    <button class="action-btn proceed-payment">
                        Continuar <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>`;
        
        document.body.appendChild(modal);
        
        // Eventos del modal de pago
        modal.querySelector('.continue-shopping').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.proceed-payment').addEventListener('click', () => {
            modal.remove();
            completeOrder();
        });
    }

    function completeOrder() {
        // Aquí iría la lógica para procesar el pago
        // Por ahora solo mostramos un mensaje de éxito
        
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>¡Pedido Completado!</h2>
                <p>Gracias por tu compra. Tu pedido ha sido recibido y está siendo preparado.</p>
                <button class="btn cancel-btn" style="margin-top:20px;">Cerrar</button>
            </div>`;
        
        document.body.appendChild(modal);
        
        // Vaciar el carrito
        cart = [];
        localStorage.setItem('burgerMasterCart', JSON.stringify(cart));
        updateCartCounter();
        
        // Evento para cerrar el modal
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        // Opcional: Mostrar confeti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
});

// Función global para mostrar el carrito desde cualquier lugar
window.showCart = function() {
    const event = new Event('showCartEvent');
    document.dispatchEvent(event);
};

// Escuchar evento para mostrar el carrito
document.addEventListener('showCartEvent', function() {
    if (typeof showCartModal === 'function') {
        showCartModal();
    }
});