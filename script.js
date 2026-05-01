/* ============================================================
   Emoti:on — script.js
   IntersectionObserver 기반 스크롤 애니메이션 + FAQ 아코디언
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. prefers-reduced-motion 체크 ─────────────────── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ── 2. 스크롤 애니메이션 (fade-up) ─────────────────── */
  function initScrollAnimations() {
    if (prefersReducedMotion) {
      // 모션 감소 설정 시 모든 요소 즉시 표시
      document.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // 미지원 브라우저 fallback
      document.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 3. FAQ 아코디언 ─────────────────────────────────── */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // 다른 항목 닫기 (한 번에 하나만 열기)
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            var otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            var otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
          }
        });

        // 현재 항목 토글
        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          var answer = item.querySelector('.faq-answer');
          if (answer) answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          var answer = item.querySelector('.faq-answer');
          if (answer) answer.setAttribute('aria-hidden', 'false');
        }
      });

      // 키보드 접근성: Enter / Space
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ── 4. Navbar 스크롤 감지 ───────────────────────────── */
  function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 5. 모바일 메뉴 토글 ─────────────────────────────── */
  function initMobileMenu() {
    var menuBtn = document.querySelector('.navbar__menu-btn');
    var mobileMenu = document.querySelector('.navbar__mobile-menu');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');

      if (isOpen) {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', '메뉴 열기');
      } else {
        mobileMenu.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', '메뉴 닫기');
      }
    });

    // 모바일 메뉴 링크 클릭 시 닫기
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', '메뉴 열기');
      });
    });
  }

  /* ── 6. 부드러운 스크롤 (앵커 링크) ─────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        var navbarHeight = 64;
        var targetTop =
          targetEl.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight -
          16;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      });
    });
  }

  /* ── 7. 현재 연도 자동 주입 ──────────────────────────── */
  function initCurrentYear() {
    var yearEls = document.querySelectorAll('.js-current-year');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ── 8. 초기화 ───────────────────────────────────────── */
  function init() {
    initScrollAnimations();
    initFaqAccordion();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initCurrentYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
