document.addEventListener('DOMContentLoaded', function() {
 
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para el navbar fijo
                    behavior: 'smooth'
                });
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    document.querySelectorAll('.menu-item .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemName = this.closest('.menu-item').querySelector('h3').textContent;
            alert(Has añadido ${itemName} a tu pedido!);
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }
});