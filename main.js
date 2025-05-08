// Funcionalidades comunes a todas las páginas

// Detectar si es móvil
const isMobile = () => window.innerWidth <= 768;

// Manejar el navbar en móviles
function setupMobileNav() {
    if (!isMobile()) return;
    
    const navbar = document.querySelector('.navbar .container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navbar || !navLinks) return;
    
    // Crear botón de menú hamburguesa
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '☰';
    navbar.insertBefore(menuBtn, navLinks);
    
    // Alternar menú
    menuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Ocultar menú inicialmente en móviles
    navLinks.style.display = 'none';
}

// Inicializar funcionalidades comunes
document.addEventListener('DOMContentLoaded', function() {
    setupMobileNav();
    
    // Añadir clase active al enlace actual
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if ((currentPage === 'index.html' && linkPage === '#inicio') || 
            linkPage.includes(currentPage)) {
            link.classList.add('active');
        }
    });
});