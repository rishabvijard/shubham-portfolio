document.addEventListener("DOMContentLoaded", () => {
  // 1. Custom Glowing Cursor
  const cursor = document.getElementById("custom-cursor");
  const cursorDot = document.getElementById("custom-cursor-dot");
  if (cursor && cursorDot) {
    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });
  }

  // 2. 🌟 Interactive Spotlight Glow Tracker on all Cards 🌟
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // 3. Interactive Canvas Particles
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

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(194, 164, 255, 0.25)";
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

  // 4. 3D Magnetic Portrait Effect on Hero
  const portrait = document.getElementById("portrait-wrapper");
  if (portrait) {
    window.addEventListener("mousemove", (e) => {
      const rect = portrait.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / 16;
      const dy = (e.clientY - centerY) / 16;
      portrait.style.transform = `translate3d(calc(-50% + ${dx}px), ${dy}px, 0)`;
    });
    window.addEventListener("mouseleave", () => {
      portrait.style.transform = "translate3d(-50%, 0, 0)";
    });
  }

  // 5. Skills Filter
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

  // 6. Toast Notification System
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }

  // 7. Copy to Clipboard Buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text} to clipboard!`);
      });
    });
  });

  // 8. Project Details Modal
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
      <h4 style="color: #fff; margin-bottom: 0.5rem; font-size: 1rem;">Key Highlights:</h4>
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

  // 9. Contact Form AJAX Submission
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

  // 10. Back to top button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
