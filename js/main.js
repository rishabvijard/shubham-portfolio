/**
 * Shubham Portfolio - Enhanced Interactive JavaScript
 * Modern animations, canvas particles, 3D tilt, spotlight, and micro-interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive modules
  initParticleCanvas();
  initCustomCursor();
  initCardSpotlight();
  init3DTilt();
  initScrollReveal();
  initTypewriter();
  initNavbar();
  initMobileMenu();
  initSkillFilters();
  initProjectModals();
  initCopyActions();
  initContactForm();
  initBackToTop();
  initTerminalCopy();
});

/* --------------------------------------------------------------------------
   1. Interactive Background Particle Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 25 : 55;
  const maxDistance = 140;

  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? "rgba(139, 92, 246, " : "rgba(6, 182, 212, ";
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ")";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Custom Glowing Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const cursorDot = document.getElementById("custom-cursor-dot");
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lerp for outer ring
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover state on links & interactive elements
  const hoverTargets = document.querySelectorAll("a, button, .card, .spotlight-card, input, textarea");
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}

/* --------------------------------------------------------------------------
   3. Aceternity-Style Spotlight Card Effect
   -------------------------------------------------------------------------- */
function initCardSpotlight() {
  const spotlightCards = document.querySelectorAll(".spotlight-card");

  spotlightCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   4. 3D Card Tilt Physics
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltElements = document.querySelectorAll(".tilt-element");

  tiltElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal IntersectionObserver
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Dynamic Typewriter Effect for Hero
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const targetElement = document.getElementById("role-dynamic");
  if (!targetElement) return;

  const phrases = [
    "modern web experiences",
    "responsive UI interfaces",
    "clean & modular code",
    "WordPress & Elementor sites",
    "interactive web apps"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   7. Sticky Navbar & Active Section Tracking
   -------------------------------------------------------------------------- */
function initNavbar() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   8. Mobile Drawer Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuToggle || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", toggleMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   9. Technical Skills Filter Tabs
   -------------------------------------------------------------------------- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.style.display = "flex";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 40);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. Interactive Project Preview Modal
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const modal = document.getElementById("project-modal");
  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close-btn");
  const closeActionBtn = document.getElementById("modal-close-action");
  const viewBtns = document.querySelectorAll(".view-project-btn");

  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalBody = document.getElementById("modal-body");

  if (!modal || !modalBody) return;

  function openProject(projectId) {
    const data = typeof projectsData !== "undefined" ? projectsData[projectId] : null;
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;

    let tagsHtml = data.tags
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join("");

    let featuresHtml = data.keyFeatures
      .map((f) => `<li>${f}</li>`)
      .join("");

    modalBody.innerHTML = `
      <div class="project-tech-tags" style="margin-bottom: 1.25rem;">
        ${tagsHtml}
      </div>

      <h4 class="modal-section-title">Project Overview</h4>
      <p>${data.overview}</p>

      <h4 class="modal-section-title">Core Architecture &amp; Features</h4>
      <ul class="modal-list">
        ${featuresHtml}
      </ul>

      <h4 class="modal-section-title">Implementation Strategy</h4>
      <p>${data.techDetails}</p>

      <h4 class="modal-section-title">Code Implementation Snippet</h4>
      <pre class="modal-code-preview"><code>${escapeHtml(data.codeSnippet)}</code></pre>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.getAttribute("data-project");
      openProject(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeActionBtn) closeActionBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* --------------------------------------------------------------------------
   11. Copy to Clipboard Actions & Toast Alerts
   -------------------------------------------------------------------------- */
function initCopyActions() {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      copyTextToClipboard(textToCopy, `Copied "${textToCopy}" to clipboard!`);
    });
  });
}

function copyTextToClipboard(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage, "success");
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    showToast(successMessage, "success");
  } catch (err) {
    showToast("Failed to copy. Please copy manually.", "error");
  }

  document.body.removeChild(textArea);
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : "ℹ"}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* --------------------------------------------------------------------------
   12. Terminal Copy Button
   -------------------------------------------------------------------------- */
function initTerminalCopy() {
  const terminalCopyBtn = document.getElementById("terminal-copy-btn");
  if (!terminalCopyBtn) return;

  terminalCopyBtn.addEventListener("click", () => {
    const codeContent = `const developer = {
  name: "Shubham",
  role: "Aspiring Frontend Developer",
  skills: ["HTML5", "CSS3", "JavaScript", "React", "WordPress", "Elementor", "REST APIs", "PHP"],
  passion: "Building responsive & interactive web apps",
  currentFocus: "Refining frontend skills & shipping projects",
  status: "Open for opportunities 🚀"
};

export default developer;`;

    copyTextToClipboard(codeContent, "Developer profile code copied to clipboard!");
  });
}

/* --------------------------------------------------------------------------
   13. Contact Form Client-Side Validation & Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("submit-btn");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  function validate() {
    let isValid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your name";
      nameInput.classList.add("input-error");
      isValid = false;
    } else {
      nameError.textContent = "";
      nameInput.classList.remove("input-error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = "Please enter your email";
      emailInput.classList.add("input-error");
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address";
      emailInput.classList.add("input-error");
      isValid = false;
    } else {
      emailError.textContent = "";
      emailInput.classList.remove("input-error");
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = "Please enter your message";
      messageInput.classList.add("input-error");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = "Message should be at least 10 characters";
      messageInput.classList.add("input-error");
      isValid = false;
    } else {
      messageError.textContent = "";
      messageInput.classList.remove("input-error");
    }

    return isValid;
  }

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      const err = document.getElementById(`${input.id}-error`);
      if (err) err.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) return;

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;

    setTimeout(() => {
      showToast("Thank you Shubham will respond to your message shortly!", "success");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   14. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

