const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const navLinks = [...document.querySelectorAll('.nav-link')];
const backTop = document.querySelector('[data-back-top]');
const parallaxImage = document.querySelector('[data-parallax]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projects = [
  {
    title: 'Akbulut Deniz Sitesi',
    category: 'Konut + Ticari',
    year: '2026',
    location: 'Büyükçekmece',
    area: '32420 m²',
    image: 'assets/ads1.png',
    description:
      'Kordonboyu Caddesi üzerinde bulunan kentsel dönüşüm projemiz, panoramik balonlarla kesintisiz deniz manzarasını kullanıcılarına sunmaktadır.',
    gallery: ['assets/ads1.png', 'assets/project2.jpg', 'assets/project3.jpg'],
  },
  {
    title: 'Stone Apartment',
    category: 'Interior',
    year: '2025',
    location: 'İstanbul',
    area: '165 m²',
    image: 'assets/project2.jpg',
    description:
      'A calm interior proposal defined by limestone surfaces, warm joinery and carefully held daylight.',
    gallery: ['assets/project2.jpg', 'assets/project1.jpg', 'assets/project3.jpg'],
  },
  {
    title: 'Urban Frame',
    category: 'Visualization',
    year: '2025',
    location: 'İstanbul',
    area: '8.200 m²',
    image: 'assets/project3.jpg',
    description:
      'A visual study for an urban residential frame, developed to clarify mass, depth and evening atmosphere.',
    gallery: ['assets/project3.jpg', 'assets/project1.jpg', 'assets/project2.jpg'],
  },
];

function setHeaderState() {
  const isScrolled = window.scrollY > 40;
  header.classList.toggle('scrolled', isScrolled);
  backTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);

  if (parallaxImage && !prefersReducedMotion) {
    parallaxImage.style.transform = 'translate3d(0, ' + window.scrollY * 0.12 + 'px, 0) scale(1.04)';
  }
}

function toggleMenu(forceOpen) {
  const open = typeof forceOpen === 'boolean' ? forceOpen : !navMenu.classList.contains('is-open');
  navMenu.classList.toggle('is-open', open);
  header.classList.toggle('menu-active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  document.body.classList.toggle('nav-open', open);
}

navToggle.addEventListener('click', () => toggleMenu());
navLinks.forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((element) => {
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll('main section[id]')];
const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  },
  { threshold: 0.38 }
);

sections.forEach((section) => spyObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('[data-counter]').forEach((counter) => counterObserver.observe(counter));

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = prefersReducedMotion ? 1 : 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const modal = document.querySelector('[data-modal]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalCategory = document.querySelector('[data-modal-category]');
const modalYear = document.querySelector('[data-modal-year]');
const modalLocation = document.querySelector('[data-modal-location]');
const modalArea = document.querySelector('[data-modal-area]');
const modalDescription = document.querySelector('[data-modal-description]');
const modalImage = document.querySelector('[data-modal-image]');
const modalGallery = document.querySelector('[data-modal-gallery]');
let lastFocusedElement = null;

function openProject(index) {
  const project = projects[index];
  if (!project) return;

  lastFocusedElement = document.activeElement;
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalYear.textContent = project.year;
  modalLocation.textContent = project.location;
  modalArea.textContent = project.area;
  modalDescription.textContent = project.description;
  modalImage.src = project.image;
  modalImage.alt = project.title;
  modalGallery.innerHTML = project.gallery
    .map((src) => '<img src="' + src + '" alt="' + project.title + ' detail" loading="lazy" />')
    .join('');

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}

function closeProject() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll('[data-project]').forEach((card) => {
  const index = Number(card.dataset.project);
  card.addEventListener('click', () => openProject(index));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(index);
    }
  });
});

document.querySelectorAll('[data-modal-close]').forEach((element) => {
  element.addEventListener('click', closeProject);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeProject();
});

const slider = document.querySelector('[data-slider]');
const testimonials = slider ? [...slider.querySelectorAll('.testimonial')] : [];
const sliderButtons = slider ? [...slider.querySelectorAll('[data-slide]')] : [];
let activeSlide = 0;
let slideTimer = null;

function showSlide(index) {
  activeSlide = index;
  testimonials.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
  sliderButtons.forEach((button, buttonIndex) => button.classList.toggle('active', buttonIndex === index));
}

function startSlider() {
  if (prefersReducedMotion || testimonials.length < 2) return;
  slideTimer = window.setInterval(() => showSlide((activeSlide + 1) % testimonials.length), 4800);
}

sliderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    window.clearInterval(slideTimer);
    showSlide(Number(button.dataset.slide));
    startSlider();
  });
});

startSlider();

const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const invalidFields = fields.filter((field) => !field.checkValidity());

  fields.forEach((field) => field.closest('label').classList.toggle('invalid', !field.checkValidity()));

  if (invalidFields.length) {
    formStatus.textContent = 'Please complete the required fields.';
    invalidFields[0].focus();
    return;
  }

  formStatus.textContent = 'Thank you. We will contact you shortly.';
  form.reset();
});

document.querySelectorAll('.button').forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = event.offsetX + 'px';
    ripple.style.top = event.offsetY + 'px';
    button.append(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  });
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

window.addEventListener('load', () => {
  window.setTimeout(() => document.body.classList.add('loaded'), 420);
});

window.setTimeout(() => document.body.classList.add('loaded'), 1800);
