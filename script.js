'use strict';

// Wrap everything in a listener to make sure the HTML is loaded first
document.addEventListener('DOMContentLoaded', () => {
  const G = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalFile = document.getElementById('modal-file');
  const welcomePopup = document.getElementById('welcome-popup');

  /* ── HORIZONTAL SCROLL (Mouse Wheel) ── */
  // This converts vertical wheel movement into horizontal scrolling
  G.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      G.scrollLeft += e.deltaY;
    }
  });

  /* ── WELCOME POPUP ── */
  // Hide popup when clicked
  if (welcomePopup) {
    welcomePopup.onclick = () => {
      welcomePopup.style.opacity = '0';
      setTimeout(() => welcomePopup.style.display = 'none', 500);
    };
  }

  /* ── AUDIO ── */
  const sounds = {
    connected: new Audio('sounds/ping.mp3'),
    chaos:     new Audio('sounds/glitch.mp3'),
    balance:   new Audio('sounds/ambient.mp3')
  };
  const playedSections = new Set();
  Object.values(sounds).forEach(a => { a.loop = false; a.volume = 0.4; });

  function triggerAudio(section) {
    if (!section || playedSections.has(section)) return;
    if (sounds[section]) {
      sounds[section].play().catch(() => console.log("Interaction needed for audio"));
      playedSections.add(section);
    }
  }

  /* ── OBSERVING SECTIONS ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerAudio(entry.target.id);
      }
    });
  }, { root: G, threshold: 0.5 });

  ['connected', 'chaos', 'balance'].forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  /* ── MODAL LOGIC ── */
  window.openModal = function(img) {
    modalImg.src = img.src;
    modalFile.textContent = img.src.split('/').pop();
    modal.classList.add('open');
  };

  window.closeModal = function() {
    modal.classList.remove('open');
    setTimeout(() => { if(!modal.classList.contains('open')) modalImg.src=''; }, 320);
  };

  document.getElementById('modal-x').onclick = closeModal;
  modal.onclick = (e) => { if(e.target === modal) closeModal(); };
  
  window.handleBuy = function() {
    alert('Print: ' + modalFile.textContent + '\nPrice: N$1000.00\nContact: stevenbanda01@gmail.com');
  };
});