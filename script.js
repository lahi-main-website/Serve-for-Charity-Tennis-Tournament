     // ── NAV scroll ──
    window.addEventListener("scroll", () => {
      document
        .getElementById("nav")
        .classList.toggle("scrolled", window.scrollY > 60);
    });

    // ── OPEN DONATION (PayPal) ──
    function openDonationPaypal() {
      const btn = document.getElementById("btn-open-donation");
      const paypalBox = document.getElementById(
        "paypal-container-FBWA6HHXDXQUS",
      );
      btn.style.display = "none";
      paypalBox.style.display = "block";
      if (!paypalBox.dataset.rendered) {
        paypal
          .HostedButtons({ hostedButtonId: "FBWA6HHXDXQUS" })
          .render("#paypal-container-FBWA6HHXDXQUS");
        paypalBox.dataset.rendered = "true";
      }
    }

    // ── THANK YOU: called after PayPal success ──
    function showThankYouPlay() {
      openThankYou();
    }

    // Also show thank-you if someone just donated (alias)
    function showThankYouAttend() {
      openThankYou();
    }

    function openThankYou() {
      document.getElementById("ty-overlay").classList.add("open");
      document.body.style.overflow = "hidden";
      launchConfetti();
    }

    // ── DETECT PAYPAL RETURN ──
    // PayPal hosted buttons call the return URL set in your PayPal dashboard.
    // As a fallback, we also listen for PayPal's postMessage from the iframe.
    window.addEventListener("message", (e) => {
      if (
        e.data &&
        (e.data.name === "approve" ||
          (typeof e.data === "string" && e.data.includes("APPROVED")))
      ) {
        showThankYouPlay();
      }
    });

    // Also check if PayPal appended ?paypal=success to URL (set this as return URL in PayPal dashboard)
    if (
      window.location.search.includes("paypal=success") ||
      window.location.hash.includes("paypal-success")
    ) {
      setTimeout(showThankYouPlay, 400);
    }

    // ── CONFETTI ──
    const confettiColors = [
      "#d4a843",
      "#e8c96a",
      "#1a6b4a",
      "#2d8f65",
      "#c8d930",
      "#fff",
      "#f0a500",
    ];
    function launchConfetti() {
      const wrap = document.getElementById("confettiWrap");
      for (let i = 0; i < 100; i++) {
        const el = document.createElement("div");
        el.className = "confetti-piece";
        const size = Math.random() * 10 + 6;
        el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}vw;
        background:${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        animation-duration:${Math.random() * 2 + 2}s;
        animation-delay:${Math.random() * 1}s;
        opacity:0;
      `;
        wrap.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }
    }

    document.getElementById("customForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const donationChoice = formData.get("entry.1660362454");

      const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSdEtiSoyJT4X_qL3vw3JllFchTVPPvs1CKTWEo2SCOvsii_9w/formResponse";
      fetch(googleFormURL, { method: "POST", mode: "no-cors", body: formData });

      // Hide form & step number
      form.style.display = "none";
      const stepNum = document.getElementById("step-gform").querySelector(".step-num");
      if (stepNum) stepNum.style.display = "none";

      if (donationChoice === "No") {
        // No donation selected → go straight to thank you
        showThankYouAttend();
      } else {
        // Yes → show payment step and auto-render PayPal immediately
        const paymentStep = document.getElementById("step-payment");
        paymentStep.style.display = "flex";

        // Hide the manual button since PayPal renders automatically
        const manualBtn = document.getElementById("btn-open-donation");
        if (manualBtn) manualBtn.style.display = "none";

        // Auto-render PayPal buttons
        const paypalBox = document.getElementById("paypal-container-FBWA6HHXDXQUS");
        paypalBox.style.display = "block";
        if (!paypalBox.dataset.rendered) {
          paypal.HostedButtons({ hostedButtonId: "FBWA6HHXDXQUS" })
            .render("#paypal-container-FBWA6HHXDXQUS");
          paypalBox.dataset.rendered = "true";
        }

        paymentStep.scrollIntoView({ behavior: "smooth" });
      }

      form.reset();
    });
