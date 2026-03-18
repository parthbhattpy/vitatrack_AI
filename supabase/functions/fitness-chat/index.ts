import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: profile } = await supabaseClient
      .from("user_profiles")
      .select("age, gender, weight, height")
      .eq("user_id", userId)
      .single();

    const { data: goalData } = await supabaseClient
      .from("user_goals")
      .select("goal_type")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const userContext = profile
      ? `The user's profile: Age ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight}kg, Height: ${profile.height}cm.`
      : "User profile not available.";

    const goalContext = goalData
      ? `Their current fitness goal is: ${goalData.goal_type}.`
      : "Fitness goal not set.";

    const systemPrompt = `You are VitaTrack AI, a friendly and knowledgeable personal fitness coach built into the VitaTrack health app.

${userContext}
${goalContext}

Your role:
- Give personalized fitness and nutrition advice based on their profile and goal
- Answer questions about workouts, diet, recovery, and motivation
- Be encouraging, concise, and practical
- If asked about medical conditions, recommend consulting a doctor
- Keep responses focused on fitness and health
- Use their goal (${goalData?.goal_type || "general fitness"}) to tailor every answer

Always be friendly, supportive, and specific to their data when possible.`;

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) throw new Error("GROQ_API_KEY not set");

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const groqData = await groqRes.json();
    const reply = groqData.choices?.[0]?.message?.content;

    if (!reply) throw new Error("No response from Groq");

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("fitness-chat error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});