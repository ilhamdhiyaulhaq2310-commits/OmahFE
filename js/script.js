// UBAH: Menambahkan class 'js' ke <html> agar selector '.js .reveal' di CSS aktif
document.documentElement.classList.add("js");

/* =========================================
   1. NAVBAR & HAMBURGER MENU
   ========================================= */
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
// TAMBAH: Mengambil elemen navbar untuk efek shadow saat scroll
const navbar = document.querySelector(".navbar");

// UBAH: Menambahkan guard/cek elemen sebelum memasang event agar lebih aman
if (hamburger && navbarNav) {
  hamburger.onclick = (e) => {
    e.preventDefault();
    navbarNav.classList.toggle("active");
    // TAMBAH: Mengunci scroll body saat menu mobile terbuka (sesuai 'body.menu-open' di CSS)
    document.body.classList.toggle(
      "menu-open",
      navbarNav.classList.contains("active"),
    );
  };

  // Klik di luar sidebar untuk menutup nav
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // TAMBAH: Menutup menu otomatis saat salah satu link navigasi diklik
  navbarNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbarNav.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

/* =========================================
   2. PORTOFOLIO SHOW MORE / SHOW LESS
   ========================================= */
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

/* =========================================
   3. TESTIMONIAL SLIDER (TOMBOL & DRAG MANUAL)
   ========================================= */
const testiSlider = document.getElementById("testi-slider");
const btnPrev = document.getElementById("testi-prev");
const btnNext = document.getElementById("testi-next");

if (testiSlider && btnPrev && btnNext) {
  const getScrollStep = () => {
    // UBAH: Mengganti '.testi-card' menjadi '.testimonial-card' sesuai class di HTML & CSS
    const firstCard = testiSlider.querySelector(".testimonial-card");
    // TAMBAH: Membaca nilai gap aktual dari CSS agar akurat di semua ukuran layar
    const sliderStyle = window.getComputedStyle(testiSlider);
    const gap = parseFloat(sliderStyle.gap) || 24;
    return firstCard ? firstCard.offsetWidth + gap : 300;
  };

  // TAMBAH: Mengupdate status disabled tombol prev/next berdasarkan posisi scroll
  const updateSliderButtons = () => {
    const maxScrollLeft = testiSlider.scrollWidth - testiSlider.clientWidth - 2;
    btnPrev.disabled = testiSlider.scrollLeft <= 2;
    btnNext.disabled = testiSlider.scrollLeft >= maxScrollLeft;
  };

  btnNext.addEventListener("click", () => {
    testiSlider.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  });

  btnPrev.addEventListener("click", () => {
    testiSlider.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  });

  testiSlider.addEventListener("scroll", updateSliderButtons, {
    passive: true,
  });
  window.addEventListener("resize", updateSliderButtons);
  updateSliderButtons();

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

/* =========================================
   4. FAQ ACCORDION
   ========================================= */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const questionBtn = item.querySelector(".faq-question");

  // TAMBAH: Menambahkan atribut aria-expanded awal untuk aksesibilitas
  questionBtn.setAttribute("aria-expanded", "false");

  questionBtn.addEventListener("click", () => {
    const isAlreadyActive = item.classList.contains("active");

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
      const otherBtn = otherItem.querySelector(".faq-question");
      if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
    });

    if (!isAlreadyActive) {
      item.classList.add("active");
      questionBtn.setAttribute("aria-expanded", "true");
    }
  });
});

/* =========================================
   5. NAVBAR SCROLL SHADOW & BACK TO TOP
   ========================================= */
// TAMBAH: Mengontrol class '.is-scrolled' pada navbar dan '.is-visible' pada tombol back-to-top
const backToTopBtn = document.getElementById("back-to-top");

const handleScrollState = () => {
  const scrollY = window.scrollY;

  if (navbar) {
    navbar.classList.toggle("is-scrolled", scrollY > 20);
  }

  if (backToTopBtn) {
    backToTopBtn.classList.toggle("is-visible", scrollY > 400);
  }
};

window.addEventListener("scroll", handleScrollState, { passive: true });
handleScrollState();

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================
   6. CONTACT FORM HANDLER
   ========================================= */
// TAMBAH: Menangani submit form kontak dan menampilkan pesan pada '.form-status'
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    formStatus.classList.remove("is-success", "is-error");

    if (!firstName || !email || !message) {
      formStatus.textContent = "Mohon lengkapi data yang wajib diisi.";
      formStatus.classList.add("is-error");
      return;
    }

    const submitBtn = contactForm.querySelector(".btn-send");
    if (submitBtn) submitBtn.disabled = true;

    // Simulasi pengiriman pesan (bisa diganti fetch/API endpoint asli)
    setTimeout(() => {
      formStatus.textContent = `Terima kasih, ${firstName}. Pesanmu sudah tercatat.`;
      formStatus.classList.add("is-success");
      contactForm.reset();
      if (submitBtn) submitBtn.disabled = false;
    }, 400);
  });
}

/* =========================================
   SCROLL REVEAL & ACTIVE NAV LINK
   ========================================= */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animasi cukup sekali
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback jika browser lama tidak mendukung IntersectionObserver
  revealElements.forEach((el) => el.classList.add("is-visible"));
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

/* =========================================
   SIGN UP & SIGN IN DENGAN SUPABASE
   ========================================= */
// UBAH: Ganti nilai di bawah dengan Project URL dan Anon Key dari dashboard Supabase
const SUPABASE_URL = "https://odvsvexamcgyvlvaylpi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2mqM-z5vZpg4qExQYh4q5w_kH1vwpu0";

const supabaseClient =
  window.supabase && SUPABASE_URL.startsWith("https://")
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

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
    modalTitle.textContent = isSignIn
      ? "Masuk ke OmahFE"
      : "Daftar Akun OmahFE";
  }
  setFeedback(signInFeedback, "");
  setFeedback(signUpFeedback, "");
};

const openModal = (mode = "signin") => {
  if (!authModal) return;
  switchMode(mode);
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  if (!authModal) return;
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

// UBAH: Render badge user & tombol Logout berdasarkan session aktif dari Supabase
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

    // UBAH: Sign out resmi lewat supabaseClient.auth.signOut()
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

// UBAH: Proses Sign Up ke Supabase Auth
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

// UBAH: Proses Sign In ke Supabase Auth
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

// UBAH: Pantau sesi awal & perubahan status login secara otomatis
if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    renderNavbarUser(data.session?.user || null);
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    renderNavbarUser(session?.user || null);
  });
}
