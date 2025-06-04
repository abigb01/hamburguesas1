// Funcionalidades comunes a todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es móvil
    const isMobile = () => window.innerWidth <= 768;
    
    // Manejar el navbar en móviles
    function setupMobileNav() {
        const navbar = document.querySelector('.navbar .container');
        const navLinks = document.querySelector('.nav-links');
        
        if (!navbar || !navLinks) return;
        
        // Crear botón de menú hamburguesa solo si es móvil
        if (isMobile()) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'menu-btn';
            menuBtn.innerHTML = '☰';
            navbar.insertBefore(menuBtn, navLinks);
            
            // Alternar menú
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
            
            // Ocultar menú al hacer clic en un enlace
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }
    }
    
    setupMobileNav();
    
    // Añadir clase active al enlace actual
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if ((currentPage === 'index.html' && (linkPage === '#inicio' || linkPage === 'index.html')) || 
            (currentPage === 'menu.html' && linkPage === 'menu.html')) {
            link.classList.add('active');
        }
    });
    
    // Función global para mostrar el carrito
    window.showCart = function() {
        const event = new Event('showCartEvent');
        document.dispatchEvent(event);
    };
});

// Escuchar evento para mostrar el carrito
document.addEventListener('showCartEvent', function() {
    if (typeof showCartModal === 'function') {
        showCartModal();
    }
});