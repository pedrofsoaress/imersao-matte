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

// ─── shader animation (matte-tinted radial line waves) ────────────
function ShaderAnimation({ opacity = 0.45 }) {
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (!containerRef.current || typeof THREE === "undefined") return;
    const container = containerRef.current;

    const vertexShader = `
      void main() { gl_Position = vec4(position, 1.0); }
    `;
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.0025;
        vec3 color = vec3(0.0);
        for (int j = 0; j < 3; j++) {
          float intensity = 0.0;
          for (int i = 0; i < 5; i++) {
            intensity += lineWidth * float(i * i) /
              abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
                  - length(uv) + mod(uv.x + uv.y, 0.2));
          }
          vec3 tint;
          if (j == 0)      tint = vec3(0.831, 0.102, 0.357); // #D41A5B matte accent
          else if (j == 1) tint = vec3(0.910, 0.282, 0.502); // #E84880 hot pink
          else             tint = vec3(0.910, 0.365, 0.235); // #E85D3C ember
          color += intensity * tint;
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener("resize", onResize);

    let animId;
    let running = true;
    const animate = () => {
      if (!running) return;
      animId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !running) { running = true; animate(); }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(animId); }
      });
    }, { threshold: 0 });
    io.observe(container);

    return () => {
      running = false;
      io.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      opacity,
      pointerEvents: "none",
      mixBlendMode: "screen",
    }} />
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
