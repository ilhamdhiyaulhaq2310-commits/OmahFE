// Supabase
const SUPABASE_URL = "https://odvsvexamcgyvlvaylpi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2mqM-z5vZpg4qExQYh4q5w_kH1vwpu0";

const supabaseClient =
  window.supabase && SUPABASE_URL.startsWith("https://")
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Hamburger menu dan navbar
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
const navbar = document.querySelector(".navbar");

if (navbar) {
  const syncNavbarHeight = () => {
    document.documentElement.style.setProperty(
      "--navbar-h",
      `${navbar.offsetHeight}px`,
    );
  };
  syncNavbarHeight();

  if ("ResizeObserver" in window) {
    new ResizeObserver(syncNavbarHeight).observe(navbar);
  } else {
    window.addEventListener("resize", syncNavbarHeight);
  }
}

if (hamburger && navbarNav) {
  hamburger.onclick = (e) => {
    e.preventDefault();
    navbarNav.classList.toggle("active");
  };

  // Klik di luar sidebar untuk menutup nav
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    }
  });

  // Menutup menu otomatis saat salah satu link navigasi diklik
  navbarNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbarNav.classList.remove("active");
    });
  });
}

// Portofolio show more
const portofolioSection = document.getElementById("portofolio");
const row = document.getElementById("portofolio-row");
const btnShowMore = document.getElementById("btn-show-more");
const btnText = document.getElementById("btn-text");

if (row && btnShowMore && btnText) {
  const cards = Array.from(row.querySelectorAll(".portofolio-card"));
  let isExpanded = false;

  function getFirstRowCount() {
    if (cards.length === 0) return 0;

    cards.forEach((card) => card.classList.remove("is-hidden"));

    const firstCardTop = cards[0].offsetTop;
    let count = 0;

    for (const card of cards) {
      if (card.offsetTop === firstCardTop) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  function updateCardsVisibility() {
    const visibleCount = getFirstRowCount();

    if (cards.length <= visibleCount) {
      btnShowMore.style.display = "none";
      return;
    } else {
      btnShowMore.style.display = "inline-flex";
    }

    cards.forEach((card, index) => {
      if (!isExpanded && index >= visibleCount) {
        card.classList.add("is-hidden");
        card.classList.remove("fade-in");
      } else {
        card.classList.remove("is-hidden");
        if (isExpanded && index >= visibleCount) {
          card.classList.add("fade-in");
        }
      }
    });
  }

  btnShowMore.addEventListener("click", (e) => {
    e.preventDefault();
    isExpanded = !isExpanded;
    updateCardsVisibility();

    if (isExpanded) {
      btnText.textContent = "Show Less";
      btnShowMore.classList.add("active");
    } else {
      btnText.textContent = "Show More";
      btnShowMore.classList.remove("active");
      portofolioSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  updateCardsVisibility();
  window.addEventListener("resize", updateCardsVisibility);
}

// Testimonial slider
const testiSlider = document.getElementById("testi-slider");
const btnPrev = document.getElementById("testi-prev");
const btnNext = document.getElementById("testi-next");

if (testiSlider && btnPrev && btnNext) {
  const getScrollStep = () => {
    const firstCard = testiSlider.querySelector(".testimonial-card");
    // Membaca nilai gap aktual dari CSS agar akurat di semua ukuran layar
    const sliderStyle = window.getComputedStyle(testiSlider);
    const gap = parseFloat(sliderStyle.gap) || 24;
    return firstCard ? firstCard.offsetWidth + gap : 300;
  };

  btnNext.addEventListener("click", () => {
    testiSlider.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  });

  btnPrev.addEventListener("click", () => {
    testiSlider.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  });

  // Geser Manual dengan Klik & Tarik Mouse (Drag to Scroll)
  let isDown = false;
  let startX;
  let scrollLeft;

  testiSlider.addEventListener("mousedown", (e) => {
    isDown = true;
    testiSlider.classList.add("is-dragging");
    startX = e.pageX - testiSlider.offsetLeft;
    scrollLeft = testiSlider.scrollLeft;
  });

  testiSlider.addEventListener("mouseleave", () => {
    isDown = false;
    testiSlider.classList.remove("is-dragging");
  });

  testiSlider.addEventListener("mouseup", () => {
    isDown = false;
    testiSlider.classList.remove("is-dragging");
  });

  testiSlider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - testiSlider.offsetLeft;
    const walk = (x - startX) * 1.5;
    testiSlider.scrollLeft = scrollLeft - walk;
  });
}

// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const questionBtn = item.querySelector(".faq-question");

  questionBtn.addEventListener("click", () => {
    const isAlreadyActive = item.classList.contains("active");

    // Tutup semua item FAQ lain terlebih dahulu agar rapi
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
    });

    // Jika item yang diklik tadi belum terbuka, buka sekarang
    if (!isAlreadyActive) {
      item.classList.add("active");
    }
  });
});

// Contact form
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name")?.value.trim();
    const lastName = document.getElementById("last-name")?.value.trim();
    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const message = document.getElementById("message")?.value.trim();

    formStatus.classList.remove("is-success", "is-error");

    if (!firstName || !lastName || !email || !message) {
      formStatus.textContent = "Mohon lengkapi data yang wajib diisi.";
      formStatus.classList.add("is-error");
      return;
    }

    if (!supabaseClient) {
      formStatus.textContent =
        "Layanan pengiriman belum siap. Muat ulang halaman lalu coba lagi.";
      formStatus.classList.add("is-error");
      return;
    }

    const submitBtn = contactForm.querySelector(".btn-send");
    const submitLabel = submitBtn?.querySelector("span");
    const defaultLabel = submitLabel?.textContent;

    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending...";
    formStatus.textContent = "Mengirim pesan...";

    try {
      const { error } = await supabaseClient.from("contact_messages").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        message,
      });

      if (error) throw error;

      formStatus.textContent = `Terima kasih, ${firstName}. Pesanmu sudah terkirim.`;
      formStatus.classList.add("is-success");
      contactForm.reset();
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      formStatus.textContent =
        "Pesan gagal terkirim. Silakan coba lagi beberapa saat lagi.";
      formStatus.classList.add("is-error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = defaultLabel;
    }
  });
}

// Sign in & sign up
const authModal = document.getElementById("auth-modal");
const authBackdrop = document.getElementById("auth-modal-backdrop");
const authCloseBtn = document.getElementById("auth-close");
const signInBtn = document.querySelector(".navbar-extra .sign-in");
const signUpBtn = document.querySelector(".navbar-extra .sign-up");
const navbarExtra = document.querySelector(".navbar-extra");

const tabSignIn = document.getElementById("tab-signin");
const tabSignUp = document.getElementById("tab-signup");
const modalTitle = document.getElementById("auth-modal-title");
const signInForm = document.getElementById("signin-form");
const signUpForm = document.getElementById("signup-form");
const signInFeedback = document.getElementById("signin-feedback");
const signUpFeedback = document.getElementById("signup-feedback");

const setFeedback = (el, msg, type = "") => {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("is-error", "is-success");
  if (type) el.classList.add(type);
};

const switchMode = (mode) => {
  const isSignIn = mode === "signin";
  tabSignIn?.classList.toggle("is-active", isSignIn);
  tabSignUp?.classList.toggle("is-active", !isSignIn);
  signInForm?.classList.toggle("is-hidden", !isSignIn);
  signUpForm?.classList.toggle("is-hidden", isSignIn);
  if (modalTitle) {
    modalTitle.innerHTML = isSignIn
      ? "Masuk ke Omah<span>FE</span>"
      : "Daftar Akun Omah<span>FE</span>";
  }
  setFeedback(signInFeedback, "");
  setFeedback(signUpFeedback, "");
};

const openModal = (mode = "signin") => {
  if (!authModal) return;
  switchMode(mode);
  authModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  if (!authModal) return;
  authModal.classList.remove("is-open");
  document.body.style.overflow = "";
};

const renderNavbarUser = (user) => {
  document.getElementById("navbar-user-badge")?.remove();
  document.getElementById("navbar-logout-btn")?.remove();

  if (user && navbarExtra) {
    if (signInBtn) signInBtn.style.display = "none";
    if (signUpBtn) signUpBtn.style.display = "none";

    const nama =
      user.user_metadata?.full_name || user.email?.split("@")[0] || "Member";

    const badge = document.createElement("span");
    badge.id = "navbar-user-badge";
    badge.className = "navbar-user-badge";
    badge.textContent = `Hi, ${nama}`;

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "navbar-logout-btn";
    logoutBtn.type = "button";
    logoutBtn.className = "btn-logout";
    logoutBtn.textContent = "Logout";

    // Sign out resmi lewat supabaseClient.auth.signOut()
    logoutBtn.addEventListener("click", async () => {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
    });

    const hamburgerEl = document.getElementById("hamburger-menu");
    navbarExtra.insertBefore(badge, hamburgerEl || null);
    navbarExtra.insertBefore(logoutBtn, hamburgerEl || null);
  } else {
    if (signInBtn) signInBtn.style.display = "";
    if (signUpBtn) signUpBtn.style.display = "";
  }
};

signInBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal("signin");
});

signUpBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal("signup");
});

tabSignIn?.addEventListener("click", () => switchMode("signin"));
tabSignUp?.addEventListener("click", () => switchMode("signup"));
authCloseBtn?.addEventListener("click", closeModal);
authBackdrop?.addEventListener("click", closeModal);

// Proses Sign Up ke Supabase Auth
signUpForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!supabaseClient) {
    setFeedback(
      signUpFeedback,
      "Konfigurasi Supabase belum diisi.",
      "is-error",
    );
    return;
  }

  const name = document.getElementById("signup-name")?.value.trim();
  const email = document
    .getElementById("signup-email")
    ?.value.trim()
    .toLowerCase();
  const password = document.getElementById("signup-password")?.value;
  const submitBtn = signUpForm.querySelector(".auth-submit");

  if (!name || !email || !password || password.length < 6) {
    setFeedback(
      signUpFeedback,
      "Isi nama, email, dan password (min. 6 karakter).",
      "is-error",
    );
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  setFeedback(signUpFeedback, "Mendaftarkan akun...");

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (submitBtn) submitBtn.disabled = false;

  if (error) {
    setFeedback(signUpFeedback, error.message, "is-error");
    return;
  }

  if (data.session) {
    setFeedback(
      signUpFeedback,
      "Akun dibuat dan langsung masuk!",
      "is-success",
    );
    signUpForm.reset();
    setTimeout(closeModal, 500);
  } else {
    setFeedback(
      signUpFeedback,
      "Pendaftaran berhasil! Silakan cek email untuk verifikasi lalu Sign In.",
      "is-success",
    );
    signUpForm.reset();
  }
});

// Proses Sign In ke Supabase Auth
signInForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!supabaseClient) {
    setFeedback(
      signInFeedback,
      "Konfigurasi Supabase belum diisi.",
      "is-error",
    );
    return;
  }

  const email = document
    .getElementById("signin-email")
    ?.value.trim()
    .toLowerCase();
  const password = document.getElementById("signin-password")?.value;
  const submitBtn = signInForm.querySelector(".auth-submit");

  if (!email || !password) {
    setFeedback(signInFeedback, "Email dan password wajib diisi.", "is-error");
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  setFeedback(signInFeedback, "Sedang masuk...");

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (submitBtn) submitBtn.disabled = false;

  if (error) {
    setFeedback(signInFeedback, error.message, "is-error");
    return;
  }

  setFeedback(signInFeedback, "Berhasil masuk!", "is-success");
  signInForm.reset();
  setTimeout(closeModal, 500);
});

// Pantau sesi awal & perubahan status login secara otomatis
if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    renderNavbarUser(data.session?.user || null);
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    renderNavbarUser(session?.user || null);
  });
}

// Highlight link navbar sesuai section yang sedang aktif
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav a[href^='#']");

if (sections.length > 0 && navLinks.length > 0) {
  const setActiveNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      }
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();
}
