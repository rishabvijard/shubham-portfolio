document.addEventListener("DOMContentLoaded", () => {
  // 🎯 1. CUSTOM CURSOR & SPARKS 🎯
  const follower = document.getElementById("cursor-follower");
  const dot = document.getElementById("cursor-dot");
  const cursorSparks = [];
  let isCursorActive = false;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;
  let lastSparkTime = 0;

  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorActive) {
        isCursorActive = true;
        requestAnimationFrame(renderCursor);
      }

      const now = performance.now();
      if (now - lastSparkTime > 25 && cursorSparks.length < 18) {
        lastSparkTime = now;
        cursorSparks.push({
          x: mouseX + (Math.random() - 0.5) * 4,
          y: mouseY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.3,
          size: Math.random() * 2 + 1,
          alpha: 0.75,
          decay: Math.random() * 0.04 + 0.025,
          color: Math.random() > 0.4 ? "rgba(229, 192, 123, " : "rgba(251, 141, 255, "
        });
      }
    }, { passive: true });

    function renderCursor() {
      const distF = Math.abs(mouseX - followerX) + Math.abs(mouseY - followerY);
      const distD = Math.abs(mouseX - dotX) + Math.abs(mouseY - dotY);

      if (distF > 0.1 || distD > 0.1) {
        followerX += (mouseX - followerX) * 0.22;
        followerY += (mouseY - followerY) * 0.22;
        dotX += (mouseX - dotX) * 0.85;
        dotY += (mouseY - dotY) * 0.85;

        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
      } else {
        isCursorActive = false;
      }
    }

    const interactiveElements = document.querySelectorAll("a, button, .skill-coverflow-card, .coverflow-card-item, .card");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => follower.classList.add("is-hovering"), { passive: true });
      el.addEventListener("mouseleave", () => follower.classList.remove("is-hovering"), { passive: true });
    });
  }

  // 🌟 2. FAST CANVAS (SCROLL-REACTIVE TUNNEL) 🌟
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let width, height, centerX, centerY;
    let smoothScrollY = window.pageYOffset;
    let isCanvasRunning = false;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height * 0.48;
      requestCanvasFrame();
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

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
    const starCount = window.innerWidth < 768 ? 25 : 45;
    for (let i = 0; i < starCount; i++) {
      tunnelStars.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        baseZ: Math.random() * 1200 + 40,
        size: Math.random() * 1.3 + 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    function renderTunnel() {
      const targetScrollY = window.pageYOffset;
      const scrollDiff = targetScrollY - smoothScrollY;
      smoothScrollY += scrollDiff * 0.14;

      ctx.clearRect(0, 0, width, height);

      // Deep Subtle Glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.max(width, height) * 0.45);
      gradient.addColorStop(0, "rgba(229, 192, 123, 0.05)");
      gradient.addColorStop(0.35, "rgba(229, 192, 123, 0.015)");
      gradient.addColorStop(0.7, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 16 Perspective Rays
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

      // 50 Concentric Rings
      const numRings = 50;
      const ringSpacing = 24;
      const totalDepth = numRings * ringSpacing;
      const scrollOffset = (smoothScrollY * 0.4) % totalDepth;

      ctx.save();
      ctx.lineWidth = 0.6;
      for (let i = 0; i < numRings; i++) {
        let ringDist = (i * ringSpacing + scrollOffset) % totalDepth;
        if (ringDist < 0) ringDist += totalDepth;

        let progress = ringDist / totalDepth;
        let scale = progress * progress;
        let rx = scale * (width * 0.98);
        let ry = scale * (height * 0.92);

        if (rx > 3 && ry > 2) {
          let alpha = Math.sin(progress * Math.PI) * 0.15;
          if (alpha > 0.02) {
            ctx.strokeStyle = `rgba(229, 192, 123, ${alpha})`;
            drawOctagon(centerX, centerY, rx, ry);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Stardust
      for (let i = 0; i < tunnelStars.length; i++) {
        const star = tunnelStars[i];
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
      }

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
          ctx.fill();
        }
      }

      if (Math.abs(scrollDiff) > 0.1 || cursorSparks.length > 0) {
        requestAnimationFrame(renderTunnel);
      } else {
        isCanvasRunning = false;
      }
    }

    function requestCanvasFrame() {
      if (!isCanvasRunning) {
        isCanvasRunning = true;
        requestAnimationFrame(renderTunnel);
      }
    }

    window.addEventListener("scroll", requestCanvasFrame, { passive: true });
    requestCanvasFrame();
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
        portrait.style.transform = `translateX(calc(-50% + ${x * 16}px)) translateY(${y * 10}px) rotate(${x * 2.5}deg)`;
      }
      if (title) {
        title.style.transform = `translateX(${x * 6}px) translateY(${y * 3}px)`;
      }
    }, { passive: true });
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

  // 5. Spotlight Hover Tracker
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, { passive: true });
  });

  // 🌟 TRUE MATHEMATICAL MODULO FUNCTION 🌟
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  // 🌟 6 & 7. CLEAN NON-OVERLAPPING 3D AMPHITHEATER PERSPECTIVE ENGINE 🌟
  function initCleanAmphitheater({
    viewportId,
    trackId,
    cardSelector,
    defaultCardWidth = 260,
    gap = 55
  }) {
    const viewport = document.getElementById(viewportId);
    const track = document.getElementById(trackId);
    if (!viewport || !track) return;

    const cards = Array.from(track.querySelectorAll(cardSelector));
    const totalCards = cards.length;
    if (!totalCards) return;

    let isDragging = false;
    let startX = 0;
    let velocity = 0;
    let currentOffset = 0;
    let isLoopRunning = false;

    let cardWidth = cards[0].offsetWidth || defaultCardWidth;
    let stride = cardWidth + gap;
    let totalOrbitWidth = totalCards * stride;

    function updateMetrics() {
      cardWidth = cards[0].offsetWidth || defaultCardWidth;
      stride = cardWidth + gap;
      totalOrbitWidth = totalCards * stride;
    }

    function renderFrame() {
      const viewportCenter = window.innerWidth / 2;
      const centerFactor = Math.max(280, window.innerWidth * 0.36);
      const halfOrbit = totalOrbitWidth / 2;

      for (let i = 0; i < totalCards; i++) {
        const card = cards[i];
        const pos = mod(i * stride + currentOffset, totalOrbitWidth);
        const distFromCenter = pos - halfOrbit;

        const screenX = viewportCenter + distFromCenter - (cardWidth / 2);
        const normDist = distFromCenter / centerFactor;
        const clampedNorm = Math.max(-1.7, Math.min(1.7, normDist));
        const absNorm = Math.abs(clampedNorm);

        // 🌟 CLEAN BALANCED SCALE: 0.78 (Center) -> 1.18 (Edges) with ZERO OVERLAP 🌟
        const scale = 0.78 + (absNorm * 0.32);
        const translateZ = -90 + (absNorm * 125);
        const rotateY = clampedNorm * -22;
        const opacity = Math.min(1.0, 0.75 + absNorm * 0.2);

        card.style.transform = `translate3d(${screenX}px, 0, 0) perspective(1400px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
        card.style.opacity = opacity;
      }
    }

    function step() {
      if (!isDragging) {
        if (Math.abs(velocity) > 0.05) {
          currentOffset += velocity;
          velocity *= 0.90;
        } else {
          velocity = 0;
          isLoopRunning = false;
          renderFrame();
          return; // 🛑 100% Still when idle
        }
      }

      renderFrame();

      if (isDragging || Math.abs(velocity) > 0.05) {
        requestAnimationFrame(step);
      } else {
        isLoopRunning = false;
      }
    }

    function wakeLoop() {
      if (!isLoopRunning) {
        isLoopRunning = true;
        requestAnimationFrame(step);
      }
    }

    // Resize
    window.addEventListener("resize", () => {
      updateMetrics();
      renderFrame();
    }, { passive: true });

    // 🔄 OPPOSITE MOUSE DRAG: Drag Left -> Cards Move Right
    viewport.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX;
      velocity = 0;
      wakeLoop();
    });
    window.addEventListener("mouseup", () => { isDragging = false; });
    viewport.addEventListener("mouseleave", () => { isDragging = false; });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const x = e.pageX;
      const delta = (x - startX) * 1.25;
      currentOffset -= delta; // Inverted
      velocity = -delta * 0.5; // Inverted
      startX = x;
      wakeLoop();
    });

    // 🔄 OPPOSITE TOUCH DRAG
    viewport.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      velocity = 0;
      wakeLoop();
    }, { passive: true });
    window.addEventListener("touchend", () => { isDragging = false; });
    viewport.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX;
      const delta = (x - startX) * 1.25;
      currentOffset -= delta; // Inverted
      velocity = -delta * 0.5; // Inverted
      startX = x;
      wakeLoop();
    }, { passive: true });

    // 🔄 OPPOSITE MOUSE WHEEL SCROLLING
    viewport.addEventListener("wheel", (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 2) {
        velocity += delta * 0.24; // Inverted
        if (velocity > 30) velocity = 30;
        if (velocity < -30) velocity = -30;
        wakeLoop();
      }
    }, { passive: true });

    updateMetrics();
    renderFrame();
  }

  // Initialize Skills (Clean spacing, zero overlap)
  initCleanAmphitheater({
    viewportId: "skills-coverflow-viewport",
    trackId: "skills-coverflow-track",
    cardSelector: ".skill-coverflow-card",
    defaultCardWidth: 260,
    gap: 55
  });

  // Initialize Projects (Clean spacing, zero overlap)
  initCleanAmphitheater({
    viewportId: "coverflow-viewport",
    trackId: "coverflow-track",
    cardSelector: ".coverflow-card-item",
    defaultCardWidth: 280,
    gap: 55
  });

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