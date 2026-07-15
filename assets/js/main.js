/* --- Performance Optimization: TBT Reduction --- */
    // Helper to defer non-critical tasks
    const idleRun = (fn) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(fn);
      } else {
        setTimeout(fn, 1);
      }
    };

    // FAQ Accordion Toggle - Deferred
    idleRun(() => {
      document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
          const item = button.parentElement;
          const willOpen = !item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherButton = otherItem.querySelector('.faq-question');
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          });
          item.classList.toggle('active', willOpen);
          button.setAttribute('aria-expanded', String(willOpen));
        });
      });
    });

    // Load the factory video only when its section approaches the viewport.
    const factoryVideo = document.querySelector('.video-box video[data-src]');
    if (factoryVideo) {
      const loadFactoryVideo = () => {
        if (factoryVideo.dataset.loaded) return;
        factoryVideo.src = factoryVideo.dataset.src;
        factoryVideo.dataset.loaded = 'true';
        factoryVideo.load();

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mobileViewport = window.matchMedia('(max-width: 767px)').matches;
        const saveData = navigator.connection && navigator.connection.saveData;
        if (!reducedMotion && !mobileViewport && !saveData) {
          factoryVideo.play().catch(() => {});
        }
      };

      if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
          if (entries.some(entry => entry.isIntersecting)) {
            loadFactoryVideo();
            observer.disconnect();
          }
        }, { rootMargin: '300px 0px' });
        videoObserver.observe(factoryVideo);
      } else {
        factoryVideo.addEventListener('click', loadFactoryVideo, { once: true });
      }
    }

    // Fix potential ReferenceError
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const categoryDesc = document.getElementById('categoryDesc');
    const productCards = document.querySelectorAll('.product-card');

    const industryDescriptions = {
      'All': "Discover our full range of premium custom packaging solutions. From luxury rigid boxes to eco-friendly shipping mailers, we provide high-quality, factory-direct products tailored to your brand's unique needs.",
      'Perfume & Essential Oil': "Elevate your fragrance line with our specialized perfume and essential oil packaging. We offer premium rigid boxes, protective inserts, and luxury finishes designed to safeguard delicate glass bottles while projecting brand elegance.",
      'Shipping Corrugated box': "High-strength corrugated shipping solutions for e-commerce and bulk logistics. Our FSC-certified mailers and heavy-duty shipping boxes provide maximum protection with eco-friendly materials, customized to any size and weight requirement.",
      'Wig Packaging': "Designed for hair extensions and luxury wigs, our custom wig packaging features silk linings and magnetic closures. We provide foldable rigid structures to reduce shipping costs without compromising on the high-end unboxing experience.",
      'Apparel Packaging': "Sustainable and durable packaging solutions for the apparel industry. We offer FSC-certified mailers, premium shopping bags, and branded boxes designed for both retail displays and secure e-commerce shipping.",
      'Jewelry Packaging': "Exquisite jewelry boxes for watches, fine jewelry, and accessories. Our custom rigid drawer boxes and lid-and-base structures feature premium inserts like velvet or EVA foam to ensure your products are presented with elegance.",
      'Cosmetics Packaging': "Premium cosmetics packaging for makeup, skincare, and beauty tools. Our custom folding cartons and printed paper boxes offer versatile designs with luxury finishes like foil stamping and UV coating to capture customer attention.",
      'Gift Packaging': "Bespoke gift packaging for every occasion. Our high-quality gift boxes, including book-style and collapsible designs, use eco-friendly materials to provide a sustainable yet luxurious gifting solution for premium brands.",
      'Padel Packaging': "Professional custom padel racket boxes and pickleball packaging. As a specialized manufacturer, we offer high-strength corrugated mailers for e-commerce, luxury magnetic rigid boxes for premium rackets, and custom foam-insert solutions for maximum protection. Our factory provides low MOQ (100pcs) and global DDP shipping for sports brands and equipment suppliers."
    };

    let currentCategory = 'All';

    // Throttled Search/Filter to reduce CPU task duration
    let filterTimeout;
    function filterProducts() {
      clearTimeout(filterTimeout);
      filterTimeout = setTimeout(() => {
        const keyword = searchInput.value.trim().toLowerCase();
        productCards.forEach(card => {
          const category = card.dataset.category;
          const searchText = card.dataset.search.toLowerCase();
          const title = card.querySelector('h3').textContent.toLowerCase();
          const matchCategory = currentCategory === 'All' || category === currentCategory;
          const matchSearch = !keyword || searchText.includes(keyword) || title.includes(keyword);
          card.style.display = (matchCategory && matchSearch) ? 'flex' : 'none';
        });
      }, 50); // Small debounce to break long tasks
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.dataset.category;
        categoryDesc.textContent = industryDescriptions[currentCategory] || industryDescriptions['All'];
        filterProducts();
      });
    });


    searchInput.addEventListener('input', filterProducts);

    // Show confirmation after the form service redirects back to the quote section.
    const inquiryParams = new URLSearchParams(window.location.search);
    const formStatus = document.getElementById('formStatus');
    if (formStatus && inquiryParams.get('inquiry') === 'success') {
      formStatus.classList.add('show');
    }

    // Scroll to Top
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      if(window.scrollY > 500) {
        btt.classList.add('show');
      } else {
        btt.classList.remove('show');
      }
    }, { passive: true });
    btt.addEventListener('click', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

