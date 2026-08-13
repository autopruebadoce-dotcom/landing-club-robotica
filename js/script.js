document.addEventListener("DOMContentLoaded", () => {

  // Año dinámico en el footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú mobile
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header con sombra al hacer scroll
  const header = document.getElementById("header");
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8
      ? "0 8px 24px -16px rgba(52, 10, 65, 0.4)"
      : "none";
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // Tarjetas "Ver más"
  document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    const extra = button.parentElement.querySelector("[data-extra]");

    button.addEventListener("click", () => {
      const isOpen = extra.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? "Ver menos" : "Ver más";
    });
  });

  // Galería (foto destacada + grilla), estilo flexiblelab.com.ar
  const fgallery = document.getElementById("fgallery");
  if (fgallery) {
    const dataEl = document.getElementById("fgalleryData");
    const photos = Array.from(dataEl.content.querySelectorAll("li")).map((li) => ({
      src: li.dataset.src,
      alt: li.dataset.alt,
    }));

    const featuredImg = document.getElementById("fgalleryFeatured");
    const grid = document.getElementById("fgalleryGrid");
    const prevBtn = document.getElementById("fgalleryPrev");
    const nextBtn = document.getElementById("fgalleryNext");
    const GRID_SIZE = 6;
    let index = 0;
    let autoplayId = null;

    function render() {
      const featured = photos[index];
      featuredImg.src = featured.src;
      featuredImg.alt = featured.alt;

      grid.innerHTML = "";
      for (let i = 1; i <= GRID_SIZE; i++) {
        const photo = photos[(index + i) % photos.length];
        const btn = document.createElement("button");
        btn.className = "fgallery__thumb";
        btn.setAttribute("aria-label", `Ver foto: ${photo.alt}`);
        btn.addEventListener("click", () => {
          index = (index + i) % photos.length;
          render();
          startAutoplay();
        });

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = "lazy";
        btn.appendChild(img);
        grid.appendChild(btn);
      }
    }

    function next() {
      index = (index + 1) % photos.length;
      render();
    }
    function prev() {
      index = (index - 1 + photos.length) % photos.length;
      render();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(next, 4000);
    }
    function stopAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
    }

    nextBtn.addEventListener("click", () => { next(); startAutoplay(); });
    prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });

    fgallery.addEventListener("mouseenter", stopAutoplay);
    fgallery.addEventListener("mouseleave", startAutoplay);
    fgallery.addEventListener("focusin", stopAutoplay);
    fgallery.addEventListener("focusout", startAutoplay);

    render();
    startAutoplay();
  }

  // Animación de aparición al hacer scroll
  const revealEls = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));

});
