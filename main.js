(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var C = window.SW_CONTENT || {};
  var site = C.site || {};

  /* ------------------------------------------------------------------
     Analytics — vendor-neutral. Works with GA4/GTM (dataLayer) or
     Plausible if either is added to the page; otherwise a no-op.
     ------------------------------------------------------------------ */
  function track(event, props) {
    props = props || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: event }, props));
      if (typeof window.plausible === "function") window.plausible(event, { props: props });
    } catch (e) { /* never break the page for analytics */ }
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) track(el.getAttribute("data-track"), { label: el.textContent.trim() });
  });

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      if (k === "class") el.className = attrs[k];
      else if (k === "text") el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }
  function arrow() { return h("span", { class: "cta__arrow", "aria-hidden": "true", text: "→" }); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function mount(name, nodes) {
    var host = document.querySelector('[data-render="' + name + '"]');
    if (!host) return;
    host.textContent = "";
    nodes.forEach(function (n) { host.appendChild(n); });
  }
  function external(url) { return /^https?:/i.test(url); }

  /* ------------------------------------------------------------------
     Photography — responsive Unsplash images, up to 3840px (4K)
     ------------------------------------------------------------------ */
  var photos = C.photos || {};
  var WIDTHS = [640, 960, 1280, 1920, 2560, 3840];
  function src(id, w) { return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&q=80&w=" + w; }
  function photo(key, sizes, opts) {
    opts = opts || {};
    var p = photos[key];
    if (!p) return null;
    var img = h("img", {
      src: src(p.id, 1280),
      srcset: WIDTHS.map(function (w) { return src(p.id, w) + " " + w + "w"; }).join(", "),
      sizes: sizes || "100vw",
      alt: opts.decorative ? "" : p.alt,
      loading: "lazy",
      decoding: "async",
    });
    return h("div", { class: "photo" + (opts.className ? " " + opts.className : "") }, [img]);
  }

  // <figure data-photo="key" data-sizes="…" data-caption="…">
  document.querySelectorAll("[data-photo]").forEach(function (fig) {
    var ph = photo(fig.getAttribute("data-photo"), fig.getAttribute("data-sizes"));
    if (!ph) return;
    fig.appendChild(ph);
    var cap = fig.getAttribute("data-caption");
    if (cap) {
      var parts = cap.split("·");
      fig.appendChild(h("figcaption", { class: "fig-caption" }, [h("span", { text: parts[0].trim() }), (parts[1] || "").trim()]));
    }
  });
  // Section backgrounds: <section data-bg-photo="key">
  document.querySelectorAll("[data-bg-photo]").forEach(function (sec) {
    var ph = photo(sec.getAttribute("data-bg-photo"), "100vw", { decorative: true });
    if (!ph) return;
    var wrap = h("div", { class: "bg-photo", "aria-hidden": "true" });
    wrap.appendChild(ph.firstChild);
    sec.insertBefore(wrap, sec.firstChild);
  });

  /* ------------------------------------------------------------------
     Featured episode
     ------------------------------------------------------------------ */
  var episodes = C.episodes || [];
  var featured =
    episodes.filter(function (e) { return e.status === "live"; }).pop() || episodes[0];

  if (featured) {
    var live = featured.status === "live";
    var g = featured.guest || {};
    var num = pad(featured.number);

    var coverPhoto = photos[featured.cover]
      ? photo(featured.cover, "(max-width: 860px) 100vw, 58vw", { decorative: true })
      : featured.cover
        ? h("div", { class: "photo" }, [h("img", { src: featured.cover, alt: "", loading: "lazy" })])
        : null;

    var cover = h("div", { class: "episode__cover", "aria-hidden": "true" }, [
      coverPhoto,
      h("div", { class: "episode__cover-top" }, [
        h("span", { text: "Sport Within · Episode " + num }),
        h("span", { class: "episode__badge", text: live ? "Out now" : "Coming soon" }),
      ]),
      h("div", { class: "episode__cover-num" }, [num, h("span", { class: "dot" })]),
      h("div", { class: "episode__cover-foot" }, [
        h("div", null, [h("strong", { text: g.name }), (g.role || "") + (g.organisation ? ", " + g.organisation : "")]),
        h("span", { text: featured.topic || "" }),
      ]),
    ]);

    var ctas;
    if (live) {
      ctas = [];
      if (featured.videoUrl) ctas.push(h("a", { class: "btn btn--signal", href: featured.videoUrl, target: "_blank", rel: "noopener", "data-track": "episode_watch" }, ["Watch ", h("span", { class: "btn__arrow", "aria-hidden": "true", text: "→" })]));
      if (featured.audioUrl) ctas.push(h("a", { class: "cta", href: featured.audioUrl, target: "_blank", rel: "noopener", "data-track": "episode_listen" }, ["Listen ", arrow()]));
    } else {
      ctas = [h("span", { class: "cta", "aria-disabled": "true" }, ["Coming soon ", arrow()])];
    }

    mount("episode", [
      cover,
      h("div", { class: "episode__body" }, [
        h("p", { class: "episode__label", text: live ? "Latest conversation · Episode " + num : "The first conversation / Coming soon" }),
        h("h3", { class: "episode__title", id: "episode-title", text: featured.title }),
        h("p", { class: "episode__desc", text: featured.description }),
        h("div", { class: "episode__guest" }, [
          h("div", { class: "episode__guest-inner" }, [
            h("span", { class: "episode__guest-kicker", text: "Guest · Episode " + num }),
            h("span", { class: "episode__guest-name", text: g.name }),
            h("span", { class: "episode__guest-role", text: [g.role, g.organisation].filter(Boolean).join(", ") }),
          ]),
          h("div", { class: "episode__ctas" }, ctas),
        ]),
      ]),
    ]);
  }

  /* ------------------------------------------------------------------
     Questions — no numbers, no bullets, one question per line.
     A small photograph slides in on hover (desktop only).
     ------------------------------------------------------------------ */
  mount("questions", (C.questions || []).map(function (q) {
    var ep = q.episode && episodes.filter(function (e) { return e.number === q.episode && e.status === "live"; })[0];
    return h("li", { class: "question" }, [
      h("div", { class: "question__inner" }, [
        h("span", { class: "question__tag", text: q.category || "" }),
        h("p", { class: "question__text", text: q.text }),
        q.photo ? photo(q.photo, "240px", { decorative: true, className: "question__thumb" }) : null,
        ep && ep.videoUrl
          ? h("a", { class: "question__link cta", href: ep.videoUrl, target: "_blank", rel: "noopener", "data-track": "question_episode" }, ["Explored in Episode " + pad(ep.number) + " ", arrow()])
          : null,
      ]),
    ]);
  }));

  /* ------------------------------------------------------------------
     Industry categories — editorial rows; photo fills the row on hover
     ------------------------------------------------------------------ */
  mount("categories", (C.categories || []).map(function (c) {
    var bg = c.photo ? photo(c.photo, "(max-width: 1360px) 100vw, 1360px", { decorative: true, className: "sector__bg" }) : null;
    if (bg) bg.setAttribute("aria-hidden", "true");
    var inner = h(c.url ? "a" : "div", c.url ? { class: "sector__inner", href: c.url } : { class: "sector__inner" }, [
      h("span", { class: "sector__num", text: c.number }),
      h("h3", { class: "sector__name", text: c.name }),
      h("ul", { class: "sector__desc", "aria-label": c.name + " focus areas" },
        (c.descriptors || []).map(function (d) { return h("li", { text: d }); })),
    ]);
    return h("li", { class: "sector" }, [bg, inner]);
  }));

  /* ------------------------------------------------------------------
     Photo credits (Unsplash licence doesn't require it — we do it anyway)
     ------------------------------------------------------------------ */
  var seen = {};
  var names = Object.keys(photos).map(function (k) { return photos[k].by; })
    .filter(function (n) { if (seen[n]) return false; seen[n] = true; return true; });
  var credits = document.querySelector('[data-render="credits"]');
  if (credits && names.length) {
    credits.appendChild(document.createTextNode("Photography: " + names.join(", ") + " via "));
    credits.appendChild(h("a", { href: "https://unsplash.com", target: "_blank", rel: "noopener", text: "Unsplash" }));
    credits.appendChild(document.createTextNode("."));
  }

  /* ------------------------------------------------------------------
     Vision — progression, honest about where we are today
     ------------------------------------------------------------------ */
  mount("vision", (C.vision || []).map(function (name, i) {
    var when = i === 0 ? "Now" : i === 1 ? "Next" : "In time";
    return h("li", { class: "stage" + (i === 0 ? " stage--now" : "") }, [
      h("span", { class: "stage__marker", "aria-hidden": "true" }),
      h("span", { class: "stage__when", text: when }),
      h("span", { class: "stage__name", text: name }),
    ]);
  }));

  /* ------------------------------------------------------------------
     Footer links — no dead links: empty URLs render as "Coming soon"
     ------------------------------------------------------------------ */
  mount("links", (C.links || []).map(function (l) {
    var url = l.url === "mailto:" ? (site.email ? "mailto:" + site.email : "") : l.url;
    if (!url) {
      return h("li", null, [h("span", null, [l.label, h("small", { text: "Soon" })])]);
    }
    var attrs = { href: url, "data-track": "social_" + l.label.toLowerCase() };
    if (external(url)) { attrs.target = "_blank"; attrs.rel = "noopener"; }
    return h("li", null, [h("a", attrs, [l.label])]);
  }));

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Header: scrolled state, active section, mobile menu
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var heroLogo = document.querySelector(".hero__logo");

  function onScroll() {
    var threshold = heroLogo ? heroLogo.getBoundingClientRect().bottom : 40;
    header.classList.toggle("is-scrolled", threshold < 0 || window.scrollY > window.innerHeight * 0.5);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    header.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); } });
  window.matchMedia("(min-width: 861px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  if ("IntersectionObserver" in window) {
    var navLinks = document.querySelectorAll(".site-nav a");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------------------------------------------
     Contact dialog
     ------------------------------------------------------------------ */
  var dialog = document.getElementById("contact-dialog");
  var form = dialog.querySelector(".contact-form");
  var status = form.querySelector(".form-status");
  var lastFocus = null;

  function openDialog() {
    lastFocus = document.activeElement;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    setTimeout(function () { form.querySelector("input").focus(); }, 50);
  }
  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }
  dialog.addEventListener("close", function () {
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  });
  document.querySelectorAll("[data-open-contact]").forEach(function (b) { b.addEventListener("click", openDialog); });
  dialog.querySelector("[data-close-contact]").addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });

  // Nav "Contact" links scroll to the section; deep link #contact-form opens the dialog.
  if (location.hash === "#contact-form") openDialog();

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status" + (kind ? " is-" + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var ok = f.value.trim() !== "" && (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.closest(".field").classList.toggle("has-error", !ok);
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok) valid = false;
    });
    if (!valid) {
      setStatus("Please add your name, a valid email and a message.", "error");
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    var data = Object.fromEntries(new FormData(form).entries());

    if (site.formEndpoint) {
      setStatus("Sending…");
      fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        track("contact_submitted", { method: "form" });
        form.reset();
        setStatus("Thank you — your message has been sent.", "success");
      }).catch(function () {
        setStatus("Something went wrong. Please email " + site.email + " directly.", "error");
      });
      return;
    }

    // No backend configured: hand off to the visitor's email client.
    var subject = "Sport Within enquiry — " + data.name + (data.organisation ? " (" + data.organisation + ")" : "");
    var body = [
      data.message, "", "—",
      data.name,
      [data.role, data.organisation].filter(Boolean).join(", "),
      data.email,
    ].filter(function (l) { return l !== undefined; }).join("\n");
    track("contact_submitted", { method: "mailto" });
    window.location.href = "mailto:" + site.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setStatus("Your email app should open with the message ready to send.", "success");
  });

  /* ------------------------------------------------------------------
     Hero page-load reveal
     ------------------------------------------------------------------ */
  // setTimeout fallback: rAF is paused in background tabs, and the hero must never stay hidden.
  function loaded() { root.classList.add("is-loaded"); }
  requestAnimationFrame(function () { requestAnimationFrame(loaded); });
  setTimeout(loaded, 400);
})();
