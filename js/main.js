document.addEventListener("DOMContentLoaded", () => {
  // 🎯 1. CUSTOM CURSOR & SPARKLING PARTICLE TRAIL 🎯
  const follower = document.getElementById("cursor-follower");
  const dot = document.getElementById("cursor-dot");
  const cursorSparks = [];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      for (let i = 0; i < 2; i++) {
        cursorSparks.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4 - 0.3,
          size: Math.random() * 2.2 + 1,
          alpha: 0.75,
          decay: Math.random() * 0.035 + 0.02,
          color: Math.random() > 0.4 ? "rgba(229, 192, 123, " : "rgba(251, 141, 255, "
        });
      }
    });

    if (follower && dot) {
      function renderCursor() {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        dotX += (mouseX - dotX) * 0.75;
        dotY += (mouseY - dotY) * 0.75;

        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
      }
      renderCursor();

      const interactiveElements = document.querySelectorAll("a, button, .skill-coverflow-card, .coverflow-card-item, .card");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => follower.classList.add("is-hovering"));
        el.addEventListener("mouseleave", () => follower.classList.remove("is-hovering"));
      });
    }
  }

  // 🌟 2. ULTRA-DENSE (50 RINGS) + SUBTLE LINE LUMINANCE 🌟
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, centerX, centerY;
    let smoothScrollY = window.pageYOffset;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height * 0.48;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawOctagon(cx, cy, rx, ry) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    const tunnelStars = [];
    const starCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < starCount; i++) {
      tunnelStars.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        baseZ: Math.random() * 1200 + 40,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    function renderTunnel() {
      // Moves strictly with scroll
      const targetScrollY = window.pageYOffset;
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Deep Subtle Glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.max(width, height) * 0.45);
      gradient.addColorStop(0, "rgba(229, 192, 123, 0.05)");
      gradient.addColorStop(0.35, "rgba(229, 192, 123, 0.015)");
      gradient.addColorStop(0.7, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 16 High-Density Perspective Diagonal Rays
      const maxRadius = Math.max(width, height) * 1.25;
      ctx.save();
      ctx.strokeStyle = "rgba(229, 192, 123, 0.10)";
      ctx.lineWidth = 0.55;
      for (let a = 0; a < 16; a++) {
        const angle = (a * Math.PI) / 8;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * 6 * 1.58, centerY + Math.sin(angle) * 6);
        ctx.lineTo(centerX + Math.cos(angle) * maxRadius * 1.58, centerY + Math.sin(angle) * maxRadius);
        ctx.stroke();
      }
      ctx.restore();

      // 🌟 ULTRA-DENSE 50 CONCENTRIC RINGS (GENTLE 0.03 - 0.16 ALPHA) 🌟
      const numRings = 50;
      const ringSpacing = 24;
      const totalDepth = numRings * ringSpacing;
      const scrollOffset = (smoothScrollY * 0.4) % totalDepth;

      for (let i = 0; i < numRings; i++) {
        let ringDist = (i * ringSpacing + scrollOffset) % totalDepth;
        if (ringDist < 0) ringDist += totalDepth;

        let progress = ringDist / totalDepth;
        let scale = Math.pow(progress, 2.0);
        let rx = scale * (width * 0.98);
        let ry = scale * (height * 0.92);

        if (rx > 3 && ry > 2) {
          let alpha = Math.sin(progress * Math.PI);
          // Delicate alpha from 0.03 to 0.15 max
          alpha = Math.max(0.03, alpha * 0.15);

          ctx.save();
          ctx.strokeStyle = `rgba(229, 192, 123, ${alpha})`;
          ctx.lineWidth = 0.6;
          drawOctagon(centerX, centerY, rx, ry);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Subtle Stardust
      tunnelStars.forEach((star) => {
        let z = (star.baseZ - (smoothScrollY * 0.35)) % 1200;
        if (z < 10) z += 1200;

        const k = 450 / z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * k * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 192, 123, ${star.alpha * Math.min(0.5, k * 0.4)})`;
          ctx.fill();
        }
      });

      // Cursor sparks
      for (let i = cursorSparks.length - 1; i >= 0; i--) {
        const s = cursorSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.size *= 0.96;

        if (s.alpha <= 0 || s.size <= 0.2) {
          cursorSparks.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${s.alpha})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = s.color + "0.4)";
          ctx.fill();
        }
      }

      requestAnimationFrame(renderTunnel);
    }
    renderTunnel();
  }

  // 3. 3D Magnetic Portrait Face Tilt
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

  // 4. Mobile Hamburger Toggle
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

  // 5. Spotlight Hover Gradient Tracker
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // 🌟 6. SKILLS 3D COVERFLOW 🌟
  const skillsViewport = document.getElementById("skills-coverflow-viewport");
  const skillsTrack = document.getElementById("skills-coverflow-track");
  if (skillsViewport && skillsTrack) {
    const skillCards = skillsTrack.querySelectorAll(".skill-coverflow-card");
    let isDraggingSkills = false;
    let startX = 0;
    let currentOffset = -100;
    let velocity = -0.6;

    skillsViewport.addEventListener("mousedown", (e) => {
      isDraggingSkills = true;
      startX = e.pageX;
      velocity = 0;
    });
    window.addEventListener("mouseup", () => { if (isDraggingSkills) isDraggingSkills = false; });
    skillsViewport.addEventListener("mouseleave", () => { if (isDraggingSkills) isDraggingSkills = false; });
    window.addEventListener("mousemove", (e) => {
      if (!isDraggingSkills) return;
      e.preventDefault();
      const x = e.pageX;
      const delta = (x - startX) * 1.4;
      currentOffset += delta;
      velocity = delta * 0.65;
      startX = x;
    });

    skillsViewport.addEventListener("touchstart", (e) => {
      isDraggingSkills = true;
      startX = e.touches[0].pageX;
      velocity = 0;
    });
    window.addEventListener("touchend", () => { if (isDraggingSkills) isDraggingSkills = false; });
    skillsViewport.addEventListener("touchmove", (e) => {
      if (!isDraggingSkills) return;
      const x = e.touches[0].pageX;
      const delta = (x - startX) * 1.4;
      currentOffset += delta;
      velocity = delta * 0.65;
      startX = x;
    });

    function updateSkillsCoverflow() {
      if (!isDraggingSkills) {
        currentOffset += velocity;
        velocity *= 0.95;
        if (Math.abs(velocity) < 0.3) {
          velocity = -0.55;
        }
        const halfWidth = skillsTrack.scrollWidth / 2;
        if (currentOffset < -halfWidth) currentOffset += halfWidth;
        if (currentOffset > 0) currentOffset -= halfWidth;
      }

      skillsTrack.style.transform = `translateX(${currentOffset}px)`;

      const viewportCenter = window.innerWidth / 2;
      skillCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distFromCenter = (cardCenter - viewportCenter) / (window.innerWidth * 0.36);
        const clampedDist = Math.max(-1.5, Math.min(1.5, distFromCenter));
        const absDist = Math.abs(clampedDist);

        const scale = 0.86 + (absDist * 0.16);
        const translateZ = (absDist * 40) - 35;
        const rotateY = clampedDist * -20;
        const opacity = Math.max(0.6, 1 - absDist * 0.15);

        card.style.transform = `perspective(1400px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
        card.style.opacity = opacity;
      });

      requestAnimationFrame(updateSkillsCoverflow);
    }
    updateSkillsCoverflow();
  }

  // 🌟 7. PROJECTS 3D COVERFLOW ENGINE 🌟
  const projViewport = document.getElementById("coverflow-viewport");
  const projTrack = document.getElementById("coverflow-track");
  if (projViewport && projTrack) {
    const projCards = projTrack.querySelectorAll(".coverflow-card-item");
    let isDraggingProj = false;
    let startX = 0;
    let currentOffset = -100;
    let velocity = -0.6;

    projViewport.addEventListener("mousedown", (e) => {
      isDraggingProj = true;
      startX = e.pageX;
      velocity = 0;
    });
    window.addEventListener("mouseup", () => { if (isDraggingProj) isDraggingProj = false; });
    projViewport.addEventListener("mouseleave", () => { if (isDraggingProj) isDraggingProj = false; });
    window.addEventListener("mousemove", (e) => {
      if (!isDraggingProj) return;
      e.preventDefault();
      const x = e.pageX;
      const delta = (x - startX) * 1.4;
      currentOffset += delta;
      velocity = delta * 0.65;
      startX = x;
    });

    projViewport.addEventListener("touchstart", (e) => {
      isDraggingProj = true;
      startX = e.touches[0].pageX;
      velocity = 0;
    });
    window.addEventListener("touchend", () => { if (isDraggingProj) isDraggingProj = false; });
    projViewport.addEventListener("touchmove", (e) => {
      if (!isDraggingProj) return;
      const x = e.touches[0].pageX;
      const delta = (x - startX) * 1.4;
      currentOffset += delta;
      velocity = delta * 0.65;
      startX = x;
    });

    function updateProjCoverflow() {
      if (!isDraggingProj) {
        currentOffset += velocity;
        velocity *= 0.95;
        if (Math.abs(velocity) < 0.3) {
          velocity = -0.55;
        }
        const halfWidth = projTrack.scrollWidth / 2;
        if (currentOffset < -halfWidth) currentOffset += halfWidth;
        if (currentOffset > 0) currentOffset -= halfWidth;
      }

      projTrack.style.transform = `translateX(${currentOffset}px)`;

      const viewportCenter = window.innerWidth / 2;
      projCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distFromCenter = (cardCenter - viewportCenter) / (window.innerWidth * 0.38);
        const clampedDist = Math.max(-1.5, Math.min(1.5, distFromCenter));
        const absDist = Math.abs(clampedDist);

        const rotateY = clampedDist * -20;
        const translateZ = -absDist * 50;
        const scale = Math.max(0.85, 1 - absDist * 0.08);
        const opacity = Math.max(0.5, 1 - absDist * 0.22);

        card.style.transform = `perspective(1400px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
        card.style.opacity = opacity;
      });

      requestAnimationFrame(updateProjCoverflow);
    }
    updateProjCoverflow();
  }

  // 8. Toast Notification
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }

  // 9. Copy to Clipboard
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text} to clipboard!`);
      });
    });
  });

  // 10. Modal Dialog
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
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(btn.getAttribute("data-project"));
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // 11. Contact Form AJAX Submission
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

  // 12. Back to Top
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});