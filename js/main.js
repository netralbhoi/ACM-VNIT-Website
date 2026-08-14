document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. HEADER SCROLL EFFECT (Permanently applied via CSS classes in HTML)
  // ==========================================

  // ==========================================
  // 2. MOBILE HAMBURGER MENU
  // ==========================================
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenuOverlay = document.querySelector(".mobile-menu");
  const hamburgerLines = document.querySelectorAll(".hamburger-line");

  if (mobileMenuButton && mobileMenuOverlay) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileMenuOverlay.classList.contains("opacity-100");
      if (isOpen) {
        // Close menu
        mobileMenuOverlay.classList.remove("opacity-100", "pointer-events-auto");
        mobileMenuOverlay.classList.add("opacity-0", "pointer-events-none");
        hamburgerLines[0].classList.remove("rotate-45", "translate-y-[7px]");
        hamburgerLines[1].classList.remove("opacity-0");
        hamburgerLines[2].classList.remove("-rotate-45", "-translate-y-[7px]");
      } else {
        // Open menu
        mobileMenuOverlay.classList.remove("opacity-0", "pointer-events-none");
        mobileMenuOverlay.classList.add("opacity-100", "pointer-events-auto");
        hamburgerLines[0].classList.add("rotate-45", "translate-y-[7px]");
        hamburgerLines[1].classList.add("opacity-0");
        hamburgerLines[2].classList.add("-rotate-45", "-translate-y-[7px]");
      }
    });

    // Close mobile menu on clicking any navigation link
    mobileMenuOverlay.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenuOverlay.classList.remove("opacity-100", "pointer-events-auto");
        mobileMenuOverlay.classList.add("opacity-0", "pointer-events-none");
        hamburgerLines[0].classList.remove("rotate-45", "translate-y-[7px]");
        hamburgerLines[1].classList.remove("opacity-0");
        hamburgerLines[2].classList.remove("-rotate-45", "-translate-y-[7px]");
      });
    });
  }

  // ==========================================
  // 3. CONTACT DRAWER STATE
  // ==========================================
  const contactPanel = document.querySelector(".contact-panel");
  const contactBackdrop = document.querySelector(".contact-backdrop");
  const contactTriggers = document.querySelectorAll(".contact-trigger");
  const contactCloses = document.querySelectorAll(".contact-close");
  const contactForm = document.querySelector(".contact-form");
  const formStateDiv = document.getElementById("contact-form-state");
  const successStateDiv = document.getElementById("contact-success-state");

  const openContact = () => {
    if (contactPanel && contactBackdrop) {
      // Close mobile menu if open
      if (mobileMenuOverlay && mobileMenuOverlay.classList.contains("opacity-100")) {
        mobileMenuOverlay.classList.remove("opacity-100", "pointer-events-auto");
        mobileMenuOverlay.classList.add("opacity-0", "pointer-events-none");
        hamburgerLines[0].classList.remove("rotate-45", "translate-y-[7px]");
        hamburgerLines[1].classList.remove("opacity-0");
        hamburgerLines[2].classList.remove("-rotate-45", "-translate-y-[7px]");
      }

      contactPanel.classList.remove("translate-x-full");
      contactPanel.classList.add("translate-x-0");
      contactPanel.setAttribute("aria-hidden", "false");
      contactBackdrop.classList.remove("opacity-0", "pointer-events-none");
      contactBackdrop.classList.add("opacity-100", "pointer-events-auto");
      document.body.style.overflow = "hidden";
    }
  };

  const closeContact = () => {
    if (contactPanel && contactBackdrop) {
      contactPanel.classList.remove("translate-x-0");
      contactPanel.classList.add("translate-x-full");
      contactPanel.setAttribute("aria-hidden", "true");
      contactBackdrop.classList.remove("opacity-100", "pointer-events-auto");
      contactBackdrop.classList.add("opacity-0", "pointer-events-none");
      document.body.style.overflow = "";

      // Reset form view after slide animation finishes
      setTimeout(() => {
        if (formStateDiv && successStateDiv) {
          formStateDiv.classList.remove("hidden");
          successStateDiv.classList.add("hidden");
        }
        if (contactForm) {
          contactForm.reset();
        }
      }, 500);
    }
  };

  contactTriggers.forEach(btn => btn.addEventListener("click", openContact));
  contactCloses.forEach(btn => btn.addEventListener("click", closeContact));
  if (contactBackdrop) {
    contactBackdrop.addEventListener("click", closeContact);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contactPanel && contactPanel.classList.contains("translate-x-0")) {
      closeContact();
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formStateDiv && successStateDiv) {
        formStateDiv.classList.add("hidden");
        successStateDiv.classList.remove("hidden");
      }
    });
  }

  // ==========================================
  // 4. INTERSECTION OBSERVER FOR REVEALS
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Stop observing once animated
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 5. ANIMATED STATS COUNTERS
  // ==========================================
  const counters = document.querySelectorAll(".stat-counter");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetValue = parseInt(counter.getAttribute("data-target"), 10);
        let startValue = 0;
        const duration = 1600; // ms
        const steps = 100;
        const increment = targetValue / steps;
        const intervalTime = duration / steps;

        const timer = setInterval(() => {
          startValue += increment;
          if (startValue >= targetValue) {
            counter.textContent = targetValue;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(startValue);
          }
        }, intervalTime);

        counterObserver.unobserve(counter);
      }
    });
  }, {
    threshold: 0.3
  });

  counters.forEach(c => counterObserver.observe(c));

  // ==========================================
  // 6. DOMAINS INTERACTIVE LIST (Desktop Panel)
  // ==========================================
  const domainItems = document.querySelectorAll(".domain-item");
  const domainDetailPane = document.getElementById("domain-detail-pane");

  const defaultDetailsHTML = `
    <div class="text-center py-20">
      <p class="text-xs font-mono tracking-[0.15em] uppercase text-[--color-ink-muted]">
        Hover a domain to explore
      </p>
    </div>
  `;

  const renderDetails = (id, name, desc, tagsString) => {
    const tags = tagsString.split(",").map(t => t.trim());
    const tagsHTML = tags.map(tag => `
      <span class="text-xs font-mono text-[--color-blue] border border-[--color-blue]/30 bg-[--color-blue-dim] px-3 py-1">
        ${tag}
      </span>
    `).join("");

    return `
      <div style="animation: fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards">
        <p class="text-xs font-mono tracking-[0.2em] uppercase text-[--color-blue] mb-6">
          Domain ${id}
        </p>
        <h2 class="text-3xl font-black text-[--color-ink] mb-6">
          ${name}
        </h2>
        <p class="text-base text-[--color-ink-soft] leading-relaxed mb-8">
          ${desc}
        </p>
        <div>
          <p class="text-[10px] font-mono uppercase tracking-[0.15em] text-[--color-ink-muted] mb-3">
            Topics
          </p>
          <div class="flex flex-wrap gap-2">
            ${tagsHTML}
          </div>
        </div>
      </div>
    `;
  };

  if (domainItems.length > 0 && domainDetailPane) {
    domainItems.forEach(item => {
      const id = item.getAttribute("data-id");
      const name = item.getAttribute("data-name");
      const desc = item.getAttribute("data-desc");
      const tags = item.getAttribute("data-tags");

      const updatePane = (active) => {
        if (active) {
          // Add active classes to item UI
          item.classList.add("bg-[--color-blue-dim]");
          item.querySelector(".domain-id-text").classList.replace("text-[--color-ink-muted]", "text-[--color-blue]");
          item.querySelector(".domain-name-text").classList.replace("text-[--color-ink]", "text-[--color-blue]");
          item.querySelector(".domain-arrow").classList.remove("opacity-0");
          item.querySelector(".domain-arrow").classList.add("opacity-100", "translate-x-1");
          domainDetailPane.innerHTML = renderDetails(id, name, desc, tags);
        } else {
          // Remove active classes
          item.classList.remove("bg-[--color-blue-dim]");
          item.querySelector(".domain-id-text").classList.replace("text-[--color-blue]", "text-[--color-ink-muted]");
          item.querySelector(".domain-name-text").classList.replace("text-[--color-blue]", "text-[--color-ink]");
          item.querySelector(".domain-arrow").classList.remove("opacity-100", "translate-x-1");
          item.querySelector(".domain-arrow").classList.add("opacity-0");
          domainDetailPane.innerHTML = defaultDetailsHTML;
        }
      };

      // Hover triggers
      item.addEventListener("mouseenter", () => updatePane(true));
      item.addEventListener("mouseleave", () => updatePane(false));

      // Click triggers (for touch screens / mobile fallback)
      item.addEventListener("click", (e) => {
        const isCurrentlyActive = item.classList.contains("bg-[--color-blue-dim]");
        
        // Reset all first
        domainItems.forEach(i => {
          i.classList.remove("bg-[--color-blue-dim]");
          i.querySelector(".domain-id-text").classList.replace("text-[--color-blue]", "text-[--color-ink-muted]");
          i.querySelector(".domain-name-text").classList.replace("text-[--color-blue]", "text-[--color-ink]");
          i.querySelector(".domain-arrow").classList.remove("opacity-100", "translate-x-1");
          i.querySelector(".domain-arrow").classList.add("opacity-0");
        });

        if (!isCurrentlyActive) {
          e.preventDefault(); // Stop immediate navigation if link context
          updatePane(true);
        } else {
          domainDetailPane.innerHTML = defaultDetailsHTML;
        }
      });
    });
  }

  // ==========================================
  // 7. EVENTS CATEGORY FILTERING
  // ==========================================
  const filterButtons = document.querySelectorAll(".event-filter-btn");
  const eventItems = document.querySelectorAll(".event-list-item");
  const yearGroups = document.querySelectorAll(".event-year-group");

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetCategory = btn.getAttribute("data-category");

        // Update active class on buttons
        filterButtons.forEach(b => {
          b.classList.remove("bg-[--color-blue]", "text-white");
          b.classList.add("text-[--color-ink-muted]", "border", "border-[--color-border]", "hover:border-[--color-ink]", "hover:text-[--color-ink]");
        });
        btn.classList.add("bg-[--color-blue]", "text-white");
        btn.classList.remove("text-[--color-ink-muted]", "border", "border-[--color-border]", "hover:border-[--color-ink]", "hover:text-[--color-ink]");

        // Filter event items
        eventItems.forEach(item => {
          const itemCategory = item.getAttribute("data-category");
          if (targetCategory === "All" || itemCategory === targetCategory) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });

        // Hide year headers if all child events in that group are hidden
        yearGroups.forEach(group => {
          const childEvents = group.querySelectorAll(".event-list-item");
          let hasVisibleChildren = false;

          childEvents.forEach(child => {
            if (child.style.display !== "none") {
              hasVisibleChildren = true;
            }
          });

          if (hasVisibleChildren) {
            group.style.display = "";
          } else {
            group.style.display = "none";
          }
        });
      });
    });
  }

  // ==========================================
  // 8. TWO-TONE HEADING STYLER
  // Applies home-hero first-letter-black / rest-grey effect
  // to display headings (h1, h2, h3) sitewide.
  // ==========================================
  function applyTwoToneHeadings() {
    const headings = document.querySelectorAll("h1, h2, h3");

    headings.forEach((heading) => {
      // Skip headings already manually two-toned (contain child spans with inline color)
      const existingColorSpans = heading.querySelectorAll("span[style*='color']");
      if (existingColorSpans.length > 0) return;

      // Skip headings inside dark containers or with explicit white text
      if (heading.closest(".text-white, [class*='bg-gradient'], [class*='from-slate'], [class*='from-blue-600']") ||
          heading.classList.contains("text-white") ||
          heading.style.color === "white") return;

      // Skip headings that contain child element nodes (spans, links, etc.)
      // — these are already specially structured
      const hasChildElements = Array.from(heading.childNodes).some(
        n => n.nodeType === Node.ELEMENT_NODE && n.nodeName !== "BR"
      );
      if (hasChildElements) return;

      // Skip headings that contain stat-counter elements (animated numbers)
      if (heading.querySelector(".stat-counter")) return;

      // Skip empty headings
      if (!heading.textContent.trim()) return;

      // Rebuild heading innerHTML with two-tone word styling
      const childNodes = Array.from(heading.childNodes);
      let newHTML = "";

      childNodes.forEach(node => {
        if (node.nodeName === "BR") {
          newHTML += "<br>";
        } else if (node.nodeType === Node.TEXT_NODE) {
          // Split text into words and whitespace, style each word
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach(part => {
            if (/^\s*$/.test(part)) {
              newHTML += part; // Preserve whitespace
            } else if (part.length > 0) {
              const first = part[0];
              const rest = part.slice(1);
              newHTML += `<span style="color:#0a0a0a;font-size:1.06em;">${first}</span>`;
              if (rest) newHTML += `<span style="color:#636363;">${rest}</span>`;
            }
          });
        } else {
          // Preserve existing child elements as-is
          newHTML += node.outerHTML || "";
        }
      });

      heading.innerHTML = newHTML;
    });
  }

  applyTwoToneHeadings();

});
