function initMainApp() {
  document.documentElement.classList.add("js-loaded");
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
  // 4. INTERSECTION OBSERVER & FALLBACK FOR REVEALS
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: "100px 0px 100px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Immediate check for elements currently in or near viewport
  function checkRevealViewport() {
    revealElements.forEach(el => {
      if (!el.classList.contains("visible")) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
          el.classList.add("visible");
        }
      }
    });
  }

  // Trigger on load, scroll, and resize
  checkRevealViewport();
  window.addEventListener("scroll", checkRevealViewport, { passive: true });
  window.addEventListener("resize", checkRevealViewport, { passive: true });

  // Safety fallback: ensure no element remains stuck invisible
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add("visible"));
  }, 1000);


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
      <span class="text-xs font-mono text-[#a855f7] border border-[#a855f7]/30 bg-[#a855f7]/10 px-3 py-1">
        ${tag}
      </span>
    `).join("");

    return `
      <div style="animation: fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards">
        <p class="text-xs font-mono tracking-[0.2em] uppercase text-[#a855f7] mb-6">
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
          item.classList.add("bg-[#a855f7]/10");
          item.querySelector(".domain-id-text").classList.replace("text-[--color-ink-muted]", "text-[#a855f7]");
          item.querySelector(".domain-name-text").classList.replace("text-[--color-ink]", "text-[#a855f7]");
          item.querySelector(".domain-arrow").classList.remove("opacity-0");
          item.querySelector(".domain-arrow").classList.add("opacity-100", "translate-x-1");
          domainDetailPane.innerHTML = renderDetails(id, name, desc, tags);
        } else {
          // Remove active classes
          item.classList.remove("bg-[#a855f7]/10");
          item.querySelector(".domain-id-text").classList.replace("text-[#a855f7]", "text-[--color-ink-muted]");
          item.querySelector(".domain-name-text").classList.replace("text-[#a855f7]", "text-[--color-ink]");
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
        const isCurrentlyActive = item.classList.contains("bg-[#a855f7]/10");

        // Reset all first
        domainItems.forEach(i => {
          i.classList.remove("bg-[#a855f7]/10");
          i.querySelector(".domain-id-text").classList.replace("text-[#a855f7]", "text-[--color-ink-muted]");
          i.querySelector(".domain-name-text").classList.replace("text-[#a855f7]", "text-[--color-ink]");
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
          b.classList.remove("bg-[#a855f7]", "bg-[--color-blue]", "text-white");
          b.classList.add("text-[--color-ink-muted]", "border", "border-[--color-border]", "hover:border-[--color-ink]", "hover:text-[--color-ink]");
        });
        btn.classList.add("bg-[#a855f7]", "text-white");
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
      // Note: these are already specially structured
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
              newHTML += `<span style="color:#ffffff;font-size:1.05em;">${first}</span>`;
              if (rest) newHTML += `<span style="color:#cbd5e1;">${rest}</span>`;
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

  // ==========================================
  // 9. LIGHTBOX IMAGE MODAL
  // ==========================================
  const imageModal = document.getElementById("image-modal");
  const imageModalImg = document.getElementById("image-modal-img");
  const imageModalTitle = document.getElementById("image-modal-title");
  const imageModalDate = document.getElementById("image-modal-date");
  const imageModalClose = document.getElementById("image-modal-close");
  const viewPicButtons = document.querySelectorAll(".view-full-pic-btn");

  const openImageModal = (src, title, date) => {
    if (!imageModal || !imageModalImg) return;
    imageModalImg.src = src;
    imageModalImg.alt = title || "Full picture";
    if (imageModalTitle) imageModalTitle.textContent = title || "";
    if (imageModalDate) imageModalDate.textContent = date || "";

    imageModal.classList.remove("opacity-0", "pointer-events-none");
    imageModal.classList.add("opacity-100", "pointer-events-auto");
    imageModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    if (!imageModal) return;
    imageModal.classList.remove("opacity-100", "pointer-events-auto");
    imageModal.classList.add("opacity-0", "pointer-events-none");
    imageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (imageModalImg) imageModalImg.src = "";
    }, 300);
  };

  viewPicButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const src = btn.getAttribute("data-img-src");
      const title = btn.getAttribute("data-img-title");
      const date = btn.getAttribute("data-img-date");
      if (src) {
        openImageModal(src, title, date);
      }
    });
  });

  if (imageModalClose) {
    imageModalClose.addEventListener("click", closeImageModal);
  }

  if (imageModal) {
    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal || e.target.classList.contains("backdrop-blur-md")) {
        closeImageModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageModal && imageModal.classList.contains("opacity-100")) {
      closeImageModal();
    }
  });

  applyTwoToneHeadings();

  // ==========================================
  // 9. HERO SKETCH HOVER SPOTLIGHT (B&W Sketch -> Vibrant Color Spotlight on Hover)
  // ==========================================
  const heroSection = document.getElementById("hero-section");
  const heroColorBg = document.getElementById("hero-color-bg");

  if (heroSection && heroColorBg) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      heroColorBg.style.setProperty("--mouse-x", `${x}px`);
      heroColorBg.style.setProperty("--mouse-y", `${y}px`);
      heroColorBg.style.opacity = "1";
    });

    heroSection.addEventListener("mouseleave", () => {
      heroColorBg.style.opacity = "0";
    });
  }

  // ==========================================
  // 10. OFFICIAL BULLETIN BOARD INTERACTIVITY & SUPABASE INTEGRATION
  // ==========================================
  const SUPABASE_URL = 'https://wntzbdhdjdyixvxzpdgf.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndudHpiZGhkamR5aXh2eHpwZGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjkwNzUsImV4cCI6MjEwNjQ0NTA3NX0.eDaDYSUndKFTy2GuVMKv3GoJWgsf2947bNnfi0LtFt8';

  let db = null;
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    try {
      db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Supabase initialization:', e);
    }
  }

  const bulletinFilterBtns = document.querySelectorAll(".bulletin-filter-btn");
  const bulletinCards = document.querySelectorAll(".bulletin-card");
  let bulletinPointItems = document.querySelectorAll(".bulletin-point-item");
  const bulletinSearchInput = document.getElementById("bulletin-search-input");
  const bulletinViewBtns = document.querySelectorAll(".bulletin-view-btn");
  const pointwiseContainer = document.getElementById("bulletin-pointwise-container");
  const cardsContainer = document.getElementById("bulletin-cards-container");

  let activeCategory = "ALL";
  let searchQuery = "";

  // View Switcher (Point-Wise Headlines vs Cards)
  bulletinViewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      bulletinViewBtns.forEach(b => {
        b.classList.remove("active", "bg-[#0ea5e9]", "text-white");
        b.classList.add("text-slate-400", "border-[#1e293b]");
      });
      btn.classList.add("active", "bg-[#0ea5e9]", "text-white");
      btn.classList.remove("text-slate-400", "border-[#1e293b]");

      const viewMode = btn.getAttribute("data-view");
      if (viewMode === "pointwise") {
        if (pointwiseContainer) pointwiseContainer.classList.remove("hidden");
        if (cardsContainer) cardsContainer.classList.add("hidden");
      } else {
        if (pointwiseContainer) pointwiseContainer.classList.add("hidden");
        if (cardsContainer) cardsContainer.classList.remove("hidden");
      }
    });
  });

  function filterBulletinItems() {
    const currentPointItems = document.querySelectorAll(".bulletin-point-item");
    const allItems = [...bulletinCards, ...currentPointItems];
    allItems.forEach(item => {
      const cat = item.getAttribute("data-category") || "";
      const title = (item.getAttribute("data-title") || "").toLowerCase();
      const text = item.textContent.toLowerCase();

      const matchesCat = (activeCategory === "ALL" || cat === activeCategory);
      const matchesSearch = !searchQuery || title.includes(searchQuery) || text.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  bulletinFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      bulletinFilterBtns.forEach(b => {
        b.classList.remove("active", "bg-[#1e293b]", "text-white", "border-[#0ea5e9]/40");
        b.classList.add("text-slate-400", "border-[#1e293b]");
      });
      btn.classList.add("active", "bg-[#1e293b]", "text-white", "border-[#0ea5e9]/40");
      btn.classList.remove("text-slate-400", "border-[#1e293b]");

      activeCategory = btn.getAttribute("data-bulletin-cat") || "ALL";
      filterBulletinItems();
    });
  });

  if (bulletinSearchInput) {
    bulletinSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterBulletinItems();
    });
  }

  // Bulletin Notice Modal & Full Detail Dispatch Data
  const noticeModalData = {
    "insomnia-2026": {
      ref: "VNIT/ACM/2026/DISPATCH-001",
      title: "INSOMNIA 2026 — 36-HOUR NATIONAL HACKATHON",
      body: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">DATES & SCHEDULE</span>
              <span class="text-white font-bold">October 24–26, 2026</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">CAMPUS VENUE</span>
              <span class="text-white font-bold">Department of CSE, VNIT Campus</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">PRIZE POOL</span>
              <span class="text-emerald-400 font-bold">₹1,50,000 INR + Swag Kits</span>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">FULL DISPATCH OVERVIEW</h4>
            <p class="text-slate-300 leading-relaxed text-sm font-medium">
              Insomnia 2026 is the premier annual flagship 36-hour hackathon organized by the ACM VNIT Student Chapter. Designed to foster breakthrough innovation across Artificial Intelligence, Web3, Distributed Systems, and Open Hardware, participants will work non-stop to build and deploy production-ready applications evaluated by industry engineers and venture investors.
            </p>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">SCHEDULE & TIMELINE BREAKDOWN</h4>
            <ul class="space-y-2 text-xs font-mono text-slate-300 border-l-2 border-[#0ea5e9] pl-4">
              <li><strong class="text-white">Day 1 • 09:00 AM:</strong> Registration Desk Check-In & Kit Distribution</li>
              <li><strong class="text-white">Day 1 • 11:00 AM:</strong> Hackathon Commences (36-Hour Countdown Begins)</li>
              <li><strong class="text-white">Day 2 • 02:00 PM:</strong> Mandatory Technical Code Review & Mentorship Session</li>
              <li><strong class="text-white">Day 3 • 11:00 AM:</strong> Project Freeze & Final Pitch Presentation to Jury</li>
            </ul>
          </div>
          <div class="bg-[#080d1a] p-4 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-mono">
            ⚠️ <strong>Campus Access Requirement:</strong> Pre-registration is mandatory. All team members must bring physical college photo ID cards.
          </div>
        </div>
      `
    },
    "llm-bootcamp-2026": {
      ref: "VNIT/ACM/2026/DISPATCH-002",
      title: "BUILDING SCALABLE LLM AGENTS BOOTCAMP",
      body: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">DATE & TIMINGS</span>
              <span class="text-white font-bold">November 08, 2026 • 10:00 AM - 05:00 PM</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">LOCATION</span>
              <span class="text-white font-bold">Assembly Hall 2, VNIT</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">AVAILABILITY</span>
              <span class="text-amber-400 font-bold">45 Seats Remaining</span>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">FULL DISPATCH OVERVIEW & SYLLABUS</h4>
            <p class="text-slate-300 leading-relaxed text-sm font-medium mb-3">
              An intensive full-day masterclass delivered by the ACM AI Research Wing. Attendees will learn how to design, build, and deploy enterprise-grade Autonomous Agentic Systems using Retrieval-Augmented Generation (RAG).
            </p>
            <ul class="space-y-2 text-xs font-mono text-slate-300 bg-[#080d1a] p-4 rounded-xl border border-[#1e293b]">
              <li>• <strong>Module 1:</strong> Transformer Architectures & Context Window Optimization</li>
              <li>• <strong>Module 2:</strong> Vector DB Embeddings (ChromaDB & Qdrant)</li>
              <li>• <strong>Module 3:</strong> Multi-Agent Delegation with LangChain, LangGraph & CrewAI</li>
              <li>• <strong>Module 4:</strong> Fine-tuning Quantized Llama-3 & GPU Edge Deployment</li>
            </ul>
          </div>
          <div class="bg-[#080d1a] p-4 rounded-xl border border-[#0ea5e9]/40 text-slate-300 text-xs font-mono">
            💡 <strong>Prerequisites:</strong> Basic Python programming. Participants receive GPU Cloud compute credits during the workshop.
          </div>
        </div>
      `
    },
    "algostrike-2026": {
      ref: "VNIT/ACM/2026/DISPATCH-003",
      title: "ALGOSTRIKE V4.0 — INTER-COLLEGE CP CONTEST",
      body: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">CONTEST DATE</span>
              <span class="text-white font-bold">November 22, 2026 • 06:00 PM - 09:00 PM</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">PLATFORM</span>
              <span class="text-white font-bold">ACM Online Judge Hub</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">CONTEST TYPE</span>
              <span class="text-cyan-400 font-bold">ICPC Rated Individual</span>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">FULL CONTEST DETAILS</h4>
            <p class="text-slate-300 leading-relaxed text-sm font-medium">
              AlgoStrike v4.0 is a 3-hour speed competitive programming league designed for undergraduate engineers. Featuring 6 algorithmically challenging problems covering graph theory, dynamic programming, segment trees, and combinatorics. Trophies, cash vouchers, and certificates awarded to top performers.
            </p>
          </div>
        </div>
      `
    },
    "ossmop-2026": {
      ref: "VNIT/ACM/2026/DISPATCH-004",
      title: "ACM OPEN SOURCE MENTORSHIP PROGRAM (OSMoP)",
      body: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">DURATION</span>
              <span class="text-white font-bold">December 01, 2026 – January 15, 2027</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">MENTORS</span>
              <span class="text-purple-400 font-bold">GSoC & LFX Alumni</span>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">PROGRAM STRUCTURE</h4>
            <p class="text-slate-300 leading-relaxed text-sm font-medium">
              A 6-week cohort mentorship program designed to take students from Git fundamentals to submitting pull requests to production open-source codebases. Participants work 1-on-1 with senior maintainers.
            </p>
          </div>
        </div>
      `
    },
    "cybersec-2026": {
      ref: "VNIT/ACM/2026/DISPATCH-005",
      title: "CYBERSECURITY & ZERO-TRUST ARCHITECTURE SYMPOSIUM",
      body: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">DATE & TIME</span>
              <span class="text-white font-bold">December 15, 2026 • 02:00 PM</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">VENUE</span>
              <span class="text-white font-bold">Auditorium 1, VNIT Campus</span>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">SYMPOSIUM AGENDA</h4>
            <p class="text-slate-300 leading-relaxed text-sm font-medium">
              Join leading security researchers and industrial ethical hackers for live demonstrations on zero-trust cloud IAM architectures, reverse engineering, and post-quantum encryption standards.
            </p>
          </div>
        </div>
      `
    },
    "cloud-devops-2027": {
      ref: "VNIT/ACM/2027/DISPATCH-006",
      title: "CLOUD DEVOPS & KUBERNETES HANDS-ON BOOTCAMP",
      body: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">DATE & TIME</span>
              <span class="text-white font-bold">January 10, 2027 • 10:00 AM</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">VENUE</span>
              <span class="text-white font-bold">CSE Lab 3, VNIT</span>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold font-mono text-xs uppercase mb-2">LAB SYLLABUS</h4>
            <p class="text-slate-300 leading-relaxed text-sm font-medium">
              Hands-on lab covering Docker containerization, Kubernetes pod management, Helm charts, and building automated GitHub Actions CI/CD deployment pipelines.
            </p>
          </div>
        </div>
      `
    }
  };

  // Notice Modal Triggers
  const noticeModal = document.getElementById("bulletin-notice-modal");
  const noticeModalTitle = document.getElementById("notice-modal-title");
  const noticeModalBody = document.getElementById("notice-modal-body");
  const noticeModalRef = document.getElementById("notice-modal-ref");
  const noticeModalClose = document.getElementById("notice-modal-close");
  const noticeModalCloseBtn = document.getElementById("notice-modal-close-btn");
  const noticeModalProceedBtn = document.getElementById("notice-modal-proceed-btn");
  const noticeModalTriggers = document.querySelectorAll(".bulletin-modal-trigger");

  let currentDispatchId = "";

  function openNoticeModal(id) {
    if (!noticeModal) return;
    const data = noticeModalData[id] || {
      ref: "VNIT/ACM/2026/DISPATCH",
      title: "OFFICIAL NOTICE",
      body: "<p>Notice content brief preview.</p>"
    };

    currentDispatchId = id;
    if (noticeModalTitle) noticeModalTitle.textContent = data.title;
    if (noticeModalBody) noticeModalBody.innerHTML = data.body;
    if (noticeModalRef) noticeModalRef.textContent = "REF: " + data.ref;

    noticeModal.classList.remove("opacity-0", "pointer-events-none");
    noticeModal.classList.add("opacity-100", "pointer-events-auto");
    noticeModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeNoticeModal() {
    if (!noticeModal) return;
    noticeModal.classList.remove("opacity-100", "pointer-events-auto");
    noticeModal.classList.add("opacity-0", "pointer-events-none");
    noticeModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  noticeModalTriggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dispatchId = btn.getAttribute("data-dispatch-id");
      if (dispatchId) openNoticeModal(dispatchId);
    });
  });

  if (noticeModalClose) noticeModalClose.addEventListener("click", closeNoticeModal);
  if (noticeModalCloseBtn) noticeModalCloseBtn.addEventListener("click", closeNoticeModal);
  if (noticeModal) {
    noticeModal.addEventListener("click", (e) => {
      if (e.target === noticeModal) closeNoticeModal();
    });
  }

  // Supabase Fetch & Dynamic Bulletin Board Rendering
  async function loadBulletin() {
    if (!db) return;
    try {
      let res = await db
        .from('bulletin_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (res.error) {
        console.warn('Primary query order failed, trying simple select:', res.error.message);
        res = await db.from('bulletin_posts').select('*');
      }

      if (res.error) {
        console.error('Error loading posts from Supabase:', res.error);
        return;
      }

      console.log('Bulletin posts from Supabase:', res.data);
      if (res.data && res.data.length > 0) {
        renderSupabasePosts(res.data);
      }
    } catch (err) {
      console.error('Supabase fetch exception:', err);
    }
  }

  function renderSupabasePosts(posts) {
    if (!pointwiseContainer) return;

    pointwiseContainer.innerHTML = '';

    posts.forEach((post, index) => {
      const dispatchId = post.slug || post.dispatch_id || `supabase-notice-${post.id || index}`;
      const titleText = post.title || post.headline || 'OFFICIAL BULLETIN ANNOUNCEMENT';
      const bodyText = post.body || post.content || post.description || post.details || `<p class="text-white">${post.summary || titleText}</p>`;
      const refText = post.ref || post.reference || `VNIT/ACM/2026/NOTICE-${post.id || index + 1}`;
      const categoryText = post.category || post.type || 'NOTICE';
      
      noticeModalData[dispatchId] = {
        ref: refText,
        title: titleText,
        body: typeof bodyText === 'string' && bodyText.includes('<') ? bodyText : `<div class="space-y-4 font-mono text-sm text-white leading-relaxed"><p>${bodyText}</p></div>`
      };

      let dateStr = post.date_text || post.date || post.event_date;
      if (!dateStr && post.created_at) {
        try {
          dateStr = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
        } catch(e) {
          dateStr = 'RECENT';
        }
      }
      if (!dateStr) dateStr = 'RECENT';

      const itemEl = document.createElement('div');
      itemEl.className = 'bulletin-point-item visible group bg-[#0d1424]/70 hover:bg-[#0d1424] border border-[#1e293b] hover:border-[#0ea5e9]/50 rounded-xl px-6 py-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bulletin-modal-trigger shadow-md';
      itemEl.setAttribute('data-category', categoryText.toUpperCase());
      itemEl.setAttribute('data-title', titleText.toUpperCase());
      itemEl.setAttribute('data-dispatch-id', dispatchId);

      itemEl.innerHTML = `
        <div class="flex items-center gap-3.5 min-w-0">
          <span class="text-white text-xl leading-none font-bold select-none">•</span>
          <h3 class="text-base sm:text-lg font-medium text-white group-hover:text-[#0ea5e9] group-hover:underline transition-colors truncate">
            ${titleText}
          </h3>
        </div>
        <div class="shrink-0 text-xs sm:text-sm font-mono text-white group-hover:text-[#0ea5e9] flex items-center gap-2 transition-colors">
          <span>${dateStr}</span>
          <span class="opacity-40">|</span>
          <span class="group-hover:translate-x-0.5 transition-transform">View Details →</span>
        </div>
      `;

      itemEl.addEventListener('click', (e) => {
        e.preventDefault();
        openNoticeModal(dispatchId);
      });

      pointwiseContainer.appendChild(itemEl);
    });

    filterBulletinItems();
  }

  loadBulletin();


  // Registration Modal Triggers & Logic
  const regModal = document.getElementById("bulletin-registration-modal");
  const regModalEventTitle = document.getElementById("reg-modal-event-title");
  const regEventNameInput = document.getElementById("reg-event-name");
  const regModalClose = document.getElementById("reg-modal-close");
  const regSuccessCloseBtn = document.getElementById("reg-success-close-btn");
  const regForm = document.getElementById("bulletin-reg-form");
  const regFormState = document.getElementById("reg-modal-form-state");
  const regSuccessState = document.getElementById("reg-modal-success-state");
  const regTicketRef = document.getElementById("reg-ticket-ref");
  const regTriggers = document.querySelectorAll(".bulletin-register-trigger");

  function openRegModal(eventTitle) {
    if (!regModal) return;
    if (regModalEventTitle) regModalEventTitle.textContent = eventTitle || "EVENT REGISTRATION";
    if (regEventNameInput) regEventNameInput.value = eventTitle || "ACM Official Event";

    if (regFormState) regFormState.classList.remove("hidden");
    if (regSuccessState) regSuccessState.classList.add("hidden");

    regModal.classList.remove("opacity-0", "pointer-events-none");
    regModal.classList.add("opacity-100", "pointer-events-auto");
    regModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeRegModal() {
    if (!regModal) return;
    regModal.classList.remove("opacity-100", "pointer-events-auto");
    regModal.classList.add("opacity-0", "pointer-events-none");
    regModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (regForm) regForm.reset();
    }, 400);
  }

  regTriggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const title = btn.getAttribute("data-event-title") || "ACM Official Event";
      openRegModal(title);
    });
  });

  if (noticeModalProceedBtn) {
    noticeModalProceedBtn.addEventListener("click", () => {
      const data = noticeModalData[currentDispatchId];
      const title = data ? data.title : "ACM Event";
      closeNoticeModal();
      setTimeout(() => {
        openRegModal(title);
      }, 300);
    });
  }

  if (regModalClose) regModalClose.addEventListener("click", closeRegModal);
  if (regSuccessCloseBtn) regSuccessCloseBtn.addEventListener("click", closeRegModal);
  if (regModal) {
    regModal.addEventListener("click", (e) => {
      if (e.target === regModal) closeRegModal();
    });
  }

  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      if (regTicketRef) regTicketRef.textContent = "#ACM-2026-PASS-" + randomNum;

      if (regFormState) regFormState.classList.add("hidden");
      if (regSuccessState) regSuccessState.classList.remove("hidden");
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMainApp);
} else {
  initMainApp();
}

