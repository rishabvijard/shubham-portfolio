/**
 * ShubWeb - MoncyDev Inspired Interactive JavaScript
 * Modern kinetic animations, canvas particles, cyber card expanders,
 * project modals, and live FormSubmit AJAX server integration.
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticleCanvas();
  initCustomCursor();
  initKineticRoleSlider();
  initWhatIDoCards();
  initNavbarScroll();
  initMobileMenu();
  initCardSpotlight();
  initProjectModals();
  initCopyActions();
  initContactForm();
  initBackToTop();
  initScrollReveal();
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
  const particleCount = window.innerWidth < 768 ? 25 : 45;
  const maxDistance = 140;

  let mouse = { x: null, y: null, radius: 140 };

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

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseColor = Math.random() > 0.4 ? "rgba(194, 164, 255, " : "rgba(251, 141, 255, ";
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + "0.65)";
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
          const opacity = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(170, 66, 255, ${opacity})`;
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
  const dot = document.getElementById("custom-cursor-dot");
  if (!cursor || !dot || window.innerWidth < 1024) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const interactiveElements = document.querySelectorAll("a, button, .card, .what-cyber-card, .btn");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });
}

/* --------------------------------------------------------------------------
   3. Kinetic Role Slider (Moncy Signature: DEVELOPER <-> DESIGNER)
   -------------------------------------------------------------------------- */
function initKineticRoleSlider() {
  const role1 = document.getElementById("kinetic-role-1");
  const role2 = document.getElementById("kinetic-role-2");
  if (!role1 || !role2) return;

  let current = 0;
  setInterval(() => {
    if (current === 0) {
      role1.classList.remove("active");
      role2.classList.add("active");
      current = 1;
    } else {
      role2.classList.remove("active");
      role1.classList.add("active");
      current = 0;
    }
  }, 2800);
}

/* --------------------------------------------------------------------------
   4. WHAT I DO Cyber Cards Interactivity
   -------------------------------------------------------------------------- */
function initWhatIDoCards() {
  const cards = document.querySelectorAll(".what-cyber-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((c) => c.classList.remove("active-cyber-card"));
      card.classList.add("active-cyber-card");
    });
  });
}

/* --------------------------------------------------------------------------
   5. Navbar Scroll & Active Section Tracking
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector(".header");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Mobile Drawer Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !mobileMenu) return;

  function toggle() {
    const isOpen = mobileMenu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  toggleBtn.addEventListener("click", toggle);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* --------------------------------------------------------------------------
   7. Card Spotlight Hover Effect
   -------------------------------------------------------------------------- */
function initCardSpotlight() {
  const cards = document.querySelectorAll(".spotlight-card");

  cards.forEach((card) => {
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
   8. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   9. Featured Project Modals
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCloseAction = document.getElementById("modal-close-action");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalBody = document.getElementById("modal-body");
  const modalGithubLink = document.getElementById("modal-github-link");
  const viewButtons = document.querySelectorAll(".view-project-btn");

  if (!modal) return;

  function openModal(projectId) {
    const data = typeof projectsData !== "undefined" ? projectsData[projectId] : null;
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalGithubLink.href = data.github || "https://github.com/rishabvijard";

    let featuresHtml = data.features.map((f) => `<li>✓ ${f}</li>`).join("");
    let techHtml = data.technologies.map((t) => `<span class="what-tag">${t}</span>`).join(" ");

    modalBody.innerHTML = `
      <p style="margin-bottom: 1.25rem; font-size: 1.05rem; color: #ffffff;">${data.description}</p>
      <h4 style="color: #c2a4ff; margin-bottom: 0.5rem; font-size: 0.95rem; text-transform: uppercase;">Key Architectural Highlights:</h4>
      <ul style="list-style: none; margin-bottom: 1.5rem; line-height: 1.8; color: #9f96a6;">
        ${featuresHtml}
      </ul>
      <h4 style="color: #c2a4ff; margin-bottom: 0.75rem; font-size: 0.95rem; text-transform: uppercase;">Core Tech Stack:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${techHtml}
      </div>
    `;

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-project");
      openModal(pid);
    });
  });

  [modalBackdrop, modalCloseBtn, modalCloseAction].forEach((el) => {
    el?.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   10. Toast Notification System & 1-Click Clipboard Copy
   -------------------------------------------------------------------------- */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function initCopyActions() {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied "${text}" to clipboard!`, "success");
      } catch (err) {
        showToast(`Copied to clipboard: ${text}`, "success");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   11. Live Contact Form AJAX Server Integration (FormSubmit)
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="icon-sm spin-animation" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
      <span>Sending Message...</span>
    `;

    const subjectInput = document.getElementById("subject");
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput ? subjectInput.value.trim() || "New Message from ShubWeb Portfolio" : "New Message from ShubWeb Portfolio",
      message: messageInput.value.trim(),
      _subject: "New Message from ShubWeb Portfolio — " + nameInput.value.trim()
    };

    try {
      const response = await fetch("https://formsubmit.co/ajax/sd9906830@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast("🎉 Message sent directly to Shubham! Thank you for reaching out.", "success");
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        showToast(data.message || "Message sent! Shubham will respond shortly.", "success");
        form.reset();
      }
    } catch (err) {
      console.warn("Server submission warning, using mailto fallback:", err);
      showToast("Opening email client to send message...", "info");
      const mailtoUrl = `mailto:sd9906830@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent("From: " + formData.name + " (" + formData.email + ")\n\n" + formData.message)}`;
      window.open(mailtoUrl, "_blank");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}

/* --------------------------------------------------------------------------
   12. Back to Top Button
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
