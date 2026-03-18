import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";

const QUOTES = [
  "Push beyond limits.",
  "Discipline is destiny.",
  "Earn your excellence.",
  "Strength through consistency.",
  "Your body. Your legacy.",
  "Built, not born.",
  "Champions are made daily.",
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Rotate quote every 5 seconds with fade
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%',
      background: 'rgba(8,8,8,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
    }}>
      {/* Top gold shimmer line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 30%, rgba(232,201,122,0.9) 50%, rgba(201,168,76,0.6) 70%, transparent 100%)',
        backgroundSize: '200% auto',
        animation: 'shimmerLine 3s linear infinite',
      }} />

      <div style={{ padding: '0 1.5rem', maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>

          {/* Left — hamburger + logo + quote */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9A9080', padding: '0.25rem', flexShrink: 0 }}>
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Logo mark */}
            <div
              className="cursor-pointer"
              onClick={() => navigate("/")}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}
            >
              {/* Animated gold emblem */}
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmerBg 3s linear infinite',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 12px rgba(201,168,76,0.3)',
              }}>
                <span style={{ fontSize: '0.85rem', color: '#0A0A0A', fontWeight: 700 }}>V</span>
              </div>

              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.2rem', fontWeight: 600,
                color: '#EDE8DC', letterSpacing: '0.04em', flexShrink: 0,
              }}>VitaTrack</span>
            </div>

            {/* Vertical divider */}
            <div style={{
              width: '1px', height: '18px', flexShrink: 0,
              background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.4), transparent)',
            }} />

            {/* Rotating fitness quote */}
            {!isMobile && (
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.92rem', fontStyle: 'italic',
                color: visible ? 'rgba(201,168,76,0.75)' : 'transparent',
                letterSpacing: '0.04em',
                transition: 'color 0.5s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
                maxWidth: '260px',
              }}>
                {quote}
              </span>
            )}
          </div>

          {/* Right — status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Gold ornament */}
            <span style={{
              color: 'rgba(201,168,76,0.3)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              display: isMobile ? 'none' : 'block',
            }}>✦</span>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.3rem 0.9rem', borderRadius: '100px',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.15)',
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.65rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#AAA090',
                display: isMobile ? 'none' : 'block',
              }}>Premium Health</span>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#C9A84C',
                boxShadow: '0 0 8px rgba(201,168,76,0.7)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      <style>{`
        @keyframes shimmerLine {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shimmerBg {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 6px rgba(201,168,76,0.5); }
          50%       { box-shadow: 0 0 14px rgba(201,168,76,0.9); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;