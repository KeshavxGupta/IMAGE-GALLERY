document.addEventListener("DOMContentLoaded", () => {
    
    // ---- 0. Preloader Logic ----
    const preloader = document.getElementById('global-preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Slight delay to ensure the feeling of a premium load
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 800); 
        });
    }

    // ---- 1. Custom Cursor Logic ----
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Un-delayed follow
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Slightly delayed follow via animate (smooth tracking)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Overrides (Links, Buttons, Images)
        const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .image-grid img, .masonry-item img, input, .HoverExpand');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover-state');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover-state');
            });
        });
    }

    // ---- 2. Hide/Show Nav on scroll (Smart Nav) ----
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.minimal-nav');

    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                nav.classList.add('header-scrolled');
                
                // Hide if scrolling down, show if scrolling up
                if (window.scrollY > lastScrollY) {
                    nav.classList.add('header-hidden');
                } else {
                    nav.classList.remove('header-hidden');
                }
            } else {
                nav.classList.remove('header-scrolled');
                nav.classList.remove('header-hidden');
            }
            lastScrollY = window.scrollY;
        });
    }

    // ---- 3. Reveal Elements on Scroll ----
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ---- 4. Magnetic Buttons Logic ----
    const magnets = document.querySelectorAll('.magnetic-wrap');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', function(e) {
            const btn = magnet.querySelector('.magnetic-btn');
            const bounding = magnet.getBoundingClientRect();
            // Calculate mouse position relative to center of the magnet wrap
            const mx = e.clientX - bounding.left - bounding.width / 2;
            const my = e.clientY - bounding.top - bounding.height / 2;
            
            // Move the inner button smoothly
            if (btn) {
                btn.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
            }
        });

        magnet.addEventListener('mouseleave', function(e) {
            const btn = magnet.querySelector('.magnetic-btn');
            // Reset to center
            if (btn) {
                btn.style.transform = `translate(0px, 0px)`;
                btn.style.transition = `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
            }
        });
        
        magnet.addEventListener('mouseenter', function(e) {
            const btn = magnet.querySelector('.magnetic-btn');
            // Remove transition for raw JS tracking
            if (btn) {
                btn.style.transition = `none`;
            }
        });
    });


    // ---- 5. Basic Authentication Logic ----
    const loginButton = document.querySelector(".login-button");
    const userIconContainer = document.querySelector(".user-icon");
    const logoutButton = document.getElementById("logout-button");
  
    const updateAuthUI = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (loginButton) {
          // Find closest magnetic wrap if it exists
          if (loginButton.closest('.buttons')) {
              loginButton.closest('.buttons').querySelector('.login-btn-wrap').style.display = isLoggedIn ? "none" : "block";
          }
      }
      if (userIconContainer) {
          userIconContainer.style.display = isLoggedIn ? "flex" : "none";
      }
    };
  
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.clear();
        updateAuthUI();
        window.location.href = "./login.html";
      });
    }
  
    // Initialize Auth UI
    updateAuthUI();

});
