document.addEventListener('DOMContentLoaded', function() {
    // Sistema de órdenes
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.menu-item');
            const itemName = item.querySelector('h4').textContent;
            const itemPrice = item.querySelector('.price').textContent;
            
            // Mostrar confirmación
            showOrderModal(itemName, itemPrice);
            
            // Animación de confirmación
            this.textContent = '✓';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Ordenar';
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
    
    // Función para mostrar modal de confirmación
    function showOrderModal(name, price) {
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>Has agregado <strong>${name}</strong> (${price}) a tu pedido</p>
                <button class="btn close-modal">Aceptar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Animación para los items del menú
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });
});