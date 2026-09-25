/* Metro behaviours: press tilt, live-tile flips, wheel→horizontal, lightbox. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Press tilt: tiles lean toward the pointer while held (Win8). ---- */
export function initTilt(root: ParentNode = document): void {
  if (reduceMotion) return;
  root.querySelectorAll<HTMLElement>('.tile').forEach((tile) => {
    const inner = tile.querySelector<HTMLElement>('.tile-inner');
    if (!inner) return;
    const tilt = (e: PointerEvent) => {
      const r = tile.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateX(${(-py * 14).toFixed(2)}deg) rotateY(${(px * 14).toFixed(2)}deg)`;
      tile.classList.add('pressing');
    };
    const release = () => {
      inner.style.transform = '';
      tile.classList.remove('pressing');
    };
    tile.addEventListener('pointerdown', tilt);
    tile.addEventListener('pointerup', release);
    tile.addEventListener('pointerleave', release);
    tile.addEventListener('pointercancel', release);
  });
}

/* ---- Live tiles: cycle .tile-face children on staggered timers. ---- */
export function initLiveTiles(root: ParentNode = document): void {
  if (reduceMotion) return;
  let n = 0;
  root.querySelectorAll<HTMLElement>('.tile[data-live]').forEach((tile) => {
    const faces = Array.from(tile.querySelectorAll<HTMLElement>('.tile-face'));
    if (faces.length < 2) return;
    let current = 0;
    const period = 3400 + ((n += 1) * 937) % 2200; // stagger so tiles never flip together
    const tick = () => {
      const next = (current + 1) % faces.length;
      faces[next].classList.add('is-next');
      tile.classList.add('flipping');
      setTimeout(() => {
        faces[current].classList.remove('is-front');
        faces[next].classList.remove('is-next');
        faces[next].classList.add('is-front');
        tile.classList.remove('flipping');
        current = next;
      }, 460);
      setTimeout(tick, period);
    };
    setTimeout(tick, period + n * 400);
  });
}

/* ---- Wheel → horizontal scroll on .start-canvas / .pano. ---- */
export function initHorizontalScroll(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((el) => {
    el.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal gesture
        if (el.scrollWidth <= el.clientWidth) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      },
      { passive: false },
    );
  });
}

/* ---- Lightbox for galleries. ---- */
export function initLightbox(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('.gallery-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.full;
      const alt = btn.querySelector('img')?.alt ?? '';
      if (!src) return;
      const box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.innerHTML = `<img src="${src}" alt="">`;
      box.querySelector('img')!.setAttribute('alt', alt);
      const close = () => box.remove();
      box.addEventListener('click', close);
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', esc);
        }
      });
      document.body.appendChild(box);
    });
  });
}
