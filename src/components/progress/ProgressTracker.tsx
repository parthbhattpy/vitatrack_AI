import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightTracker from "./WeightTracker";
import ActivityTracker from "./ActivityTracker";
import ProgressMetrics from "./ProgressMetrics";
import { Activity, Scale, TrendingUp, Flame } from "lucide-react";

const BANNER_IMGS = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=900&auto=format&fit=crop",
];

const ProgressTracker = () => {
  const [activeTab, setActiveTab] = useState("weight");

  return (
    <div className="max-w-4xl mx-auto page-enter">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-px h-5" style={{ background: "linear-gradient(180deg,#C9A84C,transparent)" }} />
          <span style={{ color: "#9A9080", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Analytics</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#EDE8DC", fontWeight: 400, lineHeight: 1.1, marginBottom: "0.3rem" }}>
          Track Your Progress
        </h1>
        <p style={{ color: "#AAA090", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem" }}>
          Monitor your health journey with detailed metrics and visual analytics.
        </p>
      </div>

      {/* ── Metrics Banner ── */}
      <div className="relative overflow-hidden rounded-2xl mb-8" style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BANNER_IMGS[0]})`, backgroundSize: "cover", backgroundPosition: "center 20%", filter: "brightness(0.12) saturate(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 100%)" }} />
        {/* Gold top line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)" }} />

        <div className="relative z-10 p-6">
          <ProgressMetrics />
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="weight" value={activeTab} onValueChange={setActiveTab}>
        {/* Tab bar */}
        <div className="flex justify-center mb-6">
          <TabsList className="p-1 rounded-xl" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,0.12)", gap: "4px", height: "auto" }}>
            <TabsTrigger value="weight"
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 transition-all data-[state=active]:shadow-none"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <Scale className="w-3.5 h-3.5" />
              Weight Log
            </TabsTrigger>
            <TabsTrigger value="activity"
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 transition-all data-[state=active]:shadow-none"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <Activity className="w-3.5 h-3.5" />
              Activity Log
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weight">
          <div className="premium-card overflow-hidden">
            {/* Banner */}
            <div className="relative h-28 overflow-hidden">
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BANNER_IMGS[0]})`, backgroundSize: "cover", backgroundPosition: "center 30%", filter: "brightness(0.2) saturate(0.5)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(201,168,76,0.07) 0%, transparent 100%)" }} />
              <div className="absolute inset-0 p-5 flex items-end">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Scale className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                    <span style={{ color: "#C9A84C", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Body Weight</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "#EDE8DC", fontWeight: 400 }}>Weight Progress</h2>
                </div>
              </div>
              {/* Decorative stat */}
              <div className="absolute right-6 bottom-5 text-right">
                <div style={{ color: "#3A3020", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Track</div>
                <div style={{ color: "rgba(201,168,76,0.5)", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem" }}>Daily</div>
              </div>
            </div>
            <div className="p-6">
              <WeightTracker />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="premium-card overflow-hidden">
            <div className="relative h-28 overflow-hidden">
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BANNER_IMGS[1]})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.2) saturate(0.5)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(201,168,76,0.07) 0%, transparent 100%)" }} />
              <div className="absolute inset-0 p-5 flex items-end">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Flame className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                    <span style={{ color: "#C9A84C", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Activity</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "#EDE8DC", fontWeight: 400 }}>Activity Log</h2>
                </div>
              </div>
              <div className="absolute right-6 bottom-5 text-right">
                <div style={{ color: "#3A3020", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Log</div>
                <div style={{ color: "rgba(201,168,76,0.5)", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem" }}>Every Session</div>
              </div>
            </div>
            <div className="p-6">
              <ActivityTracker />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <style>{`
        [role="tablist"] { background: #0D0D0D !important; border: 1px solid rgba(201,168,76,0.12) !important; }
        [role="tab"][data-state="active"] { background: linear-gradient(135deg,#C9A84C,#E8C97A) !important; color: #0A0A0A !important; }
        [role="tab"][data-state="inactive"] { color: #9A9080 !important; }
      `}</style>
    </div>
  );
};

export default ProgressTracker;