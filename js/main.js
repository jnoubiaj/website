/* ============================================================
   CapitalQuest Consulting — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigation ── */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  // Mobile dropdown toggles
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const arrow = toggle.querySelector('.toggle-arrow');
      content?.classList.toggle('open');
      if (arrow) arrow.style.transform = content?.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ── Testimonial Carousel ── */
  const carousel = document.querySelector('.carousel-track');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (carousel) {
    let current = 0;
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const total = slides.length;
    let autoTimer = null;

    const goTo = (index) => {
      current = (index + total) % total;
      carousel.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 4500);
    };

    const stopAuto = () => clearInterval(autoTimer);

    prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    // Touch/swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; stopAuto(); });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    });

    goTo(0);
    startAuto();
  }

  /* ── Funding Calculator ── */
  const scoreSlider = document.getElementById('credit-score');
  const revenueSlider = document.getElementById('monthly-revenue');
  const timeSlider = document.getElementById('time-in-business');
  const scoreVal = document.getElementById('score-val');
  const revenueVal = document.getElementById('revenue-val');
  const timeVal = document.getElementById('time-val');
  const calcRange = document.getElementById('calc-range');
  const calcRec = document.getElementById('calc-recommendation');
  const calcBadge = document.getElementById('calc-badge');
  const factorList = document.getElementById('calc-factors');

  if (scoreSlider && revenueSlider && timeSlider) {
    const updateCalc = () => {
      const score = parseInt(scoreSlider.value);
      const revenue = parseInt(revenueSlider.value);
      const months = parseInt(timeSlider.value);

      // Display values
      scoreVal.textContent = score;
      revenueVal.textContent = revenue >= 50000 ? '$50K+' : `$${(revenue/1000).toFixed(0)}K`;
      timeVal.textContent = months >= 120 ? '10+ yrs' : months >= 12 ? `${Math.floor(months/12)} yr${months >= 24 ? 's' : ''}` : `${months} mo`;

      // Update range fill
      [scoreSlider, revenueSlider, timeSlider].forEach(slider => {
        const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
      });

      // Calculate funding range
      let rangeMin = 0, rangeMax = 0, badge = '', badgeClass = '', rec = '', factors = [];

      if (score < 580) {
        rangeMin = 0; rangeMax = 0;
        badge = '⚠ Credit Needs Work'; badgeClass = 'red';
        rec = 'Your credit score is below our funding threshold. The good news — our Foundation program can help you repair and optimize your credit so you qualify within 3–6 months.';
        factors = [
          { color: '#ef4444', label: 'Credit score below 580 — Foundation program recommended' },
          { color: '#f59e0b', label: 'Focus on credit repair before applying for funding' },
          { color: '#22A7F0', label: 'Inquiry removal can boost score by 20–60 points' }
        ];
      } else if (score < 670) {
        const base = revenue >= 10000 ? 25000 : 10000;
        const top = revenue >= 30000 ? 75000 : 50000;
        const adjTop = months >= 6 ? top : top * 0.6;
        rangeMin = base; rangeMax = adjTop;
        badge = '✓ Fair Credit — Entry Funding'; badgeClass = 'yellow';
        rec = 'You qualify for our entry-level funding programs including 0% business credit cards and smaller BLOCs. Credit optimization can unlock significantly higher amounts.';
        factors = [
          { color: '#f59e0b', label: 'Fair credit opens entry-level 0% credit cards' },
          { color: '#22A7F0', label: revenue >= 10000 ? 'Revenue supports funding qualification' : 'Higher revenue will increase your range' },
          { color: months >= 6 ? '#10b981' : '#f59e0b', label: months >= 6 ? 'Business age meets minimum requirements' : 'Longer business history improves qualification' }
        ];
      } else if (score < 700) {
        const base = revenue >= 15000 ? 25000 : 10000;
        const top = revenue >= 30000 ? 150000 : 75000;
        rangeMin = base; rangeMax = top;
        badge = '✓ Good Credit — Solid Eligibility'; badgeClass = 'blue';
        rec = 'You qualify for BLOCs, term loans, and SBA products. Reach 700+ to unlock credit stacking — our highest-impact funding strategy.';
        factors = [
          { color: '#22A7F0', label: 'Score 700+ required to access credit stacking' },
          { color: revenue >= 15000 ? '#10b981' : '#22A7F0', label: revenue >= 15000 ? 'Revenue supports funding qualification' : 'Increasing revenue will expand your range' },
          { color: months >= 12 ? '#10b981' : '#22A7F0', label: months >= 12 ? '1+ year in business — strong qualifier' : 'More time in business helps SBA eligibility' }
        ];
      } else if (score < 740) {
        const base = revenue >= 15000 ? 50000 : 25000;
        const top = revenue >= 30000 ? 300000 : 150000;
        rangeMin = base; rangeMax = top;
        badge = '✓ Good Credit — Strong Eligibility'; badgeClass = 'blue';
        rec = 'You\'re in a strong position. Credit stacking, BLOCs, and term loans are within reach. With good revenue, we can build a multi-product funding strategy.';
        factors = [
          { color: '#10b981', label: 'Good credit score qualifies for most programs including credit stacking' },
          { color: revenue >= 15000 ? '#10b981' : '#22A7F0', label: revenue >= 15000 ? 'Strong revenue boosts funding capacity' : 'Increasing revenue will expand your range' },
          { color: months >= 12 ? '#10b981' : '#22A7F0', label: months >= 12 ? '1+ year in business — strong qualifier' : 'More time in business helps SBA eligibility' }
        ];
      } else {
        const base = revenue >= 20000 ? 150000 : 75000;
        const top = revenue >= 40000 ? 2000000 : revenue >= 20000 ? 750000 : 350000;
        rangeMin = base; rangeMax = top;
        badge = '★ Excellent Credit — Premium Access'; badgeClass = 'green';
        rec = 'Excellent profile. You qualify for our full suite including SBA loans, large BLOCs, and multi-stack credit programs. Let\'s build your complete funding strategy.';
        factors = [
          { color: '#10b981', label: 'Excellent credit unlocks SBA & premium programs' },
          { color: '#10b981', label: revenue >= 20000 ? 'Revenue qualifies for large funding amounts' : 'Boost revenue to access 7-figure funding' },
          { color: months >= 24 ? '#10b981' : '#22A7F0', label: months >= 24 ? '2+ years — SBA loan eligible' : 'Approaching SBA eligibility threshold' }
        ];
      }

      // Format range
      const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : '$0';
      if (rangeMax === 0) {
        calcRange.innerHTML = `<span>Start with</span> Foundation`;
      } else {
        calcRange.innerHTML = `${fmt(rangeMin)}–<span>${fmt(rangeMax)}</span>`;
      }

      calcBadge.textContent = badge;
      calcBadge.className = `calc-score-badge ${badgeClass}`;
      calcRec.textContent = rec;

      if (factorList) {
        factorList.innerHTML = factors.map(f =>
          `<div class="calc-factor"><div class="factor-dot" style="background:${f.color}"></div>${f.label}</div>`
        ).join('');
      }
    };

    [scoreSlider, revenueSlider, timeSlider].forEach(s => s.addEventListener('input', updateCalc));
    updateCalc();
  }

  /* ── Counter Animation ── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const countUp = (el) => {
      const target = parseFloat(el.dataset.target);
      const isFloat = el.dataset.target.includes('.');
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
        if (current >= target) clearInterval(timer);
      }, duration / steps);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          countUp(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ── Scroll Reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ── Apply Form Multi-Step ── */
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressFill = document.querySelector('.progress-fill');

  if (formSteps.length) {
    let currentStep = 0;

    const updateProgress = () => {
      const pct = (currentStep / (formSteps.length - 1)) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      progressSteps.forEach((s, i) => {
        s.classList.toggle('active', i === currentStep);
        s.classList.toggle('completed', i < currentStep);
      });
    };

    const validateStep = (step) => {
      let valid = true;
      const inputs = formSteps[step].querySelectorAll('input[required], select[required]');
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          input.classList.add('error');
          group?.classList.add('has-error');
          valid = false;
        } else {
          input.classList.remove('error');
          group?.classList.remove('has-error');
        }
      });
      return valid;
    };

    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          formSteps[currentStep].classList.remove('active');
          currentStep = Math.min(currentStep + 1, formSteps.length - 1);
          formSteps[currentStep].classList.add('active');
          updateProgress();
          window.scrollTo({ top: document.querySelector('.apply-container')?.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
        formSteps[currentStep].classList.remove('active');
        currentStep = Math.max(currentStep - 1, 0);
        formSteps[currentStep].classList.add('active');
        updateProgress();
      });
    });

    // Funding type card selection
    document.querySelectorAll('.funding-type-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.funding-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const hiddenInput = document.getElementById('selected-funding-type');
        if (hiddenInput) hiddenInput.value = card.dataset.value;
      });
    });

    updateProgress();
  }

  /* ── Loan Payment Calculator (product pages) ── */
  const loanCalc = document.querySelector('.loan-calc-section');
  if (loanCalc) {
    const amtSlider  = document.getElementById('lc-amount');
    const rateSlider = document.getElementById('lc-rate');
    const termSlider = document.getElementById('lc-term');
    const amtVal     = document.getElementById('lc-amount-val');
    const rateVal    = document.getElementById('lc-rate-val');
    const termVal    = document.getElementById('lc-term-val');
    const monthly    = document.getElementById('lc-monthly');
    const totalPay   = document.getElementById('lc-total');
    const totalInt   = document.getElementById('lc-interest');
    const calcType   = loanCalc.dataset.type || 'standard';

    const fmtMoney = (n) => n >= 1000000 ? '$' + (n/1000000).toFixed(2) + 'M' : '$' + Math.round(n).toLocaleString();

    const weeklyEl = document.getElementById('lc-weekly');
    // Detect light-theme sliders
    const lightSliders = document.querySelectorAll('.calc-slider-light');

    const updateLoanCalc = () => {
      const amt  = parseFloat(amtSlider.value);
      const rate = parseFloat(rateSlider.value);
      const term = parseFloat(termSlider.value);

      // Display labels
      amtVal.textContent  = fmtMoney(amt);
      termVal.textContent = calcType === 'mca' ? (term + ' wks') : (term + ' Months');

      // Slider fill
      [amtSlider, rateSlider, termSlider].forEach(s => {
        const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
        const isLight = s.classList.contains('calc-slider-light');
        const trackOff = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)';
        s.style.background = `linear-gradient(to right, #22A7F0 ${pct}%, ${trackOff} ${pct}%)`;
      });

      if (calcType === 'mca') {
        // MCA: factor rate
        const factor = rate; // slider value IS the factor rate (e.g. 1.25)
        rateVal.textContent = 'x' + factor.toFixed(2);
        const totalPayback = amt * factor;
        const weeklyPay    = totalPayback / term;
        const dailyPay     = weeklyPay / 5;
        monthly.innerHTML  = '$' + Math.round(dailyPay).toLocaleString() + '<span>/day</span>';
        totalPay.textContent = fmtMoney(totalPayback);
        totalInt.textContent = fmtMoney(totalPayback - amt);
      } else if (calcType === 'loc') {
        // LOC: interest-only on drawn amount
        rateVal.textContent = rate.toFixed(1) + '%';
        const monthlyInterest = (amt * (rate / 100)) / 12;
        monthly.innerHTML   = '$' + Math.round(monthlyInterest).toLocaleString() + '<span>/mo</span>';
        totalPay.textContent = fmtMoney(amt); // principal unchanged
        totalInt.textContent = fmtMoney(monthlyInterest * term);
      } else {
        // Standard amortization (term loans, SBA, equipment, credit stacking)
        rateVal.textContent = rate.toFixed(1) + '%';
        if (rate === 0) {
          const mp = amt / term;
          if (monthly.tagName) {
            monthly.textContent = '$' + Math.round(mp).toLocaleString();
          } else {
            monthly.innerHTML = '$' + Math.round(mp).toLocaleString() + '<span>/mo</span>';
          }
          if (weeklyEl) weeklyEl.textContent = '$' + Math.round(mp / (52/12)).toLocaleString();
          totalPay.textContent = fmtMoney(amt);
          totalInt.textContent = '$0';
        } else {
          const r  = (rate / 100) / 12;
          const mp = amt * r * Math.pow(1 + r, term) / (Math.pow(1 + r, term) - 1);
          const tp = mp * term;
          // Light theme uses textContent (no span), dark uses innerHTML
          if (monthly.querySelector && monthly.querySelector('span')) {
            monthly.innerHTML = '$' + Math.round(mp).toLocaleString() + '<span>/mo</span>';
          } else {
            monthly.textContent = '$' + Math.round(mp).toLocaleString();
          }
          if (weeklyEl) weeklyEl.textContent = '$' + Math.round(mp / (52/12)).toLocaleString();
          totalPay.textContent = fmtMoney(tp);
          totalInt.textContent = fmtMoney(tp - amt);
        }
      }
    };

    [amtSlider, rateSlider, termSlider].forEach(s => s?.addEventListener('input', updateLoanCalc));
    updateLoanCalc();
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
