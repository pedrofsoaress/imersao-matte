// components.jsx — shared UI primitives for the Matte landing page.

// ─── countdown hook ────────────────────────────────────────────────
function useCountdown(targetISO) {
  const target = React.useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, target - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s, done: ms <= 0 };
}

// ─── reveal-on-scroll ──────────────────────────────────────────────
function useReveal() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, as: As = "div", delay = 0, style, className = "", ...rest }) {
  const ref = useReveal();
  const s = { ...(style || {}), transitionDelay: delay ? `${delay}ms` : undefined };
  return <As ref={ref} className={`reveal ${className}`} style={s} {...rest}>{children}</As>;
}

// ─── animated count-up ─────────────────────────────────────────────
function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const ref = React.useRef(null);
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let raf;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (t) => {
            const k = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - k, 3);
            setValue(target * eased);
            if (k < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration]);
  const display = decimals ? value.toFixed(decimals) : Math.round(value).toString();
  return [ref, display];
}

// ─── primary CTA button ────────────────────────────────────────────
function CTA({ children, onClick, variant = "primary", size = "md", style, full = false, ...rest }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    border: "1px solid transparent", cursor: "pointer", borderRadius: 999,
    fontFamily: "var(--sans)", fontWeight: 500, letterSpacing: "-0.005em",
    transition: "transform .15s ease, background .2s ease, color .2s ease, border-color .2s ease",
    width: full ? "100%" : "auto",
    whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { padding: "10px 16px", fontSize: 13 },
    md: { padding: "14px 22px", fontSize: 15 },
    lg: { padding: "18px 28px", fontSize: 16 },
  };
  const variants = {
    primary: {
      background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)",
    },
    accent: {
      background: "var(--accent)", color: "var(--bg)", borderColor: "var(--accent)",
    },
    ghost: {
      background: "transparent", color: "var(--ink)", borderColor: "var(--line-2)",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
      {...rest}
    >
      {children}
      <span aria-hidden style={{ fontSize: "0.9em", marginLeft: -2 }}>↗</span>
    </button>
  );
}

// ─── particle text effect (canvas, matte palette) ─────────────────
const MATTE_PARTICLE_PALETTE = [
  { r: 212, g: 26,  b: 91  }, // #D41A5B accent
  { r: 232, g: 72,  b: 128 }, // #E84880 hot pink
  { r: 232, g: 93,  b: 60  }, // #E85D3C ember
  { r: 242, g: 239, b: 233 }, // #F2EFE9 ink highlight
];

function ParticleTextEffect({
  words = ["MATTE", "IMERSÃO", "IA", "UBERLÂNDIA", "11 · 06"],
  pixelSteps = 6,
  switchFrames = 240,
}) {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const particlesRef = React.useRef([]);
  const frameCountRef = React.useRef(0);
  const wordIndexRef = React.useRef(0);
  const mouseRef = React.useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const randomPos = (cx, cy, mag) => {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      const dx = rx - cx, dy = ry - cy;
      const m = Math.sqrt(dx*dx + dy*dy);
      if (m > 0) return { x: cx + (dx / m) * mag, y: cy + (dy / m) * mag };
      return { x: cx + mag, y: cy };
    };

    class Particle {
      constructor() {
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.closeEnoughTarget = 100;
        this.maxSpeed = 1.0;
        this.maxForce = 0.1;
        this.particleSize = 10;
        this.isKilled = false;
        this.startColor = { r: 0, g: 0, b: 0 };
        this.targetColor = { r: 0, g: 0, b: 0 };
        this.colorWeight = 0;
        this.colorBlendRate = 0.01;
      }
      move() {
        let prox = 1;
        const dx0 = this.pos.x - this.target.x;
        const dy0 = this.pos.y - this.target.y;
        const dist = Math.sqrt(dx0*dx0 + dy0*dy0);
        if (dist < this.closeEnoughTarget) prox = dist / this.closeEnoughTarget;
        const tx = this.target.x - this.pos.x;
        const ty = this.target.y - this.pos.y;
        const mag = Math.sqrt(tx*tx + ty*ty);
        const towards = { x: 0, y: 0 };
        if (mag > 0) {
          towards.x = (tx / mag) * this.maxSpeed * prox;
          towards.y = (ty / mag) * this.maxSpeed * prox;
        }
        const steer = { x: towards.x - this.vel.x, y: towards.y - this.vel.y };
        const sm = Math.sqrt(steer.x*steer.x + steer.y*steer.y);
        if (sm > 0) {
          steer.x = (steer.x / sm) * this.maxForce;
          steer.y = (steer.y / sm) * this.maxForce;
        }
        this.acc.x += steer.x; this.acc.y += steer.y;
        this.vel.x += this.acc.x; this.vel.y += this.acc.y;
        this.pos.x += this.vel.x; this.pos.y += this.vel.y;
        this.acc.x = 0; this.acc.y = 0;
      }
      draw(ctx) {
        if (this.colorWeight < 1.0) {
          this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
        }
        const c = {
          r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
          g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
          b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
        };
        ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
        ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
      }
      kill(w, h) {
        if (this.isKilled) return;
        const rp = randomPos(w / 2, h / 2, (w + h) / 2);
        this.target.x = rp.x; this.target.y = rp.y;
        this.startColor = {
          r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
          g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
          b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
        };
        this.targetColor = { r: 10, g: 9, b: 8 };
        this.colorWeight = 0;
        this.isKilled = true;
      }
    }

    const nextWord = (word) => {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d");
      octx.fillStyle = "white";
      const fs = Math.max(48, Math.round(canvas.width * 0.11));
      octx.font = `700 ${fs}px Geist, "Helvetica Neue", Arial, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(word, canvas.width / 2, canvas.height / 2);

      const data = octx.getImageData(0, 0, canvas.width, canvas.height).data;
      const newColor = MATTE_PARTICLE_PALETTE[Math.floor(Math.random() * MATTE_PARTICLE_PALETTE.length)];
      const particles = particlesRef.current;
      let pi = 0;

      const coords = [];
      for (let i = 0; i < data.length; i += pixelSteps * 4) coords.push(i);
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }

      for (const ci of coords) {
        if (data[ci + 3] > 0) {
          const x = (ci / 4) % canvas.width;
          const y = Math.floor(ci / 4 / canvas.width);
          let p;
          if (pi < particles.length) {
            p = particles[pi];
            p.isKilled = false;
            pi++;
          } else {
            p = new Particle();
            const rp = randomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
            p.pos.x = rp.x; p.pos.y = rp.y;
            p.maxSpeed = Math.random() * 6 + 4;
            p.maxForce = p.maxSpeed * 0.05;
            p.particleSize = Math.random() * 6 + 6;
            p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
            particles.push(p);
          }
          p.startColor = {
            r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
            g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
            b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
          };
          p.targetColor = newColor;
          p.colorWeight = 0;
          p.target.x = x; p.target.y = y;
        }
      }
      for (let i = pi; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height);
    };

    const sizeCanvas = () => {
      const w = Math.max(320, container.clientWidth);
      const h = Math.max(240, container.clientHeight);
      canvas.width = Math.floor(w);
      canvas.height = Math.floor(h);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };

    const animate = () => {
      const ctx = canvas.getContext("2d");
      const particles = particlesRef.current;
      ctx.fillStyle = "rgba(10, 9, 8, 0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.move();
        p.draw(ctx);
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
          particles.splice(i, 1);
        }
      }
      if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
        particles.forEach((p) => {
          const dx = p.pos.x - mouseRef.current.x;
          const dy = p.pos.y - mouseRef.current.y;
          if (Math.sqrt(dx*dx + dy*dy) < 50) p.kill(canvas.width, canvas.height);
        });
      }
      frameCountRef.current++;
      if (frameCountRef.current % switchFrames === 0) {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        nextWord(words[wordIndexRef.current]);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    sizeCanvas();
    // Init only on first intersection — particles aren't created on page load.
    // This pulls the heaviest single chunk of work out of the LCP/TBT window.
    let initialized = false;
    const initOnce = () => {
      if (initialized) return;
      initialized = true;
      const start = () => { nextWord(words[0]); animate(); };
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(start);
      } else { start(); }
    };

    const onResize = () => { sizeCanvas(); nextWord(words[wordIndexRef.current]); };
    window.addEventListener("resize", onResize);
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      let lastW = 0, lastH = 0;
      ro = new ResizeObserver(() => {
        const w = container.clientWidth, h = container.clientHeight;
        if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
        lastW = w; lastH = h;
        onResize();
      });
      ro.observe(container);
    }

    const md = (e) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
    };
    const mu = () => { mouseRef.current.isPressed = false; mouseRef.current.isRightClick = false; };
    const mm = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
    };
    const cm = (e) => e.preventDefault();
    canvas.addEventListener("mousedown", md);
    canvas.addEventListener("mouseup", mu);
    canvas.addEventListener("mousemove", mm);
    canvas.addEventListener("contextmenu", cm);

    let running = false;
    let io = null;
    const setupObserver = () => {
      if (io) return;
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!initialized) { running = true; initOnce(); }
            else if (!running) { running = true; animate(); }
          } else if (running) {
            running = false;
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
          }
        });
      }, { threshold: 0, rootMargin: "-10% 0px" });
      io.observe(container);
    };

    // Delay setting up the observer until after the page has fully loaded
    // AND the main thread is idle — keeps heavy particle init out of the
    // Lighthouse FCP/LCP/TBT measurement window entirely.
    let cancelIdleSetup = () => {};
    const scheduleSetup = () => { cancelIdleSetup = whenIdle(setupObserver, 1500); };
    if (document.readyState === "complete") scheduleSetup();
    else window.addEventListener("load", scheduleSetup, { once: true });

    return () => {
      cancelIdleSetup();
      window.removeEventListener("load", scheduleSetup);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener("resize", onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener("mousedown", md);
      canvas.removeEventListener("mouseup", mu);
      canvas.removeEventListener("mousemove", mm);
      canvas.removeEventListener("contextmenu", cm);
    };
  }, []);

  return (
    <div ref={containerRef} style={{
      width: "100%", height: "100%", position: "relative",
    }}>
      <canvas ref={canvasRef} style={{
        display: "block", width: "100%", height: "100%",
        background: "var(--bg)", cursor: "crosshair",
      }} />
    </div>
  );
}

// ─── shader animation (matte-tinted radial line waves) ────────────
// Schedule a callback when the main thread is idle (or fallback to setTimeout).
function whenIdle(cb, timeoutMs = 2000) {
  if (typeof requestIdleCallback !== "undefined") {
    const id = requestIdleCallback(cb, { timeout: timeoutMs });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 300);
  return () => clearTimeout(id);
}

// CSS-only animated radial gradient background. Replaces the old WebGL shader.
// Zero JS execution cost; ~0 bytes of dependency. Drifts subtly using
// transform: translate3d to stay on the compositor (no main-thread work).
function ShaderAnimation({ opacity = 0.55 }) {
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      opacity,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: "-20%",
        background: [
          "radial-gradient(35% 45% at 78% 18%, rgba(212,26,91,.55), transparent 60%)",
          "radial-gradient(28% 35% at 22% 72%, rgba(232,93,60,.40), transparent 65%)",
          "radial-gradient(45% 50% at 50% 100%, rgba(232,72,128,.32), transparent 70%)",
        ].join(", "),
        filter: "blur(40px)",
        animation: "matteDrift 18s ease-in-out infinite alternate",
        willChange: "transform",
      }} />
      <style>{`
        @keyframes matteDrift {
          0%   { transform: translate3d(-3%, -2%, 0) scale(1); }
          50%  { transform: translate3d(2%, 3%, 0) scale(1.08); }
          100% { transform: translate3d(4%, -1%, 0) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden] > div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// ─── wordmark ──────────────────────────────────────────────────────
function MatteLogo({ size = 18 }) {
  return (
    <svg viewBox="0 0 100 100" width={size * 1.15} height={size * 1.15}
      style={{ display: "block", color: "var(--accent)" }}
      fill="currentColor" aria-hidden="true">
      <path d="M 25 5 L 95 5 L 95 72 L 68 72 L 20 100 L 5 80 L 50 35 L 25 35 Z" />
    </svg>
  );
}

function MatteWordmark({ size = 18, color = "var(--ink)" }) {
  return (
    <span style={{
      fontFamily: "var(--sans)", fontWeight: 600,
      fontSize: size, letterSpacing: "-0.02em", color,
      display: "inline-flex", alignItems: "center", gap: 8,
    }}>
      <MatteLogo size={size} />
      matte
      <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 2 }}>/</span>
      <span style={{ color: "var(--muted)", fontWeight: 400 }}>uberlândia</span>
    </span>
  );
}

// ─── decorative tape label ─────────────────────────────────────────
function Tape({ children, color = "var(--accent)" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".12em",
      textTransform: "uppercase", color,
      padding: "6px 10px",
      border: `1px solid ${color}`,
      borderRadius: 999,
    }}>
      <span aria-hidden style={{
        width: 5, height: 5, borderRadius: "50%", background: color,
        boxShadow: `0 0 12px ${color}`,
      }} />
      {children}
    </span>
  );
}

// ─── section header ────────────────────────────────────────────────
function SectionLabel({ index, label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".18em",
      textTransform: "uppercase", color: "var(--muted)",
    }}>
      <span style={{ color: "var(--accent)" }}>§{String(index).padStart(2, "0")}</span>
      <span style={{ flex: "0 0 24px", height: 1, background: "var(--line-2)" }} />
      <span>{label}</span>
    </div>
  );
}

// ─── divider ───────────────────────────────────────────────────────
function Rule({ style }) {
  return <div style={{ height: 1, background: "var(--line)", width: "100%", ...style }} />;
}

// ─── marquee ───────────────────────────────────────────────────────
function Marquee({ items, color = "var(--ink)", separator = "✦" }) {
  // Duplicate content once to make the seamless loop work with -50% transform.
  const content = (
    <span className="marquee-track">
      {[...items, ...items].map((t, i) => (
        <span key={i} style={{ color }}>
          {t}
          <span aria-hidden style={{ color: "var(--accent)", marginLeft: "2.5rem" }}>{separator}</span>
        </span>
      ))}
    </span>
  );
  return <div className="marquee">{content}</div>;
}

// ─── real photo with crop-marks frame ──────────────────────────────
function Photo({ src, alt, ratio = "1 / 1", caption, objectPosition = "center" }) {
  return (
    <div style={{
      position: "relative", aspectRatio: ratio, overflow: "hidden",
      background: "var(--bg-3)", border: "1px solid var(--line-2)", borderRadius: 4,
    }}>
      <img src={src} alt={alt} loading="lazy" style={{
        width: "100%", height: "100%", objectFit: "cover",
        objectPosition,
        display: "block",
      }} />
      {/* corner crops */}
      {[
        { top: 8, left: 8 }, { top: 8, right: 8 },
        { bottom: 8, left: 8 }, { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <span key={i} aria-hidden style={{
          position: "absolute", width: 14, height: 14, pointerEvents: "none",
          borderColor: "rgba(242,239,233,.85)",
          borderStyle: "solid",
          borderWidth: 0,
          mixBlendMode: "difference",
          ...(pos.top !== undefined ? { top: pos.top, borderTopWidth: 1 } : {}),
          ...(pos.bottom !== undefined ? { bottom: pos.bottom, borderBottomWidth: 1 } : {}),
          ...(pos.left !== undefined ? { left: pos.left, borderLeftWidth: 1 } : {}),
          ...(pos.right !== undefined ? { right: pos.right, borderRightWidth: 1 } : {}),
          opacity: .55,
        }} />
      ))}
      {caption && (
        <div className="mono" style={{
          position: "absolute", bottom: 10, left: 14, right: 14,
          fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase",
          color: "rgba(242,239,233,.8)",
          textShadow: "0 1px 4px rgba(0,0,0,.7)",
        }}>{caption}</div>
      )}
    </div>
  );
}

// ─── place-holder photo frame ──────────────────────────────────────
function PhotoFrame({ label, ratio = "1 / 1", note, tone = "warm" }) {
  const bg = tone === "warm"
    ? "linear-gradient(135deg, #2a241d, #161310 60%, #0f0d0b)"
    : "linear-gradient(135deg, #1b1a18, #100f0e)";
  return (
    <div style={{
      position: "relative", aspectRatio: ratio, overflow: "hidden",
      background: bg, border: "1px solid var(--line-2)", borderRadius: 4,
    }}>
      {/* corner crops */}
      {[
        { top: 8, left: 8 }, { top: 8, right: 8 },
        { bottom: 8, left: 8 }, { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <span key={i} aria-hidden style={{
          position: "absolute", width: 14, height: 14,
          borderColor: "var(--ink-2)",
          borderStyle: "solid",
          borderWidth: 0,
          ...(pos.top !== undefined ? { top: pos.top, borderTopWidth: 1 } : {}),
          ...(pos.bottom !== undefined ? { bottom: pos.bottom, borderBottomWidth: 1 } : {}),
          ...(pos.left !== undefined ? { left: pos.left, borderLeftWidth: 1 } : {}),
          ...(pos.right !== undefined ? { right: pos.right, borderRightWidth: 1 } : {}),
          opacity: .5,
        }} />
      ))}
      {/* center label */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column", gap: 6,
        color: "var(--ink-2)",
      }}>
        <span className="mono" style={{
          fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase",
          color: "var(--muted)",
        }}>[ imagem ]</span>
        <span className="serif it" style={{ fontSize: 22, color: "var(--ink-2)" }}>
          {label}
        </span>
        {note && (
          <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{note}</span>
        )}
      </div>
    </div>
  );
}

// expose globally
// helper: returns bundled blob URL if available, else falls back to the raw path.
// Lets the same code run both unbundled (dev) and standalone (after super_inline_html).
function assetUrl(id, fallback) {
  return (typeof window !== "undefined" && window.__resources && window.__resources[id]) || fallback;
}

Object.assign(window, {
  useCountdown, useReveal, Reveal, useCountUp,
  CTA, MatteWordmark, Tape, SectionLabel, Rule, Marquee, PhotoFrame, Photo,
  assetUrl,
});
