let selectedAmount = null;
    const amountButtons = document.querySelectorAll('.amount-btn');
    const donateLink = document.getElementById('donate-link');

    // Donation amount selection
    function selectAmount(amount) {
      selectedAmount = amount;
      amountButtons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      donateLink.href = `upi://pay?pa=6204569353@fam&pn=TypeRacerPro&am=${amount}`;
    }

    // Theme toggle functionality
    const toggleBtn = document.getElementById('theme-toggle');
    const toggleBtnMobile = document.getElementById('theme-toggle-mobile');
    
    function toggleTheme() {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      const emoji = isDark ? '☀️' : '🌙';
      toggleBtn.textContent = emoji;
      toggleBtnMobile.textContent = emoji;
    }

    toggleBtn.onclick = toggleTheme;
    toggleBtnMobile.onclick = toggleTheme;

    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function toggleMobileMenu() {
      mobileMenuButton.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileOverlay.classList.toggle('hidden');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });

    // Close mobile menu on window resize if it's open
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });

    // Share functionality
    function shareApp() {
      if (navigator.share) {
        navigator.share({
          title: 'TypeRacer Pro',
          text: 'Check out this amazing typing game!',
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link copied to clipboard!');
        });
      }
    }

    // Modal functionality
    function toggleModal() {
      document.getElementById('modal').classList.toggle('active');
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.slide-up').forEach(el => observer.observe(el));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });