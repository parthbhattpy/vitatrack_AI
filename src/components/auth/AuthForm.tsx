import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type FormValues = z.infer<typeof schema>;

const SPLIT_IMG = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop";

const AuthForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true); setError(null);
    try {
      const res = isSignUp
        ? await supabase.auth.signUp({ email: values.email, password: values.password })
        : await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
      if (res.error) { setError(res.error.message); toast.error(res.error.message); }
      else { toast.success(isSignUp ? "Account created!" : "Welcome back!"); navigate('/onboarding'); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-split grain" style={{ background: '#0A0A0A' }}>
      {/* Left — image panel */}
      <div className="auth-split-image">
        <img src={SPLIT_IMG} alt="Training" />
        <div className="auth-split-image-overlay">
          <div className="mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C97A)' }}>
              <span style={{ fontSize: '0.9rem', color: '#0A0A0A' }}>✦</span>
            </div>
            <div className="gold-line mb-6" style={{ maxWidth: '120px' }} />
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', color: '#EDE8DC', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem' }}>
              Your Premium<br />Health Journey
            </h2>
            <p style={{ color: 'rgba(237,232,220,0.45)', fontSize: '0.85rem', lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", maxWidth: '22rem' }}>
              AI-powered fitness coaching, personalized nutrition plans, and premium analytics — all in one place.
            </p>
          </div>
          {["Personalized AI health plans", "Real-time fitness coaching", "Advanced progress analytics"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 rounded-full" style={{ background: '#C9A84C' }} />
              <span style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.78rem', fontFamily: "'DM Sans',sans-serif" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col justify-center items-center px-8 py-12" style={{ background: '#0A0A0A' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C97A)' }}>
              <span style={{ fontSize: '0.8rem', color: '#0A0A0A' }}>✦</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: '#EDE8DC', letterSpacing: '0.04em' }}>VitaTrack</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', color: '#EDE8DC', fontWeight: 400, marginBottom: '0.4rem' }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: '#9A9080', fontSize: '0.82rem', fontFamily: "'DM Sans',sans-serif", marginBottom: '2.5rem' }}>
            {isSignUp ? "Begin your premium fitness journey." : "Sign in to continue your journey."}
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ color: '#EF4444', fontSize: '0.8rem', fontFamily: "'DM Sans',sans-serif" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="mb-5">
              <label style={{ display: 'block', color: '#9A9080', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", marginBottom: '0.6rem' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                disabled={loading}
                {...register("email")}
                style={{ width: '100%', background: '#0D0D0D', border: `1px solid ${errors.email ? 'rgba(239,68,68,0.4)' : '#1C1C1C'}`, borderRadius: '0.6rem', padding: '0.75rem 1rem', color: '#EDE8DC', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
                onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.4)' : '#1C1C1C'}
              />
              {errors.email && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: '0.3rem', fontFamily: "'DM Sans',sans-serif" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-7">
              <label style={{ display: 'block', color: '#9A9080', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", marginBottom: '0.6rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={loading}
                  {...register("password")}
                  style={{ width: '100%', background: '#0D0D0D', border: `1px solid ${errors.password ? 'rgba(239,68,68,0.4)' : '#1C1C1C'}`, borderRadius: '0.6rem', padding: '0.75rem 2.8rem 0.75rem 1rem', color: '#EDE8DC', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
                  onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.4)' : '#1C1C1C'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9A9080', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: '0.3rem', fontFamily: "'DM Sans',sans-serif" }}>{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-gold w-full" disabled={loading}
              style={{ width: '100%', padding: '0.85rem', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
              {loading ? "Processing..." : <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="inline w-4 h-4 ml-2" /></>}
            </button>
          </form>

          <div className="luxury-divider"><span style={{ fontSize: '0.9rem' }}>✦</span></div>

          <button className="btn-ghost" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontSize: '0.78rem' }}
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }} disabled={loading}>
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>

          <p style={{ color: '#1A1510', fontSize: '0.68rem', textAlign: 'center', marginTop: '1.5rem', fontFamily: "'DM Sans',sans-serif" }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;