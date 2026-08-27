document.addEventListener("DOMContentLoaded", () => {
  // 🎯 1. SILKY-SMOOTH LERPING CUSTOM CURSOR & SPARKLING PARTICLE TRAIL 🎯
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

      // Spawn mouse stardust sparks
      for (let i = 0; i < 2; i++) {
        cursorSparks.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 2.8 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.035 + 0.02,
          color: Math.random() > 0.5 ? "rgba(229, 192, 123, " : "rgba(194, 164, 255, "
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

  // 🌟 2. INTERACTIVE GOLDEN OCTAGONAL PERSPECTIVE TUNNEL & SCROLL LOOP (FROM IMAGE REF) 🌟
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, centerX, centerY;
    let scrollY = window.pageYOffset;
    let targetScrollY = scrollY;
    let tunnelOffset = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height * 0.45;
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("scroll", () => {
      targetScrollY = window.pageYOffset;
    });

    // Draw a single regular octagon
    function drawOctagon(cx, cy, radius, rotation = 0) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = rotation + (i * Math.PI) / 4;
        const x = cx + Math.cos(angle) * radius * 1.55; // widescreen perspective stretch
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    // Ambient floating stardust particles inside the tunnel
    const tunnelStars = [];
    const starCount = window.innerWidth < 768 ? 35 : 70;
    for (let i = 0; i < starCount; i++) {
      tunnelStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000 + 50,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    function animateTunnel() {
      ctx.clearRect(0, 0, width, height);

      // Smooth scroll lerp for camera travel
      scrollY += (targetScrollY - scrollY) * 0.08;
      tunnelOffset += 0.45 + (targetScrollY - scrollY) * 0.05;

      const numRings = 14;
      const baseSpacing = 85;

      for (let i = 0; i < numRings; i++) {
        // Continuous looping depth calculation
        let ringDist = ((i * baseSpacing + tunnelOffset) % (numRings * baseSpacing));
        let scale = Math.pow(ringDist / (numRings * baseSpacing), 2.2);
        let radius = scale * (Math.max(width, height) * 0.9);

        if (radius > 8) {
          let alpha = Math.min(1, Math.sin((ringDist / (numRings * baseSpacing)) * Math.PI));
          alpha = alpha * 0.35; // graceful glowing wireframe opacity

          ctx.save();
          ctx.strokeStyle = `rgba(229, 192, 123, ${alpha})`;
          ctx.lineWidth = Math.max(0.8, scale * 2.2);
          ctx.shadowBlur = 12;
          ctx.shadowColor = "rgba(229, 192, 123, 0.4)";

          drawOctagon(centerX, centerY, radius, 0);
          ctx.stroke();

          // Connective perspective wireframe lines on major diagonals
          if (i === 0 || i === 4 || i === 8) {
            ctx.strokeStyle = `rgba(229, 192, 123, ${alpha * 0.4})`;
            ctx.lineWidth = 0.5;
            for (let a = 0; a < 8; a++) {
              const angle = (a * Math.PI) / 4;
              ctx.beginPath();
              ctx.moveTo(centerX + Math.cos(angle) * 30 * 1.55, centerY + Math.sin(angle) * 30);
              ctx.lineTo(centerX + Math.cos(angle) * radius * 1.55, centerY + Math.sin(angle) * radius);
              ctx.stroke();
            }
          }
          ctx.restore();
        }
      }

      // Draw floating cosmic stars
      tunnelStars.forEach((star) => {
        star.z -= 0.6 + (targetScrollY - scrollY) * 0.04;
        if (star.z <= 10) {
          star.z = 1000;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }
        const k = 400 / star.z;
        const px = (star.x - centerX) * k + centerX;
        const py = (star.y - centerY) * k + centerY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * k * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 192, 123, ${star.alpha * Math.min(1, k * 0.6)})`;
          ctx.fill();
        }
      });

      // Render cursor stardust sparks
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
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color + "0.8)";
          ctx.fill();
        }
      }

      requestAnimationFrame(animateTunnel);
    }
    animateTunnel();
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

  // 🌟 6. SKILLS 3D CYLINDRICAL COVERFLOW (SILKY SMOOTH, NON-OVERLAPPING) 🌟
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

    // Touch support
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
