// app.jsx — Matte / Imersão Presencial IA · landing page

const { useState, useEffect, useRef } = React;

// ─── EDITABLE COPY / DEFAULTS ──────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "eventDate": "2026-06-11T14:00:00-03:00",
  "eventTime": "14h às 19h",
  "eventVenue": "Local a definir · Uberlândia/MG",
  "vagasTotal": 30,
  "vagasRestantes": 12,
  "price": "97",
  "priceAnchor": "1.500",
  "pedroBio": "Empreendedor e operador. Tocou times comerciais que escalaram de 7 para 8 dígitos usando dados e IA. Hoje à frente da Matte, ajudando empresários a estruturar operações que crescem sem depender do dono.",
  "nps": "82",
  "lastEventGuests": "120",
  "showSocialProof": true,
  "showTicker": true,
  "accent": "#D41A5B"
}/*EDITMODE-END*/;

const APRENDIZADOS = [
  { t: "Atendimento com IA", d: "Como aumentar conversão sem contratar mais gente — fluxos de atendimento que respondem em segundos e qualificam em paralelo." },
  { t: "Automação comercial", d: "Tirar tarefa repetitiva do seu time. Recuperar horas. Liberar foco para fechar o que importa." },
  { t: "Qualificação e conversão de leads", d: "IA como filtro: lead chega, é qualificado, escora e chega no vendedor já aquecido." },
  { t: "Decisões com dados", d: "Painéis e prompts para olhar pipeline, previsão e gargalo sem depender de planilha." },
  { t: "Scripts e processos", d: "Como estruturar playbook comercial com IA — do primeiro contato ao fechamento." },
];

const INCLUSOS = [
  { k: "01", t: "Conteúdo 100% prático", d: "Aprende com quem executa todos os dias. Nada teórico." },
  { k: "02", t: "Networking de alto nível", d: "Mesma sala, só quem constrói e quer crescer." },
  { k: "03", t: "Comunidade no WhatsApp", d: "Continuação da conversa depois do evento." },
  { k: "04", t: "Brindes exclusivos", d: "Para todos os participantes." },
  { k: "05", t: "Happy hour gourmet", d: "Por nossa conta — vinho, chopp, conversa, negócios." },
];

const FAQ = [
  { q: "Preciso ter conhecimento em IA para participar?", a: "Não. A imersão foi pensada para empresários que querem começar do jeito certo, sem precisar de background técnico." },
  { q: "O evento é presencial?", a: "Sim. Presencial, em sala pequena, para garantir profundidade no aprendizado e qualidade no networking." },
  { q: "Vou sair sabendo implementar tudo sozinho?", a: "Você vai sair com clareza do que fazer e como fazer. A implementação depende do contexto de cada negócio, mas o caminho estará mapeado." },
  { q: "Como funciona o pagamento?", a: "Pagamento à vista via cartão ou Pix. O acesso à comunidade e às confirmações chega no e-mail logo após a inscrição. (Plataforma a confirmar.)" },
  { q: "Posso transferir minha vaga?", a: "Sim, até 72 horas antes do evento. Basta nos enviar o nome e e-mail do substituto." },
  { q: "Vai ter coffee break?", a: "Sim, e o happy hour gourmet ao final está incluso no ingresso." },
];

const DEPOIMENTOS = [
  { n: "Carolina M.", r: "Founder · SaaS B2B", t: "Saí do evento anterior com 3 ideias que viraram automação na semana seguinte. Pagou o ingresso em uma semana." },
  { n: "Rafael T.", r: "Sócio · agência de marketing", t: "O nível das conversas no networking foi o ponto alto. Conheci dois clientes ali mesmo." },
  { n: "Marina S.", r: "Diretora comercial · e-commerce", t: "Achei que ia ser teórico. Voltei com um playbook pronto para o meu time aplicar." },
];

// ─────────────────────────────────────────────────────────────────────
// Sticky bar (countdown + CTA)
// ─────────────────────────────────────────────────────────────────────
function TopBar({ t, onCTA }) {
  const cd = useCountdown(t.eventDate);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,9,8,.78)",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{
        maxWidth: "var(--maxw)", margin: "0 auto",
        padding: "10px var(--pad)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16,
      }}>
        <MatteWordmark size={15} />
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div className="mono" style={{
            display: "none", alignItems: "baseline", gap: 8,
            fontSize: 12, color: "var(--ink-2)",
          }} data-show-md>
            <span style={{ color: "var(--muted)" }}>Faltam</span>
            <span style={{ color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
              {pad(cd.d)}<span style={{ color: "var(--muted)" }}>d</span> {pad(cd.h)}<span style={{ color: "var(--muted)" }}>h</span> {pad(cd.m)}<span style={{ color: "var(--muted)" }}>m</span> {pad(cd.s)}<span style={{ color: "var(--muted)" }}>s</span>
            </span>
          </div>
          <CTA size="sm" variant="accent" onClick={onCTA}>R$ {t.price} · garantir</CTA>
        </div>
      </div>
      <style>{`@media (min-width: 720px){ [data-show-md]{display: inline-flex !important;} }`}</style>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────
function Hero({ t, onCTA }) {
  const cd = useCountdown(t.eventDate);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <section style={{
      position: "relative",
      padding: "clamp(24px, 6vw, 56px) var(--pad) clamp(60px, 10vw, 110px)",
      borderBottom: "1px solid var(--line)",
      overflow: "hidden",
      isolation: "isolate",
    }}>
      {/* shader animation backdrop (Matte-tinted) */}
      <ShaderAnimation opacity={0.55} />
      {/* dark vignette to keep headline readable on top of the shader */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(10,9,8,.35) 0%, rgba(10,9,8,.55) 60%, var(--bg) 100%)",
      }} />
      {/* faint editorial baseline */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(60% 50% at 80% 0%, rgba(var(--accent-rgb),.10), transparent 70%)",
      }} />

      <div style={{
        maxWidth: "var(--maxw)", margin: "0 auto", position: "relative",
      }}>
        {/* meta row */}
        <Reveal style={{
          display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
          marginBottom: 32,
        }}>
          <Tape>Imersão presencial · Uberlândia</Tape>
          <span className="mono" style={{
            color: "var(--muted)", fontSize: 11, letterSpacing: ".15em",
            textTransform: "uppercase",
          }}>11 jun · {t.vagasTotal} vagas</span>
        </Reveal>

        {/* headline */}
        <Reveal delay={80}>
          <h1 className="serif" style={{
            fontSize: "clamp(40px, 9vw, 116px)",
            lineHeight: 0.96,
            letterSpacing: "-0.025em",
            margin: 0,
            fontWeight: 400,
            textWrap: "balance",
          }}>
            Sua empresa está crescendo na <span className="it" style={{ color: "var(--accent)" }}>velocidade</span> que <span style={{ display: "inline-block" }}>você quer</span><span style={{ color: "var(--accent)" }}>?</span>
          </h1>
        </Reveal>

        {/* subhead */}
        <Reveal delay={160} style={{
          marginTop: 28, maxWidth: 640,
          fontSize: "clamp(16px, 2.2vw, 19px)",
          lineHeight: 1.55, color: "var(--ink-2)",
        }}>
          <p style={{ margin: 0 }}>
            Se a resposta for não, a sua <span style={{ color: "var(--ink)" }}>operação comercial</span> provavelmente está te segurando. Nesta imersão você aprende, na prática, como usar IA para <span className="serif it" style={{ fontSize: "1.1em", color: "var(--ink)" }}>vender mais, atender melhor e converter mais leads</span> — em uma única tarde.
          </p>
        </Reveal>

        {/* CTA row */}
        <Reveal delay={240} style={{
          marginTop: 36, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
        }}>
          <CTA size="lg" variant="accent" onClick={onCTA}>
            Garantir minha vaga · R$ {t.price}
          </CTA>
          <a href="#programa" className="mono" style={{
            fontSize: 12, letterSpacing: ".15em", textTransform: "uppercase",
            color: "var(--ink-2)",
            padding: "10px 4px", borderBottom: "1px solid var(--line-2)",
          }}>O que você vai aprender ↓</a>
        </Reveal>

        {/* facts strip */}
        <Reveal delay={320}>
          <div style={{
            marginTop: "clamp(48px, 8vw, 88px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 0,
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}>
            {[
              { k: "Data", v: "11 jun", sub: "quinta-feira" },
              { k: "Horário", v: t.eventTime.split(" ")[0], sub: t.eventTime },
              { k: "Vagas", v: `${t.vagasRestantes}/${t.vagasTotal}`, sub: "restantes" },
              { k: "Contagem", v: `${pad(cd.d)}d ${pad(cd.h)}h`, sub: `${pad(cd.m)}m ${pad(cd.s)}s` },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "20px 18px",
                borderRight: "1px solid var(--line)",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <span className="mono" style={{
                  fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase",
                  color: "var(--muted)",
                }}>{f.k}</span>
                <span className="serif" style={{
                  fontSize: 28, lineHeight: 1, color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums",
                }}>{f.v}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                  {f.sub}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────────────────────────────
function TickerStrip({ t }) {
  if (!t.showTicker) return null;
  const items = [
    "30 vagas apenas",
    "11 de junho · Uberlândia",
    `Imersão por R$ ${t.price}`,
    "Happy hour incluso",
    "Networking selecionado",
    "Conteúdo prático",
  ];
  return (
    <div style={{
      padding: "14px 0",
      background: "var(--ink)",
      color: "var(--bg)",
      borderTop: "1px solid var(--ink)",
      borderBottom: "1px solid var(--ink)",
      fontFamily: "var(--mono)", fontSize: 13, letterSpacing: ".06em",
    }}>
      <Marquee items={items} color="var(--bg)" separator="●" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PROBLEMA / DOR
// ─────────────────────────────────────────────────────────────────────
function Problema() {
  return (
    <section style={{
      padding: "clamp(64px, 10vw, 120px) var(--pad)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal><SectionLabel index={2} label="O Problema" /></Reveal>
        <div style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "clamp(24px, 5vw, 72px)",
        }} data-two-col>
          <Reveal>
            <h2 className="serif" style={{
              fontSize: "clamp(32px, 5.4vw, 60px)",
              lineHeight: 1.02, letterSpacing: "-0.02em",
              margin: 0, fontWeight: 400, maxWidth: 18 + "ch",
              textWrap: "balance",
            }}>
              Você sabe vender, mas algo ainda te impede de <span className="it" style={{ color: "var(--accent)" }}>crescer mais</span>.
            </h2>
          </Reveal>
          <Reveal delay={120} style={{
            display: "flex", flexDirection: "column", gap: 18,
            color: "var(--ink-2)", fontSize: "clamp(15px, 1.7vw, 17px)",
            lineHeight: 1.65, maxWidth: 56 + "ch",
          }}>
            <p style={{ margin: 0 }}>
              A maioria dos empresários que chegam até nós têm o mesmo problema: <span style={{ color: "var(--ink)" }}>vendem bem, têm um bom produto</span>, mas a operação comercial não acompanha o potencial do negócio.
            </p>
            <p style={{
              margin: 0, fontFamily: "var(--mono)",
              fontSize: 13, letterSpacing: ".08em",
              color: "var(--accent)", textTransform: "uppercase",
            }}>
              Falta dados. &nbsp;Falta processo. &nbsp;Falta escala.
            </p>
            <p style={{ margin: 0 }}>
              E enquanto você resolve isso no improviso, seus concorrentes já estão usando inteligência artificial para automatizar atendimento, qualificar leads e tomar decisões com mais velocidade.
            </p>
            <p style={{
              margin: 0, paddingLeft: 18, borderLeft: "2px solid var(--accent)",
              color: "var(--ink)",
            }}>
              O custo de ficar parado não é zero. É o crescimento que você deixou de ter — e o mercado que seguiu em frente sem você.
            </p>
          </Reveal>
        </div>
      </div>
      <style>{`@media (min-width: 880px){ [data-two-col]{ grid-template-columns: 1fr 1fr !important; align-items: start; } }`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PROGRAMA (o que você vai aprender)
// ─────────────────────────────────────────────────────────────────────
function Programa({ onCTA }) {
  return (
    <section id="programa" style={{
      padding: "clamp(64px, 10vw, 120px) var(--pad)",
      borderBottom: "1px solid var(--line)",
      background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%)",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal><SectionLabel index={3} label="O Programa" /></Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{
            fontSize: "clamp(34px, 5.6vw, 64px)",
            lineHeight: 1.02, letterSpacing: "-0.02em",
            margin: "32px 0 0", fontWeight: 400, maxWidth: 16 + "ch",
            textWrap: "balance",
          }}>
            Em um dia, IA dentro da sua <span className="it" style={{ color: "var(--accent)" }}>operação comercial</span>.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p style={{
            margin: "20px 0 0", color: "var(--ink-2)",
            fontSize: "clamp(15px, 1.7vw, 17px)", maxWidth: "52ch",
          }}>
            Nada teórico. Tudo aplicável já no dia seguinte. Cinco frentes que vão sair da sala como playbook seu:
          </p>
        </Reveal>

        <div style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 0,
          borderTop: "1px solid var(--line-2)",
        }}>
          {APRENDIZADOS.map((a, i) => (
            <Reveal key={i} delay={i * 60}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: "clamp(16px, 3vw, 36px)",
                padding: "clamp(24px, 4vw, 36px) 0",
                borderBottom: "1px solid var(--line-2)",
                alignItems: "baseline",
              }} data-row>
                <span className="serif" style={{
                  fontSize: "clamp(40px, 6vw, 64px)",
                  lineHeight: 1, color: "var(--accent)",
                  fontVariantNumeric: "tabular-nums",
                }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="serif" style={{
                    margin: 0, fontWeight: 400,
                    fontSize: "clamp(22px, 3vw, 32px)",
                    lineHeight: 1.1, letterSpacing: "-0.01em",
                  }}>{a.t}</h3>
                  <p style={{
                    margin: "10px 0 0", color: "var(--ink-2)",
                    fontSize: "clamp(14px, 1.6vw, 16px)", lineHeight: 1.55,
                    maxWidth: "58ch",
                  }}>{a.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <CTA size="lg" variant="accent" onClick={onCTA}>
            Reservar minha vaga
          </CTA>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PROVA SOCIAL
// ─────────────────────────────────────────────────────────────────────
function ProvaSocial({ t }) {
  if (!t.showSocialProof) return null;
  const [npsRef, npsVal] = useCountUp(Number(t.nps) || 0);
  const [guestsRef, guestsVal] = useCountUp(Number(t.lastEventGuests) || 0);

  return (
    <section style={{
      padding: "clamp(64px, 10vw, 120px) var(--pad)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal><SectionLabel index={4} label="Prova Social" /></Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{
            fontSize: "clamp(34px, 5.6vw, 64px)",
            lineHeight: 1.02, letterSpacing: "-0.02em",
            margin: "32px 0 12px", fontWeight: 400, maxWidth: 18 + "ch",
            textWrap: "balance",
          }}>
            Já fizemos isso. E os <span className="it" style={{ color: "var(--accent)" }}>números</span> falaram.
          </h2>
        </Reveal>

        {/* event photos */}
        <Reveal delay={120}>
          <div style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr)",
            gap: 12,
          }} data-photos>
            <div data-photo-tall>
              <Photo src={assetUrl("eventoPalco", "assets/evento-palco.jpg")} alt="Edição anterior — palestra"
                ratio="3 / 4" caption="edição anterior · sp" />
            </div>
            <div data-photo-tall>
              <Photo src={assetUrl("eventoPedro", "assets/evento-pedro.jpg")} alt="Pedro Soares no palco"
                ratio="3 / 4" caption="pedro soares · ao vivo" />
            </div>
          </div>
        </Reveal>

        {/* big numbers */}
        <div style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 0,
          borderTop: "1px solid var(--line-2)",
          borderBottom: "1px solid var(--line-2)",
        }} data-three-col>
          {[
            { ref: guestsRef, v: guestsVal, suf: "+", k: "Empresários no último evento" },
            { ref: npsRef, v: npsVal, suf: "", k: "NPS · edição anterior" },
            { ref: null, v: t.vagasTotal, suf: "", k: "Vagas nesta edição" },
          ].map((m, i) => (
            <Reveal key={i} delay={i * 80}>
              <div ref={m.ref} style={{
                padding: "clamp(28px, 4vw, 44px) clamp(0px, 2vw, 24px)",
                borderTop: i > 0 ? "1px solid var(--line-2)" : "none",
              }} data-cell>
                <div className="serif" style={{
                  fontSize: "clamp(64px, 12vw, 140px)",
                  lineHeight: 0.95, letterSpacing: "-0.03em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {m.v}<span style={{ color: "var(--accent)" }}>{m.suf}</span>
                </div>
                <div className="mono" style={{
                  marginTop: 10, fontSize: 11, letterSpacing: ".15em",
                  textTransform: "uppercase", color: "var(--muted)",
                }}>{m.k}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* testimonials */}
        <div style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 16,
        }} data-test-grid>
          {DEPOIMENTOS.map((d, i) => (
            <Reveal key={i} delay={i * 80}>
              <figure style={{
                margin: 0,
                padding: "clamp(22px, 3vw, 30px)",
                border: "1px solid var(--line-2)",
                background: "var(--bg-2)",
                borderRadius: 4,
                height: "100%",
                display: "flex", flexDirection: "column", gap: 22,
              }}>
                <span aria-hidden className="serif it" style={{
                  fontSize: 56, lineHeight: 0.5, color: "var(--accent)",
                }}>“</span>
                <blockquote className="serif" style={{
                  margin: 0, fontSize: "clamp(17px, 1.9vw, 20px)",
                  lineHeight: 1.35, letterSpacing: "-0.005em",
                }}>
                  {d.t}
                </blockquote>
                <figcaption style={{ marginTop: "auto" }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{d.n}</div>
                  <div className="mono" style={{
                    fontSize: 11, color: "var(--muted)",
                    letterSpacing: ".06em",
                  }}>{d.r}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p style={{
            marginTop: 36, maxWidth: "60ch",
            color: "var(--ink-2)", fontSize: "clamp(14px, 1.6vw, 16px)",
            lineHeight: 1.55,
          }}>
            Para esta edição, evoluímos o formato. O foco é <span style={{ color: "var(--ink)" }}>construção prática</span> e networking de alto nível — e para garantir isso, limitamos a <span style={{ color: "var(--accent)" }}>{t.vagasTotal} vagas</span> para empresários selecionados.
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (min-width: 720px){
          [data-three-col]{ grid-template-columns: 1fr 1fr 1fr !important; }
          [data-three-col] [data-cell]{ border-top: none !important; border-right: 1px solid var(--line-2); }
          [data-three-col] [data-cell]:last-child{ border-right: none; }
        }
        @media (min-width: 720px){
          [data-test-grid]{ grid-template-columns: repeat(3, 1fr) !important; }
          [data-photos]{ grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// APRESENTADOR
// ─────────────────────────────────────────────────────────────────────
function Apresentador({ t }) {
  return (
    <section style={{
      padding: "clamp(64px, 10vw, 120px) var(--pad)",
      borderBottom: "1px solid var(--line)",
      background: "var(--bg-2)",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal><SectionLabel index={5} label="Apresentador" /></Reveal>
        <div style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: "clamp(28px, 5vw, 64px)",
          alignItems: "start",
        }} data-speaker>
          <Reveal>
            <Photo src={assetUrl("pedro", "assets/pedro.jpg")} alt="Pedro Soares" ratio="4 / 5"
              objectPosition="center 20%" />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="serif" style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              lineHeight: 1.02, letterSpacing: "-0.02em",
              margin: 0, fontWeight: 400, maxWidth: 16 + "ch",
              textWrap: "balance",
            }}>
              Você vai aprender com quem <span className="it" style={{ color: "var(--accent)" }}>realmente executa</span>.
            </h2>
            <div style={{
              marginTop: 28, display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div className="mono" style={{
                fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase",
                color: "var(--muted)",
              }}>Pedro Soares · Matte</div>
              <p style={{
                margin: 0, color: "var(--ink-2)",
                fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.65,
                maxWidth: "55ch",
              }}>
                {t.pedroBio}
              </p>
              <Rule style={{ margin: "12px 0" }} />
              <p style={{
                margin: 0, color: "var(--ink-2)",
                fontSize: "clamp(14px, 1.6vw, 16px)", lineHeight: 1.6,
                maxWidth: "55ch",
              }}>
                <span className="serif" style={{
                  fontSize: "1.4em", marginRight: 8, color: "var(--ink)",
                }}>Sobre a Matte.</span>
                Especializada em crescimento para negócios digitais. Já ajudamos centenas de empresários a estruturar suas operações e escalar com inteligência. <span className="serif it" style={{ color: "var(--ink)" }}>Não ensinamos teoria — construímos junto.</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media (min-width: 880px){ [data-speaker]{ grid-template-columns: minmax(260px, 380px) 1fr !important; } }`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// IDENTIDADE — full-bleed particle text effect
// ─────────────────────────────────────────────────────────────────────
function Identidade() {
  return (
    <section style={{
      position: "relative",
      width: "100%",
      height: "clamp(440px, 82vh, 800px)",
      padding: 0,
      margin: 0,
      borderBottom: "1px solid var(--line)",
      background: "var(--bg)",
      overflow: "hidden",
    }}>
      <ParticleTextEffect
        words={["MATTE", "IMERSÃO", "IA", "UBERLÂNDIA", "11 · 06"]}
      />
      <span aria-hidden className="mono" style={{
        position: "absolute",
        top: "clamp(18px, 3vw, 32px)",
        left: "var(--pad)",
        fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase",
        color: "var(--muted)",
        pointerEvents: "none",
        zIndex: 2,
      }}>§ Identidade</span>
      <p className="mono" style={{
        position: "absolute",
        bottom: "clamp(18px, 3vw, 32px)",
        left: 0, right: 0,
        margin: 0,
        fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase",
        color: "var(--muted)",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 2,
      }}>
        uma tarde · uma sala · um plano pra sair com ele pronto
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// DIFERENCIAIS / INCLUSO
// ─────────────────────────────────────────────────────────────────────
function Incluso({ t }) {
  return (
    <section style={{
      padding: "clamp(64px, 10vw, 120px) var(--pad)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal><SectionLabel index={6} label="O que está incluso" /></Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{
            fontSize: "clamp(34px, 5.6vw, 64px)",
            lineHeight: 1.02, letterSpacing: "-0.02em",
            margin: "32px 0 0", fontWeight: 400, maxWidth: 22 + "ch",
            textWrap: "balance",
          }}>
            Por R$ {t.price}, muito <span className="it" style={{ color: "var(--accent)" }}>mais</span> do que uma imersão.
          </h2>
        </Reveal>

        <div style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 16,
        }} data-incluso-grid>
          {INCLUSOS.map((b, i) => (
            <Reveal key={i} delay={i * 70}>
              <div style={{
                position: "relative",
                padding: "clamp(24px, 3vw, 32px)",
                border: "1px solid var(--line-2)",
                background: i === 0
                  ? "linear-gradient(135deg, rgba(var(--accent-rgb),.10), transparent 70%), var(--bg-2)"
                  : "var(--bg-2)",
                borderRadius: 4,
                height: "100%",
                display: "flex", flexDirection: "column", gap: 14,
                minHeight: 180,
              }}>
                <span className="mono" style={{
                  position: "absolute", top: 16, right: 18,
                  fontSize: 10, letterSpacing: ".15em", color: "var(--muted)",
                }}>{b.k}</span>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%",
                  border: "1px solid var(--accent)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", fontSize: 14,
                }}>✓</span>
                <h3 className="serif" style={{
                  margin: 0, fontWeight: 400,
                  fontSize: "clamp(22px, 2.6vw, 28px)",
                  lineHeight: 1.1, letterSpacing: "-0.01em",
                }}>{b.t}</h3>
                <p style={{
                  margin: 0, color: "var(--ink-2)",
                  fontSize: "clamp(13px, 1.5vw, 15px)", lineHeight: 1.55,
                }}>{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 640px){ [data-incluso-grid]{ grid-template-columns: 1fr 1fr !important; } }
        @media (min-width: 980px){ [data-incluso-grid]{ grid-template-columns: repeat(3, 1fr) !important; } }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PREÇO / ANCORAGEM
// ─────────────────────────────────────────────────────────────────────
function Preco({ t, onCTA }) {
  return (
    <section style={{
      padding: "clamp(72px, 12vw, 140px) var(--pad)",
      borderBottom: "1px solid var(--line)",
      background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-3) 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(40% 40% at 90% 100%, rgba(var(--accent-rgb),.12), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative" }}>
        <Reveal><SectionLabel index={7} label="Preço" /></Reveal>

        <div style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "center",
        }} data-preco-grid>
          <Reveal>
            <p style={{
              margin: 0, color: "var(--ink-2)",
              fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.6,
              maxWidth: "48ch",
            }}>
              Uma imersão como essa normalmente custa
            </p>
            <div className="serif" style={{
              marginTop: 12,
              display: "flex", gap: 18, flexWrap: "wrap",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "var(--muted)",
              textDecoration: "line-through",
              textDecorationColor: "var(--accent)",
              textDecorationThickness: "1px",
            }}>
              <span>R$ 1.500</span>
              <span>R$ 2.000</span>
              <span>R$ 3.000</span>
            </div>
            <p style={{
              margin: "24px 0 0", color: "var(--ink-2)",
              fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.6,
              maxWidth: "55ch",
            }}>
              Consultores de IA cobram isso <span className="serif it" style={{ color: "var(--ink)" }}>por hora</span>. Nós poderíamos cobrar o mesmo — e teríamos justificativa para isso.
            </p>
            <p style={{
              margin: "16px 0 0", color: "var(--ink)",
              fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.55,
              maxWidth: "55ch",
            }}>
              Mas queremos que você viva o que a Matte faz antes de qualquer compromisso maior. Por isso, abrimos apenas <span style={{ color: "var(--accent)" }}>{t.vagasTotal} vagas a R$ {t.price}</span>.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div style={{
              border: "1px solid var(--accent)",
              padding: "clamp(28px, 4vw, 40px)",
              background: "rgba(var(--accent-rgb),.06)",
              borderRadius: 4,
              position: "relative",
            }}>
              <span style={{
                position: "absolute", top: -10, left: 20,
                background: "var(--bg)", padding: "2px 10px",
                fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".18em",
                color: "var(--accent)", textTransform: "uppercase",
              }}>Lote único</span>
              <div className="mono" style={{
                fontSize: 11, letterSpacing: ".15em", color: "var(--muted)",
                textTransform: "uppercase", marginBottom: 8,
              }}>Investimento</div>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 8,
              }}>
                <span className="serif" style={{
                  fontSize: "clamp(20px, 2.2vw, 24px)", color: "var(--ink-2)",
                }}>R$</span>
                <span className="serif" style={{
                  fontSize: "clamp(96px, 16vw, 180px)",
                  lineHeight: 0.85, letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}>{t.price}</span>
              </div>
              <div className="mono" style={{
                fontSize: 11, letterSpacing: ".12em", color: "var(--muted)",
                textTransform: "uppercase", marginTop: 4,
              }}>à vista · 1× cartão ou Pix</div>

              <div style={{ marginTop: 28 }}>
                <CTA size="lg" variant="accent" full onClick={onCTA}>
                  Garantir minha vaga
                </CTA>
              </div>

              <Rule style={{ margin: "24px 0 18px" }} />

              <ul style={{
                margin: 0, padding: 0, listStyle: "none",
                display: "flex", flexDirection: "column", gap: 8,
                color: "var(--ink-2)", fontSize: 13,
              }}>
                {["Acesso à imersão de 11/06", "Happy hour gourmet incluso", "Comunidade no WhatsApp", "Brindes exclusivos"].map((x, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: "var(--accent)" }}>—</span> {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mono" style={{
            marginTop: 40, color: "var(--accent)",
            fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase",
            textAlign: "center",
          }}>
            Restam {t.vagasRestantes} vagas · evento em 11/06
          </p>
        </Reveal>
      </div>
      <style>{`@media (min-width: 880px){ [data-preco-grid]{ grid-template-columns: 1fr minmax(320px, 480px) !important; } }`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CTA FINAL
// ─────────────────────────────────────────────────────────────────────
function CTAFinal({ t, onCTA }) {
  return (
    <section style={{
      padding: "clamp(72px, 12vw, 140px) var(--pad)",
      borderBottom: "1px solid var(--line)",
      background: "var(--ink)",
      color: "var(--bg)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal>
          <span className="mono" style={{
            fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase",
            color: "rgba(10,9,8,.55)",
          }}>§08 · Decisão</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{
            margin: "20px 0 0", fontWeight: 400,
            fontSize: "clamp(40px, 8vw, 120px)",
            lineHeight: 0.96, letterSpacing: "-0.025em",
            textWrap: "balance",
            color: "var(--bg)",
          }}>
            {t.vagasTotal} vagas. R$ {t.price}. <span className="it" style={{ color: "var(--accent)" }}>Uma decisão simples.</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p style={{
            margin: "28px 0 0", maxWidth: "56ch",
            fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.6,
            color: "rgba(10,9,8,.75)",
          }}>
            Você pode continuar tentando crescer no improviso, sem dados e sem processo. Ou pode passar um dia cercado de pessoas que pensam como você, aprendendo o que a IA pode fazer pela sua operação — e sair com um plano real para aplicar.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr)",
            gap: 0,
            border: "1px solid rgba(10,9,8,.18)",
            borderRadius: 4,
            background: "rgba(10,9,8,.04)",
          }} data-final-grid>
            {[
              { k: "Data", v: "11 jun · quinta", c: "📅" },
              { k: "Horário", v: t.eventTime, c: "🕐" },
              { k: "Local", v: t.eventVenue, c: "📍" },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "20px 22px",
                borderBottom: i < 2 ? "1px solid rgba(10,9,8,.10)" : "none",
                display: "flex", gap: 14, alignItems: "center",
              }} data-final-cell>
                <span aria-hidden style={{
                  fontFamily: "var(--mono)", fontSize: 11,
                  letterSpacing: ".15em", textTransform: "uppercase",
                  color: "rgba(10,9,8,.55)",
                  width: 76, flexShrink: 0,
                }}>{f.k}</span>
                <span className="serif" style={{
                  fontSize: "clamp(20px, 2.4vw, 24px)",
                  letterSpacing: "-0.005em", color: "var(--bg)",
                }}>{f.v}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div style={{ marginTop: 36 }}>
            <CTA size="lg" variant="primary" onClick={onCTA}
              style={{ background: "var(--bg)", color: "var(--ink)", borderColor: "var(--bg)" }}>
              Garantir minha vaga agora · R$ {t.price}
            </CTA>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (min-width: 720px){
          [data-final-grid]{ grid-template-columns: repeat(3, 1fr) !important; }
          [data-final-grid] [data-final-cell]{ border-bottom: none !important; border-right: 1px solid rgba(10,9,8,.10); flex-direction: column; align-items: flex-start; gap: 6px; }
          [data-final-grid] [data-final-cell]:last-child{ border-right: none; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────
function FaqItem({ q, a, open, onToggle }) {
  return (
    <div style={{
      borderBottom: "1px solid var(--line-2)",
    }}>
      <button onClick={onToggle} style={{
        all: "unset", cursor: "pointer",
        width: "100%", padding: "clamp(20px, 3vw, 28px) 0",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: 16, color: "var(--ink)",
      }}>
        <span className="serif" style={{
          fontSize: "clamp(18px, 2.2vw, 24px)", lineHeight: 1.25,
          letterSpacing: "-0.005em",
        }}>{q}</span>
        <span aria-hidden style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "1px solid var(--line-2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "var(--accent)",
          transition: "transform .25s ease, background .25s ease",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          background: open ? "rgba(var(--accent-rgb),.10)" : "transparent",
          flexShrink: 0,
        }}>+</span>
      </button>
      <div style={{
        overflow: "hidden",
        maxHeight: open ? 400 : 0,
        opacity: open ? 1 : 0,
        transition: "max-height .35s ease, opacity .25s ease",
      }}>
        <p style={{
          margin: 0, padding: "0 0 clamp(20px, 3vw, 28px) 0",
          color: "var(--ink-2)", fontSize: "clamp(14px, 1.6vw, 16px)",
          lineHeight: 1.6, maxWidth: "62ch",
        }}>{a}</p>
      </div>
    </div>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section style={{
      padding: "clamp(64px, 10vw, 120px) var(--pad)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <Reveal><SectionLabel index={9} label="FAQ" /></Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{
            margin: "32px 0 36px", fontWeight: 400,
            fontSize: "clamp(34px, 5.6vw, 64px)",
            lineHeight: 1.02, letterSpacing: "-0.02em",
            textWrap: "balance",
            maxWidth: "16ch",
          }}>
            Perguntas <span className="it" style={{ color: "var(--accent)" }}>frequentes</span>.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div style={{ borderTop: "1px solid var(--line-2)" }}>
            {FAQ.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer style={{
      padding: "clamp(40px, 6vw, 72px) var(--pad) clamp(28px, 4vw, 40px)",
      background: "var(--bg)",
      color: "var(--muted)",
    }}>
      <div style={{
        maxWidth: "var(--maxw)", margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
        gap: 24,
        alignItems: "end",
      }} data-foot>
        <div>
          <MatteWordmark size={16} />
          <p style={{
            margin: "16px 0 0", maxWidth: "44ch",
            fontSize: 13, lineHeight: 1.55,
          }}>
            Imersão Presencial IA · Edição Uberlândia. Realizada pela Matte. 11 de junho.
          </p>
        </div>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase",
          textAlign: "left",
        }} data-foot-right>
          <div>© 2026 Matte</div>
          <div style={{ marginTop: 6 }}>contato@matte.com.br</div>
        </div>
      </div>
      <style>{`@media (min-width: 720px){ [data-foot]{ grid-template-columns: 1fr auto !important; } [data-foot-right]{ text-align: right !important; } }`}</style>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MODAL DE INSCRIÇÃO
// ─────────────────────────────────────────────────────────────────────
function InscricaoModal({ open, onClose, t }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "", empresa: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) { setStep(0); setErrors({}); }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Obrigatório";
    if (!/.+@.+\..+/.test(form.email)) e.email = "E-mail inválido";
    if (form.whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "Telefone incompleto";
    if (!form.empresa.trim()) e.empresa = "Obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) setStep(1);
  };

  const fmtPhone = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(5,5,4,.78)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      padding: 0,
      animation: "fadein .25s ease",
    }}>
      <style>{`
        @keyframes fadein { from{opacity:0} to{opacity:1} }
        @keyframes slideup { from{transform: translateY(40px); opacity:0} to{transform: none; opacity:1} }
        @media (min-width: 720px){ [data-modal]{ align-self: center !important; max-height: 92vh !important; border-radius: 6px !important; } [data-modal-wrap]{ align-items: center !important; padding: 24px !important; } }
      `}</style>
      <div data-modal-wrap style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", padding: 0 }}>
        <div data-modal onClick={(e) => e.stopPropagation()} style={{
          width: "min(560px, 100%)",
          background: "var(--bg-2)",
          border: "1px solid var(--line-2)",
          borderRadius: "12px 12px 0 0",
          padding: "clamp(24px, 4vw, 36px)",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
          animation: "slideup .35s cubic-bezier(.2,.8,.2,1)",
        }}>
          <button onClick={onClose} aria-label="Fechar" style={{
            position: "absolute", top: 14, right: 14,
            background: "transparent", border: "1px solid var(--line-2)",
            color: "var(--ink-2)", width: 32, height: 32, borderRadius: "50%",
            cursor: "pointer", fontSize: 16,
          }}>×</button>

          {step === 0 && (
            <>
              <Tape>Reserva de vaga</Tape>
              <h3 className="serif" style={{
                margin: "16px 0 8px", fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 36px)",
                lineHeight: 1.05, letterSpacing: "-0.02em",
              }}>
                Quase lá. Vamos <span className="it" style={{ color: "var(--accent)" }}>garantir sua vaga</span>.
              </h3>
              <p style={{
                margin: "0 0 24px", color: "var(--ink-2)",
                fontSize: 14, lineHeight: 1.5,
              }}>
                Restam <strong style={{ color: "var(--accent)" }}>{t.vagasRestantes} de {t.vagasTotal} vagas</strong>. Preencha abaixo para seguir para o pagamento.
              </p>
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Nome completo" value={form.nome} err={errors.nome}
                  onChange={(v) => setForm({ ...form, nome: v })} placeholder="Como gostaria de ser chamado" />
                <Field label="E-mail" type="email" value={form.email} err={errors.email}
                  onChange={(v) => setForm({ ...form, email: v })} placeholder="seu@email.com" />
                <Field label="WhatsApp" type="tel" value={form.whatsapp} err={errors.whatsapp}
                  onChange={(v) => setForm({ ...form, whatsapp: fmtPhone(v) })} placeholder="(34) 99999-9999" />
                <Field label="Empresa" value={form.empresa} err={errors.empresa}
                  onChange={(v) => setForm({ ...form, empresa: v })} placeholder="Nome do seu negócio" />
                <div style={{
                  marginTop: 12, display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <CTA size="lg" variant="accent" full>
                    Ir para o pagamento · R$ {t.price}
                  </CTA>
                  <span className="mono" style={{
                    fontSize: 10, color: "var(--muted)",
                    letterSpacing: ".1em", textAlign: "center",
                  }}>pagamento seguro · cartão ou pix</span>
                </div>
              </form>
            </>
          )}

          {step === 1 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "1px solid var(--accent)", color: "var(--accent)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, margin: "0 auto 20px",
              }}>✓</div>
              <h3 className="serif" style={{
                margin: 0, fontWeight: 400,
                fontSize: "clamp(26px, 3.5vw, 34px)", letterSpacing: "-0.02em",
              }}>
                Vaga reservada por <span className="it" style={{ color: "var(--accent)" }}>10 minutos</span>.
              </h3>
              <p style={{
                margin: "16px auto 24px", color: "var(--ink-2)",
                fontSize: 14, lineHeight: 1.5, maxWidth: "42ch",
              }}>
                Em uma página real, você seria redirecionado agora para a plataforma de pagamento (a confirmar pelo Pedro). Após o pagamento, você recebe a confirmação por e-mail e o convite para o grupo no WhatsApp.
              </p>
              <CTA size="md" variant="accent" onClick={onClose}>Entendi</CTA>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, err }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="mono" style={{
        fontSize: 10, letterSpacing: ".15em",
        textTransform: "uppercase", color: err ? "var(--hot)" : "var(--muted)",
      }}>{label}{err && ` · ${err}`}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none", width: "100%",
          background: "var(--bg)",
          border: `1px solid ${err ? "var(--hot)" : "var(--line-2)"}`,
          color: "var(--ink)",
          padding: "14px 14px",
          fontFamily: "var(--sans)", fontSize: 15,
          borderRadius: 4,
          outline: "none",
          transition: "border-color .2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = err ? "var(--hot)" : "var(--line-2)")}
      />
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modal, setModal] = useState(false);

  // apply accent override live (sync --accent-rgb so radial gradients track too)
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    const hex = t.accent.replace("#", "");
    const h = hex.length === 3
      ? hex.split("").map(c => c + c).join("")
      : hex;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    document.documentElement.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
  }, [t.accent]);

  const onCTA = () => {
    window.location.href = "https://payfast.greenn.com.br/cxjp7vq/offer/zTl8ol";
  };

  return (
    <>
      <TopBar t={t} onCTA={onCTA} />
      <main>
        <Hero t={t} onCTA={onCTA} />
        <Identidade />
        <TickerStrip t={t} />
        <Problema />
        <Programa onCTA={onCTA} />
        <ProvaSocial t={t} />
        <Apresentador t={t} />
        <Incluso t={t} />
        <Preco t={t} onCTA={onCTA} />
        <CTAFinal t={t} onCTA={onCTA} />
        <FaqSection />
      </main>
      <Footer t={t} />
      <InscricaoModal open={modal} onClose={() => setModal(false)} t={t} />

      <TweaksPanel>
        <TweakSection label="Conteúdo do evento" />
        <TweakText label="Horário" value={t.eventTime} onChange={(v) => setTweak("eventTime", v)} />
        <TweakText label="Local" value={t.eventVenue} onChange={(v) => setTweak("eventVenue", v)} />
        <TweakText label="Data ISO" value={t.eventDate} onChange={(v) => setTweak("eventDate", v)} />

        <TweakSection label="Preço & vagas" />
        <TweakText label="Preço (R$)" value={t.price} onChange={(v) => setTweak("price", v)} />
        <TweakNumber label="Vagas totais" value={t.vagasTotal} min={5} max={200} step={1}
          onChange={(v) => setTweak("vagasTotal", v)} />
        <TweakNumber label="Vagas restantes" value={t.vagasRestantes} min={0} max={t.vagasTotal} step={1}
          onChange={(v) => setTweak("vagasRestantes", v)} />

        <TweakSection label="Prova social" />
        <TweakToggle label="Mostrar prova social" value={t.showSocialProof}
          onChange={(v) => setTweak("showSocialProof", v)} />
        <TweakText label="NPS" value={t.nps} onChange={(v) => setTweak("nps", v)} />
        <TweakText label="Convidados (último)" value={t.lastEventGuests}
          onChange={(v) => setTweak("lastEventGuests", v)} />

        <TweakSection label="Apresentador" />
        <TweakText label="Bio do Pedro" value={t.pedroBio}
          onChange={(v) => setTweak("pedroBio", v)} />

        <TweakSection label="Tema" />
        <TweakColor label="Accent" value={t.accent}
          options={["#D41A5B", "#C9A878", "#E85D3C", "#7BA489", "#A6A28C"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Ticker marquee" value={t.showTicker}
          onChange={(v) => setTweak("showTicker", v)} />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
