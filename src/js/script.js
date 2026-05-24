// LOJA GAMER - FIAP Checkpoint 3
// Script principal com interações dinâmicas

document.addEventListener('DOMContentLoaded', function() {
  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // ===== MOBILE MENU TOGGLE =====
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    const isOpen = navMenu?.classList.contains('active');
    mobileToggle.innerHTML = isOpen ? '✕' : '☰';
  });

  // Fechar menu ao clicar em link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      if (mobileToggle) mobileToggle.innerHTML = '☰';
    });
  });

  // ===== ANIMAÇÃO FADE IN ON SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // ===== CONTADOR ANIMADO (HERO STATS) =====
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toLocaleString('pt-BR');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toLocaleString('pt-BR');
      }
    }, 16);
  }

  // Iniciar contadores quando visíveis
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        entry.target.dataset.animated = 'true';
      }
    });
  });

  document.querySelectorAll('[data-target]').forEach(el => {
    statsObserver.observe(el);
  });

  // ===== CARRINHO SIMULADO =====
  let cartCount = 0;
  const cartButtons = document.querySelectorAll('.btn-add');
  
  cartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Animação do botão
      this.style.transform = 'rotate(180deg) scale(1.2)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
      
      // Incrementar contador
      cartCount++;
      updateCartBadge();
      
      // Feedback visual
      showNotification('Produto adicionado ao carrinho!', 'success');
      
      // Efeito de partículas
      createParticles(this);
    });
  });

  function updateCartBadge() {
    let badge = document.querySelector('.cart-badge');
    if (!badge) {
      const cartLink = document.querySelector('.nav-cta');
      if (cartLink) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.style.cssText = `
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ec4899;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        `;
        cartLink.style.position = 'relative';
        cartLink.appendChild(badge);
      }
    }
    if (badge) {
      badge.textContent = cartCount;
      badge.style.animation = 'none';
      setTimeout(() => {
        badge.style.animation = 'pulse 0.5s';
      }, 10);
    }
  }

  // ===== NOTIFICAÇÕES =====
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div style="
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(26, 26, 36, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(139, 92, 246, 0.5);
        border-left: 4px solid ${type === 'success' ? '#10b981' : '#8b5cf6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 300px;
        animation: slideIn 0.3s ease;
        font-weight: 500;
      ">
        <span style="font-size: 1.25rem;">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Adicionar keyframes para notificações
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ===== PARTÍCULAS NO CLIQUE =====
  function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 6px;
        height: 6px;
        background: #8b5cf6;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (i / 8) * Math.PI * 2;
      const velocity = 50 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let x = 0, y = 0, opacity = 1;
      
      const animate = () => {
        x += vx * 0.02;
        y += vy * 0.02;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }
});
    