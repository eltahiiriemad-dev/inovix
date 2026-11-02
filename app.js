(function () {
  "use strict";

  /* Mobile menu */
  var btn = document.getElementById("menu-btn");
  var panel = document.getElementById("menu-panel");
  function setMenu(open) {
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
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

  /* Formspree: replace YOUR_FORM_ID in contact.html (the action and
     data-endpoint attributes) with your form's ID from formspree.io. */
  var ENDPOINT = form.getAttribute("data-endpoint") || "";
  if (/YOUR_FORM_ID/.test(ENDPOINT)) ENDPOINT = "";

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
    if (field.required && !v) { setErr(field, field.getAttribute("data-req") || "This field is required."); return false; }
    if (field.type === "email" && v && !emailRe.test(v)) { setErr(field, "Enter a valid email address, for example name@company.com."); return false; }
    if (field.name === "message" && v && v.length < 20) { setErr(field, "Add a little more detail, at least 20 characters."); return false; }
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
    if (!ok) { first.focus(); show("bad", "Please fix the highlighted fields and send again."); return; }
    if (form.querySelector(".hp input").value) return; /* spam trap */

    if (!ENDPOINT) {
      show("bad", "This form is not connected to a mailbox yet, so your message was not sent. Please try again later.");
      return;
    }
    submit.disabled = true;
    submit.firstChild.textContent = "Sending";
    fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          show("ok", "Thank you. Your message has been sent and we will get back to you by email.");
          return;
        }
        return r.json().then(function (d) {
          var m = d && d.errors && d.errors.map(function (x) { return x.message; }).join(" ");
          show("bad", m || "Your message could not be sent. Please try again.");
        }, function () { show("bad", "Your message could not be sent. Please try again."); });
      })
      .catch(function () {
        show("bad", "Your message could not be sent. Check your connection and try again.");
      })
      .then(function () {
        submit.disabled = false;
        submit.firstChild.textContent = "Send message";
      });
  });
})();
