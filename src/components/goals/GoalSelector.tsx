import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";

const goals = [
  {
    id: "stay-fit",
    label: "Maintenance",
    title: "Stay Fit",
    desc: "Maintain your current fitness level with balanced workouts and clean nutrition.",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    stat: "3–4 days/week",
  },
  {
    id: "bulking",
    label: "Mass Building",
    title: "Bulking",
    desc: "Increase muscle mass and strength with progressive overload and caloric surplus.",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
    stat: "5 days/week",
  },
  {
    id: "muscle-gain",
    label: "Lean Gains",
    title: "Muscle Gain",
    desc: "Build lean muscle while minimizing fat gain through precision training.",
    img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
    stat: "4–5 days/week",
  },
  {
    id: "fat-loss",
    label: "Recomposition",
    title: "Fat Loss",
    desc: "Reduce body fat while preserving muscle mass for a lean, powerful physique.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    stat: "5–6 days/week",
  },
];

const GoalSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user?.id || null));
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["userGoal"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_goals").select("goal_type")
        .order("created_at", { ascending: false }).limit(1).single();
      if (error && error.code !== "PGRST116") { toast.error("Failed to fetch your goal"); }
      if (data?.goal_type) setSelected(data.goal_type);
      return data?.goal_type || null;
    },
  });

  const mutation = useMutation({
    mutationFn: async (goalType: string) => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase.from("user_goals").insert({ goal_type: goalType, user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Fitness goal saved!"); navigate("/plan"); },
    onError: () => toast.error("Failed to save goal"),
  });

  return (
    <div className="max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-px h-5" style={{ background: 'linear-gradient(180deg,#C9A84C,transparent)' }} />
          <span style={{ color: '#8A8070', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif" }}>Step 1</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#EDE8DC', fontWeight: 400, lineHeight: 1.1, marginBottom: '0.4rem' }}>
          Choose Your Goal
        </h1>
        <p style={{ color: '#9A9080', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem' }}>
          Select the fitness objective that best aligns with your vision.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #1A1A1A', borderTopColor: '#C9A84C', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {goals.map((g, i) => (
              <div
                key={g.id}
                className={`goal-img-card ${selected === g.id ? 'selected' : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => setSelected(g.id)}
                onMouseEnter={() => setHovered(g.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <img src={g.img} alt={g.title} />

                {/* Check mark */}
                <div className="goal-check">
                  <Check className="w-4 h-4" style={{ color: '#0A0A0A' }} />
                </div>

                <div className="goal-img-overlay">
                  {/* Label pill */}
                  <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-3 self-start"
                    style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.25)' }}>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: '#C9A84C', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif" }}>{g.label}</span>
                  </div>

                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', color: '#EDE8DC', fontWeight: 500, marginBottom: '0.4rem', lineHeight: 1.1 }}>
                    {g.title}
                  </h3>
                  <p style={{ color: 'rgba(237,232,220,0.6)', fontSize: '0.8rem', lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif", marginBottom: '0.75rem' }}>
                    {g.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-px h-3" style={{ background: 'rgba(201,168,76,0.5)' }} />
                    <span style={{ color: '#C9A84C', fontSize: '0.72rem', fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.06em' }}>{g.stat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              className="btn-gold"
              disabled={!selected || mutation.isPending}
              onClick={() => selected && mutation.mutate(selected)}
              style={{ padding: '0.8rem 2.5rem', opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
            >
              {mutation.isPending ? "Saving..." : <>Continue <ArrowRight className="inline w-4 h-4 ml-2" /></>}
            </button>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GoalSelector;