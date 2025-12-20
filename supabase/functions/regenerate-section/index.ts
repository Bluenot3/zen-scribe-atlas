import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sectionIndex, section, context, instruction, style } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are ZEN Weekly's section editor. You regenerate individual sections of intelligence artifacts.

Your task is to regenerate a specific section based on the user's instruction while maintaining:
- The ZEN Weekly editorial voice (serious, data-driven, systems-focused)
- Consistency with the surrounding article context
- The section's structural type and purpose

Style: ${style || "zen-editorial"}

IMPORTANT: Return ONLY valid JSON matching the section structure:
{
  "type": "${section.type}",
  "title": "Section title (optional)",
  "content": "Main text content",
  "data": { ...optional structured data for visualizations... }
}

Section types:
- "text": Standard prose with title and content
- "quote": Include data.quote, data.author, data.role
- "data": Include data.chartType ("bar"/"line"/"pie"/"area") and data.points array [{name, value}]
- "timeline": Include data.events array [{year, title, description}]
- "comparison": Include data.items array [{name, pros:[], cons:[]}]
- "callout": Highlighted key information
- "conclusion": Final synthesis`;

    const userPrompt = `ARTICLE CONTEXT:
${context}

CURRENT SECTION (index ${sectionIndex}):
${JSON.stringify(section, null, 2)}

USER INSTRUCTION:
${instruction}

Regenerate this section following the instruction. Return ONLY the JSON for the new section.`;

    console.log("Regenerating section", sectionIndex, "with instruction:", instruction);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the JSON response
    let newSection;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                        content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      newSection = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      newSection = { 
        type: section.type,
        title: section.title,
        content: content 
      };
    }

    console.log("Section regenerated successfully");

    return new Response(
      JSON.stringify({ success: true, section: newSection }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error regenerating section:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to regenerate section" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
