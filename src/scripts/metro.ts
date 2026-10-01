/* Metro behaviours: press tilt, live-tile flips, wheel→horizontal, lightbox. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* If a page is restored from bfcache mid-transition, the zoom overlays and
   hidden canvas would freeze on screen — strip them and restore visibility. */
let bfCacheBound = false;
function bindBfCacheRestore(): void {
  if (bfCacheBound) return;
  bfCacheBound = true;
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    document.querySelectorAll('.tile-ghost, .tile-splash').forEach((el) => el.remove());
    document.querySelectorAll<HTMLElement>('.tile').forEach((t) => {
      t.style.visibility = '';
    });
    document.querySelectorAll<HTMLElement>('.start-canvas, .pano').forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.style.opacity = '';
      el.style.transform = '';
    });
  });
}

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

/* ---- Tile launch: camera flies into the tapped tile, then navigates. ---- */
export function initTileZoom(root: ParentNode = document): void {
  if (reduceMotion) return;
  bindBfCacheRestore();
  let launched = false;
  root.querySelectorAll<HTMLAnchorElement>('a.tile').forEach((tile) => {
    tile.addEventListener('click', (e) => {
      if (
        launched || e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || tile.target === '_blank'
      ) return;
      const url = new URL(tile.getAttribute('href') ?? '', location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      launched = true;
      try {
        launchTile(tile, url);
      } catch {
        location.href = url.href;
      }
    });
  });
}

function launchTile(tile: HTMLElement, url: URL): void {
  const rect = tile.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(vw / rect.width, vh / rect.height) * 1.04;
  const tx = (vw - rect.width * scale) / 2 - rect.left;
  const ty = (vh - rect.height * scale) / 2 - rect.top;
  const dur = 460;
  const easeIn = 'cubic-bezier(0.55, 0, 0.85, 0.3)';

  // Ghost copy pinned over the real tile; it becomes the surface we dive into.
  const ghost = tile.cloneNode(true) as HTMLElement;
  ghost.classList.add('tile-ghost');
  ghost.removeAttribute('href');
  ghost.setAttribute('aria-hidden', 'true');
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    zIndex: '70',
    pointerEvents: 'none',
    animation: 'none',
    transformOrigin: '0 0',
  });
  const ghostInner = ghost.querySelector<HTMLElement>('.tile-inner');
  if (ghostInner) {
    ghostInner.style.transform = '';
    ghostInner.style.transition = 'none';
  }
  document.body.appendChild(ghost);
  tile.style.visibility = 'hidden';
  document.querySelector('.scroll-hint')?.remove();

  // Splash payload the destination page picks up before its first paint.
  try {
    const iconImg = tile.querySelector<HTMLImageElement>('.tile-brand img');
    const glyph = tile.querySelector<HTMLElement>('.tile-glyph');
    sessionStorage.setItem(
      'tile-enter',
      JSON.stringify({
        path: url.pathname,
        color: tile.style.getPropertyValue('--tile-color').trim() || null,
        icon: iconImg?.currentSrc || iconImg?.src || null,
        glyph: glyph?.querySelector('path')?.getAttribute('d') ?? null,
        glyphFill: glyph?.classList.contains('tile-glyph--fill') ?? false,
        name: tile.querySelector('.tile-face.is-front .tile-name')?.textContent?.trim() || null,
        dark: tile.dataset.text === 'dark',
        t: Date.now(),
      }),
    );
  } catch { /* private mode etc. — arrive without splash */ }

  const canvas = tile.closest<HTMLElement>('.start-canvas') ?? document.querySelector<HTMLElement>('.start-canvas');
  if (canvas) {
    canvas.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
    canvas.animate(
      [{ transform: 'scale(1)', opacity: '1' }, { transform: 'scale(3)', opacity: '0' }],
      { duration: dur, easing: easeIn, fill: 'forwards' },
    );
  }
  ghost.animate(
    [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${tx}px, ${ty}px) scale(${scale})` }],
    { duration: dur, easing: easeIn, fill: 'forwards' },
  );
  // Dive through the surface: end on the tile's pure colour, not its contents.
  ghostInner?.animate(
    [{ opacity: '1' }, { opacity: '0' }],
    { duration: 130, delay: dur - 140, easing: 'ease-in', fill: 'forwards' },
  );

  setTimeout(() => {
    location.href = url.href;
  }, dur - 30);
}

/* ---- Tile exit: leaving an app closes it back into its colour, then ----
   ---- the start screen zooms back out of the tile (initTileReturn). ---- */
export function initTileExit(root: ParentNode = document): void {
  if (reduceMotion) return;
  bindBfCacheRestore();
  let exiting = false;
  root.querySelectorAll<HTMLAnchorElement>('a.back-arrow').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (
        exiting || e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank'
      ) return;
      const url = new URL(link.getAttribute('href') ?? '', location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      exiting = true;
      try {
        exitToStart(link, url);
      } catch {
        location.href = url.href;
      }
    });
  });
}

function exitToStart(link: HTMLElement, url: URL): void {
  const pano = link.closest<HTMLElement>('.pano') ?? document.querySelector<HTMLElement>('.pano');
  const color = pano?.style.getPropertyValue('--accent').trim() || '#101014';
  const dark = pano?.style.getPropertyValue('--accent-text').trim().toLowerCase() === '#12140a';
  const name = pano?.querySelector('.pano-title')?.textContent?.trim() ?? null;
  const icon = pano?.dataset.icon ?? null;

  const overlay = document.createElement('div');
  overlay.className = `tile-splash${dark ? ' is-dark' : ''}`;
  overlay.style.background = color;
  const content = document.createElement('div');
  content.className = 'tile-splash-content';
  if (icon) {
    const img = document.createElement('img');
    img.src = icon;
    img.alt = '';
    content.appendChild(img);
  }
  if (name) {
    const label = document.createElement('span');
    label.className = 'tile-splash-name';
    label.textContent = name;
    content.appendChild(label);
  }
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // The start screen reads this and shrinks the splash into the matching tile.
  try {
    sessionStorage.setItem(
      'tile-exit',
      JSON.stringify({ to: url.pathname, from: location.pathname, color, icon, name, dark, t: Date.now() }),
    );
  } catch { /* arrive without splash */ }

  const dur = 340;
  const easeIn = 'cubic-bezier(0.55, 0, 0.85, 0.3)';
  pano?.animate(
    [{ transform: 'scale(1)', opacity: '1' }, { transform: 'scale(0.94)', opacity: '0' }],
    { duration: dur, easing: easeIn, fill: 'forwards' },
  );
  overlay.animate(
    [{ opacity: '0' }, { opacity: '1' }],
    { duration: dur * 0.7, easing: 'ease-out', fill: 'forwards' },
  );
  if (content.childNodes.length) {
    content.animate(
      [{ opacity: '0', transform: 'scale(0.92)' }, { opacity: '1', transform: 'scale(1)' }],
      { duration: 220, delay: dur * 0.45, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)', fill: 'backwards' },
    );
  }
  setTimeout(() => {
    location.href = url.href;
  }, dur + 140);
}

/* ---- Tile return: on the start screen, shrink the splash into its tile. ---- */
export function initTileReturn(): void {
  const splash = document.querySelector<HTMLElement>('.tile-splash[data-from]');
  if (!splash || reduceMotion) return;
  const tile = document.querySelector<HTMLElement>(`a.tile[href="${splash.dataset.from}"]`);
  const canvas = document.querySelector<HTMLElement>('.start-canvas');
  if (!tile || !canvas) {
    splash.animate([{ opacity: '1' }, { opacity: '0' }], { duration: 300, fill: 'forwards' });
    setTimeout(() => splash.remove(), 340);
    return;
  }

  // Behind the opaque splash: bring the target tile on-screen, hide it until
  // the splash lands exactly on it.
  tile.scrollIntoView({ block: 'center', inline: 'center' });
  const r = tile.getBoundingClientRect();
  tile.style.visibility = 'hidden';

  const hold = 200;
  const dur = 480;
  const easeMetro = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
  canvas.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  canvas.animate(
    [{ opacity: '0', transform: 'scale(1.6)' }, { opacity: '1', transform: 'scale(1)' }],
    { duration: dur, delay: hold + 60, easing: easeMetro, fill: 'backwards' },
  );
  splash.querySelector<HTMLElement>('.tile-splash-content')?.animate(
    [{ opacity: '1' }, { opacity: '0' }],
    { duration: 170, delay: hold, easing: 'ease-in', fill: 'forwards' },
  );
  // Page accent can differ from tile colour (e.g. pageAccent) — swap at shrink.
  setTimeout(() => {
    const tc = tile.style.getPropertyValue('--tile-color').trim();
    if (tc) splash.style.background = tc;
  }, hold);

  splash.style.transformOrigin = '0 0';
  const shrink = splash.animate(
    [
      { transform: 'translate(0px, 0px) scale(1, 1)' },
      {
        transform: `translate(${r.left}px, ${r.top}px) scale(${r.width / window.innerWidth}, ${r.height / window.innerHeight})`,
      },
    ],
    { duration: dur, delay: hold, easing: easeMetro, fill: 'forwards' },
  );
  const finish = () => {
    tile.style.visibility = '';
    splash.remove();
  };
  shrink.onfinish = finish;
  setTimeout(finish, hold + dur + 400);
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

/* ---- Scroll hint: a faint "Scroll →" in the corner until the visitor ----
   ---- first scrolls sideways; remembered, so it only ever shows once. ---- */
const HINT_KEY = 'hscroll-learned';

export function initScrollHint(): void {
  const el = document.querySelector<HTMLElement>('[data-hscroll]');
  if (!el) return;
  try {
    if (localStorage.getItem(HINT_KEY)) return;
  } catch { /* storage blocked — hint shows per visit instead */ }

  // Baseline taken after initTileReturn's scrollIntoView, so only real scrolling counts.
  const start = el.scrollLeft;
  let hint: HTMLButtonElement | null = null;
  let done = false;

  const fit = () => hint?.classList.toggle('is-shown', el.scrollWidth - el.clientWidth > 48);
  const learn = () => {
    if (Math.abs(el.scrollLeft - start) < 40) return;
    done = true;
    el.removeEventListener('scroll', learn);
    window.removeEventListener('resize', fit);
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch { /* ignore */ }
    const h = hint;
    h?.classList.remove('is-shown');
    setTimeout(() => h?.remove(), 700);
  };
  el.addEventListener('scroll', learn, { passive: true });

  // Wait for the tile fly-in to settle so the hint doesn't compete with it.
  setTimeout(() => {
    if (done) return;
    hint = document.createElement('button');
    hint.type = 'button';
    hint.className = 'scroll-hint';
    hint.tabIndex = -1; // keyboard focus already scrolls tiles into view
    hint.setAttribute('aria-hidden', 'true');
    const verb = window.matchMedia('(pointer: coarse)').matches ? 'Swipe' : 'Scroll';
    hint.innerHTML = `<span>${verb}</span><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" /></svg>`;
    hint.addEventListener('click', () => {
      el.scrollBy({ left: el.clientWidth * 0.75, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    document.body.appendChild(hint);
    void hint.offsetWidth; // commit opacity 0 so the fade-in transitions
    fit();
    window.addEventListener('resize', fit);
  }, 1600);
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
