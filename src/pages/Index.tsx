import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Target, UserCircle, TrendingUp, Clock, ClipboardList, Bot, Scale, Zap, Check, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";

const HERO_IMG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop";

const FEATURE_IMGS = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
];

const MOSAIC_IMGS = [
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop",
];

const TESTIMONIAL_IMGS = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
];

const QUOTES = [
  "Push beyond limits.",
  "Discipline is destiny.",
  "Earn your excellence.",
  "Strength through consistency.",
  "Your body. Your legacy.",
  "Built, not born.",
  "Champions are made daily.",
];

const features = [
  { img: FEATURE_IMGS[0], label: "Training",   title: "Personalized Goals",  desc: "Targets tailored to your body and ambitions." },
  { img: FEATURE_IMGS[1], label: "Nutrition",  title: "Custom Diet Plans",   desc: "AI-crafted meals aligned with your goals." },
  { img: FEATURE_IMGS[2], label: "Analytics",  title: "Progress Insights",   desc: "Visual trends to keep you sharp." },
  { img: FEATURE_IMGS[3], label: "AI Coach",   title: "Real-Time Coaching",  desc: "A coach that knows you — always on." },
];

const testimonials = [
  { img: TESTIMONIAL_IMGS[0], quote: "Lost 15 pounds in two months. The personalized plans are extraordinary.",          name: "Sarah J.",   title: "Fat Loss · 2 months"   },
  { img: TESTIMONIAL_IMGS[1], quote: "The AI recommendations completely transformed my relationship with nutrition.",    name: "Michael T.", title: "Nutrition · 3 months"  },
  { img: TESTIMONIAL_IMGS[2], quote: "Consistent muscle gains following VitaTrack's approach. Nothing compares.",       name: "Alex W.",    title: "Muscle Gain · 4 months" },
];

const mockStats = [
  { label: "Active Days",    value: "5/7",    icon: <Target className="w-4 h-4" /> },
  { label: "Avg Activity",   value: "48 min", icon: <Activity className="w-4 h-4" /> },
  { label: "Current Streak", value: "3 days", icon: <Zap className="w-4 h-4" /> },
];

const quickActions = [
  { label: "Goals",       path: "/goals",    icon: <Target className="w-5 h-5" /> },
  { label: "Health Plan", path: "/plan",     icon: <ClipboardList className="w-5 h-5" /> },
  { label: "Progress",    path: "/progress", icon: <Activity className="w-5 h-5" /> },
  { label: "AI Coach",    path: "/chat",     icon: <Bot className="w-5 h-5" /> },
  { label: "Weight",      path: "/weight",   icon: <Scale className="w-5 h-5" /> },
  { label: "Profile",     path: "/profile",  icon: <UserCircle className="w-5 h-5" /> },
];

// ── Particle System ──
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} id="particles-canvas" />;
};

// ── Cursor Glow ──
const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
};

// ── Scroll Reveal ──
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
};

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  useScrollReveal();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
  }, []);

  // Parallax + scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      setHeroParallax(window.scrollY * 0.4);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rotating hero quote
  useEffect(() => {
    let i = 0;
    const el = document.getElementById("hero-quote");
    const interval = setInterval(() => {
      if (!el) return;
      el.style.opacity = "0";
      setTimeout(() => {
        i = (i + 1) % QUOTES.length;
        el.textContent = QUOTES[i];
        el.style.opacity = "1";
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Spotlight
  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  /* ════════════════════════════════════════
     LANDING PAGE
  ════════════════════════════════════════ */
  if (!isLoggedIn) {
    return (
      <div className="grain" style={{ background: "#0A0A0A", minHeight: "100vh", overflowX: "hidden" }}>
        <ParticleCanvas />
        <CursorGlow />

        {/* ── Scroll Progress Bar ── */}
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: `${scrollProgress}%`,
          height: "2px",
          background: "linear-gradient(90deg, #8B6F2E, #C9A84C, #E8C97A, #C9A84C)",
          backgroundSize: "200% auto",
          animation: "shimmerLine 2s linear infinite",
          zIndex: 9999,
          transition: "width 0.1s ease",
          boxShadow: "0 0 8px rgba(201,168,76,0.7), 0 0 20px rgba(201,168,76,0.3)",
        }} />

        {/* NAVBAR */}
        <header className="navbar-glass fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)" }}>
                <span style={{ fontSize: "0.8rem", color: "#0A0A0A" }}>✦</span>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 600, color: "#EDE8DC", letterSpacing: "0.04em" }}>VitaTrack</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="nav-pill hidden md:block" onClick={() => navigate("/login")}>Sign In</button>
              <button className="btn-gold" onClick={() => navigate("/login")} style={{ padding: "0.45rem 1.4rem", fontSize: "0.72rem" }}>Get Started</button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", overflow: "hidden", paddingTop: "3.5rem" }}>
          {/* Parallax BG */}
          <div style={{ position: "absolute", inset: "-20%", backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.12) saturate(0.4)", transform: `translateY(${heroParallax}px)`, willChange: "transform", transition: "transform 0.1s linear" }} />
          {/* Vignette */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 20%, #0A0A0A 75%)", zIndex: 1 }} />
          {/* Orbs */}
          <div className="orb-1" style={{ top: "20%", left: "15%", zIndex: 1 }} />
          <div className="orb-2" style={{ bottom: "25%", right: "20%", zIndex: 1 }} />

          <div style={{ position: "relative", zIndex: 2, maxWidth: "52rem", margin: "0 auto" }}>
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#C9A84C" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#C9A84C", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Premium Health Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3.5rem,10vw,7.5rem)", fontWeight: 300, lineHeight: 1.0, color: "#EDE8DC", marginBottom: "0.25rem", letterSpacing: "-0.03em" }}>
              Elevate Your
            </h1>
            <h1 className="shimmer-text animate-fade-up-delay-2" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3.5rem,10vw,7.5rem)", fontWeight: 600, lineHeight: 1.0, marginBottom: "2rem", letterSpacing: "-0.03em", display: "block" }}>
              Fitness Journey
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up-delay-3" style={{ color: "#9A9080", fontSize: "1rem", lineHeight: 1.9, maxWidth: "30rem", margin: "0 auto 2.5rem", fontFamily: "'DM Sans',sans-serif" }}>
              AI-powered health tracking with personalized plans, real-time coaching, and premium analytics — built for those who demand excellence.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up-delay-4 flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <button className="btn-gold" onClick={() => navigate("/login")} style={{ padding: "0.85rem 2.5rem" }}>
                Begin Your Journey
              </button>
              <button className="btn-ghost" onClick={() => navigate("/login")} style={{ padding: "0.85rem 2.5rem" }}>
                Learn More
              </button>
            </div>

            {/* Rotating Quote */}
            <div className="animate-fade-up-delay-4 flex items-center justify-center gap-3">
              <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5))" }} />
              <p id="hero-quote" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(201,168,76,0.75)", letterSpacing: "0.04em", transition: "opacity 0.5s ease" }}>
                Push beyond limits.
              </p>
              <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, rgba(201,168,76,0.5), transparent)" }} />
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ opacity: 0.4 }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9A9080", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Scroll</span>
            <div style={{ width: 1, height: 50, background: "linear-gradient(180deg,#C9A84C,transparent)" }} />
          </div>
        </section>

        {/* IMAGE MOSAIC */}
        <section style={{ padding: "5rem 1.5rem", background: "#080808" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal-left">
                <div style={{ color: "#9A9080", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: "1rem" }}>About VitaTrack</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.2rem)", color: "#EDE8DC", fontWeight: 400, lineHeight: 1.15, marginBottom: "1.5rem" }}>
                  Where Science Meets<br /><span className="gold-gradient">Premium Design</span>
                </h2>
                <p style={{ color: "#AAA090", fontSize: "0.9rem", lineHeight: 1.9, fontFamily: "'DM Sans',sans-serif", marginBottom: "2rem" }}>
                  VitaTrack combines cutting-edge AI with an obsessive attention to detail. Every plan is personalized, every insight is actionable, every experience is refined.
                </p>
                {["Personalized AI-generated plans", "Real-time fitness coaching", "Premium progress analytics", "Goal-based nutrition guidance"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                      <Check className="w-3 h-3" style={{ color: "#C9A84C" }} />
                    </div>
                    <span style={{ color: "#AAA090", fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="reveal-right mosaic-grid">
                <div className="img-card mosaic-main">
                  <img src={MOSAIC_IMGS[0]} alt="Training" />
                  <div className="img-card-overlay">
                    <div className="img-card-label">Premium Training</div>
                    <div className="img-card-title">Elite Performance</div>
                  </div>
                </div>
                <div className="img-card">
                  <img src={MOSAIC_IMGS[1]} alt="Nutrition" />
                  <div className="img-card-overlay"><div className="img-card-label">Nutrition</div></div>
                </div>
                <div className="img-card">
                  <img src={MOSAIC_IMGS[2]} alt="Recovery" />
                  <div className="img-card-overlay"><div className="img-card-label">Recovery</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: "6rem 1.5rem", background: "#0A0A0A" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="luxury-divider justify-center mb-4"><span>✦</span></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#EDE8DC", fontWeight: 400, marginBottom: "1rem" }}>Powerful Features</h2>
              <p style={{ color: "#AAA090", maxWidth: "26rem", margin: "0 auto", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", lineHeight: 1.8 }}>
                Everything you need to transform your health — refined into one platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <div key={i} className="reveal spotlight" onMouseMove={handleSpotlight} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="img-card" style={{ height: "200px", marginBottom: "1rem", borderRadius: "0.875rem" }}>
                    <img src={f.img} alt={f.title} />
                    <div className="img-card-overlay" style={{ padding: "1rem" }}>
                      <div className="img-card-label">{f.label}</div>
                    </div>
                  </div>
                  <div className="feature-card" style={{ borderRadius: "0.875rem" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", color: "#EDE8DC", marginBottom: "0.4rem", fontWeight: 500 }}>{f.title}</h3>
                    <p style={{ color: "#AAA090", fontSize: "0.8rem", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "6rem 1.5rem", background: "#080808" }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-16">
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#EDE8DC", fontWeight: 400, marginBottom: "1rem" }}>How It Works</h2>
              <p style={{ color: "#AAA090", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem" }}>Start your transformation in three precise steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: "01", icon: <UserCircle className="w-6 h-6" />, title: "Create Profile",   desc: "Complete your fitness profile with goals and current metrics." },
                { n: "02", icon: <Target className="w-6 h-6" />,     title: "Get Custom Plan",  desc: "Receive a personalized workout and nutrition plan from our AI." },
                { n: "03", icon: <TrendingUp className="w-6 h-6" />, title: "Track & Evolve",   desc: "Monitor improvements with stunning analytics and adjust as you grow." },
              ].map((s, i) => (
                <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center relative border-glow-anim" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,0.15)" }}>
                    <span style={{ color: "#C9A84C" }}>{s.icon}</span>
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#0A0A0A", fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 700 }}>{i + 1}</div>
                  </div>
                  <div style={{ color: "#9A9080", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: "0.4rem" }}>{s.n}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", color: "#EDE8DC", marginBottom: "0.5rem" }}>{s.title}</h3>
                  <p style={{ color: "#AAA090", fontSize: "0.82rem", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ padding: "6rem 1.5rem", background: "#0A0A0A" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 reveal">
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#EDE8DC", fontWeight: 400 }}>Success Stories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                  <p style={{ color: "#AAA090", fontSize: "0.88rem", lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif", marginBottom: "1.75rem", fontStyle: "italic" }}>"{t.quote}"</p>
                  <div className="gold-line mb-4" />
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" style={{ filter: "brightness(0.85) saturate(0.8)", border: "1px solid rgba(201,168,76,0.2)" }} />
                    <div>
                      <p style={{ color: "#EDE8DC", fontSize: "0.85rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>{t.name}</p>
                      <p style={{ color: "#9A9080", fontSize: "0.72rem", fontFamily: "'DM Sans',sans-serif" }}>{t.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-bg" />
          <div className="orb-1" style={{ top: "0", left: "50%", transform: "translateX(-50%)" }} />
          <div className="max-w-2xl mx-auto text-center" style={{ position: "relative", zIndex: 2 }}>
            <div className="luxury-divider justify-center mb-8"><span>✦</span></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#EDE8DC", fontWeight: 400, marginBottom: "1rem" }}>Ready to Transform?</h2>
            <p style={{ color: "#AAA090", marginBottom: "2.5rem", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", lineHeight: 1.8 }}>
              Join a community of high-performers who've elevated their fitness with VitaTrack's premium intelligence.
            </p>
            <button className="btn-gold" onClick={() => navigate("/login")} style={{ padding: "0.9rem 3rem" }}>
              Start Your Journey <ArrowRight className="inline w-4 h-4 ml-2" />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "2.5rem 1.5rem", borderTop: "1px solid #111" }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)" }}>
                <span style={{ fontSize: "0.6rem", color: "#0A0A0A" }}>✦</span>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "#9A9080" }}>VitaTrack</span>
            </div>

            {/* Developer contact */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 6px rgba(201,168,76,0.6)" }} />
              <div>
                <p style={{ color: "#6A6050", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: "0.15rem" }}>
                  Contact the Developer
                </p>
                <p style={{ color: "#C9A84C", fontSize: "0.85rem", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>
                  Parth Nilesh Bhatt &nbsp;·&nbsp; 8849144877
                </p>
              </div>
            </div>

            <p style={{ color: "#4A4030", fontSize: "0.72rem", fontFamily: "'DM Sans',sans-serif" }}>
              © {new Date().getFullYear()} VitaTrack. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  /* ════════════════════════════════════════
     DASHBOARD (logged in)
  ════════════════════════════════════════ */
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto page-enter">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-px h-6" style={{ background: "linear-gradient(180deg,#C9A84C,transparent)" }} />
            <span style={{ color: "#9A9080", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Dashboard</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#EDE8DC", fontWeight: 400, lineHeight: 1.1, marginBottom: "0.3rem" }}>Welcome Back</h1>
              <p style={{ color: "#AAA090", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem" }}>Your personalized health journey continues.</p>
            </div>
            <button className="btn-gold" onClick={() => navigate("/plan")} style={{ padding: "0.6rem 1.5rem", fontSize: "0.72rem", whiteSpace: "nowrap" }}>View Health Plan</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {mockStats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: "#AAA090", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{s.label}</span>
                <span style={{ color: "#C9A84C", opacity: 0.5 }}>{s.icon}</span>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", color: "#EDE8DC", fontWeight: 500, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="premium-card p-6 spotlight" onMouseMove={handleSpotlight}>
            <span style={{ color: "#9A9080", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Today</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", color: "#EDE8DC", marginBottom: "1.25rem", marginTop: "0.25rem" }}>Today's Plan</h2>
            <div className="space-y-3">
              {[
                { icon: <Activity className="w-4 h-4" />, title: "Upper Body Workout", sub: "5 exercises · 45 min", action: false },
                { icon: <Clock className="w-4 h-4" />,    title: "Log Activity",        sub: "Daily tracking reminder", action: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: "#0D0D0D", border: "1px solid #1A1A1A" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,168,76,0.07)", color: "#C9A84C" }}>{item.icon}</div>
                  <div className="flex-1">
                    <p style={{ color: "#EDE8DC", fontSize: "0.85rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>{item.title}</p>
                    <p style={{ color: "#AAA090", fontSize: "0.72rem", fontFamily: "'DM Sans',sans-serif" }}>{item.sub}</p>
                  </div>
                  {item.action && (
                    <button className="btn-ghost" onClick={() => navigate("/progress")} style={{ padding: "0.3rem 0.8rem", fontSize: "0.68rem" }}>Log</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-6 spotlight" onMouseMove={handleSpotlight}>
            <span style={{ color: "#9A9080", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>This Week</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", color: "#EDE8DC", marginBottom: "1.5rem", marginTop: "0.25rem" }}>Weekly Progress</h2>
            <div className="flex flex-col items-center justify-center h-36">
              <div className="relative w-24 h-24 mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1A1A1A" strokeWidth="5" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#g1)" strokeWidth="5" strokeDasharray={`${0.71 * 251.2} 251.2`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="g1" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" stopColor="#8B6F2E" />
                      <stop offset="100%" stopColor="#E8C97A" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "#C9A84C", fontWeight: 500 }}>71%</span>
                </div>
              </div>
              <p style={{ color: "#AAA090", fontSize: "0.75rem", fontFamily: "'DM Sans',sans-serif", marginBottom: "0.75rem" }}>of weekly goal completed</p>
              <button className="btn-ghost" onClick={() => navigate("/progress")} style={{ padding: "0.35rem 1rem", fontSize: "0.68rem" }}>View Details</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", color: "#EDE8DC", marginBottom: "1rem", fontWeight: 400 }}>Quick Access</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((a, i) => (
              <div key={i} className="action-card spotlight" onMouseMove={handleSpotlight} onClick={() => navigate(a.path)}>
                <span style={{ color: "#C9A84C" }}>{a.icon}</span>
                <span style={{ color: "#AAA090", fontSize: "0.68rem", letterSpacing: "0.08em", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase" }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Index;