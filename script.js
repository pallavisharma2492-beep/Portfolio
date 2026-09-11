document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

const grid = document.getElementById("projectGrid");
grid.innerHTML = PROJECTS.map((p) => {
  const media = p.image
    ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" />`
    : `<div class="card-icon">${p.icon || "🗂️"}</div>`;
  const tags = (p.tags || []).map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join("");
  const cta = p.link
    ? `<a href="${p.link}" target="_blank" rel="noopener" class="card-link">${escapeHtml(p.linkLabel || "View")} &rarr;</a>`
    : `<span class="card-link disabled">${escapeHtml(p.linkLabel || "Local project")}</span>`;

  return `
    <article class="project-card">
      <div class="card-media">${media}</div>
      <div class="card-body">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="tag-row">${tags}</div>
        ${cta}
      </div>
    </article>`;
}).join("");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const timeline = document.getElementById("experienceTimeline");
timeline.innerHTML = EXPERIENCE.map(
  (job) => `
    <article class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-head">
          <h3>${escapeHtml(job.title)} <span class="timeline-company">— ${escapeHtml(job.company)}</span></h3>
          <span class="timeline-period">${escapeHtml(job.period)}</span>
        </div>
        <ul class="timeline-bullets">
          ${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      </div>
    </article>`
).join("");

const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => observer.observe(s));
