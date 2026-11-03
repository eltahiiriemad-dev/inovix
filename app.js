(function () {
  "use strict";
  function T(s) { return window.__tr ? window.__tr(s) : s; }

  /* Live chat on WhatsApp. Put the business number here in international
     format with digits only (country code first, no + or spaces), for
     example "212600000000". Until it is set, the chat button says the
     chat is not connected yet. */
  var WHATSAPP_NUMBER = "212728041767";
  var WHATSAPP_TEXT = "Hello Inovix Technologies, I would like to talk about a project.";

  (function chat() {
    var wa = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 00-8.4 15.1L2 22l5-1.6A9.9 9.9 0 1012.04 2zm0 1.8a8.1 8.1 0 11-4.3 15l-.3-.2-2.9.9.9-2.8-.2-.3A8.1 8.1 0 0112.04 3.8zM8.6 7.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.3-1.8-.9c-.3-.1-.5-.1-.7.1l-.8 1c-.1.2-.3.2-.6.1-.3-.2-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2.1-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4z"/></svg>';
    var live = /^\d{8,15}$/.test(WHATSAPP_NUMBER);
    var href = live ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(T(WHATSAPP_TEXT)) : "";
    var box = document.createElement("div");
    box.className = "chat";
    box.innerHTML =
      '<div class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat with us" inert>' +
        '<div class="chat-head"><b>Chat with us</b><span>We reply on WhatsApp</span></div>' +
        '<div class="chat-body"><div class="bubble">Hello. Tell us what you are working on and we will reply as soon as we can.</div>' +
        (live
          ? '<a class="btn wa" href="' + href + '" target="_blank" rel="noopener">' + wa + 'Chat on WhatsApp</a><p class="chat-note">Opens WhatsApp in a new tab.</p>'
          : '<p class="off">Live chat is not connected yet. For now, please use the contact form.</p><a class="btn btn-primary" href="contact.html">Open contact form</a>') +
        '</div></div>' +
      '<button class="chat-fab" id="chat-btn" type="button" aria-expanded="false" aria-controls="chat-panel" aria-label="Open chat">' +
        '<svg class="m" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v8a2.5 2.5 0 01-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 014 13.5z"/><path d="M8.5 8.5h7M8.5 11.5h4.5"/></svg>' +
        '<svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg><i class="chat-dot"></i></button>';
    document.body.appendChild(box);
    var waLink = box.querySelector("a.wa");
    document.addEventListener("langchange", function () {
      if (waLink) waLink.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(T(WHATSAPP_TEXT));
    });
    var fab = box.querySelector("#chat-btn"), pn = box.querySelector("#chat-panel"), dot = box.querySelector(".chat-dot");
    function set(o) {
      fab.setAttribute("aria-expanded", String(o));
      fab.setAttribute("aria-label", T(o ? "Close chat" : "Open chat"));
      pn.classList.toggle("open", o);
      pn.toggleAttribute("inert", !o);
      if (o && dot) dot.style.display = "none";
    }
    fab.addEventListener("click", function () { set(fab.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && fab.getAttribute("aria-expanded") === "true") { set(false); fab.focus(); }
    });
  })();

  /* Cookie consent. The choice is remembered in this browser only. */
  (function cookies() {
    var KEY = "inovix-cookie-consent";
    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
    var box = document.createElement("div");
    box.className = "cookie";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookie preferences");
    box.setAttribute("inert", "");
    box.innerHTML =
      '<h2>We value your privacy</h2>' +
      '<p>We use cookies to make this website work and, with your permission, to understand how it is used so we can improve it. Read our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions"><button class="btn btn-ghost" type="button" data-c="essential">Essential only</button>' +
      '<button class="btn btn-primary" type="button" data-c="all">Accept all</button></div>';
    document.body.appendChild(box);
    function show() {
      box.removeAttribute("inert");
      document.body.style.setProperty("--cookie-h", box.offsetHeight + "px");
      box.classList.add("show");
      document.body.classList.add("cookie-open");
    }
    function hide() {
      box.classList.remove("show");
      box.setAttribute("inert", "");
      document.body.classList.remove("cookie-open");
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-c]");
      if (!b) return;
      write(b.getAttribute("data-c"));
      hide();
    });
    document.querySelectorAll("a[data-cookie]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); show(); });
    });
    if (!read()) setTimeout(show, 700);
  })();

  /* Legal pages are not built yet: keep those links from jumping the page */
  document.querySelectorAll("a[data-soon]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* Pause control for the hero demo */
  var vt = document.getElementById("viz-toggle");
  if (vt) vt.addEventListener("click", function () {
    var p = vt.getAttribute("aria-pressed") !== "true";
    vt.setAttribute("aria-pressed", String(p));
    vt.textContent = p ? "Play animation" : "Pause animation";
    vt.closest(".viz").classList.toggle("paused", p);
  });

  /* Mobile menu */
  var btn = document.getElementById("menu-btn");
  var panel = document.getElementById("menu-panel");
  function setMenu(open) {
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", T(open ? "Close menu" : "Open menu"));
    panel.classList.toggle("open", open);
    document.body.classList.toggle("lock", open);
    panel.toggleAttribute("inert", !open);
  }
  if (btn && panel) {
    panel.setAttribute("inert", "");
    btn.addEventListener("click", function () {
      setMenu(btn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        btn.focus();
      }
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* Contact form */
  var form = document.getElementById("contact-form");
  if (!form) return;

  /* Formspree: the form ID is set in contact.html (the action and
     data-endpoint attributes). */
  var ENDPOINT = form.getAttribute("data-endpoint") || "";

  var status = document.getElementById("form-status");
  var submit = document.getElementById("form-submit");
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setErr(field, text) {
    var wrap = field.closest(".field");
    var msg = wrap.querySelector(".msg");
    wrap.classList.toggle("err", !!text);
    field.setAttribute("aria-invalid", text ? "true" : "false");
    if (msg) msg.textContent = text || "";
  }
  function check(field) {
    var v = field.value.trim();
    if (field.required && !v) { setErr(field, T(field.getAttribute("data-req") || "This field is required.")); return false; }
    if (field.type === "email" && v && !emailRe.test(v)) { setErr(field, T("Enter a valid email address, for example name@company.com.")); return false; }
    if (field.name === "message" && v && v.length < 20) { setErr(field, T("Add a little more detail, at least 20 characters.")); return false; }
    setErr(field, "");
    return true;
  }
  function show(kind, text) {
    status.className = "status show " + kind;
    status.textContent = text;
    status.setAttribute("role", kind === "bad" ? "alert" : "status");
  }

  var fields = form.querySelectorAll(".field input, .field select, .field textarea");
  fields.forEach(function (f) {
    f.addEventListener("blur", function () { if (f.value || f.closest(".field").classList.contains("err")) check(f); });
    f.addEventListener("input", function () { if (f.closest(".field").classList.contains("err")) check(f); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "status";
    var first = null, ok = true;
    fields.forEach(function (f) { if (!check(f)) { ok = false; if (!first) first = f; } });
    if (!ok) { first.focus(); show("bad", T("Please fix the highlighted fields and send again.")); return; }
    if (form.querySelector(".hp input").value) return; /* spam trap */

    if (!ENDPOINT) {
      show("bad", T("This form is not connected to a mailbox yet, so your message was not sent. Please try again later."));
      return;
    }
    submit.disabled = true;
    submit.firstChild.textContent = T("Sending") + " ";
    fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          show("ok", T("Thank you. Your message has been sent and we will get back to you by email."));
          return;
        }
        return r.json().then(function (d) {
          var m = d && d.errors && d.errors.map(function (x) { return x.message; }).join(" ");
          show("bad", m || T("Your message could not be sent. Please try again."));
        }, function () { show("bad", T("Your message could not be sent. Please try again.")); });
      })
      .catch(function () {
        show("bad", T("Your message could not be sent. Check your connection and try again."));
      })
      .then(function () {
        submit.disabled = false;
        submit.firstChild.textContent = T("Send message") + " ";
      });
  });
})();
