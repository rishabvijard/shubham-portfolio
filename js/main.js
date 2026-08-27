document.addEventListener("DOMContentLoaded", () => {
  // 1. Custom Cursor on Desktop
  const cursor = document.getElementById("custom-cursor");
  const cursorDot = document.getElementById("custom-cursor-dot");
  if (cursor && cursorDot && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });
  }

  // 2. 3D Magnetic Portrait Face Tilt (Desktop)
  const portrait = document.getElementById("portrait-wrapper");
  const title = document.getElementById("sparkle-title");

  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      if (portrait && window.innerWidth > 768) {
        portrait.style.transform = `translateX(calc(-50% + ${x * 20}px)) translateY(${y * 14}px) rotate(${x * 3}deg)`;
      }
      if (title) {
        title.style.transform = `translateX(${x * 8}px) translateY(${y * 4}px)`;
      }
    });
  }

  // 3. Mobile Hamburger Toggle
  const hamburger = document.getElementById("nav-hamburger");
  const drawer = document.getElementById("mobile-nav-drawer");
  const drawerLinks = document.querySelectorAll(".mobile-nav-link");

  if (hamburger && drawer) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("is-active");
      drawer.classList.toggle("is-open");
      document.body.style.overflow = drawer.classList.contains("is-open") ? "hidden" : "auto";
    });

    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("is-active");
        drawer.classList.remove("is-open");
        document.body.style.overflow = "auto";
      });
    });
  }

  // 4. Spotlight Hover Gradient Tracker
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // 🌟 5. TRUE FREE-SPINNING INERTIA WHEEL ON CORE TECHNOLOGIES 🌟
  const techWrapper = document.getElementById("tech-spinner-wrapper");
  const techTrack = document.getElementById("tech-spinner-track");
  if (techWrapper && techTrack) {
    let isDown = false;
    let startX = 0;
    let currentX = 0;
    let velocity = -1.2; // default auto-drift speed

    techWrapper.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX;
      velocity = 0;
    });

    window.addEventListener("mouseup", () => {
      if (isDown) isDown = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const delta = (x - startX) * 1.6;
      currentX += delta;
      velocity = delta * 0.8;
      startX = x;
      techTrack.style.transform = `translateX(${currentX}px)`;
    });

    // Touch support for mobile
    techWrapper.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX;
      velocity = 0;
    });

    window.addEventListener("touchend", () => {
      if (isDown) isDown = false;
    });

    techWrapper.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX;
      const delta = (x - startX) * 1.6;
      currentX += delta;
      velocity = delta * 0.8;
      startX = x;
      techTrack.style.transform = `translateX(${currentX}px)`;
    });

    // Inertia physics loop
    function animateTechSpinner() {
      if (!isDown) {
        currentX += velocity;
        velocity *= 0.96; // friction
        if (Math.abs(velocity) < 0.6) {
          velocity = -0.8; // smooth endless auto drift
        }
        // Infinite wrap-around bounds
        const halfWidth = techTrack.scrollWidth / 2;
        if (currentX < -halfWidth) currentX += halfWidth;
        if (currentX > 0) currentX -= halfWidth;

        techTrack.style.transform = `translateX(${currentX}px)`;
      }
      requestAnimationFrame(animateTechSpinner);
    }
    animateTechSpinner();
  }

  // 🌟 6. 3D CYLINDRICAL FREE-SPIN CAROUSEL FOR PROJECTS 🌟
  const turntable = document.getElementById("project-3d-turntable");
  const stage = document.getElementById("project-3d-stage");
  if (turntable && stage) {
    let isDragging3D = false;
    let startMouseX = 0;
    let currentRotationY = 0;
    let spinVelocity = 0;

    stage.addEventListener("mousedown", (e) => {
      isDragging3D = true;
      startMouseX = e.clientX;
      spinVelocity = 0;
    });

    window.addEventListener("mouseup", () => {
      if (isDragging3D) isDragging3D = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging3D) return;
      const delta = e.clientX - startMouseX;
      currentRotationY += delta * 0.35;
      spinVelocity = delta * 0.35;
      startMouseX = e.clientX;
      turntable.style.transform = `rotateY(${currentRotationY}deg)`;
    });

    // Touch support for phone
    stage.addEventListener("touchstart", (e) => {
      isDragging3D = true;
      startMouseX = e.touches[0].clientX;
      spinVelocity = 0;
    });

    window.addEventListener("touchend", () => {
      if (isDragging3D) isDragging3D = false;
    });

    stage.addEventListener("touchmove", (e) => {
      if (!isDragging3D) return;
      const delta = e.touches[0].clientX - startMouseX;
      currentRotationY += delta * 0.35;
      spinVelocity = delta * 0.35;
      startMouseX = e.touches[0].clientX;
      turntable.style.transform = `rotateY(${currentRotationY}deg)`;
    });

    // Inertia physics loop for 3D turntable
    function animate3DTurntable() {
      if (!isDragging3D) {
        currentRotationY += spinVelocity;
        spinVelocity *= 0.94; // friction
        if (Math.abs(spinVelocity) < 0.05) {
          spinVelocity = 0;
        }
        turntable.style.transform = `rotateY(${currentRotationY}deg)`;
      }
      requestAnimationFrame(animate3DTurntable);
    }
    animate3DTurntable();
  }

  // 7. Particle Canvas Background
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 768 ? 20 : 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(194, 164, 255, 0.2)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // 8. Skills Filter
  const filterBtns = document.querySelectorAll(".skill-filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      skillCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 9. Toast Notification
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }

  // 10. Copy to Clipboard
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text} to clipboard!`);
      });
    });
  });

  // 11. Modal Dialog
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCloseAction = document.getElementById("modal-close-action");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalBody = document.getElementById("modal-body");

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !modal) return;
    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalBody.innerHTML = `
      <p style="margin-bottom: 1rem;">${data.desc}</p>
      <h4 style="color: #fff; margin-bottom: 0.5rem; font-size: 1rem; font-family: var(--font-hero);">Key Features:</h4>
      <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1.25rem;">
        ${data.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
        ${data.tech.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    `;
    modal.classList.add("is-open");
  }

  function closeModal() { if (modal) modal.classList.remove("is-open"); }

  document.querySelectorAll(".view-project-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn.getAttribute("data-project"));
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // 12. Contact Form AJAX Submission
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById("submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const formData = new FormData(form);
      try {
        const res = await fetch("https://formsubmit.co/ajax/sd9906830@gmail.com", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        if (res.ok) {
          showToast("Message sent successfully to Shubham!");
          form.reset();
          submitBtn.textContent = "Message Sent! ✓";
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
          }, 4000);
        } else {
          showToast("Failed to send. Please email directly.");
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
      } catch (err) {
        showToast("Error sending message. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }

  // 13. Back to Top
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
