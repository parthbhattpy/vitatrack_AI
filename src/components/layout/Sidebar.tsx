import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Target, ClipboardList, Activity, UserRound, LogOut, Bot, Home, Scale } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email || null);
    };
    getSession();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "My Goals", path: "/goals", icon: <Target className="w-4 h-4" /> },
    { name: "Health Plan", path: "/plan", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Progress", path: "/progress", icon: <Activity className="w-4 h-4" /> },
    
    { name: "AI Coach", path: "/chat", icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-60 min-h-screen"
      style={{ background: '#080808', borderRight: '1px solid #161616' }}>

      {/* Logo */}
      <div className="px-6 py-7">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-gold"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
            <span style={{ fontSize: '1rem' }}>✦</span>
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.3rem',
            fontWeight: 600,
            color: '#EDE8DC',
            letterSpacing: '0.04em'
          }}>VitaTrack</span>
        </div>
      </div>

      {/* Gold line */}
      <div className="gold-line mx-4 mb-5" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <p style={{
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: '#9A9080',
          textTransform: 'uppercase',
          padding: '0 0.75rem',
          marginBottom: '0.5rem',
          fontFamily: "'DM Sans', sans-serif"
        }}>Navigation</p>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="mr-3 opacity-70">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      {userEmail && (
        <div className="p-4 mx-3 mb-4 rounded-xl"
          style={{ background: '#0D0D0D', border: '1px solid #1A1A1A' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <UserRound className="w-4 h-4" style={{ color: '#C9A84C' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: '#7A7060' }}>{userEmail}</p>
              <NavLink to="/profile" className="text-xs hover:underline"
                style={{ color: '#C9A84C', fontFamily: "'DM Sans', sans-serif" }}>
                Profile
              </NavLink>
            </div>
            <button onClick={handleSignOut}
              className="transition-colors hover:opacity-100 opacity-40"
              style={{ color: '#C9A84C' }}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;