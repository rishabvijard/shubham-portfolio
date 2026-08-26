/**
 * Shubham Portfolio - Projects Database & Modal Content
 */

const projectsData = {
  login: {
    id: "login",
    title: "Responsive Login Page UI",
    category: "Frontend Application",
    subtitle: "Full-screen auth interface with automatic image carousel & live JavaScript validation",
    tags: ["HTML5", "CSS3", "JavaScript", "Regex", "UI/UX", "Glassmorphism"],
    overview: "A sleek, responsive full-screen authentication interface featuring an automated background image slider with smooth cross-fading, combined with client-side real-time JavaScript validation for inputs, password strength checker, and show/hide password toggle.",
    keyFeatures: [
      "Automatic background image carousel transitioning smoothly every 5 seconds with active pagination pills.",
      "Real-time JavaScript form validation checking email format, password complexity, and required fields before submission.",
      "Interactive password reveal/hide eye-icon toggle.",
      "Modern dark glassmorphism card styling with subtle backdrop blur and focus border glows.",
      "100% responsive layout adapting from mobile screens up to 4K displays."
    ],
    techDetails: "Semantic HTML5 structure with ARIA accessibility tags, modular CSS custom properties for instant theme consistency, and clean ES6 JavaScript event listeners for form validation and background interval rotation.",
    codeSnippet: `// Real-Time Form Validation & Slider logic
const form = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email-field");

emailInput.addEventListener("input", (e) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(e.target.value.trim())) {
    setFieldStatus(emailInput, "valid");
  } else {
    setFieldStatus(emailInput, "invalid");
  }
});`
  },

  gym: {
    id: "gym",
    title: "Gym & Fitness Hub Website",
    category: "Responsive Web Design",
    subtitle: "High-impact fitness landing page with modern layout, dynamic sections, and interactive schedules",
    tags: ["HTML5", "CSS3", "JavaScript", "Flexbox/Grid", "Responsive Design", "Animation"],
    overview: "A modern, high-energy fitness club web portal engineered with semantic HTML5 and clean CSS layout techniques. Designed to captivate gym enthusiasts with dynamic program displays, trainer portfolios, and interactive membership pricing calculators.",
    keyFeatures: [
      "Hero section with bold visual typography, high-contrast imagery, and call-to-action triggers.",
      "Categorized training program grid (Strength, HIIT, Cardio, Yoga, CrossFit).",
      "Interactive membership pricing cards with monthly/annual toggle.",
      "Trainer showcase cards with social links and expertise tags.",
      "Interactive workout schedule table and smooth scroll navigation across all sections."
    ],
    techDetails: "Engineered using CSS Grid and Flexbox for responsive layout without heavy third-party framework overhead, resulting in lightning-fast load times and smooth 60fps scrolling animations.",
    codeSnippet: `// Pricing Tier Monthly/Annual Switcher
const toggleBtn = document.querySelector("#billing-toggle");
const priceValues = document.querySelectorAll(".price-amount");

toggleBtn.addEventListener("change", (e) => {
  const isAnnual = e.target.checked;
  priceValues.forEach(price => {
    const monthly = price.dataset.monthly;
    const annual = price.dataset.annual;
    price.textContent = isAnnual ? \`$\${annual}/yr\` : \`$\${monthly}/mo\`;
  });
});`
  },

  wp: {
    id: "wp",
    title: "WordPress Website Customization",
    category: "CMS & Client Solutions",
    subtitle: "Tailored WordPress site with Elementor visual builder, custom hero sections, and bespoke CSS styling",
    tags: ["WordPress", "Elementor Pro", "Custom CSS", "PHP", "Responsive Design", "SEO"],
    overview: "End-to-end WordPress site customization transforming standard themes into high-performing, bespoke digital platforms. Leveraged Elementor Pro widgets along with custom CSS enhancements, dynamic sliders, interactive contact forms, and mobile optimizations.",
    keyFeatures: [
      "Custom hero headers with animated typography, gradient overlays, and dynamic call-to-action buttons.",
      "Interactive customer testimonial and project showcase sliders.",
      "Integrated contact forms with custom validation and automated email dispatch.",
      "Custom CSS styling overrides to ensure tight alignment with specific brand identity requirements.",
      "Comprehensive mobile and tablet responsiveness tuning across all Elementor breakpoints."
    ],
    techDetails: "Integrated custom PHP template snippets within child theme functions.php, applied scoped custom CSS to Elementor modules, and optimized media assets for enhanced page speed and core web vitals.",
    codeSnippet: `/* Elementor Custom CSS Module Override */
.custom-hero-banner {
  background: radial-gradient(circle at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 60%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-hero-banner:hover {
  border-color: rgba(139, 92, 246, 0.35);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}`
  }
};
