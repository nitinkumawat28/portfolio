import { numbersTheme } from '../data/theme';

export type LayerType = 'far' | 'mid' | 'near';

interface SpriteInfo {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

interface FloatingItem {
  text: string;
  layer: LayerType;
  isAccent: boolean;
  fontSize: number;
  baseOpacity: number;
  speed: number;
  x: number;
  y: number;
  phase: number;
  // Dynamic interaction & sway offsets
  offsetX: number;
  targetOffsetX: number;
  // Flip animation state
  isFlipping: boolean;
  flipStart: number;
  flipDuration: number;
  newTextCandidate?: string;
  newAccentCandidate?: boolean;
  flipFlash: number; // 0 to 1
  // Click pulse boost
  speedBoost: number; // 0 to 1
  pulseFlash: number; // 0 to 1
}

export interface FloatingNumbersOptions {
  theme?: typeof numbersTheme;
  paused?: boolean;
}

export class FloatingNumbersEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private theme: typeof numbersTheme;
  private items: FloatingItem[] = [];
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private isDestroyed = false;
  private isPaused = false;
  private isReducedMotion = false;
  private isMobile = false;

  private width = 0;
  private height = 0;
  private dpr = 1;

  // Mouse tracking
  private mouse = {
    x: -9999,
    y: -9999,
    active: false,
  };

  // Flip scheduling
  private nextFlipTime = 0;
  private activeFlipCount = 0;

  // Click pulses
  private pulses: { x: number; y: number; time: number }[] = [];

  // Performance / adaptive quality
  private frameTimes: number[] = [];
  private qualityDegraded = false;

  // Resize debouncing
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  // Sprite Cache: key = `${text}|${layer}|${isAccent}`
  private spriteCache = new Map<string, SpriteInfo>();

  // Bound listeners
  private boundOnPointerMove: (e: PointerEvent) => void;
  private boundOnPointerLeave: () => void;
  private boundOnClick: (e: MouseEvent | TouchEvent) => void;
  private boundOnVisibilityChange: () => void;

  constructor(canvas: HTMLCanvasElement, options?: FloatingNumbersOptions) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    this.theme = options?.theme ?? numbersTheme;
    this.isPaused = !!options?.paused;

    this.checkReducedMotion();

    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerLeave = this.onPointerLeave.bind(this);
    this.boundOnClick = this.onClick.bind(this);
    this.boundOnVisibilityChange = this.onVisibilityChange.bind(this);

    this.init();
  }

  private checkReducedMotion() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  public setPaused(paused: boolean) {
    if (this.isPaused === paused) return;
    this.isPaused = paused;
    if (!this.isPaused && !this.isDestroyed && document.visibilityState !== 'hidden') {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  private async init() {
    this.updateDimensions();

    // Ensure fonts are loaded before pre-rendering sprites
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.load("14px 'JetBrains Mono'");
      } catch {
        // Fallback to default monospace if custom font loading fails
      }
    }

    if (this.isDestroyed) return;

    this.prepopulateSprites();
    this.createItems();

    this.nextFlipTime = performance.now() + this.getRandomFlipDelay();

    window.addEventListener('pointermove', this.boundOnPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.boundOnPointerLeave, { passive: true });
    window.addEventListener('click', this.boundOnClick, { passive: true });
    document.addEventListener('visibilitychange', this.boundOnVisibilityChange);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.handleResize();
        }, 150);
      });
      if (this.canvas.parentElement) {
        this.resizeObserver.observe(this.canvas.parentElement);
      } else {
        this.resizeObserver.observe(document.body);
      }
    }

    if (this.isReducedMotion) {
      this.draw();
    } else {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  private getRandomFlipDelay(): number {
    const [min, max] = this.theme.flipEveryMs;
    return min + Math.random() * (max - min);
  }

  private getRandomContent(): string {
    const r = Math.random();
    const p = this.theme.pool;
    if (r < 0.55) {
      return p.numbers[Math.floor(Math.random() * p.numbers.length)];
    } else if (r < 0.75) {
      return p.percents[Math.floor(Math.random() * p.percents.length)];
    } else if (r < 0.90) {
      return p.symbols[Math.floor(Math.random() * p.symbols.length)];
    } else {
      return p.stats[Math.floor(Math.random() * p.stats.length)];
    }
  }

  private getRandomLayer(): LayerType {
    const r = Math.random();
    if (r < 0.50) return 'far';
    if (r < 0.85) return 'mid';
    return 'near';
  }

  private getLayerProperties(layer: LayerType) {
    switch (layer) {
      case 'far':
        return {
          fontSize: 11 + Math.random() * 2, // 11-13 px
          speed: 12 + Math.random() * 10,   // 12-22 px/s
          baseOpacity: 0.05,                // 5% opacity
          blur: 1.2,
        };
      case 'mid':
        return {
          fontSize: 14 + Math.random() * 4, // 14-18 px
          speed: 24 + Math.random() * 16,   // 24-40 px/s
          baseOpacity: 0.05,                // 5% opacity
          blur: 0,
        };
      case 'near':
        return {
          fontSize: 20 + Math.random() * 8, // 20-28 px
          speed: 42 + Math.random() * 23,   // 42-65 px/s
          baseOpacity: 0.05,                // 5% opacity
          blur: 0.8,
        };
    }
  }

  // Pre-render text string into a cached offscreen canvas sprite
  private getSprite(text: string, layer: LayerType, isAccent: boolean): SpriteInfo {
    const key = `${text}|${layer}|${isAccent ? 1 : 0}`;
    const cached = this.spriteCache.get(key);
    if (cached) return cached;

    const layerProps = this.getLayerProperties(layer);
    const fontSize = Math.round(layerProps.fontSize * this.dpr);

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) {
      return { canvas: offscreen, width: 0, height: 0 };
    }

    const fontStr = `${fontSize}px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`;
    offCtx.font = fontStr;
    const metrics = offCtx.measureText(text);

    const padding = Math.ceil(8 * this.dpr);
    const w = Math.ceil(metrics.width) + padding * 2;
    const h = Math.ceil(fontSize * 1.5) + padding * 2;

    offscreen.width = w;
    offscreen.height = h;

    offCtx.font = fontStr;
    offCtx.textBaseline = 'middle';
    offCtx.textAlign = 'center';

    // Apply soft blur for far/near layers once in the sprite
    if (layerProps.blur > 0) {
      offCtx.filter = `blur(${layerProps.blur * this.dpr}px)`;
    }

    offCtx.fillStyle = isAccent ? this.theme.accent : `rgb(${this.theme.text})`;
    offCtx.fillText(text, w / 2, h / 2);

    const sprite: SpriteInfo = {
      canvas: offscreen,
      width: w / this.dpr,
      height: h / this.dpr,
    };

    this.spriteCache.set(key, sprite);
    return sprite;
  }

  private prepopulateSprites() {
    const p = this.theme.pool;
    const all = [...p.numbers, ...p.percents, ...p.symbols, ...p.stats];
    const layers: LayerType[] = ['far', 'mid', 'near'];

    for (const text of all) {
      for (const layer of layers) {
        this.getSprite(text, layer, false);
        this.getSprite(text, layer, true);
      }
    }
  }

  private updateDimensions() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.width = w;
    this.height = h;
    this.isMobile = w < 768;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);
  }

  private getTargetItemCount(): number {
    const area = this.width * this.height;
    if (this.isMobile) {
      const count = Math.round(area / 26000);
      return Math.min(Math.max(count, 22), 45);
    }
    const count = Math.round(area / 16000);
    const calculated = Math.min(Math.max(count, 35), this.theme.maxItems);
    if (this.qualityDegraded) {
      return Math.max(22, Math.round(calculated * 0.7));
    }
    return calculated;
  }

  private createItem(existingY?: number): FloatingItem {
    const text = this.getRandomContent();
    const layer = this.getRandomLayer();
    const isAccent = Math.random() < this.theme.accentShare;
    const layerProps = this.getLayerProperties(layer);

    return {
      text,
      layer,
      isAccent,
      fontSize: layerProps.fontSize,
      baseOpacity: layerProps.baseOpacity,
      speed: layerProps.speed,
      x: Math.random() * this.width,
      y: existingY !== undefined ? existingY : Math.random() * this.height,
      phase: Math.random() * Math.PI * 2,
      offsetX: 0,
      targetOffsetX: 0,
      isFlipping: false,
      flipStart: 0,
      flipDuration: 250,
      flipFlash: 0,
      speedBoost: 0,
      pulseFlash: 0,
    };
  }

  private createItems() {
    const targetCount = this.getTargetItemCount();
    const newItems: FloatingItem[] = [];

    // Keep existing items during resize to prevent visual pops
    const keepCount = Math.min(this.items.length, targetCount);
    for (let i = 0; i < keepCount; i++) {
      const item = this.items[i];
      item.x = Math.min(item.x, this.width);
      item.y = Math.min(item.y, this.height);
      newItems.push(item);
    }

    for (let i = keepCount; i < targetCount; i++) {
      newItems.push(this.createItem());
    }

    this.items = newItems;
  }

  private handleResize() {
    if (this.isDestroyed) return;
    const oldDpr = this.dpr;
    this.updateDimensions();
    if (oldDpr !== this.dpr) {
      this.spriteCache.clear();
      this.prepopulateSprites();
    }
    this.createItems();
    if (this.isReducedMotion) {
      this.draw();
    }
  }

  private onPointerMove(e: PointerEvent) {
    if (this.isMobile) return;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
  }

  private onPointerLeave() {
    this.mouse.active = false;
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  private onClick(e: MouseEvent | TouchEvent) {
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    } else {
      return;
    }

    const now = performance.now();
    this.pulses.push({ x: clientX, y: clientY, time: now });

    // Click pulse: nearby items speed up and flash green for 0.6s
    const pulseRadius = 220;
    const pulseRadiusSq = pulseRadius * pulseRadius;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const dx = item.x - clientX;
      const dy = item.y - clientY;
      if (dx * dx + dy * dy < pulseRadiusSq) {
        item.speedBoost = 1.0;
        item.pulseFlash = 1.0;
      }
    }
  }

  private onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    } else {
      if (!this.isPaused && !this.isDestroyed && !this.isReducedMotion) {
        this.lastTime = performance.now();
        this.loop(this.lastTime);
      }
    }
  }

  private update(dt: number, now: number) {
    // 1. Ticker flip schedule: every 2-4 seconds, max 2 concurrent flips
    if (now >= this.nextFlipTime && this.activeFlipCount < 2 && !this.isReducedMotion) {
      const candidates = this.items.filter((it) => !it.isFlipping);
      if (candidates.length > 0) {
        const itemToFlip = candidates[Math.floor(Math.random() * candidates.length)];
        itemToFlip.isFlipping = true;
        itemToFlip.flipStart = now;
        itemToFlip.flipDuration = 250;
        itemToFlip.newTextCandidate = this.getRandomContent();
        itemToFlip.newAccentCandidate = Math.random() < this.theme.accentShare;
        itemToFlip.flipFlash = 1.0;
        this.activeFlipCount++;
      }
      this.nextFlipTime = now + this.getRandomFlipDelay();
    }

    const mouseX = this.mouse.x;
    const mouseY = this.mouse.y;
    const mouseRadius = this.theme.mouseRadius;
    const mouseRadiusSq = mouseRadius * mouseRadius;
    const isMouseActive = !this.isMobile && this.mouse.active;

    // 2. Update each item
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      // Handle click pulse decay over 0.6s
      if (item.speedBoost > 0) {
        item.speedBoost = Math.max(0, item.speedBoost - (dt / 0.6));
      }
      if (item.pulseFlash > 0) {
        item.pulseFlash = Math.max(0, item.pulseFlash - (dt / 0.6));
      }

      // Handle flip animation
      if (item.isFlipping) {
        const elapsed = now - item.flipStart;
        const p = elapsed / item.flipDuration;
        if (p >= 0.5 && item.newTextCandidate) {
          // Switch to new text at peak vertical squeeze
          item.text = item.newTextCandidate;
          if (item.newAccentCandidate !== undefined) {
            item.isAccent = item.newAccentCandidate;
          }
          item.newTextCandidate = undefined;
        }
        item.flipFlash = Math.max(0, 1 - p);
        if (p >= 1) {
          item.isFlipping = false;
          this.activeFlipCount = Math.max(0, this.activeFlipCount - 1);
        }
      }

      // Upward drift (with temporary speed boost during click pulse)
      const currentSpeed = item.speed * (1 + item.speedBoost * 1.6);
      item.y -= currentSpeed * dt;

      // Respawn when item leaves top: spawn below bottom at random x with fresh layer & value
      if (item.y < -40) {
        const fresh = this.createItem(this.height + 20 + Math.random() * 30);
        Object.assign(item, fresh);
      }

      // Cursor interaction (desktop only): nudge gently sideways away from cursor
      if (isMouseActive) {
        const dx = item.x - mouseX;
        const dy = item.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = 1 - dist / mouseRadius;
          const nudgeDir = dx >= 0 ? 1 : -1;
          item.targetOffsetX = nudgeDir * (force * this.theme.mouseNudge);
        } else {
          item.targetOffsetX = 0;
        }
      } else {
        item.targetOffsetX = 0;
      }

      // Ease offset smoothly back and forth
      item.offsetX += (item.targetOffsetX - item.offsetX) * Math.min(1, 10 * dt);
    }
  }

  private draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Draw Background Gradient
    const bgGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bgGradient.addColorStop(0, this.theme.bgCenter);
    bgGradient.addColorStop(1, this.theme.bg);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    const mouseX = this.mouse.x;
    const mouseY = this.mouse.y;
    const mouseRadius = this.theme.mouseRadius;
    const mouseRadiusSq = mouseRadius * mouseRadius;
    const isMouseActive = !this.isMobile && this.mouse.active;

    const topFadeBoundary = h * 0.12;
    const bottomFadeBoundary = h * 0.88;
    const bottomFadeHeight = h * 0.12;

    const timeSec = performance.now() * 0.001;
    const enableSway = !this.qualityDegraded && !this.isReducedMotion;

    // 2. Render cached sprites
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      // Sideways sway: sin(time * 0.6 + phase) * 6px
      const sway = enableSway ? Math.sin(timeSec * 0.6 + item.phase) * 6 : 0;
      const renderX = item.x + sway + item.offsetX;
      const renderY = item.y;

      // Vertical edge fade (top & bottom 12% fade in/out so nothing pops)
      let edgeFactor = 1;
      if (renderY < topFadeBoundary) {
        edgeFactor = Math.max(0, renderY / topFadeBoundary);
      } else if (renderY > bottomFadeBoundary) {
        edgeFactor = Math.max(0, (h - renderY) / bottomFadeHeight);
      }

      // Cursor brighten: within 160px radius, opacity boost up to +0.35 eased
      let cursorBoost = 0;
      if (isMouseActive) {
        const dx = renderX - mouseX;
        const dy = renderY - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouseRadiusSq) {
          const dist = Math.sqrt(distSq);
          cursorBoost = (1 - dist / mouseRadius) * this.theme.mouseBoost;
        }
      }

      let alpha = (item.baseOpacity + cursorBoost) * edgeFactor;
      if (item.pulseFlash > 0) {
        alpha = Math.min(1, alpha + item.pulseFlash * 0.35);
      }
      alpha = Math.min(Math.max(alpha, 0), 1);

      if (alpha <= 0.001) continue;

      const isGreenFlash = item.flipFlash > 0 || item.pulseFlash > 0;
      const sprite = this.getSprite(item.text, item.layer, item.isAccent || isGreenFlash);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Live ticker flip: scale-y 1 → 0 → 1
      if (item.isFlipping) {
        const elapsed = performance.now() - item.flipStart;
        const p = Math.min(1, elapsed / item.flipDuration);
        const scaleY = Math.abs(Math.cos(p * Math.PI));
        ctx.translate(renderX, renderY);
        ctx.scale(1, Math.max(0.05, scaleY));
        ctx.drawImage(
          sprite.canvas,
          -sprite.width / 2,
          -sprite.height / 2,
          sprite.width,
          sprite.height
        );
      } else {
        ctx.drawImage(
          sprite.canvas,
          renderX - sprite.width / 2,
          renderY - sprite.height / 2,
          sprite.width,
          sprite.height
        );
      }

      ctx.restore();
    }
  }

  private loop(now: number) {
    if (this.isDestroyed || this.isPaused) return;

    const frameDelta = now - this.lastTime;
    this.lastTime = now;

    // Adaptive quality check: measure average frame time over 60 frames
    if (this.frameTimes.length < 60) {
      this.frameTimes.push(frameDelta);
    } else {
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      if (avg > 24 && !this.qualityDegraded) {
        this.qualityDegraded = true;
        this.createItems();
      }
      this.frameTimes = [];
    }

    // Delta time normalized in seconds (dt = Math.min(now - last, 33) / 1000)
    const dt = Math.min(frameDelta, 33) / 1000;

    this.update(dt, now);
    this.draw();

    this.animationFrameId = requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('pointermove', this.boundOnPointerMove);
    window.removeEventListener('pointerleave', this.boundOnPointerLeave);
    window.removeEventListener('click', this.boundOnClick);
    document.removeEventListener('visibilitychange', this.boundOnVisibilityChange);
    this.spriteCache.clear();
  }
}
