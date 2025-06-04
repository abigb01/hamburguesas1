document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es móvil
    const isMobile = () => window.innerWidth <= 768;
    
    // Manejar el navbar en móviles
    function setupMobileNav() {
        const navbar = document.querySelector('.navbar .container');
        const navLinks = document.querySelector('.nav-links');
        const existingMenuBtn = document.querySelector('.menu-btn');
        
        if (!navbar || !navLinks) return;
        
        // Crear botón de menú hamburguesa solo si es móvil y no existe ya
        if (isMobile() && !existingMenuBtn) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'menu-btn';
            menuBtn.innerHTML = '☰';
            menuBtn.style.cssText = `
                display: block;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 0.5rem;
            `;
            navbar.insertBefore(menuBtn, navLinks);
            
            // Alternar menú
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        
        // Si existe el botón (creado en HTML), añadir evento
        const menuBtn = document.querySelector('.menu-btn');
        if (menuBtn) {
            // Remover listeners anteriores
            menuBtn.replaceWith(menuBtn.cloneNode(true));
            const newMenuBtn = document.querySelector('.menu-btn');
            
            newMenuBtn.addEventListener('click', () => {
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
    
    // Reconfigurar en resize
    window.addEventListener('resize', () => {
        setupMobileNav();
    });
    
    // Añadir clase active al enlace actual
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if ((currentPage === 'index.html' && (linkPage === '#inicio' || linkPage === 'index.html')) || 
            (currentPage === 'menu.html' && linkPage === 'menu.html')) {
            link.classList.add('active');
        }
    });
});

// Función global para mostrar el carrito
window.showCart = function() {
    if (typeof window.showCartModal === 'function') {
        window.showCartModal();
    } else {
        console.log('Función de carrito no disponible');
    }
};