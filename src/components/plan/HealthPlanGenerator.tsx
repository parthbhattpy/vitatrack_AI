import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import WorkoutPlan from "./WorkoutPlan";
import DietPlan from "./DietPlan";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HealthPlanData } from "@/types/healthPlan";
import { useNavigate } from "react-router-dom";
import { premadeHealthPlans } from "@/utils/premadeHealthPlans";
import { Dumbbell, Salad, RefreshCw, Sparkles, ArrowRight, Zap, Clock, Target } from "lucide-react";

const PLAN_IMG = "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=900&auto=format&fit=crop";

const HealthPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) { toast.error("Please log in"); navigate("/login"); return; }
        setUserId(session.user.id);
      } catch { toast.error("Failed to authenticate"); navigate("/login"); }
    };
    getUser();
  }, [navigate]);

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from("user_profiles").select("age, gender, height, weight, completed_onboarding").eq("user_id", userId).limit(1).single();
      if (error) return { age: 30, gender: "male", height: 175, weight: 75, completed_onboarding: false };
      return data;
    },
    enabled: !!userId, retry: 1,
  });

  const { data: userGoal, isLoading: isLoadingGoal } = useQuery({
    queryKey: ["userGoal", userId],
    queryFn: async () => {
      if (!userId) return "stay-fit";
      const { data, error } = await supabase.from("user_goals").select("goal_type").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return data?.goal_type || "stay-fit";
    },
    enabled: !!userId, retry: 1,
  });

  const { data: healthPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: ["healthPlan", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from("health_plans").select("plan_data").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      if (data?.plan_data) {
        const planData = typeof data.plan_data === "string" ? JSON.parse(data.plan_data) : data.plan_data;
        if (planData && typeof planData === "object" && "workout" in planData && "diet" in planData) return planData as HealthPlanData;
      }
      return null;
    },
    enabled: !!userId, retry: 1,
  });

  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      setIsGenerating(true);
      try {
        const profile = userProfile || { gender: "male", age: 30, weight: 75 };
        const goal = userGoal || "stay-fit";
        let planKey = `${goal}-${profile.gender}`;
        if (profile.age < 30) planKey += "-young";
        else if (profile.age < 50) planKey += "-middle";
        else planKey += "-senior";
        const plan = premadeHealthPlans[planKey] || premadeHealthPlans[`${goal}-${profile.gender}`] || premadeHealthPlans[goal] || premadeHealthPlans["general"];
        if (!plan) throw new Error("No plan found");
        const { error } = await supabase.from("health_plans").insert({ plan_data: JSON.stringify(plan), user_id: userId });
        if (error) throw error;
        return plan;
      } finally { setIsGenerating(false); }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["healthPlan"] }); toast.success("Your personalized health plan is ready!"); },
    onError: () => toast.error("Failed to generate health plan. Please try again."),
  });

  const goalLabel: Record<string, string> = {
    "stay-fit": "Maintenance", "bulking": "Mass Building", "muscle-gain": "Lean Gains", "fat-loss": "Fat Loss"
  };

  const isLoading = isLoadingProfile || isLoadingGoal || isLoadingPlan;
  const showGenerate = !healthPlan || Object.keys(healthPlan).length === 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24">
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #1A1A1A", borderTopColor: "#C9A84C", animation: "spin 0.8s linear infinite", marginBottom: "1rem" }} />
        <p style={{ color: "#9A9080", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem" }}>Loading your health plan...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto page-enter">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-px h-5" style={{ background: "linear-gradient(180deg,#C9A84C,transparent)" }} />
          <span style={{ color: "#9A9080", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
            {userGoal ? goalLabel[userGoal] || userGoal : "Health Plan"}
          </span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#EDE8DC", fontWeight: 400, lineHeight: 1.1, marginBottom: "0.3rem" }}>
              Your Personalized Health Plan
            </h1>
            <p style={{ color: "#AAA090", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem" }}>
              AI-crafted workout and diet plan based on your goals and profile.
            </p>
          </div>
          {!showGenerate && (
            <button
              onClick={() => generatePlanMutation.mutate()}
              disabled={isGenerating}
              className="flex items-center gap-2 btn-ghost flex-shrink-0"
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.72rem" }}
            >
              <RefreshCw className="w-3.5 h-3.5" style={{ animation: isGenerating ? "spin 1s linear infinite" : "none" }} />
              {isGenerating ? "Regenerating..." : "Regenerate Plan"}
            </button>
          )}
        </div>
      </div>

      {showGenerate ? (
        /* ── Generate Card ── */
        <div className="relative overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(201,168,76,0.15)" }}>
          {/* BG image */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PLAN_IMG})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15) saturate(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(0,0,0,0.8) 100%)" }} />

          <div className="relative z-10 p-10 md:p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-pulse-gold"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <Sparkles className="w-7 h-7" style={{ color: "#C9A84C" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "#EDE8DC", fontWeight: 400, marginBottom: "0.75rem" }}>
              Generate Your Health Plan
            </h2>
            <p style={{ color: "#AAA090", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", lineHeight: 1.8, maxWidth: "28rem", marginBottom: "2.5rem" }}>
              We'll analyze your profile, goals, and body metrics to craft a precision workout and nutrition plan tailored exclusively for you.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {[
                { icon: <Dumbbell className="w-3.5 h-3.5" />, label: "Custom Workout Split" },
                { icon: <Salad className="w-3.5 h-3.5" />, label: "Nutrition Plan" },
                { icon: <Zap className="w-3.5 h-3.5" />, label: "Goal-Optimized" },
                { icon: <Clock className="w-3.5 h-3.5" />, label: "Ready Instantly" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <span style={{ color: "#C9A84C" }}>{p.icon}</span>
                  <span style={{ color: "#AAA090", fontSize: "0.72rem", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.06em" }}>{p.label}</span>
                </div>
              ))}
            </div>

            <button className="btn-gold flex items-center gap-2" onClick={() => generatePlanMutation.mutate()} disabled={isGenerating}
              style={{ padding: "0.85rem 2.5rem" }}>
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4" style={{ animation: "spin 1s linear infinite" }} /> Generating...</>
              ) : (
                <>Generate My Plan <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ── Plan Tabs ── */
        <Tabs defaultValue="workout">
          {/* Custom tab bar */}
          <div className="flex items-center justify-center mb-8">
            <TabsList className="p-1 rounded-xl" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,0.12)", gap: "4px", height: "auto" }}>
              <TabsTrigger value="workout"
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm transition-all data-[state=active]:shadow-none"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <Dumbbell className="w-3.5 h-3.5" />
                Workout Plan
              </TabsTrigger>
              <TabsTrigger value="diet"
                className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm transition-all data-[state=active]:shadow-none"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <Salad className="w-3.5 h-3.5" />
                Diet Plan
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="workout">
            {healthPlan && "workout" in healthPlan && (
              <div className="premium-card overflow-hidden">
                {/* Plan header banner */}
                <div className="relative h-32 overflow-hidden">
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=900&auto=format&fit=crop)", backgroundSize: "cover", backgroundPosition: "center 30%", filter: "brightness(0.25) saturate(0.6)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(201,168,76,0.08) 0%, transparent 100%)" }} />
                  <div className="absolute inset-0 p-6 flex items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Dumbbell className="w-4 h-4" style={{ color: "#C9A84C" }} />
                        <span style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Training</span>
                      </div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", color: "#EDE8DC", fontWeight: 400 }}>Your Workout Plan</h2>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <WorkoutPlan plan={healthPlan.workout} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="diet">
            {healthPlan && "diet" in healthPlan && (
              <div className="premium-card overflow-hidden">
                <div className="relative h-32 overflow-hidden">
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=900&auto=format&fit=crop)", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.25) saturate(0.6)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(201,168,76,0.08) 0%, transparent 100%)" }} />
                  <div className="absolute inset-0 p-6 flex items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Salad className="w-4 h-4" style={{ color: "#C9A84C" }} />
                        <span style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Nutrition</span>
                      </div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", color: "#EDE8DC", fontWeight: 400 }}>Your Diet Plan</h2>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <DietPlan plan={healthPlan.diet} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        [role="tablist"] { background: #0D0D0D !important; border: 1px solid rgba(201,168,76,0.12) !important; }
        [role="tab"][data-state="active"] { background: linear-gradient(135deg,#C9A84C,#E8C97A) !important; color: #0A0A0A !important; }
        [role="tab"][data-state="inactive"] { color: #9A9080 !important; }
      `}</style>
    </div>
  );
};

export default HealthPlanGenerator;