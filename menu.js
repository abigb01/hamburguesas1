// 4. Mostrar formulario de tarjeta (versión mejorada)
function showCardPaymentForm(modal) {
    modal.querySelector('.modal-content').innerHTML = `
        <div class="card-payment-container">
            <h3>Pago con Tarjeta</h3>
            
            <div class="card-display">
                <div class="card-front">
                    <div class="card-logo">VISA</div>
                    <div class="card-number">
                        <span>•••• •••• •••• ••••</span>
                    </div>
                    <div class="card-details">
                        <div class="card-name">
                            <label>Nombre en tarjeta</label>
                            <span>NOMBRE DEL TITULAR</span>
                        </div>
                        <div class="card-expiry">
                            <label>Válido hasta</label>
                            <span>••/••</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="payment-form">
                <div class="form-group">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="1234 5678 9012 3456" class="card-number-input" required>
                </div>
                <div class="form-group">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="Como aparece en la tarjeta" class="card-name-input" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de expiración</label>
                        <input type="text" placeholder="MM/AA" class="card-expiry-input" required>
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <div class="cvv-container">
                            <input type="text" placeholder="123" class="card-cvv-input" required>
                            <i class="fas fa-question-circle" title="Los 3 dígitos en el reverso de tu tarjeta"></i>
                        </div>
                    </div>
                </div>
                
                <div class="card-message">
                    <p><i class="fas fa-lock"></i> Su pago será procesado de forma segura.</p>
                </div>
                
                <div class="modal-buttons-container">
                    <button class="btn back-btn">← Regresar</button>
                    <button class="btn confirm-payment">Confirmar Pago $${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</button>
                </div>
            </div>
        </div>`;
    
    // Eventos para actualizar la tarjeta en tiempo real
    const cardNumberInput = modal.querySelector('.card-number-input');
    const cardNameInput = modal.querySelector('.card-name-input');
    const cardExpiryInput = modal.querySelector('.card-expiry-input');
    
    cardNumberInput.addEventListener('input', function() {
        const cardDisplay = modal.querySelector('.card-number span');
        let value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        if (value === '') value = '•••• •••• •••• ••••';
        cardDisplay.textContent = value;
    });
    
    cardNameInput.addEventListener('input', function() {
        const cardDisplay = modal.querySelector('.card-name span');
        cardDisplay.textContent = this.value || 'NOMBRE DEL TITULAR';
    });
    
    cardExpiryInput.addEventListener('input', function() {
        const cardDisplay = modal.querySelector('.card-expiry span');
        let value = this.value.replace(/\//g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
        if (value === '') value = '••/••';
        cardDisplay.textContent = value;
    });
    
    modal.querySelector('.back-btn').addEventListener('click', () => showCartModal());
    modal.querySelector('.confirm-payment').addEventListener('click', () => {
        showReceiptOption(modal, 'tarjeta');
    });
}
